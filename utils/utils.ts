import { NameRegistryState, getDomainKeySync } from '@bonfida/spl-name-service'
import { getKeypairFromEnvironment } from '@solana-developers/helpers'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '..', '.env') })

export function isValidSolAddress(address: string): boolean {
  try {
    const pubkey = new PublicKey(address)
    const isSolana = PublicKey.isOnCurve(pubkey.toBuffer())
    return isSolana
  } catch (error) {
    return false
  }
}

export function generateAndLogKeypair() {
  const keypair = Keypair.generate()
  console.log(`The public key is: `, keypair.publicKey.toBase58())
  console.log(`The secret key is: `, keypair.secretKey)
}

export function loadKeypairFromEnv(envVar: string): Keypair {
  return getKeypairFromEnvironment(envVar)
}

export function loadPublicKeyFromEnv(envVar: string): PublicKey {
  const loaded = process?.env?.[envVar]
  if (!loaded) {
    throw new Error('Supplied ENV variable could not be loaded')
  }

  return new PublicKey(loaded)
}

export function getEnvOrThrow(envVar: string): string {
  const loaded = process?.env?.[envVar]
  if (!loaded) {
    throw new Error('Supplied ENV variable could not be loaded')
  }

  return loaded
}

export async function getPublicKeyFromSolDomain(
  domain: string,
  connection: Connection
): Promise<string> {
  try {
    const { pubkey } = getDomainKeySync(domain)
    const owner = (
      await NameRegistryState.retrieve(connection, pubkey)
    ).registry.owner.toBase58()
    return owner
  } catch (e) {
    let message = e.type
    if (e.type === 'AccountDoesNotExist') {
      message = 'Account with this domain does not exist'
    }
    throw new Error(message)
  }
}

export async function resolvePublicAdress(
  addressOrDomain: string,
  connection: Connection
): Promise<PublicKey> {
  let pubkey = addressOrDomain
  if (pubkey.endsWith('.sol')) {
    pubkey = await getPublicKeyFromSolDomain(pubkey, connection)
  }

  if (!isValidSolAddress(pubkey)) {
    throw new Error("Provided public address is invalid, or doesn't exist")
  }

  return new PublicKey(pubkey)
}
