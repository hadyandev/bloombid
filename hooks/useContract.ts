'use client'

import { useMemo, useEffect } from 'react'
import { useActiveAccount, usePanna } from 'panna-sdk'
import { BLOOM_NFT_CONTRACT_ADDRESS } from '@/lib/contract'

/**
 * Hook to get the Panna client and active account
 * Returns client, account, and wallet connection status
 */
export function useContract() {
  const activeAccount = useActiveAccount()
  const { client } = usePanna()

  // Debug logging untuk tracking state
  useEffect(() => {
    console.log('🔍 Wallet State:', {
      hasClient: !!client,
      hasAccount: !!activeAccount,
      accountAddress: activeAccount?.address,
      timestamp: new Date().toISOString()
    })
  }, [client, activeAccount])

  const contractInfo = useMemo(() => {
    // Pastikan client dan account dalam state yang konsisten
    const isValidConnection = activeAccount && client && activeAccount.address
    
    return {
      client: client || null,
      account: activeAccount || null,
      isConnected: !!isValidConnection,
      address: activeAccount?.address || null,
      contractAddress: BLOOM_NFT_CONTRACT_ADDRESS,
    }
  }, [activeAccount, client])

  return contractInfo
}
