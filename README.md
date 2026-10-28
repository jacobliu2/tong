# workstong.com — GitHub Pages 정적 사이트

빌드 도구·서버·DB 없는 정적 HTML 사이트. 커스텀 도메인은 `CNAME`(www.workstong.com).
현행 구조와 위험 요소의 상세는 `CURRENT_SYSTEM_AUDIT.md` 참조.

## 구조 (폴더형 클린 URL)
```
/                         메인
/tong/                    TONG 브랜드
/transformation/          경영전환론 (ABCDE·人營財産)
/transformation/oyak/     오약(五若)
/consulting/              컨설팅 4개 서비스
/dx-ai/                   DX·AI
/story/                   경영전환 이야기 (재구성 사례·FAQ)
/diagnosis/               자가진단 허브 + 16종 (각 폴더)
/contact/                 문의 폼(Web3Forms) + 캘린더 예약
/privacy/                 개인정보처리방침
/links/                   책가도 링크 허브 (독립 레이아웃, sitemap 제외)
/poem/                    詩, 나의 이야기 (독립 사이트, poem/README.md)
404.html                  구 Wix 한글 슬러그 → 신 URL (JS 리디렉션)
assets/css/tong.css       공통 디자인 토큰·컴포넌트
assets/js/navigation.js   공통 GNB·푸터·보기 설정
assets/js/analytics.js    방문 통계(ID 입력 시 활성) + 문의 유입 기록
/solutions/               문제별 해법 5종 + 목록 (생성 페이지)
/archive/                 아카이브 (빌드 생성물, 직접 수정 금지)
/expert/                  유영준 소장 프로필 (메뉴 비노출)
content/archive/*.md      아카이브 글 원본 (글 하나 = 파일 하나)
content/taxonomy.json     주제·연재·진단·해법 분류표
_build/build-archive.mjs  아카이브 생성기
_docs/CONTENT_WORKFLOW.md 구글 드라이브 원고 → 사이트 발행 운영 방식
_tools/prerender-nav.js   GNB·푸터 정적 폴백 생성기
_tools/diagnosis_guides.py  진단 16종 해설 블록 원고·생성기
_tools/solutions_content.py 문제별 해법 원고 / solutions_build.py 생성기
_tools/expert_build.py    전문가 프로필 생성기
_tools/sentence_breaks.py 두 문장 이상 문구를 문장 단위로 줄바꿈 (생성기·아카이브 빌드가 자동 실행)
```

원고 수정 순서: 원고 파일 수정 → `python3 _tools/solutions_build.py` 또는 `python3 _tools/diagnosis_guides.py` → `node _tools/prerender-nav.js`

## 운영 규칙
- 링크는 폴더형으로: `href="../newpage/"` (index.html 금지)
- 진단 16종의 문항·가중치·채점식·판정 로직은 수정 금지
- `navigation.js`의 메뉴나 푸터를 고친 뒤에는 저장소 루트에서 `node _tools/prerender-nav.js` 실행 후 커밋
  (각 페이지 소스에 메뉴·푸터 HTML이 미리 들어가 있어 JS를 실행하지 않는 검색 크롤러도 읽을 수 있음)
- 새 페이지는 `<div id="tong-nav-root"></div>` / `<div id="tong-footer-root"></div>`와 navigation.js를 넣고, 위 스크립트를 한 번 실행
- 방문 통계: `assets/js/analytics.js`의 CONFIG 한 곳에서 관리 (GTM-WFQ2X23S, 네이버 1d335814f4270d0). GA4(G-BNC0PC7LY9)는 `GA4_ID`로 직접 불러오며, GTM 컨테이너 안에는 GA4 태그를 넣지 않는다(중복 집계 방지). 도구를 바꾸면 개인정보처리방침 제6·7·10조도 함께 고친다

## 배포
`main`에 push하면 GitHub Pages가 배포한다.
