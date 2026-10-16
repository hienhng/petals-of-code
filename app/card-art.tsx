import type {CSSProperties} from 'react';
import type {Decoration} from '../lib/card-validation';
import {FlowerPixels} from './pixel-art';

export const decorationNames:Record<Decoration,string>={
 ribbon:'Nơ dịu dàng',butterflies:'Bươm bướm',hearts:'Trái tim',
 sparkles:'Sao lấp lánh',fireflies:'Đom đóm',petals:'Cánh hoa bay',
 bees:'Ong nhỏ',cranes:'Hạc giấy',music:'Nốt nhạc',
};

const motion=(values:Record<string,string>):CSSProperties=>values as CSSProperties;

function PixelBurst({kind='heart'}:{kind?:'heart'|'star'|'butterfly'}){
 const color=kind==='heart'?'#d997b3':kind==='star'?'#d8b775':'#c2afd5';
 return <g aria-hidden="true">{[[-7,-7],[8,-6],[-8,6],[7,8]].map(([dx,dy],i)=><rect
  key={i} className={kind==='heart'?'heart-pixel':kind==='star'?'star-spark':'butterfly-dust'}
  x="4" y="4" width={i%2?1:2} height={i%2?2:1} fill={color} opacity="0"
  style={motion({'--dx':`${dx}px`,'--dy':`${dy}px`,'--speck':`${i*.13}s`})}
 />)}</g>;
}

function Heart(){return <>
 <PixelBurst/>
 <g className="heart-body">
  <path d="M1 0h3v1h2V0h3v1h1v4H9v1H8v1H7v1H6v1H4V8H3V7H2V6H1V5H0V1h1z" fill="#d987a4"/>
  <path d="M2 1h2v2H2z" fill="#ffd9e3"/>
  <rect className="heart-shine" x="2" y="1" width="2" height="1" fill="#fff7e8" opacity="0"/>
 </g>
 </>}

function Star(){return <>
 <PixelBurst kind="star"/>
 <g className="star-body">
  <path d="M4 0h2v3h3v2H6v4H4V5H0V3h4z" fill="#d2ad67"/>
  <rect x="4" y="3" width="2" height="2" fill="#fff0bb"/>
 </g>
 </>}

function Moth(){return <>
 <PixelBurst kind="butterfly"/>
 <g className="butterfly-rest">
  <g className="wing-left">
   <path d="M0 1h4v2h2v5H2V6H0zM2 8h4v4H2z" fill="#ad91c3"/>
   <path d="M1 2h2v3H1zM3 9h2v1H3z" fill="#ead9ef"/>
  </g>
  <g className="wing-right">
   <path d="M14 1h-4v2H8v5h4V6h2zM8 8h4v4H8z" fill="#ad91c3"/>
   <path d="M11 2h2v3h-2zM9 9h2v1H9z" fill="#ead9ef"/>
  </g>
  <path d="M6 3h2v9H6zM5 0h1v3H5zm3 0h1v3H8z" fill="#71627e"/>
 </g>
 </>}

function Ribbon(){return <>
 <g className="bow-tail-left">
  <path d="M5 5h2v4H5v4H2V8h3z" fill="#b6718f"/>
  <path d="M4 8h1v3H4z" fill="#efbad0"/>
 </g>
 <g className="bow-tail-right">
  <path d="M7 5h1v3h3v5H8v-3H6V7h1z" fill="#b6718f"/>
  <path d="M8 8h1v3H8z" fill="#efbad0"/>
 </g>
 <g className="bow-loop-left">
  <path d="M0 0h5v2h1v4H0z" fill="#b6718f"/>
  <path d="M1 1h3v3H1z" fill="#f0b4cd"/>
 </g>
 <g className="bow-loop-right">
  <path d="M8 0h5v6H7V2h1z" fill="#b6718f"/>
  <path d="M9 1h3v3H9z" fill="#f0b4cd"/>
 </g>
 <path d="M5 2h3v4H5z" fill="#d88ead"/>
 <path className="bow-stitch" d="M1 2h3v2h5V2h3" stroke="#ffe3e9" strokeWidth=".65" strokeDasharray="16" opacity=".45"/>
 <path className="bow-shine" d="M6 0h1v2h2v1H7v2H6V3H4V2h2z" fill="#fff7d7" opacity="0"/>
 </>}

function Firefly(){return <>
 <g className="fly-halo" opacity=".18">
  <path d="M1 -2h7v2h3v9H8v2H1V9h-3V0h3z" fill="#e4dba0"/>
  <path d="M2 0h5v2h2v5H7v2H2V7H0V2h2z" fill="#fff2a8"/>
 </g>
 <path className="fly-wing" d="M1 1h2v3H0V2h1zm5 0h2v1h1v2H6z" fill="#ced8bc"/>
 <path d="M3 1h3v3H3z" fill="#82915e"/>
 <path className="fly-lantern" d="M3 4h3v3H3z" fill="#e5c977"/>
 <rect className="fly-trail" x="-2" y="10" width="1" height="1" fill="#cabb7f" opacity="0" style={motion({'--speck':'.15s'})}/>
 <rect className="fly-trail" x="-5" y="14" width="1" height="1" fill="#cabb7f" opacity="0" style={motion({'--speck':'.55s'})}/>
 </>}

