import { getKeypairFromEnvironment } from '@solana-developers/helpers'
import { Keypair } from '@solana/web3.js'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../..', '.env') })

export function loadKeypairFromEnv(envVar: string): Keypair {
  return getKeypairFromEnvironment(envVar)
}
