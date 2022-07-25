const fs = require('fs');
const woff2 = require('woff2');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: ./node wolf2-to-ttf.js <input-wolff2> <output-ttf>');
  process.exit(1);
}

const input = args[0];
const output = args[1];

fs.writeFileSync(output, woff2.decode(fs.readFileSync(input)));
