# -*- coding: utf-8 -*-
"""/expert/ 유영준 공식 프로필 생성기
원칙: 본인 LinkedIn 프로필 데이터(2026-10-27 내보내기)와 본인이 확인한 사실만 쓴다.
CONFIRM 표시 항목은 배포 전 확인 대상이다.
실행: python3 _tools/expert_build.py && node _tools/prerender-nav.js
"""
import os, sys, json, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from solutions_build import head, crumbs_ld, SITE, ORG, ORG_LD
from solutions_content import PAGES as SOL, ORDER as SOL_ORDER

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
E = lambda s: html.escape(s, quote=False)

P = dict(
    name='유영준',
    title='경영전환연구소 통 소장',
    intro=['일과 사람을 잇는 일을 합니다. 중소기업의 문제는 사람의 능력보다 경영의 구조에서 시작되는 경우가 많아, 사람을 바꾸기보다 구조를 먼저 봅니다. 대표 중심의 운영을 시스템 중심의 경영으로 바꾸고 전략을 실행으로 잇는 일을 "경영전환"이라는 관점으로 연구하고 설계합니다.',
           '좋은 기업은 사람이 열심히 일하는 기업이 아니라 구조가 일하는 기업이라고 믿습니다.'],
    expertise=[('경영전환 진단과 실행 로드맵', 'diagnosis-roadmap'), ('대표 의존형 조직 개선', 'ceo-dependent-organization'),
               ('직무·권한·책임 정리', 'roles-and-responsibilities'), ('영업 프로세스와 CRM', 'sales-process-crm'),
               ('AI·DX 업무 전환', 'ax-operations'), ('정부지원사업 활용', None)],
    career=[('경영전환연구소 통', '소장'), ('코리아경영자문(KBMC)', '전략파트장')],
    research=['경영전환론 — ABCDE 전환 사이클, 人營財産 4축, 오약(五若)·사도(四度) 체계',
              '경영 자가진단 16종 설계 (조직유형 16, 리더 유형, 영업 신호등, 대표 의존도 등)',
              '연재 — 인사만사, 비즈니스 삼십육계, 경영전환 생각창고, 고전 경영 인사이트'],
    same_as=['https://www.linkedin.com/in/bxlab', 'https://brunch.co.kr/@mansudang'],
    channels=[('LinkedIn', 'https://www.linkedin.com/in/bxlab'), ('브런치 (필명 만수당)', 'https://brunch.co.kr/@mansudang')],
)


def build():
    path = 'expert/'
    title = '유영준 — 경영전환연구소 통 소장 | 통 TONG'
    desc = '경영전환론을 만든 유영준 소장의 공식 프로필. 전문 분야와 활동, 연구, 상담 방법을 안내합니다.'
    person = {"@type": "Person", "@id": SITE + "/expert/#person", "name": P['name'], "jobTitle": P['title'],
              "worksFor": ORG_LD, "url": SITE + "/expert/", "image": SITE + "/assets/images/profile.png",
              "sameAs": P['same_as'],
              "knowsAbout": ["경영전환", "중소기업 경영컨설팅", "조직 구조 개선", "영업 프로세스", "CRM", "AI·DX 업무 전환", "정부지원사업"],}
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "ProfilePage", "url": SITE + "/" + path, "name": title, "inLanguage": "ko", "mainEntity": {"@id": SITE + "/expert/#person"}},
        person, crumbs_ld([('홈', ''), ('유영준', path)])]}
    b = ['<body data-nav="" data-depth="1">\n<div id="tong-nav-root"></div>\n<main class="tong-sol">',
         '<header class="tong-sol-hero"><div class="tong-sol-in tong-exp-head">',
         '<img class="tong-exp-photo" src="../assets/images/profile.png" alt="유영준 소장" width="120" height="120"/>',
         '<div><nav class="tong-sol-crumb" aria-label="현재 위치"><a href="../">홈</a> / <span>유영준</span></nav>',
         f'<h1>{E(P["name"])}</h1><p class="tong-sol-lead" style="margin-top:8px">{E(P["title"])}</p></div>',
         '</div></header><div class="tong-sol-in tong-sol-body">']
    b.append('<section><h2><span>01</span>소개</h2>' + ''.join(f'<p>{E(p)}</p>' for p in P['intro']) + '</section>')
    items = []
    for t, sl in P['expertise']:
        items.append(f'<li><a href="../solutions/{sl}/">{E(t)}</a></li>' if sl else f'<li>{E(t)}</li>')
    b.append('<section><h2><span>02</span>전문 분야</h2><ul>' + ''.join(items) + '</ul></section>')
    b.append('<section><h2><span>03</span>활동</h2><ul>' + ''.join(f'<li><b>{E(o)}</b> {E(r)}</li>' for o, r in P['career']) + '</ul></section>')
    b.append('<section><h2><span>04</span>연구와 저작</h2><ul>' + ''.join(f'<li>{E(x)}</li>' for x in P['research']) + '</ul>'
             '<p>경영전환론의 개념은 <a href="../transformation/">경영전환</a>에서, 진단 도구는 <a href="../diagnosis/">자가진단</a>에서 보실 수 있습니다.</p></section>')
    b.append('<section><h2><span>05</span>공식 채널</h2><ul>' + ''.join(
        f'<li><a href="{html.escape(u)}" target="_blank" rel="noopener me">{E(n)}</a></li>' for n, u in P['channels']) + '</ul></section>')
    b.append('<section><h2><span>06</span>상담</h2><p>아직 어떤 방식이 필요한지 정하지 않으셔도 됩니다. 지금 상황을 듣고 필요한 것부터 함께 정리합니다.</p>'
             '<p class="tong-sol-cta"><a class="tong-btn tong-btn-primary" href="../contact/">상담 문의하기 →</a></p></section>')
    b.append('</div></main>\n<div id="tong-footer-root"></div>\n<script src="../assets/js/navigation.js"></script>\n</body></html>\n')
    os.makedirs(os.path.join(ROOT, 'expert'), exist_ok=True)
    open(os.path.join(ROOT, 'expert', 'index.html'), 'w', encoding='utf-8').write(head(title, desc, path, ld, 1) + '\n' + '\n'.join(b))
    print('생성: expert/index.html')

if __name__ == '__main__':
    build()
