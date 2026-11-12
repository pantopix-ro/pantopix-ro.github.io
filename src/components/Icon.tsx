import type { ReactNode } from 'react';
const P: Record<string, ReactNode> = {
  product: <><rect x="6" y="9" width="36" height="24" rx="2" /><path d="M18 39h12M24 33v6M12 26l7-7 5 5 9-9" /><path d="M29 15h4v4" /></>,
  platform: <><rect x="6" y="6" width="14" height="10" rx="2" /><rect x="28" y="6" width="14" height="10" rx="2" /><rect x="17" y="32" width="14" height="10" rx="2" /><path d="M13 16v7h22v-7M24 23v9" /></>,
  ai: <><rect x="8" y="10" width="32" height="24" rx="4" /><path d="M16 40l4-6M32 40l-4-6" /><circle cx="18" cy="22" r="2.5" /><circle cx="30" cy="22" r="2.5" /><path d="M24 4v6M20 28h8" /></>,
  design: <><path d="M10 38l6-2 20-20-4-4-20 20z" /><path d="M28 12l4 4M8 8h12M8 14h6" /><circle cx="36" cy="36" r="4" /></>,
  cloud: <><path d="M14 30a8 8 0 0 1 1-15.9A11 11 0 0 1 36 16a7 7 0 0 1-1 14z" /><path d="M24 22v20M18 36l6 6 6-6" /></>,
  rescue: <><circle cx="24" cy="24" r="16" /><circle cx="24" cy="24" r="7" /><path d="M13 13l6 6M35 13l-6 6M13 35l6-6M35 35l-6-6" /></>,
  team: <><circle cx="16" cy="16" r="5" /><circle cx="32" cy="16" r="5" /><path d="M6 38c0-6 4-10 10-10s10 4 10 10M22 38c0-6 4-10 10-10s10 4 10 10" /></>,
};
export default function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true">{P[name] ?? P.product}</svg>;
}
