import { NextRequest, NextResponse } from 'next/server'
import { PinataService } from '../../../../lib/pinata.service'

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Mulai upload NFT...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Image file wajib diisi bro'
      }, { status: 400 })
    }

    const name = formData.get('name') as string
    if (!name) {
      return NextResponse.json({
        success: false,
        message: 'Name wajib diisi bro'
      }, { status: 400 })
    }

    const timestamp = Date.now()
    const identifier = `nft-${timestamp}`

    console.log('📤 Step 1: Upload image ke IPFS...')
    const pinataService = new PinataService()
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const imageResult = await pinataService.uploadImage(
      buffer,
      file.name,
      `${identifier}-image`
    )
    console.log('✅ Image uploaded:', imageResult.ipfsHash)

    // Parse attributes if exists
    const attributesStr = formData.get('attributes') as string
    const attributes = attributesStr ? JSON.parse(attributesStr) : []

    const metadata: any = {
      name,
      description: (formData.get('description') as string) || '',
      image: imageResult.url,
      attributes
    }

    const createdAt = formData.get('created_at') as string
    if (createdAt) {
      metadata.created_at = createdAt
    }

    const initialPrice = formData.get('initial_price') as string
    if (initialPrice) {
      metadata.initial_price = initialPrice
    }

    const auctionStr = formData.get('auction') as string
    if (auctionStr) {
      metadata.auction = JSON.parse(auctionStr)
    }

    console.log('📤 Step 2: Upload metadata ke IPFS...')
    const metadataResult = await pinataService.uploadJSON(metadata)
    console.log('✅ Metadata uploaded:', metadataResult.ipfsHash)

    return NextResponse.json({
      success: true,
      message: 'NFT berhasil di-upload ke IPFS',
      data: {
        metadata_cid: metadataResult.ipfsHash,
        metadata_url: metadataResult.url,
        image_cid: imageResult.ipfsHash,
        image_url: imageResult.url,
        metadata: metadata
      }
    })
  } catch (error: any) {
    console.error('❌ Error upload NFT:', error)

    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}