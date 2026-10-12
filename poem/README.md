# 詩, 나의 이야기 — 배포용

이 폴더를 홈페이지 저장소의 공개 정적 파일 경로에 `poem/`으로 배치합니다.
- 일반 정적 홈페이지: 저장소 루트의 `poem/`
- public 디렉터리를 사용하는 앱: `public/poem/`

배포 후 주소: https://www.workstong.com/poem/ (서버가 /poem 을 /poem/ 으로 연결하도록 설정)
작품 공유: https://www.workstong.com/poem/#poem-180

index.html이 독립 화면을 제공하므로 회사 홈페이지 메뉴·푸터를 덧붙이지 않습니다. 홈페이지 메뉴에도 링크를 추가하지 않아도 됩니다.
서버 프레임워크를 사용하면 /poem 및 /poem/* 정적 파일 요청이 기존 홈페이지 라우터보다 먼저 처리되어야 합니다.

빌드나 데이터베이스·Supabase 키는 필요 없습니다. 262편의 시, 삽화 WebP, 로컬 폰트와 라이선스, Suno 연결 데이터가 포함됩니다.
Suno 음악은 외부 삽입 플레이어로 연결되며 자동재생은 브라우저 정책과 Suno 접근 상태에 따릅니다. 곡 종료 후 자동 다음 곡 기능은 제공하지 않습니다.
북마크는 브라우저 localStorage에 저장합니다. 기존 localhost 북마크는 내보내기 후 이 주소에서 가져오면 됩니다.
원문 PDF·PNG 원본·CSV·제작 로그·도구 스크립트는 배포에 필요하지 않아 제외했습니다.

업데이트: 제작 폴더에서 build_full_book.py 실행 후 index.html, assets/, data/assets.json과 변경된 illustrations/web 파일을 이 폴더에 반영합니다.
