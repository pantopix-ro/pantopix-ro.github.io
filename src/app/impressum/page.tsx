import { site } from '@/lib/content';

export const metadata = { title: 'Impressum' };

export default function Impressum() {
  const s = site();
  const L = s.legal;
  return (
    <section>
      <div className="wrap prose">
        <h1 style={{ fontSize: 'clamp(32px,4vw,44px)' }}>Impressum</h1>
        <dl className="legal-dl">
          <dt>Company</dt><dd>{L.company}</dd>
          <dt>Registered office</dt><dd>{L.seat}</dd>
          <dt>Tax ID (CUI)</dt><dd>{L.cui}</dd>
          <dt>Trade register</dt><dd>{L.register}</dd>
          <dt>EUID</dt><dd>{L.euid}</dd>
          <dt>Incorporated</dt><dd>{L.incorporated}</dd>
          <dt>Email</dt><dd><a href={'mailto:' + s.email}>{s.email}</a></dd>
          <dt>Group</dt><dd>Part of the PANTOPIX group. <a href={s.group} target="_blank" rel="noopener">PANTOPIX GmbH &amp; Co. KG</a>, Germany.</dd>
        </dl>
      </div>
    </section>
  );
}
