'use client';

import {useEffect,useRef} from 'react';
import './garden-life.css';
import {BeePixels,ButterflyPixels} from './insect-art';
import {BirdPixels} from './bird-art';
import {GardenBirdsong} from './garden-birdsong';

function BeeSprite(){return <svg viewBox="-1 -1 18 20" width="28" height="28" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><BeePixels/></svg>}
function ButterflySprite(){return <svg viewBox="-1 -1 18 16" width="32" height="28" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><ButterflyPixels/></svg>}
function BirdSprite(){return <svg viewBox="0 0 26 24" width="44" height="40" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><BirdPixels/></svg>}

/** A decorative, click-through layer. Wildlife wanders around the garden. */
export function GardenLife({flowerCount,soundContext=null}:{flowerCount:number;soundContext?:AudioContext|null}){
 const layer=useRef<HTMLDivElement>(null);
 const beeCount=Math.min(10,4+Math.floor(flowerCount/3));
 const butterflyCount=Math.min(8,3+Math.floor(flowerCount/5));
 useEffect(()=>{
  const element=layer.current,host=element?.parentElement;if(!element||!host)return;
  let active=true;
  const timers=new Set<number>(),flights=new Set<Animation>();
  const insects=Array.from(element.querySelectorAll<HTMLElement>('.garden-insect,.garden-bird'));
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const later=(callback:()=>void,delay:number)=>{const id=window.setTimeout(()=>{timers.delete(id);if(active)callback()},delay);timers.add(id)};
  let nextTakeoff=performance.now()+150;
  const scheduleTakeoff=(callback:()=>void)=>{
   const now=performance.now(),departure=Math.max(now,nextTakeoff);
   nextTakeoff=departure+100+Math.random()*160;
   later(callback,departure-now);
  };
  const measure=()=>{element.style.height=`${Math.max(host.clientHeight,host.scrollHeight)}px`};
  const observer=new ResizeObserver(measure);observer.observe(host);
  const field=host.querySelector('.flower-field');if(field)observer.observe(field);measure();

  insects.forEach((insect,index)=>{
   insect.hidden=true;
   const isButterfly=insect.classList.contains('garden-butterfly');
   const isBird=insect.classList.contains('garden-bird');
   if(!isButterfly&&!isBird){
    insect.style.setProperty('--bee-wing-speed',`${.13+Math.random()*.08}s`);
    insect.style.setProperty('--bee-wing-delay',`${-Math.random()*1.2}s`);
   }
   let position={x:0,y:0};
   const face=insect.querySelector<HTMLElement>('.garden-insect-facing,.garden-bird-facing');
   const randomPosition=(grounded=false)=>{
    const width=host.clientWidth,height=Math.max(host.clientHeight,host.scrollHeight);
    return {
     x:12+Math.random()*Math.max(1,width-56),
     y:grounded?height*.24+Math.random()*Math.max(1,height*.48-40):12+Math.random()*Math.max(1,height-56),
    };
   };
   // Keep birds visible and still when reduced motion is requested.
   const restBird=()=>{
    position={x:host.clientWidth*(.18+(index-beeCount-butterflyCount)*.3),y:Math.max(12,host.clientHeight*.55-40)};
    insect.style.transform=`translate(${position.x}px,${position.y}px)`;
    insect.dataset.phase='perched';insect.hidden=false;
   };
   const outsidePosition=()=>{
    const width=host.clientWidth,height=Math.max(host.clientHeight,host.scrollHeight);
    const edge=Math.floor(Math.random()*4);
    if(edge===0)return {x:-42,y:18+Math.random()*Math.max(1,height-56)};
    if(edge===1)return {x:width+42,y:18+Math.random()*Math.max(1,height-56)};
    if(edge===2)return {x:12+Math.random()*Math.max(1,width-56),y:-42};
    return {x:12+Math.random()*Math.max(1,width-56),y:height+42};
   };
   const beginVisit=():void=>{
    if(!active)return;
    position=outsidePosition();
    insect.style.transform=`translate(${position.x}px,${position.y}px)`;
    insect.hidden=false;
    tour(true);
   };
   const tour=(entering=false)=>scheduleTakeoff(()=>{
    if(!active)return;
    if(isBird&&reducedMotion.matches){restBird();return}
    const flowers=Array.from(host.querySelectorAll<SVGSVGElement>('.garden-flower .card-art'));
    const flower=!isBird&&!entering&&index%2===0&&flowers.length&&Math.random()<.65?flowers[Math.floor(Math.random()*flowers.length)]:null;
    const leaving=!entering&&!flower&&Math.random()<.2;
    const landing=isBird&&!leaving&&(entering||Math.random()<.65);
    const bounds=host.getBoundingClientRect(),flowerBounds=flower?.getBoundingClientRect();
    const next=leaving?outsidePosition():flowerBounds?{
     x:Math.max(5,Math.min(host.clientWidth-32,flowerBounds.left-bounds.left+host.scrollLeft+flowerBounds.width*.5-11)),
     y:Math.max(5,Math.min(Math.max(host.clientHeight,host.scrollHeight)-32,flowerBounds.top-bounds.top+host.scrollTop+flowerBounds.height*.38-19)),
    }:randomPosition(landing);
    const dx=next.x-position.x,dy=next.y-position.y;
    const lift=Math.min(isBird?110:65,18+Math.hypot(dx,dy)*.13);
    const control1={x:position.x+dx*.3,y:Math.max(8,position.y+dy*.08-lift)};
    const control2={x:next.x-dx*.3,y:Math.max(8,next.y-dy*.08-lift)};
    // Sample a continuous Bézier arc, then distribute timing by distance.
    // This avoids the sharp corner and speed jump of a three-point flight.
    const points=Array.from({length:41},(_,i)=>{
     const t=i/40,u=1-t;
     return {x:u*u*u*position.x+3*u*u*t*control1.x+3*u*t*t*control2.x+t*t*t*next.x,
      y:u*u*u*position.y+3*u*u*t*control1.y+3*u*t*t*control2.y+t*t*t*next.y};
    });
    let pathLength=0;
    const distances=points.map((p,i)=>{if(i)pathLength+=Math.hypot(p.x-points[i-1].x,p.y-points[i-1].y);return pathLength});
    // Distance-based offsets and duration keep every bee at the same speed.
    const duration=Math.max(1,pathLength*(isBird?4.5:7));
    if(face)face.style.transform=next.x<position.x?'scaleX(-1)':'scaleX(1)';
    insect.dataset.phase=leaving?'leaving':entering?'entering':'flying';delete insect.dataset.flower;
    const flight=insect.animate(points.map((p,i)=>({
     transform:`translate(${p.x}px,${p.y}px)`,offset:pathLength?distances[i]/pathLength:i/40,
    })),{duration,easing:'linear',fill:'forwards'});
    flights.add(flight);
    flight.finished.then(()=>{
     if(!active)return;
     insect.style.transform=`translate(${next.x}px,${next.y}px)`;position=next;
     flights.delete(flight);flight.cancel();
     if(leaving){
      insect.hidden=true;insect.dataset.phase='waiting';
      later(beginVisit,900+Math.random()*1600);
      return;
     }
     insect.dataset.phase=landing?'perched':flower?'visiting':'wandering';
     if(flower)insect.dataset.flower=String(flowers.indexOf(flower));
     later(tour,landing?2200+Math.random()*3200:flower?650+Math.random()*750:50+Math.random()*180);
    }).catch(()=>{flights.delete(flight)});
   });
   if(isBird&&reducedMotion.matches)restBird();
   else later(beginVisit,isBird?200+Math.random()*1200:150+Math.random()*600);
  });
  return()=>{active=false;observer.disconnect();timers.forEach(id=>window.clearTimeout(id));flights.forEach(animation=>animation.cancel())};
 },[flowerCount,beeCount,butterflyCount]);

 return <div className="garden-life" ref={layer} aria-hidden="true">
  <GardenBirdsong context={soundContext}/>
  <svg className="garden-wind" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
   <path className="garden-gust gust-one" d="M-80 90h60v-6h80v6h90v-6h100v6h90v-6h70"/>
   <path className="garden-gust gust-two" d="M370 215h80v7h85v-7h110v7h90v-7h115"/>
   <path className="garden-gust gust-three" d="M20 325h70v-5h100v5h80v-5h115"/>
  </svg>
  {[0,1,2,3].map(i=><svg key={i} className={`garden-wind-leaf wind-leaf-${i}`} viewBox="0 0 12 12" width="14" height="14"><path d="M6 0h6v6h-3v3H6v3H0V6h3V3h3z" fill={i%2?'#bdac79':'#9cae79'}/><path d="M3 7h2V5h2V3h2v2H7v2H5v2H3z" fill="#d2d9a5"/></svg>)}
  {Array.from({length:beeCount},(_,i)=><div key={`bee-${i}`} className="garden-insect garden-bee" data-phase="waiting" hidden><div className="garden-insect-facing"><BeeSprite/></div></div>)}
  {Array.from({length:butterflyCount},(_,i)=><div key={`butterfly-${i}`} className="garden-insect garden-butterfly" data-phase="waiting" hidden><div className="garden-insect-facing"><ButterflySprite/></div></div>)}
  {['bluebird','robin','goldfinch'].map(bird=><div key={bird} className={`garden-bird garden-${bird}`} data-phase="waiting" hidden><div className="garden-bird-facing"><BirdSprite/></div></div>)}
 </div>;
}
