'use client';

import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  FogExp2,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from 'three';
import { staticPath } from '@/lib/static-path';

const categories=[
  ['Office Administration','▦'],['Healthcare & Pharmacy','✚'],['Hospitality','⌂'],['Beauty & Grooming','✂'],['Education & Childcare','▤'],['Assisted Living','♡'],
  ['Food Processing','◇'],['Food & Beverage','◡'],['Cleaning & Sanitation','✦'],['Pet & Animal Care','♧'],['Laundry & Textile Care','≈'],['Home Organization','□'],
  ['Manufacturing','⚙'],['Construction','△'],['Automotive','◉'],['Repair & Maintenance','⌁'],['Warehouse Operations','▣'],['Quality Inspection','✓'],
  ['Agriculture & Farming','♢'],['Landscaping & Gardening','♤'],['Utilities & Infrastructure','ϟ'],['Waste & Recycling','↻'],['Field Maintenance','⊹'],['Environmental Services','◌'],
  ['Pick & Place','↕'],['Assembly & Disassembly','⊞'],['Tool Use','⌕'],['Sorting & Packing','▥'],['Folding & Textile Work','≋'],['Insertion & Fastening','⊥'],
  ['Laboratory','△'],['Retail & Logistics','▱'],['Creative Crafts','✧'],['Electronics & Hardware','⌗'],['Commercial Kitchens','◒'],['Facility Operations','⌂'],
] as const;

type SceneLanguage = 'en' | 'zh' | 'ko';

const sceneCategoryTranslations: Record<string, { zh: string; ko: string }> = {
  'Office Administration': { zh: '办公室行政', ko: '사무 행정' },
  'Healthcare & Pharmacy': { zh: '医疗与药房', ko: '의료 및 약국' },
  'Hospitality': { zh: '酒店与接待', ko: '접객 서비스' },
  'Beauty & Grooming': { zh: '美容护理', ko: '미용 및 관리' },
  'Education & Childcare': { zh: '教育与托育', ko: '교육 및 보육' },
  'Assisted Living': { zh: '生活辅助', ko: '생활 지원' },
  'Food Processing': { zh: '食品加工', ko: '식품 가공' },
  'Food & Beverage': { zh: '餐饮', ko: '식음료' },
  'Cleaning & Sanitation': { zh: '清洁与卫生', ko: '청소 및 위생' },
  'Pet & Animal Care': { zh: '宠物与动物护理', ko: '반려동물 및 동물 돌봄' },
  'Laundry & Textile Care': { zh: '洗衣与织物护理', ko: '세탁 및 섬유 관리' },
  'Home Organization': { zh: '家居整理', ko: '집 정리' },
  'Manufacturing': { zh: '制造业', ko: '제조' },
  'Construction': { zh: '建筑施工', ko: '건설' },
  'Automotive': { zh: '汽车', ko: '자동차' },
  'Repair & Maintenance': { zh: '维修与维护', ko: '수리 및 유지보수' },
  'Warehouse Operations': { zh: '仓储运营', ko: '창고 운영' },
  'Quality Inspection': { zh: '质量检验', ko: '품질 검사' },
  'Agriculture & Farming': { zh: '农业与农场作业', ko: '농업 및 농장 작업' },
  'Landscaping & Gardening': { zh: '园林与园艺', ko: '조경 및 원예' },
  'Utilities & Infrastructure': { zh: '公用事业与基础设施', ko: '공공시설 및 인프라' },
  'Waste & Recycling': { zh: '废弃物与回收', ko: '폐기물 및 재활용' },
  'Field Maintenance': { zh: '现场维护', ko: '현장 유지보수' },
  'Environmental Services': { zh: '环境服务', ko: '환경 서비스' },
  'Pick & Place': { zh: '抓取与放置', ko: '집기 및 놓기' },
  'Assembly & Disassembly': { zh: '组装与拆卸', ko: '조립 및 분해' },
  'Tool Use': { zh: '工具使用', ko: '도구 사용' },
  'Sorting & Packing': { zh: '分拣与包装', ko: '분류 및 포장' },
  'Folding & Textile Work': { zh: '折叠与纺织作业', ko: '접기 및 섬유 작업' },
  'Insertion & Fastening': { zh: '插入与紧固', ko: '삽입 및 체결' },
  'Laboratory': { zh: '实验室', ko: '실험실' },
  'Retail & Logistics': { zh: '零售与物流', ko: '소매 및 물류' },
  'Creative Crafts': { zh: '创意工艺', ko: '창작 공예' },
  'Electronics & Hardware': { zh: '电子与硬件', ko: '전자 및 하드웨어' },
  'Commercial Kitchens': { zh: '商用厨房', ko: '상업용 주방' },
  'Facility Operations': { zh: '设施运营', ko: '시설 운영' },
};

