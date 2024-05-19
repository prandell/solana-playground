import { Connection, clusterApiUrl } from '@solana/web3.js'
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage
} from '@metaplex-foundation/js'
import {
  createCollectionNft,
  createNft,
  initializeKeypair,
  updateNftUri,
  uploadMetadata
} from './helpers/nft-helpers'
import {
  getCollectionNftData,
  nftData,
  updateNftData
} from './models/nft.models'

async function main() {
  // create a new connection to the cluster's API
  const connection = new Connection(clusterApiUrl('devnet'))

  // initialize a keypair for the user
  const user = await initializeKeypair(connection)

  console.log('PublicKey:', user.publicKey.toBase58())

  // metaplex set up
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000
      })
    )

  // upload the NFT data and get the URI for the metadata
  const uri = await uploadMetadata(metaplex, nftData)

  const collectionNftData = getCollectionNftData(user)
  // upload data for the collection NFT and get the URI for the metadata
  const collectionUri = await uploadMetadata(metaplex, collectionNftData)

  // create a collection NFT using the helper function and the URI from the metadata
  const collectionNft = await createCollectionNft(
    metaplex,
    collectionUri,
    collectionNftData
  )

  // create an NFT using the helper function and the URI from the metadata
  const nft = await createNft(
    metaplex,
    uri,
    nftData,
    collectionNft.mint.address
  )

  // upload updated NFT data and get the new URI for the metadata
  const updatedUri = await uploadMetadata(metaplex, updateNftData)

  // update the NFT using the helper function and the new URI from the metadata
  await updateNftUri(metaplex, updatedUri, nft.address)
}

main()
  .then(() => {
    console.log('Finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
