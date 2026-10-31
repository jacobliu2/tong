# -*- coding: utf-8 -*-
"""/glossary/ 경영전환 용어사전 생성기
원고: _tools/glossary_content.py
실행: python3 _tools/glossary_build.py && node _tools/prerender-nav.js
문단형 해설이므로 sentence_breaks 후처리를 돌리지 않는다(자연 줄바꿈).
"""
import os, sys, json, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from solutions_build import head, crumbs_ld, SITE, ORG_LD
from glossary_content import CATS, TERMS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
E = lambda s: html.escape(s, quote=False)
A = lambda s: html.escape(s, quote=True)
PATH = 'glossary/'
URL = SITE + '/' + PATH
BY_ID = {t['id']: t for t in TERMS}
CHIP = dict(core='핵심 개념', axes='네 축', oyak='오약', sado='사도', dx='DX·AI', tools='진단·계획')

CSS = '''<style>
.gl-pg{--blue:#3684FF;--ink:#161d29;--body:#48546b;--sub:#8a95a6;--line:#e9eef7;--tint:#f5f8ff;background:#fff;color:var(--body);word-break:keep-all;-webkit-font-smoothing:antialiased;overflow-x:clip}
.gl-pg p,.gl-pg h1,.gl-pg h2,.gl-pg h3{text-wrap:pretty}
.gw{max-width:880px;margin:0 auto;padding:0 clamp(22px,5vw,40px)}
.gl-hero{position:relative;text-align:center;padding:clamp(104px,13vw,156px) 0 clamp(36px,5vw,56px);overflow:hidden}
.gl-hero .glow{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;opacity:.45}
.gl-hero .glow.a{width:480px;height:480px;background:radial-gradient(circle,rgba(54,132,255,.28),transparent 65%);left:-170px;top:40px}
.gl-hero .glow.b{width:520px;height:520px;background:radial-gradient(circle,rgba(107,163,255,.24),transparent 65%);right:-190px;top:-40px}
.gl-hero .gw{position:relative;z-index:1}
.gl-crumb{font-size:13px;color:var(--sub)}.gl-crumb a{color:var(--sub);text-decoration:none}.gl-crumb a:hover{color:var(--blue)}
.gl-eb{display:inline-block;margin-top:18px;padding:6px 14px;border-radius:999px;background:#eef4ff;color:var(--blue);font-size:11.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase}
.gl-hero h1{margin-top:20px;font-weight:900;font-size:clamp(36px,6.4vw,66px);letter-spacing:-.05em;line-height:1.08;background:linear-gradient(120deg,#3d7dff,#1f57c3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.gl-hero .lead{max-width:50ch;margin:22px auto 0;font-size:clamp(16px,1.9vw,18px);line-height:1.9;color:var(--body)}
.gl-barwrap{min-height:66px}
.gl-bar{position:relative;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.gl-bar.fix{position:fixed;top:0;left:0;right:0;box-shadow:0 6px 20px rgba(22,29,41,.06)}
.gl-bar .gw{display:flex;gap:14px;align-items:center;padding-top:12px;padding-bottom:12px}
.gl-search{flex:0 0 240px;position:relative}
.gl-search input{width:100%;height:40px;border:1px solid #d9e5fb;border-radius:999px;padding:0 16px 0 38px;font-size:14.5px;color:var(--ink);background:#fff;outline:none;transition:border-color .2s}
.gl-search input:focus{border-color:var(--blue)}
.gl-search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--sub)}
.gl-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex:1}.gl-chips::-webkit-scrollbar{display:none}
.gl-chips a{flex:0 0 auto;font-size:13.5px;font-weight:600;color:var(--body);text-decoration:none;padding:8px 13px;border-radius:999px;border:1px solid transparent;transition:.2s;white-space:nowrap}
.gl-chips a:hover,.gl-chips a.on{color:var(--blue);border-color:#d9e5fb;background:#f5f8ff}
.gl-count{font-size:13px;color:var(--sub);white-space:nowrap}
.gl-cat{padding:clamp(56px,8vw,88px) 0 8px;scroll-margin-top:96px}
.gl-cat-h{display:flex;align-items:baseline;gap:6px 14px;padding-bottom:16px;border-bottom:2px solid var(--ink)}
.gl-cat-h .n{font-size:14px;font-weight:800;color:var(--blue);letter-spacing:.04em}
.gl-cat-h h2{font-weight:800;font-size:clamp(23px,3.4vw,31px);letter-spacing:-.03em;color:var(--ink)}
.gl-cat-h p{margin-left:auto;font-size:14px;color:var(--sub)}
.gt{padding:30px 0;border-bottom:1px solid var(--line);scroll-margin-top:96px}
.gt:target{background:linear-gradient(90deg,rgba(54,132,255,.07),transparent 75%)}
.gt h3{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;font-weight:800;font-size:clamp(21px,2.6vw,25px);letter-spacing:-.025em;color:var(--ink)}
.gt h3 a.anc{color:inherit;text-decoration:none}.gt h3 a.anc:hover{color:var(--blue)}
.gt .alt{font-size:14px;font-weight:600;color:var(--sub);letter-spacing:0}
.gt .def{margin-top:12px;font-size:17px;line-height:1.75;font-weight:600;color:var(--ink);padding-left:14px;border-left:3px solid var(--blue)}
.gt .bd{margin-top:14px;font-size:15.5px;line-height:1.9;color:var(--body)}
.gt .bd + .bd{margin-top:10px}
.gt .rel{margin-top:16px;display:flex;flex-wrap:wrap;gap:8px 18px;font-size:14px}
.gt .rel span{color:var(--sub);font-weight:600}
.gt .rel a{color:var(--blue);text-decoration:none;font-weight:600}.gt .rel a:hover{opacity:.7}
.gt .rel .tm a{color:var(--body);font-weight:500;border-bottom:1px solid #d9e5fb}.gt .rel .tm a:hover{color:var(--blue);opacity:1}
.gl-empty{display:none;padding:80px 0;text-align:center;color:var(--sub);font-size:15.5px}
.gl-note{margin-top:56px;font-size:13.5px;line-height:1.8;color:var(--sub)}
.gl-fin{position:relative;text-align:center;padding:clamp(88px,12vw,140px) 0;margin-top:clamp(56px,8vw,90px);overflow:hidden;background:linear-gradient(180deg,#fff,#f4f8ff)}
.gl-fin .big{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-weight:900;font-size:clamp(240px,36vw,480px);color:#3684FF;opacity:.05;line-height:1;pointer-events:none}
.gl-fin h2{position:relative;font-weight:780;font-size:clamp(26px,4vw,40px);letter-spacing:-.04em;color:var(--ink);line-height:1.3}
.gl-fin p{position:relative;margin:14px auto 0;max-width:42ch;line-height:1.8;font-size:16.5px}
.gl-fin .cta{position:relative;margin-top:30px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.gl-btn{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:700;font-size:15.5px;padding:15px 30px;border-radius:999px;transition:.2s}
.gl-btn.p{background:linear-gradient(135deg,#4a90ff,#2f6fe0);color:#fff;box-shadow:0 10px 30px rgba(54,132,255,.3)}.gl-btn.p:hover{transform:translateY(-2px)}
.gl-btn.g{background:#fff;color:var(--ink);border:1px solid #d9e5fb}.gl-btn.g:hover{border-color:var(--blue);color:var(--blue)}
@media(max-width:720px){.gl-bar .gw{flex-wrap:wrap;gap:10px}.gl-search{flex:1 1 100%}.gl-count{display:none}.gl-cat-h{flex-wrap:wrap}.gl-cat-h p{margin-left:0;flex-basis:100%}.gl-barwrap{min-height:114px}.gl-cat,.gt{scroll-margin-top:130px}}
html[data-theme="dark"] .gl-pg{background:#0e1522}
html[data-theme="dark"] .gl-bar{background:rgba(14,21,34,.92);border-color:#28344b}
html[data-theme="dark"] .gl-search input{background:#161f2e;border-color:#28344b;color:#eef2f8}
html[data-theme="dark"] .gl-chips a{color:#aab4c5}html[data-theme="dark"] .gl-chips a.on,html[data-theme="dark"] .gl-chips a:hover{background:#161f2e;border-color:#28344b;color:#6ba3ff}
html[data-theme="dark"] .gl-cat-h{border-color:#eef2f8}html[data-theme="dark"] .gt{border-color:#28344b}
html[data-theme="dark"] .gt .def{color:#e7edf6!important}
html[data-theme="dark"] .gt .rel .tm a{color:#aab4c5!important;border-color:#33415c}
html[data-theme="dark"] .gl-eb{background:#161f2e}
html[data-theme="dark"] .gl-fin{background:linear-gradient(180deg,#0e1522,#0a0f19)!important}
html[data-theme="dark"] .gl-btn.g{background:#161f2e;border-color:#28344b;color:#eef2f8}
</style>'''

