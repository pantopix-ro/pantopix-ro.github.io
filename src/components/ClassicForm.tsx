'use client';
// Same fields as the Wix form. GitHub Pages has no server, so submit opens the visitor's mail program.
import { FormEvent, useState } from 'react';

const AREAS = ['Portal, App & UX', 'Cloud, DevOps & Security', 'AI & LLM Readiness', 'Data & Analytics'];

export default function ClassicForm({ email }: { email: string }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const toggle = (a: string) => setPicked((p) => (p.includes(a) ? p.filter((x) => x !== a) : p.length < 2 ? [...p, a] : p));
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim(), mail = String(f.get('email') || '').trim(), company = String(f.get('company') || '').trim();
    if (!name || !mail || !company || picked.length === 0) { setMsg('Please fill in your name, email, company and at least one area.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { setMsg('That email address looks incomplete.'); return; }
    const body = ['Name: ' + name, 'Email: ' + mail, 'Company: ' + company, 'Position: ' + (f.get('position') || ''),
      'Areas: ' + picked.join(', '), '', 'Biggest problem right now:', String(f.get('problem') || '')].join('\n');
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Free audit request: ' + company) + '&body=' + encodeURIComponent(body);
    setMsg('Your email program should open with the request filled in. If nothing happens, write to ' + email + '.');
  }
  return (
    <form className="wx-form" onSubmit={submit} noValidate>
      <h2>Book your free audit</h2>
      <label>Name *<input name="name" placeholder="Enter your full name" autoComplete="name" /></label>
      <label>Email *<input name="email" type="email" placeholder="Enter your email" autoComplete="email" /></label>
      <label>Company name *<input name="company" placeholder="Enter a company name" autoComplete="organization" /></label>
      <label>Position<input name="position" placeholder="Enter a position or job title" autoComplete="organization-title" /></label>
      <fieldset>
        <legend>Choose 2 areas *</legend>
        {AREAS.map((a) => (
          <label className="check" key={a}>
            <input type="checkbox" checked={picked.includes(a)} disabled={!picked.includes(a) && picked.length >= 2} onChange={() => toggle(a)} />{a}
          </label>
        ))}
      </fieldset>
      <label>What is the biggest problem right now?<textarea name="problem" /></label>
      <button type="submit">Submit</button>
      <p role="status">{msg}</p>
    </form>
  );
}
