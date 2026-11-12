// Fake-canvas test for metroIso. Usage: node process/test-iso.js process/iso.js
const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');
eval(src);
const C={bg:'#0b1a2e',navy:'#051223',text:'#e8edf3',muted:'#a7b3c2',coral:'#ea5a47',amber:'#f1b96a',teal:'#10c29e',blue:'#7fa6d9',red:'#ff5a4e',lilac:'#b9a3f0',mint:'#7fe0c4',sand:'#e8cfa0',sky:'#9fd3f5',rose:'#f29ab0',hair:'rgba(255,255,255,.08)'};
let depth=0,bad=0,calls=0;const grad={addColorStop(){}};
const cx=new Proxy({globalAlpha:1},{get:(t,k)=>{if(k==='save')return()=>{depth++;calls++;};if(k==='restore')return()=>{depth--;if(depth<0)bad++;};
  if(k==='measureText')return s=>({width:String(s).length*6});if(k==='createLinearGradient'||k==='createRadialGradient')return()=>grad;
  return k in t?t[k]:()=>{};},set:(t,k,v)=>{if(typeof v==='number'&&!isFinite(v))bad++;if(typeof v==='string'&&/NaN|undefined/.test(v))bad++;t[k]=v;return true;}});
const kinds=['desk','board','screens','rack','rocket','stairs','key','stack','pipe','gauge','shield','people','nope'];let n=0;
kinds.forEach(k=>[0,.2,.5,.8,1].forEach(a=>[false,true].forEach(st=>[0,1.7,33.3].forEach(t=>{
  metroIso(cx,k,100,80,a<.5?.8:1,t,C,{col:C.teal,appear:a,still:st,num:k==='gauge'?'40 → 8 min':undefined});n++;if(depth!==0){bad++;depth=0;}}))));
console.log(n+' draws, '+calls+' saves, problems='+bad);process.exit(bad?1:0);
