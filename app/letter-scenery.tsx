import type {CSSProperties} from 'react';

type SceneryProps={theme:string;miniature?:boolean};
const rhythm=(i:number,duration=8):CSSProperties=>({'--scene-delay':`${-i*1.73}s`,'--scene-duration':`${duration+(i%4)*1.4}s`}) as CSSProperties;

function Cloud({x,y,scale=1}:{x:number;y:number;scale?:number}){
 return <g transform={`translate(${x} ${y}) scale(${scale})`}><g className="scenery-cloud" style={rhythm(Math.round(x/30),24)}>
  <path d="M0 12h9V6h13V0h22v5h13v7h15v8H0z" fill="#fff9ed"/>
  <path d="M0 18h72v3H0zM10 8h12V6h20v2H10z" fill="#e8e5d8" opacity=".55"/>
  <path d="M24 2h17v2H24z" fill="#fffdf5"/>
 </g></g>;
}
function Grass({night=false,pond=false}:{night?:boolean;pond?:boolean}){
 return <g fill={night?'#668c87':'#799869'}>{Array.from({length:32},(_,i)=>{const x=(i*47+9)%316,y=407+(i*23)%71;
  if(night){if(!((y>=462&&(x<98||x>274))||(y>=445&&(x<58||x>295))))return null}
  else if(x>(pond?75:118)&&x<(pond?265:220))return null;
  return <g key={i} transform={`translate(${x} ${y})`}><path className="scenery-grass" style={rhythm(i,4)} d="M0 0v-4h1v3h2v-5h1v5h2v-2h1v4H0z"/></g>})}</g>;
}
function Flowers({pink=false}:{pink?:boolean}){
 return <g>{Array.from({length:29},(_,i)=>{const x=(i*61+12)%312,y=395+(i*19)%80;if(x>98&&x<238)return null;return <g key={i} transform={`translate(${x} ${y})`}><g className="scenery-flower" style={rhythm(i,4)}>
  <path d="M0 0h1v9H0zm0 5h-3V2h1v2h2zm1 1h3V3H3v2H1z" fill="#587e5d"/>
  <path d="M-1 -3h2v2h2v2H1v2h-2V1h-2v-2h2z" fill={pink?['#fbe0e8','#e8a4bc','#fff1e7'][i%3]:['#fff4d5','#e9b65e','#eeb5bd'][i%3]}/><path d="M-1 -1h2v2h-2z" fill="#d6a95b"/>
 </g></g>})}</g>;
}
function Pine({x,y,scale=1,color='#253f4e'}:{x:number;y:number;scale?:number;color?:string}){
 return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M14 40h4v22h-4z" fill="#53605f"/><path d="M14 0h4v6h4v6h4v6h-5v5h8v6h-6v5h10v8H0v-8h10v-5H4v-6h8v-5H7v-6h4V6h3z" fill={color}/><path d="M14 9h2v12h-5v3h5v13H7v3h10V8h-3z" fill="#86a9a0" opacity=".12"/></g>;
}
function Tree({x,y,scale=1,pink=false,canopyOnly=false}:{x:number;y:number;scale?:number;pink?:boolean;canopyOnly?:boolean}){
 const colors=pink?['#c484a2','#e6a5bf','#f3c0d1','#ffe1e7']:['#638969','#8ca97d','#abc294','#c9d5a8'];
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
  {!canopyOnly&&<><path d="M31 37h6v53h-6zm-13 7h5v14h11v5H18zm17 9h11V37h5v21H35z" fill={pink?'#a17a83':'#8a8068'}/>
  <path d="M33 61h2v27h-2z" fill={pink?'#c29aa0':'#b4a083'}/></>}
  <g className="scenery-canopy" style={rhythm(Math.round(x/30),7)}>
   <path d="M14 3h13V0h16v4h10v6h10v9h5v20h-6v9H51v6H38v4H19v-5H8v-8H0V23h5V12h9z" fill={colors[0]}/>
   <path d="M15 5h12V3h14v5h12v6h8v11h4v12H54v8H42v5H23v-5H11v-9H3V25h5V15h7z" fill={colors[1]}/>
   <path d="M15 7h13V5h12v6h10v8h11v9H49v8H35v6H19v-7H8V24h3V15h4z" fill={colors[2]}/>
   <path d="M19 9h9v5h-9zm20 5h9v5h-9zM11 25h8v5h-8zm16 7h10v4H27zM50 29h8v4h-8z" fill={colors[3]}/>
   {pink&&<path d="M16 17h2v2h2v2h-2v2h-2v-2h-2v-2h2zm26 12h2v2h2v2h-2v2h-2v-2h-2v-2h2zM31 9h2v2h-2zM20 43h2v2h-2zM54 17h2v2h-2z" fill="#fff2ee"/>}
  </g>
 </g>;
}
function PetalDrift(){
 return <g fill="#e3a2bc">{[[16,32],[289,25],[36,105],[302,165],[17,215],[287,270],[35,325],[298,366],[70,395],[265,419]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><g className="scenery-petal" style={rhythm(i,10)}><path d="M2 0h3v1h1v2H4v2H1V4H0V2h2z"/><path d="M2 1h2v1H2z" fill="#ffe3e9"/></g></g>)}</g>;
}
function Shimmer({night=false}:{night?:boolean}){
 const lines=night?[[224,379,25],[213,390,40],[221,402,33],[208,416,52],[217,431,44],[202,447,65],[210,463,54],[98,408,24],[75,450,37]]:[[137,398,37],[111,422,49],[172,439,38],[106,458,60],[185,470,42]];
 return <g fill={night?'#c0cfbd':'#e0efe6'} opacity={night ? .5 : .75}>{lines.map(([x,y,w],i)=><g key={i} transform={`translate(${x} ${y})`}><path className="scenery-ripple" style={rhythm(i,5)} d={`M0 0h${w}v2H0z`}/></g>)}</g>;
}
function Meadow(){return <>
 <path fill="#d4e8e7" d="M0 0h320v480H0z"/><path fill="#e0eeea" d="M0 83h320v78H0z"/><path fill="#edf0df" d="M0 161h320v79H0z"/><path fill="#f5edcf" d="M0 240h320v100H0z"/>
 <path className="scenery-sun-glow" d="M238 22h36v7h10v34h-10v9h-36v-9h-10V31h10z" fill="#fff1be" opacity=".5"/>
 <path d="M243 29h26v5h6v25h-6v6h-26v-6h-6V35h6z" fill="#efc977"/><path d="M245 32h21v4h5v20h-5v5h-21v-5h-4V37h4z" fill="#ffe5a1"/>
 <Cloud x={13} y={29} scale={.8}/><Cloud x={96} y={92} scale={.65}/><Cloud x={251} y={143} scale={.8}/>
 <g className="scenery-birds" fill="#8ca59b"><path d="M32 91h4v2h4v2h-3v-1h-3v-1h-2zm16-7h3v2h4v2h-3v-1h-2v-1h-2z"/></g>
 <path d="M0 287h19v-8h22v-10h31v-8h30v6h25v11h29v7h28v-9h24v-14h32v8h28v11h29v8h23v191H0z" fill="#c7d7ae"/>
 <path d="M0 322h27v-9h31v-8h33v5h26v11h34v13h34v-6h27v-13h33v-9h29v8h24v9h22v157H0z" fill="#a7c092"/>
 <path d="M0 358h31v-9h38v6h33v11h35v11h39v-8h28v-15h35v-9h33v8h27v8h21v119H0z" fill="#88ab7d"/>
 <path d="M0 405h41v-7h42v7h37v13h64v-10h43v-12h45v4h48v80H0z" fill="#9bb786"/>
 <path d="M19 291h33v2H19zm54-19h23v2H73zm112 17h35v2h-35zm58 29h28v2h-28z" fill="#e9eac0" opacity=".7"/>
 <path d="M154 349h16v24h-7v29h13v22h16v25h23v31h-97v-26h15v-26h12v-25h7v-28h2z" fill="#d3bc8e"/>
 <path d="M156 350h10v27h-7v27h11v23h15v25h21v28h-69v-25h9v-25h8v-27h1v-26h1z" fill="#f1dfb4"/>
 <path d="M155 390h6v2h-6zm6 29h8v2h-8zm-16 26h7v2h-7zm29 21h9v2h-9z" fill="#c6b38e" opacity=".7"/>
 <Tree x={-29} y={295} scale={1.2}/><Tree x={268} y={309} scale={1}/>
 <path d="M0 411h80v4H0zm0 16h80v4H0z" fill="#d6c5a0"/><g fill="#fff1d4">{[4,20,36,52,68].map(x=><path key={x} d={`M${x} 401h4v40h-4v-36h-1v-2h1z`}/>)}</g>
 <Grass/><Flowers/>
 <g fill="#fff3cb">{[[18,304],[296,280],[35,414],[281,446]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path className="scenery-seed" style={rhythm(i,11)} d="M0 0h2v2H0z"/></g>)}</g>
</>}
function Blossom(){return <>
 <path fill="#f2dde8" d="M0 0h320v480H0z"/><path fill="#f8e4e9" d="M0 81h320v100H0z"/><path fill="#fbeade" d="M0 181h320v150H0z"/>
 <path className="scenery-sun-glow" d="M239 50h26v6h7v24h-7v7h-26v-7h-7V58h7z" fill="#f6cdba" opacity=".65"/>
 <Cloud x={98} y={35} scale={.7}/><Cloud x={245} y={118} scale={.65}/>
 <path d="M0 284h25v-8h25v-9h34v7h29v10h30v-8h29v-11h35v7h29v10h33v-8h28v9h23v197H0z" fill="#d1c5d2"/>
 <path d="M0 325h27v-9h32v-10h35v7h31v13h34v8h37v-10h30v-12h37v6h29v10h28v152H0z" fill="#b6bfa8"/>
 <path d="M0 365h35v-8h42v7h34v14h39v8h46v-9h36v-15h38v-5h27v9h23v114H0z" fill="#93ac91"/>
 <path d="M0 407h42v-10h45v9h42v12h76v-9h37v-10h40v6h38v75H0z" fill="#adbf9d"/>
 <path d="M142 379h35v10h25v13h20v17h19v22h19v39H73v-24h16v-20h15v-22h15v-19h23z" fill="#88b5b7"/>
 <path d="M148 384h23v13h26v14h19v19h19v23h14v27H94v-23h12v-21h14v-20h15v-20h13z" fill="#aacdca"/>
 <Shimmer/>
 <Tree x={-30} y={268} scale={1.45} pink/><Tree x={266} y={292} scale={1.25} pink/>
 <g transform="translate(-28 -34) scale(1.1)"><Tree x={0} y={0} pink canopyOnly/></g><g transform="translate(351 -27) scale(-1.15 1.15)"><Tree x={0} y={0} pink canopyOnly/></g>
 <path d="M109 419h8v-8h10v-6h13v-4h30v4h14v6h11v8h8v7h-94zm4 7h5v16h-5zm81 0h5v16h-5z" fill="#a47e82"/>
 <path d="M116 419h80v4h-80zm13-12h11v-3h30v3h13v3h-54z" fill="#e5bdad"/>
 <path d="M126 412h3v12h-3zm13-6h3v18h-3zm14-4h3v22h-3zm14 4h3v18h-3zm14 6h3v12h-3z" fill="#c69a96"/>
 <g transform="translate(67 385)"><path d="M0 23h13v3H0zm4-18h5v19H4zM1 4h11v10H1zM0 3h13V0h-3v-3H3v3H0z" fill="#92958b"/><path d="M4 6h5v6H4z" fill="#f8e2ab"/><path d="M1 0h11v2H1zM2 14h9v2H2z" fill="#c6c8ad"/></g>
 <g transform="translate(182 449)"><g className="scenery-koi" style={rhythm(1,12)}><path d="M0 1h7V0h3v2H8v2H2V3H0z" fill="#d99c7d"/><path d="M3 1h3v2H3z" fill="#fff0d6"/></g></g>
 <path d="M14 440h5v2h-5zm29 25h8v2h-8zm244-12h6v2h-6zm-22 22h6v2h-6z" fill="#efc7d3"/>
 <Grass pond/><Flowers pink/><PetalDrift/>
</>}
function Night(){return <>
 <path fill="#252e4a" d="M0 0h320v480H0z"/><path fill="#303955" d="M0 87h320v84H0z"/><path fill="#3e4763" d="M0 171h320v74H0z"/><path fill="#545a73" d="M0 245h320v105H0z"/>
 <path d="M0 130h35v-4h43v5h39v5H78v4H30v-4H0zm210 72h46v-4h38v3h26v8h-64v-3h-46z" fill="#77728d" opacity=".15"/>
 <g className="scenery-moon-glow" fill="#eee1ac" opacity=".12"><path d="M237 22h37v7h11v38h-11v10h-37V67h-10V32h10z"/></g>
 <path d="M243 30h27v6h7v25h-7v7h-27v-7h-7V38h7z" fill="#f3e3b4"/><path d="M258 26h17v8h9v26h-18v-6h-9V42h-4v-8h5z" fill="#252e4a"/><path d="M241 44h3v10h-3zm4 13h7v3h-7z" fill="#fff4cf"/>
 <g fill="#e7d9af">{[[20,25],[69,57],[107,17],[177,39],[218,11],[300,91],[16,143],[288,178],[39,236],[274,260],[303,312]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path className="scenery-star" style={rhythm(i,4)} d="M0 0h1v3h3v1H1v3H0V4h-3V3h3z"/></g>)}</g>
 <g fill="#b3b5cf">{Array.from({length:38},(_,i)=><rect className="scenery-star-small" style={rhythm(i,6)} key={i} x={(i*79+24)%316} y={(i*43+9)%310} width="1" height={i%3?1:2}/>)}</g>
 <g transform="translate(22 69)"><path className="scenery-meteor" d="M0 0h3v2H0zm4-2h9v1H4zm10-2h12v1H14z" fill="#ede6df" opacity="0"/></g>
 <path d="M0 299h13v-12h14v-16h13v-17h15v-13h17v13h14v15h16v18h18v13h23v-9h18v-18h14v-15h13v-18h16v-12h13v12h14v16h14v17h15v17h16v-12h14v-14h16v-13h16v221H0z" fill="#62657f"/>
 <path d="M43 267h13v-14h14v12h14v10H72v-8H58v8H43zm149-4h12v-18h10v9h12v12h-12v-6h-10v9h-12z" fill="#9592a0" opacity=".55"/>
 <path d="M0 340h24v-11h31v-11h34v10h26v17h35v-7h27v-14h30v-9h31v11h30v-7h29v13h23v148H0z" fill="#3d5865"/>
 <path d="M0 370h320v110H0z" fill="#517984"/><path d="M0 403h320v77H0z" fill="#608d94"/><path d="M0 445h320v35H0z" fill="#6b999b"/>
 <path d="M135 368h47v-5h18v7h18v5h-83z" fill="#38555c"/><Pine x={153} y={335} scale={.55} color="#38555c"/>
 <Shimmer night/>
 <Pine x={-12} y={281} scale={1.8}/><Pine x={20} y={319} scale={1.1}/><Pine x={283} y={273} scale={1.85}/><Pine x={264} y={325} scale={1.05}/>
 <path d="M0 432h34v-8h28v9h27v17h23v30H0zm268 4h26v-13h26v57h-72v-22h20z" fill="#466e6b"/><path d="M0 462h33v-8h38v8h27v18H0zm274 2h46v16h-62v-9h16z" fill="#375a59"/>
 <g transform="translate(28 388)"><path d="M0 19h39v33H0z" fill="#9a8189"/><path d="M-5 19h5v-6h6V7h6V1h13v6h6v6h7v6h6v4H-5z" fill="#c0a0a5"/><path d="M3 21h33v2H3z" fill="#e1c1b2"/><path d="M28 0h5v13h-5z" fill="#9a8189"/>
  <path className="scenery-window" d="M5 29h9v10H5zm17 0h9v10h-9z" fill="#f5d68e"/><path d="M9 29h1v10H9zm17 0h1v10h-1zM5 33h9v1H5zm17 0h9v1h-9z" fill="#b28b77"/><path d="M16 40h7v12h-7z" fill="#5e6672"/>
  <g transform="translate(29 -4)"><path className="scenery-smoke" d="M0 0h3v-4h-2v-4h3v-3h-5v4h-2v4h3z" fill="#b3aec3" opacity=".35"/></g>
 </g>
 <path d="M42 441h16v6h13v6h14v5H52v-6H42zM58 451h2v15h-2zm23 4h2v13h-2z" fill="#a48f83"/>
 <Grass night/><g fill="#f2dfa0">{[[18,392],[300,395],[15,449],[290,460]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path className="scenery-lantern" style={rhythm(i,6)} d="M0 0h2v2H0z"/></g>)}</g>
</>}

// Fixed placement groups contain animated parts. The SVG is also a complete
// still landscape without CSS, so the PNG export uses the same artwork.
export function LetterScenery({theme,miniature=false}:SceneryProps){
 return <svg xmlns="http://www.w3.org/2000/svg" className={`animated-scenery ${miniature?'theme-landscape':'letter-scenery'}`} data-scene={theme} data-animate="true" viewBox="0 0 320 480" width="320" height="480" preserveAspectRatio="none" shapeRendering="crispEdges" fill="none" aria-hidden="true">
  {theme==='night'?<Night/>:theme==='blossom'?<Blossom/>:<Meadow/>}
 </svg>;
}
