import Anim from '@/components/Anim';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import { collection, json, site } from '@/lib/content';

export default function Home() {
  const s = site();
  const h = json('pages/home.json');
  const services = collection('services');
  const team = json('team/team.json').members as any[];
  return (
    <>
      <section className="hero dark glow">
        <span className="arc" style={{ width: 900, height: 900, right: -420, top: -160 }} aria-hidden="true" />
        <div className="wrap">
          <div>
            <span className="parent"><span className="flag" aria-hidden="true"><i /><i /><i /></span>{h.hero.parent}</span>
            <h1>{h.hero.title} <em>{h.hero.titleAccent}</em></h1>
            <p className="lede">{h.hero.lede}</p>
            <div className="ctas">
              <a className="btn primary" href={s.calendar} target="_blank" rel="noopener">{s.calendarLabel} →</a>
              <a className="btn outline" href="/audit/">Get the free audit</a>
            </div>
          </div>
          <figure className="graph" style={{ margin: 0 }}>
            <Anim kind="stream" label={h.hero.canvasLabel} />
          </figure>
          <dl className="facts" aria-label="Key facts">
            {h.hero.facts.map((f: any) => <div key={f.value}><dt>{f.value}</dt><dd>{f.label}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="services" aria-labelledby="svc-h" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <div className="sec-head center"><span className="eyebrow">{h.services.eyebrow}</span><h2 id="svc-h">{h.services.title}</h2><p>{h.services.intro}</p></div>
          <Services items={services} />
        </div>
      </section>

      <section className="dark" aria-labelledby="dl-h">
        <span className="arc" style={{ width: 1200, height: 1200, left: -700, top: 40 }} aria-hidden="true" />
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.rules.eyebrow}</span><h2 id="dl-h">{h.rules.title}</h2><p>{h.rules.intro}</p></div>
          <div className="deadlines" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
            {h.rules.items.map((r: any) => <div key={r.title}><time dateTime={r.date}>{r.when}</time><b>{r.title}</b><p>{r.text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="work" aria-labelledby="work-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.cases.eyebrow}</span><h2 id="work-h">{h.cases.title}</h2></div>
          <div className="cases">
            {h.cases.items.map((c: any) => (
              <article className="case" key={c.title}>
                <div className="metric">{c.metric}<small>{c.unit}</small></div>
                <h3>{c.title}</h3>
                <dl>
                  <dt>Built</dt><dd>{c.built}</dd>
                  {c.result && <><dt>Result</dt><dd>{c.result}</dd></>}
                  {c.stack && <><dt>Stack</dt><dd>{c.stack}</dd></>}
                </dl>
                <p className="by">{c.by}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="how" style={{ background: 'var(--paper)' }} aria-labelledby="how-h">
        <div className="wrap">
          <div>
            <div className="sec-head" style={{ marginBottom: 0 }}><span className="eyebrow">{h.how.eyebrow}</span><h2 id="how-h">{h.how.title}</h2><p>{h.how.intro}</p></div>
            <div className="pkgs">{h.how.packages.map((p: any) => <div className="pkg" key={p.name}><b>{p.name}</b><span>{p.text}</span></div>)}</div>
            <p style={{ marginTop: 28 }}><a className="btn primary" href="/process/">See the whole route →</a></p>
          </div>
          <div className="steps">
            {h.how.steps.map((st: any) => <div className="step" key={st.name}><h3>{st.name}</h3><small>{st.when}</small><p>{st.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="dark glow" aria-labelledby="prod-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.products.eyebrow}</span><h2 id="prod-h">{h.products.title}</h2></div>
          <div className="products">
            {h.products.items.map((p: any) => (
              <div className="prod" key={p.name} style={p.url ? undefined : { borderStyle: 'dashed' }}>
                <h3>{p.name}</h3><p>{p.text}</p>
                {p.url && <a href={p.url} target="_blank" rel="noopener">{p.linkLabel} →</a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="logos" aria-labelledby="logos-h">
        <div className="wrap">
          <div className="sec-head center" style={{ marginBottom: 0 }}><span className="eyebrow" id="logos-h">{h.group.eyebrow}</span><h2>{h.group.title}</h2><p>{h.group.text}</p></div>
        </div>
      </section>

      <section id="team" aria-labelledby="team-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.team.eyebrow}</span><h2 id="team-h">{h.team.title}</h2><p>{h.team.intro}</p></div>
          <div className="team">
            {team.map((m) => (
              <div className="person" key={m.name}>
                <img src={m.photo} alt={'Portrait of ' + m.name} width={147} height={147} loading="lazy" />
                <b>{m.name}</b>
                {m.role && <span>{m.role}</span>}
                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener">LinkedIn</a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact s={s} c={h.contact} />
    </>
  );
}
