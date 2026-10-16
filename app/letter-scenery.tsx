type SceneryProps={theme:string;miniature?:boolean};

function Cloud({x,y,scale=1}:{x:number;y:number;scale?:number}){
 return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 12h8V4h10V0h22v4h10v8h12v10H0z" fill="#fff9e8"/><path d="M0 20h62v4H0z" fill="#f5efdc" opacity=".7"/></g>;
}
function Grass({night=false}:{night?:boolean}){
 return <g fill={night?'#658075':'#8da767'}>{Array.from({length:27},(_,i)=>{const x=(i*47+12)%312,y=382+(i*23)%94;return <path key={i} d={`M${x} ${y}v-4h2v4h4v-2h2v4h-8z`}/>})}</g>;
}
function Flowers({pink=false}:{pink?:boolean}){
 return <g>{Array.from({length:21},(_,i)=>{const x=(i*61+14)%312,y=386+(i*19)%88;return <g key={i} transform={`translate(${x} ${y})`}><path d="M0 0h2v12H0zm0 7h-4V3h2v2h2" fill="#628358"/><path d="M-2 -4h2v2h2v-2h2v6h-6z" fill={pink?['#f9c3d1','#db91b1','#f6d2da'][i%3]:['#e5b35c','#efb7b7','#f4e2a8'][i%3]}/></g>})}</g>;
}
function Pine({x,y,scale=1,color='#3c4a55'}:{x:number;y:number;scale?:number;color?:string}){
 return <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}><path d="M14 0h6v8h6v8h6v8h-4v6h8v8H20v16h-6V38H0v-8h8v-6H4v-8h6V8h4z"/></g>;
}
function BlossomTree({x,y,scale=1}:{x:number;y:number;scale?:number}){
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <path d="M30 40h8v62h-8zm-12 8h6v18h12v6H18zm18 10h10V42h6v24H36z" fill="#947079"/>
  <path d="M12 0h32v6h12v10h8v24h-8v12H42v6H16v-6H4V40H0V16h6V6h6z" fill="#d892ad"/>
  <path d="M14 2h28v6h12v10h8v16H48v10H28v-6H12V26H4V16h8z" fill="#f0b2c8"/>
  <path d="M18 6h10v6H18zm22 8h10v6H40zM8 24h10v6H8zm18 8h10v6H26zm20-2h8v6h-8z" fill="#ffd5df"/>
 </g>;
}

