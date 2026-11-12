import { Mark } from './Logo';

export default function Footer({ s }: { s: any }) {
  const L = s.legal;
  return (
    <footer>
      <div className="wrap">
        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <Mark />
          <p>{s.tagline}</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            <a href={'mailto:' + s.email}>{s.email}</a><br />
            <a href={s.calendar} target="_blank" rel="noopener">{s.calendarLabel}</a><br />
            {s.address}
          </p>
        </div>
        <div>
          <h4>Legal</h4>
          <p>{L.company}<br />CUI {L.cui}<br />Reg. Com. {L.register}<br />EUID {L.euid}</p>
        </div>
        <div>
          <h4>Group</h4>
          <p>
            <a href={s.group} target="_blank" rel="noopener">PANTOPIX GmbH &amp; Co. KG</a><br />
            <a href={s.linkedin} target="_blank" rel="noopener">LinkedIn</a><br />
            <a href="/privacy/">Privacy policy</a> · <a href="/impressum/">Impressum</a>
          </p>
        </div>
        <div className="legal"><span>© {new Date().getFullYear()} {L.company}</span><span>pantopix.ro</span></div>
      </div>
    </footer>
  );
}
