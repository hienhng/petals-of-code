'use client';

import {useEffect} from 'react';

/** Soft, varied calls using the same user-enabled audio context as other effects. */
export function GardenBirdsong({context}:{context:AudioContext|null}){
 useEffect(()=>{
  if(!context)return;
  let timer:number|undefined;
  const voices=new Set<OscillatorNode>();
  const stop=()=>{
   window.clearTimeout(timer);
   voices.forEach(voice=>{try{voice.stop()}catch{}});
   voices.clear();
  };
  const sing=()=>{
   if(document.hidden)return;
   if(context.state==='running'){
    const base=2100+Math.random()*1300;
    const notes=2+Math.floor(Math.random()*3);
    const pan=context.createStereoPanner();
    pan.pan.value=Math.random()*1.2-.6;pan.connect(context.destination);
    let remaining=notes;
    for(let i=0;i<notes;i++){
     const start=context.currentTime+.04+i*.17;
     const length=.085+Math.random()*.055;
     const pitch=base*(1+(i%2)*.16);
     const voice=context.createOscillator(),gain=context.createGain();
     voice.type='sine';
     voice.frequency.setValueAtTime(pitch*.8,start);
     voice.frequency.exponentialRampToValueAtTime(pitch*1.25,start+length*.35);
     voice.frequency.exponentialRampToValueAtTime(pitch*.72,start+length);
     gain.gain.setValueAtTime(0,start);
     gain.gain.linearRampToValueAtTime(.018,start+.012);
     gain.gain.exponentialRampToValueAtTime(.0001,start+length);
     voice.connect(gain);gain.connect(pan);voices.add(voice);
     voice.onended=()=>{
      voices.delete(voice);voice.disconnect();gain.disconnect();
      if(--remaining===0)pan.disconnect();
     };
     voice.start(start);voice.stop(start+length+.01);
    }
   }
   timer=window.setTimeout(sing,3500+Math.random()*4500);
  };
  const onVisibility=()=>{
   stop();
   if(!document.hidden)timer=window.setTimeout(sing,600);
  };
  timer=window.setTimeout(sing,400);
  document.addEventListener('visibilitychange',onVisibility);
  return()=>{stop();document.removeEventListener('visibilitychange',onVisibility)};
 },[context]);
 return null;
}
