export function MusicInvitation({onDismiss}: {onDismiss: () => void}) {
  return <div className="music-invitation">
    <button className="music-invitation-dismiss" type="button" onClick={onDismiss} aria-label="Ẩn gợi ý nghe nhạc">×</button>
    <p id="music-invitation-text">Có một cuộn băng<br/>dành cho bạn.</p>
    <span>Chạm vào băng để nghe ♫</span>
    <svg className="music-invitation-hand" viewBox="0 0 24 24" fill="#fff6df" stroke="#806071" strokeWidth="1.5" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M2 10h8V8h12v4H12v2h7v3h-3v3H8v-2H5v-4H2z"/>
      <path d="M8 14v3m4-2v3"/>
    </svg>
  </div>;
}
