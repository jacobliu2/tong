/* ════════════════════════════════════════════════════════════════
   TONG 링크허브 중앙 설정  (links/hub-config.js)
   ────────────────────────────────────────────────────────────────
   메뉴를 추가·수정할 때는 이 파일만 고친다. index.html은 손대지 않는다.

   ▸ objects : PC 책가도 위의 사물 하나 = 항목 하나
       id      영문 식별자 (통계에 'hub_object'로 기록)
       label   툴팁·하위 메뉴 제목
       desc    툴팁 한 줄 설명
       hit     [left, top, width, height]  장면 이미지 대비 % 좌표
               (장면: assets/chaekgado/hub_scene.webp, 1672×941)
       tip     'up' | 'down'  툴팁을 사물 위/아래 중 어디에 띄울지 (공간이 없으면 자동 반전)
       href    단일 목적지면 href 하나
       menu    복수 목적지면 [{label, desc, href}] 배열 → 작은 하위 메뉴
       external true면 새 창 (외부 사이트)

   ▸ scroll : 모바일 족자 이미지 위의 투명 링크.
       족자 이미지에 글자가 그려져 있으므로 이미지와 같은 순서·같은 대상만 둔다.
       [top, height] 은 족자 이미지 대비 % (가로 범위는 공통 SCROLL_X).
       (족자: assets/chaekgado/mobile_scroll.webp, 941×1672)

   ▸ 족자에 없는 메뉴는 모바일에서 족자 아래 '더 둘러보기'에 자동으로 나타난다.
     (objects의 모든 목적지 중 scroll에 없는 것을 자동 수집)

   href 규칙: 내부 페이지는 '../폴더/' 슬래시형, 홈은 '../'.
   ════════════════════════════════════════════════════════════════ */
