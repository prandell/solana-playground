import 'dotenv/config';
import { convertBase58ToJson } from '../../utils/utils';

const suppliedToKey = process.argv[2] || null;
const outfile = process.argv[3] || null;

if (!suppliedToKey) {
  console.log(
    `Please use the program by calling esrun convert-b58.ts <input-key> <outfile>`
  );
  process.exit(1);
}

if (!outfile) {
  console.log(
    `Please use the program by calling esrun convert-b58.ts <input-key> <outfile>`
  );
  process.exit(1);
}

convertBase58ToJson(suppliedToKey, outfile);
console.log(
  `successfully converted provided key to a json byte array! location: '${outfile}'`
);
