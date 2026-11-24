'use client';
// Mounts one of the hand-written canvas animations from /public/anim. They are plain ES5 scripts that
// define global functions, so they load once as classic scripts and run outside React.
import { useEffect, useRef } from 'react';

const loading: Record<string, Promise<void>> = {};
function load(src: string): Promise<void> {
  if (!loading[src]) {
    loading[src] = new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => ok();
      s.onerror = () => fail(new Error('could not load ' + src));
      document.head.appendChild(s);
    });
  }
  return loading[src];
}

type Kind = 'stream' | 'metro';

export default function Anim({ kind, label, className }: { kind: Kind; label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current as any;
    if (!cv || cv._started) return;
    cv._started = true;
    const w = window as any;
    const run = () => {
      if (kind === 'stream') w.eventStream(cv, null, {
        transparent: true,
        // on wide screens the hero text sits over the left of the canvas, so the diagram starts after it
        x0: (cw: number) => (cw > 900 ? 0.42 : 0),
      });
      else w.procMetro(cv, { cal: 'https://cal.com/px-mihnea/talk' });
    };
    // wait for the fonts, so canvas text measures with the real typefaces
    const fonts = (document as any).fonts?.ready ?? Promise.resolve();
    Promise.all([load('/anim/' + kind + '.js'), fonts]).then(run).catch((e) => console.error(e));
  }, [kind]);
  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}
