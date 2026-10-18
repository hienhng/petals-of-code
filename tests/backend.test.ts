import {beforeAll,beforeEach,afterAll,describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
const state=vi.hoisted(()=>({db:null as any}));
vi.mock('@neondatabase/serverless',()=>({neon:()=>({query:async(text:string,params:unknown[]=[])=>{const result=await state.db.query(text,params);return result.rows}})}));
import * as cards from '../app/api/cards/route';
import * as admin from '../app/api/admin/route';
import * as session from '../app/api/admin/session/route';
import {signSession,requireOrigin} from '../lib/server';
import {flowers,decorationOptions} from '../lib/card-validation';
const base='https://petals.test';
const valid={flower:'tulip',theme:'meadow',recipient:'Mẹ yêu',message:'Cảm ơn mẹ vì tất cả yêu thương!',sender:'Một học sinh',anonymous:false,shareSender:false};
function request(path:string,method='GET',body?:unknown,cookie?:string){return new Request(base+path,{method,headers:{origin:base,'Content-Type':'application/json',...(cookie?{cookie}: {})},...(body===undefined?{}:{body:JSON.stringify(body)})})}
async function make(value={...valid}){const r=await cards.POST(request('/api/cards','POST',value));expect(r.status).toBe(201);return r.json()}
const auth=()=>`petals_admin=${signSession(Date.now()+3000000)}`;
beforeAll(async()=>{state.db=new PGlite();await state.db.exec(readFileSync(new URL('../database/schema.sql',import.meta.url),'utf8'));process.env.DATABASE_URL='postgres://test';process.env.ADMIN_PASSWORD='test-only-password-12345';process.env.ADMIN_SESSION_SECRET='test-only-secret-abcdefghijklmnopqrstuvwxyz'},30000);
beforeEach(async()=>{await state.db.exec('TRUNCATE cards,rate_limits');process.env.CARD_RATE_LIMIT='20'});
afterAll(async()=>{await state.db.close()});
describe('saved cards and privacy',()=>{
 it('requires a chosen garden position and preserves it through approval and shared garden reads',async()=>{
  const c=await make();
  for(const position of [{},{gardenX:0,gardenY:50},{gardenX:50,gardenY:95},{gardenX:'50',gardenY:50},{gardenX:50,gardenY:null}]){
   expect((await cards.PATCH(request('/api/cards','PATCH',{id:c.card.id,editToken:c.editToken,shareSender:false,...position}))).status).toBe(400);
  }
  expect((await (await cards.GET(request('/api/cards'))).json()).cards).toEqual([]);
  const chosen={gardenX:37.4,gardenY:82.1};
  expect((await cards.PATCH(request('/api/cards','PATCH',{id:c.card.id,editToken:c.editToken,shareSender:false,...chosen}))).status).toBe(200);
  expect((await (await cards.GET(request('/api/cards'))).json()).cards).toEqual([]);
  const placement=await (await cards.GET(request('/api/cards?placement=1'))).json();
  expect(placement.cards).toHaveLength(1);
  expect(placement.cards[0]).toMatchObject({...chosen,id:c.card.id,flower:valid.flower,decorations:[],status:'pending'});
  expect(placement.cards[0]).not.toHaveProperty('message');
  await admin.POST(request('/api/admin','POST',{id:c.card.id,status:'approved'},auth()));
  const garden=await (await cards.GET(request('/api/cards'))).json();
  expect(garden.cards[0]).toMatchObject({...chosen,id:c.card.id});
  expect((await (await cards.GET(request('/api/cards?placement=1'))).json()).cards[0].status).toBe('approved');
  expect((await cards.PATCH(request('/api/cards','PATCH',{id:c.card.id,editToken:c.editToken,shareSender:false,gardenX:60,gardenY:60}))).status).toBe(403);
  expect((await (await cards.GET(request('/api/cards'))).json()).cards[0]).toMatchObject(chosen);
 });
 it('persists every decoration, including bees, cranes, and music, on shared cards',async()=>{
  for(const decoration of decorationOptions){
   const response=await cards.POST(request('/api/cards','POST',{...valid,decorations:[decoration]}));
   expect(response.status).toBe(201);
   const created=await response.json();
   const shared=await (await cards.GET(request(`/api/cards?id=${created.card.id}`))).json();
   expect(shared.card.decorations).toEqual([decoration]);
  }
 });
 it('persists every flower and carries combined decorations through moderation and shared links',async()=>{
  for(const flower of flowers){
   const r=await cards.POST(request('/api/cards','POST',{...valid,flower,decorations:['ribbon','butterflies','sparkles']}));
   expect(r.status).toBe(201);const c=await r.json();
   const read=await (await cards.GET(request(`/api/cards?id=${c.card.id}`))).json();
   expect(read.card.flower).toBe(flower);expect(read.card.decorations).toEqual(['ribbon','butterflies','sparkles']);
   await cards.PATCH(request('/api/cards','PATCH',{id:c.card.id,editToken:c.editToken,shareSender:false,gardenX:42.5,gardenY:66}));
   await admin.POST(request('/api/admin','POST',{id:c.card.id,status:'approved'},auth()));
  }
  const garden=await (await cards.GET(request('/api/cards'))).json();
  expect(garden.cards).toHaveLength(flowers.length);
  for(const card of garden.cards)expect(card.decorations).toEqual(['ribbon','butterflies','sparkles']);
 });
 it('rejects unknown, duplicate, malformed, and excessive decorations and defaults old clients to none',async()=>{
  for(const decorations of [['unknown'],['hearts','hearts'],['hearts',null],decorationOptions.slice(0,4),'hearts',null]){
   expect((await cards.POST(request('/api/cards','POST',{...valid,decorations}))).status).toBe(400);
  }
  const c=await make();expect(c.card.decorations).toEqual([]);
  expect((await (await cards.GET(request(`/api/cards?id=${c.card.id}`))).json()).card.decorations).toEqual([]);
 });
 it('uses the actual request Host when Next normalizes its internal URL',()=>{expect(()=>requireOrigin(new Request('http://localhost:3000/api/cards',{headers:{host:'127.0.0.1:3000',origin:'http://127.0.0.1:3000'}}))).not.toThrow();expect(()=>requireOrigin(new Request('http://localhost:3000/api/cards',{headers:{host:'127.0.0.1:3000',origin:'https://evil.test'}}))).toThrow()});
 it('persists a Unicode card and reads it in a separate request without exposing edit credentials',async()=>{const created=await make();const r=await cards.GET(request(`/api/cards?id=${created.card.id}`));const body=await r.json();expect(body.card.message).toBe(valid.message);expect(body.card).not.toHaveProperty('edit_hash');expect(body).not.toHaveProperty('editToken');expect((await (await cards.GET(request('/api/cards'))).json()).cards).toEqual([])});
 it('rejects invalid fields, forged origins, null bodies and too-large requests',async()=>{for(const v of [null,{...valid,message:'x'},{...valid,flower:'unknown'},{...valid,recipient:' '},{...valid,message:'a'.repeat(501)}])expect((await cards.POST(request('/api/cards','POST',v))).status).toBe(400);expect((await cards.POST(new Request(base+'/api/cards',{method:'POST',headers:{origin:'https://evil.test','Content-Type':'application/json'},body:JSON.stringify(valid)}))).status).toBe(403);expect((await cards.POST(request('/api/cards','POST',{...valid,message:'a'.repeat(11000)}))).status).toBe(413)});
 it('removes sender data for anonymous cards',async()=>{const created=await make({...valid,anonymous:true});const body=await (await cards.GET(request(`/api/cards?id=${created.card.id}`))).json();expect(body.card.sender).toBe('');expect(body.card.anonymous).toBe(true)});
 it('requires edit token and approval, and hides nickname even via the public card ID',async()=>{const c=await make();expect((await cards.PATCH(request('/api/cards','PATCH',{id:c.card.id,editToken:'x'.repeat(64),shareSender:false,gardenX:42.5,gardenY:66}))).status).toBe(403);expect((await cards.PATCH(request('/api/cards','PATCH',{id:c.card.id,editToken:c.editToken,shareSender:false,gardenX:42.5,gardenY:66}))).status).toBe(200);expect((await (await cards.GET(request('/api/cards'))).json()).cards).toEqual([]);expect((await admin.GET(request('/api/admin'))).status).toBe(401);expect((await admin.POST(request('/api/admin','POST',{id:c.card.id,status:'approved'}))).status).toBe(401);expect((await admin.POST(request('/api/admin','POST',{id:c.card.id,status:'approved'},auth()))).status).toBe(200);const garden=await (await cards.GET(request('/api/cards'))).json();expect(garden.cards).toHaveLength(1);expect(garden.cards[0].sender).toBe('');expect((await (await cards.GET(request(`/api/cards?id=${c.card.id}`))).json()).card.sender).toBe('');expect((await admin.POST(request('/api/admin','POST',{id:c.card.id,status:'rejected'},auth()))).status).toBe(200);expect((await (await cards.GET(request('/api/cards'))).json()).cards).toHaveLength(0);expect((await cards.GET(request(`/api/cards?id=${c.card.id}`))).status).toBe(200)});
 it('enforces atomic rate limits and preserves explicit sender sharing',async()=>{process.env.CARD_RATE_LIMIT='1';const c=await make();expect((await cards.POST(request('/api/cards','POST',valid))).status).toBe(429);await cards.PATCH(request('/api/cards','PATCH',{id:c.card.id,editToken:c.editToken,shareSender:true,gardenX:42.5,gardenY:66}));await admin.POST(request('/api/admin','POST',{id:c.card.id,status:'approved'},auth()));expect((await (await cards.GET(request('/api/cards'))).json()).cards[0].sender).toBe(valid.sender)});
 it('shows honest configuration errors without a database',async()=>{const old=process.env.DATABASE_URL;delete process.env.DATABASE_URL;const r=await cards.POST(request('/api/cards','POST',valid));expect(r.status).toBe(503);expect((await r.json()).error).toContain('Neon');process.env.DATABASE_URL=old});
});
describe('existing Neon database migration',()=>{
 it('preserves an existing greeting and enables new flowers and decorations without replaying the base schema',async()=>{
  const old=new PGlite();
  try{
   await old.exec(readFileSync(new URL('./fixtures/schema-v1.sql',import.meta.url),'utf8'));
   await old.query("INSERT INTO cards(id,flower,theme,recipient,message,sender,anonymous,edit_hash) VALUES($1,'rose','meadow','Mẹ','Lời chúc trước khi nâng cấp','Con',FALSE,$2)",['00000000-0000-4000-8000-000000000001','a'.repeat(64)]);
   const migration=readFileSync(new URL('../database/migrations/001_flower_decorations.sql',import.meta.url),'utf8');
   await old.exec(migration);await old.exec(migration);
   const preserved=await old.query('SELECT flower,message,decorations FROM cards');
   expect(preserved.rows).toEqual([{flower:'rose',message:'Lời chúc trước khi nâng cấp',decorations:[]}]);
   await old.query("UPDATE cards SET flower='lotus',decorations=$1",[['petals','fireflies']]);
   const updated=await old.query('SELECT flower,decorations FROM cards');
   expect(updated.rows).toEqual([{flower:'lotus',decorations:['petals','fireflies']}]);
   await expect(old.query("UPDATE cards SET decorations=$1",[['unknown']])).rejects.toThrow();
   const moreDecorations=readFileSync(new URL('../database/migrations/002_more_decorations.sql',import.meta.url),'utf8');
   await old.exec(moreDecorations);await old.exec(moreDecorations);
   expect((await old.query('SELECT flower,decorations FROM cards')).rows).toEqual([{flower:'lotus',decorations:['petals','fireflies']}]);
   await old.query('UPDATE cards SET decorations=$1',[['bees','cranes','music']]);
   expect((await old.query('SELECT decorations FROM cards')).rows).toEqual([{decorations:['bees','cranes','music']}]);
   await expect(old.query('UPDATE cards SET decorations=$1',[['unknown']])).rejects.toThrow();
   await expect(old.query('UPDATE cards SET decorations=$1',[['bees','cranes','music','petals']])).rejects.toThrow();
   const positions=readFileSync(new URL('../database/migrations/003_garden_positions.sql',import.meta.url),'utf8');
   await old.exec(positions);await old.exec(positions);
   expect((await old.query('SELECT garden_x,garden_y FROM cards')).rows).toEqual([{garden_x:null,garden_y:null}]);
   await old.query('UPDATE cards SET garden_x=37.4,garden_y=82.1');
   await old.exec(positions);
   expect((await old.query('SELECT garden_x,garden_y FROM cards')).rows).toEqual([{garden_x:37.4,garden_y:82.1}]);
   await expect(old.query('UPDATE cards SET garden_y=100')).rejects.toThrow();
   await expect(old.query('UPDATE cards SET garden_x=NULL')).rejects.toThrow();
   const moreFlowers=readFileSync(new URL('../database/migrations/004_more_flower_types.sql',import.meta.url),'utf8');
   await old.exec(moreFlowers);await old.exec(moreFlowers);
   await old.query("UPDATE cards SET flower='iris'");
   expect((await old.query('SELECT flower,message FROM cards')).rows).toEqual([{flower:'iris',message:'Lời chúc trước khi nâng cấp'}]);
   await expect(old.query("UPDATE cards SET flower='unknown'")).rejects.toThrow();
  }finally{await old.close()}
 });
});
describe('moderator session',()=>{
 it('rejects wrong passwords and forged cookies, issues HttpOnly cookie and logs out',async()=>{expect((await session.POST(request('/api/admin/session','POST',{password:'wrong'}))).status).toBe(401);const r=await session.POST(request('/api/admin/session','POST',{password:process.env.ADMIN_PASSWORD}));expect(r.status).toBe(200);expect(r.headers.get('set-cookie')).toContain('HttpOnly; SameSite=Strict; Path=/api/admin');expect((await admin.GET(request('/api/admin','GET',undefined,'petals_admin=123.forged'))).status).toBe(401);expect((await admin.GET(request('/api/admin','GET',undefined,auth()))).status).toBe(200);expect((await session.DELETE(request('/api/admin/session','DELETE'))).headers.get('set-cookie')).toContain('Max-Age=0')});
 it('blocks repeated login attempts and denies admin when unconfigured',async()=>{for(let i=0;i<5;i++)expect((await session.POST(request('/api/admin/session','POST',{password:'wrong'}))).status).toBe(401);expect((await session.POST(request('/api/admin/session','POST',{password:'wrong'}))).status).toBe(429);const old=process.env.ADMIN_SESSION_SECRET;delete process.env.ADMIN_SESSION_SECRET;expect((await admin.GET(request('/api/admin'))).status).toBe(503);process.env.ADMIN_SESSION_SECRET=old});
});
