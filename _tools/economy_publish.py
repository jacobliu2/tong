# -*- coding: utf-8 -*-
"""TONG 비즈니스 이코노미 HTML을 /economy/ 공개본으로 만든다 (히든 게시: 검색 제외, 메뉴·사이트맵 미등록).
게임 코드는 그대로 두고 아래만 처리한다.
 1) 파일 맨 위 'saved from url' 주석(로컬 PC 경로) 제거
 2) <head>에 검색 제외·파비콘·Pretendard 글꼴·화면 버전번호 정리 스크립트(assets/js/economy-clean.js) 추가
실행: python3 _tools/economy_publish.py <새 버전 HTML 경로>
"""
import sys, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1]
s = open(src, encoding='utf-8').read()
s = re.sub(r'\A(<!DOCTYPE html>\s*)<!-- saved from url=[^\n]*-->\n?', r'\1', s, flags=re.I)
i = s.find('<head>'); assert 0 < i < 400, '<head> 위치 확인 필요'
inj = ('<meta name="robots" content="noindex, nofollow"/>'
       '<link rel="icon" href="../assets/images/tong-logo.png"/>'
       '<style>@font-face{font-family:Pretendard;font-weight:45 920;font-style:normal;font-display:swap;'
       "src:url('../assets/fonts/PretendardVariable.woff2') format('woff2-variations'),url('../assets/fonts/PretendardVariable.woff2') format('woff2')}</style>"
       '<script src="../assets/js/economy-clean.js"></script>')
s = s[:i+6] + inj + s[i+6:]
os.makedirs(os.path.join(ROOT, 'economy'), exist_ok=True)
open(os.path.join(ROOT, 'economy', 'index.html'), 'w', encoding='utf-8').write(s)
print('생성: economy/index.html', len(s))
