// Scroll tour test: fake canvas, simulated scroll positions. node test-scrolltips.js site/stream.js
const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');
function setup(W,opts){
  opts=opts||{};let t=0,rafs=[],timers=[];const H=320,VH=844;
  const ctx=new Proxy({},{get:(o,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):k==='measureText'?(s)=>({width:String(s).length*6.6}):(k in o?o[k]:()=>{}),set:(o,k,v)=>{o[k]=v;return true;}});
  const D=opts.docTop==null?2000:opts.docTop,rect={width:W,height:H,left:0,top:D};
  const ch={},wh={};let io=null;const parent={appendChild(el){this.el=el;}};
  const cv={getContext:()=>ctx,getBoundingClientRect:()=>({width:W,height:H,left:0,top:rect.top,bottom:rect.top+H}),addEventListener:(e,f)=>{ch[e]=f;},style:{},width:0,height:0,parentNode:parent};
  global.window={matchMedia:q=>({matches:q==='(hover: none)'?!opts.hover:q.indexOf('reduced-motion')>=0?!!opts.still:false}),addEventListener(e,f,o){wh[e]=f;if(e==='scroll'&&!(o&&o.passive))throw new Error('scroll listener not passive');},devicePixelRatio:2,innerWidth:W,innerHeight:VH,open(){}};
  global.document={hidden:false,addEventListener(){},documentElement:{clientHeight:VH,scrollHeight:D+H+2000},createElement:()=>({style:{},setAttribute(k,v){this[k]=v;},textContent:''})};
  global.IntersectionObserver=function(f){io=f;return{observe(){}}};
  global.requestAnimationFrame=f=>{rafs.push(f);return rafs.length;};
  global.performance={now:()=>t};
  global.setTimeout=(f,ms)=>{timers.push({f,at:t+ms});return timers.length;};global.clearTimeout=()=>{};
  eval(src+';eventStream(cv,null,opts.o);');
  const S=cv._stream;
  function run(n){for(let i=0;i<n;i++){t+=16;const q=rafs;rafs=[];q.forEach(f=>f(t));const due=timers.filter(x=>x.at<=t);timers=timers.filter(x=>x.at>t);due.forEach(x=>x.f());}}
  function scrollTo(top,frames){top=Math.min(D,top);rect.top=top;window.scrollY=D-top;wh.scroll&&wh.scroll();run(frames==null?3:frames);}
  return {S,run,scrollTo,ch,rect,io:v=>io([{isIntersecting:v}]),W,H,VH,parent};
}
let fails=0;function ok(c,m){if(!c){fails++;console.log('FAIL',m);}}
function check(S,W,H,tag){const T=S.tip;if(!(S.hov&&S.hov.tour)||!T.box||T.a<.9||Math.hypot(S.mark.x-S.hov.ax,S.mark.y-S.hov.ay)>1||Math.abs(T.box.y-T.ty)>1)return;const b=T.box;
  ok(b.x>=0&&b.y>=0&&b.x+b.w<=W+.5&&b.y+b.h<=H+.5,tag+' box inside canvas '+JSON.stringify(b));
  const m=S.mark;ok(!(m.x>=b.x-2&&m.x<=b.x+b.w+2&&m.y>=b.y-2&&m.y<=b.y+b.h+2),tag+' box covers its marker '+S.hov.key+' '+JSON.stringify(b)+' '+JSON.stringify(m));}
