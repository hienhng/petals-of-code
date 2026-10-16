// Shared pixel sprites keep ambient insects and card decorations consistent.
// Placement and motion belong to the surrounding scene.
export function ButterflyPixels(){return (
 <g className="butterfly-rest">
  <g className="wing-left">
   <path d="M1 1h3v1h2v2h1v5H5v4H2v-1H1V9h1V8H0V2h1z" fill="#9273aa"/>
   <path d="M1 2h3v1h2v4H3V6H1zm2 7h3v3H3z" fill="#c9aedb"/>
   <path d="M2 3h2v2H2zm1 7h1v1H3z" fill="#f4dce9"/>
   <path d="M5 5h1v2H5zM2 7h1v1H2z" fill="#eacb8c"/>
  </g>
  <g className="wing-right">
   <path d="M15 1h-3v1h-2v2H9v5h2v4h3v-1h1V9h-1V8h2V2h-1z" fill="#9273aa"/>
   <path d="M15 2h-3v1h-2v4h3V6h2zm-2 7h-3v3h3z" fill="#c9aedb"/>
   <path d="M12 3h2v2h-2zm0 7h1v1h-1z" fill="#f4dce9"/>
   <path d="M10 5h1v2h-1zM13 7h1v1h-1z" fill="#eacb8c"/>
  </g>
  <path d="M7 4h2v9H7zM6 1h1v3H6zm3 0h1v3H9zM5 0h2v1H5zm4 0h2v1H9z" fill="#71627e"/>
  <path d="M7 5h1v5H7z" fill="#c1a5cb"/>
 </g>
 )}

export function BeePixels(){return (
 <g className="bee-facing">
  <g className="bee-wings bee-wing-back"><path d="M7 1h3v1h1v4H7V5H6V2h1z" fill="#bacfc9"/><path d="M8 2h2v3H8z" fill="#eef6e9"/></g>
  <g className="bee-wings bee-wing-front"><path d="M3 0h3v1h1v2h1v4H4V5H2V1h1z" fill="#cfdfd9"/><path d="M3 1h2v1h1v3H4V3H3z" fill="#fffdf0"/></g>
  <g className="bee-body">
  <path d="M3 6h7v1h2v5h-2v1H3v-1H1V8H0V7h3z" fill="#76614f"/>
  <path d="M3 7h7v1h1v3h-1v1H3v-1H2V8h1z" fill="#edc36b"/>
  <path d="M4 7h2v5H4zm4 0h2v5H8z" fill="#806447"/>
  <path d="M3 7h1v1H3zm3 0h2v1H6z" fill="#ffe5a0"/>
  <path d="M11 6h3v1h1v4h-1v1h-3v-1h-1V7h1z" fill="#8a6b49"/>
  <path d="M11 7h3v4h-3z" fill="#f3cf80"/>
  <path d="M12 4h1v2h-1zm2 1h1v2h-1zM5 13h1v1H5zm4 0h1v1H9z" fill="#76614f"/>
  <rect x="13" y="8" width="1" height="1" fill="#403b43"/>
  <rect x="13" y="10" width="1" height="1" fill="#e8b189"/>
  </g>
  <g className="bee-pollen"><path d="M4 14h2v2H4zm5-1h2v2H9z" fill="#d9a650"/><path d="M4 14h1v1H4zm5-1h1v1H9z" fill="#ffe0a0"/></g>
  <path className="bee-pollen-dust" d="M5 16h1v1H5zm3 2h1v1H8z" fill="#d9ae62" opacity="0"/>
 </g>
 )}