function Petal(){return <>
 <g className="petal-fall">
  <g className="petal-front">
   <path d="M2 0h5v3H5v2H0V2h2z" fill="#e3a6bd"/>
   <path d="M2 1h3v2H2z" fill="#ffdae3"/>
  </g>
  <path className="petal-edge" d="M3 0h2v5H3z" fill="#c784a2" opacity="0"/>
  <rect className="petal-glint" x="-2" y="-3" width="1" height="1" fill="#e4bdc7" opacity="0"/>
 </g>
 </>}

function Bee(){return <>
 <g className="bee-wings"><path d="M2 0h3v1h1v4H2V4H1V1h1zm6 0h3v1h1v3h-1v1H7V1h1z" fill="#dce9e6"/><path d="M3 1h2v2H3zm5 0h2v2H8z" fill="#fffbec"/></g>
 <path d="M2 5h8v1h2v5h-2v1H2v-1H0V6h2z" fill="#e9bd68"/>
 <path d="M3 5h2v7H3zm4 0h2v7H7zm5 2h1v3h-1zM0 4h1v2H0z" fill="#76614f"/>
 <rect x="10" y="7" width="1" height="1" fill="#403b43"/>
 <g className="bee-pollen"><rect x="3" y="13" width="2" height="2" fill="#d9ae62"/><rect x="8" y="14" width="1" height="1" fill="#f0ce7d"/></g>
 <rect className="bee-pollen-dust" x="5" y="14" width="1" height="1" fill="#d9ae62" opacity="0"/>
 </>}

function Crane(){return <>
 <g className="crane-wing-back"><path d="M7 7V2H5V0H3v6H1v2h6z" fill="#c6b8dd"/><path d="M4 2h1v4H4z" fill="#f4ebff"/></g>
 <path d="M1 8h8V6h2V3h2v4h-1v2h-2v2H6v1H3v-2H1z" fill="#e6d7ed"/>
 <path d="M13 3h3v1h-3z" fill="#bb917e"/>
 <g className="crane-wing-front"><path d="M5 9h5v3H8v3H6v2H4v-5H2v-2h3z" fill="#af99c6"/><path d="M6 10h2v3H6z" fill="#f4eafa"/></g>
 <path className="crane-crease" d="M2 9h5v1H5v1H3z" fill="#fff8ec"/>
 </>}

function Music(){return <>
 <g className="music-note note-one"><path d="M4 0h2v8H4V5H2v1H0v4h4V9h2V2h3V0z" fill="#aa829b"/><path d="M1 7h2v1H1z" fill="#edcad8"/></g>
 <g className="music-note note-two"><path d="M12 5h2v8h-2v-3h-2v1H8v4h4v-1h2V7h2V5z" fill="#bda15e"/><path d="M9 12h2v1H9z" fill="#fff0c0"/></g>
 <path className="music-chime" d="M9 0h1v1H9zM0 13h1v1H0zM15 1h1v1h-1z" fill="#d7bcd2" opacity=".6"/>
 </>}

export function DecorationPixels({type}:{type:Decoration}){
 if(type==='ribbon')return <Ribbon/>;
 if(type==='butterflies')return <Moth/>;
 if(type==='hearts')return <Heart/>;
 if(type==='sparkles')return <Star/>;
 if(type==='fireflies')return <Firefly/>;
 if(type==='bees')return <Bee/>;
 if(type==='cranes')return <Crane/>;
 if(type==='music')return <Music/>;
 return <Petal/>;
}

export function DecorationIcon({type}:{type:Decoration}){
 return <svg viewBox="-3 -3 22 22" width="32" height="32" fill="none" shapeRendering="crispEdges" aria-hidden="true"><DecorationPixels type={type}/></svg>;
}

