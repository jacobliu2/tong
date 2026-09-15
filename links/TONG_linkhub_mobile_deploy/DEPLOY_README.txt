TONG 링크허브 — 모바일 개선 배포 안내
=====================================

[1] index.html
    현재 링크허브(/links/index.html)를 이 파일로 교체.
    - PC(.stage) 영역: 원본과 100% 동일 (미변경)
    - 모바일(.vstage) 영역만 단일 통이미지 + 오브젝트 오버레이 방식으로 교체

[2] assets 폴더
    아래 구조 그대로 리포지토리에 복사 (기존 assets/chaekgado 아래에 mobile/ 추가):

    assets/chaekgado/mobile/00_mobile_base_scene.webp
    assets/chaekgado/mobile/obj/transformation.webp
    assets/chaekgado/mobile/obj/tong.webp
    assets/chaekgado/mobile/obj/diagnosis.webp
    assets/chaekgado/mobile/obj/consult.webp
    assets/chaekgado/mobile/obj/consult_inkstone.webp
    assets/chaekgado/mobile/obj/linkedin.webp
    assets/chaekgado/mobile/obj/brunch.webp
    assets/chaekgado/mobile/obj/home.webp
    assets/chaekgado/mobile/obj/phone.webp
    assets/chaekgado/mobile/obj/meeting.webp
    assets/chaekgado/mobile/obj/email.webp

[핵심 변경/판단]
- 데모의 svg/*.svg(→ ../obj/*.png 참조) 대신 obj 이미지를 <img>로 직접 참조.
  이유: 브라우저는 <img>로 불러온 SVG 내부의 외부 이미지 참조를 차단하므로
  데모 구조 그대로면 실기기에서 halo가 빈 화면으로 렌더될 위험이 있음.
- 오브젝트 PNG(968KB) → webp(158KB, 84%↓). 투명도 보존. 베이스 webp 248KB.
  모바일 총 자산 ~406KB.
- 모바일 <img>에 loading="lazy" 적용 → PC 방문자는 모바일 자산을 내려받지 않음(검증 완료).
- 라벨은 통이미지에 인쇄되어 hover 없이 상시 노출. 한 번 탭 = 즉시 이동,
  touchstart 순간 해당 오브젝트만 TONG Blue halo로 짧게 강조.

배포 경로를 바꾸고 싶으면 index.html의 "../assets/chaekgado/mobile/" 12곳을
원하는 경로로 치환하면 됨.
