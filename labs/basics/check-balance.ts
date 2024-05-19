import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl
} from '@solana/web3.js'
import {
  getPublicKeyFromSolDomain,
  isValidSolAddress,
  resolvePublicAdress
} from '../../utils/utils'

let suppliedPublicKey = process.argv[2] || null
if (!suppliedPublicKey) {
  console.log(`Please provide a public key to send to`)
  process.exit(1)
}

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')

const publicKey = await resolvePublicAdress(suppliedPublicKey, connection)
const balanceInLamports = await connection.getBalance(publicKey)
const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL

console.log(
  `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
)
