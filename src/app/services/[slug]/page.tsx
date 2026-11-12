import Contact from '@/components/Contact';
import Icon from '@/components/Icon';
import { collection, doc, json, site } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return collection('services').map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const d = doc('services', (await params).slug);
  return { title: d.title, description: d.summary };
}

export default async function Service({ params }: { params: Promise<{ slug: string }> }) {
  const d = doc('services', (await params).slug);
  return (
    <>
      <section className="page-hero dark glow">
        <div className="wrap">
          <a className="back" href="/services/">← All services</a>
          <h1 style={{ marginTop: 16 }}>{d.title}</h1>
          <p className="lede">{d.summary}</p>
          <p className="lede" style={{ fontSize: 15 }}><b>Stack:</b> {d.stack}</p>
        </div>
      </section>
      <section>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 24 }}>
          <div className="svc" style={{ boxShadow: 'none', padding: 0 }}><Icon name={d.icon} /></div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: d.html }} />
        </div>
      </section>
      <Contact s={site()} c={json('pages/home.json').contact} />
    </>
  );
}
