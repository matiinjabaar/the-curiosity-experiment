import fs from 'node:fs'
const langs = ['en', 'ar', 'ckb']
const data = Object.fromEntries(langs.map(lang => [lang, JSON.parse(fs.readFileSync(new URL('../src/locales/' + lang + '.json', import.meta.url), 'utf8'))]))
function flatten(value, prefix = '', out = {}) {
  for (const [key, item] of Object.entries(value)) {
    const path = prefix ? prefix + '.' + key : key
    if (item && typeof item === 'object' && !Array.isArray(item)) flatten(item, path, out)
    else out[path] = item
  }
  return out
}
const flat = Object.fromEntries(langs.map(lang => [lang, flatten(data[lang])]))
const keys = Object.keys(flat.en)
let failed = false
for (const lang of langs) {
  for (const key of keys) {
    if (!(key in flat[lang])) { console.error(lang + ': missing ' + key); failed = true }
    else if (flat[lang][key] === '' || flat[lang][key] == null) { console.error(lang + ': empty ' + key); failed = true }
  }
  for (const key of Object.keys(flat[lang])) if (!(key in flat.en)) { console.error(lang + ': unexpected key ' + key); failed = true }
}
if (failed) process.exit(1)
console.log('Translation key coverage passed for en, ar, ckb (' + keys.length + ' keys).')