import { collection } from '@/lib/content';

export const metadata = { title: 'Insights', description: 'Practical lessons from real projects in UX, cloud, platforms and AI, written by the people who built them.' };

export default function Insights() {
  const posts = collection('insights');
  return (
    <>
      <section className="page-hero dark glow">
        <div className="wrap">
          <span className="eyebrow">Insights</span>
          <h1 style={{ marginTop: 12 }}>Lessons from real projects</h1>
          <p className="lede">Practical notes on UX, platforms, cloud and AI, written by the people who built them.</p>
        </div>
      </section>
      <section style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <div className="posts">
            {posts.map((p) => {
              const inner = (
                <>
                  <span className="big" aria-hidden="true">{p.badge}</span>
                  <span className="tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <span className="meta">{p.author} · {p.readTime} min read{p.draft ? ' · coming soon' : ''}</span>
                </>
              );
              return p.draft
                ? <article className="post" key={p.slug}>{inner}</article>
                : <a className="post" key={p.slug} href={'/insights/' + p.slug + '/'}>{inner}</a>;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
