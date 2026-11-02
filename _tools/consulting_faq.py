# -*- coding: utf-8 -*-
"""컨설팅 페이지 FAQ 원고와 삽입기. 수정 후: python3 _tools/consulting_faq.py && node _tools/prerender-nav.js
FAQ 섹션과 FAQPage JSON-LD를 consulting/index.html의 표시 구간(<!--faq-->)에 다시 써 넣는다.
"""
import os, re, json, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'consulting', 'index.html')

# (질문, 답변 문단 목록, 답변 끝 링크(선택))
FAQ = [
 ('첫 상담에서는 무엇을 하나요?',
  ['현재 상황과 문제를 듣습니다.', '아직 어떤 컨설팅이 필요한지 정하지 않으셔도 됩니다. 이야기를 듣고 진단, 자문, 동행, AX 가운데 필요한 방식부터 함께 정리합니다.'], None),
 ('상담 전에 준비할 것이 있나요?',
  ['따로 준비하실 것은 없습니다.', '다만 자가진단을 먼저 해 보시고 그 결과를 가지고 오시면 대화가 훨씬 빨라집니다.'], ('../diagnosis/', '자가진단 보기')),
 ('네 가지 서비스 중 무엇을 골라야 하나요?',
  ['무엇이 문제인지 모르겠다면 경영전환 진단, 중요한 결정과 변화 방향을 함께 정하고 싶다면 경영전략 자문, 정해진 과제를 실제로 추진하고 싶다면 경영전환 동행, 업무를 AI·시스템으로 개선하고 싶다면 AX·업무전환이 맞습니다.', '판단이 어려우시면 상담에서 함께 정합니다.'], None),
 ('기간과 진행 방식은 어떻게 정하나요?',
  ['기업 상황과 과제 범위에 따라 다릅니다.', '상담 후 수행방식과 함께 제안드립니다. 외부 전략실은 격주형과 주간형이 있고, 참여 범위는 협의해 정합니다.'], None),
 ('세무·노무·법률 문제도 함께 보나요?',
  ['세무·회계·법률·노무는 별도 전문 영역입니다.', '경영 판단에 필요한 범위에서 쟁점을 정리하고, 해당 판단은 전문가의 검토를 받도록 안내합니다.'], None),
 ('정부지원사업도 도와주나요?',
  ['사업계획서를 대신 써 드리거나 선정을 약속하지 않습니다.', '지원사업을 사업의 목적이 아니라 도구로 쓸 수 있도록, 사업의 방향을 먼저 정하고 그에 맞는 사업군과 준비 순서를 함께 설계합니다.'],
  ('../solutions/government-support/', '정부지원사업 활용 설계 보기')),
]

CSS = ('.cfaq .faq{max-width:820px;margin:0 auto}.cfaq .faq details{border-bottom:1px solid var(--line,#e3e9f3);padding:6px 0}'
       '.cfaq .faq summary{cursor:pointer;list-style:none;padding:20px 40px 20px 4px;font-size:clamp(16px,1.9vw,18.5px);font-weight:700;color:var(--ink,#0f1b33);position:relative}'
       '.cfaq .faq summary::-webkit-details-marker{display:none}'
       '.cfaq .faq summary::after{content:"+";position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:22px;font-weight:400;color:var(--blue,#3684FF);transition:transform .25s}'
       '.cfaq .faq details[open] summary::after{transform:translateY(-50%) rotate(45deg)}'
       '.cfaq .faq summary:hover{color:var(--blue,#3684FF)}'
       '.cfaq .faq details p{margin:0 4px 18px;color:var(--ink2,#44516a);line-height:1.8;font-size:15.5px}'
       '.cfaq .faq details a{color:var(--blue,#3684FF);font-weight:700;text-decoration:none}')

E_ = lambda s: html.escape(s, quote=False)

def section():
    items = []
    for q, ps, link in FAQ:
        body = '<br>'.join(E_(p) for p in ps)
        if link:
            body += f'<br><a href="{link[0]}">{E_(link[1])} →</a>'
        items.append(f'<details class="reveal"><summary>{E_(q)}</summary><p>{body}</p></details>')
    return ('<!--faq--><style>' + CSS + '</style><section class="sec cfaq" id="faq"><div class="cw"><div class="eb reveal">07 · 자주 묻는 질문</div>'
            '<h2 class="reveal" style="--d:60ms">상담 전에 궁금하실 만한 것들.</h2><div class="faq">' + ''.join(items) + '</div></div></section><!--/faq-->')

def ld():
    d = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": ' '.join(ps)}} for q, ps, _ in FAQ]}
    return '<!--faqld--><script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + '</script><!--/faqld-->'

def main():
    s = open(P, encoding='utf-8').read()
    s = re.sub(r'<!--faq-->[\s\S]*?<!--/faq-->', '', s)
    s = re.sub(r'<!--faqld-->[\s\S]*?<!--/faqld-->', '', s)
    anchor = '<section class="cfin">'
    assert s.count(anchor) == 1
    s = s.replace(anchor, section() + anchor)
    s = s.replace('</head>', ld() + '</head>', 1)
    open(P, 'w', encoding='utf-8').write(s)
    print('컨설팅 FAQ', len(FAQ), '문항 반영')

if __name__ == '__main__':
    main()
