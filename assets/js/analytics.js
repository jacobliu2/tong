/* 통 TONG · analytics.js
   1) 방문 통계: 아래 ID를 채우면 해당 도구가 켜진다. 비워 두면 아무것도 불러오지 않는다.
   2) 유입 기록: 첫 방문 경로·검색 유입·UTM·마지막으로 본 진단을 sessionStorage에 남기고,
      문의 폼이 있으면 숨은 필드로 채워 Web3Forms 메일에 함께 전달한다.
      개인 식별 정보는 다루지 않으며 브라우저 탭을 닫으면 사라진다.
   navigation.js가 자동으로 불러온다. navigation.js를 쓰지 않는 페이지는 <script src=".../assets/js/analytics.js" async> 한 줄로 연결. */
(function(){
  if (window.__tongAnalytics) return; window.__tongAnalytics = true;

  var CONFIG = {
    GTM_ID: 'GTM-WFQ2X23S',      // Google 태그 관리자 컨테이너 (현재 비어 있음, 향후 전환 측정용)
    GA4_ID: 'G-BNC0PC7LY9',      // GA4를 여기서 직접 불러온다. GTM 안에 GA4 태그를 또 넣으면 방문이 두 번 집계되므로 넣지 않는다.
    NAVER_WA_ID: '1d335814f4270d0' // 네이버 애널리틱스 발급ID
  };

  function load(src, cb){ var s=document.createElement('script'); s.async=true; s.src=src; if(cb) s.onload=cb; document.head.appendChild(s); }

  if (CONFIG.GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    load('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CONFIG.GTM_ID));
  }
  if (CONFIG.GA4_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.GA4_ID);
    load('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.GA4_ID));
  }
  if (CONFIG.NAVER_WA_ID) {
    load('https://wcs.pstatic.net/wcslog.js', function(){
      try { window.wcs_add = window.wcs_add || {}; window.wcs_add['wa'] = CONFIG.NAVER_WA_ID; if (window.wcs) window.wcs_do(); } catch(e){}
    });
  }

  /* ---------- 유입 기록 ---------- */
  var KEY = 'tong-attr';
  var a = {};
  try { a = JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch(e){ a = {}; }
  var path = location.pathname.replace(/index\.html$/, '');

  if (!a.landing_page) {
    var q; try { q = new URLSearchParams(location.search); } catch(e){ q = null; }
    var ref = document.referrer || '';
    var refHost = ''; try { refHost = ref ? new URL(ref).hostname : ''; } catch(e){}
    var internal = refHost && refHost.replace(/^www\./,'') === location.hostname.replace(/^www\./,'');
    a.landing_page = path;
    a.referrer = internal ? '' : ref.slice(0, 300);
    a.source = (q && q.get('utm_source')) || (refHost && !internal ? refHost : '(direct)');
    a.medium = (q && q.get('utm_medium')) || (refHost && !internal ? (/google|naver|daum|bing|yahoo|zum|duckduckgo/i.test(refHost) ? 'organic' : 'referral') : '(none)');
    a.campaign = (q && q.get('utm_campaign')) || '';
    a.first_seen = new Date().toISOString();
  }
  var m = path.match(/\/diagnosis\/([a-z0-9-]+)\/$/);
  if (m) a.related_diagnosis = m[1];
  var ar = path.match(/\/archive\/([a-z0-9-]+)\/$/);
  if (ar && ar[1] !== 'topic' && ar[1] !== 'series') a.related_article = ar[1];
  var sv = path.match(/\/(consulting|solutions\/[a-z0-9-]+|dx-ai)\/$/);
  if (sv) a.related_service = sv[1];
  a.pages = (a.pages || []).concat(path).slice(-8);
  try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch(e){}
  window.TONG_ATTR = a;

  function fillForm(){
    var f = document.querySelector('form[data-attribution]');
    if (!f) return;
    var fields = ['source','medium','campaign','landing_page','referrer','related_article','related_diagnosis','related_service'];
    fields.forEach(function(k){
      var el = f.querySelector('input[name="'+k+'"]');
      if (!el) { el = document.createElement('input'); el.type='hidden'; el.name=k; f.appendChild(el); }
      el.value = a[k] || '';
    });
    var pv = f.querySelector('input[name="pages_viewed"]');
    if (!pv) { pv=document.createElement('input'); pv.type='hidden'; pv.name='pages_viewed'; f.appendChild(pv); }
    pv.value = (a.pages || []).join(' > ');
    f.addEventListener('submit', function(){
      var st = f.querySelector('input[name="submitted_at"]');
      if (!st) { st=document.createElement('input'); st.type='hidden'; st.name='submitted_at'; f.appendChild(st); }
      st.value = new Date().toISOString();
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillForm); else fillForm();
})();
