"""Aggregate complete pinned Aurelia sources. Requires duckdb (pip install duckdb).
No source prose, instructions, private paths, or original character names enter the game.
"""
import sys,json,pathlib,collections,hashlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'.cache/python'))
import duckdb
base=ROOT/'.cache/fantasy/politics'
out={'profiles':[],'climates':[],'links':[],'demography':[],'history':[],'sources':[]}
manifest=json.loads((ROOT/'docs/fantasy-sources/politics-downloads.json').read_text('utf-8'))
for source in manifest:
 name=source['id'].split('/')[-1]; total=0
 for info in source['files']:
  f=base/name/info['file']
  assert hashlib.sha256(f.read_bytes()).hexdigest()==info['sha256'],f'Checksum changed: {f}'
  if f.suffix!='.parquet':continue
  rel=duckdb.read_parquet(str(f));n=rel.count('*').fetchone()[0];total+=n
  if name=='aurelia-causal-events':
   for world,kind,count,mag,val in rel.aggregate('world_id,event_type,count(*),avg(magnitude),avg(valence)','world_id,event_type').fetchall():
    out['profiles'].append({'world':world,'kind':kind,'count':count,'magnitude':round(mag,5),'valence':round(val,5)})
  elif name=='aurelia-civilization-metrics':
   for world,conf,count,stock,disease,rights in rel.aggregate('world_id,conflict_type,count(*),avg(resource_stock),avg(disease_pressure),avg(property_rights)','world_id,conflict_type').fetchall():
    out['climates'].append({'world':world,'conflict':conf,'count':count,'stock':round(stock,4),'disease':round(disease,4),'rights':round(rights,4)})
  elif name=='aurelia-federation-causal':
   if 'relation' in rel.columns:
    for kind,count,weight in rel.aggregate('relation,count(*),avg(weight)','relation').fetchall():out['links'].append({'kind':kind,'count':count,'weight':round(weight,4)})
   else:
    for kind,count,mag in rel.aggregate('event_type,count(*),avg(magnitude)','event_type').fetchall():out['links'].append({'kind':kind,'count':count,'magnitude':round(mag,4)})
  elif name=='aurelia-npc-population':
   for state,count in rel.aggregate('final_state,count(*)','final_state').fetchall():out['demography'].append({'state':state,'count':count})
 if name=='aurelia-runtime-corpus-v2':
  packs=[json.loads(s) for s in (base/name/'source/lore_history_packs.jsonl').read_text('utf-8').splitlines() if s.strip()];total=len(packs)
  counters=collections.Counter((p['world_id'],e) for p in packs for e in set(p.get('recent_events',[])))
  out['history']=[{'world':w,'kind':k,'count':n} for (w,k),n in sorted(counters.items())]
 out['sources'].append({'id':source['id'],'revision':source['revision'],'license':source['license'],'rows':total,'url':'https://huggingface.co/datasets/'+source['id']})
# Stable sorting lets identical downloads reproduce byte-for-byte output.
for key in ['profiles','climates','links','demography']:out[key].sort(key=lambda x:json.dumps(x,sort_keys=True))
(ROOT/'public/js/fantasy-politics-data.js').write_text('/* Aurelia Simulation Dataset, Ousia Research, 2026. Adapted aggregates; see fantasy-LICENSE.txt. */\n(function(G){G.FANTASY_POLITICS_DATA='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';})(globalThis.G);\n',encoding='utf-8')
(ROOT/'docs/fantasy-sources/politics-summary.json').write_text(json.dumps({k:len(v) for k,v in out.items() if k!='sources'}|{'sources':out['sources']},indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:len(v) for k,v in out.items()}));print(json.dumps(out['sources']))
