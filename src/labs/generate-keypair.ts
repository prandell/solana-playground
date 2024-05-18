import { loadKeypairFromEnv } from '../utils/utils'

const keypair = loadKeypairFromEnv('SECRET_KEY')

console.log(
  `✅ Finished! We've loaded our secret key securely, using an env file!`
)
