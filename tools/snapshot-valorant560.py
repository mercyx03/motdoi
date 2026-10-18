import urllib.request,re,html,json,pathlib,concurrent.futures,sys
sys.stdout.reconfigure(encoding='utf-8');root=pathlib.Path('.local/esports')
filename=sys.argv[1] if len(sys.argv)>1 else 'valorant.json'
leagues=json.loads((root/filename).read_text(encoding='utf-8'))
def clean(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip()
def snapshot(t):
    id=t['id'].split('-')[1]
    if id=='extra':return
    s=(root/('vlr-'+id+'.html')).read_text(encoding='utf-8')
    paths=list(dict.fromkeys(p for p in re.findall(r'href="(/[0-9]+/[^"?]+)"',s) if re.search(r'2026',p) and not p.endswith('/')))
    for path in paths[:4]:
        try:
            cp=root/('match-'+path.split('/')[1]+'.html')
            s=cp.read_text(encoding='utf-8') if cp.exists() else urllib.request.urlopen('https://www.vlr.gg'+path,timeout=20).read().decode()
            cp.write_text(s,encoding='utf-8')
            sides=re.findall(r'class="match-header-link [^"]*mod-(\d)"\s+href="/team/(\d+)/',s)
            side=next(int(n)-1 for n,i in sides if i==id)
            players=[clean(x) for x in re.findall(r'class="ovw-player-name text-of"[^>]*>(.*?)</div>',s,re.S)]
            if len(players)<10:continue
            t['players']=list(dict.fromkeys(players[side*5:side*5+5]));t['source']='https://www.vlr.gg'+path;t['snapshot']='Đội hình ra sân tại '+path.split('/')[2].replace('-',' ')
            print(t['name'],t['players'],flush=True);return
        except Exception as e:print('retry',t['name'],str(e)[:60],flush=True)
    print('NO MATCH',t['name'],len(t['players']),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:list(ex.map(snapshot,[t for lg in leagues for t in lg['teams']]))
(root/filename).write_text(json.dumps(leagues,ensure_ascii=False,indent=2),encoding='utf-8')
