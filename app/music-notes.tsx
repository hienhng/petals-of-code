export function MusicNotes({playing, expanded}: {playing: boolean; expanded: boolean}) {
  if (!playing) return null;
  return <span className="music-floating-notes" data-expanded={expanded} aria-hidden="true">
    {Array.from({length: 6}, (_, i) => <span className="music-floating-note" key={i}>
      <svg viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
        <path d={i % 2 === 0
          ? 'M8 1h2v2h3v2h2v3h-2V6h-3v6H8v2H4v-2H2V9h2V7h4z'
          : 'M5 2h9v10h-2v2H8v-2H6v-2h2V8h4V5H7v7H5v2H1v-2H0V9h2V7h3z'}/>
      </svg>
    </span>)}
  </span>;
}
