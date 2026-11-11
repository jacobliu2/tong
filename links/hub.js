/* TONG 링크허브 렌더러 (links/hub.js)
   hub-config.js의 window.TONG_HUB를 읽어 PC 책가도 핫스팟, 툴팁, 하위 메뉴,
   모바일 족자 링크, '더 둘러보기', 전체 메뉴 목록(대체 경로)을 그린다.
   메뉴 변경은 hub-config.js에서만 한다. */
(function () {
  'use strict';
  var HUB = window.TONG_HUB;
  if (!HUB) { document.documentElement.classList.add('hub-noimg'); return; }

  var doc = document;
  var stage = doc.getElementById('stage');
  var scrollhub = doc.getElementById('scrollhub');
  var indexNav = doc.getElementById('hub-index-list');
  var mqMobile = window.matchMedia('(max-width:900px), (orientation:portrait) and (max-width:1024px)');
  var coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ── 공통 유틸 ─────────────────────────────────────── */
  function el(tag, attrs, html) {
    var n = doc.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) continue;
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    }
    if (html) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
  function isExternal(href) { return /^https?:\/\//i.test(href) && !/workstong\.com/i.test(href); }
  function linkType(href) {
    if (/^(tel|mailto):/i.test(href)) return 'contact';
    return isExternal(href) ? 'external' : 'internal';
  }
  function linkAttrs(href, external) {
    var a = { href: href };
    if (external || isExternal(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  /* ── 방문 통계: 사물·메뉴·내부/외부·PC/모바일 (개인정보 없음) ── */
  function track(obj, menu, href) {
    try {
      var g = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
      var t = linkType(href);
      var dest = t === 'external' ? new URL(href).hostname : (t === 'contact' ? href.split(':')[0] : new URL(href, location.href).pathname);
      g('event', 'link_hub_click', {
        hub_object: obj,
        hub_menu: menu,
        link_type: t,              /* internal | external | contact(tel·mailto) */
        link_destination: dest,    /* 내부 경로 · 외부 도메인 · tel/mailto 구분만 */
        device_type: mqMobile.matches ? 'mobile' : 'pc'
      });
    } catch (e) {}
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-hub-obj]');
    if (!a || e.defaultPrevented) return;   /* 터치 첫 탭(설명만 보기)은 집계하지 않음 */
    track(a.getAttribute('data-hub-obj'), a.getAttribute('data-hub-menu'), a.getAttribute('href'));
  });

  /* ══ 1. PC 책가도 ══════════════════════════════════════ */
  var tip = el('div', { class: 'tip', 'aria-hidden': 'true' });
  var sub = el('div', { class: 'sub', id: 'hub-sub', hidden: true });
  var openBtn = null, tipOwner = null;

  function placeTip(o) {
    var obj = o.__obj, hit = o.querySelector('.hit');
    tip.innerHTML = '<b>' + esc(obj.label) + '</b><span>' + esc(obj.desc) + '</span>' +
      (obj.menu ? '<em>메뉴 ' + obj.menu.length + '개 · 클릭해서 열기</em>' : '');
    tip.className = 'tip on'; tipOwner = o;
    var s = stage.getBoundingClientRect(), r = hit.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight, gap = 10;
    var x = r.left + r.width / 2 - s.left - tw / 2;
    x = Math.max(8, Math.min(x, s.width - tw - 8));
    var up = obj.tip !== 'down';
    var yUp = r.top - s.top - th - gap, yDown = r.bottom - s.top + gap;
    if (up && yUp < 6) up = false;
    if (!up && yDown + th > s.height - 6) up = true;
    tip.style.left = x + 'px';
    tip.style.top = (up ? yUp : yDown) + 'px';
  }
  function hideTip(o) {               /* o를 주면 그 사물의 툴팁일 때만 닫는다 */
    if (o && o !== tipOwner) return;
    tip.className = 'tip'; tipOwner = null;
  }

  function positionSub(btn) {
    var r = btn.querySelector('.hit').getBoundingClientRect();
    var vw = doc.documentElement.clientWidth, vh = doc.documentElement.clientHeight, m = 10;
    sub.style.maxHeight = (vh - m * 2) + 'px';
    sub.style.left = '0px'; sub.style.top = '0px';
    var w = sub.offsetWidth, h = sub.offsetHeight;
    var x = r.left + r.width / 2 - w / 2;
    var y = btn.__obj.tip === 'down' ? r.bottom + 10 : r.top - h - 10;
    if (y < m) y = r.bottom + 10;                 /* 위가 모자라면 아래로 */
    if (y + h > vh - m) y = Math.max(m, r.top - h - 10);
    if (y + h > vh - m) y = Math.max(m, vh - m - h); /* 그래도 넘치면 화면 안에 고정 */
    x = Math.max(m, Math.min(x, vw - w - m));
    sub.style.left = Math.round(x) + 'px';
    sub.style.top = Math.round(y) + 'px';
  }

  function openSub(btn, focusFirst) {
    if (openBtn === btn) return;
    closeSub(false);
    var obj = btn.__obj;
    sub.innerHTML = '';
    var head = el('div', { class: 'sub-h' });
    head.appendChild(el('strong', { text: obj.label }));
    var x = el('button', { type: 'button', class: 'sub-x', 'aria-label': obj.label + ' 메뉴 닫기' }, '<span aria-hidden="true">×</span>');
    x.addEventListener('click', function () { closeSub(true); });
    head.appendChild(x);
    sub.appendChild(head);
    var ul = el('ul', { 'aria-label': obj.label });
    obj.menu.forEach(function (m) {
      var at = linkAttrs(m.href, m.external);
      at['data-hub-obj'] = obj.id; at['data-hub-menu'] = m.label;
      var a = el('a', at, '<b>' + esc(m.label) + '</b>' + (m.desc ? '<span>' + esc(m.desc) + '</span>' : '') +
        (at.target ? '<i class="ext" aria-hidden="true">↗</i>' : ''));
      if (at.target) a.setAttribute('aria-label', m.label + ' (새 창)');
      var li = el('li'); li.appendChild(a); ul.appendChild(li);
    });
    sub.appendChild(ul);
    sub.setAttribute('aria-label', obj.label + ' 하위 메뉴');
    sub.hidden = false;
    openBtn = btn;
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-on');
    hideTip();
    positionSub(btn);
    if (focusFirst) { var f = sub.querySelector('ul a'); if (f) f.focus(); }
  }
  function closeSub(refocus) {
    if (!openBtn) return;
    var b = openBtn; openBtn = null;
    sub.hidden = true;
    b.setAttribute('aria-expanded', 'false');
    b.classList.remove('is-on');
    if (refocus) b.focus();
  }

  if (stage) {
    HUB.objects.forEach(function (obj) {
      var h = obj.hit, cx = h[0] + h[2] / 2, cy = h[1] + h[3] / 2;
      var style = '--cx:' + cx.toFixed(3) + '%;--cy:' + cy.toFixed(3) + '%;' +
                  '--rx:' + (h[2] * 0.64).toFixed(3) + '%;--ry:' + (h[3] * 0.64).toFixed(3) + '%;' +
                  '--hx:' + (h[2] * 0.86).toFixed(3) + '%;--hy:' + (h[3] * 0.86).toFixed(3) + '%';
      var hit = el('b', { class: 'hit', style: '--l:' + h[0] + '%;--t:' + h[1] + '%;--w:' + h[2] + '%;--h:' + h[3] + '%' });
      var o;
      if (obj.menu) {
        o = el('button', { type: 'button', class: 'o', style: style, 'aria-haspopup': 'true', 'aria-expanded': 'false',
          'aria-controls': 'hub-sub', 'aria-label': obj.label + ' — ' + obj.desc + ' (하위 메뉴 ' + obj.menu.length + '개)' });
        o.addEventListener('click', function (e) {
          e.preventDefault();
          if (openBtn === o) closeSub(false);
          else openSub(o, e.detail === 0);   /* 키보드(Enter·Space)로 열면 첫 항목에 포커스 */
        });
        o.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown') { e.preventDefault(); openSub(o, true); }
        });
      } else {
        var at = linkAttrs(obj.href, obj.external);
        at.class = 'o'; at.style = style;
        at['aria-label'] = obj.label + ' — ' + obj.desc;
        at['data-hub-obj'] = obj.id; at['data-hub-menu'] = obj.label;
        o = el('a', at);
        if (coarse) {   /* 터치 화면의 PC형 배치: 첫 탭 = 강조·설명, 두 번째 탭 = 이동 */
          o.addEventListener('click', function (e) {
            if (!o.classList.contains('is-on')) {
              e.preventDefault();
              stage.querySelectorAll('.o.is-on').forEach(function (n) { if (n !== o) n.classList.remove('is-on'); });
              closeSub(false);
              o.classList.add('is-on'); placeTip(o);
              clearTimeout(o.__t); o.__t = setTimeout(function () { o.classList.remove('is-on'); hideTip(o); }, 3200);
            }
          });
        }
      }
      o.__obj = obj;
      o.setAttribute('data-obj', obj.id);
      o.appendChild(hit);
      o.addEventListener('mouseover', function () { if (openBtn !== o) placeTip(o); });
      o.addEventListener('mouseout', function (e) { if (!o.contains(e.relatedTarget)) hideTip(o); });
      o.addEventListener('focus', function () { if (openBtn !== o) placeTip(o); });
      o.addEventListener('blur', function () { hideTip(o); });
      stage.appendChild(o);
    });
    stage.appendChild(tip);
    doc.body.appendChild(sub);

    /* 하위 메뉴 키보드: ↑↓ 이동, Home/End, Esc 닫기, 바깥으로 Tab 하면 닫기 */
    sub.addEventListener('keydown', function (e) {
      var links = Array.prototype.slice.call(sub.querySelectorAll('ul a'));
      var i = links.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); links[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); links[links.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeSub(true); }
    });
    sub.addEventListener('focusout', function (e) {
      if (openBtn && e.relatedTarget && !sub.contains(e.relatedTarget) && e.relatedTarget !== openBtn) closeSub(false);
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openBtn) closeSub(true); });
    doc.addEventListener('click', function (e) {
      if (openBtn && !sub.contains(e.target) && !openBtn.contains(e.target)) closeSub(false);
      if (coarse && !(e.target.closest && e.target.closest('.o'))) {
        stage.querySelectorAll('a.o.is-on').forEach(function (n) { n.classList.remove('is-on'); }); hideTip();
      }
    });
    window.addEventListener('resize', function () { if (openBtn) positionSub(openBtn); hideTip(); });
    window.addEventListener('scroll', function () { if (openBtn) positionSub(openBtn); }, { passive: true });
  }

  /* ══ 2. 모바일 족자 ═════════════════════════════════════ */
  var onScroll = {};
  if (scrollhub) {
    var sx = HUB.SCROLL_X;
    var sheet = null, sheetBtn = null;
    function closeSheet() {
      if (!sheet || sheet.hidden) return;
      sheet.hidden = true; doc.documentElement.classList.remove('sheet-open');
      if (sheetBtn) { sheetBtn.setAttribute('aria-expanded', 'false'); sheetBtn.focus(); }
    }
    function openSheet(btn, s) {
      if (!sheet) {
        sheet = el('div', { class: 'sheet', id: 'hub-sheet', hidden: true });
        sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
        sheet.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
          if (e.key === 'Tab') {        /* 선택창 안에서만 포커스 순환 */
            var f = sheet.querySelectorAll('a,button'), first = f[0], last = f[f.length - 1];
            if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
          }
        });
        doc.body.appendChild(sheet);
      }
      sheet.innerHTML = '';
      var box = el('div', { class: 'sheet-box', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sheet-title' });
      var head = el('div', { class: 'sheet-h' });
      head.appendChild(el('strong', { id: 'sheet-title', text: s.label }));
      var x = el('button', { type: 'button', class: 'sheet-x', 'aria-label': '닫기' }, '<span aria-hidden="true">×</span>');
      x.addEventListener('click', closeSheet);
      head.appendChild(x); box.appendChild(head);
      var ul = el('ul');
      s.menu.forEach(function (m) {
        var at = linkAttrs(m.href, m.external);
        at['data-hub-obj'] = 'scroll'; at['data-hub-menu'] = s.label + ' > ' + m.label;
        var a = el('a', at, '<b>' + esc(m.label) + '</b>' + (m.desc ? '<span>' + esc(m.desc) + '</span>' : ''));
        if (at.target) a.setAttribute('aria-label', m.label + ' (새 창)');
        a.addEventListener('click', function () { setTimeout(closeSheet, 0); });
        var li = el('li'); li.appendChild(a); ul.appendChild(li);
      });
      box.appendChild(ul); sheet.appendChild(box);
      sheetBtn = btn; btn.setAttribute('aria-expanded', 'true');
      sheet.hidden = false; doc.documentElement.classList.add('sheet-open');
      var f = sheet.querySelector('ul a'); if (f) f.focus({ preventScroll: true });
    }
    var hotStyle = function (s) { return 'left:' + sx[0] + '%;width:' + sx[1] + '%;top:' + s.top + '%;height:' + s.height + '%'; };
    HUB.scroll.forEach(function (s) {
      if (s.menu) {
        s.menu.forEach(function (m) { onScroll[m.href] = true; });
        var b = el('button', { type: 'button', class: 'hot', style: hotStyle(s), 'aria-haspopup': 'dialog',
          'aria-expanded': 'false', 'aria-controls': 'hub-sheet', 'aria-label': s.label + ' (선택 메뉴 ' + s.menu.length + '개)' });
        b.addEventListener('click', function () { openSheet(b, s); });
        scrollhub.appendChild(b);
        return;
      }
      onScroll[s.href] = true;
      var at = linkAttrs(s.href, s.external);
      at.class = 'hot';
      at['aria-label'] = s.label + (at.target ? ' (새 창)' : '');
      at['data-hub-obj'] = 'scroll'; at['data-hub-menu'] = s.label;
      at.style = hotStyle(s);
      scrollhub.appendChild(el('a', at));
    });

    /* 족자에 없는 목적지 → '더 둘러보기' (중앙 설정에서 자동 수집) */
    var more = doc.getElementById('hub-more-list');
    if (more) {
      /* 단일 목적지는 '바로가기' 한 묶음으로, 복수 목적지는 사물 이름을 제목으로 묶는다 */
      var singles = [], groups = [];
      HUB.objects.forEach(function (obj) {
        if (obj.menu) {
          var items = obj.menu.filter(function (m) { return !onScroll[m.href]; });
          if (items.length) groups.push({ title: obj.label, id: obj.id, items: items });
        } else if (!onScroll[obj.href]) {
          singles.push({ label: obj.label, desc: obj.desc, href: obj.href, external: obj.external, obj: obj.id });
        }
      });
      if (singles.length) groups.unshift({ title: '바로가기', items: singles });
      groups.forEach(function (gr) {
        var g = el('li', { class: 'more-g' });
        g.appendChild(el('p', { class: 'more-h', text: gr.title }));
        var ul = el('ul');
        gr.items.forEach(function (m) {
          var at = linkAttrs(m.href, m.external);
          at['data-hub-obj'] = m.obj || gr.id; at['data-hub-menu'] = m.label;
          var a = el('a', at, '<b>' + esc(m.label) + '</b>' + (m.desc ? '<span>' + esc(m.desc) + '</span>' : ''));
          if (at.target) a.setAttribute('aria-label', m.label + ' (새 창)');
          var li = el('li'); li.appendChild(a); ul.appendChild(li);
        });
        g.appendChild(ul);
        more.appendChild(g);
      });
    }
  }

  /* ══ 3. 전체 메뉴 목록 (키보드 건너뛰기 · 이미지 실패 시 대체 경로) ══ */
  if (indexNav) {
    HUB.objects.forEach(function (obj) {
      var li = el('li');
      if (obj.menu) {
        li.appendChild(el('p', { class: 'idx-h', text: obj.label }));
        var ul = el('ul');
        obj.menu.forEach(function (m) {
          var at = linkAttrs(m.href, m.external);
          at['data-hub-obj'] = 'index:' + obj.id; at['data-hub-menu'] = m.label;
          var l2 = el('li'); l2.appendChild(el('a', at, esc(m.label) + (at.target ? ' <span class="sr-only">(새 창)</span>' : ''))); ul.appendChild(l2);
        });
        li.appendChild(ul);
      } else {
        var at = linkAttrs(obj.href, obj.external);
        at['data-hub-obj'] = 'index:' + obj.id; at['data-hub-menu'] = obj.label;
        li.appendChild(el('a', at, esc(obj.label) + (at.target ? ' <span class="sr-only">(새 창)</span>' : '')));
      }
      indexNav.appendChild(li);
    });
  }
})();
