import type {CSSProperties} from 'react';
import {FlowerPixels} from './pixel-art';

// Seeded detail keeps the server and client render identical.
const noise = (seed: number) => Math.abs(Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1;
const varieties = ['daisy', 'cosmos', 'tulip', 'lavender', 'bluebell', 'cherry', 'sunflower'];
const breeze = (seed: number): CSSProperties => ({
  '--breeze-duration': `${4.5 + noise(seed) * 3.5}s`,
  '--breeze-delay': `${-noise(seed + 9) * 12}s`,
  '--breeze-angle': `${1.5 + noise(seed + 5) * 2}deg`,
} as CSSProperties);

function BlossomTree({x, y, scale = 1}: {x: number; y: number; scale?: number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M59 69h13v65H59zM59 104H43V88h-9V75h7v10h9v11h9m12-5h13V75h8V64h6v18h-7v17H71" fill="#98796e"/>
    <path d="M65 73h5v58h-5z" fill="#c09a85"/>
    <path d="M50 133h32v4H50z" fill="#829b71" opacity=".5"/>
    <g className="scene-canopy">
      {Array.from({length: 29 * 21}, (_, i) => {
        const col = i % 29, row = Math.floor(i / 29);
        const dx = (col - 14) / 14, dy = (row - 10) / 10;
        if (dx * dx + dy * dy > .88 + noise(i) * .18) return null;
        const colors = row > 15 ? ['#c989a1', '#dfa0b5', '#e9afc1'] : row > 10 ? ['#e6a4bb', '#efb7cb', '#f6c6d4'] : ['#eeb5c8', '#f6cbd8', '#ffdfdf'];
        return <rect key={i} x={col * 4} y={row * 4} width="4" height="4" fill={colors[Math.floor(noise(i + 21) * 3)]}/>;
      })}
      <path d="M28 24h8v4h-8zm20-12h4v4h-4zm24 16h8v4h-8zm16 16h4v4h-4zM36 52h4v4h-4z" fill="#fff0e5"/>
    </g>
  </g>;
}

function Wildflower({x, y, scale, type, seed}: {x: number; y: number; scale: number; type: string; seed: number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="0" rx="11" ry="2" fill="#789465" opacity=".2"/>
    <g className="scene-flower" style={breeze(seed)}>
      <g transform="translate(-16 -38)"><FlowerPixels type={type}/></g>
    </g>
  </g>;
}

function GrassTufts() {
  return <g fill="#87a370" opacity=".58">
    {Array.from({length: 42}, (_, i) => {
      const x = Math.round(noise(i + 400) * 1200);
      const y = Math.round(22 + noise(i + 510) * 570);
      return <g key={i} transform={`translate(${x} ${y}) scale(${.65 + noise(i + 610) * .55})`}>
        <path className="garden-grass-blade" style={breeze(i)} d="M0 0v-12h-3v-5h3v5h3v6h3v-15h3v21h4v-10h3V0z"/>
      </g>;
    })}
  </g>;
}

/** Reuses only the homepage's pixel-grass texture and tufts over the garden's flat field. */
export function MeadowGrassTexture() {
  return <svg className="meadow-grass-texture" viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <defs>
      <pattern id="garden-home-grass" width="74" height="49" patternUnits="userSpaceOnUse">
        <path d="M8 25v-5h2v5h4v-3h2v5H8m34 11v-5h2v7h-6v-2" fill="#91aa76" opacity=".46"/>
        <path d="M23 9h3v2h-3zm37 32h4v2h-4z" fill="#e4e7bf" opacity=".7"/>
      </pattern>
    </defs>
    <rect width="1200" height="620" fill="url(#garden-home-grass)"/>
    <GrassTufts/>
  </svg>;
}

export function GardenScene() {
  return <svg className="garden-scene refined-garden" viewBox="0 0 1200 620" preserveAspectRatio="xMidYMax slice" fill="none" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <defs>
      <pattern id="home-grass" width="74" height="49" patternUnits="userSpaceOnUse">
        <path d="M8 25v-5h2v5h4v-3h2v5H8m34 11v-5h2v7h-6v-2" fill="#91aa76" opacity=".46"/>
        <path d="M23 9h3v2h-3zm37 32h4v2h-4z" fill="#e4e7bf" opacity=".7"/>
      </pattern>
    </defs>
    <g className="scene-clouds" fill="#fffaf0" opacity=".85">
      <path d="M66 102h24V86h56v8h24v10h28v12H66zM920 78h25V62h45v9h24v13h31v12H920zM370 45h20V34h35v7h25v12h-80z"/>
      <path d="M1050 180h30v-14h44v9h24v14h-98z"/>
    </g>
    <path d="M0 357h76v-10h70v8h112v-8h94v9h100v-8h95v9h115v-6h130v-8h80v8h116v8h112v261H0z" fill="#dce3c2"/>
    <path d="M0 400h130v-10h108v12h169v-8h140v9h130v-14h180v12h143v-8h200v227H0z" fill="#cad7ad"/>
    <path d="M0 459h170v-9h138v8h184v-6h144v8h132v-11h190v13h242v158H0z" fill="#b9cd9d"/>
    <rect y="416" width="1200" height="204" fill="url(#home-grass)"/>
    <path d="M573 408h53v44h-14v34h22v38h22v40h33v56H502v-51h25v-47h20v-42h26z" fill="#d4c498"/>
    <path d="M579 408h41v44h-14v34h22v38h22v40h33v56H508v-51h25v-47h20v-42h26z" fill="#ecddba"/>
    <path d="M584 412h22v38h-14v39h20v36h-16v39h20v56h-62v-50h13v-44h15v-43h2z" fill="#f4e7c9"/>
    <g fill="#d5c79e" opacity=".7"><path d="M592 458h10v3h-10zm-29 46h9v3h-9zm38 32h13v3h-13zm-47 49h12v4h-12zm73 14h14v3h-14z"/></g>
    <BlossomTree x={-42} y={174} scale={2.55}/>
    <BlossomTree x={935} y={196} scale={2.3}/>
    <BlossomTree x={245} y={343} scale={.7}/>
    <BlossomTree x={831} y={347} scale={.66}/>
    <g fill="#fff0d1">
      <path d="M0 454h257v7H0zm0 25h257v7H0z"/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${i * 30} 442h8v66h-8z`}/>)}
    </g>
    <g transform="translate(864 432)">
      <path d="M20 15h7v65h-7z" fill="#9a7c64"/><path d="M0 0h43v33H0z" fill="#9e6b7d"/>
      <path d="M3 3h37v26H3z" fill="#eab3c1"/><path d="M7 7h28v17H7z" fill="#fff1d6"/>
      <path d="M7 7h5v4h5v4h7v-4h6V7h5v5h-5v4h-6v4h-7v-4h-5v-4H7z" fill="#c28b8e"/>
      <path d="M40 -9h4v25h-4zm4 0h13v9H44z" fill="#ad7289"/>
    </g>
    {/* Tiny distant flowers build depth before the larger foreground beds. */}
    <g opacity=".7">
      {Array.from({length: 36}, (_, i) => {
        const x = 32 + noise(i + 51) * 1130, y = 418 + noise(i + 80) * 47;
        if (x > 535 && x < 660) return null;
        return <g key={i} transform={`translate(${Math.round(x)} ${Math.round(y)})`}>
          <path d="M0 0h2v9H0z" fill="#8ba374"/><path d="M-2 -2h6v4h-6zM0 -4h2v8H0z" fill={['#f5e7b9', '#e4a4bd', '#fff6df', '#b1a6cd'][i % 4]}/>
        </g>;
      })}
    </g>
    {Array.from({length: 64}, (_, i) => {
      const y = 484 + noise(i + 100) * 129;
      const x = 35 + noise(i + 200) * 1125;
      const pathLeft = 547 - (y - 484) * .36, pathRight = 638 + (y - 484) * .4;
      if (x > pathLeft - 22 && x < pathRight + 22) return null;
      return {x, y, seed: i, scale: .4 + (y - 484) / 150 + noise(i + 320) * .2};
    }).filter(item => item !== null).sort((a, b) => a.y - b.y).map(item =>
      <Wildflower key={item.seed} {...item} type={varieties[item.seed % varieties.length]}/>
    )}
    {/* Readable silhouettes in little groups beside the path. */}
    {[[420, 575, 'lavender'], [446, 587, 'daisy'], [470, 580, 'cosmos'], [491, 600, 'tulip'], [713, 580, 'daisy'], [738, 594, 'bluebell'], [765, 584, 'tulip'], [792, 608, 'cosmos']].map(([x, y, type], i) =>
      <Wildflower key={i} x={Number(x)} y={Number(y)} type={String(type)} scale={i % 3 === 0 ? 1.3 : 1.05} seed={i + 80}/>
    )}
    <GrassTufts/>
    <g className="scene-petals">
      {Array.from({length: 13}, (_, i) => <g key={i} transform={`translate(${88 + noise(i + 500) * 1020} ${165 + noise(i + 600) * 310})`}>
        <g className="scene-petal" style={{'--petal-delay': `${-i * 1.73}s`, '--petal-duration': `${11 + noise(i + 77) * 7}s`} as CSSProperties}>
          <path d="M2 0h5v3H5v2H0V2h2z" fill={i % 3 ? '#f1b8cc' : '#ffe1de'}/>
        </g>
      </g>)}
    </g>
    <g className="scene-pollen" fill="#fff5cc">
      {[[380, 468], [456, 529], [747, 490], [821, 545], [340, 572], [699, 554]].map(([x, y], i) => <rect key={i} className="scene-mote" x={x} y={y} width={i % 2 ? 2 : 3} height={i % 2 ? 2 : 3} style={{animationDelay: `${-i * 1.4}s`}}/>)}
    </g>
  </svg>;
}
