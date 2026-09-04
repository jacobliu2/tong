# MIGRATION_AUDIT.md
**workstong.com · 경영전환론 공식 디지털 본진 구축 — Phase 0 감사**
정본: 첨부 기존 코드 14종. 이 문서는 분석 전용(코드 무수정).

## 1. 브랜드 위계 (§2 · 절대 불변)
```
경영전환(최상위)
 ├ 경영전환론 : ABCDE · BX Point · 人營財産 · 오약(五若) · 333 로드맵 · 피라미드 · 16 조직유형
 ├ 진단체계
 ├ 경영전환 실무 : 조직·인사 / 영업·마케팅 / 재무·자금 / 제품·사업 / CRM / DX / AI·AX
 ├ 연구와 저작
 └ TONG
```
DX·CRM·AI는 경영전환과 동급이 아니라 **실행 영역**. 유영준은 **연구책임자** 수준 노출.

## 2. 정본 파일 · 유형 · 보존 로직
| 원본 | 유형 | 핵심 보존 대상 |
|---|---|---|
| 메인 | Wix조각 | 通 히어로·진단 진입 구조 |
| 통/通/TONG(about) | Wix조각 | 계사전 `窮則變 變則通 通則久`·자강자존자생 |
| 경영전환 | Wix조각+JS | **ABCDE 곡선 인터랙션**·오약 오행 순환도·四軸/八略/十六策/四十計 |
| DX 동행 | Wix조각+JS | DX 7단계·"종착=경영전환" 논리 (위치: 실무>AI·DX) |
| 링크트리 | 완결HTML | 프로필·외부동선 (보조 유틸, 핵심 IA 제외) |
| 진단 9종 | 완결HTML×8+조각×1 | **QUESTIONS·AXES·SCALE·compute*/calc* 로직 원문 불가침** |

진단 로직(확인): 경영전환 자가진단=BX Point+人營財産+ABCDE(15문항) / 조직유형=40문항·16유형 / 리더=P·D·C·F / 영업=STAGES / 시장=USP·PMF·POSITION·EVOLUTION / 재무=8지표 / 정부지원=G·E·T·D·H·F·C / DX=단계형 / 피라미드=KT·성과그룹.

## 3. 보존 디자인 자산 (§1)
#3684FF · 넓은 여백 · 절제된 glass · Serif+Sans · SVG 도식 · 진단 인터랙션 · 애니메이션.
폰트 통일: 진단군 Pretendard / 마케팅군 Noto Serif+Sans → 사이트 톤 통일 대상.
base64 로고(88KB)·프로필(4.7KB) → `assets/images/` 분리(완료).

## 4. Wix 종속 (제거 대상)
`target="_top"` 23곳 · `workstong.com/<한글슬러그>` 절대링크 전역 · 조각 5종 `<head>`/네비 부재 · Wix 라우팅. 서버연산·결제·로그인 없음.

## 5. 신규 URL 매핑 (§5 · 폴더형)
| 구 Wix(한글) | 신 URL |
|---|---|
| / | `/` |
| /통-通-tong | `/tong/` |
| /경영전환 | `/transformation/` (+ `/abcde/ /bx-point/ /in-young-jae-san/ /oyak/ /pyramid/ /organization-types/`) |
| /경영전환-상태분석 | `/diagnosis/management/` |
| /조직유형-자가진단 | `/diagnosis/organization/` |
| /리더유형-자가진단 | `/diagnosis/leader/` |
| /세일즈-신호등-진단 | `/diagnosis/sales/` |
| /시장경쟁력-자가진단 | `/diagnosis/market/` |
| /재무-건강도-자가진단 | `/diagnosis/finance/` |
| /경영전환-피라미드 | `/diagnosis/pyramid/` |
| (DX 단계) | `/diagnosis/dx/` |
| /정부지원사업-자가진단 | `/diagnosis/government-support/` |
| /dx-동행 | `/practice/` 내 AI·DX |
| (신규) 실무 | `/practice/` (+조직/영업/재무/사업/AI·DX) |
| (신규) 연구 | `/research/` |
| /문의하기 | `/contact/` |
| /blog·링크 | `/links/` (보조) |

## 6. GNB (§6)
경영전환론(/transformation/) · 진단체계(/diagnosis/) · 경영전환 실무(/practice/) · 연구와 저작(/research/) · TONG(/tong/) + CTA 문의하기. '유영준' 메뉴 없음.

## 7. 다음 단계
Phase 3 = HOME. **HOME 승인 전 타 페이지 디자인 확정 금지**(§32). practice/research는 스텁만 둠.