// Every shape is aligned to a pixel grid. The same SVG paints the live letter
// and the downloaded image; it needs no external images, CSS, or fonts.
export function LetterScenery({theme,miniature=false}:SceneryProps){
 return <svg xmlns="http://www.w3.org/2000/svg" className={miniature?'theme-landscape':'letter-scenery'}
  data-scene={theme} viewBox="0 0 320 480" width="320" height="480" preserveAspectRatio="none"
  shapeRendering="crispEdges" fill="none" aria-hidden="true">
  {theme==='night'?<>
   <path fill="#2f304c" d="M0 0h320v480H0z"/>
   <path fill="#383953" d="M0 94h320v170H0z"/><path fill="#42445f" d="M0 220h320v146H0z"/>
   <path d="M258 24h28v6h8v26h-8v8h-28v-8h-8V32h8z" fill="#eee1ac"/>
   <path d="M270 20h22v8h8v26h-16v-6h-10V36h-4z" fill="#2f304c"/>
   <g fill="#f0e0ac">{[[18,22],[60,55],[106,16],[178,38],[224,12],[300,82],[16,137],[284,174],[42,230],[272,260],[302,312]].map(([x,y],i)=><path key={i} d={`M${x} ${y}h2v4h4v2h-4v4h-2v-4h-4v-2h4z`}/>)}</g>
   <g fill="#a9a8c4">{Array.from({length:35},(_,i)=><rect key={i} x={(i*79+24)%316} y={(i*43+9)%330} width="2" height="2"/>)}</g>
   <path d="M28 69h26v2H28zm-6 2h8v2h-8zm-6 2h8v2h-8z" fill="#c2bed7"/>
   <path d="M0 300h18v-12h18v-10h18v-14h26v14h18v16h28v14h22v-12h20v-18h20v-14h26v16h22v14h28v-18h22v-12h24v216H0z" fill="#555475"/>
   <path d="M0 340h28v-12h34v-12h36v12h38v18h42v-10h26v-14h42v10h36v-10h38v158H0z" fill="#3c5260"/>
   <path d="M0 398h320v82H0z" fill="#536f77"/><path d="M0 430h320v50H0z" fill="#607f7f"/>
   <g fill="#9bad9b" opacity=".65"><path d="M224 413h28v2h-28zm-14 7h46v2h-46zm13 10h36v2h-36zm-3 9h48v2h-48zm-9 12h58v2h-58z"/><path d="M65 449h30v2H65zm-7 10h46v2H58z"/></g>
   <Pine x={-8} y={310} scale={1.6}/><Pine x={25} y={335} scale={1.1}/><Pine x={278} y={295} scale={1.7}/><Pine x={258} y={340} scale={1.1}/>
   <path d="M0 462h52v-8h30v8h32v18H0zm274-8h46v26h-70v-16h24z" fill="#384f50"/>
   <path d="M23 411h34v38H23z" fill="#826e7f"/><path d="M17 411h6v-6h6v-6h6v-6h10v6h6v6h6v6h6v4H17z" fill="#b3999c"/>
   <path d="M30 420h8v10h-8zm14 0h8v10h-8z" fill="#f5d68e"/><path d="M36 437h10v12H36z" fill="#4b4f60"/>
   <Grass night/>
  </>:theme==='blossom'?<>
   <path fill="#f8e3ec" d="M0 0h320v480H0z"/><path fill="#f4d9e6" d="M0 148h320v190H0z"/>
   <Cloud x={109} y={27} scale={.85}/><Cloud x={222} y={91} scale={.7}/>
   <path d="M0 294h30v-10h34v-12h44v12h42v-8h44v12h40v-14h42v12h44v194H0z" fill="#d4c5d4"/>
   <path d="M0 332h40v-12h52v16h48v-12h44v14h44v-8h50v-12h42v162H0z" fill="#b8c7a5"/>
   <path d="M0 376h58v-12h50v10h58v12h44v-8h62v-14h48v116H0z" fill="#a8be99"/>
   <path d="M124 397h70v8h30v12h24v18h30v45H68v-24h28v-20h16v-19h12z" fill="#b1cdd0"/>
   <path d="M135 415h64v4h-64zm-18 16h52v3h-52zm58 16h64v3h-64zm-58 17h84v3h-84z" fill="#d7e5df"/>
   <BlossomTree x={-28} y={264} scale={1.5}/><BlossomTree x={246} y={265} scale={1.6}/>
   <g transform="translate(-8 -14)"><path d="M0 12h20v8h16v8h18v8h14v6H46v-8H28v-8H12v-6H0z" fill="#b88f97"/><path d="M8 6h24v4h14v8h12v12H44v-6H28v-6H8zm36 18h20v6h14v14H58v-8H44z" fill="#edb4cc"/><path d="M14 8h10v4H14zm25 9h10v4H39zm20 11h8v4h-8z" fill="#ffd9e4"/></g>
   <g transform="translate(322 -1) scale(-1 1)"><path d="M0 12h20v8h16v8h18v8h14v6H46v-8H28v-8H12v-6H0z" fill="#b88f97"/><path d="M8 6h24v4h14v8h12v12H44v-6H28v-6H8zm36 18h20v6h14v14H58v-8H44z" fill="#edb4cc"/></g>
   <g fill="#e6a6bd">{[[31,96],[280,74],[17,188],[301,231],[27,284],[274,354],[76,385],[289,446],[29,459]].map(([x,y],i)=><path key={i} d={`M${x} ${y}h4v2h-2v2h-4v-2h2z`}/>)}</g>
   <path d="M132 428h8v-8h12v-6h26v6h12v8h8v8h-66zm4 8h6v12h-6zm52 0h6v12h-6z" fill="#b18c8d"/>
   <path d="M140 427h48v4h-48z" fill="#e6c1b0"/>
   <Flowers pink/>
  </>:<>
   <path fill="#dcecf0" d="M0 0h320v480H0z"/><path fill="#e6efdf" d="M0 150h320v180H0z"/>
   <path d="M258 24h24v6h8v24h-8v8h-24v-8h-8V32h8z" fill="#f3d68e"/>
   <path d="M260 29h20v4h5v18h-5v6h-20v-6h-5V35h5z" fill="#ffe5a1"/>
   <g fill="#efcf83"><path d="M268 10h4v8h-4zm0 58h4v8h-4zm-30-28h8v4h-8zm58 0h8v4h-8zM245 17h4v6h-4zm43 43h4v6h-4z"/></g>
   <Cloud x={17} y={33} scale={.9}/><Cloud x={101} y={91} scale={.7}/><Cloud x={240} y={139} scale={.9}/>
   <path d="M30 143h6v2h6v2h-2v2h-4v-2h-6zm17-8h5v2h5v2h-2v2h-3v-2h-5z" fill="#93a49a"/>
   <path d="M0 292h24v-12h24v-12h30v-12h36v10h34v14h28v-12h26v-14h38v10h24v12h30v12h26v192H0z" fill="#c5d5a3"/>
   <path d="M0 334h24v-12h28v-10h34v12h34v16h34v12h40v-12h28v-16h26v-10h36v12h36v154H0z" fill="#abc58c"/>
   <path d="M0 382h34v-10h48v10h44v14h40v-8h42v-12h42v-14h36v10h34v108H0z" fill="#93b475"/>
   <path d="M152 370h20v20h-8v24h16v20h18v22h20v24h-98v-20h12v-24h12v-24h8z" fill="#e8d7a5"/>
   <path d="M158 372h8v22h-6v22h12v20h-12v24h20v20h-42v-24h10v-24h8v-22h2z" fill="#f3e3b8"/>
   <path d="M0 423h80v5H0zm0 19h80v5H0z" fill="#f3e6c6"/>
   <g fill="#fff1cf">{[6,25,44,63].map(x=><path key={x} d={`M${x} 411h6v48h-6z`}/>)}</g>
   <path d="M12 353h8v47h-8zm-9 0h28v-12h-4v-10H9v10H3z" fill="#77965d"/><path d="M8 333h16v16H8z" fill="#a4ba7b"/>
   <path d="M283 347h7v53h-7z" fill="#967f5f"/><path d="M271 320h28v6h8v28h-8v8h-28v-8h-8v-24h8z" fill="#72915c"/><path d="M273 323h22v6h8v14h-22v9h-14v-20h6z" fill="#a9bc7e"/>
   <Grass/><Flowers/>
  </>}
 </svg>;
}
