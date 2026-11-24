import Anim from '@/components/Anim';
import EipStream from '@/components/EipStream';
import Contact from '@/components/Contact';
import { json, site } from '@/lib/content';

// Homepage, rebuilt 23 Nov 2026 from Strategy/What We Offer.md: three offers, what we build with, proof, the route, FAQ.
export default function Home() {
  const s = site();
  const h = json('pages/home.json');
  return (
    <>
      <section className="hero dark">
        <div className="wrap">
          <div className="hero-text" id="hero-text">
            <div className="hero-head">
              <span className="parent"><span className="flag" aria-hidden="true"><i /><i /><i /></span>{h.hero.parent}</span>
              <h1>{h.hero.title} <em>{h.hero.titleAccent}</em></h1>
            </div>
            <div className="hero-sub">
              <p className="lede">{h.hero.lede}</p>
              <div className="ctas">
                <a className="btn primary" href={s.calendar} target="_blank" rel="noopener">{s.calendarLabel} →</a>
                <a className="btn outline" href="#offers">See the three offers</a>
              </div>
            </div>
          </div>
          <figure className="graph">
            <EipStream avoidId="hero-text" bg="#051223" cal={s.calendar} />
          </figure>
          <dl className="facts" aria-label="Key facts">
            {h.hero.facts.map((f: any) => <div key={f.value}><dt>{f.value}</dt><dd>{f.label}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="offers" aria-labelledby="off-h" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.offers.eyebrow}</span><h2 id="off-h">{h.offers.title}</h2><p>{h.offers.intro}</p></div>
          <div className="offers">
            {h.offers.items.map((o: any) => (
              <article className="offer" data-line={o.id} key={o.id}>
                <h3>{o.name}</h3>
                <p className="situation">{o.situation}</p>
                <p>{o.text}</p>
                <dl>
                  <dt>You get</dt><dd>{o.get}</dd>
                  <dt>For</dt><dd>{o.who}</dd>
                </dl>
                <div className="offer-links">
                  <a className="btn primary" href="/audit/">Start with the free audit →</a>
                  <a href="#route">See the route</a>
                </div>
              </article>
            ))}
          </div>
          <div className="addons">
            <h3>{h.addons.title}</h3>
            {h.addons.items.map((a: any) => <div key={a.name}><b>{a.name}</b><span>{a.text}</span></div>)}
          </div>
        </div>
      </section>

      <section id="expertise" className="dark" aria-labelledby="exp-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.expertise.eyebrow}</span><h2 id="exp-h">{h.expertise.title}</h2><p>{h.expertise.intro}</p></div>
          <dl className="stack-grid">
            {h.expertise.groups.map((g: any) => <div key={g.name}><dt>{g.name}</dt><dd>{g.items}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="work" aria-labelledby="work-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.proof.eyebrow}</span><h2 id="work-h">{h.proof.title}</h2></div>
          <article className="own-product">
            <div>
              <h3>{h.proof.product.name}</h3>
              <p>{h.proof.product.text}</p>
              <a href={h.proof.product.url} target="_blank" rel="noopener">{h.proof.product.linkLabel} →</a>
            </div>
            <dl>
              {h.proof.product.numbers.map((n: any) => <div key={n.label}><dt>{n.value}</dt><dd>{n.label}</dd></div>)}
            </dl>
            <p className="source">{h.proof.product.source}</p>
          </article>
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

      <section id="route" style={{ background: 'var(--paper)' }} aria-labelledby="route-h">
        <div className="wrap metro-wrap">
          <div className="sec-head"><span className="eyebrow">{h.route.eyebrow}</span><h2 id="route-h">{h.route.title}</h2><p>{h.route.intro}</p></div>
          <div className="metro">
            <Anim kind="metro" label="A metro map with three lines: Product development, Stabilise and scale, and Team augmentation. They share the stations Free audit, Build and Handover. Hover or tap a line to read it, click it to ride it, click a station to see who works on it, what we do and what you get." />
          </div>
          <p className="hint">Yellow numbers are examples until we publish numbers from real projects. <a href="/process/">Packages and steps →</a></p>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-h">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{h.faq.eyebrow}</span><h2 id="faq-h">{h.faq.title}</h2></div>
          {/* answers are short, so they stay open: no click to read them */}
          <dl className="faq">
            {h.faq.items.map((f: any) => <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>)}
          </dl>
        </div>
      </section>

      <Contact s={s} c={h.contact} />
    </>
  );
}
