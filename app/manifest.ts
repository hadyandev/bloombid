import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BloomBid - Premium NFT Auction Marketplace',
    short_name: 'BloomBid',
    description: 'Premium NFT Auction Marketplace yang menghubungkan creator dan collector dalam ekosistem blockchain yang aman dan transparan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a2e',
    theme_color: '#8B5CF6',
    orientation: 'portrait-primary',
    categories: ['finance', 'business', 'productivity'],
    lang: 'id',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}