import {useEffect,useRef,type FormEvent} from 'react';
import {flowers,themes,decorationOptions,type Card,type Decoration} from '../lib/card-validation';
import {flowerStories} from '../lib/flower-stories';
import {Flower,flowerNames} from './pixel-art';
import {DecorationIcon,decorationNames} from './card-art';
import {LetterScenery} from './letter-scenery';

export const makerSteps=['Chọn hoa','Chọn nền','Trang trí','Viết lời chúc','Gửi thiệp'];
export const makerStepDescriptions=['Một bông hoa riêng','Một góc trời nhỏ','Những chi tiết xinh','Điều muốn gửi gắm','Mang niềm vui đi'];
const themeDetails={
 meadow:{name:'Đồng cỏ nắng',description:'Nắng vàng, đồi xanh và một lối nhỏ giữa hoa. Cho lời chúc ấm áp như một cái ôm.'},
 blossom:{name:'Vườn anh đào',description:'Tán anh đào hồng bên chiếc cầu nhỏ. Cho những điều dịu dàng bạn muốn giữ thật lâu.'},
 night:{name:'Đêm đầy sao',description:'Hồ yên ả, trăng sáng và ô cửa còn đèn. Cho một lời nhắn bình yên cuối ngày.'},
};
const starters=['Mẹ ơi, cảm ơn mẹ vì đã luôn là nơi bình yên nhất của con. Chúc mẹ ngày 20/10 thật nhiều niềm vui và luôn rạng rỡ như những đóa hoa!','Em cảm ơn cô vì sự tận tâm và những điều tốt đẹp cô đã gieo vào chúng em. Chúc cô ngày 20/10 thật hạnh phúc!','Chúc bạn một ngày 20/10 ngập tràn niềm vui. Hãy luôn tự tin, yêu bản thân và nở rộ theo cách riêng của mình nhé!'];
type Props={step:number;card:Card;busy:boolean;onStep:(step:number)=>void;onChange:(key:keyof Card,value:string|boolean|Decoration[])=>void;onSubmit:(event:FormEvent)=>void;onSelect:()=>void};

