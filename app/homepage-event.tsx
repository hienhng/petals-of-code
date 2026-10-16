import {Flower} from './pixel-art';
import {HangingVine, NaturePatch} from './homepage-nature';

export function HomepageEvent({onCreate}:{onCreate:()=>void}){
 return <section className="event-section" id="event" aria-labelledby="event-title">
  <HangingVine className="event-vine"/>
  <NaturePatch className="event-patch" variant="woodland"/>
  <div className="event-story">
   <span className="eyebrow">LTPC PRESENTS · 20.10.2026</span>
   <h2 id="event-title">Code có thể tạo ra những điều dịu dàng.</h2>
   <p>Petals of Code là khu vườn nhỏ của <strong>Lương Thế Vinh Tân Triều Programming Club</strong>, được tạo nên để chào mừng ngày Phụ nữ Việt Nam 20/10.</p>
   <p>Mỗi lời chúc gửi đến mẹ, cô giáo, bạn bè hay những người phụ nữ quan trọng trong cuộc sống là một hạt mầm yêu thương. Chúng mình dùng code để giúp những hạt mầm ấy nở hoa.</p>
   <blockquote>“Every message makes a flower bloom.”</blockquote>
   <p>Không cần một món quà lớn. Đôi khi, một lời cảm ơn thật lòng là đủ để làm ngày của ai đó trở nên đặc biệt.</p>
   <button className="pixel-button primary" onClick={onCreate}>Gửi một chút yêu thương <span>→</span></button>
  </div>
  <aside className="event-date-card" aria-label="Ngày Phụ nữ Việt Nam, 20 tháng 10 năm 2026">
   <div className="event-card-top"><Flower type="cherry"/><span>NGÀY PHỤ NỮ VIỆT NAM</span><Flower type="tulip"/></div>
   <div className="event-date-number">20</div>
   <div className="event-date-month">THÁNG MƯỜI <span>✿</span></div>
   <div className="event-date-year">2026</div>
   <div className="event-card-rule"/>
   <div className="event-card-bottom"><span>LTPC PRESENTS</span><span>LET KINDNESS BLOOM</span></div>
  </aside>
 </section>;
}
