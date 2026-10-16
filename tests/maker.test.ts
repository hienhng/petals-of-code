import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect} from 'vitest';
import {MakerPanel} from '../app/maker-panel';
import type {Card} from '../lib/card-validation';
import {gardenPosition,clampGardenPosition,gardenPositionOverlapsFlower} from '../lib/garden-position';
const card:Card={flower:'tulip',theme:'meadow',recipient:'Mẹ yêu',message:'Cảm ơn mẹ thật nhiều!',sender:'Con',anonymous:false,shareSender:false,decorations:['bees','cranes','music']};
const panel=(step:number)=>renderToStaticMarkup(createElement(MakerPanel,{step,card,busy:false,onStep:()=>{},onChange:()=>{},onSubmit:()=>{},onSelect:()=>{}}));
describe('focused creator panels',()=>{
 it('only renders the choices belonging to the current step',()=>{
  const flower=panel(1),background=panel(2),decorations=panel(3),content=panel(4);
  expect(flower).toContain('flower-story');expect(flower).not.toContain('theme-option');expect(flower).not.toContain('<textarea');
  expect(background).toContain('theme-option');expect(background).not.toContain('flower-options');expect(background).not.toContain('decoration-options');
  expect(decorations).toContain('Ong nhỏ');expect(decorations).not.toContain('flower-options');expect(decorations).not.toContain('<textarea');
  expect(content).toContain('<textarea');expect(content).not.toContain('flower-options');expect(content).not.toContain('theme-option');
 });
 it('keeps completed content when revisiting its panel',()=>{const html=panel(4);expect(html).toContain(card.recipient);expect(html).toContain(card.message);expect(html).toContain('value="Con"')});
});
describe('garden placement',()=>{
 it('keeps user coordinates unchanged and bounds pointer and keyboard input',()=>{expect(gardenPosition({...card,id:'saved',gardenX:37.4,gardenY:82.1})).toEqual({x:37.4,y:82.1});expect(clampGardenPosition(-10,150)).toEqual({x:12,y:94});expect(gardenPosition({...card,id:'old'})).toEqual(gardenPosition({...card,id:'old'}))});
 it('rejects positions too close in both coordinates',()=>{
  const neighbor={x:50,y:60};
  expect(gardenPositionOverlapsFlower({x:50,y:60},neighbor)).toBe(true);
  expect(gardenPositionOverlapsFlower({x:61.9,y:71.9},neighbor)).toBe(true);
  expect(gardenPositionOverlapsFlower({x:62,y:60},neighbor)).toBe(false);
  expect(gardenPositionOverlapsFlower({x:50,y:72},neighbor)).toBe(false);
  expect(gardenPositionOverlapsFlower({x:62,y:60},neighbor,1.2)).toBe(true);
 });
});
