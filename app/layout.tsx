import './ui/global.css';
import { oxygen } from './ui/fonts';
import { Metadata } from 'next';
import Header from './ui/header';
import Footer from './ui/footer';

export const metadata: Metadata = {
  title: 'Build Market',
  description: 'Find the best professionals for your building project',
  metadataBase: new URL('https://build-market.vercel.app'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Build Market',
    description: 'Find the best professionals for your building project',
    url: 'https://build-market.vercel.app',
    siteName: 'Build Market',
    images: [
      {
        url: '/hero-desktop1.png',
        width: 1200,
        height: 630,
        alt: 'Build Market',
      },
    ],
    locale: 'en-KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Market',
    description: 'Find the best professionals for your building project',
    images: ['/hero-mobile.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${oxygen.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
