/* 통 TONG · 반응형 애니메이션 (anim.js)
   - 스크롤 진입 시 페이드업(스태거) · ABCDE 곡선 그려짐 · 오약 스케일인 · 흐름선 유동
   - prefers-reduced-motion 존중, transform/opacity만 사용(성능) */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d=document;
  // 등장 대상 자동 지정
  var sel='.h2,.lead,.big,.eb,.figure,.wheelzone,.center-cta,.tong-close,.researcher,.band h2,.band p,.band .btn.w';
  [].forEach.call(d.querySelectorAll(sel),function(el){el.classList.add('reveal');});
  // 그리드 자식 스태거
  [].forEach.call(d.querySelectorAll('.signals,.iyjs,.tools,.diag,.pmap'),function(g){
    [].forEach.call(g.children,function(c,i){c.classList.add('reveal');c.style.setProperty('--d',(i%2*70+Math.floor(i/2)*70)+'ms');});
  });
  // 히어로 스태거
  ['.hero .kick','.hero h1','.hero .sub','.hero .cta'].forEach(function(s,i){
    var el=d.querySelector(s); if(el){el.classList.add('reveal');el.style.setProperty('--d',(i*90)+'ms');}
  });

  if(reduce){ [].forEach.call(d.querySelectorAll('.reveal'),function(e){e.classList.add('in');}); return; }

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:0.12, rootMargin:'0px 0px -6% 0px'});
  [].forEach.call(d.querySelectorAll('.reveal'),function(el){
    if(el.closest('.hero')) return; // 히어로는 로드 시
    io.observe(el);
  });
  // 히어로: 로드 직후
  requestAnimationFrame(function(){ requestAnimationFrame(function(){
    [].forEach.call(d.querySelectorAll('.hero .reveal'),function(e){e.classList.add('in');});
  });});
})();
