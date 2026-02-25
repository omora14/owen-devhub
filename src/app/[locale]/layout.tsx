import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://owenmorales.dev'),
  title: 'Owen Morales – DevHub',
  description: 'Software Engineer & Data Scientist from Costa Rica. Building products that matter.',
  keywords: ['Owen Morales', 'Software Engineer', 'Data Scientist', 'Full-Stack Developer', 'Costa Rica', 'Portfolio'],
  openGraph: {
    title: 'Owen Morales – DevHub',
    description: 'Software Engineer & Data Scientist from Costa Rica.',
    type: 'website',
    images: [{ url: '/costarica-beach.jpg', width: 1200, height: 630, alt: 'Owen Morales Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owen Morales – DevHub',
    description: 'Software Engineer & Data Scientist from Costa Rica.',
  },
};

const locales = ['en', 'es'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-ocean-deep text-sand-warm antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
