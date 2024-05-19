import { loadKeypairFromEnv } from '../../utils/utils'

const keypair = loadKeypairFromEnv('SECRET_KEY')

console.log('The public key for this private key is: ', keypair.publicKey)
console.log(
  `✅ Finished! We've loaded our secret key securely, using an env file!`
)
