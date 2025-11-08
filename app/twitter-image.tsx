import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'BloomBid - Premium NFT Auction Marketplace'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function TwitterImage() {
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
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '50px',
            zIndex: 10,
          }}
        >
          {/* Logo section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '100px',
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4)',
                padding: '30px',
                borderRadius: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              🌸
            </div>
          </div>
          
          {/* Text section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                marginBottom: '15px',
              }}
            >
              BloomBid
            </div>
            
            <div
              style={{
                fontSize: '28px',
                color: '#94A3B8',
                fontWeight: '500',
                marginBottom: '25px',
              }}
            >
              Premium NFT Auction Marketplace
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                fontSize: '20px',
                color: '#CBD5E1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🎨</span>
                <span>Mint exclusive NFTs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🔨</span>
                <span>Create premium auctions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>💎</span>
                <span>Bid on rare collectibles</span>
              </div>
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