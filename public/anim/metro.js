  // Client journeys for the metro map, option A from Strategy/What We Offer.md: one line per starting point.
  // The three lines share Free audit, Build and Handover. col is the column along the journey.
  // num.ph marks a placeholder number to replace. iso picks the isometric scene in the station drill-down.
  function metroData(C){
    var ST={      audit:{n:'Free audit',when:'Week 0',iso:'desk',who:'A senior engineer and you',
        what:'A 45-minute call, then five working days on the two areas you pick: product, codebase, cloud or AI.',
        get:'An 8 to 10 page report and a 60-minute walkthrough with your team. Yours to keep.',num:{v:'5 days',l:'of review, on our side'}},
      discovery:{n:'Discovery and kickoff',when:'Weeks 1–2',iso:'board',who:'Product engineer, designer, your founder or product owner',
        what:'Goals, users and scope. We cut the first release down to what proves the idea. Already have a spec? We review it here and list the gaps.',
        get:'A prioritised backlog and a release plan.',num:{v:'6–10',l:'user stories in release one',ph:1}},
      design:{n:'Design',when:'Weeks 2–4',iso:'screens',who:'Product designer, part time',
        what:'User flows, a clickable prototype and a small design system. We test the prototype with real users before we build.',
        get:'Figma flows and components your developers can use.',num:{v:'5',l:'usability sessions',ph:1}},
      build:{n:'Build',when:'Every week',iso:'rack',who:'1–2 developers, design and DevOps part time',
        what:'Weekly releases to staging and a demo every Friday. AI features ship here too, tested on real cases first.',
        get:'Working software every Friday and a written update.',num:{v:'1',l:'demo every Friday'},
        by:{existing:'Back to the roadmap, now on a stable base. We build with your engineers, not around them.',
            team:'Your standups, your tickets, your code review. Our engineers work as members of your team.'}},
      launch:{n:'Launch',when:'Release week',iso:'rocket',who:'Developers and DevOps',
        what:'Release to production with monitoring, alerts and a rollback plan. We stay on call for the first weeks.',
        get:'Dashboards, alerts and a tested rollback.',num:{v:'< 10 min',l:'to roll back a release',ph:1},
        },
      handover:{n:'Handover',when:'When you’re ready',iso:'key',who:'Our team and your new hires',
        what:'Documentation, pairing with your hires and a planned exit.',
        get:'Runbooks, decision records and a team that owns the code.',num:{v:'2–4 weeks',l:'overlap with your hires',ph:1},
        by:{existing:'The before and after report goes with the code, so your team knows what changed and why.',
            team:'Your own hires take over our tickets. We stay for the overlap, then step out.'}},
      baseline:{n:'Measure the baseline',when:'Weeks 1–2',iso:'gauge',who:'Senior developer and DevOps',
        what:'How often you deploy, how long a change takes to reach users, how many releases fail and how fast you recover. Plus build time, open bugs and crash rate.',
        get:'A baseline report: the before picture.',num:{v:'3 weeks',l:'from commit to production, before',ph:1}},
      stabilise:{n:'Stabilise',when:'Weeks 2–4',iso:'shield',who:'Developers and DevOps',
        what:'Alerts and a rollback path first. Then the top crashes, with a freeze on risky changes until they are fixed.',
        get:'Fewer incidents and a product that stays up.',num:{v:'10',l:'top crashes fixed',ph:1}},
      essentials:{n:'Fix the essentials',when:'Weeks 3–8',iso:'pipe',who:'Developers and DevOps',
        what:'A CI/CD pipeline, tests on the critical paths, and dependency and security upgrades.',
        get:'Green builds and deploys nobody is afraid of.',num:{v:'40 → 8 min',l:'build time',ph:1}},
      ways:{n:'Ways of working',when:'Weeks 4–10',iso:'people',who:'A senior developer as coach, your team',
        what:'Code review rules, a definition of done, a sprint rhythm and retros. We coach your team through them in real sprints.',
        get:'A process your people keep after we leave.',num:{v:'3 days → 1',l:'to review a pull request',ph:1}},
      remeasure:{n:'Measure again',when:'Month 3',iso:'gauge',who:'Senior developer',
        what:'The same metrics as the baseline, measured the same way.',
        get:'A before and after report you can show your board.',num:{v:'4×',l:'more deploys than at baseline',ph:1}},
      match:{n:'Match',when:'Week 0–1',iso:'people',who:'You and our lead',
        what:'We propose engineers by skill and time zone, and you interview them.',
        get:'Profiles to review.',num:{v:'5 days',l:'to the first profiles',ph:1}},
      onboard:{n:'Onboard',when:'Week 1',iso:'desk',who:'Our engineers and your lead',
        what:'Access, a local setup and a first small ticket.',
        get:'A first merged pull request in week one.',num:{v:'day 3',l:'first pull request merged',ph:1}},
      monthly:{n:'Monthly review',when:'Every month',iso:'gauge',who:'You and our lead',
        what:'What went well, what to change and whether to scale up or down.',
        get:'Capacity that follows your roadmap.',num:{v:'1 month',l:'notice to scale',ph:1}}
    };
    var LINES=[
      {id:'new',name:'New product',col:C.coral,one:'You have an idea or a spec. We design it, build it and launch it.',
        stops:[['audit',0],['discovery',1],['design',3],['build',5],['launch',6],['handover',7]]},
      {id:'existing',name:'Existing product',col:C.teal,one:'Your product is live but struggles. We measure it, stabilise it and fix the basics, then build again.',
        stops:[['audit',0],['baseline',1],['stabilise',2],['essentials',3],['ways',4],['build',5],['remeasure',6],['handover',7]]},
      {id:'team',name:'Your team',col:C.sky,one:'Your team needs senior hands now. Our engineers join your sprints.',
        stops:[['audit',0],['match',1],['onboard',3],['build',5],['monthly',6],['handover',7]]}
    ];
    return {ST:ST,LINES:LINES};
  }

  // Isometric drill-down scenes for the metro map, in the workshop's visual language.
  // (x,y) is the centre of the platform's top face; at s=1 the scene fits about 190 x 130 px.
  // o.col accents the scene, o.appear (0..1) runs the entrance, o.still freezes motion, o.num labels a gauge.
  function metroIso(cx,kind,x,y,s,t,C,o){
    o=o||{};var col=o.col||C.amber,T=o.still?0:t,ap=o.appear==null?1:Math.max(0,Math.min(1,o.appear));
    function cl(v){return Math.max(0,Math.min(1,v));}
    function rgb(h){h=String(h);if(h.charAt(0)==='r')return h.replace(/[^\d,.]/g,'').split(',').map(Number);h=h.replace('#','');return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
    function mix(a,b,k){var A=rgb(a),B=rgb(b);return 'rgb('+Math.round(A[0]+(B[0]-A[0])*k)+','+Math.round(A[1]+(B[1]-A[1])*k)+','+Math.round(A[2]+(B[2]-A[2])*k)+')';}
    function al(h,a){var A=rgb(h);return 'rgba('+A[0]+','+A[1]+','+A[2]+','+a+')';}
    function I(u,v,z){return{x:u-v,y:(u+v)*.5-(z||0)};}
    function poly(ps){cx.beginPath();ps.forEach(function(p,i){if(i)cx.lineTo(p.x,p.y);else cx.moveTo(p.x,p.y);});cx.closePath();}
    // prism: centre (u,v), half extents hu,hv, base z, height hg. Faces shaded like the workshop's boxC.
    function prism(u,v,hu,hv,z,hg,c,top){var z1=z+hg;
      cx.fillStyle=mix(c,C.navy,.35);poly([I(u-hu,v+hv,z1),I(u+hu,v+hv,z1),I(u+hu,v+hv,z),I(u-hu,v+hv,z)]);cx.fill();
      cx.fillStyle=mix(c,C.navy,.55);poly([I(u+hu,v-hv,z1),I(u+hu,v+hv,z1),I(u+hu,v+hv,z),I(u+hu,v-hv,z)]);cx.fill();
      cx.fillStyle=top||c;poly([I(u-hu,v-hv,z1),I(u+hu,v-hv,z1),I(u+hu,v+hv,z1),I(u-hu,v+hv,z1)]);cx.fill();}
    // a point on the left face plane (v fixed) or the right face plane (u fixed)
    function L(u,v,z){return I(u,v,z);}
    function rr(x0,y0,w,h,r){cx.beginPath();cx.moveTo(x0+r,y0);cx.arcTo(x0+w,y0,x0+w,y0+h,r);cx.arcTo(x0+w,y0+h,x0,y0+h,r);cx.arcTo(x0,y0+h,x0,y0,r);cx.arcTo(x0,y0,x0+w,y0,r);cx.closePath();}
    function line(a,b,c,w){cx.strokeStyle=c;cx.lineWidth=w||1;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();}
    var MONO='"JetBrains Mono", ui-monospace, Menlo, monospace',WHITE='#e9eef4',PAPER='#dfe6ee';
    var P={
      desk:function(){prism(0,0,22,14,0,20,mix(C.navy,C.sand,.42));
        prism(-12,-2,10,8,20,1.5,'#3a4a60');var a=I(-22,-10,21.5),b=I(-2,-10,21.5);
        cx.fillStyle='#2a3a52';poly([a,b,{x:b.x,y:b.y-15},{x:a.x,y:a.y-15}]);cx.fill();
        cx.fillStyle=al(col,.75);poly([{x:a.x+2,y:a.y-2},{x:b.x-2,y:b.y-2},{x:b.x-2,y:b.y-13},{x:a.x+2,y:a.y-13}]);cx.fill();
        cx.globalAlpha*=1;[[9,4,PAPER],[12,1,WHITE]].forEach(function(p){prism(p[0],p[1],7,9,20,.8,p[2]);});
        for(var i=0;i<4;i++)line(I(7,-5+i*3,21),I(17-(i==3?4:0),-5+i*3,21),'rgba(5,18,35,.45)',.8);},
      board:function(){var p0=I(-30,6,0),p1=I(14,6,0),z0=16,H=40;line(I(-26,6,0),I(-26,6,z0),C.muted,1.5);line(I(10,6,0),I(10,6,z0),C.muted,1.5);
        function Q(a,h){return{x:p0.x+(p1.x-p0.x)*a,y:p0.y+(p1.y-p0.y)*a-z0-h};}
        cx.fillStyle=WHITE;poly([Q(0,0),Q(1,0),Q(1,H),Q(0,H)]);cx.fill();cx.strokeStyle=C.muted;cx.lineWidth=1.5;cx.stroke();
        [[.08,24,C.amber],[.26,26,C.rose],[.08,8,col],[.44,22,C.teal],[.27,10,C.amber],[.62,27,col],[.62,9,C.lilac]].forEach(function(n){cx.fillStyle=n[2];poly([Q(n[0],n[1]),Q(n[0]+.14,n[1]),Q(n[0]+.14,n[1]+9),Q(n[0],n[1]+9)]);cx.fill();});
        cx.strokeStyle=C.coral;cx.lineWidth=1.2;cx.beginPath();var s0=Q(.8,30);cx.moveTo(s0.x,s0.y);for(var i=1;i<6;i++){var q=Q(.8+i*.03,30-(i%2?5:0)-i*2);cx.lineTo(q.x,q.y);}cx.stroke();
        prism(-6,-14,5,3,0,2,C.coral);},
      screens:function(){prism(-10,-4,5,5,0,10,'#3a4a60');var a=I(-34,-6,0),b=I(14,-6,0);
        function Q(k,h){return{x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k-12-h};}
        cx.fillStyle='#16263c';poly([Q(0,0),Q(1,0),Q(1,40),Q(0,40)]);cx.fill();cx.strokeStyle='#3a4a60';cx.lineWidth=2;cx.stroke();
        cx.fillStyle=al(col,.9);poly([Q(.05,32),Q(.95,32),Q(.95,36),Q(.05,36)]);cx.fill();
        [[.05,C.text],[.37,C.lilac],[.69,C.text]].forEach(function(c,i){cx.fillStyle=al(c[1],.55+.1*i);poly([Q(c[0],10),Q(c[0]+.26,10),Q(c[0]+.26,27),Q(c[0],27)]);cx.fill();});
        cx.fillStyle=al(C.text,.35);poly([Q(.05,4),Q(.6,4),Q(.6,7),Q(.05,7)]);cx.fill();
        var c0=I(26,-4,0),c1=I(26,14,0);function R(k,h){return{x:c0.x+(c1.x-c0.x)*k,y:c0.y+(c1.y-c0.y)*k-2-h};}
        cx.fillStyle='#16263c';poly([R(0,0),R(1,0),R(1,32),R(0,32)]);cx.fill();cx.strokeStyle='#3a4a60';cx.lineWidth=2;cx.stroke();
        cx.fillStyle=al(col,.85);poly([R(.12,22),R(.88,22),R(.88,28),R(.12,28)]);cx.fill();
        for(var i=0;i<3;i++){cx.fillStyle=al(C.text,.45);poly([R(.12,5+i*5.5),R(.88-(i==1?.3:0),5+i*5.5),R(.88-(i==1?.3:0),8.5+i*5.5),R(.12,5+i*5.5+3.5)]);cx.fill();}},
      rack:function(){prism(-4,-4,15,13,0,58,mix(C.navy,C.blue,.4));prism(24,-4,7,9,0,22,mix(C.navy,C.blue,.3));
        for(var r=0;r<6;r++){var z=6+r*8.5;line(L(-17,9,z+6.5),L(11,9,z+6.5),'rgba(5,18,35,.55)',1);
          for(var j=0;j<3;j++){var on=o.still?(r+j)%3!==0:Math.sin(T*(3+j)+r*1.7+j*2)>-.2,p=L(-13+j*4,9,z+3);cx.fillStyle=on?(j==2?col:(r%2?C.teal:C.mint)):'#2a3a52';cx.fillRect(p.x-1.2,p.y-1.2,2.4,2.4);}
          var g0=L(1,9,z+2),g1=L(9,9,z+2);line(g0,g1,'rgba(232,237,243,.18)',2);}
        cx.strokeStyle=al(col,.7);cx.lineWidth=1.4;var a=I(11,8,8),b=I(17,8,8);cx.beginPath();cx.moveTo(a.x,a.y);cx.quadraticCurveTo(a.x+4,a.y+10,b.x,b.y);cx.stroke();},
      rocket:function(){prism(0,0,16,16,0,5,'#56657a');var bob=Math.sin(T*3)*1.4,bx=0,by=-5+bob;
        prism(-22,-2,3,3,0,52,'#3a4a60');for(var i=1;i<6;i++)line(I(-19,-2,i*9),I(-6,-2,i*9-2),C.muted,1);
        var fl=o.still?.6:.5+.35*Math.sin(T*23)*Math.sin(T*17);var g=cx.createLinearGradient(0,by,0,by+20);g.addColorStop(0,al(C.amber,.8*fl));g.addColorStop(1,al(C.coral,0));
        cx.fillStyle=g;cx.beginPath();cx.moveTo(bx-6,by-2);cx.lineTo(bx+6,by-2);cx.lineTo(bx,by+16+fl*6);cx.closePath();cx.fill();
        cx.fillStyle=mix(C.navy,col,.75);[-1,1].forEach(function(d){cx.beginPath();cx.moveTo(bx+d*7,by-20);cx.lineTo(bx+d*13,by-2);cx.lineTo(bx+d*7,by-6);cx.closePath();cx.fill();});
        var gb=cx.createLinearGradient(bx-8,0,bx+8,0);gb.addColorStop(0,'#c9d3df');gb.addColorStop(.45,WHITE);gb.addColorStop(1,'#8d9aab');cx.fillStyle=gb;
        cx.beginPath();cx.moveTo(bx-8,by-6);cx.lineTo(bx-8,by-40);cx.quadraticCurveTo(bx,by-62,bx+8,by-40);cx.lineTo(bx+8,by-6);cx.closePath();cx.fill();
        cx.fillStyle=col;cx.beginPath();cx.moveTo(bx-6.5,by-46);cx.quadraticCurveTo(bx,by-62,bx+6.5,by-46);cx.closePath();cx.fill();
        cx.fillStyle='#16263c';cx.beginPath();cx.arc(bx,by-30,3.6,0,6.3);cx.fill();cx.strokeStyle=col;cx.lineWidth=1.2;cx.stroke();
        cx.fillStyle=mix(C.navy,col,.75);cx.fillRect(bx-1.2,by-14,2.4,9);},
      stairs:function(){var hs=[10,20,31,43];hs.forEach(function(h,i){prism(-27+i*15,i*2-3,7.5,10,0,h,mix('#56657a',col,.25+i/3*.75),mix('#7d8ba0',mix(col,'#ffffff',.25),.25+i/3*.75));});
        var pts=hs.map(function(h,i){return I(-27+i*15,i*2-3,h+10);}),k=o.still?1:(T*.5)%1.3;
        cx.strokeStyle=col;cx.lineWidth=2;cx.lineCap='round';cx.setLineDash([4,3]);cx.lineDashOffset=-T*14;cx.beginPath();pts.forEach(function(p,i){if(i)cx.lineTo(p.x,p.y);else cx.moveTo(p.x,p.y);});cx.stroke();cx.setLineDash([]);
        var e=pts[3],d=pts[2],an=Math.atan2(e.y-d.y,e.x-d.x);cx.fillStyle=col;cx.beginPath();cx.moveTo(e.x+Math.cos(an)*8,e.y+Math.sin(an)*8);cx.lineTo(e.x+Math.cos(an+2.4)*7,e.y+Math.sin(an+2.4)*7);cx.lineTo(e.x+Math.cos(an-2.4)*7,e.y+Math.sin(an-2.4)*7);cx.closePath();cx.fill();
        pts.forEach(function(p,i){cx.fillStyle=i===3?col:C.text;cx.globalAlpha=Math.min(cx.globalAlpha,1);cx.beginPath();cx.arc(p.x,p.y,2,0,6.3);cx.fill();});},
      key:function(){var c=mix(C.sand,C.navy,.3),h=22;prism(0,4,18,18,0,h,c,'#0d1d31');
        cx.fillStyle=mix(c,'#ffffff',.12);poly([I(-18,-14,h),I(18,-14,h),I(14,-24,h+12),I(-22,-24,h+12)]);cx.fill();
        cx.fillStyle=mix(c,C.navy,.2);poly([I(-18,-14,h),I(-18,22,h),I(-28,18,h+12),I(-28,-18,h+12)]);cx.fill();
        var b=Math.sin(T*2.2)*3,kx=2,ky=-h-40+b,r=cx.createRadialGradient(kx,ky,0,kx,ky,26);r.addColorStop(0,al(col,.35));r.addColorStop(1,al(col,0));cx.fillStyle=r;cx.beginPath();cx.arc(kx,ky,26,0,6.3);cx.fill();
        cx.save();cx.translate(kx,ky);cx.rotate(-.5+Math.sin(T*1.3)*.08);cx.strokeStyle=C.amber;cx.lineWidth=3.2;cx.beginPath();cx.arc(-10,0,6.5,0,6.3);cx.stroke();
        cx.beginPath();cx.moveTo(-3.5,0);cx.lineTo(16,0);cx.moveTo(12,0);cx.lineTo(12,5);cx.moveTo(7,0);cx.lineTo(7,4);cx.stroke();cx.restore();},
      stack:function(){for(var i=0;i<6;i++)prism(-6+(i%2)*1.5,-2-(i%3),16,20,i*3.2,2.6,i%2?PAPER:WHITE);
        for(var j=0;j<4;j++)line(I(-18,-14+j*5,19.8),I(4-(j==3?8:0),-14+j*5,19.8),'rgba(5,18,35,.4)',.8);
        var mx=20,my=-38;cx.strokeStyle='#56657a';cx.lineWidth=4;cx.lineCap='round';cx.beginPath();cx.moveTo(mx+8,my+8);cx.lineTo(mx+17,my+17);cx.stroke();
        cx.fillStyle='rgba(159,211,245,.25)';cx.beginPath();cx.arc(mx,my,11,0,6.3);cx.fill();cx.strokeStyle=C.text;cx.lineWidth=2.4;cx.stroke();
        var cy=-50+(o.still?0:Math.sin(T*2)*2);cx.fillStyle=C.teal;cx.beginPath();cx.arc(-24,cy,8,0,6.3);cx.fill();cx.strokeStyle=C.navy;cx.lineWidth=2;cx.beginPath();cx.moveTo(-28,cy);cx.lineTo(-25,cy+3);cx.lineTo(-20,cy-3);cx.stroke();},
      pipe:function(){prism(-10,8,30,8,0,9,'#3a4a60','#26364c');
        cx.save();poly([I(-40,0,9),I(20,0,9),I(20,16,9),I(-40,16,9)]);cx.clip();var off=(T*14)%8;for(var u=-44;u<24;u+=8)line(I(u+off,0,9),I(u+off,16,9),'rgba(232,237,243,.12)',1);cx.restore();
        var bc=[C.amber,col,C.sand];for(var i=0;i<3;i++){var uu=-34+((i*20+T*14)%54);prism(uu,8,5,5,9,9,bc[i]);}
        prism(30,8,10,12,0,34,mix(C.navy,col,.45));var g=L(25,20,20),ga=o.still?0:T*1.6;cx.save();cx.translate(g.x,g.y);cx.transform(1,-.5,0,1,0,0);cx.rotate(ga);cx.fillStyle=mix(col,'#ffffff',.2);
        cx.beginPath();for(var k=0;k<16;k++){var r=k%2?6.5:8.5,a0=k/16*6.283;cx.lineTo(Math.cos(a0)*r,Math.sin(a0)*r);}cx.closePath();cx.fill();cx.fillStyle=mix(C.navy,col,.45);cx.beginPath();cx.arc(0,0,2.6,0,6.3);cx.fill();cx.restore();},
      gauge:function(){prism(0,0,30,12,0,3,'#26364c');var hs=[16,24,20,40],cs=['#56657a',mix(C.blue,C.navy,.2),C.sand,col];
        hs.forEach(function(h,i){prism(-21+i*14,0,5,5,3,h*(o.still?1:cl(ap*1.4-.3-i*.08)||0)+0.01,cs[i]);});
        var pts=hs.map(function(h,i){return I(-21+i*14,0,h*(o.still?1:cl(ap*1.4-.3-i*.08))+14);});
        cx.strokeStyle=C.text;cx.lineWidth=1.4;cx.beginPath();pts.forEach(function(p,i){if(i)cx.lineTo(p.x,p.y);else cx.moveTo(p.x,p.y);});cx.stroke();
        pts.forEach(function(p,i){cx.fillStyle=i===3?col:C.text;cx.beginPath();cx.arc(p.x,p.y,i===3?3+(o.still?0:Math.sin(T*4)*.8):2,0,6.3);cx.fill();});
        if(o.num){var p=pts[3];cx.font='600 9.5px '+MONO;var w=cx.measureText(o.num).width+10;cx.fillStyle='rgba(6,16,30,.92)';rr(p.x-w/2,p.y-21,w,14,4);cx.fill();cx.strokeStyle=al(col,.8);cx.lineWidth=1;cx.stroke();
          cx.fillStyle=col;cx.textAlign='center';cx.fillText(o.num,p.x,p.y-11);}},
      shield:function(){prism(12,-10,13,12,0,44,mix(C.navy,C.blue,.6));for(var r=0;r<4;r++)line(L(-1,2,8+r*9),L(25,2,8+r*9),'rgba(5,18,35,.5)',1);
        var ph=o.still?.4:(T*.6)%1;cx.strokeStyle=al(col,.6*(1-ph));cx.lineWidth=2;cx.beginPath();cx.ellipse(-10,6,16+ph*22,8+ph*11,0,0,6.3);cx.stroke();
        cx.save();cx.translate(-12,-30);cx.transform(1,.5,0,1,0,0);
        cx.beginPath();cx.moveTo(0,-20);cx.quadraticCurveTo(10,-14,17,-15);cx.quadraticCurveTo(18,8,0,19);cx.quadraticCurveTo(-18,8,-17,-15);cx.quadraticCurveTo(-10,-14,0,-20);cx.closePath();
        cx.fillStyle=mix(C.navy,col,.6);cx.fill();cx.strokeStyle=mix(col,'#ffffff',.3);cx.lineWidth=2.4;cx.stroke();
        cx.strokeStyle=C.text;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(-11,0);cx.lineTo(-5,0);cx.lineTo(-2,-7);cx.lineTo(2,7);cx.lineTo(5,0);cx.lineTo(11,0);cx.stroke();cx.restore();},
      people:function(){function fig(u,v,c,bob){var p=I(u,v,0),b=bob?Math.sin(T*3+u)*1:0;cx.fillStyle=c;rr(p.x-6,p.y-24+b,12,20,6);cx.fill();cx.fillStyle=mix(c,C.navy,.35);cx.fillRect(p.x-6,p.y-10+b,12,6);
          cx.fillStyle='#f0d2b4';cx.beginPath();cx.arc(p.x,p.y-30+b,5.5,0,6.3);cx.fill();cx.fillStyle=mix(C.navy,c,.2);cx.beginPath();cx.arc(p.x,p.y-32+b,5.6,3.3,6.1);cx.fill();}
        fig(-14,-22,C.teal,1);fig(16,-20,col,1);
        var tp=I(0,0,14);cx.fillStyle=mix(C.navy,C.sand,.3);cx.beginPath();cx.ellipse(tp.x,tp.y+4,24,12,0,0,6.3);cx.fill();cx.fillRect(tp.x-24,tp.y,48,4);
        cx.fillStyle=mix(C.navy,C.sand,.5);cx.beginPath();cx.ellipse(tp.x,tp.y,24,12,0,0,6.3);cx.fill();cx.fillStyle='#3a4a60';cx.fillRect(tp.x-2,tp.y+14,4,12);
        cx.fillStyle=C.amber;poly([{x:tp.x-10,y:tp.y-2},{x:tp.x-2,y:tp.y-6},{x:tp.x+4,y:tp.y-3},{x:tp.x-4,y:tp.y+1}]);cx.fill();
        cx.fillStyle=al(col,.8);poly([{x:tp.x+6,y:tp.y+2},{x:tp.x+14,y:tp.y-2},{x:tp.x+18,y:tp.y},{x:tp.x+10,y:tp.y+4}]);cx.fill();
        fig(-2,22,C.coral,1);
        var bp=I(16,-20,0);cx.fillStyle='rgba(232,237,243,.92)';rr(bp.x+6,bp.y-56,26,14,7);cx.fill();cx.beginPath();cx.moveTo(bp.x+10,bp.y-43);cx.lineTo(bp.x+6,bp.y-38);cx.lineTo(bp.x+15,bp.y-43);cx.fill();
        for(var i=0;i<3;i++){cx.fillStyle=C.navy;cx.globalAlpha=Math.min(1,cx.globalAlpha)*(o.still?1:.4+.6*cl(Math.sin(T*4-i)));cx.beginPath();cx.arc(bp.x+13+i*6,bp.y-49,1.6,0,6.3);cx.fill();}}
    };
    var draw=P[kind]||P.desk;
    function eo(k){return 1-Math.pow(1-k,3);}
    function eb(k){var c1=1.6,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);}
    var pA=eo(cl(ap/.55)),rA=cl((ap-.3)/.7),rE=eb(rA),base=cx.globalAlpha;
    cx.save();cx.translate(x,y);cx.scale(s,s);
    // shadow and platform
    cx.globalAlpha=base*pA;cx.translate(0,(1-pA)*26);
    cx.fillStyle='rgba(0,0,0,.28)';cx.beginPath();cx.ellipse(0,26,92,30,0,0,6.3);cx.fill();
    prism(0,0,43,43,-10,10,mix(C.navy,col,.14),mix(C.bg,col,.16));
    cx.strokeStyle=al(col,.6);cx.lineWidth=1.3;poly([I(-43,-43,0),I(43,-43,0),I(43,43,0),I(-43,43,0)]);cx.stroke();
    cx.strokeStyle=al(col,.12);cx.lineWidth=1;for(var gi=-2;gi<=2;gi++){if(!gi)continue;line(I(gi*17,-43,0),I(gi*17,43,0),al(col,.1),1);line(I(-43,gi*17,0),I(43,gi*17,0),al(col,.1),1);}
    // prop: drops in with a small overshoot
    if(rA>0){cx.save();cx.globalAlpha=base*cl(rA*2.2);cx.translate(0,-(1-rE)*18);cx.scale(1.22,1.22);draw();cx.restore();}
    cx.restore();
  }

  // Metro map. Each line is a client journey, each station a step; shared steps are interchanges.
  // Hover a line or station for a label. Click a line to ride it, click a station for its drill-down,
  // which shows an isometric scene (metroIso, from iso.js) and the step's numbers.
  // Five hidden items: a closed ghost station, a bug on the tracks, Friday demo confetti,
  // a terminus past Handover and a night train (Konami code).
  // Needs metroData() from journeys.js; draws scenes with metroIso() when it exists.
  function procMetro(cv,opts){
    opts=opts||{};opts.total=5;
    var cx=cv.getContext('2d'),still=window.matchMedia('(prefers-reduced-motion: reduce)').matches,CAL=opts.cal||'https://cal.com/px-mihnea/talk';
    var C={bg:'#0b1a2e',navy:'#051223',text:'#e8edf3',muted:'#a7b3c2',coral:'#ea5a47',amber:'#f1b96a',teal:'#10c29e',blue:'#7fa6d9',red:'#ff5a4e',
           lilac:'#b9a3f0',mint:'#7fe0c4',sand:'#e8cfa0',sky:'#9fd3f5',rose:'#f29ab0',ph:'#ffd84d',panel:'rgba(6,16,30,.96)',hair:'rgba(255,255,255,.08)'};
    var HEAD='"Josefin Sans", sans-serif',BODY='"Lato", sans-serif',MONO='"JetBrains Mono", ui-monospace, Menlo, monospace';
    var D=metroData(C),ST=D.ST,LINES=D.LINES,NL=LINES.length,NC=1,HL=(NL-1)/2;LINES.forEach(function(l){l.stops.forEach(function(s){NC=Math.max(NC,s[1]+1);});});
    // stations: column, the lines that stop there, shared or not
    var STN={};
    LINES.forEach(function(l,li){l.stops.forEach(function(s){var o=STN[s[0]]||(STN[s[0]]={id:s[0],col:s[1],lines:[]});o.lines.push(li);});});
    Object.keys(STN).forEach(function(k){STN[k].shared=STN[k].lines.length>1;});
    var DAYS=['MON','TUE','WED','THU','FRI'],KON=['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
    var S={w:0,h:0,V:false,t:0,dt:0,mx:-999,my:-999,inside:false,ptr:'mouse',armed:null,touchT:null,hov:null,f:0,em:{},act:0,ctx:null,
           tip:{a:0,spec:null,ax:0,ay:0},day:2.3,ai:false,aiE:0,night:false,nE:0,idle:[],ride:null,hop:null,end:null,pin:null,ui:{legend:[]},
           bug:null,bugNext:9,bugGone:false,splat:null,conf:[],sp:[],toast:null,found:{},kon:0,stars:[],geo:null};
    for(var i0=0;i0<70;i0++)S.stars.push({x:Math.random(),y:Math.random(),r:.3+Math.random()*1.1,p:Math.random()*6.3});
    LINES.forEach(function(){S.idle.push({u:Math.random(),d:0,a:1,wait:0});});

    function lerp(a,b,k){return a+(b-a)*k;}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function rnd(a,b){return a+Math.random()*(b-a);}
    function ease(key,target,k){var v=S.em[key];v=v==null?target:lerp(v,target,k);S.em[key]=v;return v;}
    function rr(x,y,w,h,r){r=Math.min(r,w/2,h/2);cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();}
    function inR(r,x,y){return r&&x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;}
    function found(id,label){if(!S.found[id]){S.found[id]=1;if(opts.found)opts.found(id,label);}}
    function say(text,col){S.toast={text:text,col:col||C.text,life:5};}
    function open(){window.open(CAL,'_blank','noopener');}
    function wrap(text,maxW){var words=String(text).split(' '),out=[],ln='';
      words.forEach(function(wd){var t=ln?ln+' '+wd:wd;if(cx.measureText(t).width>maxW&&ln){out.push(ln);ln=wd;}else ln=t;});if(ln)out.push(ln);return out;}
    function weekday(){return Math.floor(S.day)%5;}
    function size(){var r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;S.w=r.width;S.h=r.height;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0);layout();}

    // Geometry. Columns run along the journey, lanes across it. Lines keep their own lane between
    // stations and squeeze together at an interchange. The same map runs left to right on desktop
    // and top to bottom on a phone.
    function layout(){
      var w=S.w,h=S.h,V=w<560,a0,a1,c,G,TB=V?6:7;S.V=V;
      if(V){G=Math.min(NL>4?27:34,(w*.5-30)/Math.max(1,NL-1));a0=176;a1=h-112;c=22+HL*G;}
      else{G=clamp((h-250)/Math.max(1,NL-1),34,NL>4?54:62);a0=84;a1=w-112;c=Math.max(150+HL*G,Math.min(h*.5,h-120-HL*G));}
      var sp=(a1-a0)/(NC-1);
      function P(col,v){return V?{x:c+v,y:a0+col*sp}:{x:a0+col*sp,y:c+v};}
      function lane(i){return (i-(NL-1)/2)*G;}
      function off(li,col){var st=null;LINES[li].stops.forEach(function(s){if(s[1]===col)st=STN[s[0]];});
        if(!st||!st.shared)return lane(li);var n=st.lines.length,k=st.lines.indexOf(li),m=0;st.lines.forEach(function(j){m+=lane(j);});return m/n+(k-(n-1)/2)*TB;}
      LINES.forEach(function(l,li){var c0=l.stops[0][1],c1=l.stops[l.stops.length-1][1],pts=[],at={};
        for(var col=c0;col<=c1;col++){var v=off(li,col);at[col]=pts.length;pts.push(P(col,v));
          if(col<c1){var v2=off(li,col+1),dv=Math.abs(v2-v);if(dv>.5){var dd=Math.min(dv,sp*.8)/sp/2;pts.push(P(col+.5-dd,v),P(col+.5+dd,v2));}}}
        var cum=[0];for(var j=1;j<pts.length;j++)cum.push(cum[j-1]+Math.hypot(pts[j].x-pts[j-1].x,pts[j].y-pts[j-1].y));
        l.pts=pts;l.cum=cum;l.len=cum[cum.length-1];l.st=l.stops.map(function(s){return{st:s[0],d:cum[at[s[1]]]};});});
      Object.keys(STN).forEach(function(k){var s=STN[k];
        if(!s.shared){var p=P(s.col,lane(s.lines[0]));s.x=p.x;s.y=p.y;s.r={x:p.x-9,y:p.y-9,w:18,h:18};s.top=V?p.x:p.y-9;return;}
        var vs=s.lines.map(function(li){return off(li,s.col);}),lo=Math.min.apply(null,vs)-6,hi=Math.max.apply(null,vs)+6,pa=P(s.col,lo),pb=P(s.col,hi);
        s.x=(pa.x+pb.x)/2;s.y=(pa.y+pb.y)/2;s.r=V?{x:pa.x,y:pa.y-7,w:pb.x-pa.x,h:14}:{x:pa.x-7,y:pa.y,w:14,h:pb.y-pa.y};s.top=V?pb.x:pa.y;});
      var rs=STN.stabilise,ho=STN.handover;
      S.geo={P:P,lane:lane,V:V,c:c,sp:sp,G:G,a1:a1,lx:c+HL*G+16,
        ghost:V?{x:rs.x+G*.5,y:rs.y+sp*.45}:{x:rs.x+sp*.42,y:rs.y+G*.5},
        term:V?{x:ho.x,y:ho.y+(ho.r.h/2)+30}:{x:ho.x+46,y:ho.y}};
      S.idle.forEach(function(t,i){t.d=t.u*LINES[i].len;});
      if(S.ride){var l=LINES[S.ride.li];S.ride.d=Math.min(S.ride.d,l.len);}
    }
    function posAt(l,d){var c=l.cum,p=l.pts,j=0;d=clamp(d,0,l.len);while(j<c.length-2&&c[j+1]<d)j++;
      var seg=c[j+1]-c[j]||1,k=(d-c[j])/seg,a=p[j],b=p[j+1]||a;return{x:lerp(a.x,b.x,k),y:lerp(a.y,b.y,k),ang:Math.atan2(b.y-a.y,b.x-a.x)};}
    function nearLine(l,mx,my){var best={d:1e9,x:0,y:0};
      for(var j=0;j<l.pts.length-1;j++){var a=l.pts[j],b=l.pts[j+1],dx=b.x-a.x,dy=b.y-a.y,q=dx*dx+dy*dy||1,t=clamp(((mx-a.x)*dx+(my-a.y)*dy)/q,0,1),x=a.x+t*dx,y=a.y+t*dy,d=Math.hypot(mx-x,my-y);
        if(d<best.d)best={d:d,x:x,y:y};}return best;}
    function stPos(st){return{x:STN[st].x,y:STN[st].y};}
    function ctxLine(st){var c=S.ctx;if(c!=null&&STN[st].lines.indexOf(c)>=0)return c;return STN[st].lines[0];}

    // Hit testing, against the last drawn frame. Higher priority wins; lines go by distance.
    function hits(mx,my){
      var g=S.geo,u=S.ui,best=null;if(!g)return null;
      function cand(o,score){if(!best||score>best.score){o.score=score;best=o;}}
      if(u.pin){if(inR(u.pin.btn,mx,my))cand({kind:'cardbtn',key:'pinbtn'},1000);else if(inR(u.pin.x,mx,my))cand({kind:'cardx',key:'pinx'},1000);else if(inR(u.pin.r,mx,my))cand({kind:'cardbody',key:'pin'},900);}
      if(u.end){if(inR(u.end.btn,mx,my))cand({kind:'cardbtn',key:'endbtn'},1000);else if(inR(u.end.x,mx,my))cand({kind:'endx',key:'endx'},1000);else if(inR(u.end.r,mx,my))cand({kind:'cardbody',key:'end'},900);}
      if(best)return best;
      if(inR(u.cta,mx,my))cand({kind:'cta',key:'cta'},800);
      if(inR(u.ai,mx,my))cand({kind:'ai',key:'ai',ax:u.ai.x+u.ai.w-18,ay:u.ai.y+u.ai.h},800);
      if(inR(u.day,mx,my))cand({kind:'day',key:'day',ax:u.day.x+20,ay:u.day.y+u.day.h},800);
      u.legend.forEach(function(it){if(inR(it.r,mx,my))cand({kind:'line',li:it.li,key:'line:'+it.li,ax:it.r.x+10,ay:it.r.y+it.r.h,legend:true},700);});
      if(S.bug){var bp=posAt(LINES[S.bug.li],S.bug.d),bd=Math.hypot(mx-bp.x,my-bp.y);if(bd<14)cand({kind:'bug',key:'bug',ax:bp.x,ay:bp.y-8},600-bd);}
      var gd=Math.hypot(mx-g.ghost.x,my-g.ghost.y);if(gd<12)cand({kind:'ghost',key:'ghost',ax:g.ghost.x,ay:g.ghost.y-8},500-gd);
      var td=Math.hypot(mx-g.term.x,my-g.term.y);if(td<12)cand({kind:'term',key:'term',ax:g.term.x,ay:g.term.y-8},500-td);
      Object.keys(STN).forEach(function(k){var s=STN[k],r=s.r;if(mx>=r.x-4&&mx<=r.x+r.w+4&&my>=r.y-4&&my<=r.y+r.h+4)cand({kind:'station',st:k,key:'st:'+k,ax:s.x,ay:(g.V?s.y:r.y)-4},450-Math.hypot(mx-s.x,my-s.y)*.01);});
      LINES.forEach(function(l,i){var n=nearLine(l,mx,my);if(n.d<8)cand({kind:'line',li:i,key:'line:'+i,ax:n.x,ay:n.y-6},100-n.d);});
      return best;
    }
    function hintFor(h){var tap=S.ptr!=='mouse'?'Tap again':'Click';
      if(!h)return '';if(h.kind==='line')return tap+' to ride this line';if(h.kind==='station')return tap+' to look inside';
      if(h.kind==='ghost')return tap+' to look closer';if(h.kind==='term')return tap+' to plan the trip';if(h.kind==='bug')return 'Click to fix it';
      if(h.kind==='ai')return 'Click to switch '+(S.ai?'off':'on');if(h.kind==='day')return 'Skip to Friday?';return '';}

    // Actions
    function startRide(li){var l=LINES[li];S.pin=null;S.end=null;S.act=li;S.ctx=li;
      if(still){S.ride={li:li,d:l.len,si:l.st.length,dwell:0,done:true};S.end={li:li,t:0};return;}
      S.ride={li:li,d:0,si:0,dwell:0,done:false};arrive();}
    function arrive(){var R=S.ride,l=LINES[R.li],s=l.st[R.si];if(!s)return;
      R.d=s.d;R.dwell=1.3;S.hop={li:R.li,st:s.st,t:0};
      if(s.st==='build'&&weekday()===4)friday();
      R.si++;if(R.si>=l.st.length){R.done=true;R.dwell=1.5;}}
    function friday(){var b=STN.build,cols=[C.coral,C.amber,C.teal,C.lilac,C.sky,C.rose,C.mint];
      for(var i=0;i<46;i++){var a=rnd(0,6.3),sp=rnd(60,190);S.conf.push({x:b.x,y:b.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-90,col:cols[i%cols.length],life:still?1:rnd(1.2,1.9),rot:rnd(0,6.3),vr:rnd(-8,8)});}
      if(still)S.conf.forEach(function(p){p.x+=p.vx*.35;p.y+=p.vy*.35+30;});
      say('Friday demo · build '+(3+Math.floor(S.day/5))+'.'+(1+Math.floor(Math.random()*9))+' shipped to staging',C.amber);found('friday','Friday demo');}
    function squash(){var b=S.bug;if(!b)return;var p=posAt(LINES[b.li],b.d);S.splat={x:p.x,y:p.y,t:0};S.bug=null;S.bugGone=true;S.bugNext=S.t+rnd(20,32);
      say('Bug fixed in 4 min · regression test added',C.teal);found('bug','Bug on the line');}
    function act(h){
      if(!h)return;var k=h.kind;
      if(k==='cardbtn'){open();S.pin=null;S.end=null;}
      else if(k==='cta'){open();}
      else if(k==='cardx'){S.pin=null;}
      else if(k==='endx'){S.end=null;}
      else if(k==='ai'){S.ai=!S.ai;say(S.ai?'AI in our workflow: faster reviews, tests and docs. People still review every line.':'AI off · the same engineers, a little slower',S.ai?C.lilac:C.muted);}
      else if(k==='day'){S.day=Math.floor(S.day/5)*5+4.02;friday();}
      else if(k==='line')startRide(h.li);
      else if(k==='station'){S.end=null;var li=ctxLine(h.st);S.act=li;S.pin={kind:'station',st:h.st,li:li,t:0};}
      else if(k==='ghost'){S.end=null;S.pin={kind:'ghost',t:0};found('ghost','Rewrite everything');}
      else if(k==='term'){found('terminus','Your team, on its own');say('Next stop: your call. Opening the booking page.',C.amber);open();}
      else if(k==='bug')squash();
      if(still)frame(0);
    }

    // Small cards: hover labels, hop cards, the ride end card and the ghost card.
    function card(ax,ay,sp,alpha){
      var W=Math.min(sp.w||252,S.w-24),iw=W-28,bl=[],gl=[],h=16;
      cx.font=sp.mono?'400 11px '+MONO:'400 12.5px '+BODY;if(sp.body)bl=wrap(sp.body,iw);
      cx.font='400 12px '+BODY;if(sp.get)gl=wrap(sp.get,iw);
      h+=16+(sp.sub?17:0)+bl.length*(sp.mono?15:17)+(gl.length?24+gl.length*16:0)+(sp.hint?18:0)+(sp.btn?42:0)+8;
      var x=ax+16,y=ay-h-10;if(x+W>S.w-8)x=ax-W-16;x=clamp(x,8,S.w-W-8);if(y<8)y=ay+18;y=clamp(y,8,S.h-h-8);
      cx.globalAlpha=alpha;cx.save();cx.shadowColor='rgba(0,0,0,.45)';cx.shadowBlur=24;cx.shadowOffsetY=8;cx.fillStyle=C.panel;rr(x,y,W,h,10);cx.fill();cx.restore();
      cx.globalAlpha=alpha;cx.strokeStyle=C.hair;cx.lineWidth=1;rr(x+.5,y+.5,W-1,h-1,10);cx.stroke();
      var yy=y+24;cx.textAlign='left';
      if(sp.col){cx.fillStyle=sp.col;cx.beginPath();cx.arc(x+18,yy-4,3.5,0,6.3);cx.fill();}
      cx.fillStyle=C.text;cx.font='700 13px '+HEAD;cx.fillText(sp.title,x+(sp.col?28:14),yy);
      var xr=null;if(sp.close){xr={x:x+W-30,y:y+6,w:24,h:24};cx.fillStyle=C.muted;cx.font='400 16px '+BODY;cx.textAlign='center';cx.fillText('×',x+W-18,y+23);cx.textAlign='left';}
      if(sp.sub){yy+=17;cx.fillStyle=C.amber;cx.font='500 11px '+MONO;cx.fillText(sp.sub,x+14,yy);}
      cx.fillStyle=sp.mono?C.text:C.muted;cx.font=sp.mono?'400 11px '+MONO:'400 12.5px '+BODY;
      bl.forEach(function(t){yy+=sp.mono?15:17;cx.fillText(t,x+14,yy);});
      if(gl.length){yy+=22;cx.fillStyle=C.muted;cx.font='600 9.5px '+HEAD;cx.fillText('YOU GET',x+14,yy);cx.fillStyle=C.text;cx.font='400 12px '+BODY;gl.forEach(function(t){yy+=16;cx.fillText(t,x+14,yy);});}
      if(sp.hint){yy+=18;cx.fillStyle=C.amber;cx.font='italic 400 11.5px '+BODY;cx.fillText(sp.hint,x+14,yy);}
      var br=null;if(sp.btn){yy+=14;br={x:x+14,y:yy,w:iw,h:30};cx.fillStyle=C.amber;rr(br.x,br.y,br.w,br.h,6);cx.fill();
        cx.fillStyle=C.navy;cx.font='700 12.5px '+HEAD;cx.textAlign='center';cx.fillText(sp.btn,br.x+br.w/2,br.y+19);cx.textAlign='left';}
      cx.globalAlpha=1;return{r:{x:x,y:y,w:W,h:h},btn:br,x:xr};
    }

    // Station drill-down: an isometric scene on top, then who, what, what you get and one number.
    // Numbers still to confirm are drawn in yellow with a dashed frame.
    function drill(st,li,t,alpha){
      var s=ST[st],stn=STN[st],l=LINES[li],w=S.w,h=S.h,V=S.V,W=Math.min(V?w-24:340,w-24),iw=W-28,ISO=V?118:132;
      var what=(s.by&&s.by[l.id])||s.what;
      cx.font='400 12.5px '+BODY;var wl=wrap(what,iw);cx.font='400 12px '+BODY;var gl=wrap(s.get,iw),ol=wrap(s.who,iw-44);
      var others=stn.lines.filter(function(j){return j!==li;}),chips=others.length?wrap('Also on '+others.map(function(j){return LINES[j].name;}).join(', '),iw-10):[];
      cx.font='400 11.5px '+BODY;var nl=wrap(s.num.l,iw-112);
      var ph=10+ISO+22+16+(chips.length?chips.length*15+4:0)+10+ol.length*16+6+wl.length*17+22+gl.length*16+14+Math.max(46,nl.length*14+18)+(s.num.ph?16:0)+12+30+14;
      var p=stPos(st),x,y;
      if(V){x=12;y=clamp(p.y-ph-24,8,h-ph-8);if(p.y-ph-24<8)y=clamp(p.y+24,8,h-ph-8);}
      else{x=p.x+30;if(x+W>w-8)x=p.x-W-30;x=clamp(x,8,w-W-8);y=clamp(p.y-ph*.45,8,h-ph-8);}
      cx.globalAlpha=alpha;cx.save();cx.shadowColor='rgba(0,0,0,.5)';cx.shadowBlur=28;cx.shadowOffsetY=10;cx.fillStyle=C.panel;rr(x,y,W,ph,12);cx.fill();cx.restore();
      cx.globalAlpha=alpha;cx.strokeStyle=C.hair;cx.lineWidth=1;rr(x+.5,y+.5,W-1,ph-1,12);cx.stroke();
      // scene backdrop: a soft glow in the line colour
      cx.save();rr(x+6,y+6,W-12,ISO+4,9);cx.clip();var gr=cx.createRadialGradient(x+W/2,y+ISO*.7,4,x+W/2,y+ISO*.7,W*.6);
      gr.addColorStop(0,l.col);gr.addColorStop(1,'rgba(0,0,0,0)');cx.globalAlpha=alpha*.16;cx.fillStyle=gr;cx.fillRect(x,y,W,ISO+10);cx.restore();
      var ap=still?1:clamp(t/.7,0,1);cx.globalAlpha=alpha;
      if(typeof metroIso==='function')metroIso(cx,s.iso,x+W/2,y+10+ISO*.66,ISO/150,S.t,C,{col:l.col,appear:ap,still:still,num:s.num.v});
      cx.globalAlpha=alpha;var yy=y+10+ISO+22;cx.textAlign='left';
      cx.fillStyle=l.col;cx.beginPath();cx.arc(x+18,yy-5,4,0,6.3);cx.fill();
      cx.fillStyle=C.text;cx.font='700 15px '+HEAD;cx.fillText(s.n,x+30,yy);
      var xr={x:x+W-32,y:y+6,w:26,h:26};cx.fillStyle=C.muted;cx.font='400 18px '+BODY;cx.textAlign='center';cx.fillText('×',x+W-19,y+24);cx.textAlign='left';
      yy+=16;cx.fillStyle=C.amber;cx.font='500 11px '+MONO;cx.fillText(s.when+' · '+l.name,x+14,yy);
      if(chips.length){yy+=4;cx.fillStyle=C.muted;cx.font='italic 400 11px '+BODY;chips.forEach(function(c){yy+=15;cx.fillText(c,x+14,yy);});}
      yy+=10;cx.font='600 9.5px '+HEAD;cx.fillStyle=C.muted;cx.fillText('WHO',x+14,yy+12);cx.font='400 12px '+BODY;cx.fillStyle=C.text;
      ol.forEach(function(t,i){cx.fillText(t,x+58,yy+12+i*16);});yy+=ol.length*16+6;
      cx.fillStyle=C.muted;cx.font='400 12.5px '+BODY;wl.forEach(function(t){yy+=17;cx.fillText(t,x+14,yy);});
      yy+=22;cx.fillStyle=C.muted;cx.font='600 9.5px '+HEAD;cx.fillText('YOU GET',x+14,yy);cx.fillStyle=C.text;cx.font='400 12px '+BODY;gl.forEach(function(t){yy+=16;cx.fillText(t,x+14,yy);});
      // the number
      yy+=14;var bh=Math.max(46,nl.length*14+18),nc=s.num.ph?C.ph:l.col;
      cx.fillStyle='rgba(255,255,255,.04)';rr(x+14,yy,iw,bh,8);cx.fill();
      if(s.num.ph){cx.setLineDash([4,3]);cx.strokeStyle=C.ph;cx.globalAlpha=alpha*.7;}else{cx.strokeStyle=C.hair;}
      cx.lineWidth=1;rr(x+14.5,yy+.5,iw-1,bh-1,8);cx.stroke();cx.setLineDash([]);cx.globalAlpha=alpha;
      cx.fillStyle=nc;cx.font='700 19px '+HEAD;var nv=s.num.v,nw=Math.min(96,cx.measureText(nv).width);cx.fillText(nv,x+26,yy+bh/2+7,96);
      cx.fillStyle=s.num.ph?C.ph:C.muted;cx.font='400 11.5px '+BODY;nl.forEach(function(t,i){cx.fillText(t,x+26+Math.max(nw,40)+14,yy+bh/2+4-(nl.length-1)*7+i*14);});
      yy+=bh;if(s.num.ph){yy+=14;cx.fillStyle=C.ph;cx.font='italic 400 10.5px '+BODY;cx.fillText('Placeholder number, to replace with one from a real project',x+14,yy);}
      yy+=12;var br={x:x+14,y:yy,w:iw,h:30};cx.fillStyle=C.amber;rr(br.x,br.y,br.w,br.h,6);cx.fill();
      cx.fillStyle=C.navy;cx.font='700 12.5px '+HEAD;cx.textAlign='center';cx.fillText('Start with a free audit →',br.x+br.w/2,br.y+19);cx.textAlign='left';
      cx.globalAlpha=1;return{r:{x:x,y:y,w:W,h:ph},btn:br,x:xr};
    }

    function drawTrain(p,col,len,wd,a,big){
      cx.save();cx.translate(p.x,p.y);cx.rotate(p.ang);cx.globalAlpha=a;
      if(S.nE>.02){cx.globalAlpha=a*.22*S.nE;cx.fillStyle='#fff3d6';cx.beginPath();cx.moveTo(len/2,-wd/2);cx.lineTo(len/2+30,-wd*1.6);cx.lineTo(len/2+30,wd*1.6);cx.lineTo(len/2,wd/2);cx.closePath();cx.fill();cx.globalAlpha=a;}
      if(big){cx.globalAlpha=a*.25;cx.fillStyle=col;rr(-len/2-4,-wd/2-4,len+8,wd+8,6);cx.fill();cx.globalAlpha=a;}
      cx.fillStyle=col;rr(-len/2,-wd/2,len,wd,3);cx.fill();
      cx.fillStyle=S.nE>.5?'#fff3d6':C.navy;cx.globalAlpha=a*(big?.9:.7);cx.fillRect(len/2-4.5,-wd/2+1.5,2.5,wd-3);
      if(big){cx.globalAlpha=a;cx.strokeStyle='#ffffff';cx.lineWidth=1.3;rr(-len/2,-wd/2,len,wd,3);cx.stroke();}
      cx.restore();
    }
    function drawBug(p,t){
      cx.save();cx.translate(p.x,p.y);cx.rotate(p.ang);cx.strokeStyle=C.red;cx.lineWidth=1.1;
      for(var i=-1;i<=1;i++){var sw=Math.sin(t*14+i*2)*1.6;cx.beginPath();cx.moveTo(i*2.5,-2);cx.lineTo(i*2.5+sw,-6);cx.moveTo(i*2.5,2);cx.lineTo(i*2.5-sw,6);cx.stroke();}
      cx.fillStyle=C.red;cx.beginPath();cx.ellipse(0,0,5,3.4,0,0,6.3);cx.fill();
      cx.beginPath();cx.arc(5.5,0,2,0,6.3);cx.fill();cx.fillStyle=C.navy;cx.fillRect(-.4,-3.4,.8,6.8);
      cx.restore();
    }
    function path(l){cx.beginPath();l.pts.forEach(function(p,j){if(j)cx.lineTo(p.x,p.y);else cx.moveTo(p.x,p.y);});}

    function frame(dt){
      S.dt=dt;S.t+=dt;if(!S.geo)return;var w=S.w,h=S.h,g=S.geo,V=g.V,k=still?1:Math.min(1,dt*10);
      if(!still)S.day+=dt/1.8;
      S.aiE=still?(S.ai?1:0):lerp(S.aiE,S.ai?1:0,Math.min(1,dt*4));S.nE=still?(S.night?1:0):lerp(S.nE,S.night?1:0,Math.min(1,dt*3));
      var spd=1+.3*S.aiE;
      // bug: appears now and then, crawls along a track and stops trains behind it
      if(still){if(!S.bugGone&&!S.bug)S.bug={li:2,d:LINES[2].len*.62,t:0,life:1e9};}
      else{if(!S.bug&&S.t>=S.bugNext){var li=(Math.random()*NL)|0;S.bug={li:li,d:LINES[li].len*rnd(.42,.72),t:0,life:24};}
        if(S.bug){var b=S.bug;b.t+=dt;b.d+=dt*5;if(b.t>b.life||b.d>LINES[b.li].len-8){S.bug=null;S.bugNext=S.t+rnd(16,26);}}}
      function blocked(li,d){var b=S.bug;return b&&b.li===li&&b.d>d&&b.d-d<22;}

      // hover
      var hov=S.inside?hits(S.mx,S.my):null;S.hov=hov;
      var tipKinds={line:1,station:1,ghost:1,term:1,bug:1,ai:1,day:1};
      cv.style.cursor=hov&&hov.kind!=='cardbody'?'pointer':'default';
      var hl=hov&&hov.kind==='line'?hov.li:-1,hs=hov&&hov.kind==='station'?hov.st:null;
      if(hl>=0){S.ctx=hl;if(V)S.act=hl;}
      function lineOn(i){if(hl>=0)return i===hl;if(hs)return STN[hs].lines.indexOf(i)>=0;if(S.pin&&S.pin.kind==='station')return STN[S.pin.st].lines.indexOf(i)>=0;
        if(S.ride&&!S.ride.done)return i===S.ride.li;return V?i===S.act:true;}

      // background
      cx.fillStyle=C.bg;cx.fillRect(0,0,w,h);
      if(S.nE>.01){cx.globalAlpha=.55*S.nE;cx.fillStyle='#02060d';cx.fillRect(0,0,w,h);
        S.stars.forEach(function(s){cx.globalAlpha=S.nE*(.35+.3*Math.sin(S.t*1.3+s.p));cx.fillStyle='#ffffff';cx.beginPath();cx.arc(s.x*w,s.y*h,s.r,0,6.3);cx.fill();});cx.globalAlpha=1;}

      // header: week clock, hint, AI switch
      cx.textAlign='left';cx.fillStyle=C.amber;cx.font='500 11px '+MONO;
      var wk=3+Math.floor(S.day/5),dayTxt='WEEK '+(wk<10?' ':'')+wk+' · '+DAYS[weekday()];cx.fillText(dayTxt,20,28);
      var dw=cx.measureText('WEEK 99 · WED').width;S.ui.day={x:14,y:14,w:dw+12,h:20};
      var eDay=ease('day',hov&&hov.kind==='day'?1:0,k);if(eDay>.02){cx.globalAlpha=eDay;cx.fillRect(20,32,dw*eDay,1);cx.globalAlpha=1;}
      cx.fillStyle=C.muted;cx.font='400 12px '+BODY;cx.fillText(V?'Tap a line to ride it, a station to look inside.':'Three routes, one per starting point. Click a line to ride it, a station to look inside.',20,47);
      var tw2=36,th=20,tx2=w-20-tw2,ty2=16;cx.font='600 12px '+HEAD;var alw=cx.measureText('AI in our workflow').width;
      S.ui.ai={x:tx2-alw-12,y:ty2-4,w:alw+12+tw2+4,h:th+8};
      var eAi=ease('ai',hov&&hov.kind==='ai'?1:0,k);
      cx.textAlign='right';cx.fillStyle=S.ai?C.lilac:C.text;cx.fillText('AI in our workflow',tx2-10,ty2+14);
      cx.globalAlpha=.9;cx.fillStyle=S.aiE>.5?'rgba(185,163,240,.35)':'rgba(255,255,255,.12)';rr(tx2,ty2,tw2,th,10);cx.fill();
      cx.strokeStyle=eAi>.02?C.lilac:C.hair;cx.lineWidth=1;rr(tx2+.5,ty2+.5,tw2-1,th-1,10);cx.stroke();
      cx.globalAlpha=1;cx.fillStyle=S.aiE>.5?C.lilac:C.muted;cx.beginPath();cx.arc(tx2+10+S.aiE*16,ty2+10,7,0,6.3);cx.fill();
      if(S.aiE>.02&&!V){cx.globalAlpha=S.aiE;cx.fillStyle=C.lilac;cx.font='400 11.5px '+BODY;cx.fillText('Faster reviews, tests and docs',w-20,ty2+36);cx.globalAlpha=1;}

      // legend: the six journeys
      S.ui.legend=[];cx.textAlign='left';
      LINES.forEach(function(l,li){var cols=V?2:3,col=li%cols,row=Math.floor(li/cols),cw=(w-40)/cols,x=20+col*cw,y=(V?74:72)+row*18,on=ease('lg:'+li,lineOn(li)?1:0,k),em=ease('lh:'+li,hl===li||(V&&S.act===li)?1:0,k);
        cx.globalAlpha=lerp(.45,1,on);cx.strokeStyle=l.col;cx.lineWidth=3+em;cx.lineCap='round';cx.beginPath();cx.moveTo(x,y-4);cx.lineTo(x+14,y-4);cx.stroke();
        cx.fillStyle=em>.5?C.text:C.muted;cx.font=(em>.5?'700 ':'400 ')+'11.5px '+BODY;cx.fillText(l.name,x+20,y);
        S.ui.legend.push({li:li,r:{x:x-4,y:y-13,w:Math.min(cw-6,cx.measureText(l.name).width+28),h:17}});});
      cx.globalAlpha=1;

      // ghost spur (dashed, grey) off Stabilise, and the terminus past Handover
      var rs=STN.stabilise,ho=STN.handover,eG=ease('ghost',hov&&hov.kind==='ghost'?1:0,k),eT=ease('term',hov&&hov.kind==='term'?1:0,k);
      cx.setLineDash([3,5]);cx.lineWidth=3;cx.lineCap='round';cx.globalAlpha=.35+.35*eG;cx.strokeStyle=C.muted;cx.beginPath();cx.moveTo(rs.x,rs.y);cx.lineTo(g.ghost.x,g.ghost.y);cx.stroke();
      cx.globalAlpha=.22+.5*eT;cx.strokeStyle=C.coral;cx.beginPath();cx.moveTo(ho.x,ho.y);cx.lineTo(g.term.x,g.term.y);cx.stroke();cx.setLineDash([]);
      // lines
      LINES.forEach(function(l,i){var on=ease('ln:'+i,lineOn(i)?1:0,k),em=ease('lnh:'+i,hl===i?1:0,k);
        cx.lineJoin='round';cx.lineCap='round';
        if(em>.02){cx.globalAlpha=.18*em;cx.strokeStyle=l.col;cx.lineWidth=14;path(l);cx.stroke();}
        cx.globalAlpha=lerp(.3,1,on);cx.strokeStyle=l.col;cx.lineWidth=4.5+em*1.2;path(l);cx.stroke();});
      cx.globalAlpha=1;
      // stations: interchanges are white pills across the lines, single stops are rings
      Object.keys(STN).forEach(function(id){var s=STN[id],r=s.r,on=s.lines.some(lineOn),em=ease('st:'+id,hs===id||(S.pin&&S.pin.st===id)?1:0,k),a=lerp(.4,1,ease('sa:'+id,on?1:0,k));
        cx.globalAlpha=a;
        if(s.shared){cx.fillStyle=C.text;rr(r.x,r.y,r.w,r.h,7);cx.fill();cx.strokeStyle=em>.02?C.amber:C.navy;cx.lineWidth=2+em;rr(r.x,r.y,r.w,r.h,7);cx.stroke();}
        else{var l=LINES[s.lines[0]];cx.fillStyle=C.text;cx.beginPath();cx.arc(s.x,s.y,5.5,0,6.3);cx.fill();cx.strokeStyle=em>.02?C.amber:l.col;cx.lineWidth=2.6;cx.beginPath();cx.arc(s.x,s.y,5.5+em,0,6.3);cx.stroke();}});
      // station names: all of them on desktop, the active line's on a phone
      if(!V){Object.keys(STN).forEach(function(id){var s=STN[id],on=s.lines.some(lineOn),em=S.em['st:'+id]||0;
          cx.globalAlpha=lerp(.45,1,ease('sl:'+id,on?1:0,k));cx.font=(s.shared?'700 11.5px ':'600 11px ')+HEAD;cx.textAlign='center';cx.fillStyle=em>.3?C.amber:C.text;
          var ln=wrap(ST[id].n,Math.max(70,g.sp-12)),by=s.top-(s.shared?8:7);
          ln.forEach(function(t,i){cx.fillText(t,s.x,by-(ln.length-1-i)*12);});});}
      else{var al=LINES[S.act],lx=g.lx;al.stops.forEach(function(st){var s=STN[st[0]],em=S.em['st:'+st[0]]||0;
          cx.globalAlpha=.5;cx.strokeStyle=al.col;cx.lineWidth=1;cx.setLineDash([1,3]);cx.beginPath();cx.moveTo(s.shared?s.r.x+s.r.w+3:s.x+9,s.y);cx.lineTo(lx-5,s.y);cx.stroke();cx.setLineDash([]);
          cx.globalAlpha=1;cx.textAlign='left';cx.fillStyle=em>.3?C.amber:C.text;cx.font='600 12px '+HEAD;cx.fillText(ST[st[0]].n,lx,s.y+1);
          cx.fillStyle=C.muted;cx.font='400 10px '+MONO;cx.fillText(ST[st[0]].when,lx,s.y+14);});}
      cx.globalAlpha=1;
      // ghost station and terminus
      cx.globalAlpha=.55+.45*eG;cx.setLineDash([2,3]);cx.strokeStyle=C.muted;cx.lineWidth=1.6;cx.beginPath();cx.arc(g.ghost.x,g.ghost.y,6,0,6.3);cx.stroke();cx.setLineDash([]);
      cx.fillStyle=C.muted;cx.font='italic 400 10.5px '+BODY;cx.textAlign='left';
      cx.fillText('Rewrite?',g.ghost.x+10,g.ghost.y+4);
      cx.globalAlpha=.3+.6*eT;cx.strokeStyle=C.coral;cx.lineWidth=1.6;cx.beginPath();cx.arc(g.term.x,g.term.y,5,0,6.3);cx.stroke();cx.globalAlpha=1;

      // idle trains: one per line, slow, looping
      var rideLi=S.ride?S.ride.li:-1;
      S.idle.forEach(function(t,i){var l=LINES[i];
        if(!still&&!blocked(i,t.d)){if(t.wait>0){t.wait-=dt;if(t.wait<=0){t.d=0;}}else{t.d+=dt*24*spd;if(t.d>=l.len){t.d=l.len;t.wait=1.2;}}}
        var target=i===rideLi?0:(t.wait>0?0:1);t.a=still?target:lerp(t.a,target,Math.min(1,dt*(target?3:6)));
        if(t.a>.02){var p=posAt(l,t.d);drawTrain(p,l.col,12,6.5,t.a*lerp(.45,1,ease('ln:'+i,lineOn(i)?1:0,0)),false);
          if(S.aiE>.3&&!still&&Math.random()<dt*10&&S.sp.length<160)S.sp.push({x:p.x+rnd(-3,3),y:p.y+rnd(-3,3),life:.7,col:i%2?'#ffffff':C.lilac});}});

      // the ride: a featured train with a card at every stop
      var R=S.ride;
      if(R&&!still){var lR=LINES[R.li];
        if(R.dwell>0){R.dwell-=dt*spd;if(R.dwell<=0&&R.done){S.end={li:R.li,t:0};S.ride=null;R=null;}}
        else if(!blocked(R.li,R.d)){var nx=lR.st[R.si];R.d+=dt*120*spd;if(nx&&R.d>=nx.d)arrive();}}
      if(R){var lr=LINES[R.li],pr=posAt(lr,R.d);drawTrain(pr,lr.col,18,9,1,true);
        if(S.aiE>.3&&!still&&S.sp.length<160)for(var q=0;q<2;q++)S.sp.push({x:pr.x+rnd(-4,4),y:pr.y+rnd(-4,4),life:.8,col:q?'#ffffff':C.lilac});}
      S.sp=S.sp.filter(function(p){p.life-=dt;if(p.life<=0)return false;cx.globalAlpha=clamp(p.life/.8,0,1)*.8*S.aiE;cx.fillStyle=p.col;cx.fillRect(p.x-1,p.y-1,2,2);return true;});
      cx.globalAlpha=1;
      // bug and splat
      if(S.bug){var bl=LINES[S.bug.li],bp=posAt(bl,S.bug.d),eB=ease('bug',hov&&hov.kind==='bug'?1:0,k);
        if(eB>.02){cx.globalAlpha=.3*eB;cx.strokeStyle=C.red;cx.lineWidth=1.2;cx.beginPath();cx.arc(bp.x,bp.y,11,0,6.3);cx.stroke();cx.globalAlpha=1;}
        drawBug(bp,still?0:S.t);}
      if(S.splat){var sp=S.splat;sp.t+=dt;var sa=still?1:clamp(1-sp.t/1.4,0,1);
        if(sa<=0&&!still)S.splat=null;else{cx.globalAlpha=sa;cx.strokeStyle=C.teal;cx.lineWidth=1.5;cx.beginPath();cx.arc(sp.x,sp.y,6+(1-sa)*14,0,6.3);cx.stroke();
          cx.fillStyle=C.teal;cx.font='700 12px '+HEAD;cx.textAlign='center';cx.fillText('✓',sp.x,sp.y+4);cx.globalAlpha=1;}}
      // confetti
      S.conf=S.conf.filter(function(p){if(!still){p.life-=dt;p.vy+=170*dt;p.vx*=1-dt*.6;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;}
        if(p.life<=0)return false;cx.save();cx.globalAlpha=clamp(p.life,0,1);cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillStyle=p.col;cx.fillRect(-3,-1.5,6,3);cx.restore();return true;});
      cx.globalAlpha=1;

      // hop card for the current stop: the step and its number
      if(S.hop){var H=S.hop;H.t+=dt;var hl2=LINES[H.li],hp=stPos(H.st),ha=still?0:clamp(Math.min(H.t/.2,(1.75-H.t)/.3),0,1),hs2=ST[H.st];
        if(H.t>1.75||still)S.hop=null;else if(ha>.01)card(hp.x,hp.y-10,{w:236,col:hl2.col,title:hs2.n,sub:hs2.when,body:hs2.num.v+' · '+hs2.num.l},ha);}

      // CTA, always on screen
      cx.font='700 13px '+HEAD;var ctaT='Start with a free audit →',cw2=cx.measureText(ctaT).width+30,ch=32;
      var ctx2=V?(w-cw2)/2:w-20-cw2,cty=h-16-ch,eC=ease('cta',hov&&hov.kind==='cta'?1:0,k);S.ui.cta={x:ctx2,y:cty,w:cw2,h:ch};
      cx.globalAlpha=1;cx.fillStyle=eC>.5?'#ffd79f':C.amber;rr(ctx2,cty-eC*1.5,cw2,ch,7);cx.fill();cx.fillStyle=C.navy;cx.textAlign='center';cx.fillText(ctaT,ctx2+cw2/2,cty+21-eC*1.5);

      // toast, bottom left on desktop and above the button on a phone
      if(S.toast){var T=S.toast;if(!still)T.life-=dt;if(T.life<=0)S.toast=null;else{cx.globalAlpha=clamp(T.life,0,1);cx.font='400 12px '+BODY;
        var lines=wrap(T.text,V?w-40:Math.max(160,w-cw2-70)),ty3=V?cty-14-(lines.length-1)*15:h-28-(lines.length-1)*15;cx.textAlign=V?'center':'left';
        lines.forEach(function(t,i){cx.fillStyle=C.text;cx.fillText(t,V?w/2:34,ty3+i*15);});
        if(!V){cx.fillStyle=T.col;cx.beginPath();cx.arc(24,ty3-4,3.5,0,6.3);cx.fill();}cx.globalAlpha=1;}}

      // the drill-down or ghost card, then the ride end card
      S.ui.pin=null;S.ui.end=null;
      if(S.pin){var pa=ease('pin',1,still?1:Math.min(1,dt*8));S.pin.t+=dt;
        if(S.pin.kind==='ghost')S.ui.pin=card(g.ghost.x,g.ghost.y-8,{title:'Rewrite everything',sub:'Station closed',body:'We fix code, we don’t throw it away. Rewrites restart the bugs you already paid to fix.',close:true,btn:'Start with a free audit →'},pa);
        else S.ui.pin=drill(S.pin.st,S.pin.li,S.pin.t,pa);}
      else S.em.pin=0;
      if(S.end){var E=S.end;E.t+=dt;var el=LINES[E.li],ls=el.st[el.st.length-1],ep=stPos(ls.st),names=el.st.map(function(s){return ST[s.st].n;});
        if(E.t>10&&!still&&!(hov&&(hov.key==='end'||hov.key==='endbtn')))S.end=null;
        else S.ui.end=card(ep.x,ep.y-8,{w:268,col:el.col,title:el.name,sub:'Ride complete · '+names.length+' stops',body:names.join(' → '),hint:'Click any station to look inside',close:true,btn:'Start with a free audit →'},clamp(E.t/.25,0,1)+(still?1:0));}

      // hover label
      var tipOn=hov&&tipKinds[hov.kind]&&!(S.pin&&hov.kind==='station'&&S.pin.st===hov.st);
      if(tipOn){var spc=null;
        if(hov.kind==='line'){var hl3=LINES[hov.li];spc={col:hl3.col,title:hl3.name,body:hl3.one,sub:hl3.stops.length+' stops',hint:hintFor(hov)};}
        else if(hov.kind==='station'){var s3=ST[hov.st],sl=STN[hov.st];spc={col:LINES[ctxLine(hov.st)].col,title:s3.n,sub:s3.when+(sl.shared?' · interchange, '+sl.lines.length+' lines':''),body:s3.get,hint:hintFor(hov)};}
        else if(hov.kind==='ghost')spc={title:'Rewrite everything',sub:'Closed',hint:hintFor(hov)};
        else if(hov.kind==='term')spc={col:C.coral,title:'Your team, on its own',body:'The stop after Handover. Your hires own the code and we are a call away.',hint:hintFor(hov)};
        else if(hov.kind==='bug')spc={col:C.red,title:'A bug on the line',body:'It holds up the train behind it.',hint:hintFor(hov)};
        else if(hov.kind==='ai')spc={col:C.lilac,title:'AI in our workflow',body:'Assistants draft tests, reviews and docs. People review every line before it merges.',hint:hintFor(hov)};
        else if(hov.kind==='day')spc={title:'Demo day is Friday',body:'Every week ends with a demo on staging.',hint:hintFor(hov)};
        if(S.tip.key!==hov.key){S.tip.key=hov.key;if(S.tip.a<.1){S.tip.ax=hov.ax;S.tip.ay=hov.ay;}}
        S.tip.spec=spc;S.tip.ax=still?hov.ax:lerp(S.tip.ax,hov.ax,Math.min(1,dt*18));S.tip.ay=still?hov.ay:lerp(S.tip.ay,hov.ay,Math.min(1,dt*18));}
      S.tip.a=still?(tipOn?1:0):lerp(S.tip.a,tipOn?1:0,Math.min(1,dt*(tipOn?12:8)));
      if(S.tip.a>.02&&S.tip.spec)card(S.tip.ax,S.tip.ay,S.tip.spec,S.tip.a);
      cx.globalAlpha=1;
    }

    var last=0,running=false,visible=true;
    function loop(now){var dt=Math.min(.05,(now-last)/1000||0);last=now;frame(dt);if(!still&&visible&&!document.hidden)requestAnimationFrame(loop);else running=false;}
    function start(){if(!running&&!still){running=true;last=performance.now();requestAnimationFrame(loop);}}
    function point(e){var r=cv.getBoundingClientRect();S.mx=e.clientX-r.left;S.my=e.clientY-r.top;S.inside=true;}
    var NOW={cardbtn:1,cardx:1,endx:1,cardbody:1,cta:1,ai:1,day:1,bug:1};
    cv.addEventListener('pointermove',function(e){S.ptr=e.pointerType||'mouse';point(e);if(still)frame(0);});
    cv.addEventListener('pointerdown',function(e){
      S.ptr=e.pointerType||'mouse';point(e);var h=hits(S.mx,S.my);
      // a click outside the open card closes it, then the click goes through
      if(S.pin&&!(h&&(h.key==='pin'||h.key==='pinbtn'||h.key==='pinx'))){S.pin=null;h=hits(S.mx,S.my);}
      if(S.end&&!(h&&(h.key==='end'||h.key==='endbtn'||h.key==='endx'))&&h&&h.kind!=='line')S.end=null;
      if(h&&h.kind==='line'&&S.ptr!=='mouse')S.act=h.li;
      if(S.ptr==='mouse'||(h&&NOW[h.kind])){act(h);S.armed=null;if(still)frame(0);return;}
      clearTimeout(S.touchT);S.touchT=setTimeout(function(){S.inside=false;S.armed=null;if(still)frame(0);},4000);
      if(h&&S.armed===h.key){act(h);S.armed=null;}else S.armed=h?h.key:null;
      if(still)frame(0);
    });
    cv.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){S.inside=false;if(still)frame(0);}});
    document.addEventListener('keydown',function(e){var key=String(e.key||'').toLowerCase();
      if(key==='escape'&&S.pin){S.pin=null;if(still)frame(0);return;}
      if(key===KON[S.kon]){S.kon++;if(S.kon===KON.length){S.kon=0;S.night=!S.night;
        if(S.night){found('konami','Night train');say('Night train. On-call covers launch weeks. The rest of the time we sleep, like you.',C.sky);}else say('Good morning. Day service resumes.',C.amber);
        start();if(still)frame(0);}}
      else S.kon=key===KON[0]?1:0;});
    new IntersectionObserver(function(en){visible=en[0].isIntersecting;if(visible)start();}).observe(cv);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)start();});
    window.addEventListener('resize',function(){size();frame(0);});
    cv._metro={S:S,LINES:LINES,STN:STN,ST:ST,posAt:posAt};
    size();frame(0);start();
  }
