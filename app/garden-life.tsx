'use client';

import {useEffect,useRef} from 'react';
import './garden-life.css';
import {BeePixels,ButterflyPixels} from './insect-art';

function BeeSprite(){return <svg viewBox="-1 -1 18 20" width="28" height="28" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><BeePixels/></svg>}
function ButterflySprite(){return <svg viewBox="-1 -1 18 16" width="32" height="28" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><ButterflyPixels/></svg>}

/** A decorative, click-through layer. Insects wander around the garden. */
export function GardenLife({flowerCount}:{flowerCount:number}){
 const layer=useRef<HTMLDivElement>(null);
 const beeCount=Math.min(10,4+Math.floor(flowerCount/3));
 const butterflyCount=Math.min(8,3+Math.floor(flowerCount/5));
 useEffect(()=>{
  const element=layer.current,host=element?.parentElement;if(!element||!host)return;
  let active=true;
  const timers=new Set<number>(),flights=new Set<Animation>();
  const insects=Array.from(element.querySelectorAll<HTMLElement>('.garden-insect'));
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
   if(!isButterfly){
    insect.style.setProperty('--bee-wing-speed',`${.13+Math.random()*.08}s`);
    insect.style.setProperty('--bee-wing-delay',`${-Math.random()*1.2}s`);
   }
   let position={x:0,y:0};
   const face=insect.querySelector<HTMLElement>('.garden-insect-facing');
   const randomPosition=()=>{
    const width=host.clientWidth,height=Math.max(host.clientHeight,host.scrollHeight);
    return {
     x:12+Math.random()*Math.max(1,width-56),
     y:12+Math.random()*Math.max(1,height-56),
    };
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
    const flowers=Array.from(host.querySelectorAll<SVGSVGElement>('.garden-flower .card-art'));
    const flower=!entering&&index%2===0&&flowers.length&&Math.random()<.65?flowers[Math.floor(Math.random()*flowers.length)]:null;
    const leaving=!entering&&!flower&&Math.random()<.2;
    const bounds=host.getBoundingClientRect(),flowerBounds=flower?.getBoundingClientRect();
    const next=leaving?outsidePosition():flowerBounds?{
     x:Math.max(5,Math.min(host.clientWidth-32,flowerBounds.left-bounds.left+host.scrollLeft+flowerBounds.width*.5-11)),
     y:Math.max(5,Math.min(Math.max(host.clientHeight,host.scrollHeight)-32,flowerBounds.top-bounds.top+host.scrollTop+flowerBounds.height*.38-19)),
    }:randomPosition();
    const dx=next.x-position.x,dy=next.y-position.y;
    const lift=Math.min(65,18+Math.hypot(dx,dy)*.13);
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
    const duration=Math.max(1,pathLength*7);
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
     insect.dataset.phase=flower?'visiting':'wandering';
     if(flower)insect.dataset.flower=String(flowers.indexOf(flower));
     later(tour,flower?650+Math.random()*750:50+Math.random()*180);
    }).catch(()=>{flights.delete(flight)});
   });
   later(beginVisit,150+Math.random()*600);
  });
  return()=>{active=false;observer.disconnect();timers.forEach(id=>window.clearTimeout(id));flights.forEach(animation=>animation.cancel())};
 },[flowerCount]);

 return <div className="garden-life" ref={layer} aria-hidden="true">
  <svg className="garden-wind" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
   <path className="garden-gust gust-one" d="M-80 90h60v-6h80v6h90v-6h100v6h90v-6h70"/>
   <path className="garden-gust gust-two" d="M370 215h80v7h85v-7h110v7h90v-7h115"/>
   <path className="garden-gust gust-three" d="M20 325h70v-5h100v5h80v-5h115"/>
  </svg>
  {[0,1,2,3].map(i=><svg key={i} className={`garden-wind-leaf wind-leaf-${i}`} viewBox="0 0 12 12" width="14" height="14"><path d="M6 0h6v6h-3v3H6v3H0V6h3V3h3z" fill={i%2?'#bdac79':'#9cae79'}/><path d="M3 7h2V5h2V3h2v2H7v2H5v2H3z" fill="#d2d9a5"/></svg>)}
  {Array.from({length:beeCount},(_,i)=><div key={`bee-${i}`} className="garden-insect garden-bee" data-phase="waiting" hidden><div className="garden-insect-facing"><BeeSprite/></div></div>)}
  {Array.from({length:butterflyCount},(_,i)=><div key={`butterfly-${i}`} className="garden-insect garden-butterfly" data-phase="waiting" hidden><div className="garden-insect-facing"><ButterflySprite/></div></div>)}
 </div>;
}
