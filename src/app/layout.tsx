import type { Metadata } from 'next';
import '@fontsource/josefin-sans/400.css';
import '@fontsource/josefin-sans/500.css';
import '@fontsource/josefin-sans/600.css';
import '@fontsource/josefin-sans/700.css';
import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import '@fontsource/jetbrains-mono/400.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LogoSymbol } from '@/components/Logo';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL('https://pantopix.ro'),
  title: { default: 'PANTOPIX RO · Senior software engineers in Cluj', template: '%s · PANTOPIX RO' },
  description: 'Web, mobile and SaaS products, platforms, AI features and cloud. A senior team in Cluj, part of the German PANTOPIX group since 2010.',
  openGraph: { siteName: 'PANTOPIX RO', type: 'website' },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const s = site();
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <LogoSymbol />
        <Header nav={s.nav} cal={s.calendar} calLabel={s.calendarLabel} />
        <main id="main">{children}</main>
        <Footer s={s} />
      </body>
    </html>
  );
}
