import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dortfolio-minecraft-world.humanityfounders99.chatgpt.site'),
  title: 'Minecraft Portfolio',
  description: 'Step into a Minecraft world. Explore a cozy house, discover projects, and get to know the creator behind them.',
  icons: { icon: '/media/favicon/favicon.ico', apple: '/media/favicon/apple-touch-icon.png' },
  openGraph: {
    title: 'Minecraft Portfolio',
    description: 'Explore a cozy Minecraft world and discover the projects inside.',
    type: 'website',
    images: [{ url: 'https://dortfolio-minecraft-world.humanityfounders99.chatgpt.site/media/og/og-image.webp', width: 1200, height: 630, alt: 'A cozy Minecraft house in a block-built landscape' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minecraft Portfolio',
    description: 'Explore a cozy Minecraft world and discover the projects inside.',
    images: ['https://dortfolio-minecraft-world.humanityfounders99.chatgpt.site/media/og/og-image.webp'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
