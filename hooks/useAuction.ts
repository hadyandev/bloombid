'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from './useContract'
import { Auction, AuctionDisplay } from '@/types/contracts'
import { getAuction, getTotalSupply, getNFTMetadata, convertToIPFSGateway, formatEther } from '@/lib/contract'

export function useAuction() {
  const { client, isConnected } = useContract()
  const [auctions, setAuctions] = useState<AuctionDisplay[]>([])
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const convertAuctionToDisplay = (auction: Auction): AuctionDisplay => {
    return {
      ...auction,
      startingBid: formatEther(auction.startingBid),
      highestBid: formatEther(auction.highestBid),
      startTime: Number(auction.startTime),
      endTime: Number(auction.endTime),
      timeRemaining: Math.max(0, Number(auction.endTime) - Math.floor(Date.now() / 1000))
    }
  }

  const fetchAuctions = useCallback(async (showLoading = true) => {
    if (!client) return

    if (showLoading) {
      setLoading(true)
    }
    setError(null)

    try {
      const totalSupply = await getTotalSupply(client)
      const total = Number(totalSupply)
      
      const auctionsData: AuctionDisplay[] = []
      
      for (let tokenId = 1; tokenId <= total; tokenId++) {
        try {
          const auctionData = await getAuction(client, BigInt(tokenId))
          
          // Debug: cek semua auction data, tidak hanya yang active/ended
          const { uri, owner, creator, isInAuction } = await getNFTMetadata(client, BigInt(tokenId))
          
          // Debug logging untuk setiap NFT
          if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 Checking NFT #${tokenId}:`, {
              auctionActive: auctionData.active,
              auctionEnded: auctionData.ended,
              isInAuction,
              willInclude: auctionData.active || auctionData.ended || isInAuction
            })
          }
          
          // Jika NFT dalam auction (isInAuction=true), maka kita ambil data auction-nya
          if (auctionData.active || auctionData.ended || isInAuction) {
            const displayAuction = convertAuctionToDisplay(auctionData)
            
            try {
              const gatewayUrl = convertToIPFSGateway(uri)
              const response = await fetch(gatewayUrl)
              const metadata = await response.json()
              
              displayAuction.nft = {
                tokenId,
                owner: auctionData.seller,
                creator,
                ipfsHash: uri,
                imageUrl: convertToIPFSGateway(metadata.image) || uri,
                isInAuction,
                metadata
              }
            } catch (err) {
              displayAuction.nft = {
                tokenId,
                owner: auctionData.seller,
                creator,
                ipfsHash: uri,
                imageUrl: uri,
                isInAuction
              }
            }
            
            auctionsData.push(displayAuction)
          }
        } catch (err) {
          console.error(`❌ Error loading auction for token ${tokenId}:`, err)
        }
      }
      
      // Tambahkan check untuk NFT yang isInAuction=true tapi tidak ada auction data
      // Ini untuk mengatasi NFT yang terlewat karena error fetch auction
      for (let tokenId = 1; tokenId <= total; tokenId++) {
        const existingAuction = auctionsData.find(auction => auction.tokenId === tokenId)
        
        if (!existingAuction) {
          try {
            const { uri, owner, creator, isInAuction } = await getNFTMetadata(client, BigInt(tokenId))
            
            if (isInAuction) {
              console.log(`🚨 Found NFT #${tokenId} with isInAuction=true but no auction data!`)
              
              // Coba ambil auction data sekali lagi
              try {
                const auctionData = await getAuction(client, BigInt(tokenId))
                const displayAuction = convertAuctionToDisplay(auctionData)
                
                try {
                  const gatewayUrl = convertToIPFSGateway(uri)
                  const response = await fetch(gatewayUrl)
                  const metadata = await response.json()
                  
                  displayAuction.nft = {
                    tokenId,
                    owner: auctionData.seller,
                    creator,
                    ipfsHash: uri,
                    imageUrl: convertToIPFSGateway(metadata.image) || uri,
                    isInAuction,
                    metadata
                  }
                } catch (err) {
                  displayAuction.nft = {
                    tokenId,
                    owner: auctionData.seller,
                    creator,
                    ipfsHash: uri,
                    imageUrl: uri,
                    isInAuction
                  }
                }
                
                auctionsData.push(displayAuction)
                console.log(`✅ Successfully added missing auction for NFT #${tokenId}`)
              } catch (auctionErr) {
                console.error(`❌ Failed to fetch auction data for NFT #${tokenId}:`, auctionErr)
              }
            }
          } catch (err) {
            // Skip jika ada error saat check NFT metadata
          }
        }
      }
      
      setAuctions(auctionsData)
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auctions')
      console.error('Error fetching auctions:', err)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [client, isInitialLoad])

  const getActiveAuctions = useCallback(() => {
    const now = Math.floor(Date.now() / 1000)
    
    // Include auction jika:
    // 1. NFT dalam status isInAuction = true (dari smart contract)
    // 2. Auction masih active dan belum ended
    // Tidak peduli apakah waktu sudah habis - biar user bisa end auction yang expired
    const activeAuctionsList = auctions.filter(auction => {
      const isTimeValid = auction.endTime > now
      const isInAuction = auction.nft?.isInAuction || false
      const isAuctionActive = auction.active && !auction.ended
      
      // Tampilkan auction jika masih dalam status active di blockchain DAN isInAuction = true
      const shouldInclude = isInAuction && isAuctionActive
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Auction #${auction.tokenId}:`, {
          active: auction.active,
          ended: auction.ended,
          timeValid: isTimeValid,
          endTime: new Date(auction.endTime * 1000).toLocaleString(),
          isInAuction,
          isAuctionActive,
          shouldInclude
        })
      }
      
      return shouldInclude
    })
    
    console.log('📊 Total auctions fetched:', auctions.length)
    console.log('✅ Active auctions after filtering:', activeAuctionsList.length)
    
    return activeAuctionsList
  }, [auctions])

  const getEndedAuctions = useCallback(() => {
    return auctions.filter(auction => auction.ended || !auction.active)
  }, [auctions])

  const getMyAuctions = useCallback((address: string) => {
    if (!address) return []
    return auctions.filter(
      auction => auction.seller?.toLowerCase() === address.toLowerCase()
    )
  }, [auctions])

  const getMyBids = useCallback((address: string) => {
    if (!address) return []
    return auctions.filter(
      auction => auction.highestBidder?.toLowerCase() === address.toLowerCase()
    )
  }, [auctions])

  useEffect(() => {
    if (isConnected) {
      fetchAuctions(true)
      
      const interval = setInterval(() => {
        fetchAuctions(false)
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [isConnected])

  return {
    auctions,
    activeAuctions: getActiveAuctions(),
    endedAuctions: getEndedAuctions(),
    getMyAuctions,
    getMyBids,
    loading: isInitialLoad ? loading : false,
    error,
    refetch: fetchAuctions
  }
}