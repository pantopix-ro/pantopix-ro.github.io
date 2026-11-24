'use client';
// "Live event stream" v15 hero animation. public/eip/eip.js is plain ES5, loaded here as a classic script on the
// client only; eip.css is imported globally in layout.tsx. Both come unchanged from ~/work/pantopix/hero-eip/.
// The script sets its own ARIA on the canvas, so the canvas carries no role here.
import { useEffect, useRef } from 'react';
import { eipLabel } from './eipCopy';

const WIDE = '(min-width:1200px)';
// The query string busts the browser cache when eip.js changes. Update it with: shasum public/eip/eip.js | cut -c1-8
const EIP_SRC = '/eip/eip.js?v=27d0ca26';

export default function EipStream({ avoidId, bg, cal, stage, headBelow, simple }: { avoidId?: string; bg: string; cal: string; stage?: 1 | 2 | 3; headBelow?: boolean; simple?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current as any;
    if (!cv || cv._eipMounted) return; // strict mode runs effects twice; mount once
    cv._eipMounted = true;
    const w = window as any;
    const run = () => {
      const text = avoidId ? document.getElementById(avoidId) : null;
      w.eipStream(cv, { nav: 'inside', transparent: true, bg, calm: true, cal, headBelow, stage, noNote: simple, label: simple ? eipLabel : undefined, avoid: () => (matchMedia(WIDE).matches ? text : null) });
    };
    const start = () => (document.fonts?.ready ? document.fonts.ready.then(run) : run());
    if (w.eipStream) { start(); return; }
    let s = document.querySelector<HTMLScriptElement>('script[data-eip]');
    if (!s) { s = document.createElement('script'); s.src = EIP_SRC; s.dataset.eip = '1'; document.body.appendChild(s); }
    s.addEventListener('load', start, { once: true });
  }, [avoidId, bg, cal, stage, headBelow, simple]);
  return <canvas ref={ref} />;
}
