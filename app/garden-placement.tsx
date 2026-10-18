import {useEffect,useRef,useState,type PointerEvent,type KeyboardEvent} from 'react';
import type {Card} from '../lib/card-validation';
import {clampGardenPosition,gardenPosition,gardenPositionOverlapsFlower,type GardenPosition} from '../lib/garden-position';
import {CardArtwork} from './card-art';

function previewFlowerScale(){return Math.max(.75,Math.min(165,window.innerWidth*.165)/168)}
type PlacementFlower=Card&{status:'pending'|'approved'};

export function GardenPlacement({card,value,onChange,onOverlapChange}:{card:Card;value:GardenPosition|null;onChange:(position:GardenPosition)=>void;onOverlapChange:(overlapping:boolean|null)=>void}){
 const[neighbors,setNeighbors]=useState<PlacementFlower[]>([]),[loadState,setLoadState]=useState('loading'),[placementNotice,setPlacementNotice]=useState('');
 const[flowerScale,setFlowerScale]=useState(1);
 const map=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const updateScale=()=>setFlowerScale(previewFlowerScale());
  updateScale();
  window.addEventListener('resize',updateScale);
  return()=>window.removeEventListener('resize',updateScale);
 },[]);
 useEffect(()=>{
  const controller=new AbortController();
  fetch('/api/cards?placement=1',{signal:controller.signal}).then(async response=>{
   if(!response.ok)throw Error();
   const data=await response.json();
   setNeighbors(data.cards as PlacementFlower[]);setLoadState('ready');
  }).catch(()=>{if(!controller.signal.aborted)setLoadState('error')});
  return()=>controller.abort();
 },[]);
 useEffect(()=>{
  onOverlapChange(loadState==='ready'&&value
   ?neighbors.some(neighbor=>gardenPositionOverlapsFlower(value,gardenPosition(neighbor),flowerScale))
   :null);
 },[loadState,neighbors,value,flowerScale,onOverlapChange]);
 function placeAt(x:number,y:number){
  const position=clampGardenPosition(x,y);
  const overlapping=loadState==='ready'&&neighbors.some(neighbor=>gardenPositionOverlapsFlower(position,gardenPosition(neighbor),flowerScale));
  onChange(position);
  onOverlapChange(loadState==='ready'?overlapping:null);
  setPlacementNotice(overlapping?'Vị trí này chạm vào một bông hoa khác. Hãy chọn vị trí khác trước khi trồng.':'');
 }
 function place(event:PointerEvent<HTMLButtonElement>){
  const bounds=event.currentTarget.getBoundingClientRect();
  placeAt((event.clientX-bounds.left)/bounds.width*100,(event.clientY-bounds.top)/bounds.height*100);
 }
 function move(event:KeyboardEvent<HTMLButtonElement>){
  const current=value||{x:50,y:60},distance=event.shiftKey?5:1;
  if(event.key==='Enter'||event.key===' '){event.preventDefault();placeAt(current.x,current.y);return}
  const delta:Record<string,[number,number]>={ArrowLeft:[-distance,0],ArrowRight:[distance,0],ArrowUp:[0,-distance],ArrowDown:[0,distance]};
  if(!delta[event.key])return;event.preventDefault();placeAt(current.x+delta[event.key][0],current.y+delta[event.key][1]);
 }
 return <div className="garden-placement">
  <h4>Chọn một chỗ cho bông hoa của bạn</h4>
  <p id="placement-help">Chạm vào bãi cỏ để đặt hoa. Kéo để đổi chỗ, hoặc dùng phím mũi tên khi chọn bản đồ.</p>
  <button ref={map} type="button" className="plant-map" aria-label="Chọn vị trí trồng hoa trong vườn" aria-describedby="placement-help placement-status" onKeyDown={move} onPointerDown={event=>{if(event.button!==0)return;event.currentTarget.setPointerCapture(event.pointerId);place(event)}} onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))place(event)}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}}>
   <span className="map-sky"/>
   {neighbors.map(neighbor=>{const spot=gardenPosition(neighbor);return <span key={neighbor.id} className={`plant-marker neighbor-marker ${neighbor.status==='pending'?'pending-marker':''}`} style={{left:`${spot.x}%`,top:`${spot.y}%`}}><CardArtwork flower={neighbor.flower} decorations={neighbor.decorations} small/></span>})}
   {value?<span className="plant-marker chosen-marker" style={{left:`${value.x}%`,top:`${value.y}%`}}><CardArtwork flower={card.flower} decorations={card.decorations} small/><span className="chosen-label">Hoa của bạn</span></span>:<span className="map-prompt">✿ Chạm để gieo một bông hoa</span>}
  </button>
  <p className="placement-status" id="placement-status" aria-live="polite">{placementNotice|| (value?`Đã chọn vị trí · ngang ${value.x}%, dọc ${value.y}%`:'Chưa chọn vị trí trồng hoa.')}</p>
  {loadState==='loading'&&<p className="placement-note">Đang xem những bông hoa ở góc vườn mới nhất…</p>}
  {loadState==='error'&&<p className="placement-note">Chưa tải được hoa xung quanh. Bạn vẫn có thể chọn vị trí.</p>}
  <p className="placement-note">Hoa sẽ xuất hiện ở vị trí này sau khi LTPC duyệt lời chúc.</p>
 </div>;
}
