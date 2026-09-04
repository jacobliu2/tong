# workstong.com — GitHub Pages 사이트 (실 파일)

Wix 의존을 제거한 정적 사이트. 작업지시서 §4 폴더구조·§5 클린 URL·§6 GNB·§7~13 HOME 흐름을 따랐고, 진단 9종의 계산·판정 로직은 원문 그대로 보존했다.

## 배포
1. 이 폴더 전체를 GitHub 레포에 push (또는 폴더째 업로드)
2. Settings > Pages에서 소스 지정 → `CNAME`이 www.workstong.com 고정
3. DNS를 Wix → GitHub Pages로 전환

## 로컬 확인 (서버·GitHub 불필요)
`preview.html` 더블클릭 → 왼쪽 목록에서 20개 페이지 클릭.
개별 페이지는 각 폴더의 `index.html`을 직접 열어도 됨(상대경로).

## 구조 (클린 URL)
```
/                     index.html          (HOME · §7~13)
/transformation/      경영전환론 + ABCDE 그래프
/tong/                通 브랜드 철학 (窮則變 變則通 通則久)
/diagnosis/           진단 허브 (§16)
/diagnosis/management|organization|leader|sales|market|finance|dx|
          government-support|pyramid/     진단 9종 (로직 원문 보존)
/writings/  /about/  /links/  /contact/   글·소개·링크·문의
/dx/                  DX 동행 (GNB 제외, 푸터/본문 링크로 접근)
assets/css/tong.css   디자인 정본(공통)   assets/js/navigation.js  공통 네비/푸터
robots.txt  sitemap.xml  404.html(구 한글URL→신URL 리다이렉트)  CNAME
```

## 남은 연결 작업 (1건)
- `contact/index.html` 폼의 `YOUR_FORM_ID`를 Formspree 발급 ID로 교체 → 문의가 이메일로 수신.
  (교체 전에는 캘린더 예약·전화 링크가 대신 동작.)

## 보존 원칙
- 진단 QUESTIONS/AXES/SCALE_LABELS/compute*/calc* 로직 = 불가침 (원문 유지)
- 人營財産(營, 市 아님)·ABCDE·BX Point = 코드 확인된 정본만 사용
