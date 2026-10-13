'use client';

import { useEffect, useState } from 'react';
import { Briefcase, HeartPulse, Bell, Scissors, BookOpen, Heart, Factory, Utensils, Sparkles, PawPrint, Shirt, House, Hammer, HardHat, Car, Wrench, Warehouse, CheckCheck, Sprout, Flower, Zap, Recycle, Settings, Leaf, Move, Blocks, PocketKnife, Package, Layers, Bolt, FlaskConical, Truck, Palette, Cpu, ChefHat, Building } from 'lucide-react';
const icons=[Briefcase,HeartPulse,Bell,Scissors,BookOpen,Heart,Factory,Utensils,Sparkles,PawPrint,Shirt,House,Factory,HardHat,Car,Wrench,Warehouse,CheckCheck,Sprout,Flower,Zap,Recycle,Settings,Leaf,Move,Blocks,PocketKnife,Package,Layers,Bolt,FlaskConical,Truck,Palette,Cpu,ChefHat,Building];

const groups=[
  {kicker:'PEOPLE + SERVICE',title:'Care, service, and everyday work.',body:'Human-centered routines with fine motor actions, tools, objects, and changing context.',items:['Office Administration','Healthcare & Pharmacy','Hospitality','Beauty & Grooming','Education & Childcare','Assisted Living']},
  {kicker:'FOOD + HOME',title:'The physical intelligence of daily life.',body:'High-variation tasks where sequence, dexterity, and object interaction happen naturally.',items:['Food Processing','Food & Beverage','Cleaning & Sanitation','Pet & Animal Care','Laundry & Textile Care','Home Organization']},
  {kicker:'INDUSTRY + WORKSHOP',title:'Workflows shaped by tools and precision.',body:'Structured and long-tail activity across industrial, technical, and production environments.',items:['Manufacturing','Construction','Automotive','Repair & Maintenance','Warehouse Operations','Quality Inspection']},
  {kicker:'FIELD + INFRASTRUCTURE',title:'Real work in changing environments.',body:'Outdoor and distributed workflows where terrain, weather, equipment, and context naturally vary.',items:['Agriculture & Farming','Landscaping & Gardening','Utilities & Infrastructure','Waste & Recycling','Field Maintenance','Environmental Services']},
  {kicker:'DEXTEROUS MANIPULATION',title:'The actions behind physical intelligence.',body:'Reusable manipulation skills collected across objects, tools, materials, and levels of precision.',items:['Pick & Place','Assembly & Disassembly','Tool Use','Sorting & Packing','Folding & Textile Work','Insertion & Fastening']},
  {kicker:'SPECIALIZED ENVIRONMENTS',title:'From careful craft to complex operations.',body:'Domain-specific workflows captured with the context and variation robot learning requires.',items:['Laboratory','Retail & Logistics','Creative Crafts','Electronics & Hardware','Commercial Kitchens','Facility Operations']},
];
const chapters=[...groups,{kicker:'THE COMPLETE FIELD',title:'36 categories. One collection network.',body:'A single operating system for capturing diverse human work across the real world.',items:[]}];

export default function CoverageStory(){
  const [active,setActive]=useState(0);
  useEffect(()=>{const root=document.querySelector('.coverage-flow') as HTMLElement|null;const stage=root?.querySelector('.coverage-sticky') as HTMLElement|null;let raf=0;let lastActive=-1;const clamp=(value:number)=>Math.max(0,Math.min(1,value));const update=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!root)return;const r=root.getBoundingClientRect();const entry=1-r.top/window.innerHeight;root.style.setProperty('--coverage-visible',String(clamp((entry-.85)/.15)));if(stage)stage.style.transform=`translateY(${-Math.max(0,r.top)}px)`;const p=Math.max(0,Math.min(.999,-r.top/Math.max(1,r.height-window.innerHeight)));const nextActive=Math.floor(p*chapters.length);if(nextActive!==lastActive){lastActive=nextActive;setActive(nextActive);}})};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
  const all=groups.flatMap(g=>g.items);
  const shown=active===6?all:groups[active].items;
  return <div className={`coverage-sticky shell continuous-coverage ${active===6?'show-all':''}`}>
    <div className="coverage-copy"><span className="section-index">04 / COVERAGE</span><p>The collection network comes forward—six categories at a time.</p></div>
    <div className="coverage-scenes">{chapters.map((group,g)=><article className={`coverage-scene ${g===active?'active':''} ${g===groups.length?'finale':''}`} key={group.kicker} aria-hidden={g!==active}>
      {g<groups.length&&<span className="coverage-label">Collection categories</span>}
      <h3>{g<groups.length?group.kicker:group.title}</h3>
      {g<groups.length&&<p className="coverage-subtitle">{group.title}</p>}
    </article>)}</div>
    <div className="sr-only">{shown.join(', ')}</div>
    <div className="coverage-progress">{chapters.map((_,i)=><i key={i} className={i===active?'active':''}/>)}</div>
  </div>;
}
