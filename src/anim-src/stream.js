  // Live event stream. Four sources send data through a load balancer to servers, then to PostgreSQL and a graph database.
  // If every server is down, the balancer queues events and releases them as a burst when servers return.
  // Hover eases the nearest stream or node into focus and pins a label to it.
  // Click a stream: trace one event end to end. Click a source: send a burst. Click a server: failure drill.
  // On touch, the first tap shows the label and a second tap on the same element runs the action.
  // Scroll tour (O.scrollTips): on screens without hover, scrolling the page walks the label through the diagram
  // in data-flow order. Any tap or mouse move on the canvas hands control back to the user until the canvas
  // leaves the viewport. O.scrollTips: true (default, touch screens only), 'always' (every device), false (off).
  function eventStream(cv,ctrls,O){
    O=O||{};
    var cx=cv.getContext('2d'),still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var C={bg:'#0b1a2e',text:'#e8edf3',muted:'#a7b3c2',coral:'#ea5a47',red:'#ff5a4e',amber:'#f1b96a',teal:'#10c29e',panel:'rgba(6,16,30,.94)',hair:'rgba(255,255,255,.08)'};
    var HEAD='"Josefin Sans", sans-serif',BODY='"Lato", sans-serif',MONO='"JetBrains Mono", ui-monospace, Menlo, monospace';
    var SRC=[
      {name:'Web app',set:'Clicks and page views',color:'#ea5a47',done:'#f29ab0',w:.38,vals:['/pricing','/signup','/docs','/blog/kafka','/checkout'],pay:'{"event":"click","page":"/pricing"}'},
      {name:'Mobile app',set:'App sessions',color:'#f1b96a',done:'#e8cfa0',w:.27,vals:['iOS 18','Android 15','iOS 17','Android 14'],pay:'{"event":"session_start","os":"iOS 18"}'},
      {name:'Payments',set:'Checkout events',color:'#10c29e',done:'#7fe0c4',w:.15,vals:['89.90 EUR','24.00 EUR','312.50 EUR','7.99 EUR'],pay:'{"order":"#48213","total":"89.90 EUR"}'},
      {name:'IoT sensors',set:'Sensor readings',color:'#7fa6d9',done:'#9fd3f5',w:.20,vals:['61.4 °C','2.1 bar','58.9 °C','1.8 bar'],pay:'{"device":"press-07","value":"61.4 °C"}'}
    ];
    var S={w:0,h:0,mx:-999,my:-999,inside:false,load:1.2,target:1.2,servers:[],dots:[],acc:0,rr:0,cool:0,t:0,dt:0,sid:0,touchT:null,
           hov:null,f:0,em:{},ro:{},tip:{a:0,x:0,y:0,L:null,key:null},mark:{x:0,y:0},L:null,
           bursts:[0,0,0,0],tracers:[],tags:[],feed:[],armed:null,replacing:[],ptr:'mouse',traceNo:4820,
           boost:0,lastBoost:-99,jit:0,jitNext:2,stored:1284503,checks:[],checkStat:null,ripples:[],bubble:null,bubbleBox:null,msgI:0,headBox:null,base:1.2,outage:false,queued:0,drain:null,qn:0,fraud:null,fnodes:null,dbv:null,dbBox:null,dbRows:[],rowId:1284503,orderId:48213,lastRow:{events:-9,orders:-9},
           rows:{events:[],orders:[]}};
    var CAL='https://cal.com/px-mihnea/talk',CAP=12.5,STEP=1.25;
    var MSG=['50,000 events/s. That’s where this demo stops. Our engineers keep going.',
      'You clearly enjoy load testing. Want to try it on your own system?',
      'Still clicking? We like persistence. We hire for it too.',
      'This canvas is at its limit. Your platform might not be. Let’s find out.',
      'Okay, you’d make a great QA engineer. Or a great client.'];
    for(var i0=0;i0<2;i0++)S.servers.push({a:1,id:++S.sid});
    [[3,'58.9 °C'],[0,'/docs'],[1,'iOS 18']].forEach(function(x,i){S.rows.events.push(evRow(x[0],x[1],'server-'+(1+i%2)));S.rows.events[i].born=-9;});
    ['24.00 EUR','89.90 EUR','7.99 EUR'].forEach(function(v,i){S.rows.orders.push(orRow(v));S.rows.orders[i].born=-9;});
    // what each node of the fraud ring shows on hover
    var FINFO=[
      {t:'Device d-7f3a',s:'Android 15 · Bucharest',rows:[['accounts','3 in the last 24 h'],['risk score','0.94'],['status','blocked']]},
      {t:'Account #4471',s:'Created 2 days ago',rows:[['orders','2'],['chargebacks','1'],['device','d-7f3a']]},
      {t:'Account #4472',s:'Created today',rows:[['orders','1'],['first order','312.50 EUR'],['device','d-7f3a']]},
      {t:'Account #4475',s:'Created 3 hours ago',rows:[['orders','0'],['failed logins','6'],['device','d-7f3a']]},
      {t:'Card •••• 4821',s:'Issued in Romania',rows:[['used by','#4471, #4475'],['declines today','2']]},
      {t:'Card •••• 9033',s:'Issued in Germany',rows:[['used by','#4472'],['declines today','0']]}];
    var FN_COL=['#ff5a4e','#f1b96a','#f1b96a','#f1b96a','#10c29e','#10c29e'];
    // Scroll tour state. p: scroll progress of the canvas centre through the viewport (0 at 90% of its height, 1 at 10%;
    // null when the page can't scroll it at least 120 px).
    // idx: the stop on show, -1 for none. off: the user took over, until the canvas leaves the viewport.
    var TOUR=O.scrollTips==null?true:O.scrollTips,NOHOVER=window.matchMedia('(hover: none)').matches;
    S.tour={on:TOUR==='always'||(!!TOUR&&NOHOVER),idx:-1,p:null,off:false,changed:-1e9,vt:0,vb:0,vh:0,vw:0,raf:0,wait:null,said:null,annT:null};
    var TOUR_SAY={src:function(i){return SRC[i].name+': '+SRC[i].set.toLowerCase()+'.';},lb:'Load balancer: splits traffic across the servers.',
      srv:'Server: a Spring Boot pod on Kubernetes, autoscaled with the load.',db:'PostgreSQL: the primary database for orders and sessions.',
      gdb:'Graph database: links cards, devices and accounts to catch fraud.'};
    function clock(){var d=new Date(),p=function(n,l){return String(n).padStart(l||2,'0');};return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())+'.'+p(d.getMilliseconds(),3);}
    function pick(a){return a[(Math.random()*a.length)|0];}
    function evRow(src,val,srv){return{id:S.rowId++,src:SRC[src].name,val:val,ts:clock(),srv:srv,born:S.t};}
    function orRow(val){var risky=Math.random()<.12;return{id:'#'+(S.orderId++),total:val,status:risky?'review':pick(['paid','paid','paid','pending','refunded']),
      card:'•••• '+(1000+((Math.random()*9000)|0)),risk:(risky?rnd(.8,.97):rnd(.01,.2)).toFixed(2),ts:clock(),born:S.t};}
    // a dot reached a data store: feed the live tables, slowly enough to read, and never while a row is hovered
    function record(d){
      if(S.hov&&S.hov.kind==='row')return;
      var srv=d.srv?'server-'+d.srv.id:'server-?';
      if(d.src===2){if(S.t-S.lastRow.orders>.9){S.rows.orders.unshift(orRow(d.val));S.rows.orders.length=Math.min(3,S.rows.orders.length);S.lastRow.orders=S.t;}}
      else if(S.t-S.lastRow.events>.9){S.rows.events.unshift(evRow(d.src,d.val,srv));S.rows.events.length=Math.min(3,S.rows.events.length);S.lastRow.events=S.t;}
    }
    function lerp(a,b,k){return a+(b-a)*k;}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function fmt(n){return Math.round(n).toLocaleString('en-US');}
    function rnd(a,b){return a+Math.random()*(b-a);}
    function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();}
    function proj(px,py,a,b){var dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy||1,t=clamp(((px-a.x)*dx+(py-a.y)*dy)/l,0,1),x=a.x+t*dx,y=a.y+t*dy;return{x:x,y:y,d:Math.hypot(px-x,py-y)};}
    function ease(key,target,k){var v=S.em[key];v=v==null?target:lerp(v,target,k);S.em[key]=v;return v;}
    // Calm readout: rounds to `step`, changes at most every 1.5 s (0.6 s for big jumps), slides in 0.4 s.
    function ro(key,raw,step,every){every=every||1.5;
      var q=Math.round(raw/step)*step;if(still)return q;
      var r=S.ro[key];if(!r)r=S.ro[key]={from:q,to:q,shown:q,t:1,next:S.t+every};
      if(S.t>=r.next){var big=Math.abs(q-r.to)>Math.max(step,r.to*.3);
        if(q!==r.to){r.from=r.shown;r.to=q;r.t=0;}r.next=S.t+(big?.6:every);}
      else if(Math.abs(q-r.to)>Math.max(step*2,r.to*.3)&&S.t>=r.next-.9){r.next=S.t;}
      if(r.t<1){r.t=Math.min(1,r.t+S.dt/.4);r.shown=Math.round(lerp(r.from,r.to,1-Math.pow(1-r.t,3))/step)*step;}
      return r.shown;
    }
    function say(text,col){S.feed.unshift({text:text,col:col,life:5});S.feed=S.feed.slice(0,3);}
    function size(){var r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;S.w=r.width;S.h=r.height;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0);}
    function burstEnv(b){return b<=0?0:b>2.7?(3-b)/.3:b<1?b:1;}  // 3 s: ramp up 0.3 s, hold, ease off over the last second
    function pickSrc(){var ws=SRC.map(function(s,i){return s.w*(1+5*burstEnv(S.bursts[i]));}),sum=ws.reduce(function(a,b){return a+b;},0),r=Math.random()*sum,c=0;
      for(var i=0;i<ws.length;i++){c+=ws[i];if(r<c)return i;}return 0;}

    // Hit test against the last drawn layout.
    function candidates(mx,my){
      var L=S.L,out=[];if(!L)return out;
      S.dbRows.forEach(function(r){if(mx>=r.x&&mx<=r.x+r.w&&my>=r.y&&my<=r.y+r.h)out.push({kind:'row',key:'row:'+r.table+':'+r.i,table:r.table,i:r.i,d:-200,lim:1,ax:r.x+r.w,ay:r.y+r.h/2});});
      var pb=S.dbBox;if(pb&&mx>=pb.x&&mx<=pb.x+pb.w&&my>=pb.y&&my<=pb.y+pb.h)out.push({kind:'dbpanel',key:'dbpanel',d:-100,lim:1,ax:mx,ay:my});
      if(S.fnodes)S.fnodes.forEach(function(n){out.push({kind:'fnode',i:n.i,key:'fnode:'+n.i,d:Math.hypot(mx-n.x,my-n.y)-30,lim:-20,ax:n.x,ay:n.y-n.r-2});});
      if(S.headBox){var hb=S.headBox,hx=Math.max(0,hb.x-mx,mx-(hb.x+hb.w)),hy=Math.max(0,hb.y-my,my-(hb.y+hb.h));out.push({kind:'head',key:'head',d:Math.hypot(hx,hy),lim:6,ax:mx,ay:my});}
      L.src.forEach(function(p){out.push({kind:'src',i:p.i,key:'src:'+p.i,d:Math.hypot(mx-p.x,my-p.y)-6,lim:16,ax:p.x,ay:p.y,node:true});});
      out.push({kind:'lb',key:'lb',d:Math.hypot(mx-L.lb.x,my-L.lb.y)-8,lim:16,ax:L.lb.x,ay:L.lb.y-13});
      out.push({kind:'gdb',key:'gdb',d:Math.hypot(mx-L.gdb.x,my-L.gdb.y)-12,lim:16,ax:L.gdb.x,ay:L.gdb.y-16});
      out.push({kind:'db',key:'db',d:Math.hypot(mx-L.db.x,my-L.db.y)-10,lim:16,ax:L.db.x,ay:L.db.y-18});
      L.alive.forEach(function(v){var dx=Math.max(0,Math.abs(mx-v.x)-22),dy=Math.max(0,Math.abs(my-v.y)-9);out.push({kind:'srv',srv:v,key:'srv:'+v.id,d:Math.hypot(dx,dy)-4,lim:10,ax:v.x,ay:v.y-9});});
      L.edges.forEach(function(e){if(e.srv&&(e.srv.gone||e.srv.down||e.srv.a<.5))return;var p=proj(mx,my,e.a,e.b);
        if(Math.min(Math.hypot(p.x-e.a.x,p.y-e.a.y),Math.hypot(p.x-e.b.x,p.y-e.b.y))<14)return;
        out.push({kind:e.kind,i:e.i,srv:e.srv,key:e.key,d:p.d,lim:12,ax:p.x,ay:p.y,edge:true});});
      return out;
    }
    function bestOf(list){var b=null;list.forEach(function(c){if(c.d<c.lim&&(!b||c.d<b.d))b=c;});return b;}
    // the tour visits the diagram in the order data flows: four sources, balancer, one server, the two databases
    function tourStops(){var L=S.L;if(!L)return[];
      var st=L.src.map(function(p){return{kind:'src',i:p.i,key:'src:'+p.i,ax:p.x,ay:p.y,node:true};});
      st.push({kind:'lb',key:'lb',ax:L.lb.x,ay:L.lb.y-13});
      if(L.alive.length){var v=L.alive[(L.alive.length-1)>>1];st.push({kind:'srv',srv:v,key:'srv:'+v.id,ax:v.x,ay:v.y-9});}
      st.push({kind:'db',key:'db',ax:L.db.x,ay:L.db.y-18});st.push({kind:'gdb',key:'gdb',ax:L.gdb.x,ay:L.gdb.y-16});
      st.forEach(function(x){x.tour=true;});return st;}
    // pick the stop from scroll progress: 0.2 of a slot of hysteresis and at most one change every 250 ms
    function tourStep(n){var T=S.tour;
      if(!T.on||T.off||T.p==null||!n){T.idx=-1;return;}
      var pos=T.p*n,tgt=pos<0||pos>=n?-1:Math.floor(pos);
      if(tgt===T.idx)return;
      if(T.idx>=0&&pos>T.idx-.2&&pos<T.idx+1.2)return;
      if(T.idx<0&&tgt>=0&&(pos<.15||pos>n-.15))return;
      var now=performance.now(),left=250-(now-T.changed);
      if(left>0){if(still&&!T.wait&&typeof setTimeout==='function')T.wait=setTimeout(function(){T.wait=null;frame(0);},left+5);return;}
      T.idx=tgt;T.changed=now;
      if(live){clearTimeout(T.annT);var st=tgt>=0?tourStops()[tgt]:null;
        if(st)T.annT=setTimeout(function(){if(T.idx===tgt&&!T.off&&T.said!==st.key){T.said=st.key;var m=TOUR_SAY[st.kind];live.textContent=typeof m==='function'?m(st.i):m;}},1200);}
    }
    // runs at most once per frame from the passive scroll listener
    function measure(){var T=S.tour;T.raf=0;
      var r=cv.getBoundingClientRect(),vh=T.vh||(T.vh=document.documentElement&&document.documentElement.clientHeight||window.innerHeight||r.height);
      // the tour runs while the canvas centre moves from 90% to 10% of the viewport height. A canvas near the top of the
      // page (a hero) or the bottom never reaches those lines, so the range shrinks to what scrolling can reach.
      var de=document.documentElement||{},sy=window.scrollY||window.pageYOffset||0,c=r.top+r.height/2,cdoc=c+sy,
          maxS=Math.max(0,(de.scrollHeight||0)-vh),a0=Math.min(vh*.9,cdoc),a1=Math.max(vh*.1,cdoc-maxS);
      T.p=a0-a1<120?null:(a0-c)/(a0-a1);
      T.vt=clamp(-r.top,0,r.height);T.vb=clamp(vh-r.top,0,r.height);
      if(still)frame(0);}
    function actionHint(h){
      if(!h)return '';var tap=h.tour?(NOHOVER?'Tap':'Click'):S.ptr!=='mouse'?'Tap again':'Click';
      if(h.kind==='src'&&h.node)return tap+' to send a burst';
      if(h.edge)return tap+' to trace one event';
      if(h.kind==='srv')return tap+' to take this server down';
      if(h.kind==='lb')return tap+' to run a health check';
      if(h.kind==='db')return tap+(S.dbv&&!S.dbv.closing?' to close the tables':' to open the tables');
      if(h.kind==='gdb')return tap+(S.fraud&&!S.fraud.closing?' to close':' to look for fraud');
      return '';
    }

    // Actions
    function trace(srcIdx,srv,g){
      var L=S.L;if(!L)return;
      srv=srv&&!srv.down&&!srv.gone?srv:(L.alive.length?L.alive[(Math.random()*L.alive.length)|0]:null);
      if(g==null)g=srcIdx===2||(srcIdx===0&&Math.random()<.3);
      var ms=[0,Math.round(rnd(1,3)),Math.round(rnd(8,15)),Math.round(rnd(3,6))];
      S.tracers.push({src:srcIdx,srv:srv,g:g,seg:0,p:0,ms:ms,trail:[],no:++S.traceNo});
      if(S.tracers.length>3)S.tracers.shift();
    }
    function burst(i){S.bursts[i]=3;say(SRC[i].name+' burst · scaling up',SRC[i].color);}
    function fail(v){
      if(!v||v.down||v.gone)return;
      var others=S.L.alive.filter(function(o){return o!==v;});
      v.down=.6;S.cool=2.2;S.replacing.push({t:S.t,at:S.t+rnd(1.6,2)});
      S.dots.forEach(function(d){if(d.srv===v&&d.seg>=1){d.from={x:d.x,y:d.y};d.p=0;
        if(d.seg===1&&others.length){d.srv=others[S.rr++%others.length];}else if(d.seg===1){d.q=true;d.wait=1e9;}else{d.seg=2;}}});
      S.tracers.forEach(function(tr){if(tr.srv===v&&others.length)tr.srv=others[0];});
      say('server-'+v.id+' down · traffic '+(others.length?'rerouted':'queued'),C.red);
    }
    function healthCheck(){
      if(S.checks.length)return;var list=S.servers.filter(function(v){return !v.gone&&v.a>.5;});
      S.checkStat={n:list.length,ok:0,max:0};
      list.forEach(function(v){S.checks.push({srv:v,p:still?1:0,ms:Math.round(rnd(2,5))});});
    }
    function query(){
      if(S.dbv&&!S.dbv.closing){S.dbv.closing=true;return;}
      S.dbv={e:S.dbv?S.dbv.e:0,away:0};
      var L=S.L,ms=Math.round(rnd(4,9));S.ripples.push({t:0});
      S.tags.push({x:L.db.x,y:L.db.y-26,text:ms+' ms',fill:C.text,life:2.4});
      say('Query: '+fmt(S.stored)+' rows stored · '+ms+' ms',C.text);
    }
    function fraud(){if(S.fraud&&!S.fraud.closing){S.fraud.closing=true;return;}S.fraud={t:0,e:S.fraud?S.fraud.e:0,away:0};say('Fraud ring flagged · 3 accounts share 1 device · '+Math.round(rnd(7,12))+' ms',C.red);}
    function addLoad(){
      var room=CAP-(S.target+S.boost);
      if(room<=.01){S.bubble={text:MSG[S.msgI++%MSG.length],life:8};return;}
      var add=Math.min(STEP,room),hb=S.headBox,tiers=Math.floor(S.boost*.4+1e-6);S.boost+=add;S.lastBoost=S.t;
      // every 10,000 events/s added by hand starts one more server at once
      for(var n=Math.floor(S.boost*.4+1e-6)-tiers;n>0;n--){var nv={a:0,id:++S.sid};S.servers.push(nv);S.cool=1.2;say('High load · Kubernetes started server-'+nv.id,C.amber);}
      S.tags.push({x:hb?hb.x+hb.w+34:200,y:34,text:'+'+fmt(add*4000),fill:C.amber,life:1.6});
      if(S.ro.total)S.ro.total.next=S.t;
      if(S.target+S.boost>=CAP-.01)say('50,000 events/s · demo limit reached',C.amber);
    }
    function act(h){
      if(!h)return;
      if(h.kind==='lb')healthCheck();else if(h.kind==='db')query();else if(h.kind==='gdb')fraud();else if(h.kind==='head')addLoad();else
      if(h.kind==='src'&&h.node)burst(h.i);
      else if(h.edge){if(h.kind==='src')trace(h.i,null);else if(h.kind==='gwrite')trace(2,h.srv,true);else if(h.kind==='write')trace([1,3][(Math.random()*2)|0],h.srv,false);else trace(Math.floor(Math.random()*SRC.length),h.srv);}
      else if(h.kind==='srv')fail(h.srv);
      if(still)frame(0);
    }

    function frame(dt){
      S.dt=dt;S.t+=dt;var w=S.w,h=S.h,top=64,bot=h-24,k=still?1:Math.min(1,dt*11);
      var extra=0;S.bursts=S.bursts.map(function(b,i){var e=burstEnv(b);extra+=2.4*e*(SRC[i].w*2+.4);return Math.max(0,b-dt);});
      if(S.boost>0&&S.t-S.lastBoost>6)S.boost=Math.max(0,S.boost-dt*(S.boost*.35+.02));
      S.load=still?S.target+S.boost:lerp(S.load,S.target+S.boost+extra,Math.min(1,dt*2));
      if(!still&&S.t>=S.jitNext){S.jit=Math.round(rnd(-40,40));S.jitNext=S.t+rnd(1.8,2.8);}
      // autoscale, with failure handling
      S.servers.forEach(function(v){if(v.down){v.down-=dt;if(v.down<=0){v.down=0;v.gone=true;v.failed=true;}}});
      S.base=still?S.target+extra:lerp(S.base,S.target+extra,Math.min(1,dt*2));
      var need=Math.min(12,clamp(Math.ceil(S.base*1.25),2,8)+Math.floor(S.boost*.4+1e-6));S.cool-=dt;
      var live=S.servers.filter(function(v){return !v.gone&&!v.down;}).length;
      if(still){while(live<need){S.servers.push({a:1,id:++S.sid});live++;}while(live>need){var rm=S.servers.filter(function(v){return !v.gone&&!v.down;}).pop();rm.gone=true;live--;}S.servers=S.servers.filter(function(v){return !v.gone;});}
      if(!still&&S.replacing.length&&S.t>=S.replacing[0].at){var rp=S.replacing.shift(),nv={a:0,id:++S.sid};S.servers.push(nv);live++;S.cool=1.5;
        say('Kubernetes replaced it with server-'+nv.id+' in '+(S.t-rp.t).toFixed(1)+' s',C.teal);}
      else if(S.cool<=0&&need>live){S.servers.push({a:0,id:++S.sid});S.cool=.45;}
      else if(S.cool<=0&&need<live){for(var j=S.servers.length-1;j>=0;j--)if(!S.servers[j].gone&&!S.servers[j].down){S.servers[j].gone=true;break;}S.cool=.8;}
      S.servers.forEach(function(v){v.a=v.gone?Math.max(0,v.a-dt*(v.failed?3:2)):(still?1:Math.min(1,v.a+dt*2.5));});
      S.servers=S.servers.filter(function(v){return !(v.gone&&v.a<=0);});
      // layout
      var X=[.12,.38,.65,.9],mid=(top+bot)/2,n=S.servers.length;
      var src=SRC.map(function(s,i){return{x:X[0]*w,y:lerp(top+14,bot-8,i/(SRC.length-1)),i:i};});
      var lb={x:X[1]*w,y:mid},db={x:X[3]*w,y:lerp(top,bot,.27)},gdb={x:X[3]*w,y:lerp(top,bot,.75)};
      var gap=Math.min(30,(bot-top)/Math.max(n,1));
      S.servers.forEach(function(v,i){var ty=mid+(i-(n-1)/2)*gap;v.y=v.y==null||still?ty:lerp(v.y,ty,Math.min(1,dt*6));v.x=X[2]*w;});
      var alive=S.servers.filter(function(v){return !v.gone&&!v.down&&v.a>.5;});
      var total=Math.min(50000,S.load*4000+S.jit),util=Math.min(1,S.load/(Math.max(1,alive.length)*.8));
      var edges=[];
      src.forEach(function(p){edges.push({a:p,b:lb,kind:'src',i:p.i,key:'src:'+p.i,col:SRC[p.i].color});});
      S.servers.forEach(function(v){edges.push({a:lb,b:v,kind:'route',srv:v,key:'route:'+v.id,col:C.amber});edges.push({a:v,b:db,kind:'write',srv:v,key:'write:'+v.id,col:C.amber});edges.push({a:v,b:gdb,kind:'gwrite',srv:v,key:'gwrite:'+v.id,col:C.teal});});
      S.L={src:src,lb:lb,db:db,gdb:gdb,alive:alive,edges:edges};
      // outage: no server left, so the balancer holds events until one returns
      if(!alive.length){if(!S.outage){S.outage=true;S.queued=0;say('All servers down · events queued at the balancer',C.amber);}S.queued+=total*dt;}
      else if(S.outage){S.outage=false;var qn0=S.queued,dur=1.2;S.drain={n:qn0,left:qn0,rate:qn0/dur,t0:S.t};
        S.dots.forEach(function(d){if(d.q)d.wait=rnd(0,dur);});if(S.ro.total)S.ro.total.next=S.t;}
      if(S.drain){S.drain.left-=S.drain.rate*dt;S.stored+=S.drain.rate*dt;
        if(S.drain.left<=0){say(fmt(S.drain.n)+' queued events processed in '+(S.t-S.drain.t0).toFixed(1)+' s',C.teal);S.drain=null;}}

      // hover with hysteresis
      var cand=S.inside?candidates(S.mx,S.my):[],best=bestOf(cand);
      if(S.hov){var cur=null;cand.forEach(function(c){if(c.key===S.hov.key)cur=c;});
        if(cur&&cur.d<cur.lim+12&&(!best||best.key===cur.key||best.d>cur.d-6))best=cur;}
      // scroll tour: with no pointer on the canvas, the label follows the page scroll
      if(S.tour.on){var tst=tourStops();tourStep(tst.length);var ts=S.tour.idx>=0?tst[S.tour.idx]:null;
        if(!best&&!S.inside&&ts&&ts.ay>S.tour.vt+4&&ts.ay<S.tour.vb-4)best=ts;}
      S.hov=best;var hov=best;
      var bb=S.bubbleBox,overB=bb&&S.inside&&S.mx>=bb.x&&S.mx<=bb.x+bb.w&&S.my>=bb.y&&S.my<=bb.y+bb.h;
      cv.style.cursor=overB||(hov&&(actionHint(hov)||hov.kind==='head'))?'pointer':'default';
      var focus=hov&&hov.kind!=='head'&&hov.kind!=='dbpanel';S.f=lerp(S.f,focus?1:0,k);
      function edgeOn(e){
        if(!hov)return false;if(hov.key===e.key)return true;
        if(hov.kind==='lb')return e.kind==='src'||e.kind==='route';
        if(hov.kind==='db')return e.kind==='write';
        if(hov.kind==='gdb')return e.kind==='gwrite';
        if(hov.kind==='srv')return e.srv===hov.srv;
        return false;
      }
      function related(d){
        if(!hov)return true;
        if(hov.kind==='src')return d.src===hov.i;
        if(hov.kind==='lb')return d.seg<=1;
        if(hov.kind==='db'||hov.kind==='gdb')return d.seg===2;
        if(hov.kind==='srv')return d.srv===hov.srv;
        if(hov.kind==='route')return d.srv===hov.srv&&d.seg===1;
        if(hov.kind==='write'||hov.kind==='gwrite')return d.srv===hov.srv&&d.seg===2;
        return true;
      }
      function onSeg(d){
        if(!hov||(!hov.edge&&hov.kind!=='src'))return false;
        if(hov.kind==='src')return d.src===hov.i&&d.seg===0;
        if(hov.kind==='route')return d.srv===hov.srv&&d.seg===1;
        if(hov.kind==='write'||hov.kind==='gwrite')return d.srv===hov.srv&&d.seg===2;
        return false;
      }
      function dim(e){return 1-S.f*(1-e)*.82;}
      function segEnds(d){var a=d.seg===0?src[d.src]:d.seg===1?lb:d.srv,b=d.seg===0?lb:d.seg===1?d.srv:db;if(d.from)a=d.from;return[a,b];}

      // spawn
      S.acc+=dt*22*Math.min(S.load,7);if(alive.length)S.stored+=total*dt;
      while(S.acc>1){S.acc--;var si=pickSrc(),sv=SRC[si].vals;S.dots.push({src:si,g:si===2||(si===0&&Math.random()<.3),seg:0,p:0,sp:1.1+Math.random()*.4,srv:null,val:sv[(Math.random()*sv.length)|0],e:1,l:0});}

      if(O.transparent)cx.clearRect(0,0,w,h);else{cx.fillStyle=C.bg;cx.fillRect(0,0,w,h);}
      // edges
      cx.lineCap='round';
      edges.forEach(function(e){
        var on=edgeOn(e),part=!on&&hov&&hov.kind==='src'&&e.kind!=='src',ecol=part?(e.kind==='route'?SRC[hov.i].color:SRC[hov.i].done):e.col;
        var em=ease('e:'+e.key,on?1:part?.5:0,k),fade=e.srv?e.srv.a*(e.srv.down?.4:1):1,base=e.kind==='src'?.32:.18;
        var bst=e.kind==='src'?burstEnv(S.bursts[e.i]):0;
        var near=(!hov&&S.inside)?clamp(1-proj(S.mx,S.my,e.a,e.b).d/60,0,1)*.35:0;
        var infra=e.kind!=='src',dm=infra?1-S.f*(1-Math.max(em,bst))*.4:dim(Math.max(em,bst));
        var a=Math.min(1,(base+near+bst*.5+(1-base)*em)*dm)*fade;
        var glow=Math.max(em,bst*.8);
        if(glow>.02){cx.globalAlpha=.16*glow*fade;cx.strokeStyle=ecol;cx.lineWidth=9;cx.beginPath();cx.moveTo(e.a.x,e.a.y);cx.lineTo(e.b.x,e.b.y);cx.stroke();}
        cx.globalAlpha=a;cx.strokeStyle=e.kind==='src'||em>.02||near>0?ecol:C.muted;cx.lineWidth=1+glow*1.2;
        cx.beginPath();cx.moveTo(e.a.x,e.a.y);cx.lineTo(e.b.x,e.b.y);cx.stroke();
        if(em>.02&&!still){cx.globalAlpha=.55*em*fade;cx.strokeStyle='#ffffff';cx.lineWidth=1.2;cx.setLineDash([1,11]);cx.lineDashOffset=-S.t*38;
          cx.beginPath();cx.moveTo(e.a.x,e.a.y);cx.lineTo(e.b.x,e.b.y);cx.stroke();cx.setLineDash([]);}
      });
      cx.globalAlpha=1;
      // dots
      var labelled=[],qn=0;
      S.dots=S.dots.filter(function(d){
        if(d.q){
          if(alive.length&&(d.wait-=dt)<=0){d.q=false;d.seg=1;d.p=0;d.from={x:d.x,y:d.y};d.srv=alive[S.rr++%alive.length];d.sp*=1.9;}
          else{var qi=qn++,tx=lb.x-27+(qi%10)*6,ty=lb.y+46+((qi/10)|0)*6,kq=still?1:Math.min(1,dt*9);
            d.x=lerp(d.x,tx,kq);d.y=lerp(d.y,ty,kq);d.e=lerp(d.e,related(d)?1:0,k);
            cx.globalAlpha=dim(d.e);cx.fillStyle=SRC[d.src].color;cx.beginPath();cx.arc(d.x,d.y,2.1,0,6.3);cx.fill();return true;}
        }
        d.p+=dt*d.sp*(onSeg(d)?.45:1);
        if(d.p>=1){d.p=0;d.from=null;d.seg++;if(d.seg===1){d.srv=alive.length?alive[S.rr++%alive.length]:null;
          if(!d.srv){if(S.qn>=80)return false;d.q=true;d.wait=1e9;d.x=lb.x;d.y=lb.y;return true;}}if(d.seg>2){record(d);return false;}}
        var ab=segEnds(d);if(!ab[0]||!ab[1]||ab[1].y==null)return false;
        d.x=lerp(ab[0].x,ab[1].x,d.p);d.y=lerp(ab[0].y,ab[1].y,d.p);
        d.e=lerp(d.e,related(d)?1:0,k);d.l=lerp(d.l,onSeg(d)?1:0,k);
        var col=d.seg===2?SRC[d.src].done:SRC[d.src].color,r=2.1+d.e*S.f*.9;
        if(d.seg===2){var a0=d.from||d.srv;d.x2=lerp(a0.x,gdb.x,d.p);d.y2=lerp(a0.y,gdb.y,d.p);
          [[d.x,d.y,Math.PI/2],[d.x2,d.y2,-Math.PI/2]].forEach(function(hf){
            if(d.e*S.f>.05){cx.globalAlpha=.22*d.e*S.f;cx.fillStyle=col;cx.beginPath();cx.arc(hf[0],hf[1],r+4,hf[2],hf[2]+Math.PI);cx.closePath();cx.fill();}
            cx.globalAlpha=dim(d.e);cx.fillStyle=col;cx.beginPath();cx.arc(hf[0],hf[1],r+.6,hf[2],hf[2]+Math.PI);cx.closePath();cx.fill();});}
        else{
        if(d.e*S.f>.05){cx.globalAlpha=.22*d.e*S.f;cx.fillStyle=col;cx.beginPath();cx.arc(d.x,d.y,r+4,0,6.3);cx.fill();}
        cx.globalAlpha=dim(d.e);cx.fillStyle=col;cx.beginPath();cx.arc(d.x,d.y,r,0,6.3);cx.fill();}
        if(d.l>.05)labelled.push(d);
        return true;
      });
      S.qn=qn;
      if(qn||S.outage||S.drain){var rows=Math.max(1,Math.ceil(qn/10)),qa=S.outage?1:clamp(qn/20,0,1);
        cx.globalAlpha=.8*qa;cx.strokeStyle=C.amber;cx.lineWidth=1;cx.setLineDash([3,3]);rr(lb.x-32,lb.y+40,64,rows*6+6,4);cx.stroke();cx.setLineDash([]);
        var qc=S.drain?Math.max(0,S.drain.left):S.queued;
        if(qc>0){cx.globalAlpha=qa;cx.fillStyle=C.amber;cx.font='600 11px '+MONO;cx.textAlign='center';cx.fillText(fmt(Math.round(qc/10)*10)+' queued',lb.x,lb.y+rows*6+60);}
        cx.globalAlpha=1;}
      labelled.sort(function(a,b){return Math.hypot(a.x-S.mx,a.y-S.my)-Math.hypot(b.x-S.mx,b.y-S.my);});
      cx.font='500 10.5px '+MONO;cx.textAlign='center';cx.lineJoin='round';
      labelled.slice(0,2).forEach(function(d){var g2=hov&&hov.kind==='gwrite'&&d.seg===2;d={x:g2?d.x2:d.x,y:g2?d.y2:d.y,val:d.val,src:d.src,seg:d.seg,l:d.l};cx.globalAlpha=d.l;cx.strokeStyle=C.bg;cx.lineWidth=4;cx.strokeText(d.val,d.x,d.y-10);cx.fillStyle=d.seg===2?SRC[d.src].done:SRC[d.src].color;cx.fillText(d.val,d.x,d.y-10);});
      cx.globalAlpha=1;
      // nodes
      src.forEach(function(p){var s=SRC[p.i],on=hov&&((hov.kind==='src'&&hov.i===p.i)||hov.kind==='lb'),em=ease('n:src:'+p.i,on?1:0,k),b=burstEnv(S.bursts[p.i]);
        if(b>0&&!still){for(var q=0;q<2;q++){var ph=(S.t*1.6+q*.5)%1;cx.globalAlpha=(1-ph)*.6*b;cx.strokeStyle=s.color;cx.lineWidth=1.5;cx.beginPath();cx.arc(p.x,p.y,6+ph*20,0,6.3);cx.stroke();}}
        if(em>.02){cx.globalAlpha=.2*em;cx.fillStyle=s.color;cx.beginPath();cx.arc(p.x,p.y,12,0,6.3);cx.fill();}
        cx.globalAlpha=dim(Math.max(em,b));cx.fillStyle=s.color;cx.beginPath();cx.arc(p.x,p.y,5.5+em*1.5+b*1.5,0,6.3);cx.fill();
        cx.fillStyle=C.text;cx.font='600 11px '+HEAD;cx.textAlign='center';cx.fillText(s.name,p.x,p.y-12);});
      var lbOn=hov&&(hov.kind==='lb'||hov.kind==='src'||hov.kind==='route'),eLb=ease('n:lb',lbOn?1:0,k);
      cx.globalAlpha=1;cx.fillStyle=C.coral;rr(lb.x-13,lb.y-13,26,26,5);cx.fill();
      S.servers.forEach(function(v){var on=hov&&hov.srv===v,em=ease('n:srv:'+v.id,on?1:0,k);
        var downCol=v.down||v.failed,flash=v.down?(Math.sin(S.t*30)>0?1:.5):1;
        cx.globalAlpha=v.a*flash;cx.strokeStyle=downCol?C.red:C.amber;cx.lineWidth=1.4+em*.8;rr(v.x-22,v.y-9,44,18,4);cx.stroke();
        cx.globalAlpha=v.a*.85*flash;cx.fillStyle=downCol?C.red:C.amber;rr(v.x-22,v.y-9,downCol?44:Math.max(8,44*util),18,4);cx.fill();
        if(downCol){cx.globalAlpha=v.a;cx.fillStyle=C.bg;cx.font='700 10px '+HEAD;cx.textAlign='center';cx.fillText('DOWN',v.x,v.y+4);}});
      var dbOn=hov&&(hov.kind==='db'||hov.kind==='write'),eDb=ease('n:db',dbOn?1:0,k);
      cx.globalAlpha=1;cx.strokeStyle=C.text;cx.lineWidth=1.5;cx.beginPath();cx.ellipse(db.x,db.y-13,15,5,0,0,6.3);cx.stroke();
      cx.beginPath();cx.moveTo(db.x-15,db.y-13);cx.lineTo(db.x-15,db.y+13);cx.ellipse(db.x,db.y+13,15,5,0,Math.PI,0,true);cx.lineTo(db.x+15,db.y-13);cx.stroke();
      // graph database: a small node cluster; on click it opens up and flags a fraud ring
      var fe=0;S.fnodes=null;
      if(S.fraud){var F=S.fraud;F.t+=dt;var nearG=S.inside&&Math.hypot(S.mx-gdb.x,S.my-gdb.y)<62;F.away=nearG?0:F.away+dt;
        if(!F.closing&&F.t>3.2&&F.away>1.5)F.closing=true;
        F.e=still?(F.closing?0:1):clamp(F.e+(F.closing?-dt/.5:dt/.4),0,1);
        if(F.closing&&F.e<=0)S.fraud=null;fe=F.e*F.e*(3-2*F.e);}
      var GN=[[0,0],[-13,-8],[12,-10],[-10,11],[13,9]],GE=[[0,1],[0,2],[0,3],[0,4],[1,3],[2,4]];
      cx.globalAlpha=1-fe;cx.strokeStyle=C.text;cx.lineWidth=1.1;
      GE.forEach(function(e){cx.beginPath();cx.moveTo(gdb.x+GN[e[0]][0],gdb.y+GN[e[0]][1]);cx.lineTo(gdb.x+GN[e[1]][0],gdb.y+GN[e[1]][1]);cx.stroke();});
      GN.forEach(function(n,i){cx.fillStyle=i?C.text:C.teal;cx.beginPath();cx.arc(gdb.x+n[0],gdb.y+n[1],i?2.6:3.6,0,6.3);cx.fill();});
      if(fe>.01){
        var FN=[{x:0,y:0,c:C.red,r:5,l:'device'},{x:-30,y:-18,c:C.amber,r:3.5},{x:28,y:-20,c:C.amber,r:3.5},{x:2,y:31,c:C.amber,r:3.5},{x:-33,y:16,c:C.teal,r:3},{x:33,y:14,c:C.teal,r:3}],
            FE=[[0,1,1],[0,2,1],[0,3,1],[1,4,0],[2,5,0],[3,4,0]],sc=.45+.55*fe,pulse=still?1:.6+.4*Math.sin(S.t*9);
        cx.globalAlpha=.94*fe;cx.fillStyle=C.bg;cx.beginPath();cx.arc(gdb.x,gdb.y,46*sc,0,6.3);cx.fill();
        cx.globalAlpha=fe;cx.strokeStyle='rgba(255,90,78,.45)';cx.lineWidth=1;cx.beginPath();cx.arc(gdb.x,gdb.y,46*sc,0,6.3);cx.stroke();
        FE.forEach(function(e){var a=FN[e[0]],b=FN[e[1]];cx.globalAlpha=fe*(e[2]?pulse:.7);cx.strokeStyle=e[2]?C.red:C.muted;cx.lineWidth=e[2]?1.8:1;
          cx.beginPath();cx.moveTo(gdb.x+a.x*sc,gdb.y+a.y*sc);cx.lineTo(gdb.x+b.x*sc,gdb.y+b.y*sc);cx.stroke();});
        if(fe>.6)S.fnodes=[];
        FN.forEach(function(n,i){var nx2=gdb.x+n.x*sc,ny2=gdb.y+n.y*sc,on=hov&&hov.kind==='fnode'&&hov.i===i,eo=ease('fn:'+i,on?1:0,k);
          if(eo>.02){cx.globalAlpha=fe*eo;cx.strokeStyle='#ffffff';cx.lineWidth=1.5;cx.beginPath();cx.arc(nx2,ny2,n.r+4,0,6.3);cx.stroke();}
          cx.globalAlpha=fe;cx.fillStyle=n.c;cx.beginPath();cx.arc(nx2,ny2,n.r+eo*1.5,0,6.3);cx.fill();
          if(S.fnodes)S.fnodes.push({i:i,x:nx2,y:ny2,r:n.r});});
        cx.globalAlpha=fe;cx.font='700 10px '+HEAD;cx.textAlign='center';cx.fillStyle=C.red;cx.fillText('FRAUD RING',gdb.x,gdb.y-50*sc);
      }
      cx.globalAlpha=1;cx.fillStyle=C.muted;cx.font='400 10.5px '+BODY;cx.textAlign='center';
      cx.fillText('PostgreSQL',db.x,db.y+32);if(fe<.5)cx.fillText('Graph',gdb.x,gdb.y+28);
      cx.font='600 10px '+HEAD;
      var lowS=S.servers.reduce(function(m,v){return v.y!=null&&v.a>.05?Math.max(m,v.y):m;},mid);
      cx.fillText('LOAD BALANCER',lb.x,lb.y+28);cx.fillText('SERVERS',X[2]*w,Math.min(h-6,lowS+24));

      // tracers: one highlighted event with a timestamp at each hop
      S.tracers=S.tracers.filter(function(tr){
        tr.p+=dt*(still?0:.85);
        var col=SRC[tr.src].color;
        if(tr.seg===1&&(!tr.srv||tr.srv.gone||tr.srv.down)){tr.srv=alive[0]||null;
          if(!tr.srv){tr.p=0;var hx=lb.x+16,hy=lb.y-16,ph=still?0:(S.t*1.5)%1;
            cx.globalAlpha=(1-ph)*.8;cx.strokeStyle=col;cx.lineWidth=1.5;cx.beginPath();cx.arc(hx,hy,6+ph*10,0,6.3);cx.stroke();
            cx.globalAlpha=1;cx.fillStyle='#ffffff';cx.beginPath();cx.arc(hx,hy,4.5,0,6.3);cx.fill();
            if(!tr.held){tr.held=true;S.tags.push({x:hx,y:hy-14,text:'queued',fill:C.amber,life:2.4});}return true;}}
        if(tr.p>=1){tr.p=0;tr.seg++;
          if(tr.seg<3){var node=tr.seg===1?lb:tr.srv;S.tags.push({x:node.x,y:node.y-18,text:'+'+tr.ms[tr.seg]+' ms',life:2.4});}
          if(tr.seg===3){var gms=tr.ms[3]+Math.round(rnd(2,4)),tot=tr.ms[1]+tr.ms[2];
            S.tags.push({x:db.x,y:db.y-26,text:'+'+tr.ms[3]+' ms',fill:SRC[tr.src].done,life:2.4});S.tags.push({x:gdb.x,y:gdb.y-24,text:'+'+gms+' ms',fill:SRC[tr.src].done,life:2.4});
            say('Event #'+tr.no+' via server-'+tr.srv.id+' · stored in '+(tot+tr.ms[3])+' ms, linked in '+(tot+gms)+' ms',SRC[tr.src].done);return false;}}
        var a=tr.seg===0?src[tr.src]:tr.seg===1?lb:tr.srv,b=tr.seg===0?lb:tr.seg===1?tr.srv:db;
        var x=lerp(a.x,b.x,tr.p),y=lerp(a.y,b.y,tr.p);tr.trail.push({x:x,y:y});if(tr.trail.length>14)tr.trail.shift();
        var heads=[[x,y,0,6.3]];
        if(tr.seg===2){col=SRC[tr.src].done;var x2=lerp(a.x,gdb.x,tr.p),y2=lerp(a.y,gdb.y,tr.p);tr.trail2=tr.trail2||[];tr.trail2.push({x:x2,y:y2});if(tr.trail2.length>14)tr.trail2.shift();
          heads=[[x,y,Math.PI/2,Math.PI/2+Math.PI],[x2,y2,-Math.PI/2,Math.PI/2]];}
        [tr.trail,tr.seg===2?tr.trail2:[]].forEach(function(T){T.forEach(function(p,i){cx.globalAlpha=i/T.length*.5;cx.fillStyle=col;cx.beginPath();cx.arc(p.x,p.y,1.5+i/T.length*2.5,0,6.3);cx.fill();});});
        heads.forEach(function(hd){var full=hd[3]-hd[2]>6;
          cx.globalAlpha=.3;cx.fillStyle=col;cx.beginPath();cx.arc(hd[0],hd[1],11,hd[2],hd[3]);if(!full)cx.closePath();cx.fill();
          cx.globalAlpha=1;cx.fillStyle='#ffffff';cx.beginPath();cx.arc(hd[0],hd[1],5,hd[2],hd[3]);if(!full)cx.closePath();cx.fill();
          cx.strokeStyle=col;cx.lineWidth=2;cx.beginPath();cx.arc(hd[0],hd[1],7.5,hd[2],hd[3]);if(!full)cx.closePath();cx.stroke();});
        return true;
      });
      S.tags=S.tags.filter(function(t){t.life-=dt;var a=clamp(t.life/.6,0,1),rise=(2.4-t.life)*4;
        cx.globalAlpha=a;cx.font='600 11px '+MONO;cx.textAlign='center';cx.lineJoin='round';cx.strokeStyle=C.bg;cx.lineWidth=4;
        cx.strokeText(t.text,t.x,t.y-rise);cx.fillStyle=t.fill||'#ffffff';cx.fillText(t.text,t.x,t.y-rise);return t.life>0||still;});
      if(still)S.tags=[];

      // health check: a pulse runs from the balancer to each server, which answers with its latency
      S.checks=S.checks.filter(function(c){
        c.p=Math.min(1,c.p+dt*1.8);var v=c.srv;if(v.y==null)return false;
        if(c.p<1){var x=lerp(lb.x,v.x-22,c.p),y=lerp(lb.y,v.y,c.p);
          cx.globalAlpha=.25;cx.fillStyle=C.teal;cx.beginPath();cx.arc(x,y,8,0,6.3);cx.fill();
          cx.globalAlpha=1;cx.beginPath();cx.arc(x,y,3,0,6.3);cx.fill();return true;}
        var ok=!v.down&&!v.failed&&!v.gone,st=S.checkStat;
        if(ok){st.ok++;st.max=Math.max(st.max,c.ms);}
        S.tags.push({x:v.x+40,y:v.y+4,text:ok?'✓ '+c.ms+' ms':'✕ no reply',fill:ok?C.teal:C.red,life:2});
        return false;});
      if(S.checkStat&&!S.checks.length){var st=S.checkStat;
        say('Health check: '+st.ok+' of '+st.n+' healthy'+(st.ok?' · '+st.max+' ms max':''),st.ok===st.n?C.teal:C.red);S.checkStat=null;}
      if(S.checks.length&&!still){var ph=(S.t*2)%1;cx.globalAlpha=(1-ph)*.7;cx.strokeStyle=C.teal;cx.lineWidth=1.5;rr(lb.x-13-ph*10,lb.y-13-ph*10,26+ph*20,26+ph*20,5+ph*4);cx.stroke();}
      S.ripples=S.ripples.filter(function(r){r.t+=dt/.9;if(still)r.t=1;
        for(var q=0;q<2;q++){var t=r.t-q*.25;if(t<=0||t>=1)continue;cx.globalAlpha=(1-t)*.8;cx.strokeStyle=C.text;cx.lineWidth=1.3;
          cx.beginPath();cx.ellipse(db.x,db.y,18+t*26,10+t*16,0,0,6.3);cx.stroke();}
        return r.t<1.25;});
      cx.globalAlpha=1;
      // headline readout: number right-aligned in a fixed slot so the unit never moves
      cx.globalAlpha=1;cx.textAlign='right';cx.fillStyle=C.amber;cx.font='700 24px '+HEAD;
      var slot=cx.measureText('88,888').width,nx=14+slot;
      cx.fillText(fmt(ro('total',Math.min(99990,total+(S.drain?S.drain.rate:0)),10,2)),nx,30);
      cx.textAlign='left';cx.font='600 14px '+HEAD;cx.fillText('events/s',nx+7,30);
      var unitW=cx.measureText('events/s').width;S.headBox={x:10,y:8,w:nx+11+unitW-10,h:30};
      var eH=ease('n:head',hov&&hov.kind==='head'?1:0,k);
      if(eH>.02){cx.globalAlpha=.7*eH;cx.fillRect(14,36,(nx+7+unitW-14)*eH,1.5);
        cx.globalAlpha=eH;cx.fillStyle=C.muted;cx.font='italic 400 11.5px '+BODY;
        cx.fillText(S.target+S.boost>=CAP-.01?'demo limit reached':'+5,000 per click',nx+16+unitW,30);}
      cx.globalAlpha=1;
      cx.fillStyle=C.muted;cx.font='400 12.5px '+BODY;
      var sTxt=alive.length+(alive.length===1?' server':' servers'),pctSlot=cx.measureText('100%').width,sx=14+cx.measureText('10 servers').width+10;
      if(S.outage){cx.fillStyle=C.red;cx.fillText('0 servers · events held in queue',14,49);}
      else{cx.fillText(sTxt,14,49);cx.textAlign='right';cx.fillText(ro('util',util*100,5)+'%',sx+pctSlot,49);cx.textAlign='left';cx.fillText('busy',sx+pctSlot+5,49);}
      // activity feed, top right
      S.feed=S.feed.filter(function(m){m.life-=dt;return m.life>0;});
      cx.textAlign='right';cx.font='400 12px '+BODY;
      S.feed.forEach(function(m,i){cx.globalAlpha=clamp(m.life,0,1)*(i===0?1:.7);var y=22+i*16;
        cx.fillStyle=C.text;cx.fillText(m.text,w-26,y);cx.fillStyle=m.col;cx.beginPath();cx.arc(w-16,y-4,3.5,0,6.3);cx.fill();});
      cx.globalAlpha=1;

      // label for the focused element
      // PostgreSQL tables, opened by clicking the database; rows update live
      S.dbRows=[];S.dbBox=null;
      if(S.dbv){var V=S.dbv,nearD=hov&&(hov.kind==='db'||hov.kind==='row'||hov.kind==='dbpanel');V.away=nearD?0:V.away+dt;
        if(!V.closing&&V.away>6)V.closing=true;
        V.e=still?(V.closing?0:1):clamp(V.e+(V.closing?-dt/.35:dt/.3),0,1);
        if(V.closing&&V.e<=0)S.dbv=null;
        var ve=V.e*V.e*(3-2*V.e);
        if(ve>.01){
          var pw=Math.min(272,w-24),ph=200,px=Math.max(12,db.x-26-pw),py=clamp(db.y-60,58,h-ph-8)+(1-ve)*8;
          cx.globalAlpha=ve*.6;cx.strokeStyle=C.text;cx.lineWidth=1;cx.setLineDash([2,3]);cx.beginPath();cx.moveTo(px+pw,clamp(db.y,py+10,py+ph-10));cx.lineTo(db.x-17,db.y);cx.stroke();cx.setLineDash([]);
          cx.globalAlpha=ve;cx.save();cx.shadowColor='rgba(0,0,0,.5)';cx.shadowBlur=24;cx.shadowOffsetY=8;cx.fillStyle=C.panel;rr(px,py,pw,ph,10);cx.fill();cx.restore();
          cx.globalAlpha=ve;cx.strokeStyle=C.hair;cx.lineWidth=1;rr(px+.5,py+.5,pw-1,ph-1,10);cx.stroke();
          S.dbBox={x:px,y:py,w:pw,h:ph};
          var TB=[{name:'events',count:fmt(S.stored)+' rows',cols:['id','source','value'],cx:[0,62,148],rows:S.rows.events,cell:function(r){return[String(r.id),r.src,r.val];}},
                  {name:'orders',count:fmt(S.orderId-1)+' rows',cols:['id','total','status'],cx:[0,62,148],rows:S.rows.orders,cell:function(r){return['' +r.id,r.total,r.status];}}];
          TB.forEach(function(tb,ti){var ox=px+14,oy=py+12+ti*96,iw=pw-28;
            cx.textAlign='left';cx.fillStyle=C.text;cx.font='700 12px '+MONO;cx.fillText(tb.name,ox,oy+10);
            cx.textAlign='right';cx.fillStyle=C.muted;cx.font='400 10.5px '+MONO;cx.fillText(tb.count,ox+iw,oy+10);
            cx.textAlign='left';cx.fillStyle=C.muted;cx.font='600 9.5px '+HEAD;
            tb.cols.forEach(function(c,ci){cx.fillText(c.toUpperCase(),ox+tb.cx[ci],oy+28);});
            cx.fillStyle=C.hair;cx.fillRect(ox,oy+33,iw,1);
            tb.rows.forEach(function(r,ri){var ry=oy+36+ri*17,on=hov&&hov.kind==='row'&&hov.table===tb.name&&hov.i===ri,fresh=clamp(1-(S.t-r.born)/1.2,0,1),eo=ease('row:'+tb.name+':'+ri,on?1:0,k);
              if(fresh>.01||eo>.01){cx.globalAlpha=ve*Math.max(fresh*.22,eo*.12);cx.fillStyle=on?'#ffffff':C.amber;cx.fillRect(ox-6,ry,iw+12,16);cx.globalAlpha=ve;}
              var cells=tb.cell(r);cx.font='400 10.5px '+MONO;
              cells.forEach(function(v,ci){cx.fillStyle=ci===2&&v==='review'?C.red:ci===0?C.muted:C.text;cx.fillText(v,ox+tb.cx[ci],ry+12);});
              if(ve>.9)S.dbRows.push({x:ox-6,y:ry,w:iw+12,h:16,table:tb.name,i:ri});});});
          cx.globalAlpha=1;}}
      var tipHov=hov&&hov.kind!=='head'&&hov.kind!=='dbpanel'?hov:null;
      if(tipHov){
        var Lb,raw;
        if(hov.kind==='src'){var s=SRC[hov.i];raw=total*s.w*(1+2*burstEnv(S.bursts[hov.i]));Lb={c:s.color,t:s.name,s:s.set,u:'events/s',p:s.pay};}
        else if(hov.kind==='lb'){raw=total;Lb={c:C.coral,t:'Load balancer',s:'Splits traffic across '+alive.length+' servers',u:'events/s in',p:'round robin · health check every 5 s'};}
        else if(hov.kind==='db'){raw=total;Lb={c:C.text,t:'PostgreSQL',s:'Primary database for orders and sessions',u:'rows/s written',p:'p95 write latency 6 ms'};}
        else if(hov.kind==='fnode'){var fi=FINFO[hov.i];Lb={c:FN_COL[hov.i],t:fi.t,s:fi.s,rows:fi.rows};}
        else if(hov.kind==='row'){var r=S.rows[hov.table][hov.i];
          if(!r)Lb={c:C.text,t:'Empty row',s:'',rows:[]};
          else if(hov.table==='events')Lb={c:C.amber,t:'events · row '+r.id,s:'Stored by '+r.srv,rows:[['source',r.src],['value',r.val],['received',r.ts],['latency',(8+r.id%9)+' ms']]};
          else Lb={c:r.status==='review'?C.red:C.teal,t:'orders · '+r.id,s:r.status==='review'?'Held for fraud review':'Checkout completed',rows:[['total',r.total],['card',r.card],['status',r.status],['risk score',r.risk],['created',r.ts]]};}
        else if(hov.kind==='gdb'){raw=total;Lb={c:C.teal,t:'Graph database',s:'Neo4j · links cards, devices and accounts',u:'links/s',p:'MATCH (a)-[:USED]->(d:Device) · 9 ms'};}
        else{var share=total/Math.max(1,alive.length),id=hov.srv.id;
          if(hov.kind==='gwrite'){raw=share;Lb={c:C.teal,t:'server-'+id+' → graph',s:'Half of every event, written as links',u:'links/s',p:'MERGE (c:Card)-[:USED_ON]->(d:Device)'};}
          else if(hov.kind==='write'){raw=share;Lb={c:C.amber,t:'server-'+id+' → database',s:'Half of every event, written as rows',u:'rows/s',p:'INSERT INTO events … 4 ms'};}
          else{raw=share;Lb={c:C.amber,t:'server-'+id,s:hov.kind==='route'?'Traffic routed to this server':'Spring Boot pod on Kubernetes, autoscaled',u:'events/s',p:'POST /api/v1/events → 202 · 12 ms',busy:true};}}
        Lb.hint=actionHint(hov);
        if(S.tip.key!==hov.key){delete S.ro['tip'];if(S.tip.a<.05){S.tip.x=hov.ax;S.tip.y=hov.ay;S.mark.x=hov.ax;S.mark.y=hov.ay;}}
        S.tip.key=hov.key;if(!Lb.rows)Lb.rate=ro('tip',raw,10,2);
        if(Lb.busy)Lb.pct=ro('util',util*100,5);
        S.tip.L=Lb;S.tip.tour=!!hov.tour;
        S.mark.x=lerp(S.mark.x,hov.ax,still?1:Math.min(1,dt*18));S.mark.y=lerp(S.mark.y,hov.ay,still?1:Math.min(1,dt*18));
      }
      S.tip.a=lerp(S.tip.a,tipHov?1:0,still?1:Math.min(1,dt*(tipHov?12:8)));
      if(S.tip.a>.02&&S.tip.L){
        var T=S.tip,L2=T.L,ta=T.a;
        cx.globalAlpha=ta;cx.strokeStyle=L2.c;cx.lineWidth=1.5;cx.beginPath();cx.arc(S.mark.x,S.mark.y,5,0,6.3);cx.stroke();
        cx.fillStyle=C.bg;cx.beginPath();cx.arc(S.mark.x,S.mark.y,2.5,0,6.3);cx.fill();
        // fixed widths: measure the widest possible values, not the current ones, so nothing shifts
        cx.font='700 13px '+HEAD;var tw=cx.measureText(L2.t).width+16;
        cx.font='400 11.5px '+BODY;var busyW=L2.busy?cx.measureText('100% busy').width+12:0;tw+=busyW;
        cx.font='400 12px '+BODY;tw=Math.max(tw,cx.measureText(L2.s).width);
        cx.font='700 17px '+HEAD;var rslot=cx.measureText('88,888').width,kw=0;
        if(L2.rows){cx.font='400 10.5px '+MONO;L2.rows.forEach(function(r){kw=Math.max(kw,cx.measureText(r[0]).width);});
          L2.rows.forEach(function(r){tw=Math.max(tw,kw+12+cx.measureText(r[1]).width);});}
        else{cx.font='400 12px '+BODY;tw=Math.max(tw,rslot+6+cx.measureText(L2.u).width);cx.font='400 10.5px '+MONO;tw=Math.max(tw,cx.measureText(L2.p).width);}
        cx.font='italic 400 11.5px '+BODY;if(L2.hint)tw=Math.max(tw,cx.measureText(L2.hint).width);
        var bw=tw+28,bh=(L2.rows?64+L2.rows.length*15:96)+(L2.hint?16:0),tx=S.mark.x+18,ty=S.mark.y-bh-14;
        if(tx+bw>w-8)tx=S.mark.x-bw-18;if(tx<8)tx=8;if(ty<8)ty=S.mark.y+16;if(ty+bh>h-8)ty=h-bh-8;
        // tour labels: keep the box in the part of the canvas on screen, above or below the marker, never on it
        if(T.tour){var vt=Math.max(8,S.tour.vt+8),vb=Math.min(h-8,S.tour.vb-8);
          if(ty<vt&&S.mark.y+16+bh<=vb)ty=S.mark.y+16;else if(ty+bh>vb&&S.mark.y-bh-14>=vt)ty=S.mark.y-bh-14;}
        T.x=still||ta<.1?tx:lerp(T.x,tx,Math.min(1,dt*14));T.y=still||ta<.1?ty:lerp(T.y,ty,Math.min(1,dt*14));
        var bx=T.x,by=T.y+(1-ta)*6;
        T.box={x:T.x,y:T.y,w:bw,h:bh};T.ty=ty;
        cx.save();cx.shadowColor='rgba(0,0,0,.45)';cx.shadowBlur=24;cx.shadowOffsetY=8;cx.fillStyle=C.panel;rr(bx,by,bw,bh,9);cx.fill();cx.restore();
        cx.globalAlpha=ta;cx.strokeStyle=C.hair;cx.lineWidth=1;rr(bx+.5,by+.5,bw-1,bh-1,9);cx.stroke();
        cx.fillStyle=L2.c;cx.beginPath();cx.arc(bx+18,by+20,3.5,0,6.3);cx.fill();
        cx.textAlign='left';cx.fillStyle=C.text;cx.font='700 13px '+HEAD;cx.fillText(L2.t,bx+28,by+24);
        if(L2.busy){cx.fillStyle=C.muted;cx.font='400 11.5px '+BODY;cx.textAlign='right';var bxr=bx+bw-14,bwid=cx.measureText(' busy').width;
          cx.fillText(' busy',bxr,by+24);cx.fillText(L2.pct+'%',bxr-bwid,by+24);cx.textAlign='left';}
        cx.fillStyle=C.muted;cx.font='400 12px '+BODY;cx.fillText(L2.s,bx+14,by+42);
        cx.fillStyle=C.hair;cx.fillRect(bx+14,by+52,bw-28,1);
        var hy=by+103;
        if(L2.rows){cx.font='400 10.5px '+MONO;cx.textAlign='left';
          L2.rows.forEach(function(r,i){cx.fillStyle=C.muted;cx.fillText(r[0],bx+14,by+70+i*15);cx.fillStyle=C.text;cx.fillText(r[1],bx+14+kw+12,by+70+i*15);});
          hy=by+70+L2.rows.length*15+4;}
        else{cx.fillStyle=L2.c===C.text?C.amber:L2.c;cx.font='700 17px '+HEAD;cx.textAlign='right';cx.fillText(fmt(L2.rate),bx+14+rslot,by+72);
          cx.textAlign='left';cx.fillStyle=C.muted;cx.font='400 12px '+BODY;cx.fillText(L2.u,bx+14+rslot+6,by+72);
          cx.font='400 10.5px '+MONO;cx.fillText(L2.p,bx+14,by+87);}
        if(L2.hint){cx.fillStyle=C.amber;cx.font='italic 400 11.5px '+BODY;cx.fillText(L2.hint,bx+14,hy);}
        cx.globalAlpha=1;
      }
      // the easter egg: a message once the demo hits its limit
      S.bubbleBox=null;
      if(S.bubble){var B=S.bubble;B.life-=dt;if(B.life<=0&&!still){S.bubble=null;}else{
        var ba=clamp(Math.min(B.life,8-B.life)*4,0,1),maxW=Math.min(300,w-28)-28,words=B.text.split(' '),lines=[],ln='';
        cx.font='400 12.5px '+BODY;
        words.forEach(function(wd){var tr=ln?ln+' '+wd:wd;if(cx.measureText(tr).width>maxW&&ln){lines.push(ln);ln=wd;}else ln=tr;});lines.push(ln);
        var bw2=maxW+28,bh2=24+lines.length*17+20,bx2=14,by2=58;
        cx.globalAlpha=ba;cx.save();cx.shadowColor='rgba(0,0,0,.5)';cx.shadowBlur=24;cx.shadowOffsetY=8;cx.fillStyle=C.panel;rr(bx2,by2,bw2,bh2,10);cx.fill();cx.restore();
        cx.globalAlpha=ba;cx.fillStyle=C.panel;cx.beginPath();cx.moveTo(bx2+30,by2+1);cx.lineTo(bx2+38,by2-7);cx.lineTo(bx2+46,by2+1);cx.fill();
        cx.strokeStyle=C.coral;cx.lineWidth=1.2;rr(bx2+.5,by2+.5,bw2-1,bh2-1,10);cx.stroke();
        cx.textAlign='left';cx.fillStyle=C.text;cx.font='400 12.5px '+BODY;
        lines.forEach(function(l,i){cx.fillText(l,bx2+14,by2+22+i*17);});
        cx.fillStyle=C.amber;cx.font='700 12.5px '+HEAD;cx.fillText('Book a 30-min call →',bx2+14,by2+22+lines.length*17+6);
        cx.globalAlpha=1;S.bubbleBox={x:bx2,y:by2,w:bw2,h:bh2};}}
    }
    var last=0,running=false,visible=true;
    function loop(now){var dt=Math.min(.05,(now-last)/1000||0);last=now;frame(dt);if(!still&&visible&&!document.hidden)requestAnimationFrame(loop);else running=false;}
    function start(){if(!running&&!still){running=true;last=performance.now();requestAnimationFrame(loop);}}
    function point(e){var r=cv.getBoundingClientRect();S.mx=e.clientX-r.left;S.my=e.clientY-r.top;S.inside=true;if(still)frame(0);}
    // the user takes over: the tour stays off until the canvas leaves the viewport
    function takeOver(){var T=S.tour;if(T.on&&!T.off){T.off=true;T.idx=-1;clearTimeout(T.annT);}}
    // a mouse moves the hover label; a finger only taps (on pointerup), so a scroll that starts on the canvas changes nothing
    cv.addEventListener('pointermove',function(e){if((e.pointerType||'mouse')!=='mouse')return;S.ptr='mouse';takeOver();point(e);});
    cv.addEventListener('pointerdown',function(e){S.ptr=e.pointerType||'mouse';
      if(S.ptr==='mouse'){takeOver();tap(e);return;}
      S.tdown={x:e.clientX,y:e.clientY};});
    cv.addEventListener('pointerup',function(e){var d=S.tdown;S.tdown=null;
      if(!d||(e.pointerType||'mouse')==='mouse')return;
      if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>10)return;
      tap(e);});
    cv.addEventListener('pointercancel',function(){S.tdown=null;});
    function tap(e){
      var r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,h=bestOf(candidates(mx,my));
      // a tap on the element the tour is showing runs its action at once: the label and its hint are already on screen
      var hv=S.hov,viaTour=!!(hv&&hv.tour&&h&&hv.key===h.key&&hv.kind===h.kind&&!hv.edge===!h.edge);
      takeOver();
      var bb=S.bubbleBox;
      if(S.bubble&&bb&&mx>=bb.x&&mx<=bb.x+bb.w&&my>=bb.y&&my<=bb.y+bb.h){window.open(CAL,'_blank','noopener');return;}
      // the table panel closes on any click outside it; that click does nothing else
      var pb=S.dbBox,inPanel=pb&&mx>=pb.x&&mx<=pb.x+pb.w&&my>=pb.y&&my<=pb.y+pb.h;
      if(S.dbv&&!S.dbv.closing&&!inPanel&&!(h&&h.kind==='db')){S.dbv.closing=true;S.armed=null;point(e);return;}
      point(e);
      if(h&&h.kind==='head'){act(h);return;}
      if(S.ptr==='mouse'){act(S.hov&&S.hov.key===(h&&h.key)?S.hov:h);return;}
      // touch and pen: first tap shows the label, a second tap on the same element runs the action
      clearTimeout(S.touchT);S.touchT=setTimeout(function(){S.inside=false;S.armed=null;if(still)frame(0);},4000);
      if(h&&(S.armed===h.key||viaTour)){act(h);S.armed=null;}else S.armed=h?h.key:null;
    }
    cv.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){S.inside=false;if(still)frame(0);}});
    if(ctrls)ctrls.querySelectorAll('button[data-load]').forEach(function(b){b.addEventListener('click',function(){
      S.target=+b.dataset.load;S.boost=0;ctrls.querySelectorAll('button[data-load]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});if(still)frame(0);});});
    document.addEventListener('pointerdown',function(e){if(e.target!==cv&&S.dbv&&!S.dbv.closing){S.dbv.closing=true;if(still)frame(0);}});
    new IntersectionObserver(function(en){visible=en[0].isIntersecting;
      if(!visible&&S.tour.off){S.tour.off=false;S.tour.idx=-1;}
      if(visible)start();}).observe(cv);
    // screen readers: the tour label, announced once it has stayed for 1.2 s, never the live numbers
    var live=null;
    if(S.tour.on){
      if(cv.parentNode&&document.createElement){live=document.createElement('div');live.setAttribute('aria-live','polite');
        live.style.cssText='position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';cv.parentNode.appendChild(live);}
      window.addEventListener('scroll',function(){if(!S.tour.raf)S.tour.raf=requestAnimationFrame(measure);},{passive:true});}
    document.addEventListener('visibilitychange',function(){if(!document.hidden)start();});
    // the phone address bar changes the height while scrolling; measure the viewport again only when the width changes
    window.addEventListener('resize',function(){var vw=window.innerWidth;if(vw!==S.tour.vw){S.tour.vw=vw;S.tour.vh=0;}size();if(S.tour.on)measure();frame(0);});
    cv._stream=S;  // test hook
    S.tour.vw=window.innerWidth;size();if(S.tour.on)measure();frame(0);start();
  }
