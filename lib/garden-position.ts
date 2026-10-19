import type {Card} from './card-validation';
export type GardenPosition={x:number;y:number};
export const gardenBounds={left:12,right:88,top:25,bottom:94};
export const gardenOverlapRadius={x:12,y:12};
export function validGardenPosition(x:unknown,y:unknown):boolean{
 return typeof x==='number'&&typeof y==='number'&&Number.isFinite(x)&&Number.isFinite(y)&&x>=12&&x<=88&&y>=25&&y<=94;
}
export function clampGardenPosition(x:number,y:number):GardenPosition{
 return {x:Math.round(Math.max(12,Math.min(88,x))*10)/10,y:Math.round(Math.max(25,Math.min(94,y))*10)/10};
}
export function gardenPositionOverlapsFlower(position:GardenPosition,flower:GardenPosition,flowerScale=1):boolean{
 return Math.abs(position.x-flower.x)<gardenOverlapRadius.x*flowerScale&&Math.abs(position.y-flower.y)<gardenOverlapRadius.y*flowerScale;
}
export function gardenPosition(card:Card):GardenPosition{
 if(validGardenPosition(card.gardenX,card.gardenY))return {x:card.gardenX!,y:card.gardenY!};
 // Older greetings have no chosen position. Keep their fallback stable across
 // reloads and pagination without moving any user-placed flowers.
 let hash=0;for(const char of card.id||card.recipient)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
 return {x:12+(hash%761)/10,y:25+(Math.floor(hash/761)%691)/10};
}
export function gardenDisplayPosition(index:number,mobile:boolean):GardenPosition{
 const columns=mobile?2:5,rows=mobile?5:4;
 const column=index%columns,row=Math.floor(index/columns);
 const rowOffset=row%2===0?-1:1;
 const x=mobile?(column===0?27:73)+rowOffset*3:16+column*17+rowOffset*4;
 const y=mobile?27+row*16+(row%2)*4:28+row*20+(row%2)*4;
 return {x:Math.min(gardenBounds.right,Math.max(gardenBounds.left,x)),y:Math.min(gardenBounds.bottom,Math.max(gardenBounds.top,y))};
}
