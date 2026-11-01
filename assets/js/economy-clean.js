/* TONG 비즈니스 이코노미 공개본 정리: 화면에 보이는 개발 버전 번호(v92, v196 · … 등)를 숨긴다.
   게임 계산·저장 코드는 건드리지 않고, 그려진 화면 글자만 다듬는다. */
(function(){
  var PURE=/^\s*v\d{2,3}\s*$/;
  function clean(t){
    return t.replace(/\s*\(v\d{2,3}\)/g,'')                // "긴급 딜레마(v92)"
            .replace(/\s*·\s*v\d{2,3}\b/g,'')            // "퀴즈 품질 점검 · v160"
            .replace(/\bv\d{2,3}\s*·\s*/g,'')            // "v196 · 특별 프로젝트…"
            .replace(/([^\s\d])\s+v\d{2,3}\b(?!\s*(?:이전|이후|에서|의))/g,'$1'); // "긴급 딜레마 v92"
  }
  function walk(root){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,list=[];
    while((n=w.nextNode()))list.push(n);
    list.forEach(function(n){
      var p=n.parentNode; if(!p||/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName))return;
      var v=n.nodeValue; if(!/v\d{2,3}/.test(v))return;
      if(PURE.test(v)&&p.childNodes.length===1){p.style.display='none';return;}
      var c=clean(v); if(c!==v)n.nodeValue=c;
    });
  }
  function run(){ if(document.body)walk(document.body); var t=clean(document.title); if(t!==document.title)document.title=t; }
  var busy=false;
  function sched(){ if(busy)return; busy=true; (window.requestAnimationFrame||setTimeout)(function(){ busy=false; run(); }); }
  document.addEventListener('DOMContentLoaded',function(){ run(); new MutationObserver(sched).observe(document.body,{childList:true,subtree:true,characterData:true}); });
})();
