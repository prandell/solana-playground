import {
  Connection,
  clusterApiUrl,
  NonceAccount,
  SystemProgram,
  Transaction,
  VersionedTransaction,
  TransactionMessage,
} from '@solana/web3.js';
import { loadKeypairFromEnv, loadPublicKeyFromEnv } from '../../utils/utils';
import bs58 from 'bs58';

const nonceKeypair = loadKeypairFromEnv('NONCE_ACCOUNT_PK');
const nonceAuthKP = loadKeypairFromEnv('NONCE_AUTH_PK');
const personalKP = loadKeypairFromEnv('SECRET_KEY');
const secondPub = loadPublicKeyFromEnv('PUBLIC_KEY');

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const accountInfo = await connection.getAccountInfo(nonceKeypair.publicKey);
if (accountInfo) {
  const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);

  // make a system transfer instruction
  const ix = SystemProgram.transfer({
    fromPubkey: personalKP.publicKey,
    toPubkey: secondPub,
    lamports: 100,
  });

  // make a nonce advance instruction
  const advanceIX = SystemProgram.nonceAdvance({
    authorizedPubkey: nonceAuthKP.publicKey,
    noncePubkey: nonceKeypair.publicKey,
  });

  const messageV0 = new TransactionMessage({
    payerKey: personalKP.publicKey,
    instructions: [advanceIX, ix],
    recentBlockhash: nonceAccount.nonce,
  }).compileToV0Message();

  const txn = new VersionedTransaction(messageV0);

  // sign the tx with the nonce authority's keypair
  txn.sign([nonceAuthKP, personalKP]);

  // make the owner of the publicKey sign the transaction
  // this should open a wallet popup and let the user sign the tx
  //   const signedTx = await signTransaction(tx);

  // once you have the signed tx, you can serialize it and store it
  // in a database, or send it to another device. You can submit it
  // at a later point, without the tx having a mortality
  const serialisedTx = bs58.encode(txn.serialize());
  console.log('Signed Durable Transaction: ', serialisedTx);
}