JS = '''<script>(function(){
var bw=document.querySelector('.gl-barwrap'),bar=document.querySelector('.gl-bar');function fx(){bar.classList.toggle('fix',bw.getBoundingClientRect().top<0);}addEventListener('scroll',fx,{passive:true});document.addEventListener('scroll',fx,{passive:true,capture:true});fx();
var q=document.getElementById('glq'),items=[].slice.call(document.querySelectorAll('.gt')),cats=[].slice.call(document.querySelectorAll('.gl-cat')),cnt=document.getElementById('glc'),empty=document.getElementById('gle');
function norm(s){return(s||'').toLowerCase().replace(/\\s+/g,'');}
items.forEach(function(el){el._k=norm(el.getAttribute('data-k')+' '+el.textContent);});
function run(){var v=norm(q.value),n=0;items.forEach(function(el){var ok=!v||el._k.indexOf(v)>-1;el.hidden=!ok;if(ok)n++;});
cats.forEach(function(c){c.hidden=!c.querySelector('.gt:not([hidden])');});cnt.textContent=(v?'검색 결과 ':'')+n+'개 용어';empty.style.display=n?'none':'block';}
q.addEventListener('input',run);
var chips=[].slice.call(document.querySelectorAll('.gl-chips a'));
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){chips.forEach(function(c){c.classList.toggle('on',c.getAttribute('href')==='#'+e.target.id);});}});},{rootMargin:'-40% 0px -55% 0px'});cats.forEach(function(c){io.observe(c);});}
})();</script>'''


