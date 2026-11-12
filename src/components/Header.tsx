'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Mark } from './Logo';

type Link = { label: string; href: string };

export default function Header({ nav, cal, calLabel }: { nav: Link[]; cal: string; calLabel: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="site">
      <div className="wrap">
        <Mark />
        <button className="menu-btn" type="button" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="main-nav" className={'main' + (open ? ' open' : '')} aria-label="Main">
          {nav.map((l) => (
            <a key={l.href} href={l.href} aria-current={path === l.href ? 'page' : undefined} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn primary cta-head" href={cal} target="_blank" rel="noopener">{calLabel} →</a>
      </div>
    </header>
  );
}
