import {createLetterQRCode} from './letter-qr';
import type {Card} from './card-validation';

function textLines(context:CanvasRenderingContext2D,text:string,maxWidth:number):string[]{
 const rows:string[]=[];
 for(const paragraph of text.split('\n')){
  let line='';
  for(const word of paragraph.split(/\s+/)){
   if(!word)continue;
   if(context.measureText((line?line+' ':'')+word).width<=maxWidth){line+=(line?' ':'')+word;continue}
   if(line){rows.push(line);line=''}
   // Preserve very long unbroken names/messages without running off the paper.
   for(const character of word){
    if(context.measureText(line+character).width>maxWidth&&line){rows.push(line);line=''}
    line+=character;
   }
  }
  rows.push(line);
 }
 return rows;
}

async function paintSVG(context:CanvasRenderingContext2D,source:SVGElement,x:number,y:number,width:number,height:number){
 const still=source.cloneNode(true) as SVGElement;
 still.setAttribute('data-animate','false');still.setAttribute('data-paused','true');
 still.setAttribute('data-motion-override','false');
 const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(still)],{type:'image/svg+xml'}));
 try{
  const picture=new Image();
  await new Promise<void>((resolve,reject)=>{picture.onload=()=>resolve();picture.onerror=()=>reject(Error('Could not render letter artwork'));picture.src=url});
  context.drawImage(picture,x,y,width,height);
 }finally{URL.revokeObjectURL(url)}
}

export async function createLetterPNG(card:Card,container:HTMLElement,shareUrl:string):Promise<string>{
 await document.fonts.load('27px "Be Vietnam Pro"');
 await document.fonts.load('16px "Press Start 2P"');
 await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1080;
 const context=canvas.getContext('2d');if(!context)throw Error('Canvas unavailable');
 context.font='27px "Be Vietnam Pro"';
 const message=textLines(context,card.message,790);
 context.font='32px "Be Vietnam Pro"';
 const recipient=textLines(context,card.recipient,810);
 context.font='26px "Be Vietnam Pro"';
 const sender=textLines(context,card.anonymous?'Một người thương bạn':card.sender||'Một người thương bạn',810);
 const nameHeight=Math.max(1,recipient.length)*42;
 const artTop=326+Math.max(0,nameHeight-42);
 const messageTop=artTop+325;
 // Reserve a footer inside the paper for the shared letter's scannable QR.
 canvas.height=Math.max(1750,messageTop+message.length*43+sender.length*37+780);
 context.imageSmoothingEnabled=false;
 const scenery=container.querySelector<SVGElement>('.letter-scenery');
 const flower=container.querySelector<SVGElement>('.card-art');
 if(!scenery||!flower)throw Error('Letter artwork is missing');
 await paintSVG(context,scenery,0,0,canvas.width,canvas.height);

 // Translucent paper lets the landscape remain visible at the edges while
 // keeping every character readable, including over the dark night scene.
 context.fillStyle=card.theme==='night'?'rgba(247,242,251,.94)':card.theme==='blossom'?'rgba(255,246,244,.92)':'rgba(255,252,237,.91)';
 context.fillRect(62,180,956,canvas.height-440);
 context.strokeStyle=card.theme==='night'?'#a49ab6':'#c5b6af';context.lineWidth=2;
 context.strokeRect(62,180,956,canvas.height-440);
 context.strokeStyle='#fff6e8';context.globalAlpha=.65;context.lineWidth=3;
 context.strokeRect(24,24,1032,canvas.height-48);context.globalAlpha=1;
 context.textAlign='center';context.fillStyle='#9b7c84';context.font='20px "Be Vietnam Pro"';
 context.fillText('✧   ·   ✦   ·   ✧',540,226);
 context.font='17px "Be Vietnam Pro"';context.fillText('MỘT BÔNG HOA DÀNH RIÊNG CHO',540,267);
 context.fillStyle='#403349';context.font='32px "Be Vietnam Pro"';
 recipient.forEach((line,i)=>context.fillText(line,540,315+i*42));
 await paintSVG(context,flower,284,artTop,512,358);
 context.font='27px "Be Vietnam Pro"';
 message.forEach((line,i)=>context.fillText(line,540,messageTop+i*43));
 const signatureTop=canvas.height-690-sender.length*37;
 context.font='24px "Be Vietnam Pro"';context.fillText('Với tất cả yêu thương,',540,signatureTop);
 context.font='26px "Be Vietnam Pro"';sender.forEach((line,i)=>context.fillText(line,540,signatureTop+48+i*37));
 context.strokeStyle='#c2b2b8';context.lineWidth=2;context.setLineDash([7,7]);
 context.beginPath();context.moveTo(100,canvas.height-575);context.lineTo(980,canvas.height-575);context.stroke();context.setLineDash([]);
 const qrCanvas=await createLetterQRCode(card,shareUrl,600,true);
 context.drawImage(qrCanvas,450,canvas.height-490,180,180);
 return canvas.toDataURL('image/png');
}
