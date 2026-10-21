'use client';

import { useEffect, useState } from 'react';

const beats = [
  {
    eyebrow: 'COLLECTIVE INTELLIGENCE IN MOTION',
    title: <>Real human data.<br/><em>For the next generation of intelligence.</em></>,
    body: 'Human demonstrations across real tasks and environments, captured reliably to your specification.',
  },
  {
    eyebrow: 'OPERATIONS',
    title: <>Your collection engine<br/><em>in the real world.</em></>,
    body: 'Your task list, capture rules, and quality thresholds. Our trained demonstrators, environments, supervision, and recurring delivery operation.',
  },
  {
    eyebrow: 'DATA STEWARDSHIP',
    title: <>Collected with integrity.<br/><em>Delivered with exclusivity.</em></>,
    body: 'Every program is collected for a defined client purpose, governed with privacy safeguards, and delivered without resale.',
  },
  {
    eyebrow: 'COVERAGE',
    title: <>The diversity of the real world.<br/><em>Captured.</em></>,
    body: 'Across tasks, environments, and industries, we build diverse collection programs around the real work your systems need to understand.',
  },
];

export default function ScrollStoryCopy(){
  const [active,setActive]=useState(0);
  useEffect(()=>{
    const story=document.querySelector('.story-scroll');
    const coverage=document.querySelector('.coverage-flow');
    const copy=story?.querySelector('.story-copy-sticky') as HTMLElement|null;
    let raf=0;
    let lastActive=-1;
    const clamp=(value:number)=>Math.max(0,Math.min(1,value));
    const update=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!story)return;const rect=story.getBoundingClientRect();const coverageRect=coverage?.getBoundingClientRect();if(copy&&coverageRect){copy.style.opacity=String(clamp((coverageRect.top/window.innerHeight-.15)/.4));}const progress=Math.max(0,Math.min(.999,-rect.top/Math.max(1,rect.height-window.innerHeight)));const nextActive=Math.floor(progress*beats.length);if(nextActive!==lastActive){lastActive=nextActive;setActive(nextActive);}})};
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
  },[]);
  return <div className="story-copy"><div className="story-copy-sticky">
    <div className="story-progress" aria-label={`Story ${active+1} of ${beats.length}`}>{beats.map((_,i)=><i key={i} className={i===active?'active':''}/>)}</div>
    {beats.map((beat,i)=><section className={`story-panel ${i===active?'active':''}`} aria-hidden={i!==active} key={beat.eyebrow}>
      {i!==0&&<div className="section-index">{beat.eyebrow}</div>}
      {i===0?<h1>{beat.title}</h1>:<h2>{beat.title}</h2>}
      <p>{beat.body}</p>
    </section>)}
  </div></div>;
}
