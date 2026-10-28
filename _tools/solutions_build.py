# -*- coding: utf-8 -*-
"""/solutions/ 정적 페이지 생성기
원고: _tools/solutions_content.py   실행: python3 _tools/solutions_build.py
생성 후 메뉴·푸터 정적 폴백: node _tools/prerender-nav.js
"""
import os, sys, json, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from solutions_content import PAGES, ORDER
from diagnosis_guides import NAMES as DIAG_NAMES

# 『경영전환론』 재구성 사례(/story/#cases)와의 연결. 실명 사례가 아니므로 '재구성 사례'로만 표기한다.
CASES = {
    'ceo-dependent-organization': [('유통사 G', '대표가 2주 비우자 보였다'), ('밀착 서비스 스타트업', '반응이 오자, 속도부터 냈다')],
    'roles-and-responsibilities': [('SaaS 기업 H', '급여를 올려도 사람이 나갔다'), ('식품 회사', '출고 오류는 사람 탓이 아니었다')],
    'sales-process-crm': [('뷰티 브랜드', '결제 직전에 고객이 사라졌다'), ('밀착 서비스 스타트업', '반응이 오자, 속도부터 냈다')],
    'diagnosis-roadmap': [('금속가공 업체', '흑자인데 급여일마다 대출했다'), ('식품 제조기업', '매출을 줄이자 현금이 살았다'), ('같은 상권의 두 카페', '버릴 줄 아는 곳이 남았다')],
    'ax-operations': [('식품 회사', '출고 오류는 사람 탓이 아니었다'), ('HR 솔루션 창업', '조직을 키우지 않고, 규모를 키웠다')],
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://www.workstong.com'
ORG = '경영전환연구소 통'
E = lambda s: html.escape(s, quote=False)
A = lambda s: html.escape(s, quote=True)

ORG_LD = {"@type": "Organization", "name": ORG, "alternateName": ["TONG", "경영전환전략연구소"], "url": SITE + "/",
          "logo": SITE + "/assets/images/tong-logo.png"}


def head(title, desc, path, ld, depth):
    up = '../' * depth
    return f'''<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{E(title)}</title>
<meta name="description" content="{A(desc)}"/>
<link rel="canonical" href="{SITE}/{path}"/>
<meta property="og:type" content="article"/><meta property="og:locale" content="ko_KR"/>
<meta property="og:title" content="{A(title)}"/><meta property="og:description" content="{A(desc)}"/>
<meta property="og:url" content="{SITE}/{path}"/><meta property="og:image" content="{SITE}/assets/images/tong-logo.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="icon" href="{up}assets/images/tong-logo.png"/>
<link rel="stylesheet" href="{up}assets/css/tong.css"/>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>'''


def crumbs_ld(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + "/" + p} for i, (n, p) in enumerate(items)]}


def page(slug):
    g = PAGES[slug]; path = f'solutions/{slug}/'
    title = g['seo_title'] + ' | 통 TONG'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": SITE + "/" + path, "url": SITE + "/" + path, "name": g['title'],
         "description": g['desc'], "inLanguage": "ko", "publisher": ORG_LD,
         "about": {"@type": "Service", "name": g['nav'], "serviceType": ', '.join(g['services']),
                   "provider": ORG_LD, "areaServed": {"@type": "Country", "name": "대한민국"}}},
        crumbs_ld([('홈', ''), ('문제별 해법', 'solutions/'), (g['nav'], path)])]}
    b = []
    b.append('<body data-nav="consulting" data-depth="2">\n<div id="tong-nav-root"></div>\n<main class="tong-sol">')
    b.append('<header class="tong-sol-hero"><div class="tong-sol-in">')
    b.append(f'<nav class="tong-sol-crumb" aria-label="현재 위치"><a href="../../">홈</a> / <a href="../">문제별 해법</a> / <span>{E(g["nav"])}</span></nav>')
    b.append(f'<h1>{E(g["title"])}</h1>')
    b.append(f'<div class="tong-sol-summary"><p class="k">요약</p><p>{E(g["summary"])}</p></div>')
    b.append('</div></header><div class="tong-sol-in tong-sol-body">')

    def sec(no, t, inner):
        b.append(f'<section><h2><span>{no}</span>{E(t)}</h2>{inner}</section>')

    sec('01', '어떤 기업의 문제인가', ''.join(f'<p>{E(p)}</p>' for p in g['who']))
    sec('02', '이런 증상으로 나타납니다', '<ul>' + ''.join(f'<li>{E(x)}</li>' for x in g['symptoms']) + '</ul>')
    sec('03', '가능한 원인', ''.join(f'<h3>{E(t)}</h3><p>{E(d)}</p>' for t, d in g['causes']))
    if g.get('field'):
        b.append(f'<aside class="tong-sol-field"><p class="k">현장에서</p><p>{E(g["field"])}</p><p class="by">유영준</p></aside>')
    sec('04', '컨설팅에서 진단하는 것', '<ul>' + ''.join(f'<li>{E(x)}</li>' for x in g['diagnose']) + '</ul>')
    sec('05', '개선은 이 순서로 진행합니다', '<ol class="tong-sol-steps">' + ''.join(
        f'<li><b>{E(t)}</b><p>{E(d)}</p></li>' for t, d in g['methods']) + '</ol>')
    sec('06', '기대 산출물', '<ul>' + ''.join(f'<li>{E(x)}</li>' for x in g['outputs']) + '</ul>')
    sec('07', '적용의 전제와 한계', '<ul>' + ''.join(f'<li>{E(x)}</li>' for x in g['limits']) + '</ul>')
    cs = ''.join(f'<li><a href="../../story/#cases"><b>{E(w)}</b> · {E(t)}</a></li>' for w, t in CASES.get(slug, []))
    sec('08', '비슷한 사례', '<p>『경영전환론』에 실린 사례 가운데 이 문제와 닮은 것입니다. 회사와 사람을 보호하기 위해 익명화·재구성했습니다.</p>'
        f'<ul class="tong-sol-links">{cs}</ul>')
    rel = ''.join(f'<li><a href="../../diagnosis/{d}/">{E(DIAG_NAMES[d])}</a></li>' for d in g['diags'])
    sec('09', '먼저 해 볼 수 있는 자가진단', f'<ul class="tong-sol-links">{rel}</ul>')
    sv = ' · '.join(g['services'])
    sec('10', '담당과 상담', f'<p>이 과제는 경영전환론을 만든 <a href="../../expert/">유영준 소장</a>이 직접 맡습니다. 관련 컨설팅 방식은 <a href="../../consulting/">{E(sv)}</a>입니다.</p>'
        '<p>아직 어떤 방식이 필요한지 정하지 않으셔도 됩니다. 지금 상황을 듣고 필요한 것부터 함께 정리합니다.</p>'
        '<p class="tong-sol-cta"><a class="tong-btn tong-btn-primary" href="../../contact/">상담 문의하기 →</a></p>')
    others = [s for s in ORDER if s != slug]
    b.append('<nav class="tong-sol-more" aria-label="다른 문제별 해법"><p class="k">다른 문제별 해법</p><ul>' + ''.join(
        f'<li><a href="../{s}/">{E(PAGES[s]["title"])}</a></li>' for s in others) + '</ul></nav>')
    b.append('</div></main>\n<div id="tong-footer-root"></div>\n<script src="../../assets/js/navigation.js"></script>\n</body></html>\n')
    return head(title, g['desc'], path, ld, 2) + '\n' + '\n'.join(b)