for(const still of [false,true])for(const W of [360,768,1280]){
  const tag=W+(still?' still':'');
  const E=setup(W,{still});const {S}=E;
  // slow scroll down through the whole range
  const seq=[];for(let top=E.VH*1.2;top>-E.H-200;top-=6){E.scrollTo(top,still?0:3);if(still)E.run(20);
    const k=S.hov&&S.hov.tour?S.hov.key.replace(/:\d+$/,s=>S.hov.kind==='srv'?':n':s):null;
    if(seq[seq.length-1]!==k){seq.push(k);if(!still)E.run(45);}check(S,W,E.H,tag);}
  const shown=seq.filter(Boolean);
  ok(JSON.stringify(shown)===JSON.stringify(['src:0','src:1','src:2','src:3','lb','srv:n','db','gdb']),tag+' tour order '+shown.join(','));
  console.log(tag,'sequence',seq.map(x=>x||'-').join(' > '));
  // jitter around a boundary: no flicker
  const E2=setup(W,{still});const n=8,vh=E2.VH;function topFor(p){return vh*.9-p*vh*.8-E2.H/2;}
  E2.scrollTo(topFor(3.5/n),20);const k0=E2.S.hov&&E2.S.hov.key;let changes=0,prev=k0;
  for(let i=0;i<40;i++){E2.scrollTo(topFor(4/n)+(i%2?9:-9),still?0:2);if(still)E2.run(20);const k=E2.S.hov&&E2.S.hov.key;if(k!==prev)changes++;prev=k;}
  ok(changes<=1,tag+' flicker at boundary: '+changes+' changes');
  // a tap hands control to the user; the tour stays off until the canvas leaves the viewport
  E2.scrollTo(topFor(1.5/n),30);ok(E2.S.hov&&E2.S.hov.key==='src:1',tag+' tour shows src:1, got '+(E2.S.hov&&E2.S.hov.key));
  E2.ch.pointerdown({pointerType:'touch',clientX:E2.W*.6,clientY:5,pointerId:1});E2.ch.pointercancel({});E2.run(10);
  ok(E2.S.hov&&E2.S.hov.key==='src:1'&&!E2.S.tour.off,tag+' a scroll that starts on the canvas keeps the tour');
  E2.ch.pointerdown({pointerType:'touch',clientX:E2.W*.6,clientY:5,pointerId:2});E2.ch.pointerup({pointerType:'touch',clientX:E2.W*.6+3,clientY:6});E2.run(10);
  ok(E2.S.tour.off,tag+' tap turns the tour off');
  E2.run(400);for(let p=2;p<7;p++)E2.scrollTo(topFor((p+.5)/n),20);
  ok(!(E2.S.hov&&E2.S.hov.tour),tag+' tour stays off after a tap');
  E2.io(false);E2.io(true);E2.scrollTo(topFor(5.5/n),40);
  ok(E2.S.hov&&E2.S.hov.key&&E2.S.hov.key.indexOf('srv:')===0,tag+' tour back after leaving the viewport, got '+(E2.S.hov&&E2.S.hov.key));
  // tapping the element on show runs its action at once
  E2.scrollTo(topFor(2.5/n),40);const st=E2.S.hov;ok(st&&st.key==='src:2',tag+' on src:2');
  const r=E2.S.L.src[2];E2.ch.pointerdown({pointerType:'touch',clientX:r.x,clientY:r.y+E2.rect.top});E2.ch.pointerup({pointerType:'touch',clientX:r.x,clientY:r.y+E2.rect.top});
  ok(E2.S.bursts[2]>2.5,tag+' tap on the shown source sends a burst');
  // a mouse move takes over too
  const E3=setup(W,{still,hover:true});E3.scrollTo(topFor(2.5/n),30);ok(!(E3.S.hov&&E3.S.hov.tour),tag+' no tour on hover devices by default');
  const E4=setup(W,{still,hover:true,o:{scrollTips:'always'}});E4.scrollTo(topFor(2.5/n),30);ok(E4.S.hov&&E4.S.hov.tour,tag+" scrollTips 'always' runs on hover devices");
  E4.ch.pointermove({pointerType:'mouse',clientX:5,clientY:5});E4.run(10);ok(E4.S.tour.off&&!(E4.S.hov&&E4.S.hov.tour),tag+' mouse move takes over');
  const E5=setup(W,{still,o:{scrollTips:false}});E5.scrollTo(topFor(2.5/n),30);ok(!E5.S.tour.on&&!E5.parent.el,tag+' scrollTips false: off, no live region');
  // live region announces once the label has stayed
  const E6=setup(W,{still});E6.scrollTo(topFor(4.5/n),10);E6.run(100);ok(E6.parent.el&&/Load balancer/.test(E6.parent.el.textContent),tag+' live region: '+(E6.parent.el&&E6.parent.el.textContent));
}
// hero: canvas 120 px from the top of the page, so its centre starts at 280 px and the page starts unscrolled
for(const W of [360,1280]){const E=setup(W,{docTop:120});const seq=[];
  for(let y=0;y<900;y+=4){E.scrollTo(120-y,3);const k=E.S.hov&&E.S.hov.tour?E.S.hov.key.replace(/srv:\d+/,'srv:n'):null;if(seq[seq.length-1]!==k){seq.push(k);E.run(45);}}
  console.log(W,'hero sequence',seq.map(x=>x||'-').join(' > '));
  ok(JSON.stringify(seq.filter(Boolean))===JSON.stringify(['src:0','src:1','src:2','src:3','lb','srv:n','db','gdb']),W+' hero tour visits all eight');}
console.log(fails?fails+' failures':'ok, scroll tour passes at 360, 768 and 1280, with and without reduced motion');
process.exit(fails?1:0);
