'use client';
// GitHub Pages has no server, so the form composes an email to us in the visitor's own mail program.
// Swap the submit handler for a form service later without changing the markup.
import { FormEvent, useState } from 'react';

const AREAS = ['Product and UX', 'Codebase', 'Platform and backend', 'Cloud, DevOps and security', 'AI features', 'Accessibility'];

export default function AuditForm({ email, cal }: { email: string; cal: string }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const toggle = (a: string) => setPicked((p) => (p.includes(a) ? p.filter((x) => x !== a) : p.length < 2 ? [...p, a] : p));
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim(), mail = String(f.get('email') || '').trim(), company = String(f.get('company') || '').trim();
    if (!name || !mail || !company) { setMsg('Please fill in your name, work email and company.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { setMsg('That email address looks incomplete.'); return; }
    const body = [
      'Name: ' + name, 'Email: ' + mail, 'Company: ' + company, 'Role: ' + (f.get('role') || ''),
      'Areas: ' + (picked.join(', ') || 'not chosen yet'), '', 'Biggest problem right now:', String(f.get('problem') || ''),
    ].join('\n');
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Free audit request: ' + company) + '&body=' + encodeURIComponent(body);
    setMsg('Your email program should open with the request filled in. If nothing happens, write to ' + email + '.');
  }
  return (
    <form onSubmit={submit} noValidate>
      <div className="row2">
        <label>Name<input type="text" name="name" required autoComplete="name" /></label>
        <label>Work email<input type="email" name="email" required autoComplete="email" /></label>
      </div>
      <div className="row2">
        <label>Company<input type="text" name="company" required autoComplete="organization" /></label>
        <label>Your role<input type="text" name="role" autoComplete="organization-title" /></label>
      </div>
      <fieldset>
        <legend>What should we look at? Pick up to 2</legend>
        {AREAS.map((a) => (
          <label className="check" key={a}>
            <input type="checkbox" checked={picked.includes(a)} disabled={!picked.includes(a) && picked.length >= 2} onChange={() => toggle(a)} />
            {a}
          </label>
        ))}
      </fieldset>
      <label>What is the biggest problem right now?<textarea name="problem" /></label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn primary" type="submit">Request the audit →</button>
        <span className="or">or <a href={cal} target="_blank" rel="noopener">book a call directly</a></span>
      </div>
      <p className="form-msg" role="status">{msg}</p>
    </form>
  );
}
