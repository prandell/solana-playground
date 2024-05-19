import { Metaplex, NftWithToken, toMetaplexFile } from '@metaplex-foundation/js'
import * as fs from 'fs'
import { CollectionNftData, NftData } from '../models/nft.models'
import * as web3 from '@solana/web3.js'
import dotenv from 'dotenv'
import path from 'path'
import { loadKeypairFromEnv } from './basic-helpers'
dotenv.config({ path: path.join(__dirname, '../..', '.env') })

// helper function to upload image and metadata
export async function uploadMetadata(
  metaplex: Metaplex,
  nftData: NftData
): Promise<string> {
  // file to buffer
  const buffer = fs.readFileSync(
    path.join(__dirname, '../../src', nftData.imageFile)
  )

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, nftData.imageFile)

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file)
  console.log('image uri:', imageUri)

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftData.name,
    symbol: nftData.symbol,
    description: nftData.description,
    image: imageUri
  })

  console.log('metadata uri:', uri)
  return uri
}

// helper function create NFT
export async function createNft(
  metaplex: Metaplex,
  uri: string,
  nftData: NftData,
  collectionMint?: web3.PublicKey
): Promise<NftWithToken> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri, // metadata URI
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
      symbol: nftData.symbol,
      collection: collectionMint
    },
    { commitment: 'finalized' }
  )

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}? cluster=devnet`
  )

  if (collectionMint) {
    //this is what verifies our collection as a Certified Collection
    await metaplex.nfts().verifyCollection({
      mintAddress: nft.mint.address,
      collectionMintAddress: collectionMint,
      isSizedCollection: true
    })
  }

  return nft
}

export async function initializeKeypair(
  connection: web3.Connection
): Promise<web3.Keypair> {
  let keypair = loadKeypairFromEnv('PRIVATE_KEY')
  if (!keypair) {
    console.log('Creating .env file')
    keypair = web3.Keypair.generate()
    fs.writeFileSync('.env', `PRIVATE_KEY=[${keypair.secretKey.toString()}]`)
  }
  await airdropSolIfNeeded(keypair, connection)
  return keypair
}

async function airdropSolIfNeeded(
  signer: web3.Keypair,
  connection: web3.Connection
) {
  const balance = await connection.getBalance(signer.publicKey)
  console.log('Current balance is', balance / web3.LAMPORTS_PER_SOL)

  if (balance < web3.LAMPORTS_PER_SOL) {
    console.log('Airdropping 1 SOL...')
    const airdropSignature = await connection.requestAirdrop(
      signer.publicKey,
      web3.LAMPORTS_PER_SOL
    )

    const latestBlockHash = await connection.getLatestBlockhash()

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature
    })

    const newBalance = await connection.getBalance(signer.publicKey)
    console.log('New balance is', newBalance / web3.LAMPORTS_PER_SOL)
  }
}

// helper function update NFT
export async function updateNftUri(
  metaplex: Metaplex,
  uri: string,
  mintAddress: web3.PublicKey
) {
  // fetch NFT data using mint address
  const nft = await metaplex.nfts().findByMint({ mintAddress })

  // update the NFT metadata
  const { response } = await metaplex.nfts().update(
    {
      nftOrSft: nft,
      uri: uri
    },
    { commitment: 'finalized' }
  )

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  )

  console.log(
    `Transaction: https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  )
}

export async function createCollectionNft(
  metaplex: Metaplex,
  uri: string,
  data: CollectionNftData
): Promise<NftWithToken> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri,
      name: data.name,
      sellerFeeBasisPoints: data.sellerFeeBasisPoints,
      symbol: data.symbol,
      isCollection: true
    },
    { commitment: 'finalized' }
  )

  console.log(
    `Collection Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  )

  return nft
}
