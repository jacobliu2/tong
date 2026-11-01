/* 진단 결과 → 문의 연결
   진단 결과 화면의 상담 버튼을 누르면 문의 페이지로 진단 이름(from)과 결과(r)를 넘긴다.
   진단 문항·채점·판정 로직은 건드리지 않고, 화면에 이미 표시된 결과 문구만 읽는다. */
(function(){
  var m = location.pathname.match(/\/diagnosis\/([a-z0-9-]+)\/?$/); if(!m) return;
  var slug = m[1];
  var SEL = {organization:'#code-type-name', management:'#phase-name', market:'#quadrant-name', sales:'#result-status',
             leader:'#leader-name', finance:'#result-score', dx:'#dxqRName', pyramid:'#goal-display',
             'government-support':'#eligibility-count-num'};
  function label(){
    var el = document.querySelector(SEL[slug] || '#rs-title, .rs-title');
    if(!el || !el.offsetParent) return '';
    var t = (el.innerText || el.textContent || '').replace(/\s+/g,' ').trim();
    if(!t) return '';
    if(slug === 'government-support') t = '적합 사업 ' + t + '개';
    if(slug === 'finance') t = '종합 ' + t + '점';
    if(slug === 'pyramid') t = '최종목표 ' + t;
    return t.slice(0, 80);
  }
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href*="contact/"]') : null;
    if(!a || a.closest('nav, footer, .tong-dguide')) return;
    try{
      var u = new URL(a.getAttribute('href'), location.href);
      u.searchParams.set('from', slug);
      var l = label(); if(l) u.searchParams.set('r', l); else u.searchParams.delete('r');
      a.setAttribute('href', u.pathname + u.search + u.hash);
    }catch(err){}
  }, true);
})();
