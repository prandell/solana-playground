import { mintTo } from '@solana/spl-token'
import 'dotenv/config'
import {
  getExplorerLink,
  getKeypairFromEnvironment
} from '@solana-developers/helpers'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import {
  getEnvOrThrow,
  loadKeypairFromEnv,
  loadPublicKeyFromEnv
} from '../../utils/utils'
const connection = new Connection(clusterApiUrl('devnet'))

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2)

const user = loadKeypairFromEnv('SECRET_KEY')

// Subtitute in your token mint account from create-token-mint.ts
const tokenMintAccount = loadPublicKeyFromEnv('WREN_TOKEN_MINT')

// Substitute in your own, or a friend's token account address, based on the previous step.
const recipientAssociatedTokenAccount =
  loadPublicKeyFromEnv('WREN_TOKEN_ACCOUNT')

const transactionSignature = await mintTo(
  connection,
  user,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  user,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
)

const link = getExplorerLink('transaction', transactionSignature, 'devnet')

console.log(`✅ Success! Mint Token Transaction: ${link}`)
