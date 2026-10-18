'use client';
import {useEffect,useRef,useState} from 'react';
import {createLetterQR} from '../lib/letter-qr';
import {Flower} from './pixel-art';
import {MeadowGrassTexture} from './garden-scene';
import {Homepage} from './homepage';
import {MusicPlayer} from './music-player';
import {CardArtwork} from './card-art';
import {GardenLife} from './garden-life';
import {LetterScenery} from './letter-scenery';
import {MakerPanel,makerSteps,makerStepDescriptions} from './maker-panel';
import {GardenPlacement} from './garden-placement';
import {gardenPosition,type GardenPosition} from '../lib/garden-position';
import {type Decoration,type Card} from '../lib/card-validation';
const blank:Card={flower:'tulip',theme:'meadow',recipient:'',message:'',sender:'',anonymous:false,shareSender:false,decorations:[]};
function CardPreview({card,id}:{card:Card;id?:string}){
 return <article id={id} className={`greeting illustrated-letter theme-${card.theme}`}>
  <LetterScenery theme={card.theme}/>
  <div className="letter-paper">
  <div className="card-stars">✧ · ✦ · ✧</div>
  <span className="eyebrow">MỘT BÔNG HOA DÀNH RIÊNG CHO</span>
  <h2>{card.recipient||'Người bạn yêu thương'}</h2>
  <CardArtwork key={card.flower+'-'+(card.decorations||[]).join(',')} flower={card.flower} decorations={card.decorations}/>
  <p className="message">{card.message||'Viết một chút yêu thương, để một bông hoa nở rộ…'}</p>
  <p className="signature">Với tất cả yêu thương,<br/><strong>{card.anonymous?'Một người thương bạn':card.sender||(card.id?'Một người thương bạn':'Tên của bạn')}</strong></p>
  <div className="card-bottom">PETALS OF CODE <span>20.10.2026</span></div>
  </div>
 </article>;
}
export default function Petals(){
 const[view,setView]=useState('home'),[step,setStep]=useState(1),[card,setCard]=useState<Card>(blank),[saved,setSaved]=useState<Card|null>(null),[token,setToken]=useState(''),[busy,setBusy]=useState(false),[bloom,setBloom]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[sound,setSound]=useState(false),[submitted,setSubmitted]=useState(false),[gardenDecision,setGardenDecision]=useState(false),[consent,setConsent]=useState(true),[shareSender,setShareSender]=useState(true),[garden,setGarden]=useState<Card[]>([]),[gardenPage,setGardenPage]=useState(-1),[gardenHasMore,setGardenHasMore]=useState(false),[loading,setLoading]=useState(false),[selected,setSelected]=useState<Card|null>(null),[qr,setQr]=useState(''),[png,setPng]=useState('');
 const gardenFetchedPage=useRef<number|null>(null);
 const[plantPosition,setPlantPosition]=useState<GardenPosition|null>(null),[plantOverlaps,setPlantOverlaps]=useState<boolean|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),preview=useRef<HTMLDivElement>(null),resultHeading=useRef<HTMLHeadingElement>(null),audio=useRef<AudioContext|null>(null);
 function toggleSound(){if(sound){setSound(false);return}try{audio.current??=new AudioContext();void audio.current.resume().catch(()=>setSound(false));setSound(true)}catch{setSound(false)}}
 function ping(){if(!sound)return;try{audio.current??=new AudioContext();const a=audio.current,o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(660,a.currentTime);o.frequency.exponentialRampToValueAtTime(880,a.currentTime+.12);g.gain.setValueAtTime(.035,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.2)}catch{}}
 async function requestLeave(action:()=>void){
  if(view!=='maker'||!saved||submitted||gardenDecision){action();return}
  if(window.confirm('Bông hoa chưa được gửi vào vườn. Thiệp sẽ vẫn được lưu riêng tư và không hiển thị công khai. Bạn có chắc muốn rời trang không?'))action();
 }
 function clearMakerDraft(){
  setCard(blank);setSaved(null);setToken('');setStep(1);setSubmitted(false);setGardenDecision(false);setConsent(true);setShareSender(true);
  setPlantPosition(null);setPlantOverlaps(null);setQr('');setPng('');setBloom(false);
 }
 function navigate(v:string){if(view==='maker'&&v!=='maker')clearMakerDraft();if(v==='garden')setGardenPage(-1);if(location.search)history.replaceState(null,'','/');ping();setView(v);setError('');setNotice('');window.scrollTo({top:0,behavior:'instant'});}
 function go(v:string){void requestLeave(()=>navigate(v))}
 function showEvent(){ping();if(view!=='home'){void requestLeave(()=>{navigate('home');window.setTimeout(()=>document.getElementById('event')?.scrollIntoView({behavior:'smooth',block:'start'}),0)});return}document.getElementById('event')?.scrollIntoView({behavior:'smooth',block:'start'});}
 function create(){void requestLeave(()=>{clearMakerDraft();navigate('maker')})}
 useEffect(()=>{const id=new URLSearchParams(location.search).get('card');if(id){setView('received');setLoading(true);fetch(`/api/cards?id=${encodeURIComponent(id)}`).then(async r=>{const d=await r.json() as {error:string;card:Card;cards:Card[];hasMore:boolean;editToken:string};if(!r.ok)throw Error(d.error);setSaved(d.card)}).catch(e=>setError(e.message)).finally(()=>setLoading(false))}},[]);
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),4500);return()=>clearTimeout(t)},[notice]);
 useEffect(()=>{if(selected)dialog.current?.showModal();else dialog.current?.close()},[selected]);
 useEffect(()=>{
  if(view!=='maker'||!saved||submitted||gardenDecision)return;
  const warnBeforeUnload=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
  window.addEventListener('beforeunload',warnBeforeUnload);
  return()=>window.removeEventListener('beforeunload',warnBeforeUnload);
 },[view,saved,submitted,gardenDecision]);
 useEffect(()=>{if(step>=5&&!bloom)resultHeading.current?.focus({preventScroll:true})},[step,bloom]);
 useEffect(()=>{if(view!=='garden'||gardenFetchedPage.current===gardenPage)return;const controller=new AbortController();setLoading(true);setError('');const query=gardenPage<0?'active=1':`offset=${gardenPage*10}`;fetch(`/api/cards?${query}`,{signal:controller.signal}).then(async r=>{const d=await r.json() as {error:string;cards:Card[];hasMore:boolean;page:number};if(!r.ok)throw Error(d.error);gardenFetchedPage.current=d.page;setGarden(d.cards);setGardenHasMore(d.hasMore);setGardenPage(d.page)}).catch(e=>{if(!controller.signal.aborted)setError((e as Error).message)}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return()=>controller.abort()},[view,gardenPage]);
 const update=(key:keyof Card,value:string|boolean|Decoration[])=>setCard(c=>({...c,[key]:value}));
 function changeStep(nextStep:number){setError('');setStep(nextStep);window.scrollTo({top:0,behavior:'instant'});}
 async function makeBloom(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/cards',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(card)}),d=await r.json() as {error:string;card:Card;cards:Card[];hasMore:boolean;editToken:string};if(!r.ok)throw Error(d.error||'Không thể lưu thiệp. Vui lòng thử lại.');setSaved(d.card);setToken(d.editToken);changeStep(5);ping()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 function finishGarden(){setGardenDecision(true);setBloom(true);changeStep(6);ping();setTimeout(()=>setBloom(false),matchMedia('(prefers-reduced-motion: reduce)').matches?0:2400)}
 const shareUrl=()=>`${location.origin}/?card=${saved?.id}`;
 async function copy(){try{await navigator.clipboard.writeText(shareUrl());setNotice('Đã sao chép đường dẫn. Gửi một chút yêu thương nhé!')}catch{setNotice('Hãy sao chép đường dẫn trong ô bên dưới.')}}
 function download(url:string,name:string){const a=document.createElement('a');a.href=url;a.download=name;a.click()}
 async function getQR(){if(!saved)return;try{const canvas=await createLetterQR(saved,shareUrl()),url=canvas.toDataURL('image/png');setQr(url);download(url,'petals-of-code-qr.png')}catch{setError('Chưa tạo được mã QR. Vui lòng thử lại.')}}
 async function exportPNG(){
  if(!saved||!preview.current)return;
  setBusy(true);try{
   const {createLetterPNG}=await import('../lib/export-letter');
   const pngUrl=await createLetterPNG(saved,preview.current,shareUrl());
   setPng(pngUrl);download(pngUrl,'petals-of-code.png');setNotice('Thiệp đã sẵn sàng trong tệp tải xuống.');
  }catch{setError('Không thể tải ảnh. Vui lòng thử lại.')}finally{setBusy(false)}
 }
 async function plant(){if(!consent||!saved||!plantPosition)return;if(plantOverlaps!==false){setError(plantOverlaps?'Hãy chọn vị trí không chạm vào những bông hoa khác trước khi trồng.':'Đang kiểm tra vị trí hoa. Vui lòng thử lại sau.');return}setBusy(true);setError('');try{const r=await fetch('/api/cards',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:saved.id,editToken:token,shareSender,gardenX:plantPosition.x,gardenY:plantPosition.y})}),d=await r.json() as {error:string;card:Card;cards:Card[];hasMore:boolean;editToken:string};if(!r.ok)throw Error(d.error);setSubmitted(true);setNotice('Đã gửi bông hoa đến LTPC để duyệt.')}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <><MusicPlayer/>{view!=='home'&&<header className="site-header"><button className="brand" onClick={()=>go('home')} aria-label="Petals of Code — Trang chủ"><Flower/><span>petals of code<small>một lời chúc, một bông hoa</small></span></button><nav aria-label="Điều hướng chính">{[['home','Trang chủ'],['maker','Tạo thiệp'],['garden','Vườn lời chúc']].map(([v,label])=><button key={v} aria-current={view===v?'page':undefined} onClick={()=>v==='maker'?create():go(v)}>{label}</button>)}<button onClick={showEvent}>Về sự kiện</button></nav><button className="sound" onClick={toggleSound} aria-pressed={sound} aria-label={sound?'Tắt hiệu ứng âm thanh':'Bật hiệu ứng âm thanh'}><span>{sound?'♪':'♫'}</span><span className="sound-label">Hiệu ứng {sound?'bật':'tắt'}</span></button></header>}
 {view==='home'?<Homepage onCreate={create} onGarden={()=>go('garden')} onButterfly={()=>setNotice('Bạn không cần hoàn hảo để làm thế giới này đẹp hơn. ♡')}/>:view==='maker'?<main className="maker page-wrap">
  <div className="section-heading"><span className="eyebrow">GIEO MỘT CHÚT YÊU THƯƠNG</span><h1>{step===6?'Lời chúc của bạn đã nở hoa!':step===5?'Góp một bông hoa cho khu vườn.':'Một bông hoa, một tấm lòng.'}</h1><p>{step===6?'Một món quà nhỏ, mang theo những điều thật đẹp.':step===5?'Bạn có thể chia sẻ lời chúc công khai hoặc giữ thiệp riêng tư.':'Cùng tạo một tấm thiệp dành riêng cho người bạn yêu quý.'}</p></div>
  <ol className="progress" aria-label="Các bước tạo thiệp">{makerSteps.map((s,i)=><li key={s} className={step===i+1?'active':step>i+1?'done':''} aria-current={step===i+1?'step':undefined}><button type="button" disabled={busy||bloom||i+1>=step||Boolean(saved&&i<4)} onClick={()=>changeStep(i+1)} aria-label={'Bước '+(i+1)+': '+s}><span aria-hidden="true">{step>i+1?'✓':i+1}</span><span>{s}<small>{makerStepDescriptions[i]}</small></span></button></li>)}</ol>
  {step<5?<div className="maker-columns"><MakerPanel step={step} card={card} busy={busy} onStep={changeStep} onChange={update} onSubmit={makeBloom} onSelect={ping}/><aside id="maker-preview" className="preview-column" aria-label="Thiệp của bạn"><CardPreview card={card}/><p>Một chút thay đổi, một tấm thiệp của riêng bạn.</p><a className="maker-editor-jump" href="#maker-panel-title">↑ Quay lại chỉnh sửa</a></aside></div>
  :bloom?<div className="bloom-stage" role="status"><div className="seed"/><Flower type={card.flower}/><h2>Một lời chúc đang nở hoa…</h2></div>
  :saved&&<div className="result-columns"><div ref={preview}><CardPreview card={saved}/></div>
   {step===5?<section className="panel garden-step" aria-labelledby="garden-step-title">
    <div className="panel-label">05 / TRỒNG HOA VÀO VƯỜN</div>
    <h2 id="garden-step-title" ref={resultHeading} tabIndex={-1}>Góp một bông hoa cho khu vườn?</h2>
    {submitted?<><p className="success" role="status">✓ Bông hoa đang chờ LTPC duyệt. Cảm ơn bạn!</p><div className="form-actions"><button type="button" className="pixel-button primary" onClick={finishGarden}>Tiếp tục gửi thiệp →</button></div></>:<>
     <p>Lời chúc và tên người nhận sẽ hiển thị công khai sau khi được LTPC duyệt.</p>
     <label className="checkbox"><input type="checkbox" disabled={busy} checked={consent} onChange={e=>setConsent(e.target.checked)}/>Mình đồng ý chia sẻ thiệp trong vườn</label>
     {!saved.anonymous&&<label className="checkbox"><input type="checkbox" disabled={busy} checked={shareSender} onChange={e=>setShareSender(e.target.checked)}/>Hiển thị cả biệt danh của mình</label>}
     {consent&&<GardenPlacement card={saved} value={plantPosition} onChange={setPlantPosition} onOverlapChange={setPlantOverlaps}/>}
     <div className="form-actions"><button type="button" className="pixel-button primary" disabled={!consent||!plantPosition||plantOverlaps!==false||busy} onClick={plant}>{busy?'Đang gửi bông hoa…':'Trồng hoa vào vườn ✿'}</button><button type="button" className="text-link" disabled={busy} onClick={finishGarden}>Bỏ qua, giữ thiệp riêng tư →</button></div>
     <p className="privacy-note">Nếu bỏ qua, chỉ người có đường dẫn mới đọc được thiệp của bạn.</p>
    </>}
   </section>:<section className="panel" aria-labelledby="send-step-title">
    <div className="panel-label">06 / GỬI ĐI MỘT NIỀM VUI</div><h2 id="send-step-title" ref={resultHeading} tabIndex={-1}>Mang bông hoa đến người thương.</h2><p>Gửi đường dẫn, chia sẻ mã QR, hoặc lưu lại tấm thiệp của bạn.</p>
    <div className="share-actions"><button className="pixel-button primary" onClick={copy}>Sao chép đường dẫn ↗</button><button className="pixel-button secondary" onClick={getQR}>Tải mã QR</button><button className="pixel-button secondary" disabled={busy} onClick={exportPNG}>Tải thiệp PNG ↓</button></div><label className="share-url">Đường dẫn thiệp<input readOnly value={shareUrl()} onFocus={e=>e.target.select()}/></label>
    {qr&&<a href={qr} download="petals-of-code-qr.png" className="export-preview"><img className="qr" src={qr} alt="Mã QR mở tấm thiệp"/><span>Lưu ảnh QR ↓</span></a>}{png&&<a href={png} download="petals-of-code.png" className="export-preview"><img src={png} alt="Ảnh thiệp đã xuất"/><span>Lưu ảnh thiệp ↓</span></a>}
    <div className="form-actions"><button type="button" className="text-link" disabled={busy} onClick={()=>changeStep(5)}>← Quay lại khu vườn</button><button className="text-link" disabled={busy} onClick={create}>+ Tạo thêm một tấm thiệp</button></div>
   </section>}
  </div>}
 </main>:view==='garden'?<main className="community page-wrap">
  <div className="community-field">
   <div className="section-heading"><span className="eyebrow">MỖI BÔNG HOA LÀ MỘT CÂU CHUYỆN</span><h1>Vườn lời chúc</h1><p>Mỗi bông hoa có một góc riêng. Chạm để mở ra một chút yêu thương.</p></div>
   <MeadowGrassTexture/><GardenLife flowerCount={garden.length} soundContext={sound?audio.current:null}/>
   <div className="flower-field">{garden.map(c=>{const spot=gardenPosition(c);return <button className="garden-flower" key={c.id} style={{left:`${spot.x}%`,top:`${spot.y}%`,zIndex:Math.round(spot.y)}} onClick={()=>setSelected(c)} aria-label={`Đọc lời chúc gửi ${c.recipient}`}><CardArtwork flower={c.flower} decorations={c.decorations} small/><span>Gửi {c.recipient}</span></button>})}</div>
   {!garden.length&&!loading&&!error&&<div className="empty-garden"><Flower type="tulip"/><h2>{gardenPage>0?'Trang mới đã sẵn sàng cho những bông hoa tiếp theo.':'Khu vườn đang đợi bông hoa đầu tiên.'}</h2><p>{gardenPage>0?'Những lời chúc được LTPC duyệt sẽ bắt đầu nở hoa tại trang này.':'Những lời chúc được LTPC duyệt sẽ nở hoa tại đây.'}</p><button className="pixel-button primary" onClick={create}>Gieo lời chúc của bạn →</button></div>}
   {loading&&<p className="loading" role="status">Đang dạo vào khu vườn…</p>}
   {(gardenPage>0||gardenHasMore)&&<nav className="garden-pagination" aria-label="Các trang khu vườn"><button className="garden-page-previous" aria-label="Trang trước" disabled={gardenPage<=0||loading} onClick={()=>setGardenPage(page=>Math.max(0,page-1))}><span aria-hidden="true">‹</span></button><span className="garden-page-number" aria-live="polite">Trang {Math.max(0,gardenPage)+1}</span><button className="garden-page-next" aria-label="Trang tiếp theo" disabled={!gardenHasMore||loading} onClick={()=>setGardenPage(page=>page+1)}><span aria-hidden="true">›</span></button></nav>}
  </div>
  <p className="privacy-note">Chỉ hiển thị lời chúc đã được duyệt và có sự đồng ý của người gửi.</p>
 </main>:<main className="received page-wrap"><div className="section-heading"><span className="eyebrow">CÓ MỘT CHÚT YÊU THƯƠNG DÀNH CHO BẠN</span><h1>Một bông hoa, từ một tấm lòng.</h1></div>{loading?<p role="status">Đang mở tấm thiệp…</p>:saved&&<><div ref={preview}><CardPreview card={saved}/></div><button className="pixel-button secondary" disabled={busy} onClick={exportPNG}>Lưu tấm thiệp PNG ↓</button>{png&&<a href={png} download="petals-of-code.png" className="export-preview"><img src={png} alt="Ảnh thiệp đã xuất"/><span>Lưu ảnh thiệp ↓</span></a>}<button className="text-link" onClick={create}>Gửi lại một bông hoa →</button></>}</main>}
 {error&&<div className="error" role="alert">{error}<button aria-label="Đóng thông báo" onClick={()=>setError('')}>×</button></div>}{notice&&<div className="toast" role="status">✿ {notice}</div>}<footer><div className="footer-brand"><Flower/><span>Made with ♡ for <strong>THCS&THPT Lương Thế Vinh</strong><small>Created by Lương Thế Vinh Tân Triều Programming Club</small></span></div><span>Petals of Code · 20.10.2026</span><span className="footer-note">Let kindness bloom.</span></footer><dialog ref={dialog} aria-label="Lời chúc trong vườn" className="card-dialog" onCancel={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)setSelected(null)}}><button className="close-modal" onClick={()=>setSelected(null)} aria-label="Đóng lời chúc">×</button>{selected&&<CardPreview card={{...selected,sender:selected.sender||'Một người thương bạn'}}/>}</dialog></>
}
