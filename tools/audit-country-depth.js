'use strict';
// Inventory only: a resolver record is not evidence of six-domain completeness.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const G = require('../tests/hardcore-isolation').gameContext(), E = G.E;
const before = JSON.parse(fs.readFileSync(path.join(root, 'docs/country-depth-baseline.json'), 'utf8'));
const index = JSON.parse(fs.readFileSync(path.join(__dirname, 'world-country-index.json'), 'utf8'));
const indexCodes = new Set(index.map(c => c.code));
if (G.W.C.length !== 195 || new Set(G.W.C.map(c => c.code)).size !== 195 || G.W.C.some(c => !indexCodes.has(c.code))) throw Error('Country index mismatch');
const rows = G.W.C.map(c => {
  const p = E.cultureProfile173(c.code), old = before.find(x => x.code === c.code);
  return { countryCode: c.code, name: c.name, initialLevel: old.level, currentLegacyLevel: p.level,
    education: { hasExamResolver: !!p.exam, hasSchoolSetting: !!p.school, status: 'needsResearch' },
    festivals: { ids: p.holidays, status: p.holidays.length ? 'partial' : 'needsResearch' },
    marriage: { status: 'needsResearch' },
    cuisine: p.cuisine ? { dishes: p.cuisine.dishes, metadata: p.cuisine.metadata, gameplayEvent: 'world_cuisine173', status: 'partial' } : { status: 'needsResearch' },
    labor: { hasWorkplaceSetting: !!p.work, status: 'needsResearch', note: 'Wage model does not verify labor law' },
    lifeEvents: { regionalFallbackAllowed: false, scopedEvents: ['world_festival173', 'world_school173', 'world_exam173', 'world_coming173', 'world_workplace173', 'world_integration173'].concat(p.cuisine ? ['world_cuisine173'] : []), status: 'partial' },
    completeSixDomains: false };
});
const output = { auditedAt: '2026-10-28', total: rows.length, initialCounts: before.reduce((o, c) => (o[c.level] = (o[c.level] || 0) + 1, o), {}), newCuisineCountries: Object.keys(E.CULTURE173.FOOD), completeSixDomainsVerified: 0, countries: rows };
fs.writeFileSync(path.join(root, 'docs/country-depth-inventory.json'), JSON.stringify(output, null, 2).replace(/\n/g, '\r\n') + '\r\n');
console.log('PASS inventory: 195 unique indexed countries; 3 partial cuisine profiles; no six-domain completion claimed.');
