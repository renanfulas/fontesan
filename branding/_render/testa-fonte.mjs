import opentype from 'opentype.js';
import { readFileSync } from 'node:fs';

const load = p => opentype.parse(readFileSync(p).buffer.slice(0));

const f = load('fonts/fraunces-var.ttf');
console.log('Fraunces:', f.names.fullName?.en, '| unitsPerEm:', f.unitsPerEm);
console.log('  fvar:', f.tables.fvar ? f.tables.fvar.axes.map(a => `${a.tag} ${a.minValue}..${a.maxValue} def=${a.defaultValue}`).join(', ') : 'nenhum (estatica)');
console.log('  OS/2 usWeightClass:', f.tables.os2?.usWeightClass);

const m = load('fonts/plexmono-500.ttf');
console.log('PlexMono500:', m.names.fullName?.en, '| usWeightClass:', m.tables.os2?.usWeightClass);
const m4 = load('fonts/plexmono-400.ttf');
console.log('PlexMono400:', m4.names.fullName?.en, '| usWeightClass:', m4.tables.os2?.usWeightClass);
