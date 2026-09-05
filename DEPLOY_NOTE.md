# URL 정리 적용 내역 (index.html 노출 제거)

## 무엇이 바뀌었나

1. **내부 링크 81곳** — `href="../contact/index.html"` → `href="../contact/"`
2. **assets/js/navigation.js** — 공용 GNB/푸터의 ROUTES를 슬래시 형태로 변경
   - `r('index.html')` → `r('')`, `r('diagnosis/index.html')` → `r('diagnosis/')`
3. **주소창 자동 정리 스니펫** — navigation.js 선두에 삽입
   - 옛 링크(`/transformation/index.html`)로 들어와도 주소창만 조용히 `/transformation/`으로 정리
   - `history.replaceState` 방식이라 새로고침·깜빡임 없음
   - navigation.js를 쓰지 않는 `links/index.html`에는 인라인으로 삽입

## 바뀌지 않은 것

- 진단 로직, 문항, 채점, 결과 표시 — 무변경
- 문구, 스타일, 레이아웃 — 무변경
- canonical / og:url / sitemap.xml — 이미 슬래시 형태였으므로 그대로
- CNAME, robots.txt, .nojekyll, 404.html의 Wix 구슬러그 매핑 — 그대로

## 검증 결과

- 내부 링크 179건 전수 확인 — 깨진 링크 0
- 원본 대비 diff — index.html 제거 외 변경 0라인
- 브라우저 실행 확인
  - `/transformation/index.html` 진입 → 주소창 `/transformation/`
  - `/diagnosis/organization/index.html` → `/diagnosis/organization/`
  - `/links/index.html` → `/links/`
  - GNB 클릭 이동(경영전환·자가진단·컨설팅·문의) 전부 정상

## 배포

기존 리포지토리에 그대로 덮어쓰고 푸시하면 됩니다.

```bash
git add -A
git commit -m "URL 정리: 내부 링크에서 index.html 제거"
git push
```

## 배포 후 권장

이미 `.../index.html`로 색인된 주소가 있다면, canonical이 슬래시 형태이므로
구글이 수 주 내 정리합니다. Search Console에서 sitemap 재제출을 하면 회수가 빨라집니다.

## 앞으로 페이지를 추가할 때

`index.html`을 링크에 쓰지 마시고 폴더 경로로만 거십시오.
- 나쁨: `<a href="../newpage/index.html">`
- 좋음: `<a href="../newpage/">`
