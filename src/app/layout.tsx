import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AetherBid | Zero-Knowledge Sealed-Bid Auction Protocol',
  description: 'Confidential luxury sealed-bid auction platform on Midnight Network powered by Compact ZK smart contracts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-midnight-950 text-slate-100 min-h-screen selection:bg-gold-500 selection:text-midnight-950">
        {children}
      </body>
    </html>
  );
}
