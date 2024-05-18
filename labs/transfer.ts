import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import 'dotenv/config'
import { loadKeypairFromEnv, resolvePublicAdress } from '../utils/utils'
import { airdropIfRequired } from '@solana-developers/helpers'

const suppliedToPubkey = process.argv[2] || null

if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`)
  process.exit(1)
}

console.log(`suppliedToPubkey: ${suppliedToPubkey}`)

const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
const toPubkey = await resolvePublicAdress(suppliedToPubkey, connection)
const senderKeypair = loadKeypairFromEnv('SECRET_KEY')

//Airdrop to sender
await airdropIfRequired(
  connection,
  senderKeypair.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
)

console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
)

const transaction = new Transaction()
const LAMPORTS_TO_SEND = 5000
const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey,
  lamports: LAMPORTS_TO_SEND
})

transaction.add(sendSolInstruction)

const signature = await sendAndConfirmTransaction(connection, transaction, [
  senderKeypair
])

console.log(
  `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
)
console.log(`Transaction signature is ${signature}!`)
