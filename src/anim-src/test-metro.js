// Fake-canvas harness for procMetro. Usage: node test-metro.js metro.js
const fs=require('fs');const path=require('path'),dir=path.dirname(process.argv[2]);const src=['journeys.js','iso.js'].map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n')+'\n'+fs.readFileSync(process.argv[2],'utf8');
function runCase(W,H,reduced){
  let rafs=[];const handlers={},docH={},opens=[],founds=[];let errors=0;
  const ctx=new Proxy({},{get:(t,k)=>k==='measureText'?(s=>({width:String(s).length*6.5})):(k==='createRadialGradient'||k==='createLinearGradient')?(()=>({addColorStop(){}})):(k in t?t[k]:()=>{}),set:(t,k,v)=>{t[k]=v;return true;}});
  const cv={getContext:()=>ctx,getBoundingClientRect:()=>({width:W,height:H,left:0,top:0}),addEventListener:(e,f)=>{handlers[e]=f;},style:{},width:0,height:0};
  global.window={matchMedia:()=>({matches:reduced}),addEventListener(){},devicePixelRatio:2,open:(u)=>opens.push(u)};
  global.document={hidden:false,addEventListener(e,f){docH[e]=f;}};
  global.IntersectionObserver=function(){return{observe(){}}};
  global.requestAnimationFrame=f=>rafs.push(f);global.performance={now:()=>0};
  global.setTimeout=()=>0;global.clearTimeout=()=>{};
  const opts={cal:'https://cal.com/px-mihnea/talk',found:(id,l)=>founds.push(id+':'+l)};
  eval(src+';procMetro(cv,opts);');
  const M=cv._metro,S=M.S;
  let t=0;function run(n){for(let i=0;i<n;i++){t+=16;const q=rafs;rafs=[];q.forEach(f=>f(t));}}
  function step(n){if(reduced)return;run(n);}
  const click=(x,y,type='mouse')=>{handlers.pointerdown({pointerType:type,clientX:x,clientY:y});step(3);};
  const mid=r=>[r.x+r.w/2,r.y+r.h/2];
  step(120);
  // hover sweep
  for(let x=0;x<W;x+=9)for(let y=0;y<H;y+=11){handlers.pointermove({pointerType:'mouse',clientX:x,clientY:y});step(1);}
  // header targets
  click(...mid(S.ui.ai));step(60);click(...mid(S.ui.ai));
  click(...mid(S.ui.day));step(30);
  // legend: ride each line
  S.ui.legend.slice().forEach(it=>{click(...mid(it.r));step(30);});
  // main and extra stations, open pinned card, use its close and button
  const g=S.geo;
  let drills=0;Object.keys(M.STN).forEach(m=>{const s=M.STN[m];click(s.x,s.y);step(40);if(S.pin&&S.pin.st===m&&S.ui.pin)drills++;else console.log('nodrill',m,s.x|0,s.y|0,JSON.stringify(S.hov),S.ui.end&&JSON.stringify(S.ui.end.r));if(S.ui.pin&&S.ui.pin.x){click(...mid(S.ui.pin.x));}});
  if(drills!==Object.keys(M.STN).length)console.log('DRILL MISSING',drills,Object.keys(M.STN).length);
  click(M.STN.stabilise.x,M.STN.stabilise.y);step(5);
  if(S.ui.pin&&S.ui.pin.btn)click(...mid(S.ui.pin.btn));
  click(g.ghost.x,g.ghost.y);step(5);
  click(g.term.x,g.term.y);step(5);
  // click a line by its geometry and let the ride finish, then use the end card button
  const l=M.LINES[1],a=l.pts[0],b=l.pts[1];click((a.x+b.x)/2+3,(a.y+b.y)/2);
  step(900);if(S.ui.end&&S.ui.end.btn)click(...mid(S.ui.end.btn));
  // bug: wait for it, then squash
  if(!reduced){let n=0;while(!S.bug&&n<4000){run(10);n+=10;}}
  if(S.bug){console.log('bug pre',JSON.stringify({pin:S.ui.pin&&S.ui.pin.r,end:S.ui.end&&S.ui.end.r,bug:M.posAt(M.LINES[S.bug.li],S.bug.d)}));const p=M.posAt(M.LINES[S.bug.li],S.bug.d);handlers.pointermove({pointerType:'mouse',clientX:p.x,clientY:p.y});step(1);const p2=M.posAt(M.LINES[S.bug.li],S.bug.d);click(p2.x,p2.y);}
  // konami
  ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'].forEach(k=>docH.keydown({key:k}));step(60);
  // touch: first tap labels, second acts
  const c=M.STN.launch;click(c.x,c.y,'touch');click(c.x,c.y,'touch');step(10);
  const p3=M.LINES[2].pts[0],p4=M.LINES[2].pts[1];click((p3.x+p4.x)/2+5,(p3.y+p4.y)/2,'touch');click((p3.x+p4.x)/2+5,(p3.y+p4.y)/2,'touch');step(600);
  click(...mid(S.ui.cta),'touch');
  handlers.pointerleave({pointerType:'mouse'});step(300);
  // resize to the other layout and keep running
  console.log(`${W}x${H}${reduced?' reduced':''}: total=${opts.total} found=${founds.length} [${founds.join(', ')}] opens=${opens.length} ride-ok=${!S.ride||S.ride.li>=0}`);
  return founds.length===opts.total;
}
let ok=true;
for(const [w,h] of [[900,560],[1180,560],[380,820]])for(const r of [false,true])ok=runCase(w,h,r)&&ok;
console.log(ok?'ok, all eggs reachable, no runtime errors':'MISSING EGGS');