// Sprite geometry is self-contained; CSS animates its parts only in the page.
// Without that stylesheet, PNG export retains the complete static composition.
// Garden flowers and full letters share the same decoration animations.
export function CardArtwork({flower,decorations=[],small=false,animationPaused=false,celebrate=false,motionOverride=true}:{
 flower:string;decorations?:Decoration[];small?:boolean;animationPaused?:boolean;celebrate?:boolean;motionOverride?:boolean;
}){
 return <svg xmlns="http://www.w3.org/2000/svg" className={`card-art${small?' card-art-small':''}`}
  data-animate={true} data-paused={animationPaused} data-celebrate={celebrate} data-motion-override={motionOverride}
  viewBox="0 0 160 112" width="160" height="112" fill="none" shapeRendering="crispEdges" aria-hidden="true">
  {decorations.includes('bees')&&<g data-decoration="bees">
   <g transform="translate(27 37)" className="animated-sprite" style={motion({'--beat':'-.4s'})}><g className="bee-flight bee-flight-first"><Bee/></g></g>
   <g transform="translate(115 59) scale(.8)" className="animated-sprite" style={motion({'--beat':'-1.7s'})}><g className="bee-flight bee-flight-second"><Bee/></g></g>
  </g>}
  {decorations.includes('cranes')&&<g data-decoration="cranes">
   <g transform="translate(32 12)" className="animated-sprite" style={motion({'--beat':'-.2s'})}><Crane/></g>
   <g transform="translate(110 82) scale(.8)" className="animated-sprite" style={motion({'--beat':'-1.8s'})}><Crane/></g>
  </g>}
  {decorations.includes('music')&&<g data-decoration="music">
   <g transform="translate(111 8)" className="animated-sprite" style={motion({'--beat':'-.5s'})}><Music/></g>
   <g transform="translate(23 81) scale(.8)" className="animated-sprite" style={motion({'--beat':'-1.9s'})}><Music/></g>
  </g>}
  {decorations.includes('petals')&&<g data-decoration="petals">
   <g transform="translate(37 22)" className="animated-sprite" style={motion({'--beat':'-1.5s','--cycle':'8.2s'})}><Petal/></g>
   <g transform="translate(111 67) rotate(90)" className="animated-sprite" style={motion({'--beat':'-4s','--cycle':'9.4s'})}><Petal/></g>
   <g transform="translate(28 75)" className="animated-sprite" style={motion({'--beat':'-5.5s','--cycle':'8.7s'})}><Petal/></g>
   <g transform="translate(117 15) rotate(90)" className="animated-sprite" style={motion({'--beat':'-2.8s','--cycle':'10s'})}><Petal/></g>
  </g>}
  {decorations.includes('sparkles')&&<g data-decoration="sparkles">
   <g transform="translate(24 46)" className="animated-sprite" style={motion({'--beat':'-1.3s','--cycle':'5.8s'})}><Star/></g>
   <g transform="translate(116 32) scale(.8)" className="animated-sprite" style={motion({'--beat':'-3.4s','--cycle':'6.4s'})}><Star/></g>
   <g transform="translate(96 8) scale(.6)" className="animated-sprite" style={motion({'--beat':'-.3s','--cycle':'7s'})}><Star/></g>
  </g>}
  {decorations.includes('fireflies')&&<g data-decoration="fireflies">
   <g transform="translate(39 58)" className="animated-sprite" style={motion({'--beat':'-2.1s','--cycle':'6s'})}><Firefly/></g>
   <g transform="translate(111 48)" className="animated-sprite" style={motion({'--beat':'-4.4s','--cycle':'7.2s'})}><Firefly/></g>
   <g transform="translate(96 87)" className="animated-sprite" style={motion({'--beat':'-.3s','--cycle':'6.6s'})}><Firefly/></g>
  </g>}
  {decorations.includes('butterflies')&&<g data-decoration="butterflies">
   <g transform="translate(33 23) rotate(-12)" className="animated-sprite" style={motion({'--beat':'-.3s'})}><Moth/></g>
   <g transform="translate(109 70) rotate(12)" className="animated-sprite" style={motion({'--beat':'-4.5s'})}><Moth/></g>
  </g>}
  {decorations.includes('hearts')&&<g data-decoration="hearts">
   <g transform="translate(27 68)" className="animated-sprite" style={motion({'--beat':'-1.4s','--cycle':'7s'})}><Heart/></g>
   <g transform="translate(111 20)" className="animated-sprite" style={motion({'--beat':'-3s','--cycle':'8.2s'})}><Heart/></g>
   <g transform="translate(43 8) scale(.6)" className="animated-sprite" style={motion({'--beat':'-5.3s','--cycle':'7.6s'})}><Heart/></g>
  </g>}
  <g className="flower-aura" opacity="0" style={{transformBox:'fill-box',transformOrigin:'center'}}>
   <path d="M78 16h4v6h-4zm0 61h4v6h-4zM48 46h6v4h-6zm58 0h6v4h-6zM57 23h4v4h-4zm43 43h4v4h-4zM57 66h4v4h-4zm43-43h4v4h-4z" fill="#d8b775"/>
  </g>
  <g className="garden-flower-main" transform="translate(55 24) scale(1.6)"><FlowerPixels type={flower}/></g>
  {/* Tie the knot just below the bloom: x=55 + 16.5*1.6, y=24 + 28*1.6.
      Keep this anchor outside the animated loops and tails. */}
  {decorations.includes('ribbon')&&<g data-decoration="ribbon" transform="translate(81.4 68.8)"><g transform="scale(1.3) translate(-6.5 -4)"><Ribbon/></g></g>}
 </svg>;
}