const sceneText = {
  en: { task: 'TASK / MOTION', collection: 'REAL-WORLD COLLECTION' },
  zh: { task: '任务 / 动作', collection: '真实世界采集' },
  ko: { task: '작업 / 모션', collection: '현실 세계 수집' },
};

function getSceneLanguage(): SceneLanguage {
  const lang = document.documentElement.lang.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ko')) return 'ko';
  return 'en';
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.includes(' ') ? text.split(' ') : Array.from(text);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const separator = text.includes(' ') && line ? ' ' : '';
    const test = line ? `${line}${separator}${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  lines.push(line);
  return lines;
}

function streamTexture(index:number, language:SceneLanguage='en'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=288;const ctx=canvas.getContext('2d')!;
  const group=Math.floor(index/6);const accent=['#78c9ff','#ffbf69','#8fe0c1','#d8ef74','#f499a4','#67dce5'][group];const palettes=[['#101923','#203e54'],['#1b1812','#493721'],['#101c1b','#25443b'],['#191d12','#394522'],['#1e151b','#482b36'],['#101c20','#21434b']];const [dark,tint]=palettes[group];
  const gradient=ctx.createLinearGradient(0,0,512,288);gradient.addColorStop(0,dark);gradient.addColorStop(1,tint);ctx.fillStyle=gradient;ctx.fillRect(0,0,512,288);
  ctx.globalAlpha=.32;ctx.fillStyle=accent;ctx.fillRect(55+(index*29)%210,68,110,8);ctx.fillRect(245,95+(index*17)%80,170,5);ctx.globalAlpha=.18;ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(28,28,456,232);ctx.beginPath();ctx.moveTo(0,210-index%4*18);ctx.lineTo(512,110+index%5*14);ctx.stroke();
  ctx.globalAlpha=.14;ctx.lineWidth=1;for(let x=72;x<480;x+=68){ctx.beginPath();ctx.moveTo(x,72);ctx.lineTo(x,225);ctx.stroke()}for(let y=90;y<225;y+=45){ctx.beginPath();ctx.moveTo(28,y);ctx.lineTo(484,y);ctx.stroke()}
  const [categoryName,icon]=categories[index];const category=language==='en'?categoryName:sceneCategoryTranslations[categoryName]?.[language]??categoryName;const px=145,py=148;ctx.globalAlpha=.76;ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py,48,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.95;ctx.fillStyle=accent;ctx.font='52px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(icon,px,py+2);ctx.textAlign='left';ctx.textBaseline='alphabetic';
  ctx.globalAlpha=.55;ctx.fillStyle='#9eb0cb';ctx.font='12px monospace';ctx.fillText(`00:${String((index*3)%60).padStart(2,'0')}:${String((index*7)%60).padStart(2,'0')}`,350,82);ctx.fillText(sceneText[language].task,300,222);for(let b=0;b<4;b++){ctx.fillStyle=b===index%4?accent:'#7185ff';ctx.fillRect(345+b*27,238,19,4+b*2)}
  ctx.globalAlpha=.95;ctx.fillStyle='#f2f5fb';ctx.font=`600 ${language==='en'?28:26}px sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';const titleLines=wrapCanvasText(ctx,category,235);titleLines.forEach((line,i)=>ctx.fillText(line,225,145+(i-(titleLines.length-1)/2)*34));ctx.textBaseline='alphabetic';ctx.font='12px monospace';ctx.fillStyle='#9eb0cb';ctx.fillText(sceneText[language].collection,32,252);
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(458,50,6,0,Math.PI*2);ctx.fill();
  return new CanvasTexture(canvas);
}

