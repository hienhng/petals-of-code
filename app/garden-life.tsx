'use client';

import {useEffect,useRef} from 'react';
import './garden-life.css';

function BeeSprite(){return <svg viewBox="0 0 24 24" width="28" height="28" shapeRendering="crispEdges" aria-hidden="true">
 <g className="garden-bee-wing"><path d="M7 4h4v3h2V3h4v5h-3v3H8V8H5V5h2z" fill="#f5f4d9"/><path d="M8 5h2v3H8zm6-1h2v3h-2z" fill="#d5e3db"/></g>
 <g className="garden-bee-body"><path d="M5 10h12v2h3v6h-3v2H5v-2H2v-6h3z" fill="#725e45"/><path d="M5 11h11v2h2v4h-2v2H5v-2H3v-4h2z" fill="#edc36b"/><path d="M7 11h2v8H7zm5 0h2v8h-2z" fill="#806843"/><path d="M19 12h3v5h-3z" fill="#806843"/><rect x="20" y="12" width="1" height="2" fill="#403349"/><path d="M1 13h2v3H0v-2h1z" fill="#806843"/><path d="M6 10h7v1H6z" fill="#ffe2a0"/></g>
 <g className="garden-bee-pollen" opacity="0" fill="#f5d68b"><rect x="6" y="20" width="2" height="2"/><rect x="14" y="19" width="1" height="2"/><rect x="10" y="22" width="1" height="1"/></g>
 </svg>}

