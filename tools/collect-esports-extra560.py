"""Public Challengers rosters that entered VCT Stage 2, not every amateur team."""
exec(open('tools/collect-valorant560.py',encoding='utf-8').read().split('rows=[]')[0])
groups={'Americas':('US',[11001,15072,23141]),'EMEA':('DE',[876,20085,11232,14478]),'Pacific':('KR',[623,18299,17167]),'CN':('CN',[12784])}
out=[]
for region,(host,ids) in groups.items():
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:rows=list(ex.map(fetch,[(region,i) for i in ids]))
    out.append(dict(id='VCT-'+region+'-Challengers',game='val',name='VCT '+region+' · Challengers Stage 2',host=host,teams=[t for _,t in rows],source='https://liquipedia.net/valorant/VCT/2026',snapshot='Các đội vượt Challengers vào Stage 2 · 2026',challengers=True))
manual={
'Americas':('BESTIA','chubi|david|Melser|Tacolilla|Loss'),
'Pacific':('ONSIDE GAMING','Wolverine|Ray|Cloudy|Hermes|Xiesta'),
'CN':('A Team','Monk|Eren|Folykiki|dingwei|Layla')}
for region,(name,players) in manual.items():
    lg=next(x for x in out if x['id']=='VCT-'+region+'-Challengers');lg['teams'].append(dict(id='VCT-extra-'+region,name=name,players=players.split('|'),source=lg['source']))
(root/'valorant-extra.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
