import { doc } from '@/lib/content';

export const metadata = { title: 'Privacy policy' };

export default function Privacy() {
  const d = doc('pages', 'privacy');
  const updated = new Date(d.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <section>
      <div className="wrap">
        <div className="prose">
          <h1 style={{ fontSize: 'clamp(32px,4vw,44px)' }}>{d.title}</h1>
          <p style={{ color: 'var(--muted)' }}>Last updated {updated}</p>
          <div className="prose" dangerouslySetInnerHTML={{ __html: d.html }} />
        </div>
      </div>
    </section>
  );
}
