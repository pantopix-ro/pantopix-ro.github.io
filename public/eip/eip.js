/*! PANTOPIX RO hero animation "Live event stream" (EIP), v15-hero. Plain ES5, no dependencies.
   Usage: window.eipStream(canvas, options). Needs eip.css. See the integration notes on the demo page.
   pantopix-ro.github.io local change, 23 Nov 2026: option headBelow draws the counter and the status line under the diagram;
   option stage (1-3) starts on that stage, fully built, with no auto-advance from an earlier one;
   option noNote hides the 'Illustration · dots are a sample' line; option label(h, I) rewrites a label: shorter copy, and I.icons = [{src,name}] shows logos in place of the tech line. */
(function(){
  'use strict';
  var REDUCED=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Live event stream v15, "At scale".
  // Main line: Ingest (Channel Adapter, with a Message Filter and a Dead Letter Channel) → Enrich (Content Enricher) → Match (Aggregator) → router.
  // Branch: Journey reads the same topic as a second consumer group (Publish-Subscribe): web, mobile and payment events (Resequencer, which also ties devices to one customer).
  // Journey keeps one row per shopper session. A checkout closes the row into a ★ that rejoins its order at Match;
  // every closed or timed-out session is written to the graph. Scanner events never enter the branch.
  // Layers. Ambient: plays alone. Explore: hover, first tap, the scroll tour (phones) or the arrow keys show an HTML label,
  // beside the element on wide screens and docked to the top band on tall ones. Act: click, second tap, the label's
  // buttons or Enter. A killed pod or a stopped consumer leaves events waiting in Kafka; they drain when it is back.
  // Options (all optional): O.avoid (element, or function returning one): text laid over the canvas. The diagram sits right of it,
  // ignores the pointer under it and never puts a label or panel on it. O.transparent: clear instead of painting the background.
  // O.bg: background and text-halo colour. O.nav: 'before' (default, above the canvas's parent) or 'inside' (in the parent; it floats
  // over the canvas on wide screens and sits above it on phones). O.calm: no red alerts until the viewer interacts. O.cal: booking link.
  function eipStream(cv,O){
    O=O||{};
    var stage=cv.parentNode;stage.classList.add('eip-host');if(getComputedStyle(stage).position==='static')stage.style.position='relative';var cx=cv.getContext('2d'),still=REDUCED,NOHOVER=window.matchMedia('(hover: none)').matches;
    var K={bg:'#0b1a2e',box:'#10223a',edge:'#2a3c57',text:'#e8edf3',muted:'#a7b3c2',coral:'#ea5a47',amber:'#f1b96a',amber2:'#ffd79f',teal:'#10c29e',blue:'#7fa6d9'};
    if(O.bg)K.bg=O.bg;
    var HEAD='"Josefin Sans", sans-serif',MONO='"JetBrains Mono", ui-monospace, Menlo, monospace';
    var CAL=O.cal||'https://cal.com/px-mihnea/talk',CAP=12.5,STEP=1.25,PER=1.1;
    var MSG=['50,000 events/s. That’s where this demo stops. The platforms we build keep going.',
      'You clearly enjoy load testing. Want to try it on your own system?',
      'Still clicking? That kind of persistence is how platforms get built. Let’s talk about yours.',
      'This canvas is at its limit. Your platform might not be. Let’s find out.'];
    var SRC=[
      {n:'Web app',sn:'Web',c:K.coral,w:.36,real:.64,set:'Page views, searches and carts from the shop.',topic:'web.events',pay:'{"type":"add_to_cart","page":"/p/linen-shirt"}',keys:['type','page'],types:['page_view','search','add_to_cart']},
      {n:'Mobile app',sn:'Mobile',c:K.amber,w:.26,real:.353,set:'Sessions and taps from the iOS and Android apps.',topic:'app.events',pay:'{"type":"app_open","os":"iOS 18"}',keys:['type','os'],types:['app_open','product_view','wishlist']},
      {n:'Payments',sn:'Payments',c:K.teal,w:.14,real:.002,set:'Authorisations, captures and refunds from the payment provider, about four per order.',topic:'payments',pay:'{"order":"#7482130","total":89.90,"currency":"EUR"}',keys:['order','total','currency'],types:['payment']},
      {n:'Scanners',sn:'Scanners',c:K.blue,w:.24,real:.005,set:'Warehouse scans over MQTT: goods in, pick, pack and dispatch.',topic:'scans.mqtt',pay:'{"dock":"D-3","sku":"RO-118-42"}',keys:['dock','sku'],types:['scan']}];
    var BOX=[['ing','Ingest','Channel Adapter','adapter'],['enr','Enrich','Content Enricher','enricher'],
             ['mat','Match','Aggregator','aggregator'],['jny','Journey','Resequencer','resequencer']];
    var KS=['ing','enr','mat','jny'],NAME={ing:'Ingest',enr:'Enrich',mat:'Match',jny:'Journey'};
    var TOPIC={in0:'web.events',in1:'app.events',in2:'payments',in3:'scans.mqtt',m1:'events.clean',m2b:'events.clean',m3:'events.enriched',
      m4:'events.matched',tapJny:'events.clean',rpg:'JDBC sink connector',rgr:'Neo4j sink connector',star:'journeys.closed',jg:'journeys.closed'};
    var TTECH={in0:'24 partitions · kept 3 days',in1:'12 partitions · kept 3 days',in2:'6 partitions · kept 30 days · acks=all',in3:'6 partitions · kept 7 days',
      m1:'12 partitions · kept 3 days',m2b:'12 partitions · kept 3 days',tapJny:'12 partitions · consumer group journey',m3:'12 partitions · kept 1 day',m4:'12 partitions · kept 1 day',
      star:'6 partitions · compacted by session id',jg:'6 partitions · compacted by session id',rpg:'Kafka Connect · batches of 500 · upsert on id',rgr:'Kafka Connect · MERGE on customer and device'};
    var TRATE={m1:.9,m2b:.9,m3:.9,m4:.9,tapJny:.9,star:.0006,jg:.03,rpg:.006,rgr:.9};
    var TGT={in0:'ing',in1:'ing',in2:'ing',in3:'ing',replay:'ing',m2b:'enr',m3:'mat',star:'mat',tapJny:'jny'};
    var EDGES=['in0','in1','in2','in3','m1','m2b','m3','m4','tapJny','rpg','rgr','star','jg'];
    var STEPS={0:['Ad click','Search','Email link','Product page','Cart'],1:['App open','Product page','Wishlist'],2:['Cart']};
    var S0=still?3:(O.stage||1),S={stage:S0,fromStage:S0,morph:1,from:null,autoAt:null,w:0,h:0,t:0,L:null,dots:[],born:[],acc:0,load:1,target:1,boost:0,lastBoost:-99,bursts:[0,0,0,0],jit:0,jitNext:0,shown:0,showNext:0,disp:0,kick:0,hist:[],histNext:0,
           reps:{ing:2,enr:4,mat:2,jny:2},repT:{},cool:{ing:0,enr:8,mat:0,jny:0},pend:{ing:[],enr:[],mat:[],jny:[]},killed:[],rebal:{ing:0,enr:0,mat:0,jny:0},
           paused:{},lag:{ing:0,enr:0,mat:0,jny:0},peak:{ing:0,enr:0,mat:0,jny:0},catchT:{},slowT:-1,slowSaid:true,
           sessions:[],buyNext:0,mergeNext:4,sid:81,dead:3,tapOff:false,noPathNext:0,
           puffs:[],pulses:[],feed:[],feedNext:0,order:7482130,stockN:184312,lastJoin:null,flagT:-99,alertNext:30,
           tracers:[],tags:[],traceNo:4820,rows:{orders:[],stock:[]},rowId:1284503,lastRow:-9,
           mx:-999,my:-999,inside:false,ptr:'mouse',hov:null,pin:null,armed:null,kb:-1,dismissed:null,
           headBox:null,focusRoute:null,swallow:false,panel:null,annUntil:-1,
           ko:null,engaged:!O.calm,userPaused:false,
           tour:{on:O.scrollTips==='always'||(O.scrollTips!==false&&NOHOVER),idx:-1,p:null,off:false,changed:-1e9,vt:0,vb:0,vh:0,vw:0,raf:0,annT:null}};

    function lerp(a,b,k){return a+(b-a)*k;}
    // the text laid over the canvas, in canvas pixels, with a 12 px margin; null when it does not overlap the canvas
    function koRect(){var el=O.avoid;if(typeof el==='function')el=el();if(!el||!el.getBoundingClientRect)return null;
      var c=cv.getBoundingClientRect(),r=el.getBoundingClientRect();if(!r.width||!r.height)return null;
      var R={x:r.left-c.left-12,y:r.top-c.top-12,w:r.width+24,h:r.height+24};
      return R.x>=S.w||R.y>=S.h||R.x+R.w<=0||R.y+R.h<=0?null:R;}
    function inKo(x,y){var k=S.ko;return !!(k&&!S.L.V&&x>=k.x&&x<=k.x+k.w&&y>=k.y&&y<=k.y+k.h);}
    // Stages. The system grows when the client needs to know more, never because traffic grows; load works the same at every stage.
    var STAGES=[null,{n:'Online shop',q:'Needs to know what sold today',say:'Starting point · Ingest takes every event; orders and stock land in PostgreSQL for the daily report'},
      {n:'Shop with customers and stock',q:'Needs to know who bought, and what is left',say:'New question: who bought it? · Enrich adds customer and stock, Match joins each order with its scans'},
      {n:'Omnichannel retailer',q:'Needs to know how each buyer got there',say:'New question: how did they get here? · Journey rebuilds each session, the graph links paths and devices'}];
    function inStage(n,st){if(n==='enr'||n==='mat'||n==='m1'||n==='m2b'||n==='m3')return st>=2;
      if(n==='jny'||n==='tap'||n==='rt'||n==='gr'||n==='tapJny'||n==='star'||n==='jg'||n==='rgr'||n==='m4')return st>=3;return true;}
    function ez(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
    function vis(n){var a=inStage(n,S.fromStage)?1:0,b=inStage(n,S.stage)?1:0;return a===b?a:lerp(a,b,ez(S.morph));}
    function shown(h){if(h.kind==='box'||h.kind==='pips')return vis(h.k)>.5;if(h.kind==='tap'||h.kind==='rt'||h.kind==='gr')return vis(h.kind)>.5;
      if(h.kind==='edge')return vis(h.route)>.5&&S.L.P[h.route].len>12;return true;}
    // a multiplier on every alpha the drawing code sets, so a whole element can fade in or out
    var GA=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'globalAlpha'),GM=1;
    Object.defineProperty(cx,'globalAlpha',{configurable:true,get:function(){return GA.get.call(cx)/(GM||1);},set:function(v){GA.set.call(cx,v*GM);}});
    function gm(m){GM=m;cx.globalAlpha=1;}
    function rnd(a,b){return a+Math.random()*(b-a);}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function pick(a){return a[(Math.random()*a.length)|0];}
    function fmt(n){return Math.round(n).toLocaleString('en-US');}
    function r10(n){return Math.round(n/10)*10;}
    function now(){return performance.now();}
    function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();}
    function txt(s,x,y,font,col,align){cx.font=font;cx.fillStyle=col;cx.textAlign=align||'left';cx.fillText(s,x,y);}
    function q(a,c,b,n){var o=[];for(var i=0;i<=n;i++){var t=i/n,u=1-t;o.push({x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y});}return o;}
    function clock(){var d=new Date(),p=function(n){return String(n).padStart(2,'0');};return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());}
    function slow(){return S.t<S.slowT;}
    function flagged(){return S.t-S.flagT<12;}
    // 0 at the normal 4,800 events/s, 1 at the 50,000 limit
    function press(){return clamp((total()-5200)/44800,0,1);}
    function total(){return Math.min(50000,4000*S.load+S.jit);}
    // rates for labels: whole numbers above 10, one decimal below
    function rate(n){return n>=100?fmt(r10(n)):n>=10?fmt(n):n.toFixed(1);}
    function burstEnv(b){return b<=0?0:b>2.7?(3-b)/.3:b<1?b:1;}
    var live=document.createElement('div');live.setAttribute('aria-live','polite');
    live.style.cssText='position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';stage.appendChild(live);
    // the status line; a message caused by the viewer's own action is also read to screen readers
    function say(text,col,force){if(!force&&(S.t<S.feedNext||S.feed.some(function(m){return m.text===text;})))return;
      if(!S.engaged&&!force&&col===K.coral)col=K.muted;
      S.feedNext=S.t+2.6;S.feed=[{text:text,col:col,life:6}];if(S.t<S.annUntil)live.textContent=text;}
    function tag(x,y,text,fill){S.tags.push({x:x,y:y,text:text,fill:fill||'#ffffff',life:2.6});}

    // EIP glyphs, drawn by hand from the book's notation
    var G={
      adapter:function(x,y,s){cx.strokeRect(x-s*.5,y-s*.35,s*.55,s*.7);cx.beginPath();cx.moveTo(x+.05*s,y);cx.lineTo(x+s*.3,y);cx.moveTo(x+s*.3,y-s*.25);cx.lineTo(x+s*.3,y+s*.25);cx.moveTo(x+s*.45,y-s*.15);cx.lineTo(x+s*.45,y+s*.15);cx.stroke();},
      enricher:function(x,y,s){cx.strokeRect(x-s*.5,y-s*.35,s*.6,s*.7);cx.fillRect(x+s*.15,y-s*.2,s*.32,s*.4);},
      aggregator:function(x,y,s){cx.beginPath();[-.38,0,.38].forEach(function(o){cx.moveTo(x-s*.5,y+o*s);cx.lineTo(x,y);});cx.lineTo(x+s*.5,y);cx.stroke();cx.beginPath();cx.arc(x,y,s*.09,0,7);cx.fill();},
      resequencer:function(x,y,s){[[-.32,.3],[0,.55],[.32,.8]].forEach(function(b){cx.fillRect(x+b[0]*s-s*.1,y+s*.42-b[1]*s,s*.2,b[1]*s);});},
      router:function(x,y,s){cx.beginPath();cx.moveTo(x,y-s*.45);cx.lineTo(x+s*.45,y);cx.lineTo(x,y+s*.45);cx.lineTo(x-s*.45,y);cx.closePath();cx.stroke();},
      tapH:function(x,y,s){cx.beginPath();cx.moveTo(x-s*.5,y);cx.lineTo(x+s*.5,y);cx.moveTo(x,y);cx.lineTo(x,y+s*.45);cx.stroke();cx.beginPath();cx.arc(x,y,s*.12,0,7);cx.fill();},
      tapV:function(x,y,s){cx.beginPath();cx.moveTo(x,y-s*.5);cx.lineTo(x,y+s*.5);cx.moveTo(x,y);cx.lineTo(x+s*.45,y);cx.stroke();cx.beginPath();cx.arc(x,y,s*.12,0,7);cx.fill();}
    };
    function glyph(k,x,y,s,col){cx.save();cx.strokeStyle=col||K.amber;cx.fillStyle=col||K.amber;cx.lineWidth=1.4;cx.lineJoin='round';G[k](x,y,s);cx.restore();}

    // Layout: node positions and the polylines dots travel along. Dots store a fraction of their path, so a resize keeps them in place.
    var NODES=['ing','enr','mat','tap','jny','rt','pg','gr'];
    function cp(p){return{x:p.x,y:p.y};}
    function nodes(st){
      var w=S.w,h=S.h,V=w<768,L={V:V};
      if(!V){
        // the diagram area: right of the overlaid text when there is some, at most 1100 px wide.
        // Under 900 px the sources move to a row above the main line, so three services still fit.
        var ko=S.ko,left=ko?Math.max(0,ko.x+ko.w+8):0,avail=w-left-(ko?24:0),aw=Math.min(avail,1100),ax=ko?left:(w-aw)/2,C=aw<900;
        L.ax=ax;L.aw=aw;L.C=C;L.ST=C;
        var mainY=Math.round(h*(C?.44:.37)),brY=Math.round(h*.76),top=62;L.BH=50;
        if(C){L.BW=Math.round(clamp(aw*.19,128,146));L.JW=Math.round(clamp(aw*.27,170,206));
          var sy=Math.max(124,Math.round(h*.2));L.src=SRC.map(function(s,i){return{x:ax+30+i*(aw*.5-30)/3,y:sy};});
          var xi=ax+L.BW/2+8,xr=ax+aw-130,xm=xr-40-L.BW/2,xe=(xi+xm)/2,xd=ax+aw-50;
          var fit=Math.floor((xm-xi)/2-14);if(L.BW>fit){L.BW=Math.max(96,fit);}
          if(st>=3){L.ing={x:xi,y:mainY};L.enr={x:xe,y:mainY};L.mat={x:xm,y:mainY};L.tap={x:(xi+xe)/2,y:mainY};L.jny={x:(xe+xm)/2,y:brY};
            L.rt={x:xr,y:mainY};L.pg={x:xd,y:Math.round(Math.max(150,h*.27))};L.gr={x:xd,y:Math.round(h*.66)};}
          else if(st===2){var m2=ax+aw-170-L.BW/2;L.ing={x:xi,y:mainY};L.mat={x:m2,y:mainY};L.enr={x:(xi+m2)/2,y:mainY};L.tap={x:(xi+L.enr.x)/2,y:mainY};
            L.rt=cp(L.mat);L.jny=cp(L.mat);L.gr=cp(L.mat);L.pg={x:xd,y:mainY};}
          else{L.ing={x:ax+aw*.3,y:mainY};['enr','mat','tap','rt','jny','gr'].forEach(function(n){L[n]=cp(L.ing);});L.pg={x:ax+aw*.72,y:mainY};}
        }else{
          L.BW=Math.min(146,aw*.13);L.JW=Math.min(206,aw*.19);
          var X=function(f){return ax+f*aw;};
          L.src=SRC.map(function(s,i){return{x:X(.06),y:top+34+i*(h*.68-top-34)/3};});
          if(st>=3){var bx=[.25,.47,.69].map(X);
            L.ing={x:bx[0],y:mainY};L.enr={x:bx[1],y:mainY};L.mat={x:bx[2],y:mainY};
            L.tap={x:(bx[0]+bx[1])/2,y:mainY};L.jny={x:(bx[1]+bx[2])/2,y:brY};
            L.rt={x:X(.8),y:mainY};L.pg={x:X(.91),y:Math.round(h*.25)};L.gr={x:X(.91),y:Math.round(h*.66)};}
          else if(st===2){var b2=[.27,.5,.73].map(X);
            L.ing={x:b2[0],y:mainY};L.enr={x:b2[1],y:mainY};L.mat={x:b2[2],y:mainY};L.tap={x:(b2[0]+b2[1])/2,y:mainY};
            L.rt=cp(L.mat);L.jny=cp(L.mat);L.gr=cp(L.mat);L.pg={x:X(.9),y:mainY};}
          else{L.ing={x:X(.36),y:mainY};['enr','mat','tap','rt','jny','gr'].forEach(function(n){L[n]=cp(L.ing);});L.pg={x:X(.74),y:mainY};}
        }
      }else{
        // the top 124 px stay free for the counter, the status line and the label band
        var cw=Math.min(w,460),ox=(w-cw)/2,MX=ox+cw*.255,BX=ox+cw*.78,CX=ox+cw*.5;
        L.BW=Math.round(cw*.43);L.JW=Math.round(cw*.39);L.BH=42;
        L.src=SRC.map(function(s,i){return{x:ox+cw*(.12+i*.255),y:140};});
        if(st>=3){L.ing={x:MX,y:204};L.enr={x:MX,y:294};L.mat={x:MX,y:378};
          L.tap={x:MX,y:249};L.jny={x:BX,y:336};
          L.rt={x:MX,y:438};L.pg={x:ox+cw*.16,y:498};L.gr={x:ox+cw*.66,y:498};}
        else if(st===2){L.ing={x:CX,y:204};L.enr={x:CX,y:294};L.mat={x:CX,y:378};L.tap={x:CX,y:249};
          L.rt=cp(L.mat);L.jny=cp(L.mat);L.gr=cp(L.mat);L.pg={x:CX,y:474};}
        else{L.ing={x:CX,y:240};['enr','mat','tap','rt','jny','gr'].forEach(function(n){L[n]=cp(L.ing);});L.pg={x:CX,y:404};}
      }
      // pantopix-ro local option O.headBelow: the counter and the status line move under the diagram, so it starts at the top.
      // L.headY is the counter baseline; the host gets it as --eip-head-y, so the page can place things beside the counter.
      if(O.headBelow){var D=V?90:Math.max(0,L.src[0].y-72);L.src.forEach(function(p){p.y-=D;});['ing','enr','mat','tap','rt','jny','pg','gr'].forEach(function(n){L[n].y-=D;});
        L.headY=V?494:Math.round(Math.max(L.jny.y,L.gr.y,L.mat.y)+80);}
      return L;}
    // Layout: node positions and the polylines dots travel along. Dots store a fraction of their path, so a resize keeps them in place.
    function layout(){
      var L=nodes(S.stage),P={},w=S.w,V=L.V;
      if(S.morph<1&&S.from&&S.from.V===V&&S.from.C===L.C){var e=ez(S.morph),F0=S.from;
        NODES.forEach(function(n){L[n]={x:lerp(F0[n].x,L[n].x,e),y:lerp(F0[n].y,L[n].y,e)};});}
      L.bin=V?{x:L.ing.x+L.BW/2+19,y:L.ing.y}:{x:L.ing.x-10,y:L.ing.y+77};
      if(!V){
        P.tapJny=[L.tap,{x:L.tap.x,y:L.jny.y},{x:L.jny.x-L.JW/2,y:L.jny.y}];
        P.star=q({x:L.jny.x+L.JW/2-6,y:L.jny.y-8},{x:L.mat.x-4,y:L.jny.y-6},{x:L.mat.x,y:L.mat.y+L.BH/2},10);
        P.jg=q({x:L.jny.x+L.JW/2,y:L.jny.y},{x:(L.jny.x+L.gr.x)/2,y:L.jny.y+18},{x:L.gr.x,y:L.gr.y+4},14);
      }else{
        P.tapJny=[L.tap,{x:L.jny.x,y:L.tap.y},L.jny];
        P.star=[{x:L.jny.x-L.JW/2,y:L.jny.y-8},{x:L.mat.x+L.BW/2,y:L.mat.y+6}];
        P.jg=[L.jny,{x:L.jny.x,y:L.gr.y-14},{x:L.gr.x+12,y:L.gr.y-4}];
      }
      L.src.forEach(function(p,i){P['in'+i]=[p,L.ing];});
      P.m1=[L.ing,L.tap];P.m2b=[L.tap,L.enr];P.m3=[L.enr,L.mat];P.m4=[L.mat,L.rt];
      P.rpg=[L.rt,L.pg];P.rgr=[L.rt,L.gr];P.dl=[L.ing,L.bin];P.replay=[L.bin,L.ing];
      Object.keys(P).forEach(function(k){var pts=P[k],cum=[0];for(var i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));P[k]={pts:pts,cum:cum,len:cum[cum.length-1]||1};});
      L.P=P;L.speed=.15*Math.max(V?w:L.aw,S.h);
      S.L=L;
    }
    function setStage(st,auto){st=clamp(st,1,3);if(st===S.stage)return;
      var L=S.L,F0={V:L.V,C:L.C};NODES.forEach(function(n){F0[n]=cp(L[n]);});S.from=F0;
      S.fromStage=S.stage;S.stage=st;S.morph=still?1:0;S.autoAt=auto&&st<3?S.t+9:null;
      if(S.panel&&!shown(S.panel.h))closePanel();
      if(S.pin&&!shown(S.pin))S.pin=null;S.armed=null;S.hov=null;
      layout();say(STAGES[st].say,st===1?K.amber:K.teal,true);syncNav();
      if(still){render();refreshTip(true);}}
    function at(path,p){var P=path,d=clamp(p,0,1)*P.len,i=1;while(i<P.cum.length-1&&P.cum[i]<d)i++;
      var a=P.pts[i-1],b=P.pts[i],seg=(P.cum[i]-P.cum[i-1])||1,t=(d-P.cum[i-1])/seg;return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
    function boxRect(k){var L=S.L,p=L[k],w=k==='jny'?L.JW:L.BW;return{x:p.x-w/2,y:p.y-L.BH/2,w:w,h:L.BH};}
    function pipN(k){return Math.min(S.reps[k],S.L.V?8:12);}
    function pipPos(k,i){var L=S.L,b=boxRect(k),p=L[k],n=Math.max(1,pipN(k));
      return L.V?{x:b.x+b.w-8-i*6,y:b.y+6,s:3.5}:{x:p.x-(n*7-3)/2+i*7,y:b.y+b.h+7,s:4};}
    function pipsRect(k){var n=Math.max(1,pipN(k)),a=pipPos(k,0),b=pipPos(k,n-1),x0=Math.min(a.x,b.x);return{x:x0-3,y:a.y-3,w:Math.abs(b.x-a.x)+a.s+6,h:a.s+6};}
    function binRect(){var L=S.L;return L.V?{x:L.bin.x-11,y:L.bin.y-8,w:22,h:15}:{x:L.ing.x-62,y:L.bin.y-13,w:104,h:22};}
    function pulse(k){S.pulses.push({k:k,t:0});}

    // Journey: one row per session. Rows sit inside the Journey box; dots ease toward their slot every frame.
    function slots(){var L=S.L,b=boxRect('jny'),o=[];
      if(!L.V){var x0=b.x+b.w-80,y0=L.jny.y-13;for(var j=0;j<3;j++)o.push({x:x0,y:y0+j*9,dx:9,r:2.3});}
      else{var x1=b.x+b.w-7-15,y1=L.jny.y-6;for(var j2=0;j2<3;j2++)o.push({x:x1,y:y1+j2*7,dx:5,r:1.7});}
      return o;}
    function newSession(){if(S.sessions.length>=3){var old=S.sessions.filter(function(s){return !s.state;})[0];if(old)old.state='fade';}
      var s={id:S.sid++,dots:[],age:0,state:null,k:0};S.sessions.push(s);return s;}
    function entry(){var b=boxRect('jny');return S.L.V?{x:b.x+b.w-24,y:b.y+4}:{x:b.x+b.w-84,y:b.y+b.h/2};}
    function merge(){var open=S.sessions.filter(function(s){return !s.state;});if(open.length<2)return null;
      var a=open[0],b2=open[1];a.dots=a.dots.concat(b2.dots).slice(-4);S.sessions.splice(S.sessions.indexOf(b2),1);pulse('jny');S.mergeNext=S.t+rnd(7,10);
      say('Journey: phone and laptop are one customer · s-'+b2.id+' joined s-'+a.id,K.text,true);return [a.id,b2.id];}
    function journeyIn(d){
      var open=S.sessions.filter(function(s){return !s.state;}),e=entry(),dot={c:SRC[d.src].c,src:d.src,x:e.x,y:e.y,late:0};
      // a payment closes a session about every 4 s; other payment events (refunds, retries) join a row like any event
      if(d.src===2&&S.t>=S.buyNext){var s=open.filter(function(x){return x.dots.length>=2;})[0];
        if(s){s.dots.push(dot);if(s.dots.length>4)s.dots.shift();s.state='buy';s.k=0;S.buyNext=S.t+rnd(3.2,5);return;}}
      if(!open.length||(open.length<3&&Math.random()<.3)){var n=newSession();n.dots.push(dot);return;}
      var t=open[(Math.random()*open.length)|0];
      if(t.dots.length>=2&&Math.random()<.22){t.dots.splice(t.dots.length-1,0,dot);dot.late=1;
        say('Journey s-'+t.id+': a late '+['laptop','phone','payment'][d.src]+' event slid back into order',K.amber);}
      else t.dots.push(dot);
      if(t.dots.length>4)t.dots.shift();
      if(d.src===1&&open.length>=2&&S.t>=S.mergeNext&&Math.random()<.25)merge();
    }
    // what Match learns when a journey meets its order
    function joinOf(s){var steps=s.dots.slice(0,-1).map(function(d){return pick(STEPS[d.src]||STEPS[0]);});
      steps=steps.filter(function(x,i){return x!==steps[i-1];});if(!steps.length)steps=['Product page'];steps.push('Checkout');
      var dev=[];s.dots.forEach(function(d){var n=d.src===1?'phone':d.src===0?'laptop':null;if(n&&dev.indexOf(n)<0)dev.push(n);});
      return{order:S.order++,total:pick(['89.90','24.00','312.50','7.99','146.20'])+' EUR',sid:s.id,steps:steps,
        devices:dev.length>1?dev[0]+', then '+dev[1]:(dev[0]||'laptop')+' only',n:s.dots.length+((Math.random()*5)|0),mins:2+((Math.random()*26)|0),ms:Math.round(rnd(18,46))};}
    function shortPath(j){return j.steps.slice(-3).map(function(x){return x.split(' ')[0].toLowerCase();}).join(' → ');}

    // PostgreSQL rows, shown in the tables panel
    function stRow(){S.stockN++;return{sku:pick(['RO-118-42','RO-204-07','RO-331-15','RO-090-21']),loc:pick(['D-3','A-12','C-07','B-04']),qty:4+((Math.random()*180)|0),ev:pick(['pick','pack','goods in','dispatch']),ts:clock()};}
    function orRow(){var risky=Math.random()<.1,j=S.lastJoin;
      return{id:'#'+(S.order++),total:pick(['89.90','24.00','312.50','7.99','146.20'])+' EUR',status:risky?'review':pick(['paid','paid','paid','shipped']),
        path:S.stage<3?'—':S.tapOff?'none':j?shortPath(j):'ad → cart → checkout',steps:S.stage<3||S.tapOff?null:j?j.steps:['Ad click','Cart','Checkout'],devices:j?j.devices:'laptop only',
        card:'•••• '+(1000+((Math.random()*9000)|0)),risk:(risky?rnd(.8,.97):rnd(.01,.2)).toFixed(2),ts:clock()};}
    for(var r0=0;r0<3;r0++){S.rows.stock.push(stRow());S.rows.orders.push(orRow());}
    function record(d){if(S.t-S.lastRow<.8)return;S.lastRow=S.t;
      var T=d.src===2?S.rows.orders:S.rows.stock;T.unshift(d.src===2?orRow():stRow());T.length=3;
      if(S.panel&&S.panel.kind==='tables'&&!S.panel.hold)renderPanel();}

    function spawn(src,delay){var d={src:src,route:'in'+src,p:-(delay||0),dup:!!delay,kind:'main',enr:false};S.dots.push(d);return d;}
    function pickSrc(){var ws=SRC.map(function(s,i){return s.w*(1+4*burstEnv(S.bursts[i]));}),sum=ws.reduce(function(a,b){return a+b;},0),r=Math.random()*sum,c=0;
      for(var i=0;i<ws.length;i++){c+=ws[i];if(r<c)return i;}return 0;}
    // what happens when a dot reaches the end of its current path
    function arrive(d){
      var r=d.route,L=S.L;
      if(r.indexOf('in')===0){var b=boxRect('ing'),px={x:b.x+b.w-16,y:b.y};
        // Ingest checks every event on arrival: duplicates and bots drop out, malformed events go to dead letters
        if(d.bad){d.route='dl';d.p=0;tag(L.ing.x,b.y-10,'schema error: "total" is missing',K.coral);return true;}
        if(d.dup){S.puffs.push({x:px.x,y:px.y,c:SRC[d.src].c,t:0,label:'dup'});say('Ingest: duplicate scan dropped (a double beep)',K.blue);return false;}
        var x=Math.random();
        if(d.src===0&&x<.11){S.puffs.push({x:px.x,y:px.y,c:SRC[d.src].c,t:0});say('Ingest: bot traffic filtered out',K.muted);return false;}
        if(x<(d.src===0?.122:.012)){d.route='dl';d.p=0;return true;}
        d.route='m1';d.p=0;return true;}
      if(r==='replay'){d.route='m1';d.p=0;return true;}
      if(r==='dl'){S.dead++;pulse('bin');
        if(d.user)say('Ingest: the event failed the schema check · parked in dead letters, nothing else stopped',K.coral,true);
        else say('Ingest: malformed event parked in dead letters',K.coral);
        if(S.dead>14){S.dead=3;say('12 dead letters fixed and replayed',K.teal,true);}return false;}
      if(r==='m1'){if(d.src!==3&&!S.tapOff&&S.stage>=3)S.born.push({src:d.src,route:'tapJny',p:0,kind:'ghost'});d.route='m2b';d.p=0;return true;}
      if(r==='m2b'){d.route='m3';d.p=0;d.enr=S.stage>=2;return true;}
      if(r==='m3'){if(d.src===2&&S.tapOff&&S.stage>=3&&S.t>=S.noPathNext){S.noPathNext=S.t+5;say('Match: order #'+(S.order++)+' written without a path · Journey is stopped',K.coral,true);}
        d.route='m4';d.p=0;return true;}
      if(r==='m4'){if(d.src<2&&S.stage<3)return false;var g3=S.stage>=3;d.route=d.src<2&&g3?'rgr':'rpg';d.p=0;if(d.src===2&&g3)S.born.push({src:2,route:'rgr',p:0,kind:'main',enr:true});return true;}
      if(r==='rpg'){if(d.src>=2)record(d);return false;}
      if(r==='tapJny'){journeyIn(d);return false;}
      if(r==='star'){pulse('mat');S.lastJoin=d.join;say('Checkout: order #'+d.join.order+' joined with the path of session s-'+d.join.sid,K.teal);
        if(S.panel&&S.panel.kind==='join')renderPanel();return false;}
      if(r==='jg'){pulse('gr');return false;}
      return false;
    }

    // Actions
    function trace(src){
      if(still){var ms=Math.round(rnd(14,30));say('Event #'+(++S.traceNo)+' · '+SRC[src].n+' → '+(src<2?'graph':'PostgreSQL')+' · 4 hops · '+ms+' ms end to end',SRC[src].c,true);return;}
      S.tracers.push({src:src,route:'in'+src,p:0,keys:SRC[src].keys.slice(),ms:0,wait:0,no:++S.traceNo,trail:[]});if(S.tracers.length>2)S.tracers.shift();
      say('Tracing event #'+S.traceNo+' from '+SRC[src].n,SRC[src].c,true);}
    function tracerArrive(tr){
      var L=S.L,r=tr.route,ms;
      if(r.indexOf('in')===0){tr.keys=['id','ts'].concat(tr.keys);ms=Math.round(rnd(1,3));tag(L.ing.x,L.ing.y-L.BH/2-8,'+id, ts · '+ms+' ms');tr.route='m1';}
      else if(r==='m1'){ms=0;if(tr.src!==3&&!S.tapOff&&S.stage>=3)tag(L.tap.x+(L.V?44:0),L.tap.y+(L.V?-6:-12),'Journey reads it too',K.muted);tr.route='m2b';}
      else if(r==='m2b'&&S.stage<2){ms=0;tr.route='m3';}
      else if(r==='m2b'){var k2=tr.src===3?'stock':'customer';tr.keys.push(k2);ms=Math.round(slow()?rnd(90,140):rnd(3,7));tag(L.enr.x,L.enr.y-L.BH/2-8,'+'+k2+' · '+ms+' ms',slow()?K.coral:'#ffffff');tr.route='m3';}
      else if(r==='m3'&&S.stage<2){ms=0;tr.route='m4';}
      else if(r==='m3'){var k3=tr.src===2?(S.tapOff||S.stage<3?(S.stage<3?'scan':null):'path'):tr.src===3?'order':null;if(k3)tr.keys.push(k3);ms=Math.round(rnd(2,5));
        tag(L.mat.x,L.mat.y-L.BH/2-8,k3?'+'+k3+' · '+ms+' ms':tr.src===2?'no path · Journey stopped':'no order to join · '+ms+' ms',k3?'#ffffff':tr.src===2?K.coral:K.muted);tr.route='m4';}
      else if(r==='m4'&&tr.src<2&&S.stage<3){var tt=Math.round(tr.ms+tr.wait*1000);say('Event #'+tr.no+' · counted at '+(S.stage<2?'Ingest':'Match')+', not stored as a row · '+fmt(tt)+' ms end to end',SRC[tr.src].c,true);return false;}
      else if(r==='m4'){ms=S.stage>=3?1:0;tr.route=tr.src<2&&S.stage>=3?'rgr':'rpg';}
      else{ms=Math.round(rnd(3,6));tr.ms+=ms;var gr2=tr.route==='rgr',D=gr2?L.gr:L.pg;tag(D.x,D.y-24,(gr2?'linked · ':'stored · ')+ms+' ms',gr2?K.teal:K.amber2);
        var tot=Math.round(tr.ms+tr.wait*1000);
        say('Event #'+tr.no+' · '+(gr2?'graph':'PostgreSQL')+' · '+tr.keys.length+' fields · '+fmt(tot)+' ms end to end'+(tr.wait>.3?', '+tr.wait.toFixed(1)+' s of it waiting in Kafka':''),SRC[tr.src].c,true);
        if(tr.src===2)pulse('gr');return false;}
      tr.ms+=ms;tr.p=0;return true;}
    function broken(){S.dots.push({src:2,route:'in2',p:0,kind:'main',bad:true,user:true});say('Payments sent an event with no total',K.coral,true);}
    function replay(){if(!S.dead){say('No dead letters to replay',K.muted,true);return;}
      var n=S.dead;for(var i=0;i<Math.min(n,8);i++)S.dots.push({src:[0,1,3][i%3],route:'replay',p:-i*.18,kind:'main'});
      S.dead=0;pulse('bin');say(n+' dead letters fixed and replayed through Ingest',K.teal,true);}
    function slowLookup(){S.slowT=S.t+8;S.slowSaid=false;say('Enrich: customer lookups slowed to 120 ms · lag rising',K.coral,true);}
    function toggleTap(){S.tapOff=!S.tapOff;
      if(S.tapOff){S.dots=S.dots.filter(function(d){return d.route!=='tapJny';});say('Journey consumer stopped · new orders reach PostgreSQL without a path',K.coral,true);}
      else say('Journey consumer started · paths rejoin orders at Match again',K.teal,true);}
    function kill(k){
      if(S.reps[k]<1){say(NAME[k]+' has no pods left · Kubernetes is starting one',K.amber,true);return;}
      var pp=pipPos(k,pipN(k)-1);S.killed.push({x:pp.x,y:pp.y,s:pp.s,t:S.t});S.reps[k]--;S.pend[k].push(S.t+2);S.rebal[k]=S.reps[k]?.8:0;
      say(NAME[k]+' pod killed · '+(S.reps[k]?'its partitions move to the other '+S.reps[k]:'no pods left, events wait in Kafka'),K.coral,true);}
    function burst(i){S.bursts[i]=3;say(SRC[i].n+' burst · Ingest scaling out',SRC[i].c,true);}
    function addLoad(){var room=CAP-(S.target+S.boost),hb=S.headBox;
      if(room<=.01){showBubble();return;}
      var add=Math.min(STEP,room);S.boost+=add;S.lastBoost=S.t;S.showNext=S.t;
      S.kick=1;for(var wi=0;wi<4;wi++)for(var wj=0;wj<(S.L.V?3:6);wj++)S.dots.push({src:wi,route:'in'+wi,p:-wj*.045-Math.random()*.03,dup:false,kind:'main',enr:false});
      S.tags=S.tags.filter(function(g){return !g.head;});
      if(hb&&!S.L.V)tag(hb.x+hb.w+(S.hist.length>1?125:30),hb.y+20,'+'+fmt(add*4000)+' events/s',K.amber);if(S.tags.length)S.tags[S.tags.length-1].head=true;
      say(S.target+S.boost>=CAP-.01?'50,000 events/s · demo limit reached':'+5,000 events/s · watch the pods scale out',K.amber,true);}
    function edgeSrc(r){if(r.indexOf('in')===0)return +r[2];if(r==='rpg')return pick([2,3]);if(r==='rgr')return pick([0,1,2]);if(r==='star'||r==='jg')return 2;if(r==='tapJny')return pick([0,1]);return pickSrc();}
    function act(h){
      if(!h)return;S.engaged=true;S.annUntil=S.t+3;if(still)S.annUntil=1e9;
      if(h.kind==='box'){if(h.k==='ing')broken();else if(h.k==='enr')slowLookup();else if(h.k==='mat')openPanel('join',h);else{var m=merge();openPanel('devices',h,m);}}
      else if(h.kind==='pips')kill(h.k);
      else if(h.kind==='bin')replay();
      else if(h.kind==='tap')toggleTap();
      else if(h.kind==='pg')openPanel('tables',h);
      else if(h.kind==='gr')openPanel('graph',h);
      else if(h.kind==='src')burst(h.i);
      else if(h.kind==='srcs')trace(pickSrc());
      else if(h.kind==='edge')trace(edgeSrc(h.route));
      else if(h.kind==='head')addLoad();
      if(still)render();
      refreshTip(true);
    }

    // pantopix-ro local option O.label(h, I): lets the page rewrite a label (shorter copy, I.icons = [{src,name}]).
    function info(h){var I=info0(h);return I&&O.label?(O.label(h,I)||I):I;}
    // What each element says about itself. v() is the live value, refreshed twice a second.
    function info0(h){
      var T=total();
      if(h.kind==='box'){var k=h.k,B={
        ing:{p:'Channel Adapter',sup:'Message Filter · Idempotent Receiver · Invalid Message Channel',s:S.stage<2?'Takes events from every source, drops duplicates and web bots, parks broken events, and writes orders and stock to PostgreSQL.':'Takes events from every source, drops duplicates and web bots, and parks events that fail the schema check.',tech:'Spring Boot native image · Kafka · MQTT bridge',act:'Send a broken event',v:function(){return fmt(r10(total()))+' events/s in · '+S.reps.ing+' pods';}},
        enr:{p:'Content Enricher',sup:'Competing Consumers',s:'Adds the customer record to each shopper event, and the stock level to each scan.',tech:'Redis cache · max 12 pods, one per partition of events.clean',act:'Slow the lookup',v:function(){return S.reps.enr+' pods · lookup p95 '+(slow()?'120':'4')+' ms';}},
        mat:{p:'Aggregator',sup:'Correlation Identifier',s:S.stage<3?'Joins each order with its customer and its warehouse scans.':'Joins each order with the shopper path that led to it, and each scan with its order.',tech:S.stage<3?'Kafka Streams · join on order id':'Kafka Streams · 30-minute join window on customer id',act:'Show the last join',v:function(){return fmt(r10(total()*.0005*60))+' orders joined per minute';}},
        jny:{p:'Resequencer',sup:'Correlation Identifier · Aggregator',s:'Ties phone and laptop to one customer after login, and puts each session back in order.',tech:'Kafka Streams state store · closes on checkout or after 30 min',act:'See one customer on two devices',v:function(){return S.tapOff?'stopped · sessions not tracked':fmt(r10(total()*15))+' open sessions';}}}[k];
        return{c:K.amber,t:NAME[k],p:B.p,sup:B.sup,s:B.s,tech:B.tech,act:B.act,v:function(){var l=S.lag[k];return B.v()+(l>0?' · lag '+fmt(r10(l)):'');}};}
      if(h.kind==='pips')return{c:K.amber,t:NAME[h.k]+' pods',p:'Competing Consumers',s:'The pods share the topic partitions. A native image starts in under 2 s, so a lost pod is back almost at once.',tech:'Kubernetes · KEDA scales on consumer lag',act:'Kill a pod',v:function(){return S.reps[h.k]+' running'+(S.pend[h.k].length?' · '+S.pend[h.k].length+' starting':'');}};
      if(h.kind==='bin')return{c:K.coral,t:'Dead letters',p:'Invalid Message Channel',s:'Events that failed the schema check wait here until the producer or the schema is fixed.',tech:'topic events.dlq · kept 14 days',act:'Fix and replay them',v:function(){return S.dead+' waiting';}};
      if(h.kind==='tap')return{c:K.muted,t:'Second consumer',p:'Publish-Subscribe Channel',s:'Journey reads the same topic as its own consumer group. Kafka copies nothing, so the main line pays no extra cost.',tech:'topic events.clean · consumer group journey',act:S.tapOff?'Start the Journey consumer':'Stop the Journey consumer',v:function(){return S.tapOff?'stopped · orders land without a path':fmt(r10(total()*.9))+' events/s read by Journey';}};
      if(h.kind==='rt')return{c:K.amber,t:'Route',p:'Content-Based Router',s:'Orders and stock go to PostgreSQL. Customer, device and path links go to the graph.',tech:'Kafka Streams split()',v:function(){return fmt(r10(total()*.94))+' events/s routed';}};
      if(h.kind==='pg')return{c:K.amber,t:'PostgreSQL',p:'how much',s:S.stage<2?'Orders and stock, in rows and columns. Enough for the daily sales report.':S.stage<3?'Orders with their customer and scans, plus stock. The path column stays empty: nothing tracks how shoppers got here yet.':'Orders and stock, in rows and columns. Every order row carries the path that led to it.',tech:'p95 write 6 ms · orders partitioned by month',act:'Open the tables',v:function(){return rate(total()*.006)+' rows/s written';}};
      if(h.kind==='gr')return{c:K.teal,t:'Graph',p:'how did they get here',s:'Sessions, devices, customers and cards, linked to each other.',tech:'Neo4j · path query 9 ms',act:flagged()?'See the shared device':'Open the paths to checkout',v:function(){return flagged()?'shared device flagged':'90 M sessions · 410 M links';}};
      if(h.kind==='src'){var s=SRC[h.i];return{c:s.c,t:s.n,p:'topic '+s.topic,s:s.set,tech:s.pay,act:'Send a burst',v:function(){return rate(total()*s.real*(1+2*burstEnv(S.bursts[h.i])))+' events/s';}};}
      if(h.kind==='srcs')return{c:K.text,t:'Four sources',p:'web · mobile · payments · scanners',s:'The shop, the apps, the payment provider and the warehouse all send events. The dots are a sample, not to scale.',act:'Trace one event',v:function(){return fmt(r10(total()))+' events/s';}};
      if(h.kind==='edge'){var r=h.route,sink=r==='rpg'||r==='rgr',sx={tapJny:'Journey reading the same events as the main line, in its own consumer group.',star:'A closed journey on its way to meet its order at Match.',jg:'Every closed journey is written to the graph.',rgr:'Kafka Connect writes customer, device and path links to Neo4j.',rpg:'Kafka Connect writes orders and stock rows to PostgreSQL.'}[r];
        return{c:r.indexOf('in')===0?SRC[+r[2]].c:r==='rgr'||r==='jg'?K.teal:K.amber,t:sink?TOPIC[r]:'Topic '+TOPIC[r],p:sink?'Channel Adapter, outbound':'Message Channel',s:sx||'A Kafka topic between two services. It holds events when the next one is slow.',tech:'Kafka · '+TTECH[r],act:'Trace one event',
          v:function(){return rate(total()*(r.indexOf('in')===0?SRC[+r[2]].real:TRATE[r]))+(sink?' writes/s':' events/s');}};}
      if(h.kind==='head')return{c:K.amber,t:'Load',p:'events per second',s:'Add 5,000 events per second, up to 50,000, and watch the pods scale.',act:S.target+S.boost>=CAP-.01?'Go past the limit':'Add 5,000 events/s',v:function(){return fmt(r10(total()))+' events/s now';}};
      return null;
    }

    // Hit testing against the current layout. d < 0 means inside; smaller wins.
    function rectD(mx,my,R){var dx=Math.max(R.x-mx,0,mx-(R.x+R.w)),dy=Math.max(R.y-my,0,my-(R.y+R.h));return dx||dy?Math.hypot(dx,dy):-1;}
    function srcRect(i){var p=S.L.src[i];return S.L.V||S.L.ST?{x:p.x-30,y:p.y-24,w:60,h:33}:{x:p.x-9,y:p.y-22,w:104,h:31};}
    function dbRect(p){return{x:p.x-34,y:p.y-22,w:68,h:68};}
    function anchor(h){var L=S.L;
      if(h.kind==='box')return boxRect(h.k);if(h.kind==='pips')return pipsRect(h.k);if(h.kind==='bin')return binRect();
      if(h.kind==='tap')return{x:L.tap.x-10,y:L.tap.y-10,w:20,h:20};if(h.kind==='rt')return{x:L.rt.x-10,y:L.rt.y-10,w:20,h:20};
      if(h.kind==='pg')return dbRect(L.pg);if(h.kind==='gr')return dbRect(L.gr);if(h.kind==='src')return srcRect(h.i);
      if(h.kind==='srcs'){var a=srcRect(0),b=srcRect(3);return{x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.max(a.x+a.w,b.x+b.w)-Math.min(a.x,b.x),h:Math.max(a.y+a.h,b.y+b.h)-Math.min(a.y,b.y)};}
      if(h.kind==='head')return S.headBox;
      // a wire: its whole bounding box, so the label sits beside the wire and off both ends
      var pts=L.P[h.route].pts,x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;pts.forEach(function(q){x0=Math.min(x0,q.x);y0=Math.min(y0,q.y);x1=Math.max(x1,q.x);y1=Math.max(y1,q.y);});
      return{x:x0,y:y0,w:Math.max(2,x1-x0),h:Math.max(2,y1-y0)};}
    function candidates(mx,my,extra){
      var L=S.L,out=[],e=extra||0;if(!L||inKo(mx,my))return out;
      function add(o,d,lim){o.d=d;o.lim=lim+e;out.push(o);}
      KS.forEach(function(k){var pr=pipsRect(k),pd=rectD(mx,my,{x:pr.x-3,y:pr.y-3,w:pr.w+6,h:pr.h+6});add({kind:'pips',k:k,key:'pips:'+k},pd<0?-10:pd,2);
        add({kind:'box',k:k,key:'box:'+k},rectD(mx,my,boxRect(k)),6);});
      var bd=rectD(mx,my,binRect());add({kind:'bin',key:'bin'},bd<0?-5:bd,6);
      add({kind:'tap',key:'tap'},Math.hypot(mx-L.tap.x,my-L.tap.y)-10,6);
      add({kind:'rt',key:'rt'},Math.hypot(mx-L.rt.x,my-L.rt.y)-10,6);
      add({kind:'pg',key:'pg'},rectD(mx,my,dbRect(L.pg)),4);add({kind:'gr',key:'gr'},rectD(mx,my,dbRect(L.gr)),4);
      SRC.forEach(function(s,i){add({kind:'src',i:i,key:'src:'+i},rectD(mx,my,srcRect(i)),4);});
      if(S.headBox)add({kind:'head',key:'head'},rectD(mx,my,S.headBox),4);
      EDGES.forEach(function(r){var P=L.P[r],pts=P.pts,best=null;
        for(var i=1;i<pts.length;i++){var a=pts[i-1],b=pts[i],dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy||1,t=clamp(((mx-a.x)*dx+(my-a.y)*dy)/l,0,1),x=a.x+t*dx,y=a.y+t*dy,d=Math.hypot(mx-x,my-y);
          if(!best||d<best.d)best={d:d,x:x,y:y};}
        var f=pts[0],z=pts[pts.length-1];if(Math.hypot(best.x-f.x,best.y-f.y)<16||Math.hypot(best.x-z.x,best.y-z.y)<16)return;
        add({kind:'edge',route:r,key:'edge:'+r,ax:best.x,ay:best.y},best.d,7);});
      return out.filter(shown);}
    function bestOf(list){var b=null;list.forEach(function(c){if(c.d<c.lim&&(!b||c.d<b.d))b=c;});return b;}
    var KB=null;
    function kbStops(){if(KB)return KB.filter(shown);var o=SRC.map(function(s,i){return{kind:'src',i:i,key:'src:'+i};});
      ['ing','bin','tap','enr','pips:enr','jny','mat','rt','pg','gr','head'].forEach(function(k){
        if(k==='bin'||k==='tap'||k==='rt'||k==='pg'||k==='gr'||k==='head')o.push({kind:k,key:k});
        else if(k.indexOf('pips:')===0)o.push({kind:'pips',k:'enr',key:k});else o.push({kind:'box',k:k,key:'box:'+k});});
      KB=o;return o.filter(shown);}
    // the scroll tour, in the order data flows
    var TS=[{kind:'srcs',key:'srcs'},{kind:'box',k:'ing',key:'box:ing'},{kind:'box',k:'enr',key:'box:enr'},{kind:'box',k:'jny',key:'box:jny'},
      {kind:'box',k:'mat',key:'box:mat'},{kind:'pg',key:'pg'},{kind:'gr',key:'gr'}].map(function(x){x.tour=true;return x;});
    function tourStops(){return TS.filter(shown);}

    function step(dt){
      S.t+=dt;
      if(S.morph<1){S.morph=Math.min(1,S.morph+dt/1.2);layout();}
      if(S.autoAt!=null&&S.t>=S.autoAt&&!S.panel&&!S.hov&&!S.pin&&S.kb<0)setStage(S.stage+1,true);
      var L=S.L;
      var cyc=1+.3*Math.sin(S.t*Math.PI*2/40)+.12*Math.sin(S.t*Math.PI*2/13),extra=0;
      if(S.boost>0&&S.t-S.lastBoost>6)S.boost=Math.max(0,S.boost-dt*(S.boost*.35+.02));
      S.bursts=S.bursts.map(function(b,i){extra+=1.6*burstEnv(b)*(SRC[i].w*2+.3);return Math.max(0,b-dt);});
      S.load=S.target*cyc+S.boost+extra;
      if(S.t>=S.jitNext){S.jit=Math.round(rnd(-60,60));S.jitNext=S.t+rnd(1.6,2.6);}
      var T=total();if(S.t>=S.showNext||!S.shown){S.shown=r10(T);S.showNext=S.t+1.5;}
      S.disp=still||!S.disp?T:S.disp+(T-S.disp)*Math.min(1,dt*2.2);S.kick=Math.max(0,S.kick-dt*1.4);
      if(S.t>=S.histNext||!S.hist.length){S.hist.push(T);if(S.hist.length>60)S.hist.shift();S.histNext=S.t+.5;}
      if(!S.slowSaid&&S.t>=S.slowT){S.slowSaid=true;say('Lookups back to 4 ms · Enrich draining its lag',K.teal,true);}
      if(S.t>=S.alertNext&&S.stage>=3&&S.engaged){S.flagT=S.t;S.alertNext=S.t+rnd(40,60);say('Graph: shared device flagged · 3 accounts, 1 phone',K.coral,true);}
      // pods: each service scales on its load; Enrich is the slow stage, so it scales the most.
      // A killed pod comes back after 2 s, and scaling waits until it has.
      KS.forEach(function(k){
        var P=S.pend[k];while(P.length&&S.t>=P[0]){P.shift();S.reps[k]++;S.repT[k]=S.t;S.rebal[k]=.5;say('Kubernetes started a new '+NAME[k]+' pod · native image ready in 1.8 s',K.teal,true);}
        S.rebal[k]=Math.max(0,S.rebal[k]-dt);
        if(P.length)return;
        var l=S.load,want=k==='enr'?clamp(Math.ceil(l/(PER*(slow()?.12:1)))+(S.lag.enr>2000?1:0),3,12):clamp(Math.ceil(l/1.5)+1,2,10);
        S.cool[k]-=dt;
        if(want!==S.reps[k]&&S.cool[k]<=0){var up=want>S.reps[k];S.reps[k]+=up?1:-1;S.repT[k]=S.t;S.cool[k]=up?(S.lag[k]>10000?.4:1.2):5;
          if(k==='enr'||S.boost>0||extra>0)say(up?NAME[k]+' lag rising · scaled out to '+S.reps[k]+' pods':'Load eased · '+NAME[k]+' scaled in to '+S.reps[k]+' pods',K.amber);}
      });
      // consumer lag: what arrives minus what the pods can take. Paused, rebalancing or podless services take nothing.
      var inR={ing:T,enr:S.stage>=2?T*.94:0,mat:S.stage>=2?T*.94:0,jny:S.tapOff||S.stage<3?0:T*.9};
      KS.forEach(function(k){
        var cap=(S.paused[k]||S.rebal[k]>0||!S.reps[k])?0:S.reps[k]*(k==='enr'?PER*(slow()?.12:1):1.5)*4000,L0=S.lag[k],d=inR[k]-cap;
        if(d>0)S.lag[k]+=d*dt;
        else if(L0>0){if(S.catchT[k]==null)S.catchT[k]=S.t;S.lag[k]=Math.max(0,L0-Math.max(-d,S.peak[k]/2)*dt);}
        S.peak[k]=Math.max(S.peak[k],S.lag[k]);
        if(L0>0&&S.lag[k]===0){if(S.peak[k]>800&&S.catchT[k]!=null)say(NAME[k]+' caught up · '+fmt(r10(S.peak[k]))+' events drained in '+Math.max(.1,S.t-S.catchT[k]).toFixed(1)+' s',K.teal,true);S.peak[k]=0;S.catchT[k]=null;}
      });
      // spawn: scanners sometimes double-beep and send the same scan twice
      S.acc+=dt*(L.V?4.5:9)*Math.min(S.load,10);
      while(S.acc>1){S.acc--;var s=pickSrc();spawn(s);if(s===3&&Math.random()<.07)spawn(s,.06);}
      // move dots. A dot heading into a stalled service queues on its topic line; one heading into a lagging service slows down.
      var qn={};
      S.born=[];S.dots=S.dots.filter(function(d){var P=L.P[d.route];if(!P)return false;
        var k=TGT[d.route],blk=k&&(S.paused[k]||S.rebal[k]>0||!S.reps[k]),sp=dt*L.speed*(d.kind==='ghost'?.95:1)/P.len;
        if(S.focusRoute===d.route)sp*=.45;
        if(k&&S.lag[k]>0&&d.p>.55)sp*=Math.max(.3,1-S.lag[k]/6000);
        if(blk&&d.p>.4){var qi=qn[d.route]=(qn[d.route]||0)+1;if(qi>14)return false;d.p=Math.min(d.p+sp,Math.max(.4,.9-(qi-1)*6/P.len));return true;}
        d.p+=sp;if(d.p>=1)return arrive(d);return true;}).concat(S.born);
      // traced events follow the same rules, more slowly, and remember how long they waited
      S.tracers=S.tracers.filter(function(tr){var P=L.P[tr.route],k=TGT[tr.route],blk=k&&(S.paused[k]||S.rebal[k]>0||!S.reps[k]);
        if(blk&&tr.p>=.85){tr.wait+=dt;return true;}
        if(k&&S.lag[k]>0&&tr.p>.55){tr.wait+=dt*.5;tr.p+=dt*L.speed*.25/P.len;}else tr.p+=dt*L.speed*.5/P.len;
        var pt=at(P,tr.p);tr.trail.push(pt);if(tr.trail.length>14)tr.trail.shift();
        if(tr.p>=1)return tracerArrive(tr);return true;});
      // sessions: buy collapses the row into a ★; a session idle for 14 s (30 minutes in the story) fades out
      S.sessions.forEach(function(s){if(!S.paused.jny)s.age+=dt;
        if(!s.state&&s.age>(S.tapOff?3:14))s.state='fade';
        if(s.state){s.k+=dt/(s.state==='buy'?.7:.9);}});
      S.sessions=S.sessions.filter(function(s){if(!s.state||s.k<1)return true;
        if(s.state==='buy')S.dots.push({route:'star',p:0,kind:'star',join:joinOf(s)});
        else if(Math.random()<.35&&!S.tapOff)say('Session s-'+s.id+' timed out after 30 min · path kept in the graph',K.muted);
        S.dots.push({route:'jg',p:0,kind:'gw'});return false;});
      var sl=slots();
      S.sessions.forEach(function(s,j){var row=sl[Math.min(j,2)],n=s.dots.length,cxr=row.x+(n-1)*row.dx/2;
        s.dots.forEach(function(d,i){var tx=row.x+i*row.dx,ty=row.y;if(s.state==='buy'){tx=lerp(tx,cxr,Math.min(1,s.k*1.4));}
          var kk=still?1:Math.min(1,dt*7);d.x=lerp(d.x,tx,kk);d.y=lerp(d.y,ty,kk);d.late=Math.max(0,d.late-dt*.6);});});
      S.puffs=S.puffs.filter(function(p){p.t+=dt/.7;return p.t<1;});
      S.pulses=S.pulses.filter(function(p){p.t+=dt/.8;return p.t<1;});
      S.killed=S.killed.filter(function(p){return S.t-p.t<1.2;});
      S.tags=S.tags.filter(function(t){t.life-=dt;return t.life>0;});
      S.feed=S.feed.filter(function(m){m.life-=dt;return m.life>0||still;});
    }

    function star(p,r,col){cx.save();cx.fillStyle=col;cx.shadowColor=col;cx.shadowBlur=8;cx.beginPath();for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr2=i%2?r*.45:r;cx.lineTo(p.x+Math.cos(a)*rr2,p.y+Math.sin(a)*rr2);}cx.closePath();cx.fill();cx.restore();}
    function line(path,col,al,lw,dash){var pts=path.pts;cx.save();cx.globalAlpha=al;cx.strokeStyle=col;cx.lineWidth=lw||1.2;if(dash)cx.setLineDash(dash);
      cx.beginPath();pts.forEach(function(p,i){i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y);});cx.stroke();cx.restore();}
    function ring(x,y,r,col,a){cx.save();cx.globalAlpha=a==null?.9:a;cx.strokeStyle=col;cx.lineWidth=1.5;cx.beginPath();cx.arc(x,y,r,0,7);cx.stroke();cx.restore();}

    function draw(){
      var L=S.L,P=L.P,w=S.w,V=L.V,F=current();
      if(O.transparent)cx.clearRect(0,0,w,S.h);else{cx.fillStyle=K.bg;cx.fillRect(0,0,w,S.h);}cx.lineCap='round';
      // header: events/s and the status line
      var fs=V?24:30;cx.font='700 '+fs+'px '+HEAD;var slot=cx.measureText('88,888').width,hx=V?16:Math.max(24,L.ax+(S.ko?8:0)),hy=O.headBelow&&L.headY?L.headY:(V?34:40);if(O.headBelow&&S.hyCss!==hy){S.hyCss=hy;cv.parentNode.style.setProperty('--eip-head-y',hy+'px');}
      var Tn=total(),pr=press(),hot=pr>.55?K.coral:K.amber,shownV=Math.abs(S.disp-Tn)>60?r10(S.disp):S.shown;
      txt(fmt(shownV),hx+slot,hy,'700 '+Math.round(fs*(1+.22*S.kick))+'px '+HEAD,hot,'right');
      txt('events/s',hx+slot+8,hy,'600 '+(V?11:13)+'px '+HEAD,K.muted);
      var uw=cx.measureText('events/s').width,sx0=hx+slot+8+uw+12,sw=V?60:120,sh=V?18:24,sy0=hy-sh+3,Hs=S.hist;
      if(Hs.length>1){cx.save();cx.strokeStyle='rgba(167,179,194,.25)';cx.lineWidth=1;cx.setLineDash([2,3]);cx.beginPath();cx.moveTo(sx0,sy0);cx.lineTo(sx0+sw,sy0);cx.stroke();cx.setLineDash([]);
        cx.beginPath();Hs.forEach(function(v,i){var X=sx0+sw*(i+60-Hs.length)/59,Y=sy0+sh-sh*Math.min(1,v/50000);i?cx.lineTo(X,Y):cx.moveTo(X,Y);});
        cx.strokeStyle=hot;cx.lineWidth=1.5;cx.stroke();cx.lineTo(sx0+sw,sy0+sh);cx.lineTo(sx0+sw*(60-Hs.length)/59,sy0+sh);cx.closePath();cx.globalAlpha=.15;cx.fillStyle=hot;cx.fill();cx.restore();
        if(!V)txt('last 30 s',sx0+sw+8,hy-4,'400 9px '+MONO,'rgba(167,179,194,.75)');}
      S.headBox={x:hx-4,y:hy-fs+2,w:sx0+sw-hx+8,h:fs+4};
      if(F&&F.kind==='head'){cx.fillStyle=K.amber;cx.globalAlpha=.8;cx.fillRect(hx,hy+4,sx0+sw-hx,1.5);cx.globalAlpha=1;}
      if(O.noNote);else if(V||Hs.length<2)txt(V?'Illustration · dots are a sample':'Illustration · e-commerce platform · dots are a sample, not to scale',hx,hy+(V?16:18),'400 10px '+MONO,'rgba(167,179,194,.8)');else txt('Illustration · dots are a sample, not to scale',hx,hy+18,'400 10px '+MONO,'rgba(167,179,194,.8)');
      S.feed.forEach(function(m){cx.globalAlpha=clamp(m.life,0,1);var f='400 '+(V?10:11.5)+'px '+MONO,t=m.text;
        if(V||L.C){var sx=V?16:hx,sxw=V?w-32:L.aw-(hx-L.ax)-16;cx.font=f;while(t.length>8&&cx.measureText(t).width>sxw)t=t.slice(0,-2);if(t!==m.text)t=t.replace(/\s*\S?$/,'…');txt(t,sx,O.headBelow?hy+38:(V?74:84),f,m.col);}
        else{cx.font=f;var mw=L.aw*.55,rx=S.ko?L.ax+L.aw:w-24;while(t.length>8&&cx.measureText(t).width>mw)t=t.slice(0,-2);if(t!==m.text)t=t.replace(/\s*\S?$/,'…');txt(t,rx,44,f,m.col,'right');}});
      cx.globalAlpha=1;
      // edges; the focused one glows and its dots slow down
      S.focusRoute=F&&F.kind==='edge'?F.route:null;
      var prL=press();L.src.forEach(function(p,i){line(P['in'+i],SRC[i].c,.35+.4*prL,1+2.4*prL);});
      ['m1','m2b'].forEach(function(k){gm(vis(k));if(prL>0)line(P[k],K.amber,.25*prL,1+2*prL);});
      ['m1','m2b','m3','m4'].forEach(function(k){gm(vis(k));line(P[k],K.muted,.32);});gm(1);
      line(P.rpg,K.amber,.4);gm(vis('rgr'));line(P.rgr,K.teal,.4);
      gm(vis('tapJny'));line(P.tapJny,S.tapOff?K.coral:K.muted,S.tapOff?.3:.45,1,[3,4]);
      gm(vis('star'));line(P.star,K.amber2,S.tapOff?.18:.5,1.2,[2,3]);gm(vis('jg'));line(P.jg,K.teal,.4);gm(1);
      if(S.focusRoute){var fp=P[S.focusRoute],fc=info(F).c;line(fp,fc,.18,7);line(fp,fc,.95,1.6);
        if(!still){cx.save();cx.setLineDash([1,11]);cx.lineDashOffset=-S.t*38;line(fp,'#ffffff',.6,1.2,[1,11]);cx.restore();}}
      // dots, under the boxes: inside a box an event is being processed
      S.dots.forEach(function(d){if(d.p<0)return;var p=at(P[d.route],d.p);gm(vis(d.route));
        if(d.kind==='star'){star(p,V?5:6,K.amber2);return;}
        var col=d.bad?K.coral:d.kind==='gw'?K.teal:SRC[d.src].c,ring2=d.enr||d.kind==='gw';
        cx.globalAlpha=d.kind==='ghost'?.5:1;cx.fillStyle=col;cx.beginPath();cx.arc(p.x,p.y,d.bad?3.4:d.kind==='ghost'?1.9:2.2,0,7);cx.fill();
        if(d.bad){cx.strokeStyle='#ffffff';cx.lineWidth=1;cx.beginPath();cx.arc(p.x,p.y,6,0,7);cx.stroke();}
        if(ring2){cx.globalAlpha=.55;cx.strokeStyle=col;cx.lineWidth=1;cx.beginPath();cx.arc(p.x,p.y,4.8,0,7);cx.stroke();}
        cx.globalAlpha=1;});
      // second consumer: glyph and label
      gm(vis('tap'));var tapCol=S.tapOff?K.coral:F&&F.kind==='tap'?K.text:K.muted;
      glyph(V?'tapV':'tapH',L.tap.x,L.tap.y,V?11:12,tapCol);
      if(S.tapOff){cx.strokeStyle=K.coral;cx.lineWidth=1.6;cx.beginPath();var tx0=V?L.tap.x+8:L.tap.x,ty0=V?L.tap.y:L.tap.y+10;cx.moveTo(tx0-4,ty0-4);cx.lineTo(tx0+4,ty0+4);cx.moveTo(tx0+4,ty0-4);cx.lineTo(tx0-4,ty0+4);cx.stroke();}
      if(F&&F.kind==='tap')ring(L.tap.x,L.tap.y,13,K.text);
      if(!V)txt(S.tapOff?'2nd consumer · stopped':'2nd consumer',L.tap.x-6,L.tap.y+40,'400 10px '+MONO,S.tapOff?K.coral:K.muted);gm(1);
      // boxes
      BOX.forEach(function(B){gm(vis(B[0]));if(GM<.02)return;var k=B[0],b=boxRect(k),p=L[k],on=F&&(F.kind==='box'||F.kind==='pips')&&F.k===k,pz=S.paused[k],lag=S.lag[k];
        if(on&&F.kind==='box'){cx.save();cx.shadowColor=K.amber;cx.shadowBlur=14;cx.fillStyle=K.box;rr(b.x,b.y,b.w,b.h,V?7:8);cx.fill();cx.restore();}
        cx.fillStyle=K.box;rr(b.x,b.y,b.w,b.h,V?7:8);cx.fill();
        cx.save();if(pz)cx.setLineDash([4,3]);cx.strokeStyle=pz?K.coral:on&&F.kind==='box'?K.amber:K.edge;cx.lineWidth=on&&F.kind==='box'?1.5:1;cx.stroke();cx.restore();
        var sub=pz?'❚❚ paused':S.rebal[k]>0?'rebalancing…':!S.reps[k]?'no pods':B[2],subCol=pz||!S.reps[k]?K.coral:S.rebal[k]>0?K.amber:K.muted;
        if(k==='enr'&&slow()&&!pz){sub='slow lookups';subCol=K.coral;}
        if(V){glyph(B[3],b.x+16,p.y,14);txt(B[1],b.x+31,p.y-3,'600 13px '+HEAD,K.text);txt(lag>0&&!pz?'lag '+fmt(r10(lag)):sub,b.x+31,p.y+11,'400 9px '+MONO,lag>0?K.coral:subCol);
          if(pz&&lag>0)txt(fmt(r10(lag)),b.x+b.w-8,p.y+11,'500 9px '+MONO,K.coral,'right');}
        else{glyph(B[3],b.x+20,p.y,16);txt(B[1],b.x+38,p.y-3,'600 15px '+HEAD,K.text);txt(sub,b.x+38,p.y+13,'400 10px '+MONO,subCol);
          if(lag>0)txt('lag '+fmt(r10(lag)),p.x,b.y-8,'500 10px '+MONO,K.coral,'center');}
        // pods: below the box on wide screens, in its top-right corner on narrow ones
        var n=pipN(k),tn=S.repT[k]!=null?Math.min(1,(S.t-S.repT[k])/.5):1;
        for(var i=0;i<n;i++){var pp=pipPos(k,i);cx.globalAlpha=.85*(i===n-1?tn:1);cx.fillStyle=K.amber;cx.fillRect(pp.x,pp.y,pp.s,pp.s);}
        S.pend[k].forEach(function(t0,j){var pp=pipPos(k,n+j),ph=still?1:.4+.4*Math.sin(S.t*8);cx.globalAlpha=ph;cx.strokeStyle=K.amber;cx.lineWidth=1;cx.strokeRect(pp.x+.5,pp.y+.5,pp.s-1,pp.s-1);});
        cx.globalAlpha=1;
        if(on&&F.kind==='pips'){var pr=pipsRect(k),ex=S.pend[k].length*(V?6:7);cx.strokeStyle=K.amber;cx.lineWidth=1.2;rr(pr.x-1-(V?ex:0),pr.y-1,pr.w+2+ex,pr.h+2,3);cx.stroke();}});gm(1);
      S.killed.forEach(function(p){var a=1-(S.t-p.t)/1.2;cx.globalAlpha=a;cx.fillStyle=K.coral;cx.fillRect(p.x,p.y+(1-a)*6,p.s,p.s);cx.globalAlpha=1;});
      // session rows inside Journey
      var sl=slots();gm(vis('jny'));
      S.sessions.forEach(function(s,j){var row=sl[Math.min(j,2)],a=s.state==='fade'?1-s.k:s.state==='buy'?1-Math.max(0,s.k-.6)/.4:1;
        s.dots.forEach(function(d){cx.globalAlpha=Math.max(0,a);cx.fillStyle=d.c;cx.beginPath();cx.arc(d.x,d.y,row.r,0,7);cx.fill();
          if(d.late>.05){cx.globalAlpha=d.late;cx.strokeStyle=K.amber;cx.lineWidth=1;cx.beginPath();cx.arc(d.x,d.y,row.r+2.5,0,7);cx.stroke();}});
        if(!V){cx.globalAlpha=Math.max(0,a);txt('s-'+s.id+(s.state==='buy'?' ✓':''),row.x+36,row.y+3,'400 8.5px '+MONO,s.state==='buy'?K.teal:s.state==='fade'?'rgba(167,179,194,.5)':K.muted);}
        cx.globalAlpha=1;});gm(1);
      // router
      gm(vis('rt'));glyph('router',L.rt.x,L.rt.y,V?14:18);if(F&&F.kind==='rt')ring(L.rt.x,L.rt.y,13,K.amber);
      if(!V)txt('Content-Based Router',L.rt.x-6,L.rt.y+44,'400 10px '+MONO,K.muted,'center');gm(1);
      // dead letters
      var bR=binRect(),bOn=F&&F.kind==='bin';
      cx.save();cx.setLineDash([V?2:3,V?2:3]);cx.strokeStyle=K.coral;cx.globalAlpha=bOn?1:.75;cx.lineWidth=bOn?1.5:1;rr(bR.x,bR.y,bR.w,bR.h,V?3:4);cx.stroke();cx.restore();
      if(bOn){cx.globalAlpha=.12;cx.fillStyle=K.coral;rr(bR.x,bR.y,bR.w,bR.h,4);cx.fill();cx.globalAlpha=1;}
      if(V)txt(String(S.dead),L.bin.x,L.bin.y+3,'500 9px '+MONO,K.coral,'center');else txt('dead letters '+S.dead,L.ing.x-10,L.bin.y+2,'400 10px '+MONO,K.coral,'center');
      // databases
      (function(p){var r=V?8:11,hh=V?12:16;cx.strokeStyle=K.amber;cx.lineWidth=1.3;cx.beginPath();cx.ellipse(p.x,p.y-hh/2,r,r*.38,0,0,7);cx.stroke();
        cx.beginPath();cx.moveTo(p.x-r,p.y-hh/2);cx.lineTo(p.x-r,p.y+hh/2);cx.ellipse(p.x,p.y+hh/2,r,r*.38,0,Math.PI,0,true);cx.lineTo(p.x+r,p.y-hh/2);cx.stroke();
        if(F&&F.kind==='pg')ring(p.x,p.y,V?17:21,K.amber);
        txt('PostgreSQL',p.x,p.y+28,'600 '+(V?12:14)+'px '+HEAD,K.text,'center');txt(S.stage<2?'daily report':'orders · stock',p.x,p.y+(V?41:42),'400 '+(V?9:10)+'px '+MONO,K.muted,'center');})(L.pg);
      gm(vis('gr'));(function(p){var s=V?9:11,pts=[[0,-s],[-s,s*.6],[s,s*.6],[0,0]],fl=flagged();cx.strokeStyle=K.teal;cx.fillStyle=K.teal;cx.lineWidth=1.2;cx.beginPath();
        [[3,0],[3,1],[3,2],[1,2]].forEach(function(e){cx.moveTo(p.x+pts[e[0]][0],p.y+pts[e[0]][1]);cx.lineTo(p.x+pts[e[1]][0],p.y+pts[e[1]][1]);});cx.stroke();
        pts.forEach(function(q2,i){cx.fillStyle=fl&&i===3?K.coral:K.teal;cx.beginPath();cx.arc(p.x+q2[0],p.y+q2[1],V?2.2:2.6,0,7);cx.fill();});
        if(fl&&!still){var ph=(S.t*1.2)%1;ring(p.x,p.y,10+ph*16,K.coral,(1-ph)*.8);}else if(fl)ring(p.x,p.y,16,K.coral,.8);
        if(F&&F.kind==='gr')ring(p.x,p.y,V?17:21,K.teal);
        txt('Graph',p.x,p.y+(V?28:30),'600 '+(V?12:14)+'px '+HEAD,K.text,'center');txt(fl?'device flagged':'paths · devices',p.x,p.y+(V?41:44),'400 '+(V?9:10)+'px '+MONO,fl?K.coral:K.muted,'center');})(L.gr);gm(1);
      // sources, with a ring while a burst runs
      L.src.forEach(function(p,i){var b=burstEnv(S.bursts[i]),on=F&&((F.kind==='src'&&F.i===i)||F.kind==='srcs');
        if(b>0&&!still){for(var j=0;j<2;j++){var ph=(S.t*1.6+j*.5)%1;ring(p.x,p.y,6+ph*18,SRC[i].c,(1-ph)*.6*b);}}
        if(on)ring(p.x,p.y,10,SRC[i].c);
        var prS=press();if(prS>0&&!still){var ph2=(S.t*(1+3*prS)+i*.25)%1;ring(p.x,p.y,6+ph2*(10+14*prS),SRC[i].c,(1-ph2)*.7*prS);}
        cx.fillStyle=SRC[i].c;cx.beginPath();cx.arc(p.x,p.y,(V?4.5:5)+b*1.5+prS*2,0,7);cx.fill();
        if(V||L.ST)txt(SRC[i].sn,p.x,p.y-11,'600 10.5px '+HEAD,K.text,'center');else txt(SRC[i].n,p.x+10,p.y-9,'600 12px '+HEAD,K.text);});
      // puffs at Ingest: filtered events and duplicates
      S.puffs.forEach(function(p){cx.globalAlpha=(1-p.t)*.8;cx.strokeStyle=p.c;cx.lineWidth=1.2;cx.beginPath();cx.arc(p.x,p.y-p.t*10,2+p.t*7,0,7);cx.stroke();
        if(p.label)txt(p.label,p.x+8,p.y-6-p.t*12,'500 9px '+MONO,p.c);cx.globalAlpha=1;});
      // pulses: Match when a journey rejoins, the graph on a write, Journey on a merge, the dead-letter bin
      S.pulses.forEach(function(p){gm(p.k==='bin'?1:vis(p.k));var a=(1-p.t)*.8,g=p.t*8;cx.globalAlpha=a;cx.lineWidth=1.5;
        if(p.k==='gr'){cx.strokeStyle=K.teal;cx.beginPath();cx.arc(L.gr.x,L.gr.y,12+p.t*14,0,7);cx.stroke();}
        else if(p.k==='bin'){cx.strokeStyle=K.coral;rr(bR.x-g/2,bR.y-g/2,bR.w+g,bR.h+g,5);cx.stroke();}
        else{var b=boxRect(p.k);cx.strokeStyle=p.k==='mat'?K.amber2:K.text;rr(b.x-g,b.y-g,b.w+2*g,b.h+2*g,8+g/2);cx.stroke();}
        cx.globalAlpha=1;});gm(1);
      // traced events: a white head, a trail, and the payload growing at every hop
      S.tracers.forEach(function(tr){var col=SRC[tr.src].c,p=at(P[tr.route],tr.p);
        tr.trail.forEach(function(q2,i){cx.globalAlpha=i/tr.trail.length*.5;cx.fillStyle=col;cx.beginPath();cx.arc(q2.x,q2.y,1.5+i/tr.trail.length*2.5,0,7);cx.fill();});
        cx.globalAlpha=.3;cx.fillStyle=col;cx.beginPath();cx.arc(p.x,p.y,11,0,7);cx.fill();
        cx.globalAlpha=1;cx.fillStyle='#ffffff';cx.beginPath();cx.arc(p.x,p.y,5,0,7);cx.fill();cx.strokeStyle=col;cx.lineWidth=2;cx.beginPath();cx.arc(p.x,p.y,7.5,0,7);cx.stroke();
        var ks=tr.keys,pl='{ '+(ks.length>4?'…, ':'')+ks.slice(-4).join(', ')+' }';cx.font='500 10px '+MONO;var pw=cx.measureText(pl).width,lx=clamp(p.x,pw/2+6,w-pw/2-6),ly=p.y-14;
        cx.lineJoin='round';cx.strokeStyle=K.bg;cx.lineWidth=4;cx.textAlign='center';cx.strokeText(pl,lx,ly);cx.fillStyle=K.amber2;cx.fillText(pl,lx,ly);});
      S.tags.forEach(function(t){var a=clamp(t.life/.6,0,1),rise=(2.6-t.life)*4;cx.globalAlpha=a;cx.font='600 10.5px '+MONO;cx.textAlign='center';cx.lineJoin='round';
        var tx=clamp(t.x,cx.measureText(t.text).width/2+6,w-cx.measureText(t.text).width/2-6);
        cx.strokeStyle=K.bg;cx.lineWidth=4;cx.strokeText(t.text,tx,t.y-rise);cx.fillStyle=t.fill;cx.fillText(t.text,tx,t.y-rise);});
      cx.globalAlpha=1;
      // nothing moves under the overlaid text
      if(S.ko&&!V){var k=S.ko;cx.save();if(O.transparent){cx.globalCompositeOperation='destination-out';cx.fillStyle='#000';}else cx.fillStyle=K.bg;cx.fillRect(k.x,k.y,k.w,k.h);cx.restore();}
    }

    // ---------- Explore: the label ----------
    var tip=document.createElement('div');tip.className='eip-tip';
    tip.setAttribute('aria-hidden','true');
    tip.innerHTML='<div class="h"><i></i><b></b><span></span></div><div class="sup"></div><p></p><div class="v"></div><div class="tech"></div><div class="cta"></div>';
    stage.appendChild(tip);
    var tE={dot:tip.querySelector('.h i'),t:tip.querySelector('.h b'),p:tip.querySelector('.h span'),sup:tip.querySelector('.sup'),s:tip.querySelector('p'),
      v:tip.querySelector('.v'),tech:tip.querySelector('.tech'),hint:tip.querySelector('.cta')};
    var tipH=null,tipI=null,tipKey=null,tipNext=0;
    // the one action, phrased for how the viewer reaches it
    function hint(h,I){if(!I.act)return '';var a=I.act.charAt(0).toLowerCase()+I.act.slice(1);
      return (S.kb>=0?'Enter':S.ptr==='mouse'?'Click':h.tour||S.armed!==h.key?'Tap':'Tap again')+' to '+a;}
    // what the label shows, in priority order: the keyboard stop, a tapped element, the mouse, the scroll tour
    function current(){var h=null;
      if(S.kb>=0)h=kbStops()[S.kb%kbStops().length];else if(S.pin)h=S.pin;else if(S.hov)h=S.hov;else if(S.tour.idx>=0)h=tourVisible(tourStops()[S.tour.idx]);
      if(h&&S.dismissed===h.key)return null;return h;}
    function dismiss(){var h=current();if(h)S.dismissed=h.key;S.pin=null;S.armed=null;refreshTip();if(still)render();}
    function bandTop(th){var r=cv.getBoundingClientRect(),vt=clamp(-r.top,0,r.height);return Math.round(clamp(vt+8,8,Math.max(8,S.h-th-8)));}
    // tall canvas: the label spans the width, below its element when that fits on screen, else above it, else at the top of the visible part
    function bandPlace(el,A){var r=cv.getBoundingClientRect(),vh=S.tour.vh||window.innerHeight,vt=clamp(-r.top,0,S.h),vb=clamp(vh-r.top,0,S.h),th=el.offsetHeight,y=A.y+A.h+10;
      if(y+th>vb-8){y=A.y-10-th;if(y<vt+8)y=vt+8;}el.style.top=Math.round(clamp(y,8,Math.max(8,S.h-th-8)))+'px';}
    // what a label should not cover: every node, the header, the status line, and points sampled along every wire
    function obstacles(){var L=S.L,o={rects:[],pts:[]};
      KS.forEach(function(k){o.rects.push(boxRect(k));});SRC.forEach(function(s,i){o.rects.push(srcRect(i));});
      o.rects.push(dbRect(L.pg),dbRect(L.gr),binRect(),{x:L.tap.x-12,y:L.tap.y-12,w:24,h:24},{x:L.rt.x-12,y:L.rt.y-12,w:24,h:24});
      if(S.headBox)o.rects.push(S.headBox);if(S.navBox)o.rects.push(S.navBox);if(!L.V)o.rects.push(L.C?{x:L.ax,y:70,w:L.aw,h:20}:{x:L.ax+L.aw*.42,y:30,w:L.aw*.58,h:20},{x:L.tap.x-60,y:L.tap.y+28,w:110,h:16},{x:L.rt.x-70,y:L.rt.y+32,w:130,h:16});
      EDGES.concat(['dl']).forEach(function(r){var P=L.P[r];for(var d=0;d<=P.len;d+=10)o.pts.push(at(P,d/P.len));});
      return o;}
    function ovl(a,b){var w=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),h=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);return w>0&&h>0?w*h:0;}
    // every position on a 16 px grid near the element; the score adds what the label would cover and how far it sits from its element
    function place(el,A){var W=S.w,H=S.h,tw=el.offsetWidth,th=el.offsetHeight,O=obstacles(),best=null,AA={x:A.x-6,y:A.y-6,w:A.w+12,h:A.h+12};
      for(var y=8;y<=Math.max(8,H-th-8);y+=16)for(var x=8;x<=Math.max(8,W-tw-8);x+=16){
        var R={x:x,y:y,w:tw,h:th};if(ovl(R,AA))continue;if(S.ko&&!S.L.V&&ovl(R,S.ko))continue;
        var gx=Math.max(A.x-(x+tw),0,x-(A.x+A.w)),gy=Math.max(A.y-(y+th),0,y-(A.y+A.h)),gap=Math.hypot(gx,gy);if(gap>44)continue;
        var s=gap*3;
        for(var i=0;i<O.rects.length;i++)s+=ovl(R,O.rects[i])/12;
        if(best&&s>=best.s)continue;
        for(var k=0;k<O.pts.length;k++){var q=O.pts[k];if(q.x>x&&q.x<x+tw&&q.y>y&&q.y<y+th){s+=6;if(best&&s>=best.s)break;}}
        if(!best||s<best.s)best={s:s,x:x,y:y};}
      if(!best)best={x:clamp(A.x,8,W-tw-8),y:clamp(A.y+A.h+10,8,H-th-8)};
      el.style.left=Math.round(best.x)+'px';el.style.top=Math.round(best.y)+'px';}
    function refreshTip(force){
      var h=current();if(h&&S.panel&&S.panel.key===h.key)h=null;
      var I=h&&info(h);
      if(!I){if(tipKey){tip.classList.remove('on');tipKey=null;tipH=null;}cv.style.cursor='default';return;}
      cv.style.cursor=S.ptr==='mouse'&&S.hov&&I.act?'pointer':'default';
      if(force||h.key!==tipKey){
        tE.dot.style.background=I.c;tE.t.textContent=I.t;tE.p.textContent=I.p||'';tE.sup.textContent=I.sup||'';tE.sup.hidden=!I.sup;
        tE.s.textContent=I.s;if(I.icons){tE.tech.innerHTML=I.icons.map(function(c){return '<img src="'+esc(c.src)+'" alt="'+esc(c.name)+'" width="18" height="18">';}).join('');tE.tech.hidden=!I.icons.length;}else{tE.tech.textContent=I.tech||'';tE.tech.hidden=!I.tech;}tE.v.textContent=I.v?I.v():'';
        var ht=hint(h,I);tE.hint.textContent=ht;tE.hint.hidden=!ht;
        var band=S.L.V;tip.classList.toggle('band',band);
        tip.classList.add('on');
        if(band){tip.style.left='';bandPlace(tip,anchor(h));}
        else place(tip,anchor(h));
        if(h.key!==tipKey&&(S.kb>=0||h.tour)){var say2=I.t+', '+(I.p?I.p+'. ':'')+I.s+(I.act?' '+hint(h,I)+'.':'');
          clearTimeout(S.tour.annT);S.tour.annT=setTimeout(function(){if(tipKey===h.key)live.textContent=say2;},h.tour?1200:60);}
        tipKey=h.key;tipH=h;tipI=I;tipNext=S.t+.5;}
      else if(S.t>=tipNext&&I.v){tE.v.textContent=I.v();tipNext=S.t+.5;}
    }

    // ---------- Stage buttons: one question each ----------
    var nav=document.createElement('div');nav.className='eip-stages';nav.setAttribute('role','group');nav.setAttribute('aria-label','The client system, stage by stage');
    nav.innerHTML=STAGES.slice(1).map(function(s,i){return '<button type="button" data-st="'+(i+1)+'" title="'+esc(s.q)+'"><i>'+(i+1)+'</i><span><b>'+esc(s.n)+'</b><small>'+esc(s.q)+'</small></span></button>';}).join('')+
      (still?'':'<button type="button" class="eip-pause"></button>');
    if(O.nav==='inside')stage.insertBefore(nav,cv);else stage.parentNode.insertBefore(nav,stage);
    var pauseB=nav.querySelector('.eip-pause');
    function syncPause(){if(!pauseB)return;var tx=S.userPaused?'Play animation':'Pause animation';pauseB.setAttribute('aria-label',tx);pauseB.title=tx;pauseB.setAttribute('aria-pressed',String(S.userPaused));
      pauseB.innerHTML=S.userPaused?'<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5z"/></svg>':'<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="3.5" y="3" width="3" height="10" rx="1"/><rect x="9.5" y="3" width="3" height="10" rx="1"/></svg>';}
    syncPause();
    // inside the host, the buttons float over the bottom of the diagram area on wide screens and sit above the canvas on phones
    function placeNav(){S.navBox=null;if(O.nav!=='inside')return;var over=!S.L.V;nav.classList.toggle('over',over);
      if(over){var nl=Math.round(Math.max(16,S.L.ax+(S.ko?8:16)));nav.style.left=nl+'px';nav.style.width=Math.round(Math.min(S.L.ax+S.L.aw,S.w-16)-nl)+'px';nav.style.top=(cv.offsetTop+S.h-nav.offsetHeight-14)+'px';
        S.navBox={x:Math.max(16,S.L.ax+(S.ko?8:16)),y:S.h-nav.offsetHeight-14,w:nav.offsetWidth,h:nav.offsetHeight};}
      else{nav.style.left='';nav.style.top='';nav.style.width='';}}
    function syncNav(){[].forEach.call(nav.children,function(b){var n=+b.dataset.st;b.setAttribute('aria-pressed',String(n===S.stage));b.classList.toggle('done',n<S.stage);});}
    nav.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;S.engaged=true;
      if(b===pauseB){S.userPaused=!S.userPaused;syncPause();return;}S.autoAt=null;setStage(+b.dataset.st,false);});
    // ---------- Act: panels ----------
    var pan=document.createElement('div');pan.className='eip-panel';pan.hidden=true;pan.setAttribute('role','dialog');stage.appendChild(pan);
    var bub=document.createElement('div');bub.className='eip-bubble';bub.hidden=true;stage.appendChild(bub);
    var PATHS=[['Paid ad → Product → Cart → Checkout',38],['Organic search → Product → Checkout',27],['Email link → Cart → Checkout',19],['Direct → Product → Cart → Checkout',16]];
    var FINFO=[['Phone d-7f3a','Android 15 · Bucharest · 3 accounts in 24 h · risk 0.94'],['Account #4471','created 2 days ago · 2 orders · 1 chargeback'],
      ['Account #4472','created today · first order 312.50 EUR'],['Account #4475','created 3 hours ago · 6 failed logins'],['Card •••• 4821','issued in Romania · used by #4471 and #4475'],['Card •••• 9033','issued in Germany · used by #4472']];
    function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
    function phead(t,sub){return '<div class="ph"><div><b>'+esc(t)+'</b><span>'+esc(sub)+'</span></div><button class="x" type="button" aria-label="Close">×</button></div>';}
    function panelHTML(){var P=S.panel,j;
      if(P.kind==='tables'){
        var o=S.rows.orders.map(function(r,i){return '<tr data-row="o'+i+'" tabindex="0"><td>'+esc(r.id)+'</td><td>'+esc(r.total)+'</td><td'+(r.status==='review'?' class="bad"':'')+'>'+esc(r.status)+'</td><td'+(r.path==='none'?' class="bad"':'')+'>'+esc(r.path)+'</td></tr>';}).join('');
        var e=S.rows.stock.map(function(r,i){return '<tr data-row="e'+i+'" tabindex="0"><td>'+esc(r.sku)+'</td><td>'+esc(r.loc)+'</td><td>'+r.qty+'</td></tr>';}).join('');
        return phead('PostgreSQL','live rows · illustration')+'<h4>orders <span>'+fmt(S.order-1)+' rows</span></h4><div class="tw"><table><thead><tr><th>id</th><th>total</th><th>status</th><th>path</th></tr></thead><tbody>'+o+'</tbody></table></div>'+
          '<h4>stock <span>'+fmt(S.stockN)+' rows</span></h4><div class="tw"><table><thead><tr><th>sku</th><th>location</th><th>qty</th></tr></thead><tbody>'+e+'</tbody></table></div><div class="detail">Point at a row to read it.</div>';}
      if(P.kind==='graph'){var sh=P.tab==='shared';
        var tabs='<div class="tabs" role="tablist"><button type="button" role="tab" data-tab="paths" aria-selected="'+!sh+'">Paths to checkout</button><button type="button" role="tab" data-tab="shared" aria-selected="'+sh+'">Shared devices'+(flagged()?' <i></i>':'')+'</button></div>';
        if(!sh)return phead('Graph','how did they get here · illustration')+tabs+PATHS.map(function(p,i){return '<div class="bar" data-row="p'+i+'" tabindex="0"><span>'+esc(p[0])+'</span><b>'+p[1]+'%</b><i style="width:'+p[1]+'%"></i></div>';}).join('')+
          '<p class="note">Across all channels, 23% of checkouts started on a phone and finished on a laptop.</p><div class="detail">Share of last week’s 1,450,000 checkouts, by first channel · path query 9 ms</div>';
        var N=[[140,72,9,K.coral],[52,30,6,K.amber],[228,30,6,K.amber],[140,138,6,K.amber],[30,112,5,K.teal],[250,112,5,K.teal]],E=[[0,1,1],[0,2,1],[0,3,1],[1,4,0],[3,4,0],[2,5,0]];
        var svg='<svg viewBox="0 0 280 160" role="img" aria-label="One phone linked to three accounts and two cards">'+E.map(function(e){var a=N[e[0]],b=N[e[1]];return '<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+(e[2]?K.coral:'#5d6b7e')+'" stroke-width="'+(e[2]?1.8:1)+'"/>';}).join('')+
          N.map(function(n,i){return '<g data-node="'+i+'" tabindex="0" role="button" aria-label="'+esc(FINFO[i][0])+'"><circle cx="'+n[0]+'" cy="'+n[1]+'" r="'+(n[2]+8)+'" fill="transparent"/><circle cx="'+n[0]+'" cy="'+n[1]+'" r="'+n[2]+'" fill="'+n[3]+'"/></g>';}).join('')+'</svg>';
        return phead('Graph','how did they get here · illustration')+tabs+svg+'<p class="note">3 accounts share one phone and 2 cards within 24 hours. The next order from this phone waits for review.</p><div class="detail">Point at a node for details.</div>';}
      if(P.kind==='join'&&S.stage<3){var o0=S.rows.orders[0],sk=S.rows.stock[0];
        return phead('Last join at Match','Aggregator · illustration')+'<dl><dt>order</dt><dd>'+esc(o0.id)+' · '+esc(o0.total)+' · '+esc(o0.status)+'</dd><dt>customer</dt><dd>c-'+o0.card.slice(-4)+' · returning, '+(2+(+o0.card.slice(-1)))+' orders</dd><dt>scans</dt><dd>picked and packed at '+esc(sk.loc)+' · '+esc(sk.ts)+'</dd><dt>joined in</dt><dd>'+(3+(+o0.card.slice(-2,-1)))+' ms</dd></dl>'+
          '<div class="detail">Joined on the order id. How the customer got to checkout is the next question.</div>';}
      if(P.kind==='join'){j=S.lastJoin;
        if(!j)return phead('Last join at Match','Aggregator · illustration')+'<p class="note">Waiting for the next checkout…</p>';
        return phead('Last join at Match','Aggregator · illustration')+'<dl><dt>order</dt><dd>#'+j.order+' · '+esc(j.total)+'</dd><dt>path</dt><dd>'+esc(j.steps.join(' → '))+'</dd><dt>devices</dt><dd>'+esc(j.devices)+'</dd><dt>session</dt><dd>s-'+j.sid+' · '+j.n+' events · '+j.mins+' min</dd><dt>joined in</dt><dd>'+j.ms+' ms</dd></dl>'+
          '<div class="detail">Joined on the customer id, inside a 30-minute window.</div>';}
      if(P.kind==='devices'){var m=P.merged||[85,82],c=1000+m[0];
        var TL=[['09:12','phone','Ad click',K.amber],['09:13','phone','Product page',K.amber],['09:31','laptop','Login · same customer',K.coral],['09:33','laptop','Cart',K.coral],['09:34','laptop','Checkout',K.teal]];
        return phead('One customer, two devices','Journey · illustration')+'<ol class="tl">'+TL.map(function(r){return '<li><time>'+r[0]+'</time><i style="background:'+r[3]+'"></i><span>'+r[1]+'</span>'+esc(r[2])+'</li>';}).join('')+'</ol>'+
          '<div class="detail">Customer c-'+c+' · sessions s-'+m[1]+' and s-'+m[0]+' merged on login, events put back in order.</div>';}
      return '';}
    function renderPanel(){if(!S.panel)return;pan.innerHTML=panelHTML();pan.setAttribute('aria-label',(pan.querySelector('.ph b')||{}).textContent||'Panel');}
    function placePanel(){var P=S.panel,L=S.L;
      if(L.V){pan.style.left='8px';pan.style.top=bandTop(pan.offsetHeight)+'px';return;}
      place(pan,anchor(P.h));}
    function openPanel(kind,h,merged){
      if(S.panel&&S.panel.kind===kind){closePanel();return;}
      S.panel={kind:kind,key:h.key,h:h,tab:kind==='graph'&&flagged()?'shared':'paths',merged:merged,hold:false,kb:S.kb>=0};
      if(kind==='graph'&&S.panel.tab==='shared')S.flagT=-99;
      renderPanel();pan.hidden=false;placePanel();
      if(S.panel.kb){var x=pan.querySelector('.x');if(x)x.focus();}}
    function closePanel(){if(!S.panel)return;var kb=S.panel.kb;S.panel=null;pan.hidden=true;pan.innerHTML='';if(kb)cv.focus();refreshTip(true);}
    function detail(el){var d=pan.querySelector('.detail');if(!d||!el)return;var id=el.getAttribute('data-row'),n=el.getAttribute('data-node'),r;
      if(n!=null){d.textContent=FINFO[+n][0]+' · '+FINFO[+n][1];return;}
      if(!id)return;
      if(id[0]==='o'){r=S.rows.orders[+id.slice(1)];d.textContent='order '+r.id+' · '+r.total+' · '+r.status+' · card '+r.card+' · risk '+r.risk+' · '+(r.steps?'path: '+r.steps.join(' → ')+' · '+r.devices:'no path, Journey was stopped')+' · '+r.ts;}
      else if(id[0]==='e'){r=S.rows.stock[+id.slice(1)];d.textContent='stock '+r.sku+' at '+r.loc+' · qty '+r.qty+' · last scan: '+r.ev+' · '+r.ts;}
      else if(id[0]==='p'){r=PATHS[+id.slice(1)];d.textContent=r[1]+'% of checkouts · '+fmt(1450000*r[1]/100)+' orders · '+r[0];}}
    pan.addEventListener('click',function(e){var t=e.target;
      if(t.closest('.x')){closePanel();return;}
      var tb=t.closest('[data-tab]');if(tb&&S.panel){S.panel.tab=tb.getAttribute('data-tab');if(S.panel.tab==='shared')S.flagT=-99;renderPanel();var f=pan.querySelector('[data-tab="'+S.panel.tab+'"]');if(f)f.focus();return;}
      detail(t.closest('[data-row],[data-node]'));});
    pan.addEventListener('pointerover',function(e){detail(e.target.closest('[data-row],[data-node]'));});
    pan.addEventListener('focusin',function(e){if(S.panel)S.panel.hold=true;detail(e.target.closest('[data-row],[data-node]'));});
    pan.addEventListener('focusout',function(){if(S.panel)S.panel.hold=false;});
    pan.addEventListener('pointerenter',function(){if(S.panel)S.panel.hold=true;});
    pan.addEventListener('pointerleave',function(){if(S.panel)S.panel.hold=false;});
    // the easter egg: past 50,000 events/s, a message that ends on the call to action
    var bubT=null,bubI=0;
    function showBubble(){bub.innerHTML='<p>'+esc(MSG[bubI++%MSG.length])+'</p><a href="'+CAL+'" target="_blank" rel="noopener">Book a 30-min call →</a>';bub.hidden=false;
      bub.style.left=(S.L.V?14:S.L.ax+14)+'px';bub.style.top=(S.L.V?88:S.L.C?100:62)+'px';clearTimeout(bubT);bubT=setTimeout(hideBubble,9000);}
    function hideBubble(){if(bub.matches(':hover')||bub.contains(document.activeElement)){bubT=setTimeout(hideBubble,2000);return;}bub.hidden=true;}
    // a click outside an open panel closes it and does nothing else
    document.addEventListener('pointerdown',function(e){var t=e.target;S.swallow=false;
      if(S.panel&&!pan.contains(t)){closePanel();if(t===cv)S.swallow=true;}
      else if(t!==cv&&!pan.contains(t)&&(S.pin||S.armed)){S.pin=null;S.armed=null;refreshTip();if(still)render();}},true);
    document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;
      if(S.panel){closePanel();return;}if(!bub.hidden){bub.hidden=true;return;}if(tipKey)dismiss();});

    // ---------- Input ----------
    function point(e){var r=cv.getBoundingClientRect();S.mx=e.clientX-r.left;S.my=e.clientY-r.top;S.inside=true;}
    function pickHover(){
      if(S.ptr!=='mouse'){S.hov=null;return;}
      if(!S.inside){S.hov=null;return;}
      var c=candidates(S.mx,S.my),best=bestOf(c);
      if(S.hov){var cur=null;c.forEach(function(x){if(x.key===S.hov.key)cur=x;});
        if(cur&&cur.d<cur.lim+12&&(!best||best.key===cur.key||best.d>cur.d-6))best=cur;}
      if(S.dismissed&&(!best||best.key!==S.dismissed))S.dismissed=null;
      S.hov=best;}
    function takeOver(){var T=S.tour;if(T.on&&!T.off){T.off=true;T.idx=-1;clearTimeout(T.annT);}}
    cv.addEventListener('pointermove',function(e){if((e.pointerType||'mouse')!=='mouse')return;S.ptr='mouse';S.kb=-1;takeOver();point(e);if(still){render();refreshTip();}});
    cv.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){S.inside=false;if(still){render();refreshTip();}}});
    cv.addEventListener('pointerdown',function(e){S.ptr=e.pointerType||'mouse';if(S.ptr==='mouse'){tap(e);return;}S.tdown={x:e.clientX,y:e.clientY};});
    // a finger taps on release, within 10 px of where it landed, so a scroll that starts on the canvas changes nothing
    cv.addEventListener('pointerup',function(e){var d=S.tdown;S.tdown=null;if(!d||(e.pointerType||'mouse')==='mouse')return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>10)return;tap(e);});
    cv.addEventListener('pointercancel',function(){S.tdown=null;});
    function tap(e){
      if(S.swallow){S.swallow=false;return;}
      var r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,touch=S.ptr!=='mouse',h=bestOf(candidates(mx,my,touch?8:0));
      var ts=S.tour.idx>=0?tourVisible(tourStops()[S.tour.idx]):null,viaTour=!!(h&&ts&&(ts.key===h.key||(ts.kind==='srcs'&&h.kind==='src')));
      takeOver();S.kb=-1;S.dismissed=null;
      if(!touch){point(e);if(h)act(S.hov&&S.hov.key===h.key?S.hov:h);return;}
      // touch and pen: the first tap shows the label, a second tap on the same element runs the action
      if(h&&(S.armed===h.key||viaTour)){S.pin=h;S.armed=h.key;act(h);}
      else{S.armed=h?h.key:null;S.pin=h;}
      if(still)render();refreshTip(true);}
    cv.tabIndex=0;cv.style.touchAction='pan-y';
    if(!cv.getAttribute('role')){cv.setAttribute('role','group');cv.setAttribute('aria-roledescription','interactive diagram');}
    if(!cv.getAttribute('aria-label'))cv.setAttribute('aria-label','How a shop’s event platform grows: sources, Ingest, Enrich, Match, Journey, PostgreSQL and a graph');
    var kbHint=document.createElement('p');kbHint.id='eip-kb-'+Math.random().toString(36).slice(2,8);kbHint.style.cssText=live.style.cssText;kbHint.textContent='Use the arrow keys to move between parts and Enter to act on one.';stage.appendChild(kbHint);cv.setAttribute('aria-describedby',kbHint.id);
    cv.addEventListener('focus',function(){var fv=true;try{fv=cv.matches(':focus-visible');}catch(e){}if(!fv)return;if(S.kb<0)S.kb=0;S.dismissed=null;refreshTip(true);});
    cv.addEventListener('blur',function(e){var to=e.relatedTarget;if(to&&pan.contains(to))return;S.kb=-1;refreshTip();});
    cv.addEventListener('keydown',function(e){var st=kbStops(),n=st.length;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')S.kb=(Math.max(S.kb,-1)+1)%n;
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp')S.kb=(Math.max(S.kb,0)-1+n)%n;
      else if(e.key==='Home')S.kb=0;else if(e.key==='End')S.kb=n-1;
      else if(e.key==='Enter'||e.key===' '){S.engaged=true;if(S.kb<0)S.kb=0;act(st[S.kb]);e.preventDefault();return;}
      else return;
      e.preventDefault();S.dismissed=null;if(still)render();refreshTip(true);});

    // ---------- The scroll tour (phones) ----------
    function tourVisible(st){if(!st)return null;var A=anchor(st),T=S.tour;
      var top=Math.max(T.vt,0),cy=A.y+A.h/2;return cy>top+4&&cy<T.vb-4?st:null;}
    function tourStep(){var T=S.tour,n=TS.length;
      if(!T.on||T.off||T.p==null){T.idx=-1;return;}
      var pos=T.p*n,tgt=pos<0||pos>=n?-1:Math.floor(pos);
      if(tgt===T.idx)return;
      if(T.idx>=0&&pos>T.idx-.2&&pos<T.idx+1.2)return;
      if(now()-T.changed<250){if(still&&!T.wait)T.wait=setTimeout(function(){T.wait=null;render();refreshTip();},260);return;}
      T.idx=tgt;T.changed=now();}
    function measure(){var T=S.tour;T.raf=0;
      var r=cv.getBoundingClientRect(),vh=T.vh||(T.vh=document.documentElement.clientHeight||window.innerHeight||r.height);
      var de=document.documentElement,sy=window.scrollY||0,c=r.top+r.height/2,cdoc=c+sy,maxS=Math.max(0,de.scrollHeight-vh),a0=Math.min(vh*.9,cdoc),a1=Math.max(vh*.1,cdoc-maxS);
      T.p=a0-a1<120?null:(a0-c)/(a0-a1);T.vt=clamp(-r.top,0,r.height);T.vb=clamp(vh-r.top,0,r.height);
      if(tipKey&&tipH&&tip.classList.contains('band'))bandPlace(tip,anchor(tipH));
      if(S.panel&&S.L&&S.L.V)pan.style.top=bandTop(pan.offsetHeight)+'px';
      if(still){render();refreshTip();}}
    window.addEventListener('scroll',function(){if(!S.tour.raf)S.tour.raf=requestAnimationFrame(measure);},{passive:true});

    function size(){var r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,r.width>1600?1.5:2);S.w=r.width;S.h=r.height;cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d);cx.setTransform(d,0,0,d,0,0);
      S.ko=koRect();layout();placeNav();}
    function frame(dt){step(dt);pickHover();tourStep();draw();refreshTip(false);}
    function render(){frame(0);}
    var last=0,running=false,visible=true;
    function loop(t){var dt=Math.min(.05,(t-last)/1000||0);last=t;frame(S.userPaused?0:dt);
      if(visible&&!document.hidden)requestAnimationFrame(loop);else running=false;}
    function start(){if(!running&&!still){running=true;last=now();requestAnimationFrame(loop);}}
    if(window.IntersectionObserver)new IntersectionObserver(function(en){visible=en[0].isIntersecting;
      if(!visible){S.pin=null;S.armed=null;if(S.tour.off){S.tour.off=false;S.tour.idx=-1;}if(S.panel)closePanel();refreshTip();}
      if(visible)start();}).observe(cv);
    // the overlaid text can change height (fonts, a wrap) without the window resizing
    if(O.avoid&&window.ResizeObserver){var avEl=typeof O.avoid==='function'?O.avoid():O.avoid;if(avEl)new ResizeObserver(function(){if(!S.L)return;size();if(S.panel)placePanel();render();refreshTip(true);}).observe(avEl);}
    document.addEventListener('visibilitychange',function(){if(!document.hidden)start();});
    // the phone address bar changes the height while scrolling; measure the viewport again only when the width changes
    window.addEventListener('resize',function(){var vw=window.innerWidth;if(vw===S.tour.vw&&Math.abs(cv.getBoundingClientRect().width-S.w)<1)return;S.tour.vw=vw;S.tour.vh=0;size();measure();if(S.panel)placePanel();render();refreshTip(true);});
    size();S.tour.vw=window.innerWidth;
    // warm up for 9 s so the first frame, and the reduced-motion still, shows a system already running
    for(var i=0;i<180;i++)step(.05);
    S.feedNext=0;syncNav();if(!still){S.autoAt=S.stage<3?S.t+9:null;say(STAGES[S.stage].say,S.stage===1?K.amber:K.teal,true);}measure();render();start();
    cv._eip={setStage:setStage,pause:function(on){S.userPaused=!!on;syncPause();},frame:function(d){frame(d);},S:S,act:act,kbStops:kbStops,render:render,refreshTip:refreshTip,info:info,openPanel:openPanel,closePanel:closePanel,tap:tap};  // test hook
  }
  window.eipStream=eipStream;
})();