/** A decorative, click-through layer. Bees visit real flowers on this page. */
export function GardenLife({flowerCount}:{flowerCount:number}){
 const layer=useRef<HTMLDivElement>(null);
 const beeCount=Math.max(0,Math.floor(flowerCount/2));
 useEffect(()=>{
  const element=layer.current,host=element?.parentElement;if(!element||!host)return;
  let active=true;
  const timers=new Set<number>(),flights=new Set<Animation>(),claimed=new Set<Element>();
  const bees=Array.from(element.querySelectorAll<HTMLElement>('.garden-bee'));
  const later=(callback:()=>void,delay:number)=>{const id=window.setTimeout(()=>{timers.delete(id);if(active)callback()},delay);timers.add(id)};
  let nextTakeoff=performance.now()+150;
  const scheduleTakeoff=(callback:()=>void)=>{
   const now=performance.now(),departure=Math.max(now,nextTakeoff);
   // Space every departure, including returns and moves between flowers.
   nextTakeoff=departure+650+Math.random()*750;
   later(callback,departure-now);
  };
  const measure=()=>{element.style.height=`${Math.max(host.clientHeight,host.scrollHeight)}px`};
  const observer=new ResizeObserver(measure);observer.observe(host);
  const field=host.querySelector('.flower-field');if(field)observer.observe(field);measure();

  bees.forEach(bee=>{
   bee.hidden=true;
   const restTime=1100+Math.random()*1800;
   bee.style.setProperty('--bee-wing-speed',`${.13+Math.random()*.08}s`);
   bee.style.setProperty('--bee-wing-delay',`${-Math.random()*1.2}s`);
   let position={x:-42,y:30},last:Element|null=null,reserved:Element|null=null,visitsRemaining=0;
   const face=bee.querySelector<HTMLElement>('.garden-bee-facing');
   const outside=()=>{
    const width=host.clientWidth,height=Math.max(host.clientHeight,host.scrollHeight);
    const edge=Math.floor(Math.random()*4);
    if(edge===0)return {x:-42,y:18+Math.random()*Math.max(1,height-56)};
    if(edge===1)return {x:width+42,y:18+Math.random()*Math.max(1,height-56)};
    if(edge===2)return {x:12+Math.random()*Math.max(1,width-48),y:-42};
    return {x:12+Math.random()*Math.max(1,width-48),y:height+42};
   };
   const beginVisit=():void=>{
    if(!active)return;
    position=outside();last=null;
    visitsRemaining=flowerCount?2+Math.floor(Math.random()*3):1+Math.floor(Math.random()*2);
    bee.style.transform=`translate(${position.x}px,${position.y}px)`;
    bee.hidden=false;
    tour();
   };
   const tour=()=>scheduleTakeoff(()=>{
    if(!active)return;
    if(reserved)claimed.delete(reserved);
    const leaving=visitsRemaining<=0;
    const flowers=Array.from(host.querySelectorAll<SVGSVGElement>('.garden-flower .card-art'));
    let candidates=flowers.filter(f=>f!==last&&!claimed.has(f));
    // When every flower is occupied, prefer another flower over getting stuck
    // visiting the same one forever in a small garden.
    if(!candidates.length)candidates=flowers.filter(f=>f!==last);
    if(!candidates.length)candidates=flowers;
    const target=!leaving&&candidates.length?candidates[Math.floor(Math.random()*candidates.length)]:null;
    reserved=target;if(target)claimed.add(target);
    const bounds=host.getBoundingClientRect(),flower=target?.getBoundingClientRect();
    const width=host.clientWidth,height=Math.max(host.clientHeight,host.scrollHeight);
    const next=leaving?outside():{
     x:Math.max(5,Math.min(width-32,flower?flower.left-bounds.left+host.scrollLeft+flower.width*.5-11:25+Math.random()*Math.max(1,width-70))),
     y:Math.max(5,Math.min(height-32,flower?flower.top-bounds.top+host.scrollTop+flower.height*.38-19:45+Math.random()*Math.max(1,host.clientHeight-110))),
    };
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
    const duration=Math.max(1,pathLength*12);
    if(face)face.style.transform=next.x<position.x?'scaleX(-1)':'scaleX(1)';
    bee.dataset.phase=leaving?'leaving':'flying';delete bee.dataset.flower;
    const flight=bee.animate(points.map((p,i)=>({
     transform:`translate(${p.x}px,${p.y}px)`,offset:pathLength?distances[i]/pathLength:i/40,
    })),{duration,easing:'linear',fill:'forwards'});
    flights.add(flight);
    flight.finished.then(()=>{
     if(!active)return;
     bee.style.transform=`translate(${next.x}px,${next.y}px)`;position=next;
     flights.delete(flight);flight.cancel();
     if(leaving){
      bee.hidden=true;bee.dataset.phase='waiting';last=null;reserved=null;
      later(beginVisit,1000+Math.random()*2000);
      return;
     }
     visitsRemaining--;
     bee.dataset.phase=target?'visiting':'hovering';
     if(target)bee.dataset.flower=String(flowers.indexOf(target));
     last=target;
     later(tour,target?restTime+Math.random()*1800:1200+Math.random()*1000);
    }).catch(()=>{flights.delete(flight)});
   });
   later(beginVisit,150+Math.random()*600);
  });
  return()=>{active=false;observer.disconnect();timers.forEach(id=>window.clearTimeout(id));flights.forEach(animation=>animation.cancel());claimed.clear()};
 },[flowerCount]);

 return <div className="garden-life" ref={layer} aria-hidden="true">
  <svg className="garden-wind" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
   <path className="garden-gust gust-one" d="M-80 90h60v-6h80v6h90v-6h100v6h90v-6h70"/>
   <path className="garden-gust gust-two" d="M370 215h80v7h85v-7h110v7h90v-7h115"/>
   <path className="garden-gust gust-three" d="M20 325h70v-5h100v5h80v-5h115"/>
  </svg>
  {[0,1,2,3].map(i=><svg key={i} className={`garden-wind-leaf wind-leaf-${i}`} viewBox="0 0 12 12" width="14" height="14"><path d="M6 0h6v6h-3v3H6v3H0V6h3V3h3z" fill={i%2?'#bdac79':'#9cae79'}/><path d="M3 7h2V5h2V3h2v2H7v2H5v2H3z" fill="#d2d9a5"/></svg>)}
  {Array.from({length:beeCount},(_,i)=><div key={i} className="garden-bee" data-phase="waiting" hidden><div className="garden-bee-facing"><BeeSprite/></div></div>)}
 </div>;
}
