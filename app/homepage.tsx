import {Butterfly, Flower} from './pixel-art';
import {GardenScene} from './garden-scene';
import {HomepageEvent} from './homepage-event';
import {HangingVine, MeadowBorder, MeadowInsects, NaturePatch} from './homepage-nature';

const steps = [
  {flower: 'tulip', title: 'Chọn một bông hoa', description: 'Mỗi bông hoa mang một câu chuyện. Hãy chọn đóa hoa dành riêng cho người ấy.'},
  {flower: 'cherry', title: 'Gửi gắm lời yêu thương', description: 'Không cần những lời hoa mỹ. Chỉ cần những điều thật lòng bạn muốn nói.'},
  {flower: 'sunflower', title: 'Để lời chúc nở rộ', description: 'Ngắm hoa nở, lưu tấm thiệp và gửi một niềm vui nho nhỏ đến người thương.'},
];

export function Homepage({onCreate, onGarden, onButterfly}: {
  onCreate: () => void;
  onGarden: () => void;
  onButterfly: () => void;
}) {
  return <main className="homepage">
    <section className="hero" aria-labelledby="home-title">
      <GardenScene/>
      <HangingVine className="hero-vine-left"/>
      <HangingVine className="hero-vine-right"/>
      <NaturePatch className="hero-patch-left" variant="woodland"/>
      <NaturePatch className="hero-patch-right"/>
      <MeadowInsects className="hero-insects"/>
      <div className="hero-content">
        <div className="event-tag"><span className="tiny-flower" aria-hidden="true">✿</span> THCS&THPT LƯƠNG THẾ VINH · CHÀO MỪNG NGÀY 20/10</div>
        <p className="hero-overline">a garden of little things</p>
        <h1 id="home-title">PETALS<br/>OF <span>CODE</span><i aria-hidden="true">✦</i></h1>
        <p className="hero-description">Nhân ngày Phụ nữ Việt Nam 20/10, LTPC gửi một chút yêu thương<br className="desktop"/> qua những bông hoa được tạo nên từ code.</p>
        <div className="hero-actions">
          <button className="pixel-button primary" onClick={onCreate}><Flower/>Tạo thiệp ngay <span aria-hidden="true">→</span></button>
          <button className="pixel-button secondary" onClick={onGarden}>Khám phá vườn hoa <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <button className="butterfly" onClick={onButterfly} aria-label="Chạm vào bươm bướm để nhận lời nhắn"><Butterfly/></button>
      <a className="scroll-cue" href="#how">KHÁM PHÁ CÁCH GỬI HOA <span aria-hidden="true">↓</span></a>
    </section>

    <section className="how" id="how" aria-labelledby="how-title">
      <NaturePatch className="how-patch-left"/>
      <NaturePatch className="how-patch-right" variant="woodland"/>
      <div className="section-heading">
        <span className="eyebrow">NHỮNG ĐIỀU NHỎ BÉ, Ý NGHĨA LỚN LAO</span>
        <h2 id="how-title">Để yêu thương nở thành hoa.</h2>
        <p>Chỉ ba bước nhỏ, gửi đi cả một tấm lòng.</p>
      </div>
      <ol className="steps-intro">
        {steps.map(({flower, title, description}, i) => <li key={flower} className="intro-item">
          <div className="intro-topline"><span className="intro-number">0{i + 1}</span><span aria-hidden="true">{i === 2 ? '✧' : '→'}</span></div>
          <div className="intro-art"><Flower type={flower}/></div>
          <div className="intro-copy"><h3>{title}</h3><p>{description}</p></div>
        </li>)}
      </ol>
      <button className="text-link" onClick={onCreate}>Gieo lời chúc đầu tiên của bạn <span aria-hidden="true">→</span></button>
    </section>

    <HomepageEvent onCreate={onCreate}/>

    <section className="garden-invite" aria-labelledby="garden-invite-title">
      <HangingVine className="invite-vine"/>
      <div className="invite-bouquet" aria-hidden="true"><Flower type="daisy"/><Flower type="lavender"/><Flower type="tulip"/></div>
      <div className="invite-copy"><span className="eyebrow">VƯỜN LỜI CHÚC</span><h2 id="garden-invite-title">Một khu vườn.<br/>Thật nhiều yêu thương.</h2><p>Mỗi bông hoa là một lời chúc thật lòng gửi đến thầy cô và học sinh THCS&THPT Lương Thế Vinh.</p></div>
      <button className="pixel-button secondary" onClick={onGarden}>Dạo một vòng nhé <span aria-hidden="true">↗</span></button>
    </section>
    <MeadowBorder/>
  </main>;
}
