import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/lib/payload/client';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#141416' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const icon = './favicon.png';
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalDomain || 'https://aliiraza.icu';
  const authorName = settings.authorName || 'Ali Raza';
  const title = settings.defaultTitle || settings.siteTitle || `${authorName} — Systems & Backend Engineering`;
  const description =
    settings.defaultDescription ||
    'Personal engineering notebook, systems architecture, distributed systems, and technical publishing by Ali Raza.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s · ${authorName}`,
    },
    description,
    authors: [{ name: authorName, url: settings.authorWebsite || siteUrl }],
    creator: authorName,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title,
      description,
      siteName: authorName,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      creator: settings.twitter
        ? `@${settings.twitter.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, '').replace(/\/$/, '')}`
        : '@aliiraza',
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png' },
        { url: '/icon.png', type: 'image/png' },
      ],
      shortcut: '/favicon.png',
      apple: [
        { url: '/apple-icon.png', type: 'image/png' },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <meta name="google-site-verification" content="omKcrUSc3jlbmC8E2sPszLz_-AOufHgVJLThqfuNffM" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-foreground selection:text-background transition-colors duration-150">
        <div className="max-w-[840px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pb-16">{children}</main>
          <Footer />
        </div>

        {/* Lordicon Animation Engine */}
        <Script
          src="https://cdn.lordicon.com/lordicon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
