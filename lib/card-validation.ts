export const flowers=['tulip','rose','sunflower','cherry','lavender','daisy','lily','lotus','orchid','hydrangea','peony','cosmos','iris','daffodil','poppy','marigold','hibiscus','bluebell'] as const;
export const themes=['meadow','blossom','night'] as const;
export const decorationOptions=['ribbon','butterflies','hearts','sparkles','fireflies','petals','bees','cranes','music'] as const;
export type Decoration=typeof decorationOptions[number];
export type Card={id?:string;flower:string;theme:string;recipient:string;message:string;sender:string;anonymous:boolean;shareSender:boolean;decorations?:Decoration[];gardenX?:number|null;gardenY?:number|null};
export function validateCard(v:any):Card|null{
 if(!v||!flowers.includes(v.flower)||!themes.includes(v.theme)||typeof v.recipient!=='string'||typeof v.message!=='string'||typeof v.sender!=='string'||typeof v.anonymous!=='boolean'||typeof v.shareSender!=='boolean')return null;
 const recipient=v.recipient.trim(),message=v.message.trim(),sender=v.anonymous?'':v.sender.trim();
 if(!recipient||recipient.length>60||message.length<5||message.length>500||sender.length>40||(!v.anonymous&&!sender))return null;
 const decorations=v.decorations===undefined?[]:v.decorations;
 if(!Array.isArray(decorations)||decorations.length>3||new Set(decorations).size!==decorations.length||!decorations.every(d=>decorationOptions.includes(d)))return null;
 return {flower:v.flower,theme:v.theme,recipient,message,sender,anonymous:v.anonymous,shareSender:v.shareSender,decorations};
}
