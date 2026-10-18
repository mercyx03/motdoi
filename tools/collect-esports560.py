"""Read-only public roster collection. Raw snapshots stay outside public/."""
import urllib.request, re, html, json, pathlib, concurrent.futures, sys
sys.stdout.reconfigure(encoding='utf-8')
ROOT=pathlib.Path('.local/esports'); ROOT.mkdir(exist_ok=True)
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read().decode('utf-8')
def clean(s): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip()
def links(s): return {h:clean(t) for h,t in re.findall(r'<a[^>]*href="(/team/[^"?]+)"[^>]*>(.*?)</a>',s,re.S) if re.search('[A-Za-z]',clean(t))}
def rank(region):
    try:return links(get('https://www.vlr.gg/rankings/'+region))
    except Exception as e: print(region,str(e));return {}
if __name__=='__main__':
    ls={}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        for d in ex.map(rank,['europe','north-america','brazil','asia-pacific','korea','japan','china','latin-america']):ls.update(d)
    (ROOT/'vlr-links.json').write_text(json.dumps(ls,ensure_ascii=False,indent=2),encoding='utf-8')
    print('TEAM LINKS',len(ls))
