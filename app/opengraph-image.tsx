import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'BloomBid - Premium NFT Auction Marketplace'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a2e',
          backgroundImage: 'linear-gradient(135deg, #16213e 0%, #0f3460 50%, #533483 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration circles */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '100px',
            width: '300px',
            height: '300px',
            background: 'rgba(139, 92, 246, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            right: '100px',
            width: '400px',
            height: '400px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '30px',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4)',
              padding: '40px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🌸
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
            }}
          >
            BloomBid
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#94A3B8',
              fontWeight: '500',
              marginBottom: '30px',
            }}
          >
            Premium NFT Auction Marketplace
          </div>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '24px',
              color: '#CBD5E1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🎨</span>
              <span>Mint NFTs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🔨</span>
              <span>Create Auctions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>💎</span>
              <span>Bid & Collect</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}