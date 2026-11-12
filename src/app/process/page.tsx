import Anim from '@/components/Anim';
import Contact from '@/components/Contact';
import { json, site } from '@/lib/content';

export const metadata = { title: 'How we work', description: 'Three routes, one per starting point: a new product, an existing product that struggles, or a team that needs senior engineers.' };

export default function Process() {
  const h = json('pages/home.json');
  return (
    <>
      <section className="page-hero dark glow">
        <div className="wrap">
          <span className="eyebrow">How we work</span>
          <h1 style={{ marginTop: 12 }}>Three routes. Pick the one you're on.</h1>
          <p className="lede">Every route starts with the free audit, runs through Build and ends with a handover to your own team. What happens in between depends on what you have today: an idea, a product that struggles, or a team that needs hands.</p>
        </div>
      </section>
      <section style={{ background: 'var(--paper)' }}>
        <div className="wrap metro-wrap">
          <div className="metro">
            <Anim kind="metro" label="A metro map with three lines: New product, Existing product and Your team. They share the stations Free audit, Build and Handover. Hover or tap a line to read it, click it to ride it, click a station to see who works on it, what we do and what you get." />
          </div>
          <p className="hint">Click a line and a train rides it. Click a station to look inside. Yellow numbers are examples until we publish numbers from real projects.</p>
        </div>
      </section>
      <section className="how" aria-labelledby="pk-h">
        <div className="wrap">
          <div>
            <div className="sec-head" style={{ marginBottom: 0 }}><span className="eyebrow">Ways to work with us</span><h2 id="pk-h">{h.how.title}</h2><p>{h.how.intro}</p></div>
            <div className="pkgs">{h.how.packages.map((p: any) => <div className="pkg" key={p.name}><b>{p.name}</b><span>{p.text}</span></div>)}</div>
          </div>
          <div className="steps">
            {h.how.steps.map((st: any) => <div className="step" key={st.name}><h3>{st.name}</h3><small>{st.when}</small><p>{st.text}</p></div>)}
          </div>
        </div>
      </section>
      <Contact s={site()} c={h.contact} />
    </>
  );
}
