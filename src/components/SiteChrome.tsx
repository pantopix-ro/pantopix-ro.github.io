'use client';
// Hides the redesigned site's header and footer on /classic/, which carries the Wix page's own.
import { usePathname } from 'next/navigation';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';
  return path.startsWith('/classic') ? null : <>{children}</>;
}