export function MakerPanel({step,card,busy,onStep,onChange,onSubmit,onSelect}:Props){
 const title=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{title.current?.focus({preventScroll:true})},[step]);
 const story=flowerStories[card.flower as typeof flowers[number]];
 const decorations=card.decorations||[];
 const titles=['Bạn muốn gửi tặng hoa gì?','Một góc trời cho lời chúc.','Thêm một chút sống động.','Gửi một người thật đặc biệt.'];
 const nextLabels=['Tiếp tục chọn nền →','Tiếp tục trang trí →','Tiếp tục viết lời chúc →'];
 return <section className="panel editor maker-panel" aria-labelledby="maker-panel-title">
  <div className="panel-label"><span className="maker-step-code">0{step}</span><span>{makerSteps[step-1].toLocaleUpperCase('vi')}</span><span className="maker-window-controls" aria-hidden="true"><i/><i/><i/></span></div>
  <h2 id="maker-panel-title" ref={title} tabIndex={-1}>{titles[step-1]}</h2>
  <a className="maker-preview-jump" href="#maker-preview">Xem thiệp của bạn ↓</a>
  {step===1&&<>
   <p className="muted">{flowers.length} bông hoa, mỗi bông một câu chuyện. Chọn một đóa dành riêng cho người ấy.</p>
   <div className="flower-options" role="group" aria-label="Chọn bông hoa">
    {flowers.map(f=><button type="button" key={f} aria-pressed={card.flower===f} className={card.flower===f?'selected':''} onClick={()=>{onChange('flower',f);onSelect()}}><Flower type={f}/><span>{flowerNames[f]}</span>{card.flower===f&&<b aria-hidden="true">✓</b>}</button>)}
   </div>
   <div className="flower-story" aria-live="polite" aria-atomic="true">
    <span className="eyebrow">CHUYỆN NHỎ CỦA {flowerNames[card.flower]?.toLocaleUpperCase('vi')}</span>
    <p>{story.fact}</p>
    <a className="fact-source" href={story.source} target="_blank" rel="noreferrer">Đọc thêm tại {story.publisher} ↗</a>
    <div className="flower-sentiment"><span>Một lời nhắn gợi ý</span><p>“{story.sentiment}”</p></div>
   </div>
  </>}
  {step===2&&<>
   <p className="muted">Mỗi khung cảnh là một không gian riêng cho bông hoa của bạn.</p>
   <div className="theme-options maker-theme-options" role="group" aria-label="Chọn khung cảnh">
    {themes.map(t=><button type="button" key={t} className={`theme-option theme-${t} ${card.theme===t?'selected':''}`} aria-pressed={card.theme===t} onClick={()=>{onChange('theme',t);onSelect()}}><LetterScenery theme={t} miniature/><span className="theme-option-name">{themeDetails[t].name}</span><span className="theme-description">{themeDetails[t].description}</span>{card.theme===t&&<b className="theme-check" aria-hidden="true">✓</b>}</button>)}
   </div>
  </>}
  {step===3&&<>
   <p className="muted">Chọn tối đa 3 món. Bạn cũng có thể giữ bông hoa thật giản dị.</p>
   <fieldset className="decoration-picker maker-decorations"><legend className="sr-only">Chọn trang trí cho thiệp</legend>
    <div className="decoration-options">{decorationOptions.map(d=>{const selected=decorations.includes(d);return <button type="button" key={d} aria-pressed={selected} className={selected?'selected':''} disabled={!selected&&decorations.length>=3} onClick={()=>{onChange('decorations',selected?decorations.filter(v=>v!==d):[...decorations,d]);onSelect()}}><DecorationIcon type={d}/><span>{decorationNames[d]}</span>{selected&&<b aria-hidden="true">✓</b>}</button>})}</div>
    <div className="decoration-summary"><span aria-live="polite">{decorations.length}/3 món trang trí</span><button type="button" className="text-link" disabled={!decorations.length} onClick={()=>onChange('decorations',[])}>Bỏ trang trí</button></div>
   </fieldset>
   <p className="decoration-tip">Ong vỗ cánh, hạc giấy mở cánh, nốt nhạc lần lượt ngân lên… Ngắm thử chúng ngay trên thiệp nhé.</p>
  </>}
  {step===4?<form onSubmit={onSubmit}>
   <label>Gửi đến<input required maxLength={60} value={card.recipient} onChange={e=>onChange('recipient',e.target.value)} placeholder="Mẹ, cô giáo, hay một người bạn…"/></label>
   <label>Lời chúc của bạn<textarea required minLength={5} maxLength={500} value={card.message} onChange={e=>onChange('message',e.target.value)} placeholder="Có điều gì bạn luôn muốn nói với người ấy?" rows={6}/></label>
   <div className="count">{card.message.length}/500 ký tự</div>
   <fieldset className="inspiration"><legend>Một chút cảm hứng</legend>{['Gửi mẹ','Gửi cô','Gửi bạn'].map((s,i)=><button key={s} type="button" onClick={()=>onChange('message',starters[i])}>{s} +</button>)}</fieldset>
   <label>Người gửi<input required={!card.anonymous} disabled={card.anonymous} maxLength={40} value={card.sender} onChange={e=>onChange('sender',e.target.value)} placeholder="Tên hoặc biệt danh của bạn"/></label>
   <label className="checkbox"><input type="checkbox" checked={card.anonymous} onChange={e=>onChange('anonymous',e.target.checked)}/>Gửi ẩn danh, giữ lại một chút bí mật</label>
   <div className="form-actions"><button type="button" className="text-link" disabled={busy} onClick={()=>onStep(3)}>← Quay lại trang trí</button><button type="submit" disabled={busy} className="pixel-button primary">{busy?'Đang gieo yêu thương…':'Hoàn tất & gửi thiệp ✿'}</button></div>
   <p className="privacy-note">Thiệp được lưu riêng tư. Chỉ người có đường dẫn mới đọc được nội dung; thiệp không tự xuất hiện trong vườn.</p>
  </form>:<div className="form-actions step-actions">{step>1&&<button type="button" className="text-link" onClick={()=>onStep(step-1)}>← Quay lại</button>}<button type="button" className="pixel-button primary" onClick={()=>onStep(step+1)}>{nextLabels[step-1]}</button></div>}
 </section>;
}
