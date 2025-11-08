import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BloomBid - Premium NFT Auction Marketplace",
  description: "Premium NFT Auction Marketplace yang menghubungkan creator dan collector dalam ekosistem blockchain. Mint NFT, create auction, dan bid koleksi favorit lo!",
  keywords: ["NFT", "auction", "blockchain", "marketplace", "crypto", "digital art", "collectibles", "Lisk", "mint"],
  authors: [{ name: "BloomBid Team" }],
  generator: "Next.js",
  applicationName: "BloomBid",
  referrer: "origin-when-cross-origin",
  creator: "BloomBid",
  publisher: "BloomBid",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BloomBid - Premium NFT Auction Marketplace",
    description: "Premium NFT Auction Marketplace yang menghubungkan creator dan collector dalam ekosistem blockchain yang aman dan transparan.",
    url: '/',
    siteName: 'BloomBid',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BloomBid - Premium NFT Auction Marketplace',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BloomBid - Premium NFT Auction Marketplace",
    description: "Premium NFT Auction Marketplace yang menghubungkan creator dan collector dalam ekosistem blockchain.",
    images: ['/og-image.png'],
    creator: '@bloombid',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
