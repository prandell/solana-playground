import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { loadKeypairFromEnv } from '../../utils/utils';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

async function run() {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  const owner = loadKeypairFromEnv('yakey');

  const tokenAccountsResponse = await connection.getParsedTokenAccountsByOwner(
    owner.publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );
  const tokenAccounts = tokenAccountsResponse.value.map((value) => ({
    mint: new PublicKey(value.account.data.parsed.info.mint),
    account: value.pubkey,
  }));

  //   const closeAccountCalls = tokenAccounts.map((account) =>
  //     new Token(connection, account.mint, TOKEN_PROGRAM_ID, owner.publicKey)
  //       .closeAccount(account.account, owner.publicKey, owner.signer, [])
  //       .then(() => {
  //         log.info(`Closed ${account.mint}`);
  //       })
  //       .catch((e) => {
  //         log.error(`Failed for ${account.mint}: ${e.message}`);
  //         if (e instanceof SendTransactionError) {
  //           log.error(e.logs);
  //         }
  //       })
  //   );

  //   await Promise.all(closeAccountCalls);

  connection;
}
