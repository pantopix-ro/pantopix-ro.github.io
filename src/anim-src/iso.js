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
