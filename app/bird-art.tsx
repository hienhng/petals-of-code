/** Right-facing pixel bird; colors and wing motion belong to the garden. */
export function BirdPixels(){return <>
 <ellipse className="bird-shadow" cx="12" cy="22" rx="8" ry="1" fill="#557548" opacity=".22"/>
 <g className="bird-feet" fill="#98754e"><path d="M10 18h1v3H8v1h4v-4zm6 0h1v3h2v1h-4v-4z"/></g>
 <g className="bird-body">
  <path d="M3 11H1V8h3v2h3V8h7V5h6v1h2v7h-2v4h-3v2H8v-2H5v-3H3z" fill="var(--bird-outline)"/>
  <path d="M4 11h4V9h7V6h5v1h1v5h-2v4h-3v2H9v-2H6v-3H4z" fill="var(--bird-color)"/>
  <path d="M13 11h6v4h-3v2h-5v-2h2z" fill="var(--bird-breast)"/>
  <path d="M15 7h3v1h-3zM7 11h4v1H7z" fill="var(--bird-highlight)"/>
  <path d="M22 9h3v1h-1v1h-2z" fill="#d5a15e"/>
  <path d="M19 8h1v2h-1z" fill="#403d49"/>
  <g className="bird-wing">
   <path d="M7 11V8H5V5H4V2h3v2h2v2h2v3h2v5h-3v-1H8v-2z" fill="var(--bird-outline)"/>
   <path d="M6 4h1v2h2v2h2v3h1v2h-2v-1H9v-2H7V7H6z" fill="var(--bird-color)"/>
   <path d="M6 4h1v2h1v2H7V7H6z" fill="var(--bird-highlight)"/>
  </g>
  <path className="bird-folded-wing" d="M7 10h6v4h-2v1H8v-2H7z" fill="var(--bird-outline)"/>
 </g>
 </>}
