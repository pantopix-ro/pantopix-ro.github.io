import AuditForm from './AuditForm';

export default function Contact({ s, c }: { s: any; c: { eyebrow: string; title: string; text: string } }) {
  return (
    <section id="contact" className="audit" aria-labelledby="audit-h">
      <div className="wrap">
        <div>
          <span className="eyebrow">{c.eyebrow}</span>
          <div style={{ marginTop: 12 }}><h2 id="audit-h">{c.title}</h2></div>
          <p className="deliver">{c.text} <a href="/audit/" style={{ color: 'var(--coral)', fontWeight: 700 }}>What the audit covers →</a></p>
          <dl className="contact-list">
            <div><dt>Call</dt><dd><a href={s.calendar} target="_blank" rel="noopener">{s.calendar.replace('https://', '')}</a></dd></div>
            <div><dt>Email</dt><dd><a href={'mailto:' + s.email}>{s.email}</a></dd></div>
            <div><dt>Office</dt><dd>{s.address}</dd></div>
          </dl>
        </div>
        <AuditForm email={s.email} cal={s.calendar} />
      </div>
    </section>
  );
}
