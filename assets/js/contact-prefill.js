/* 진단 결과에서 넘어온 문의: 문의유형·내용·메일 제목을 미리 채운다 (from=진단, r=결과) */
(function(){
  var q; try{ q = new URLSearchParams(location.search); }catch(e){ return; }
  var N = {management:'경영전환 자가진단', organization:'조직유형 16 진단', leader:'리더유형 진단', sales:'영업 신호등 진단',
    market:'시장경쟁력 진단', finance:'재무 건강도 진단', dx:'DX 단계 진단', 'government-support':'정부지원사업 매칭 진단',
    pyramid:'경영전환 피라미드', oyak:'오약(五若) 상태 진단', 'ceo-dependency':'대표 의존도 진단', 'business-model':'제품·사업모델 진단',
    'letting-go':'버림 진단', 'ax-readiness':'AX 준비도 진단', 'crm-maturity':'CRM·고객관리 성숙도 진단', entropy:'낡음(엔트로피) 체크리스트'};
  var name = N[q.get('from') || '']; if(!name) return;
  var r = (q.get('r') || '').replace(/[<>]/g,'').slice(0, 80);
  var f = document.getElementById('tongForm'); if(!f) return;
  var sel = f.querySelector('select[name="문의유형"]');
  if(sel){ for(var i=0;i<sel.options.length;i++){ if(sel.options[i].text.indexOf('진단 결과')>-1){ sel.selectedIndex=i; break; } } }
  var ta = f.querySelector('textarea[name="문의내용"]');
  if(ta && !ta.value){ ta.value = '[' + name + '] ' + (r ? '결과: ' + r : '진단을 마쳤습니다.') + '\n'; }
  var sub = f.querySelector('input[name="subject"]');
  if(sub) sub.value = '[통 홈페이지] 진단 상담 문의 — ' + name + (r ? ' / ' + r : '');
  var h = document.createElement('input'); h.type='hidden'; h.name='진단_결과'; h.value = name + (r ? ' — ' + r : ''); f.appendChild(h);
  var b = document.createElement('div'); b.id = 'diag-banner';
  b.setAttribute('style','margin-bottom:20px;padding:16px 18px;border-radius:14px;background:linear-gradient(160deg,#fff,#f0f5ff);border:1px solid #d9e5fb;font-size:14.5px;color:#161d29;line-height:1.7');
  var s1 = document.createElement('b'); s1.style.color = '#3684FF'; s1.textContent = name + (r ? ' · ' + r : '');
  b.appendChild(s1);
  b.appendChild(document.createTextNode(' — 진단 결과를 함께 보내드립니다. 내용 칸에 지금 상황을 한두 줄 더해 주시면 상담이 빨라집니다.'));
  f.insertBefore(b, f.firstChild);
})();
