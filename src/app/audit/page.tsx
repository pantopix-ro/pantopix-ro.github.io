import Contact from '@/components/Contact';
import { json, site } from '@/lib/content';

export const metadata = { title: 'Free audit', description: 'Five working days, two areas of your choice, and a written report with the changes worth making first.' };

export default function Audit() {
  const a = json('pages/audit.json');
  const h = json('pages/home.json');
  return (
    <>
      <section className="page-hero dark glow">
        <div className="wrap">
          <span className="eyebrow">{a.eyebrow}</span>
          <h1 style={{ marginTop: 12 }}>{a.title}</h1>
          <p className="lede">{a.lede}</p>
          <div className="ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 30 }}>
            <a className="btn primary" href="#contact">Book your free audit →</a>
          </div>
        </div>
      </section>
      <section style={{ background: 'var(--paper)' }} aria-labelledby="get-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">What you get</span><h2 id="get-h">Four steps, one report</h2><p>{a.keep}</p></div>
          <div className="gets">{a.gets.map((g: any) => <div key={g.n}><b>{g.n}</b><p>{g.text}</p></div>)}</div>
        </div>
      </section>
      <section aria-labelledby="who-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">Is this for you?</span><h2 id="who-h">If two of these sound familiar, the audit pays off</h2></div>
          <ul className="prose" style={{ paddingLeft: 22 }}>{a.forWho.map((t: string) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>
      <section style={{ background: 'var(--paper)' }} aria-labelledby="areas-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">What we review</span><h2 id="areas-h">Pick two areas</h2></div>
          <div className="areas">{a.areas.map((r: any) => <div className="area" key={r.name}><h3>{r.name}</h3><p>{r.text}</p><p className="you"><b>You get:</b> {r.you}</p></div>)}</div>
        </div>
      </section>
      <section className="how" aria-labelledby="steps-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">How the audit works</span><h2 id="steps-h">About two weeks, two hours of your time</h2><p>{a.howText}</p></div>
          <div className="steps">{a.steps.map((st: any, i: number) => <div className="step" key={st.name}><h3>{i + 1}. {st.name}</h3><small>{st.time}</small><p>{st.text}</p></div>)}</div>
        </div>
      </section>
      <section className="dark" aria-labelledby="rep-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">The report</span><h2 id="rep-h">Specific findings, not a sales deck</h2><p>{a.reportText}</p></div>
          <div className="deadlines" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
            {a.report.map((t: string, i: number) => <div key={t}><time>{String(i + 1).padStart(2, '0')}</time><p style={{ color: 'var(--on-navy)' }}>{t}</p></div>)}
          </div>
        </div>
      </section>
      <Contact s={site()} c={h.contact} />
    </>
  );
}