def term_html(t):
    alt = ' · '.join(t['alt'])
    k = ' '.join([t['name']] + t['alt'])
    out = [f'<article class="gt" id="{t["id"]}" data-k="{A(k)}">',
           f'<h3><a class="anc" href="#{t["id"]}">{E(t["name"])}</a><span class="alt">{E(alt)}</span></h3>',
           f'<p class="def">{E(t["d"])}</p>']
    out += [f'<p class="bd">{E(p)}</p>' for p in t['body']]
    rel = []
    if t.get('see'):
        rel.append('<div class="tm"><span>함께 볼 용어</span> ' + ' · '.join(
            f'<a href="#{s}">{E(BY_ID[s]["name"])}</a>' for s in t['see']) + '</div>')
    if t.get('links'):
        rel.append('<div><span>관련 페이지</span> ' + ' · '.join(
            f'<a href="../{p}">{E(n)} →</a>' for n, p in t['links']) + '</div>')
    out.append('<div class="rel">' + ''.join(rel) + '</div></article>')
    return ''.join(out)


def build():
    # 무결성: see 참조 확인
    for t in TERMS:
        for s in t.get('see', []):
            assert s in BY_ID, f'{t["id"]} → 없는 용어 {s}'
    assert len(BY_ID) == len(TERMS), '중복 id'

    title = '경영전환 용어사전 — 오약·人營財産·BX Point·사유주권 | 통 TONG'
    desc = ('경영전환연구소 통이 쓰는 경영전환 용어를 한곳에 정리했습니다. 경영전환, 엔트로피, ABCDE 전환 사이클, BX Point, '
            '人營財産, 오약(五若), 사도(四度), DX·AX, 기술주권·사유주권까지 ' + str(len(TERMS)) + '개 용어의 정의와 해설.')
    set_id = URL + '#termset'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": URL, "url": URL, "name": '경영전환 용어사전', "description": desc,
         "inLanguage": "ko", "publisher": ORG_LD, "mainEntity": {"@id": set_id}},
        {"@type": "DefinedTermSet", "@id": set_id, "name": "경영전환 용어사전", "url": URL, "inLanguage": "ko",
         "publisher": ORG_LD,
         "hasDefinedTerm": [{"@type": "DefinedTerm", "@id": URL + '#' + t['id'], "name": t['name'],
                             "alternateName": t['alt'], "description": t['d'], "url": URL + '#' + t['id'],
                             "inDefinedTermSet": {"@id": set_id}} for t in TERMS]},
        crumbs_ld([('홈', ''), ('경영전환', 'transformation/'), ('용어사전', PATH)])]}

    b = ['<body data-nav="" data-depth="1">', '<div id="tong-nav-root"></div>', '<main class="gl-pg">',
         '<header class="gl-hero"><div class="glow a"></div><div class="glow b"></div><div class="gw">',
         '<nav class="gl-crumb" aria-label="현재 위치"><a href="../">홈</a> / <a href="../transformation/">경영전환</a> / <span>용어사전</span></nav>',
         '<div class="gl-eb">Glossary · 경영전환 용어</div>',
         '<h1>경영전환 용어사전</h1>',
         '<p class="lead">통이 기업을 읽고 설명할 때 쓰는 말을 한곳에 모았습니다.<br>'
         '각 용어는 경영전환론에서 쓰는 뜻 그대로 정리했고, 관련 진단과 해설로 바로 이어집니다.</p>',
         '</div></header>',
         '<div class="gl-barwrap"><div class="gl-bar"><div class="gw">',
         '<label class="gl-search"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
         '<input id="glq" type="search" placeholder="용어·한자로 찾기" aria-label="용어 검색" autocomplete="off"/></label>',
         '<nav class="gl-chips" aria-label="분류">' + ''.join(f'<a href="#{c}">{E(CHIP[c])}</a>' for c, n, _ in CATS) + '</nav>',
         f'<span class="gl-count" id="glc" aria-live="polite">{len(TERMS)}개 용어</span>',
         '</div></div></div>', '<div class="gw">']
    for i, (cid, name, sub) in enumerate(CATS, 1):
        ts = [t for t in TERMS if t['cat'] == cid]
        b.append(f'<section class="gl-cat" id="{cid}"><div class="gl-cat-h"><span class="n">{i:02d}</span>'
                 f'<h2>{E(name)}</h2><p>{E(sub)}</p></div>' + ''.join(term_html(t) for t in ts) + '</section>')
    b.append('<p class="gl-empty" id="gle">찾는 용어가 없습니다. 다른 표현이나 한자로 찾아보십시오.</p>')
    b.append('<p class="gl-note">이 용어사전은 경영전환연구소 통의 경영전환론에서 쓰는 뜻을 기준으로 합니다. '
             '같은 말이라도 다른 분야에서는 다른 뜻으로 쓰일 수 있습니다.</p>')
    b.append('</div>')
    b.append('<section class="gl-fin"><div class="big">通</div><div class="gw"><h2>말을 알았다면, 이제 우리 회사에 대 볼 차례입니다</h2>'
             '<p>지금 어느 국면(ABCDE)에, 어떤 상태(오약)에 있는지 5분이면 스스로 짚어볼 수 있습니다.</p>'
             '<div class="cta"><a class="gl-btn p" href="../diagnosis/">자가진단 시작 →</a><a class="gl-btn g" href="../contact/">상담 문의</a></div></div></section>')
    b.append('</main>\n<div id="tong-footer-root"></div>\n<script src="../assets/js/navigation.js"></script>\n' + JS + '\n</body></html>\n')

    h = head(title, desc, PATH, ld, 1)
    h = h.replace('</head>', CSS + '</head>', 1) if '</head>' in h else h + CSS
    os.makedirs(os.path.join(ROOT, 'glossary'), exist_ok=True)
    open(os.path.join(ROOT, 'glossary', 'index.html'), 'w', encoding='utf-8').write(h + '\n' + '\n'.join(b))
    print(f'생성: glossary/index.html ({len(TERMS)}개 용어)')


if __name__ == '__main__':
    build()
