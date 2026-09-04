/* 통 TONG · 공유 네비/푸터 (navigation.js)
   - GNB 4개(경영전환·진단·글과저서·TONG) + CTA 문의하기, 로고→HOME (지시서 §6)
   - 깊이 인식: <body data-depth="N"> 로 상대경로 계산 → file://·GitHub·미리보기 모두 동작
     depth 0=루트, 1=/section/, 2=/diagnosis/tool/ */
(function(){
  var depth = parseInt(document.body.getAttribute('data-depth')||'0',10);
  var P = depth>0 ? Array(depth+1).join('../') : './';
  function r(p){ return P + p; }
  var ROUTES = {
    home:r('index.html'), transformation:r('transformation/index.html'), diagnosis:r('diagnosis/index.html'), story:r('story/index.html'), consulting:r('consulting/index.html'), dxai:r('dx-ai/index.html'), tong:r('tong/index.html'), links:r('links/index.html'), contact:r('contact/index.html'),
    logo:r('assets/images/tong-logo.png')
  };
  window.TONG_ROUTES = ROUTES;
  var active = document.body.getAttribute('data-nav')||'';
  function item(k,label,cta){
    var cur = active===k?' aria-current="page"':''; var cls = cta?' class="tong-nav-cta"':'';
    return '<a href="'+ROUTES[k]+'"'+cur+cls+'>'+label+'</a>';
  }
  var nav =
   '<nav class="tong-nav" aria-label="주 메뉴">'+
     '<a class="tong-nav-brand" href="'+ROUTES.home+'" aria-label="통 TONG 홈">'+
       '<img src="'+ROUTES.logo+'" alt="통 TONG 홈" /><span class="tong-brand-tx"><b class="tong-brand-full">경영전환전략연구소 </b>TONG</span></a>'+
     '<button class="tong-nav-toggle" aria-label="메뉴" aria-expanded="false"><span></span><span></span><span></span></button>'+
     '<ul class="tong-nav-menu" id="tong-nav-menu">'+
       '<li>'+item('tong','TONG')+'</li>'+'<li>'+item('transformation','경영전환')+'</li>'+'<li>'+item('consulting','컨설팅')+'</li>'+'<li>'+item('dxai','DX·AI')+'</li>'+'<li>'+item('diagnosis','자가진단')+'</li>'+'<li>'+item('story','이야기')+'</li>'+'<li>'+item('contact','문의',true)+'</li>'+'<li class="tong-nav-tools">'+'<button class="tong-tools-btn" id="tongTools" aria-label="보기 설정" aria-expanded="false" aria-haspopup="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg></button>'+'<div class="tong-tools-pop" id="tongToolsPop" role="menu" hidden>'+'<div class="tt-row"><span>글자 크기</span><div class="tt-seg" id="ttFont"><button data-f="0">가</button><button data-f="1" class="on">가</button><button data-f="2">가</button></div></div>'+'<div class="tt-row"><span>화면 모드</span><div class="tt-seg" id="ttTheme"><button data-t="light" class="on">라이트</button><button data-t="dark">다크</button></div></div>'+'</div></li>'+
     '</ul></nav>';
  var y=new Date().getFullYear();
  var foot =
   '<footer class="tong-footer"><div class="tong-footer-inner">'+
     '<div class="tong-footer-brand"><img src="'+ROUTES.logo+'" alt="통 TONG" />'+
       '<p>업무를 잇다, TONG. 사람과 조직, 기업과 고객, 전략과 실행을 다시 잇습니다.</p></div>'+
     '<div><h4>둘러보기</h4>'+
       '<a href="'+ROUTES.transformation+'">경영전환</a>'+
       '<a href="'+ROUTES.diagnosis+'">진단</a>'+
       '<a href="'+ROUTES.story+'">경영전환 이야기</a>'+
       '<a href="'+ROUTES.tong+'">TONG</a></div>'+
     '<div><h4>상담</h4>'+
       '<a href="'+ROUTES.contact+'">문의하기</a>'+
       '<a href="'+ROUTES.diagnosis+'">진단하기</a></div>'+
   '</div>'+'<div class="tong-footer-biz">'+'<b>경영전환전략연구소 통</b> · 대표 유영준 · 사업자등록번호 471-07-02776<br>'+'서울특별시 강남구 선릉로92길 28, 4층 4201호(삼성동, 강인빌딩) · jacobliu@workstong.com'+'</div>'+'<div class="tong-footer-legal">'+
     '<span>© '+y+' 경영전환전략연구소 통 (workstong.com)</span>'+
     '<span>通 · Transformation · Operation · Network · Growth</span></div></footer>';
  var n=document.getElementById('tong-nav-root'); if(n) n.innerHTML=nav;
  var f=document.getElementById('tong-footer-root'); if(f) f.innerHTML=foot;

  (function(){
    var pop=document.getElementById('tongToolsPop'),btn=document.getElementById('tongTools');
    if(!btn) return;
    function close(){pop.hidden=true;btn.setAttribute('aria-expanded','false');}
    btn.addEventListener('click',function(e){e.stopPropagation();var open=pop.hidden;pop.hidden=!open;btn.setAttribute('aria-expanded',String(open));});
    document.addEventListener('click',function(e){if(!pop.hidden&&!pop.contains(e.target)&&e.target!==btn)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    var FS=['15px','16.5px','18.5px'];
    function setFont(i){document.documentElement.style.fontSize=FS[i];try{localStorage.setItem('tong-fs',i)}catch(e){}
      var g=document.querySelectorAll('#ttFont button');g.forEach(function(b,k){b.classList.toggle('on',k==i);});}
    function setTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('tong-theme',t)}catch(e){}
      document.querySelectorAll('#ttTheme button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-t')===t);});}
    document.querySelectorAll('#ttFont button').forEach(function(b){b.addEventListener('click',function(){setFont(+b.getAttribute('data-f'));});});
    document.querySelectorAll('#ttTheme button').forEach(function(b){b.addEventListener('click',function(){setTheme(b.getAttribute('data-t'));});});
    var sf=1,st='light';try{var _v=localStorage.getItem('tong-fs');if(_v!==null&&!isNaN(+_v))sf=+_v;st=localStorage.getItem('tong-theme')||'light';}catch(e){}
    setFont(sf);setTheme(st);
  })();

  var t=document.querySelector('.tong-nav-toggle'), m=document.getElementById('tong-nav-menu');
  if(t&&m) t.addEventListener('click',function(){var o=m.classList.toggle('open');t.setAttribute('aria-expanded',String(o));});
})();
