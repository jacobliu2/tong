# 아카이브 글 운영 방식

## 한눈에

```
구글 드라이브 / TONG 원고
 ├─ 초안        소장이 자유롭게 쓰는 곳 (비공개)
 ├─ 발행 대기   공개해도 되는 글을 여기로 옮기면 발행 요청
 ├─ 발행 완료   사이트에 올라간 글의 원고
 └─ 링크드인 원본  링크드인 게시물 전체 보관본 (분기별)
        ↓  "올려 줘" 또는 정기 실행 시 Claude가 처리
홈페이지 저장소 / content/archive/<주소>.md  (글 하나 = 파일 하나)
        ↓  node _build/build-archive.mjs
/archive/ 정적 페이지 + sitemap.xml  →  GitHub에 반영 → 사이트 공개
```

## 드라이브 폴더 ID (jacobliu@workstong.com 소유)

| 폴더 | ID |
|---|---|
| TONG 원고 | 1Lkt2VBz5HaYx47fXa5EywElQF5M3ET8v |
| 1. 초안 | 1a6MnNlIGdDIeoLkcVWpgShUABVdsRv85 |
| 2. 발행 대기 | 1hrX8zmZdxtWU-GlInzkvZYG3HI3I7B9e |
| 3. 발행 완료 | 1i_-Y3xKOfuzSaoZn-2a05xpzfg7oJlxq |
| 4. 링크드인 원본 | 11FIw-FGPxlbvXcdxx3eyz9cCVrXBR71t |

## 원칙

- "발행 대기" 폴더에 있는 글만 올린다. 초안 폴더의 글은 손대지 않는다.
- 초안은 공개 저장소에 넣지 않는다. 저장소에는 공개할 글만 들어간다.
- 올린 뒤 원고는 "발행 완료"로 옮기고, 무엇을 올렸는지 보고한다.

## 원고 쓰는 법 (구글 문서)

- 첫 줄: 제목
- 둘째 줄부터: 본문. 소제목은 구글 문서의 "제목 2" 스타일을 쓰면 그대로 소제목이 된다.
- 문서 맨 아래에 선택 메모를 적을 수 있다. 예: `메모: 대표 의존 진단과 연결`, `메모: 원문 링크드인 주소 …`
- 요약, 주제 분류, 연재, 관련 진단 연결, 주소(영문)는 Claude가 붙이고 보고한다. 바꾸고 싶으면 보고를 보고 말하면 된다.

## 글 파일 형식 (content/archive/<주소>.md)

```
---
title: "제목"
summary: "목록과 검색결과에 보일 1~2문장"
date: 2026-10-28T09:00:00+09:00      # 최초 작성일
updated: 2026-11-02T10:00:00+09:00   # 내용을 고친 경우만
type: column                          # column(칼럼) | guide(해설) | research(연구)
category: organization                # content/taxonomy.json 의 categories
secondary: ["strategy"]
series: classic-insight               # 없으면 null
diagnoses: ["organization"]           # 관련 자가진단 (최대 2)
services: ["roles-and-responsibilities"]
source: linkedin                      # 원문이 있으면
source_url: "https://..."
toc: false                            # 소제목이 많으면 true
---
본문 (Markdown)
```

- 파일 이름이 곧 주소다. 한 번 공개한 글의 파일 이름은 바꾸지 않는다(기존 링크가 끊긴다).
- 글을 내릴 때는 파일을 지우고 다시 빌드한다. 빌드가 해당 페이지와 sitemap 항목을 함께 지운다.

## 빌드

```
cd _build && npm install && cd ..
node _build/build-archive.mjs     # 끝에 문장 단위 줄바꿈(_tools/sentence_breaks.py)이 자동 실행된다
node _tools/prerender-nav.js     # 메뉴·푸터를 바꿨을 때만
```

- 빌드는 머리말 누락, 알 수 없는 분류, 잘못된 파일 이름을 만나면 멈추고 이유를 알려 준다.
- 공개 글이 0편으로 읽히면 기존 아카이브를 지우지 않고 멈춘다(실수로 폴더를 비웠을 때 대비).

## 나중에 CMS가 필요해지면

Supabase 기반 관리자 화면(로그인·자동저장·버전 기록)을 한 차례 만들어 두었다가 운영 방식을 바꾸며 저장소에서 뺐다. 코드는 별도 보관본(cms-archive.zip)에 있다. 글 파일은 그대로 DB로 옮길 수 있는 구조다.