window.TONG_HUB = {

  SCROLL_X: [35, 47],   /* 족자 링크 가로 범위: left 35%, width 47% */

  objects: [
    { id:'books', label:'경영전환론', desc:'ABCDE·人營財産·오약으로 읽는 이론체계',
      hit:[7.7, 11, 14.7, 22.5], tip:'down',
      menu:[
        { label:'경영전환론 개요', desc:'ABCDE 전환 사이클과 人營財産', href:'../transformation/' },
        { label:'오약 五若',       desc:'기업의 상태를 읽는 다섯 언어',   href:'../transformation/oyak/' },
        { label:'경영전환 용어사전', desc:'개념과 용어를 한곳에',         href:'../glossary/' }
      ] },

    { id:'dxai-book', label:'DX·AI', desc:'AI 기반 경영전환과 업무전환',
      hit:[22.6, 14.5, 3.9, 19], tip:'down', href:'../dx-ai/' },

    { id:'vase', label:'TONG 소개', desc:'경영전환연구소 통 TONG',
      hit:[41.8, 10, 8.8, 23.5], tip:'down', href:'../tong/' },

    { id:'frame', label:'전문가 프로필', desc:'유영준 소장 소개',
      hit:[51.8, 11.3, 10.6, 22.4], tip:'down', href:'../expert/' },

    { id:'monitor-left', label:'LinkedIn', desc:'일과 생각을 연결합니다 (새 창)',
      hit:[33.7, 35.8, 18.6, 20], tip:'up', href:'https://www.linkedin.com/in/bxlab', external:true },

    { id:'monitor-right', label:'Brunch', desc:'일하는 사람의 생각과 기록 (새 창)',
      hit:[52.4, 35.8, 20.2, 20], tip:'up', href:'https://brunch.co.kr/@mansudang', external:true },

    { id:'open-book', label:'콘텐츠 서재', desc:'경영전환 이야기와 칼럼 아카이브',
      hit:[10.6, 49, 22.4, 16.5], tip:'up',
      menu:[
        { label:'아카이브',         desc:'주제별 칼럼·해설',       href:'../archive/' },
        { label:'경영전환 이야기',   desc:'재구성 사례와 FAQ',      href:'../story/' },
        { label:'고전 경영 인사이트', desc:'연재',                 href:'../archive/series/classic-insight/' }
      ] },

    { id:'brush-pot', label:'자가진단', desc:'경영전환 자가진단센터',
      hit:[4.4, 43, 5.3, 30], tip:'up', href:'../diagnosis/' },

    { id:'laptop', label:'홈페이지', desc:'경영전환연구소 통 TONG 홈',
      hit:[35.3, 56.5, 22, 24.5], tip:'up', href:'../' },

    { id:'teacup', label:'컨설팅', desc:'진단·경영전략 자문·전환 동행·AX',
      hit:[59.6, 59.5, 9.9, 10.8], tip:'up', href:'../consulting/' },

    { id:'documents', label:'문제별 해법', desc:'기업이 마주한 문제별 원인과 개선 방법',
      hit:[57.5, 76.5, 25.5, 13.5], tip:'up',
      menu:[
        { label:'문제별 해법 전체',        desc:'한눈에 보기',            href:'../solutions/' },
        { label:'대표 의존형 조직 개선',     desc:'원인·진단·실행 방법',     href:'../solutions/ceo-dependent-organization/' },
        { label:'직무·권한·책임(R&R) 정리', desc:'직원 10~50명 기업',      href:'../solutions/roles-and-responsibilities/' },
        { label:'영업 프로세스·CRM 개선',   desc:'진단부터 정착까지',       href:'../solutions/sales-process-crm/' },
        { label:'경영진단과 실행 로드맵',    desc:'무엇을 보고 어떻게 정하는가', href:'../solutions/diagnosis-roadmap/' },
        { label:'AI·DX 업무 운영체계(AX)',  desc:'도구 도입과 무엇이 다른가', href:'../solutions/ax-operations/' },
        { label:'정부지원사업 활용',        desc:'선정보다 먼저 정할 것',     href:'../solutions/government-support/' }
      ] },

    { id:'phone', label:'문의', desc:'상담 문의·전화·이메일',
      hit:[78.2, 61, 7, 17.5], tip:'up',
      menu:[
        { label:'상담 문의하기', desc:'상담 문의·회사소개서 요청', href:'../contact/' },
        { label:'전화하기',     desc:'010-8999-6359',          href:'tel:+821089996359' },
        { label:'이메일 보내기', desc:'jacobliu@workstong.com', href:'mailto:jacobliu@workstong.com' }
      ] },

    { id:'calendar', label:'미팅 예약', desc:'커피챗·미팅 일정 잡기 (새 창)',
      hit:[85.4, 57, 13.2, 18.5], tip:'up', href:'https://calendar.app.google/JuNuAFzf13dR8cS29', external:true }
  ],

  /* 모바일 족자 — 이미지에 그려진 7개 메뉴와 1:1 (순서 변경 금지)
     menu가 있는 줄은 누르면 아래에서 선택창이 올라온다. */
  scroll: [
    { label:'TONG 소개',  href:'../tong/',            top:25.06, height:6.22 },
    { label:'경영전환론',  href:'../transformation/',  top:31.34, height:6.22 },
    { label:'자가진단',    href:'../diagnosis/',       top:37.56, height:6.22 },
    { label:'컨설팅',      href:'../consulting/',      top:43.84, height:6.16 },
    { label:'LinkedIn',  href:'https://www.linkedin.com/in/bxlab', top:50.06, height:6.16, external:true },
    { label:'Brunch',    href:'https://brunch.co.kr/@mansudang',   top:56.28, height:6.04, external:true },
    { label:'상담·예약',   top:62.38, height:6.04,
      menu:[
        { label:'미팅 예약',    desc:'커피챗·미팅 일정 잡기',      href:'https://calendar.app.google/JuNuAFzf13dR8cS29', external:true },
        { label:'상담 문의하기', desc:'상담 문의·회사소개서 요청', href:'../contact/' },
        { label:'전화하기',     desc:'010-8999-6359',          href:'tel:+821089996359' },
        { label:'이메일 보내기', desc:'jacobliu@workstong.com', href:'mailto:jacobliu@workstong.com' }
      ] }
  ]
};
