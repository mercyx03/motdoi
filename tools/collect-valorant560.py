import urllib.request,re,html,json,pathlib,concurrent.futures,sys
sys.stdout.reconfigure(encoding='utf-8')
root=pathlib.Path('.local/esports')
links=json.loads((root/'vlr-links.json').read_text(encoding='utf-8'))
links['/team/2355/kr-esports']='KRÜ Esports'
regions={
'Americas':('US',[188,427,11058,2359,6961,7386,120,5248,2406,2355,1034,2]),
'EMEA':('DE',[12694,474,1001,4915,8877,1184,397,2593,2059,14419,6392,3478]),
'Pacific':('KR',[11060,624,8185,918,17,6199,14,878,278,4050,5448,11229]),
'CN':('CN',[1119,12010,731,13576,14137,11328,13581,1120,11981,12685,13790,12064])}
def fetch(item):
    region,id=item
    path=next(h for h in links if h.split('/')[2]==str(id))
    url='https://www.vlr.gg'+path
    try:
        cached=root/('vlr-'+str(id)+'.html')
        s=cached.read_text(encoding='utf-8') if cached.exists() else urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read().decode()
        (root/('vlr-'+str(id)+'.html')).write_text(s,encoding='utf-8')
        players=[]
        for block in re.split(r'<div class="team-roster-item">',s)[1:]:
            if 'team-roster-item-name-alias' not in block:continue
            role=re.search(r'class="[^"]*team-roster-item-name-role[^\"]*"[^>]*>(.*?)</div>',block,re.S)
            if role and re.search('coach|manager|analyst|inactive|content|assistant',role[1],re.I):continue
            m=re.search(r'team-roster-item-name-alias"[^>]*>(.*?)</div>',block,re.S)
            n=re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',m[1]))).strip()
            if n and n not in players:players.append(n)
        title=re.search(r'<title>(.*?)</title>',s,re.S).group(1)
        name=html.unescape(title.split('Valorant')[0].rstrip(' :|–-')).strip()
        name=re.sub(r'\s*\([^)]*\)$','',name)
        print(region,name,players,flush=True)
        return region,dict(id='VCT-'+str(id),name=name,players=players,source=url)
    except Exception as e: print('ERROR',id,e,flush=True);return region,dict(id='VCT-'+str(id),name=links[path],players=[],source=url)
rows=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:rows=list(ex.map(fetch,[(r,i) for r,(_,ids) in regions.items() for i in ids]))
out=[]
for region,(host,ids) in regions.items():
    out.append(dict(id='VCT-'+region,game='val',name='VCT '+region,host=host,teams=[t for r,t in rows if r==region],source='https://valorantesports.com/en-US/season/115571062868511862/handbook/115571062868708473',snapshot='Đội VCT 2026; đội hình VLR đọc 18/10/2026'))
(root/'valorant.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
