import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DICT_DIR = path.join(ROOT, 'src/locales/dictionaries');

const SKIP_LOCALES = new Set(['en', 'de', 'fr']);
const TARGET_LOCALES = [
  'es', 'it', 'pl', 'pt', 'nl', 'ro', 'ua', 'ru', 'tr', 'ar', 'ur', 'hi', 'pa', 'bn',
  'zh', 'ja', 'ko', 'vi', 'th', 'lt', 'lv', 'cs', 'sk', 'hu', 'bg', 'el', 'sv', 'da',
  'no', 'fi', 'he', 'hr', 'bs',
];

const GOOGLE_LOCALE = {
  ua: 'uk',
  zh: 'zh-CN',
  no: 'no',
};

function flattenStrings(obj, prefix = []) {
  const entries = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      entries.push({ path: [...prefix, key], value });
      continue;
    }

    entries.push(...flattenStrings(value, [...prefix, key]));
  }

  return entries;
}

function setNestedValue(obj, pathParts, value) {
  let current = obj;

  for (let i = 0; i < pathParts.length - 1; i += 1) {
    const key = pathParts[i];
    current[key] = current[key] || {};
    current = current[key];
  }

  current[pathParts[pathParts.length - 1]] = value;
}

function translateText(text, targetLocale) {
  const googleLocale = GOOGLE_LOCALE[targetLocale] || targetLocale;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${googleLocale}&dt=t&q=${encodeURIComponent(text)}`;
  const output = execFileSync('curl', ['-s', url], { encoding: 'utf8' });
  const data = JSON.parse(output);
  return data[0].map((part) => part[0]).join('');
}

function sleep(ms) {
  execFileSync('sleep', [`${ms / 1000}`]);
}

function generateLocaleDictionary(source, locale) {
  const entries = flattenStrings(source);
  const output = {};

  for (const entry of entries) {
    const translated = translateText(entry.value, locale);
    setNestedValue(output, entry.path, translated);
    sleep(120);
  }

  return output;
}

function main() {
  const source = JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'en.json'), 'utf8'));

  for (const locale of TARGET_LOCALES) {
    if (SKIP_LOCALES.has(locale)) continue;

    const outputPath = path.join(DICT_DIR, `${locale}.json`);
    if (fs.existsSync(outputPath)) {
      console.log(`Skipping ${locale} (already exists)`);
      continue;
    }

    console.log(`Generating ${locale}...`);
    const dictionary = generateLocaleDictionary(source, locale);
    fs.writeFileSync(outputPath, `${JSON.stringify(dictionary, null, 2)}\n`);
    console.log(`Saved ${locale}.json`);
  }

  console.log('Done.');
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
