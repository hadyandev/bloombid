'use client'

import { useState, useEffect } from 'react'
import { MarketplaceHeader } from '@/components/marketplace-header'
import { NFTGrid } from '@/components/nft-grid'
import { AuctionGrid } from '@/components/auction-grid'
import { MintNFTModal } from '@/components/mint-nft-modal'
import { CreateAuctionModal } from '@/components/create-auction-modal'
import { BidModal } from '@/components/bid-modal'
import { BackToTop } from '@/components/back-to-top'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useContract } from '@/hooks/useContract'
import { useNFT } from '@/hooks/useNFT'
import { useAuction } from '@/hooks/useAuction'
import { useToast } from '@/hooks/use-toast'
import { NFT, AuctionDisplay } from '@/types/contracts'
import { endAuction, cancelAuction } from '@/lib/contract'
import { LoginButton, liskSepolia } from 'panna-sdk'

export default function Home() {
  const { client, account, isConnected } = useContract()
  const { myNFTs, allNFTs, loading: nftLoading, refetch: refetchNFTs, fetchAllNFTs } = useNFT()
  const { 
    activeAuctions, 
    endedAuctions, 
    getMyAuctions, 
    getMyBids,
    loading: auctionLoading, 
    refetch: refetchAuctions 
  } = useAuction()
  const { toast } = useToast()

  const [mintModalOpen, setMintModalOpen] = useState(false)
  const [auctionModalOpen, setAuctionModalOpen] = useState(false)
  const [bidModalOpen, setBidModalOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [selectedAuction, setSelectedAuction] = useState<AuctionDisplay | null>(null)

  const myAuctions = account ? getMyAuctions(account.address) : []
  const myBids = account ? getMyBids(account.address) : []

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

  // Tampilkan semua NFT di marketplace
  const filteredNFTs = allNFTs

  // Load data dengan proper dependency management
  useEffect(() => {
    if (client) {
      console.log('🔄 Fetching NFTs and auctions...', { isConnected, hasAccount: !!account })
      fetchAllNFTs()
      refetchAuctions()
    }
  }, [client]) // Hanya bergantung pada client, bukan isConnected

  const handleCreateAuction = (nft: NFT) => {
    setSelectedNFT(nft)
    setAuctionModalOpen(true)
  }

  const handleBid = (auction: AuctionDisplay) => {
    setSelectedAuction(auction)
    setBidModalOpen(true)
  }

  const handleEndAuction = async (auction: AuctionDisplay) => {
    if (!client || !account) return

    try {
      await endAuction(client, account, BigInt(auction.tokenId))

      toast({
        title: 'Auction Ended!',
        description: `Auction buat NFT #${auction.tokenId} udah selesai!`
      })

      refetchAuctions()
      refetchNFTs()
    } catch (error: any) {
      toast({
        title: 'Failed',
        description: error.message || 'Gagal end auction',
        variant: 'destructive'
      })
    }
  }

  const handleCancelAuction = async (auction: AuctionDisplay) => {
    if (!client || !account) return

    try {
      await cancelAuction(client, account, BigInt(auction.tokenId))

      toast({
        title: 'Auction Canceled',
        description: `Auction buat NFT #${auction.tokenId} dibatalin`
      })

      refetchAuctions()
      refetchNFTs()
    } catch (error: any) {
      toast({
        title: 'Failed',
        description: error.message || 'Gagal cancel auction',
        variant: 'destructive'
      })
    }
  }

  const handleModalSuccess = () => {
    console.log('🔄 Modal success - refreshing all data...')
    refetchNFTs()
    refetchAuctions()
    fetchAllNFTs()
  }

  if (!isConnected) {
    return (
      <>
        <MarketplaceHeader />
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
          
          <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
            {/* Hero Section */}
            <div className="text-center py-12 space-y-8 animate-scale-in">
              <div className="relative w-40 h-40 rounded-3xl flex items-center justify-center mx-auto animate-glow-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl animate-gradient" />
                <span className="text-7xl relative z-10 animate-float">🌸</span>
              </div>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Welcome to BloomBid
                </h1>
                <p className="text-xl text-muted-foreground">
                  Premium NFT Auction Marketplace
                </p>
                <p className="text-muted-foreground max-w-md mx-auto pt-2">
                  Jelajahi koleksi NFT dan auction terbaru! Connect wallet lo buat mulai mint NFT, create auction, atau bid di marketplace yang paling kece!
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 w-full max-w-4xl mx-auto">
                <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="font-bold text-lg mb-2">Buat NFT</h3>
                  <p className="text-sm text-muted-foreground">Bikin dan upload karya seni digital lo</p>
                </div>
                
                <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  <div className="text-4xl mb-4">🔨</div>
                  <h3 className="font-bold text-lg mb-2">Create Auction</h3>
                  <p className="text-sm text-muted-foreground">Auction NFT lo dan dapetin best price</p>
                </div>
                
                <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="font-bold text-lg mb-2">Collect & Bid</h3>
                  <p className="text-sm text-muted-foreground">Bid auction dan koleksi NFT favorit</p>
                </div>
              </div>
            </div>

            {/* Preview Tabs */}
            <Tabs defaultValue="all-nfts" className="space-y-8">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 bg-card/80 backdrop-blur-sm border-2 border-purple-500/20 p-1.5 h-auto shadow-lg">
                <TabsTrigger 
                  value="all-nfts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 text-sm font-semibold"
                >
                  🌐 All NFTs
                  <span className="block text-xs mt-0.5">({allNFTs.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="live-auctions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 text-sm font-semibold"
                >
                  ⚡ Live Auctions
                  <span className="block text-xs mt-0.5">({activeAuctions.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all-nfts" className="space-y-6 animate-fade-in">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/20 shadow-xl">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    All NFTs
                  </h2>
                  <p className="text-muted-foreground">Explore semua NFT yang ada di marketplace</p>
                </div>
                <NFTGrid
                  nfts={allNFTs}
                  userAddress={account?.address}
                  loading={nftLoading}
                  showConnectPrompt={true}
                  onCreateAuction={handleCreateAuction}
                />
              </TabsContent>

              <TabsContent value="live-auctions" className="space-y-6 animate-fade-in">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-500/20 shadow-xl">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Live Auctions
                  </h2>
                  <p className="text-muted-foreground">Auction yang sedang berlangsung - Connect wallet untuk bid!</p>
                </div>
                <AuctionGrid
                  auctions={activeAuctions}
                  loading={auctionLoading}
                  userAddress={account?.address}
                  showConnectPrompt={true}
                  onBid={handleBid}
                  onEnd={handleEndAuction}
                  onCancel={handleCancelAuction}
                />
              </TabsContent>
            </Tabs>

            {/* Connect Wallet CTA */}
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-500/20 shadow-2xl max-w-lg mx-auto relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <div className="text-5xl mb-6 animate-pulse">🌸</div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
                    Ready to Get Started?
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Connect wallet lo buat mulai petualangan NFT! Mint karya seni digital, create auction yang menguntungkan, atau bid NFT favorit lo.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <span className="text-lg">👆</span>
                    <span className="text-sm text-muted-foreground font-medium">
                      Klik "Connect Wallet" di header atas untuk mulai
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer - keluar dari main dan container agar full width */}
        <footer className="border-t border-purple-500/20 bg-card/50 backdrop-blur-sm w-full">
          <div className="w-full px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🌸</span>
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    BloomBid
                  </span>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Premium NFT Auction Marketplace yang menghubungkan creator dan collector dalam ekosistem blockchain yang aman dan transparan.
                </p>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors cursor-pointer">
                    <span className="text-sm">📱</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer">
                    <span className="text-sm">🐦</span>
                  </div>
                  <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center hover:bg-cyan-500/20 transition-colors cursor-pointer">
                    <span className="text-sm">💬</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-bold mb-4 text-foreground">Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-purple-500 cursor-pointer transition-colors">🎨 Mint NFTs</li>
                  <li className="hover:text-purple-500 cursor-pointer transition-colors">🔨 Create Auctions</li>
                  <li className="hover:text-purple-500 cursor-pointer transition-colors">💎 Bid & Collect</li>
                  <li className="hover:text-purple-500 cursor-pointer transition-colors">📊 Analytics</li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-bold mb-4 text-foreground">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-blue-500 cursor-pointer transition-colors">📖 Documentation</li>
                  <li className="hover:text-blue-500 cursor-pointer transition-colors">🆘 Help Center</li>
                  <li className="hover:text-blue-500 cursor-pointer transition-colors">💬 Community</li>
                  <li className="hover:text-blue-500 cursor-pointer transition-colors">🐛 Report Bug</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-purple-500/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 BloomBid. Built with 💜 for the NFT community.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="hover:text-purple-500 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-purple-500 cursor-pointer transition-colors">Terms of Service</span>
                <div className="flex items-center gap-2">
                  <span>Powered by</span>
                  <div className="px-2 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded border border-purple-500/20">
                    <span className="text-xs font-medium">Lisk Sepolia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        <BackToTop />
      </>
    )
  }

  return (
    <>
      <MarketplaceHeader onMintClick={() => setMintModalOpen(true)} />
      
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <Tabs defaultValue="all-nfts" className="space-y-8">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 bg-card/80 backdrop-blur-sm border-2 border-purple-500/20 p-1.5 h-auto shadow-lg">
              <TabsTrigger 
                value="all-nfts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 text-sm font-semibold"
              >
                🌐 All NFTs
                <span className="block text-xs mt-0.5">({allNFTs.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-nfts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 text-sm font-semibold"
              >
                🎨 My NFTs
                <span className="block text-xs mt-0.5">({myNFTs.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="active-auctions"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 text-sm font-semibold"
              >
                ⚡ Live
                <span className="block text-xs mt-0.5">({activeAuctions.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-auctions"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white py-3 text-sm font-semibold"
              >
                🔨 My Auctions
                <span className="block text-xs mt-0.5">({myAuctions.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-bids"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 text-sm font-semibold"
              >
                💎 My Bids
                <span className="block text-xs mt-0.5">({myBids.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-nfts" className="space-y-6 animate-fade-in">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/20 shadow-xl">
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  All NFTs
                </h2>
                <p className="text-muted-foreground">Semua NFT yang ada di marketplace</p>
              </div>
              <NFTGrid
                nfts={filteredNFTs}
                userAddress={account?.address}
                loading={nftLoading}
                onCreateAuction={handleCreateAuction}
              />
            </TabsContent>

            <TabsContent value="my-nfts" className="space-y-6 animate-fade-in">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/20 shadow-xl">
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  My NFTs
                </h2>
                <p className="text-muted-foreground">NFT collection lo</p>
              </div>
              <NFTGrid
                nfts={myNFTs}
                userAddress={account?.address}
                loading={nftLoading}
                onCreateAuction={handleCreateAuction}
              />
            </TabsContent>

            <TabsContent value="active-auctions" className="space-y-6 animate-fade-in">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-500/20 shadow-xl">
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Active Auctions
                </h2>
                <p className="text-muted-foreground">Semua auction yang lagi jalan</p>
              </div>
              <AuctionGrid
                auctions={activeAuctions}
                loading={auctionLoading}
                userAddress={account?.address}
                onBid={handleBid}
                onEnd={handleEndAuction}
                onCancel={handleCancelAuction}
              />
            </TabsContent>

            <TabsContent value="my-auctions" className="space-y-6 animate-fade-in">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-500/20 shadow-xl">
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  My Auctions
                </h2>
                <p className="text-muted-foreground">Auction yang lo buat</p>
              </div>
              <AuctionGrid
                auctions={myAuctions}
                loading={auctionLoading}
                userAddress={account?.address}
                onEnd={handleEndAuction}
                onCancel={handleCancelAuction}
              />
            </TabsContent>

            <TabsContent value="my-bids" className="space-y-6 animate-fade-in">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-500/20 shadow-xl">
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  My Bids
                </h2>
                <p className="text-muted-foreground">Auction yang lo bid</p>
              </div>
              <AuctionGrid
                auctions={myBids}
                loading={auctionLoading}
                userAddress={account?.address}
                onBid={handleBid}
                onEnd={handleEndAuction}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer - sama untuk semua state */}
      <footer className="border-t border-purple-500/20 bg-card/50 backdrop-blur-sm w-full">
        <div className="w-full px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🌸</span>
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  BloomBid
                </span>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Premium NFT Auction Marketplace yang menghubungkan creator dan collector dalam ekosistem blockchain yang aman dan transparan.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors cursor-pointer">
                  <span className="text-sm">📱</span>
                </div>
                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer">
                  <span className="text-sm">🐦</span>
                </div>
                <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center hover:bg-cyan-500/20 transition-colors cursor-pointer">
                  <span className="text-sm">💬</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-purple-500 cursor-pointer transition-colors">🎨 Mint NFTs</li>
                <li className="hover:text-purple-500 cursor-pointer transition-colors">🔨 Create Auctions</li>
                <li className="hover:text-purple-500 cursor-pointer transition-colors">💎 Bid & Collect</li>
                <li className="hover:text-purple-500 cursor-pointer transition-colors">📊 Analytics</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-blue-500 cursor-pointer transition-colors">📖 Documentation</li>
                <li className="hover:text-blue-500 cursor-pointer transition-colors">🆘 Help Center</li>
                <li className="hover:text-blue-500 cursor-pointer transition-colors">💬 Community</li>
                <li className="hover:text-blue-500 cursor-pointer transition-colors">🐛 Report Bug</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-purple-500/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 BloomBid. Built with 💜 for the NFT community.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="hover:text-purple-500 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-purple-500 cursor-pointer transition-colors">Terms of Service</span>
              <div className="flex items-center gap-2">
                <span>Powered by</span>
                <div className="px-2 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded border border-purple-500/20">
                  <span className="text-xs font-medium">Lisk Sepolia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />

      <MintNFTModal
        open={mintModalOpen}
        onOpenChange={setMintModalOpen}
        onSuccess={handleModalSuccess}
      />

      <CreateAuctionModal
        open={auctionModalOpen}
        onOpenChange={setAuctionModalOpen}
        nft={selectedNFT}
        onSuccess={handleModalSuccess}
      />

      <BidModal
        open={bidModalOpen}
        onOpenChange={setBidModalOpen}
        auction={selectedAuction}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}
