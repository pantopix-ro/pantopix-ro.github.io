import Services from '@/components/Services';
import Contact from '@/components/Contact';
import { collection, json, site } from '@/lib/content';

export const metadata = { title: 'Services' };

export default function ServicesPage() {
  const h = json('pages/home.json');
  return (
    <>
      <section className="page-hero dark glow">
        <div className="wrap">
          <span className="eyebrow">Services</span>
          <h1 style={{ marginTop: 12 }}>Software we build, run and staff</h1>
          <p className="lede">Seven services in three groups. Each one is part of an offer: Product development, Stabilise and scale, or Team augmentation.</p>
        </div>
      </section>
      <section style={{ background: 'var(--paper)' }}>
        <div className="wrap"><Services items={collection('services')} /></div>
      </section>
      <Contact s={site()} c={h.contact} />
    </>
  );
}
