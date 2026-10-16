'use client';

import {useEffect, useRef} from 'react';
import {FlowerPixels} from './pixel-art';

function Fern({x, y, flip = false}: {x: number; y: number; flip?: boolean}) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <path d="M0 0h3v-18h4v-15h4v-15h4v-10h3v-12h3v-7h3v-9h-3v7h-5v9h-4v12H8v10H4v15H0z" fill="#789568"/>
    {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${i * 4} ${-14 - i * 16})`}>
      <path d="M2 0h-10v-4h-8v-5h-6v-7h8v4h8v5h8z" fill="#9db380"/>
      <path d="M3 -7h8v-5h8v-5h7v8h-6v5h-9v4H3z" fill="#b4c698"/>
    </g>)}
  </g>;
}

function Mushroom({x, y, small = false}: {x: number; y: number; small?: boolean}) {
  return <g transform={`translate(${x} ${y}) scale(${small ? .65 : 1})`}>
    <path d="M12 15h9v18h-3v3H9v-4h3z" fill="#dfc9a8"/>
    <path d="M15 16h5v16h-5z" fill="#fff0d5"/>
    <path d="M8 0h17v4h6v6h4v10H0V10h4V4h4z" fill="#b9767c"/>
    <path d="M9 2h15v4h6v6h3v4H3v-5h4V6h2z" fill="#dda1a0"/>
    <path d="M10 5h5v5h-5zm12 5h6v4h-6zM4 12h5v4H4z" fill="#fff2da"/>
  </g>;
}

function Bee({x, y}: {x: number; y: number}) {
  return <g transform={`translate(${x} ${y})`}><g className="nature-bee">
    <g className="nature-bee-wing"><path d="M7 6V1h6v7h3V2h6v7h-5v4H8V9H4V6z" fill="#e4eee2"/></g>
    <g className="nature-bee-body">
    <path d="M5 10h17v3h4v8h-5v3H5v-3H1v-8h4z" fill="#e5b95e"/>
    <path d="M8 10h3v14H8zm8 0h3v14h-3z" fill="#75634f"/>
    <path d="M22 14h3v4h-3z" fill="#30282d"/>
    <path d="M4 13h3v4H4z" fill="#f8d98c"/>
    </g>
  </g></g>;
}

/** Decorative SVGs have no focus targets and never intercept clicks. */
export function NaturePatch({className = '', variant = 'flowers'}: {className?: string; variant?: 'flowers' | 'woodland'}) {
  return <svg className={`nature-decoration nature-patch ${className}`} viewBox="0 0 240 150" fill="none" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <path d="M8 139h20v-5h39v5h56v-4h71v4h35v5H8z" fill="#dfe5c8"/>
    <Fern x={43} y={138}/><Fern x={197} y={139} flip/>
    <g className="nature-sprigs">
      <g transform="translate(73 56) scale(1.7)"><FlowerPixels type={variant === 'flowers' ? 'daisy' : 'bluebell'}/></g>
      <g transform="translate(125 80) scale(1.4)"><FlowerPixels type={variant === 'flowers' ? 'cosmos' : 'lavender'}/></g>
      <g transform="translate(33 97)"><FlowerPixels type="daisy"/></g>
    </g>
    <Mushroom x={172} y={108}/><Mushroom x={207} y={120} small/>
    <path d="M61 141v-12h-4v-6h4v6h4v-10h3v12h4v-5h3v15zm91 0v-10h-4v-4h4v4h4v-8h3v18z" fill="#8ca56e"/>
    <path d="M19 143h16v-4h-4v-4h-8v4h-4zm104 1h14v-4h-3v-3h-8v3h-3z" fill="#bbbda5"/>
    <Bee x={147} y={34}/>
  </svg>;
}

export function HangingVine({className = ''}: {className?: string}) {
  return <svg className={`nature-decoration nature-vine ${className}`} viewBox="0 0 130 210" fill="none" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <g className="nature-vine-sway">
      <path d="M6 0h5v24h15v27h17v26h18v26h17v25h16v32h15v30h-4v-27H90v-32H74v-25H57V80H39V54H22V28H6z" fill="#8fa777"/>
      {[[22, 27], [40, 55], [58, 81], [75, 108], [92, 138]].map(([x, y], i) => <g key={x} transform={`translate(${x} ${y})`}>
        <path d="M0 0h-13v-4h-9v-7h-5v-9h10v4h10v7h7z" fill={i % 2 ? '#b6c79c' : '#9db786'}/>
        <path d="M3 5V-8h5v-9h8v-6h9v12h-5v9h-9v7z" fill={i % 2 ? '#9db786' : '#b6c79c'}/>
      </g>)}
      <path d="M99 177h7v-5h7v5h6v7h-6v7h-7v-7h-7z" fill="#e4adbc"/>
      <path d="M106 178h6v6h-6z" fill="#f5d88b"/>
    </g>
  </svg>;
}

export function MeadowBorder() {
  return <div className="home-meadow" aria-hidden="true">
    <svg viewBox="0 0 1200 104" preserveAspectRatio="xMidYMax meet" fill="none" shapeRendering="crispEdges" focusable="false">
      <path d="M0 93h80v-5h90v5h160v-4h120v4h140v-6h180v6h100v-4h150v4h180v11H0z" fill="#dce3c3"/>
      {Array.from({length: 25}, (_, i) => <g key={i} transform={`translate(${i * 51 - 8} ${i % 3 === 0 ? 32 : 53}) scale(${i % 3 === 0 ? 1.5 : 1})`}>
        <FlowerPixels type={['daisy', 'lavender', 'cosmos', 'tulip', 'bluebell'][i % 5]}/>
      </g>)}
      {Array.from({length: 19}, (_, i) => <path key={i} d={`M${i * 67 + 18} 97v-13h-4v-6h4v6h4v-12h3v25h4v-8h4v8z`} fill={i % 2 ? '#a5b987' : '#b9c99c'}/>)}
      <Mushroom x={230} y={66} small/><Mushroom x={907} y={60}/>
    </svg>
    <MeadowInsects/>
  </div>;
}

function MeadowInsects() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const bees = Array.from(layer.querySelectorAll<SVGSVGElement>('.meadow-insect-flight'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    let disposed = false;
    const random = (min: number, max: number) => min + Math.random() * (max - min);

    function stop() {
      bees.forEach(bee => { delete bee.dataset.pollinating; });
      animations.splice(0).forEach(animation => {
        animation.onfinish = null;
        animation.cancel();
      });
    }

    function fly(bee: SVGSVGElement, index: number, firstPass: boolean) {
      if (!layer || disposed || motion.matches) return;
      const width = layer.clientWidth;
      const isButterfly = bee.classList.contains('meadow-butterfly-flight');
      const size = bee.getBoundingClientRect().width;
      const fromLeft = Math.random() < .5;
      const start = fromLeft ? -size - 8 : width + size + 8;
      const end = fromLeft ? width + size + 8 : -size - 8;
      const maxY = Math.max(0, layer.clientHeight - size - 12);
      const bounds = layer.getBoundingClientRect();
      // Read the rendered blooms so visits also line up with the cropped mobile meadow.
      const flowers = Array.from(layer.parentElement?.querySelectorAll<SVGGElement>('.flower-bloom') ?? [])
        .map(flower => {
          const bloom = flower.getBoundingClientRect();
          return {
            x: bloom.left + bloom.width / 2 - bounds.left - size / 2,
            y: Math.max(0, Math.min(maxY, bloom.top + bloom.height / 2 - bounds.top - size * .8)),
          };
        })
        .filter(flower => flower.x > size && flower.x < width - size * 2);
      const stops = [];
      const visitCount = Math.min(flowers.length, Math.floor(random(1, 4)));
      for (let visit = 0; visit < visitCount; visit++) {
        stops.push(flowers.splice(Math.floor(random(0, flowers.length)), 1)[0]);
      }
      stops.sort((a, b) => fromLeft ? a.x - b.x : b.x - a.x);
      const points = [{x: start, y: random(0, maxY)}, ...stops, {x: end, y: random(0, maxY)}];
      const facing = `scaleX(${fromLeft ? 1 : -1})`;

      function play(frames: Keyframe[], options: KeyframeAnimationOptions, done: () => void) {
        if (disposed || motion.matches) return;
        const animation = bee.animate(frames, {...options, fill: 'both'});
        animations[index] = animation;
        animation.onfinish = () => {
          animation.onfinish = null;
          animation.cancel();
          done();
        };
      }

      function travel(leg: number) {
        delete bee.dataset.pollinating;
        const current = points[leg];
        const target = points[leg + 1];
        const dx = target.x - current.x;
        const lift = isButterfly ? random(22, 46) : random(12, 35);
        // Each approach follows a cubic arc, then slows to rest at the bloom.
        bee.style.offsetPath = `path("M ${current.x} ${current.y} C ${current.x + dx / 3} ${Math.max(0, current.y - lift)} ${target.x - dx / 3} ${Math.max(0, target.y - lift)} ${target.x} ${target.y}")`;
        play([
          {offsetDistance: '0%', transform: facing},
          {offsetDistance: '100%', transform: facing},
        ], {
          duration: Math.max(isButterfly ? 1400 : 900, Math.hypot(dx, target.y - current.y) / (isButterfly ? random(65, 105) : random(130, 200)) * 1000),
          delay: leg === 0 ? (firstPass ? index * 1400 + random(100, 500) : random(500, 1800)) : 0,
          easing: 'ease-in-out',
        }, () => {
          if (leg === points.length - 2) {
            fly(bee, index, false);
            return;
          }
          bee.dataset.pollinating = 'true';
          // Hold the landing position briefly before visiting the next flower.
          play([
            {offsetDistance: '100%', transform: facing},
            {offsetDistance: '100%', transform: facing},
          ], {duration: isButterfly ? random(1400, 2800) : random(1000, 2200)}, () => travel(leg + 1));
        });
      }

      travel(0);
    }

    function restart() {
      stop();
      if (!motion.matches) bees.forEach((bee, index) => fly(bee, index, true));
    }

    const resize = new ResizeObserver(restart);
    resize.observe(layer);
    motion.addEventListener('change', restart);
    restart();

    return () => {
      disposed = true;
      stop();
      resize.disconnect();
      motion.removeEventListener('change', restart);
    };
  }, []);

  return <div className="meadow-bees" ref={layerRef}>
    {[0, 1].map(index => <svg key={index} className="meadow-insect-flight meadow-bee-flight" viewBox="0 0 28 26" fill="none" shapeRendering="crispEdges" focusable="false">
      <Bee x={0} y={0}/>
    </svg>)}
    {['lavender', 'peach'].map(color => <svg key={color} className={`meadow-insect-flight meadow-butterfly-flight meadow-butterfly-${color}`} viewBox="0 0 28 26" fill="none" shapeRendering="crispEdges" focusable="false">
      <g className="meadow-butterfly-wings">
        <path d="M2 3h7v3h4v9H6v-4H2zm24 0h-7v3h-4v9h7v-4h4zM6 15h7v8H8v-3H6zm9 0h7v5h-2v3h-5z" fill={color === 'lavender' ? '#ad91c7' : '#d998a9'}/>
        <path d="M4 5h4v4H4zm16 0h4v4h-4zM8 17h3v3H8zm9 0h3v3h-3z" fill={color === 'lavender' ? '#e4d2ed' : '#f8d4c2'}/>
      </g>
      <path d="M13 7h2v15h-2zM11 4h2v4h-2zm4 0h2v4h-2z" fill="#695568"/>
    </svg>)}
  </div>;
}
