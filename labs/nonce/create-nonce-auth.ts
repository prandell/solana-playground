import { airdropIfRequired } from '@solana-developers/helpers';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';
import base58 from 'bs58';

const nonceAuthKP = Keypair.generate();
// airdrop some SOL into this account from https://solfaucet.com/
//Airdrop to sender

console.log(`The public key is: `, nonceAuthKP.publicKey.toBase58());

console.log(`The secret key is: `, nonceAuthKP.secretKey);
console.log(`The secret key is: `, base58.encode(nonceAuthKP.secretKey));

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
await airdropIfRequired(
  connection,
  nonceAuthKP.publicKey,
  5 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

const balanceInLamports = await connection.getBalance(nonceAuthKP.publicKey);
const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(`✅ Finished! - balance is ${balanceInSOL}`);
