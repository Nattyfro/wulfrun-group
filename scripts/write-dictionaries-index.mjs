import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DICT_DIR = path.join(__dirname, '../src/locales/dictionaries');

const locales = fs
  .readdirSync(DICT_DIR)
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.replace('.json', ''))
  .sort();

const imports = locales
  .map((locale) => `import ${locale} from './${locale}.json';`)
  .join('\n');

const entries = locales.map((locale) => `  ${locale},`).join('\n');

const content = `import { Locale, TranslationDictionary } from '../types';\n\n${imports}\n\nconst dictionaries: Record<Locale, TranslationDictionary> = {\n${entries}\n};\n\nexport default dictionaries;\n`;

fs.writeFileSync(path.join(DICT_DIR, 'index.ts'), content);
console.log(`Wrote dictionaries/index.ts with ${locales.length} locales.`);
