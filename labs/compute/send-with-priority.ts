import {
  ComputeBudgetProgram,
  Connection,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { loadKeypairFromEnv, resolvePublicAdress } from '../../utils/utils';

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const toPubkey = await resolvePublicAdress(suppliedToPubkey, connection);
const senderKeypair = loadKeypairFromEnv('SECRET_KEY');

const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 2000,
});

const transferInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey: toPubkey,
  lamports: 5000,
});

const transactionMessage = new TransactionMessage({
  payerKey: senderKeypair.publicKey,
  recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
  instructions: [addPriorityFee, transferInstruction],
}).compileToV0Message();

const txn = new VersionedTransaction(transactionMessage);

txn.sign([senderKeypair]);

const signature = await connection.sendTransaction(txn);

console.log(`Transaction signature: ${signature}`);