export default function WorldDataScene(){
  const mount=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!mount.current)return;const container=mount.current;const scene=new Scene();scene.fog=new FogExp2(0x050a11,.055);scene.add(new AmbientLight(0x7185ff,1.15));const keyLight=new DirectionalLight(0xffffff,3.2);keyLight.position.set(4,5,6);scene.add(keyLight);const rimLight=new PointLight(0xd8ff43,18,8);rimLight.position.set(2.5,1.7,2.5);scene.add(rimLight);
    const camera=new PerspectiveCamera(42,1,.1,100);camera.position.set(0,.15,8.4);
    const renderer=new WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0x050a11,0);container.prepend(renderer.domElement);
    const gallery=new Group();scene.add(gallery);const cards:Mesh[]=[];
    for(let i=0;i<categories.length;i++){
      const col=i%6,row=Math.floor(i/6);const material=new MeshBasicMaterial({map:streamTexture(i,getSceneLanguage()),transparent:true,opacity:.34+(col/6)*.3,side:DoubleSide});const card=new Mesh(new PlaneGeometry(1.45,.82),material);
      card.position.set(-4.1+col*1.48,2.05-row*.9,-2.2+col*.4+Math.sin(i)*.12);card.rotation.y=-.12+col*.045;card.userData.baseX=card.position.x;card.userData.baseY=card.position.y;card.userData.baseZ=card.position.z;card.userData.baseRY=card.rotation.y;card.userData.phase=i*.41;gallery.add(card);cards.push(card);
    }
    let currentLanguage=getSceneLanguage();
    const updateCardLanguage=()=>{const nextLanguage=getSceneLanguage();if(nextLanguage===currentLanguage)return;currentLanguage=nextLanguage;cards.forEach((card,index)=>{const material=card.material as MeshBasicMaterial;material.map?.dispose();material.map=streamTexture(index,currentLanguage);material.needsUpdate=true;});};
    const languageObserver=new MutationObserver(updateCardLanguage);
    languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    const tunnel=new Group();scene.add(tunnel);const particleGeo=new BoxGeometry(.035,.035,.035);const particles:Mesh[]=[];
    for(let i=0;i<90;i++){const p=new Mesh(particleGeo,new MeshBasicMaterial({color:i%7===0?0xd8ff43:0x7185ff,transparent:true,opacity:.7,depthWrite:false}));p.userData.offset=i/90;p.userData.angle=i*2.39;tunnel.add(p);particles.push(p)}
    const robot=new Group();robot.position.set(3.1,.08,-.1);scene.add(robot);const outline=new LineBasicMaterial({color:0xaebcff,transparent:true,opacity:.9});const accentLine=new LineBasicMaterial({color:0xd8ff43,transparent:true,opacity:.86});
    const addLine=(points:number[][],material=outline)=>{const geometry=new BufferGeometry().setFromPoints(points.map(([x,y,z=0])=>new Vector3(x,y,z)));const path=new Line(geometry,material);robot.add(path);return path};
    addLine([[-.45,.58,.08],[-.58,.38,.05],[-.63,.02,.04],[-.55,-.42,.04],[-.34,-.67,.04],[0,-.76,.04],[.34,-.67,.04],[.55,-.42,.04],[.63,.02,.04],[.58,.38,.05],[.45,.58,.08]]);
    addLine([[-.42,.18,.08],[-.28,.27,.11],[.28,.27,.11],[.42,.18,.08],[.31,-.08,.1],[-.31,-.08,.1],[-.42,.18,.08]],accentLine);
    addLine([[-.2,-.73,0],[-.25,-.98,0],[-.86,-1.1,0],[-1.18,-1.28,0]]);addLine([[.2,-.73,0],[.25,-.98,0],[.86,-1.1,0],[1.18,-1.28,0]]);
    addLine([[-.86,-1.1,0],[-.72,-2.3,0],[-.38,-2.55,0],[.38,-2.55,0],[.72,-2.3,0],[.86,-1.1,0]]);addLine([[-.55,-1.35,.03],[0,-1.58,.08],[.55,-1.35,.03]],accentLine);addLine([[-.48,-2.02,.02],[0,-2.17,.08],[.48,-2.02,.02]]);
    [-1.18,1.18].forEach(x=>{const joint=new Mesh(new RingGeometry(.12,.145,28),new MeshBasicMaterial({color:0x7185ff,side:DoubleSide,transparent:true,opacity:.8}));joint.position.set(x,-1.28,.02);robot.add(joint)});
    const neuralPositions:number[]=[];for(let i=0;i<28;i++){const a=i*2.399,r=.08+(i%7)*.035;neuralPositions.push(Math.cos(a)*r,Math.sin(a)*r,((i%3)-1)*.035)}const neuralGeometry=new BufferGeometry();neuralGeometry.setAttribute('position',new Float32BufferAttribute(neuralPositions,3));const brain=new Points(neuralGeometry,new PointsMaterial({color:0xd8ff43,size:.045,transparent:true,opacity:.9}));brain.position.set(0,.31,.12);
    // Layered anatomical contours give the transparent figure depth.
    for(let layer=0;layer<5;layer++){const z=-.08-layer*.19,s=1-layer*.07;const material=new LineBasicMaterial({color:0x8ea6d8,transparent:true,opacity:.5-layer*.075});const contours=[[-.45,.58],[-.58,.3],[-.6,-.12],[-.48,-.5],[-.24,-.7],[.24,-.7],[.48,-.5],[.6,-.12],[.58,.3],[.45,.58]];addLine(contours.map(([x,y])=>[x*s,y,z]),material);addLine([[-.86*s,-1.12,z],[-.64*s,-1.55,z],[-.58*s,-2.25,z],[0,-2.45,z],[.58*s,-2.25,z],[.64*s,-1.55,z],[.86*s,-1.12,z]],material);}
    for(let rib=0;rib<7;rib++){const y=-1.25-rib*.16;addLine([[-.67,y,-.15],[0,y-.09,.13],[.67,y,-.15]],new LineBasicMaterial({color:0x879fcc,transparent:true,opacity:.32}));}
    // Drafting annotations and articulated hands remain line-only geometry.
    const label=(text:string,x:number,y:number,w=1.4)=>{const c=document.createElement('canvas');c.width=512;c.height=80;const ctx=c.getContext('2d')!;ctx.fillStyle='#b4cadc';ctx.font='22px monospace';ctx.fillText(text,8,45);const sprite=new Sprite(new SpriteMaterial({map:new CanvasTexture(c),transparent:true,depthTest:false}));sprite.position.set(x,y,.25);sprite.scale.set(w,.22,1);robot.add(sprite);return sprite};
    label('NECK / ORIENTATION',1.4,-.72,1.7);addLine([[.22,-.83,0],[.75,-.68,0],[1,-.68,0]],accentLine);
    label('SHOULDER / REACH',-1.45,-.9,1.7);addLine([[-1.16,-1.28,0],[-1.65,-1.04,0],[-2,-1.04,0]],accentLine);
    label('HAND / DEXTERITY',1.2,-3.17,1.7);
    const tube=(a:number[],b:number[],radius:number)=>{const start=new Vector3(...a as [number,number,number]),end=new Vector3(...b as [number,number,number]);const geo=new CylinderGeometry(radius*.82,radius,start.distanceTo(end),8,2,true);const mesh=new LineSegments(new WireframeGeometry(geo),new LineBasicMaterial({color:0x9cb8d0,transparent:true,opacity:.56}));mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new Vector3(0,1,0),end.clone().sub(start).normalize());robot.add(mesh);};
    const animatedArms:Group[]=[];
    for(const side of [-1,1]){
      const armStart=robot.children.length;const x=side*1.27;
      tube([side*1.12,-1.3,0],[x,-2.12,.08],.15);
      tube([x,-2.12,.08],[x,-2.43,.2],.12);
      const palm=new LineSegments(new EdgesGeometry(new BoxGeometry(.32,.32,.13)),outline);palm.position.set(x,-2.58,.2);robot.add(palm);
      for(let f=0;f<4;f++){const fx=x+side*(-.12+f*.08),length=[.25,.31,.29,.22][f];const a=[fx,-2.72,.2],b=[fx+side*.018,-2.72-length*.55,.25],c=[fx+side*.03,-2.72-length,.31];tube(a,b,.033);tube(b,c,.027);}
      tube([x-side*.15,-2.5,.2],[x-side*.28,-2.65,.28],.045);tube([x-side*.28,-2.65,.28],[x-side*.3,-2.8,.35],.033);
      const armParts=robot.children.slice(armStart);const arm=new Group();arm.position.set(side*1.12,-1.3,0);arm.userData.side=side;robot.add(arm);armParts.forEach(part=>{part.position.sub(arm.position);arm.add(part)});animatedArms.push(arm);
      tube([side*.23,-.75,-.08],[side*.25,-.98,-.08],.065);
      for(let j=0;j<4;j++){addLine([[side*.6,-1.2-j*.27,.12],[side*.78,-1.22-j*.27,-.25],[side*.56,-1.26-j*.27,-.43]],outline);}
    }
    const skills:Sprite[]=[];for(let i=0;i<particles.length;i++){const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle='#d8ff43';ctx.font='72px sans-serif';ctx.textAlign='center';ctx.fillText(['⚒','⚙','✂','↕'][i%4],64,88);const s=new Sprite(new SpriteMaterial({map:new CanvasTexture(c),transparent:true,opacity:0}));s.scale.set(.18,.18,1);scene.add(s);skills.push(s);}
    const codeCanvas=document.createElement('canvas');codeCanvas.width=640;codeCanvas.height=360;const codeCtx=codeCanvas.getContext('2d')!;const codeTexture=new CanvasTexture(codeCanvas);const code=new Sprite(new SpriteMaterial({map:codeTexture,transparent:true,depthTest:false}));code.position.set(0,.10,.18);code.scale.set(.7,.29,1);robot.add(code);let lastCode=-1;
    // A volumetric rib cage: bowed front, recessed back and bridging side ribs.
    for(let rib=0;rib<8;rib++){const y=-1.12-rib*.17;const width=.76-rib*.025;for(const depth of [1,-1]){const points:number[][]=[];for(let step=0;step<=12;step++){const x=-width+step*width/6;points.push([x,y-.08*(1-(x/width)**2),depth*(.16+.24*Math.sqrt(Math.max(0,1-(x/width)**2)))]);}addLine(points,outline);}for(const side of [-1,1])addLine([[side*width,y,.16],[side*(width+.04),y,-.02],[side*width,y,-.16]],accentLine);}
    for(const side of [-1,1]){addLine([[side*.16,-1.12,.39],[side*.28,-1.38,.42],[side*.3,-1.82,.39],[side*.2,-2.28,.32]],accentLine);addLine([[side*.68,-1.15,.2],[side*.54,-1.35,.35],[side*.12,-1.43,.43]],outline);}
    const skull=[[-.45,.58],[-.58,.38],[-.63,.02],[-.55,-.42],[-.34,-.67],[0,-.76],[.34,-.67],[.55,-.42],[.63,.02],[.58,.38],[.45,.58]];
    addLine(skull.map(([x,y])=>[x*.72,y,-1.0]),outline);skull.forEach(([x,y])=>addLine([[x,y,.06],[x*.98,y+.025,-.48],[x*.72,y,-1.0]],outline));
    for(const side of [-1,1]){const shoulder=new LineSegments(new WireframeGeometry(new SphereGeometry(.23,10,6)),new LineBasicMaterial({color:0x9cb8d0,transparent:true,opacity:.55}));shoulder.position.set(side*1.12,-1.3,-.08);shoulder.scale.set(1,1,1.35);robot.add(shoulder);}
    const chestLogoTexture=new TextureLoader().load(staticPath('/brand/syrm-logo.png'));chestLogoTexture.colorSpace=SRGBColorSpace;const chestLogo=new Mesh(new PlaneGeometry(.52,.172),new MeshBasicMaterial({map:chestLogoTexture,color:0x9cb8d0,opacity:.45,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));chestLogo.position.set(0,-1.47,.445);robot.add(chestLogo);
    const story=container.closest('.journey');
    const coverageRoot=story?.querySelector('.coverage-flow');
    const storyScroll=story?.querySelector('.story-scroll');
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tempPosition=new Vector3();
    let frame=0;
    let visible=true;
    const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(container);resize();
    const clamp=(v:number)=>Math.max(0,Math.min(1,v));
    const animate=()=>{
      if(!visible){frame=0;return;}
      frame=requestAnimationFrame(animate);
      const cr=coverageRoot?.getBoundingClientRect();const sr=storyScroll?.getBoundingClientRect();
      const hero=sr?clamp(-sr.top/Math.max(1,sr.height-innerHeight)):0;
      const coverage=cr?clamp(-cr.top/Math.max(1,cr.height-innerHeight)):0;
      const entry=cr?clamp(1-cr.top/innerHeight):0;
      const chapter=Math.min(6,Math.floor(coverage*7));const now=Date.now()*.00016;
      tunnel.visible=entry<1;skills.forEach(skill=>{skill.visible=entry<1;skill.material.depthWrite=false;});
      const halfH=Math.tan(MathUtils.degToRad(21))*7.9,halfW=halfH*camera.aspect;
      const narrow=camera.aspect<1;
      const chapterCopy=coverageRoot?.querySelector('.coverage-scene.active');
      const copyBottom=chapterCopy?Math.max(...Array.from(chapterCopy.children).filter(el=>el.getClientRects().length&&getComputedStyle(el).display!=='none').map(el=>el.getBoundingClientRect().bottom)):0;
      const gridTop=clamp((copyBottom-container.getBoundingClientRect().top+24)/container.clientHeight);
      const robotX=Math.min(2.45,halfW*.48);robot.position.x=robotX;
      cards.forEach((card,i)=>{const group=Math.floor(i/6),slot=i%6;let tx=card.userData.baseX,ty=card.userData.baseY,tz=card.userData.baseZ;
        let targetScale=1,opacity=.25;
        if(entry>0){const active=group===chapter||chapter===6;
          if(chapter===6){const cols=narrow?4:6,rows=Math.ceil(36/cols);const planeHalfH=Math.tan(MathUtils.degToRad(21))*7.4,planeHalfW=planeHalfH*camera.aspect;const gap=Math.min(.09,planeHalfH*.025),areaHeight=planeHalfH*1.32;const width=planeHalfW*1.8/cols;targetScale=Math.min(width*.92/1.45,(areaHeight-gap*(rows-1))/rows/.82);tx=(i%cols-(cols-1)/2)*width;ty=planeHalfH*.56-.41*targetScale-Math.floor(i/cols)*(.82*targetScale+gap);}
          else{const cols=container.clientWidth<1000?2:3,rows=6/cols;const planeHalfH=Math.tan(MathUtils.degToRad(21))*7.4,planeHalfW=planeHalfH*camera.aspect;const top=Math.max(.18,Math.min(.45,gridTop));const areaWidth=planeHalfW*1.76,areaHeight=planeHalfH*1.08;const gap=Math.min(.18,planeHalfW*.05);targetScale=Math.min((areaWidth-gap*(cols-1))/cols/1.45,(areaHeight-gap*(rows-1))/rows/.82,1.15);const stepX=1.45*targetScale+gap,stepY=.82*targetScale+gap;tx=(slot%cols-(cols-1)/2)*stepX;ty=planeHalfH*(1-2*top)-.41*targetScale-Math.floor(slot/cols)*stepY;}
          if(!active){tx=card.userData.baseX;ty=card.userData.baseY;targetScale=.6;}
          tz=active?.5:-3;opacity=active?1:.02;
        }
        const blend=entry*entry*(3-2*entry);
        const easing=reducedMotion?1:.055;
        tempPosition.set(MathUtils.lerp(card.userData.baseX,tx,blend),MathUtils.lerp(card.userData.baseY,ty,blend),MathUtils.lerp(card.userData.baseZ,tz,blend));
        card.position.lerp(tempPosition,easing);
        card.rotation.y=MathUtils.lerp(card.rotation.y,card.userData.baseRY*(1-blend),easing);card.scale.setScalar(MathUtils.lerp(card.scale.x,MathUtils.lerp(1,targetScale,blend),easing));
        // Keep incoming foreground cards inside the perspective viewport throughout the zoom.
        if(entry>0&&entry<1&&group===chapter){const visibleHalfWidth=Math.tan(MathUtils.degToRad(21))*(8.4-entry*.5-card.position.z)*camera.aspect;const edge=visibleHalfWidth*.94-.725*card.scale.x;card.position.x=Math.max(-edge,Math.min(edge,card.position.x));}
        const material=card.material as MeshBasicMaterial;material.opacity=MathUtils.lerp(material.opacity,MathUtils.lerp(.25,opacity,blend),easing);
      });
      particles.forEach((p,i)=>{const t=(now*.35+p.userData.offset+hero*.65)%1,radius=(1-t)*2.3;p.position.set(robotX-radius*2.1,1.08+Math.sin(p.userData.angle)*radius*.65,.39+Math.cos(p.userData.angle)*radius*.22);p.rotation.x+=.03;p.rotation.y+=.02;const morph=clamp((t-.65)/.2);(p.material as MeshBasicMaterial).opacity=.7*(1-morph)*(1-entry);skills[i].position.copy(p.position);skills[i].material.opacity=morph*(1-entry);});
      const tick=Math.floor(Date.now()/85);if(tick!==lastCode){lastCode=tick;codeCtx.clearRect(0,0,640,360);codeCtx.fillStyle='#8a9caf';codeCtx.font='34px monospace';codeCtx.fillText('LEARNING / SIMULATION',10,30);const lines=['observe(motion)','map(action)','learn(skill)'];const count=tick%150;codeCtx.fillStyle='#d8ff43';lines.forEach((line,i)=>codeCtx.fillText(line.slice(0,Math.max(0,count-i*25)),10,105+i*80));codeTexture.needsUpdate=true;}
      const armMotion=reducedMotion?0:Math.sin(hero*Math.PI);animatedArms.forEach(arm=>{arm.rotation.z=arm.userData.side*armMotion*.65;arm.rotation.x=-armMotion*.45;});
      const demo=false;const demoBlend=demo?entry:0;const robotFade=demo?1:1-clamp(entry/.65);robot.visible=robotFade>0;robot.scale.setScalar(MathUtils.lerp(1,.17,demoBlend));robot.position.x=MathUtils.lerp(robotX,halfW*.94,demoBlend);robot.position.y=MathUtils.lerp(.35+Math.sin(hero*Math.PI)*.12,-halfH+.72,demoBlend);robot.rotation.y=Math.sin(hero*Math.PI*2)*.48*(1-demoBlend);robot.rotation.z=Math.sin(hero*Math.PI)*.025*(1-demoBlend);if(demoBlend>.9){const phase=reducedMotion?0:now*(2+chapter*.2);animatedArms.forEach(arm=>{const side=arm.userData.side;arm.rotation.z=side*(.25+Math.sin(phase+(chapter%2?side:0))*(.12+chapter*.025));arm.rotation.x=-.25-Math.cos(phase+chapter)*.16;});}robot.traverse(child=>{const material=(child as Mesh).material;if(material&&!Array.isArray(material)){material.userData.baseOpacity??=material.opacity;material.opacity=material.userData.baseOpacity*robotFade;}});
      gallery.position.set(0,0,0);gallery.rotation.y=0;camera.position.z=8.4-entry*.5;renderer.render(scene,camera);
    };
    const intersectionObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!frame)animate();},{rootMargin:'240px'});
    intersectionObserver.observe(container);
    animate();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();intersectionObserver.disconnect();languageObserver.disconnect();cards.forEach((card)=>{const material=card.material as MeshBasicMaterial;material.map?.dispose();material.dispose();});renderer.dispose();renderer.domElement.remove()};
  },[]);
  return <div className="scene-wrap" ref={mount}><div className="scene-ui top"><span>COLLECTION NETWORK</span></div><div className="stream-legend"><span>VIDEO</span><i/><span>QC + STRUCTURE</span><i/><span>TRAINING DATA</span></div></div>;
}
