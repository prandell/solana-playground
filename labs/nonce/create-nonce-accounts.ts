import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
import { loadKeypairFromEnv } from '../../utils/utils';
import base58 from 'bs58';

const nonceKeypair = Keypair.generate();

console.log(`Nonce acc publickey: `, nonceKeypair.publicKey.toBase58());

console.log(`Nonce acc secret key is: `, base58.encode(nonceKeypair.secretKey));

const nonceAuthKP = loadKeypairFromEnv('NONCE_AUTH_PK');

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const latestBlockHash = await connection.getLatestBlockhash();

const messageV0 = new TransactionMessage({
  payerKey: nonceAuthKP.publicKey,
  instructions: [
    // create system account with the minimum amount needed for rent exemption.
    // NONCE_ACCOUNT_LENGTH is the space a nonce account takes
    SystemProgram.createAccount({
      fromPubkey: nonceAuthKP.publicKey,
      newAccountPubkey: nonceKeypair.publicKey,
      lamports: 0.0015 * LAMPORTS_PER_SOL,
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    // initialise nonce with the created nonceKeypair's pubkey as the noncePubkey
    // also specify the authority of the nonce account
    SystemProgram.nonceInitialize({
      noncePubkey: nonceKeypair.publicKey,
      authorizedPubkey: nonceAuthKP.publicKey,
    }),
  ],
  recentBlockhash: latestBlockHash.blockhash,
}).compileToV0Message();

const txn = new VersionedTransaction(messageV0);

// sign the transaction with both the nonce keypair and the authority keypair
txn.sign([nonceKeypair, nonceAuthKP]);

const txid = await connection.sendTransaction(txn, { maxRetries: 2 });

console.log('Transaction, Confirming ...');

const confirmation = await connection.confirmTransaction({
  signature: txid,
  blockhash: latestBlockHash.blockhash,
  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
});

console.log('Nonce txid: ', txid);
console.log('Nonce confirmation: ', confirmation);
