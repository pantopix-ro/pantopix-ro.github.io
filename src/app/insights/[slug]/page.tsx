import { collection, doc } from '@/lib/content';

// Only published articles get a page. A draft shows on the list as "coming soon".
export const dynamicParams = false;
export function generateStaticParams() {
  const live = collection('insights').filter((p) => !p.draft && p.body);
  return live.length ? live.map((p) => ({ slug: p.slug })) : [{ slug: '_none' }];
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === '_none') return { title: 'Insights', robots: { index: false } };
  const d = doc('insights', slug);
  return { title: d.title, description: d.summary };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === '_none') return <section><div className="wrap"><a className="back" href="/insights/">← All insights</a></div></section>;
  const d = doc('insights', slug);
  return (
    <>
      <section className="page-hero dark glow">
        <div className="wrap">
          <a className="back" href="/insights/">← All insights</a>
          <p className="eyebrow" style={{ marginTop: 18 }}>{d.category}</p>
          <h1 style={{ marginTop: 10 }}>{d.title}</h1>
          <p className="lede">{d.author} · {d.readTime} min read</p>
        </div>
      </section>
      <section><div className="wrap"><article className="prose" dangerouslySetInnerHTML={{ __html: d.html }} /></div></section>
    </>
  );
}
