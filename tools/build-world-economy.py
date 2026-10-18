"""Build reproducible 194-country labour-market profiles from downloaded ILO/WB snapshots."""
import csv,json,statistics,math
from pathlib import Path
root=Path(__file__).resolve().parent
countries=json.loads((root/'world-country-index.json').read_text(encoding='utf-8'))
def wb(name):
 rows=json.loads((root/name).read_text(encoding='utf-8'))[1];out={}
 for x in rows:
  if x['value'] is not None and float(x['value'])>0:out.setdefault(x['country']['id'],{})[int(x['date'])]=x
 return out
nom=wb('wb-gdp-nominal.json');ppp=wb('wb-gdp-ppp.json');cons=wb('wb-consumption-ppp.json');fx=wb('wb-exchange.json')
iso={c:y[max(y)]['countryiso3code'] for c,y in nom.items()}
iso.update({'VA':'VAT','PS':'PSE','KP':'PRK'})
wages={}
for x in csv.DictReader((root/'ilo-wages.csv').open(encoding='utf-8')):
 if x['sex']!='SEX_T' or x['classif1']!='CUR_TYPE_USD' or not x['obs_value']:continue
 year=int(x['time']);value=float(x['obs_value'])
 if not 2020<=year<=2025 or not 10<value<30000:continue
 key=(year,x['source'].startswith('BA:'),x['source'])
 if x['ref_area'] not in wages or key>wages[x['ref_area']][0]:wages[x['ref_area']]=(key,x)
def bucket(g):return 0 if g<2000 else 1 if g<8000 else 2 if g<25000 else 3
ratios={i:[] for i in range(4)}
for c in countries:
 code=c['code'];w=wages.get(iso.get(code));n=nom.get(code,{})
 if w and n:
  year=int(w[1]['time']);g=n.get(year) or n[max(n)];ratio=float(w[1]['obs_value'])*12/float(g['value'])
  if .15<ratio<3:ratios[bucket(float(g['value']))].append(ratio)
med={i:statistics.median(v) for i,v in ratios.items()}
profiles={};detail=[]
for c in countries:
 code=c['code']
 if code=='VN':continue
 years=set(nom.get(code,{}))&set(ppp.get(code,{}));year=max(years) if years else None
 gn=float(nom[code][year]['value']) if year else c['gdp']*1000*min(1.15,max(.28,.22+.0095*c['gdp']))
 gp=float(ppp[code][year]['value']) if year else c['gdp']*1000
 py=set(cons.get(code,{}))&set(fx.get(code,{}));pyear=max(py) if py else None
 pl=float(cons[code][pyear]['value'])/float(fx[code][pyear]['value']) if pyear else gn/gp
 price_source='wb-consumption' if pyear else 'gdp-proxy'
 if not .12<=pl<=2 or pyear and pyear<2022:
  pl=min(2,max(.12,gn/gp));pyear=year;price_source='gdp-proxy'
 wage=wages.get(iso.get(code));source='ilo' if wage else 'estimate';wy=int(wage[1]['time']) if wage else year
 usd=float(wage[1]['obs_value']) if wage else gn/12*med[bucket(gn)]
 proxy={'VA':'IT','MC':'FR','LI':'CH'}.get(code)
 if not wage and proxy and wages.get(iso.get(proxy)):
  w=wages[iso[proxy]][1];usd=float(w['obs_value']);wy=int(w['time']);source='proxy:'+proxy
 p={'usd':round(usd,3),'wageYear':wy,'source':source,'gdpNominal':round(gn,2),'gdpPPP':round(gp,2),'gdpYear':year,'consumptionPLI':round(pl,5),'priceYear':pyear,'priceSource':price_source}
 if wage:p['iloSource']=wage[1]['source'];p['status']=wage[1]['obs_status']
 profiles[code]=p;detail.append({'code':code,'name':c['name'],**p})
vn=float(wages['VNM'][1]['obs_value'])*25400/1e6
payload={'retrieved':'2026-10-17','vnMonthlyMillion':vn,'fallbackMedianWageToGDP':med,'countries':profiles}
public=root.parent/'public'
(public/'world-economy-data.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
js='/* Country earnings: ILOSTAT EAR_EMTA_SEX_CUR_NB; GDP/prices: World Bank WDI. See world-economy-sources.md. */\n(function(G){\n\'use strict\';\nvar DATA='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'
js+=(root/'world-economy-runtime.txt').read_text(encoding='utf-8')
(public/'js/world-economy.js').write_text(js,encoding='utf-8')
with (public/'world-economy-countries.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['code','name','usd','wageYear','source','gdpNominal','gdpPPP','gdpYear','consumptionPLI','priceYear','priceSource','iloSource','status'];writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader();writer.writerows(detail)
print('Profiles',len(profiles),'ILO',sum(x['source']=='ilo' for x in profiles.values()),'estimated/proxy',sum(x['source']!='ilo' for x in profiles.values()),'VN reference',vn)
print({k:profiles[k] for k in ['JP','KR','TH','US','VA']})