def index():
    path = 'solutions/'
    title = '문제별 해법 — 중소기업 경영 문제의 원인과 개선 방법 | 통 TONG'
    desc = '대표 의존, 직무·권한 정리, 영업 프로세스와 CRM, 경영진단과 로드맵, AI·DX 업무 전환까지. 중소기업 대표가 자주 부딪히는 경영 문제의 원인과 개선 순서를 정리했습니다.'
    items = [{"@type": "ListItem", "position": i + 1, "url": f"{SITE}/solutions/{s}/", "name": PAGES[s]['title']} for i, s in enumerate(ORDER)]
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CollectionPage", "url": SITE + "/" + path, "name": "문제별 해법", "description": desc, "inLanguage": "ko",
         "publisher": ORG_LD, "mainEntity": {"@type": "ItemList", "itemListElement": items}},
        crumbs_ld([('홈', ''), ('문제별 해법', path)])]}
    b = ['<body data-nav="consulting" data-depth="1">\n<div id="tong-nav-root"></div>\n<main class="tong-sol">',
         '<header class="tong-sol-hero"><div class="tong-sol-in">',
         '<nav class="tong-sol-crumb" aria-label="현재 위치"><a href="../">홈</a> / <span>문제별 해법</span></nav>',
         '<h1>문제별 해법</h1>',
         '<p class="tong-sol-lead">회사의 문제는 대개 한 부서에서만 시작되지 않습니다. 대표들이 가장 자주 꺼내는 다섯 가지 문제를 골라, 어떤 회사에서 나타나는지, 원인은 무엇인지, 어떤 순서로 바꾸는지를 정리했습니다.</p>',
         '</div></header><div class="tong-sol-in tong-sol-body"><ol class="tong-sol-index">']
    for s in ORDER:
        g = PAGES[s]
        b.append(f'<li><a href="./{s}/"><span class="t">{E(g["title"])}</span><span class="d">{E(g["summary"].split(". ")[0])}.</span></a></li>')
    b.append('</ol><p class="tong-sol-note">어디에 해당하는지 모르겠다면 <a href="../diagnosis/management/">경영전환 자가진단</a>으로 회사의 현재 위치부터 확인해 보십시오.</p>')
    b.append('</div></main>\n<div id="tong-footer-root"></div>\n<script src="../assets/js/navigation.js"></script>\n</body></html>\n')
    return head(title, desc, path, ld, 1) + '\n' + '\n'.join(b)


def main():
    os.makedirs(os.path.join(ROOT, 'solutions'), exist_ok=True)
    open(os.path.join(ROOT, 'solutions', 'index.html'), 'w', encoding='utf-8').write(index())
    for s in ORDER:
        d = os.path.join(ROOT, 'solutions', s); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(page(s))
    print('생성:', 1 + len(ORDER), '개 페이지')

if __name__ == '__main__':
    main()
