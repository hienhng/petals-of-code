import {randomBytes,randomUUID} from 'node:crypto';
import {validateCard} from '../../../lib/card-validation';
import {validGardenPosition} from '../../../lib/garden-position';
import {ApiError,database,failure,isUuid,json,pageOffset,rateLimit,readBody,requireOrigin,sha} from '../../../lib/server';
export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(req:Request){try{
 const sql=database(),id=new URL(req.url).searchParams.get('id');
 if(id){
  if(!isUuid(id))throw new ApiError('Không tìm thấy thiệp.',404);
  const rows=await sql.query(`SELECT id,flower,theme,decorations,recipient,message,
    CASE WHEN public_opt_in AND NOT share_sender THEN '' ELSE sender END AS sender,
    anonymous,share_sender AS "shareSender" FROM cards WHERE id=$1`,[id]);
  if(!rows.length)throw new ApiError('Không tìm thấy thiệp.',404);
  return json({card:rows[0]});
 }
 if(new URL(req.url).searchParams.has('placement')){
  const rows=await sql.query(`SELECT id,flower,decorations,status,garden_x AS "gardenX",garden_y AS "gardenY"
   FROM cards WHERE status IN ('pending','approved') AND public_opt_in
   ORDER BY created_at DESC,id DESC`);
  return json({cards:rows});
 }
 const rows=await sql.query(`SELECT id,flower,theme,decorations,recipient,message,
   CASE WHEN share_sender AND NOT anonymous THEN sender ELSE '' END AS sender,
   anonymous,share_sender AS "shareSender",garden_x AS "gardenX",garden_y AS "gardenY" FROM cards WHERE status='approved' AND public_opt_in
   ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET $1`,[pageOffset(req)]);
 return json({cards:rows.slice(0,24),hasMore:rows.length>24});
}catch(e){return failure(e)}}

export async function POST(req:Request){try{
 requireOrigin(req);
 const card=validateCard(await readBody(req));
 if(!card)throw new ApiError('Vui lòng kiểm tra tên và lời chúc (5–500 ký tự).');
 const configuredLimit=Number(process.env.CARD_RATE_LIMIT||20);
 await rateLimit(req,'card',Number.isFinite(configuredLimit)?Math.max(1,Math.min(1000,configuredLimit)):20,3600000);
 const id=randomUUID(),editToken=randomBytes(32).toString('hex'),sql=database();
 await sql.query(`INSERT INTO cards(id,flower,theme,recipient,message,sender,anonymous,share_sender,edit_hash,decorations)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::text[])`,[id,card.flower,card.theme,card.recipient,card.message,card.sender,card.anonymous,false,sha(editToken),card.decorations||[]]);
 return json({card:{...card,id},editToken},201);
}catch(e){return failure(e)}}

export async function PATCH(req:Request){try{
 requireOrigin(req);const v=await readBody(req,1000) as {id?:unknown;editToken?:unknown;shareSender?:unknown;gardenX?:unknown;gardenY?:unknown};
 if(!v||!isUuid(v.id)||typeof v.editToken!=='string'||v.editToken.length!==64||typeof v.shareSender!=='boolean')throw new ApiError('Yêu cầu không hợp lệ.');
 if(!validGardenPosition(v.gardenX,v.gardenY))throw new ApiError('Hãy chọn một vị trí trong khu vườn trước khi trồng hoa.');
 const sql=database(),rows=await sql.query(`UPDATE cards SET public_opt_in=TRUE,status='pending',
   share_sender=CASE WHEN anonymous THEN FALSE ELSE $1 END,garden_x=$4,garden_y=$5
   WHERE id=$2 AND edit_hash=$3 AND status='private' RETURNING id`,[v.shareSender,v.id,sha(v.editToken),v.gardenX,v.gardenY]);
 if(!rows.length)throw new ApiError('Thiệp đã được gửi hoặc bạn không có quyền chỉnh sửa.',403);
 return json({ok:true});
}catch(e){return failure(e)}}
