const fs = require('fs');
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const da = JSON.parse(fs.readFileSync('messages/da.json', 'utf8'));

function getKeys(obj, prefix) {
  let keys = [];
  for (let k in obj) {
    let full = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const enKeys = getKeys(en, '');
const daKeys = getKeys(da, '');
const missing = enKeys.filter(k => daKeys.indexOf(k) === -1);
const extra = daKeys.filter(k => enKeys.indexOf(k) === -1);

console.log('EN keys:', enKeys.length);
console.log('DA keys:', daKeys.length);
console.log('Missing from DA:', missing.length ? missing.join('\n') : 'NONE');
console.log('Extra in DA:', extra.length ? extra.join('\n') : 'NONE');
