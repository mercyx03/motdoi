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
  const deep = E.countryDepth173(c.code), min = { education: 3, festivals: 3, marriage: 3, cuisine: 5, labor: 5, lifeEvents: 5 };
  const counts = Object.fromEntries(Object.keys(min).map(k => [k, deep ? k === 'cuisine' ? deep.cuisine.dishes.length : deep[k].length : 0]));
  const sources = E.COUNTRY_DEPTH_DATA.sources;
  const sourced = !!deep && ['education', 'festivals', 'marriage', 'labor', 'lifeEvents'].every(k => deep[k].every(v => v.countryCode === c.code && /^https:\/\//.test(sources[v.source] || '')));
  const integrated = !!deep && deep.lifeEvents.every(e => !!E.DEC[e.eventId]) && !!E.DEC.countryStories173 && !!E.DEC.countryLabor173 && !!p.cuisine;
  const meets = sourced && integrated && Object.keys(min).every(k => counts[k] >= min[k]);
  return { countryCode: c.code, name: c.name, initialLevel: old.level, currentLegacyLevel: p.level,
    requestedMinimum: min, contentCounts: counts, hasCountryData: !!deep, hasSources: sourced, integratedGameplay: integrated,
    education: { hasExamResolver: !!p.exam, hasSchoolSetting: !!p.school, content: deep ? deep.education : [], status: deep ? 'sourced-minimum' : 'needsResearch' },
    festivals: { ids: p.holidays, content: deep ? deep.festivals : [], status: deep ? 'sourced-minimum' : p.holidays.length ? 'partial' : 'needsResearch' },
    marriage: { content: deep ? deep.marriage : [], status: deep ? 'sourced-minimum' : 'needsResearch' },
    cuisine: p.cuisine ? { dishes: p.cuisine.dishes, metadata: p.cuisine.metadata, gameplayEvent: 'world_cuisine173', status: 'partial' } : { status: 'needsResearch' },
    labor: { hasWorkplaceSetting: !!p.work, content: deep ? deep.labor : [], referenceYear: deep ? deep.metadata.referenceYear : null, status: deep ? 'sourced-minimum' : 'needsResearch', note: 'Wage model does not verify labor law; legal exceptions and future changes are not fully simulated' },
    lifeEvents: { regionalFallbackAllowed: false, scopedEvents: ['world_festival173', 'world_school173', 'world_exam173', 'world_coming173', 'world_workplace173', 'world_integration173'].concat(p.cuisine ? ['world_cuisine173'] : []), countryEvents: deep ? deep.lifeEvents.map(e => e.eventId) : [], status: deep ? 'integrated' : 'partial' },
    metadata: deep ? deep.metadata : { confidence: 'needsResearch', sources: [] },
    completeSixDomains: meets, meetsRequestedMinimum: meets, fullyAccepted: false };
});
const complete = rows.filter(c => c.meetsRequestedMinimum).map(c => c.countryCode);
const output = { auditedAt: '2026-10-28', total: rows.length, initialCounts: before.reduce((o, c) => (o[c.level] = (o[c.level] || 0) + 1, o), {}), newCuisineCountries: Object.keys(E.CULTURE173.FOOD), completeSixDomainsVerified: complete.length, minimumCoverageCountries: complete, remaining: rows.filter(c => !c.meetsRequestedMinimum).map(c => c.countryCode), fullyAccepted: false, sourceCatalogue: E.COUNTRY_DEPTH_DATA.sources, countries: rows };
fs.writeFileSync(path.join(root, 'docs/country-depth-inventory.json'), JSON.stringify(output, null, 2).replace(/\n/g, '\r\n') + '\r\n');
console.log('PASS inventory: 195 unique indexed countries; ' + complete.length + ' meet sourced/integrated minimums; ' + (195 - complete.length) + ' remain. This is not full phase acceptance.');
