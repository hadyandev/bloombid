'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from './useContract'
import { NFT, NFTMetadata } from '@/types/contracts'
import { getNFTsByOwner, getNFTMetadata, getTotalSupply, convertToIPFSGateway, getAuction } from '@/lib/contract'

export function useNFT() {
  const { client, account, isConnected } = useContract()
  const [myNFTs, setMyNFTs] = useState<NFT[]>([])
  const [allNFTs, setAllNFTs] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNFTMetadata = async (ipfsUrl: string): Promise<NFTMetadata | null> => {
    try {
      const gatewayUrl = convertToIPFSGateway(ipfsUrl)
      console.log('Fetching metadata from:', gatewayUrl)
      const response = await fetch(gatewayUrl)
      if (!response.ok) return null
      return await response.json()
    } catch (err) {
      console.error('Error fetching NFT metadata:', err)
      return null
    }
  }

  const loadNFTData = async (tokenId: bigint): Promise<NFT | null> => {
    if (!client) return null

    try {
      const { uri, owner, creator, isInAuction } = await getNFTMetadata(client, tokenId)
      const metadata = await fetchNFTMetadata(uri)
      
      const imageUrl = metadata?.image 
        ? convertToIPFSGateway(metadata.image)
        : '/placeholder.svg'
      
      let hasEndedAuction = false
      try {
        const auctionData = await getAuction(client, tokenId)
        hasEndedAuction = auctionData.ended === true
      } catch (err) {
        console.log(`No auction data for NFT ${tokenId}`)
      }
      
      return {
        tokenId: Number(tokenId),
        owner,
        creator,
        ipfsHash: uri,
        imageUrl,
        isInAuction,
        hasEndedAuction,
        metadata: metadata || undefined
      }
    } catch (err) {
      console.error(`Error loading NFT ${tokenId}:`, err)
      return null
    }
  }

  const fetchMyNFTs = useCallback(async (showLoading = true) => {
    if (!isConnected || !account?.address || !client) return

    if (showLoading) {
      setLoading(true)
    }
    setError(null)

    try {
      const tokenIds = await getNFTsByOwner(client, account.address)
      console.log('Found NFTs for user:', tokenIds)
      
      const nftsData = await Promise.all(
        tokenIds.map(tokenId => loadNFTData(tokenId))
      )
      
      setMyNFTs(nftsData.filter((nft): nft is NFT => nft !== null))
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch NFTs')
      console.error('Error fetching my NFTs:', err)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [isConnected, account?.address, client, isInitialLoad])

  const fetchAllNFTs = useCallback(async (showLoading = true) => {
    if (!client) return

    if (showLoading) {
      setLoading(true)
    }
    setError(null)

    try {
      const totalSupply = await getTotalSupply(client)
      const total = Number(totalSupply)
      console.log('Total NFTs minted:', total)
      
      if (total === 0) {
        console.log('Belum ada NFT yang di-mint')
        setAllNFTs([])
        if (showLoading) {
          setLoading(false)
        }
        return
      }
      
      const nftsData = await Promise.all(
        Array.from({ length: total }, (_, i) => loadNFTData(BigInt(i + 1)))
      )
      
      setAllNFTs(nftsData.filter((nft): nft is NFT => nft !== null))
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch all NFTs')
      console.error('Error fetching all NFTs:', err)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [client, isInitialLoad])

  useEffect(() => {
    if (isConnected) {
      fetchMyNFTs(true)
    }
  }, [isConnected])

  return {
    myNFTs,
    allNFTs,
    loading: isInitialLoad ? loading : false,
    error,
    refetch: fetchMyNFTs,
    fetchAllNFTs
  }
}