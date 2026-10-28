#!/usr/bin/env python3
"""두 문장 이상이 한 덩어리로 붙어 있는 화면 문구를 문장 단위로 줄바꿈한다.

- 문장 끝(. ? !, 뒤따르는 닫는 따옴표·괄호 포함) 다음의 공백을 <br class="sb">로 바꾼다.
- 같은 텍스트 조각 안에서만 바꾼다. 태그 사이에 걸친 경계는 건드리지 않는다.
- 다시 실행해도 결과가 같다(이미 줄바꿈된 곳에는 공백이 없으므로).
- 손대지 않는 곳: script·style 등 코드, 메뉴·푸터, 버튼·선택지, 괄호나 따옴표 안,
  아카이브 글 본문(.tong-prose, 원문이 이미 문장 단위), 개인정보처리방침 조문(article.doc),
  links/·poem/ 독립 화면.

실행: 저장소 루트에서 python3 _tools/sentence_breaks.py
      (각 생성기와 build-archive.mjs 실행 뒤, prerender-nav.js 전후 아무 때나)
"""
import re, os, glob, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = ('poem/', 'links/', '_build/', 'node_modules/', 'content/')
SKIP_TAGS = {'script', 'style', 'noscript', 'textarea', 'title', 'head', 'button', 'select', 'option',
             'code', 'pre', 'svg', 'nav', 'footer', 'label'}
SKIP_CLASS = re.compile(r'(^|\s)(tong-prose|tong-nav[\w-]*|tong-footer[\w-]*|doc)(\s|$)')
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}

TOKEN = re.compile(r'(<!--.*?-->|<[^>]+>)', re.S)
TAGNAME = re.compile(r'^<\s*(/?)\s*([a-zA-Z0-9]+)')
CLASSATTR = re.compile(r'\bclass\s*=\s*"([^"]*)"|\bclass\s*=\s*\'([^\']*)\'')

# 문장 끝: 한글·영문·숫자·닫는 기호 뒤의 . ? ! (+ 닫는 따옴표/괄호) 뒤 공백, 그 다음이 글자
BOUND = re.compile(r'(?<=[가-힣A-Za-z0-9%\)\]’”"』」])([.?!]+)([’”"』」\)\]]*)(\s+)(?=[^\s(（\[\-–—·•…])')
OPEN_PAIRS = {'(': ')', '（': '）', '[': ']', '“': '”', '「': '」', '『': '』', '‘': '’'}


def inside_pair(text, pos):
    """pos 위치가 같은 텍스트 조각 안의 괄호·따옴표 안쪽인지"""
    depth = 0
    stack = []
    straight = 0
    for ch in text[:pos]:
        if ch in OPEN_PAIRS:
            stack.append(OPEN_PAIRS[ch])
        elif stack and ch == stack[-1]:
            stack.pop()
        elif ch == '"':
            straight ^= 1
    return bool(stack) or straight == 1


def is_number_dot(text, start):
    # "1. " "2026. " 같은 번호·연도, 영문 약어 한 글자("Q. ")는 문장 끝으로 보지 않는다
    before = text[:start]
    m = re.search(r'(\S+)$', before)
    word = m.group(1) if m else ''
    return bool(re.fullmatch(r'\d+', word)) or bool(re.fullmatch(r'[A-Za-z]', word))


def break_text(text):
    out = []
    last = 0
    n = 0
    for m in BOUND.finditer(text):
        if m.group(1) == '...' or m.group(1).startswith('..'):
            continue
        if m.group(1) == '.' and is_number_dot(text, m.start(1)):
            continue
        if inside_pair(text, m.start(1)):
            continue
        ws_start = m.start(3)
        out.append(text[last:ws_start])
        out.append('<br class="sb">')
        last = m.end(3)
        n += 1
    out.append(text[last:])
    return ''.join(out), n


def process(html):
    parts = TOKEN.split(html)
    skip_stack = []  # [tagname, depth]
    total = 0
    for i, part in enumerate(parts):
        if not part:
            continue
        if part.startswith('<'):
            if part.startswith('<!--') or part.startswith('<!'):
                continue
            m = TAGNAME.match(part)
            if not m:
                continue
            closing, name = m.group(1) == '/', m.group(2).lower()
            if skip_stack:
                top = skip_stack[-1]
                if name == top[0] and name not in VOID and not part.endswith('/>'):
                    top[1] += -1 if closing else 1
                    if top[1] == 0:
                        skip_stack.pop()
                continue
            if closing or name in VOID or part.endswith('/>'):
                continue
            cm = CLASSATTR.search(part)
            cls = (cm.group(1) or cm.group(2)) if cm else ''
            if name in SKIP_TAGS or (cls and SKIP_CLASS.search(cls)):
                skip_stack.append([name, 1])
            continue
        if skip_stack:
            continue
        new, n = break_text(part)
        if n:
            parts[i] = new
            total += n
    return ''.join(parts), total


def main():
    files = [f for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True)]
    grand = 0
    changed = 0
    for f in sorted(files):
        rel = os.path.relpath(f, ROOT).replace(os.sep, '/')
        if rel.startswith(SKIP_DIRS):
            continue
        s = open(f, encoding='utf-8').read()
        t, n = process(s)
        if n:
            open(f, 'w', encoding='utf-8').write(t)
            grand += n
            changed += 1
            if '-v' in sys.argv:
                print(f'{n:4d}  {rel}')
    print(f'문장 줄바꿈: {changed}개 파일, {grand}곳')


if __name__ == '__main__':
    main()
