// workstong.com 아카이브 정적 빌드
// content/archive/*.md (글 하나 = 파일 하나) 와 content/taxonomy.json 을 읽어
// /archive/ 이하 정적 HTML과 sitemap을 만든다. 데이터베이스 없음.
// 실행: (저장소 루트) cd _build && npm install && cd .. && node _build/build-archive.mjs
// 글 파일 형식: 맨 위 --- 사이에 YAML 머리말(title, summary, date, category ...), 그 아래 Markdown 본문
// status: draft 인 파일은 건너뛴다 (초안은 원칙적으로 저장소에 두지 않는다)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sanitizeHtml from 'sanitize-html';
import yaml from 'js-yaml';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.workstong.com';
const ORG_NAME = '경영전환연구소 통';
const PAGE_SIZE = 12;
const MANIFEST = path.join(ROOT, 'archive', '.manifest.json');
const TYPE_LABEL = { column: '칼럼', guide: '해설', research: '연구' };

// ---------- 데이터 ----------
async function loadData() {
  const fx = process.argv.indexOf('--fixture');
  if (fx > -1) return JSON.parse(fs.readFileSync(path.resolve(process.argv[fx + 1]), 'utf8'));
  const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'taxonomy.json'), 'utf8'));
  const dir = path.join(ROOT, 'content', 'archive');
  const articles = [];
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(x => x.endsWith('.md')).sort() : []) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8').replace(/^\uFEFF/, '');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) throw new Error(`${f}: 머리말(---) 형식이 아닙니다`);
    const h = yaml.load(m[1]) || {};
    const slug = f.replace(/\.md$/, '');
    if (!/^[a-z0-9-]{3,80}$/.test(slug)) throw new Error(`${f}: 파일 이름(주소)은 영문 소문자·숫자·하이픈만`);
    if ((h.status || 'published') !== 'published') continue;
    for (const k of ['title', 'date', 'category']) if (!h[k]) throw new Error(`${f}: ${k} 값이 없습니다`);
    if (!T.categories.some(c => c.id === h.category)) throw new Error(`${f}: 알 수 없는 category ${h.category}`);
    if (h.series && !T.series.some(c => c.id === h.series)) throw new Error(`${f}: 알 수 없는 series ${h.series}`);
    articles.push({
      id: slug, slug, status: 'published', title: h.title, subtitle: h.subtitle || null, summary: h.summary || null,
      content_html: marked.parse(m[2], { gfm: true, breaks: false }), content_type: h.type || 'column',
      primary_category_id: h.category, series_id: h.series || null, author_id: h.author || 'yoo-youngjun',
      published_at: new Date(h.date).toISOString(), pub_updated_at: h.updated ? new Date(h.updated).toISOString() : null,
      cover_image: h.cover_image || null, cover_alt: h.cover_alt || null, source_platform: h.source || null, source_url: h.source_url || null,
      seo_title: h.seo_title || null, seo_description: h.seo_description || null, og_image: h.og_image || null, canonical_url: h.canonical_url || null,
      show_toc: !!h.toc, categories: h.secondary || [], related: h.related || [], diagnoses: h.diagnoses || [], services: h.services || [],
    });
  }
  return { articles, ...T, tags: [] };
}

// ---------- 유틸 ----------
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ymd = d => new Date(d).toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '.'); // 한국 시간 기준 날짜
const iso = d => new Date(d).toISOString();
const up = depth => '../'.repeat(depth);
const byId = arr => Object.fromEntries((arr || []).map(x => [x.id ?? x.slug, x]));
const arr = v => Array.isArray(v) ? v : (typeof v === 'string' ? JSON.parse(v || '[]') : []);

function clean(html) {
  return sanitizeHtml(html || '', {
    allowedTags: ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br', 'code', 'pre', 'figure', 'figcaption', 'mark', 'sup', 'sub'],
    allowedAttributes: { a: ['href', 'title', 'rel', 'target'], img: ['src', 'alt', 'width', 'height', 'title'],
      th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    transformTags: {
      h1: 'h2',
      a: (tag, attribs) => {
        if (!/^(https?:|mailto:|tel:|#|\/|\.)/i.test(attribs.href || '')) return { tagName: 'span', attribs: {} };
        const ext = /^https?:\/\//.test(attribs.href || '') && !/^https?:\/\/(www\.)?workstong\.com/.test(attribs.href);
        return { tagName: 'a', attribs: ext ? { ...attribs, target: '_blank', rel: 'noopener' } : { href: attribs.href, title: attribs.title } };
      },
      img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy', decoding: 'async' } }),
    },
    exclusiveFilter: f => f.tag === 'p' && !f.text.trim() && !f.mediaChildren?.length,
  });
}

function addHeadingIds(html) {
  const toc = []; let n = 0;
  const out = html.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
    const id = `s${++n}`; toc.push({ level: tag, id, text: inner.replace(/<[^>]+>/g, '') });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return { html: out, toc };
}

function tocHtml(toc) {
  let out = '<ol>', open = false;
  for (const t of toc) {
    if (t.level === 'h2') { if (open) out += '</ul>'; open = false; out += (out.endsWith('<ol>') ? '' : '</li>') + `<li><a href="#${t.id}">${esc(t.text)}</a>`; }
    else { if (!open) { out += '<ul>'; open = true; } out += `<li><a href="#${t.id}">${esc(t.text)}</a></li>`; }
  }
  if (open) out += '</ul>';
  return out + (toc.length ? '</li>' : '') + '</ol>';
}

// 메뉴·푸터: depth 1 페이지의 정적 폴백을 가져와 깊이에 맞게 경로만 고친다
const NAV_SRC = fs.readFileSync(path.join(ROOT, 'contact', 'index.html'), 'utf8');
const NAV = NAV_SRC.match(/<div id="tong-nav-root">[\s\S]*?<\/div>(?=\s*<main)/)?.[0] || '<div id="tong-nav-root"></div>';
const FOOT = NAV_SRC.match(/<div id="tong-footer-root">[\s\S]*?<!--\/prerender:footer--><\/div>/)?.[0] || '<div id="tong-footer-root"></div>';
const shell = (html, depth) => html.replace(/ aria-current="page"/g, '').replace(/(href|src)="\.\.\//g, `$1="${up(depth)}`);

function page({ depth, title, desc, canonical, ogImage, ogType = 'website', ld, body, robots }) {
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
${robots ? `<meta name="robots" content="${robots}"/>` : ''}<link rel="canonical" href="${esc(canonical)}"/>
<meta property="og:type" content="${ogType}"/><meta property="og:locale" content="ko_KR"/>
<meta property="og:title" content="${esc(title)}"/><meta property="og:description" content="${esc(desc)}"/>
<meta property="og:url" content="${esc(canonical)}"/><meta property="og:image" content="${esc(ogImage || SITE + '/assets/images/tong-logo.png')}"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="icon" href="${up(depth)}assets/images/tong-logo.png"/>
<link rel="stylesheet" href="${up(depth)}assets/css/tong.css"/>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body data-nav="archive" data-depth="${depth}">
${shell(NAV, depth)}
<main class="tong-arc">${body}</main>
${shell(FOOT, depth)}
<script src="${up(depth)}assets/js/navigation.js"></script>
</body></html>
`;
}

const ORG_LD = { '@type': 'Organization', name: ORG_NAME, alternateName: ['TONG', '경영전환전략연구소'], url: SITE + '/', logo: SITE + '/assets/images/tong-logo.png' };
const crumbsLd = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + '/' + p })) });

// ---------- 빌드 ----------
const D = await loadData();
const cats = byId(D.categories), sers = byId(D.series), auths = byId(D.authors);
const diags = byId(D.diagnoses), svcs = byId(D.services);
const expertExists = fs.existsSync(path.join(ROOT, 'expert', 'index.html'));
const articles = (D.articles || []).filter(a => a.status === 'published' && a.slug && a.title)
  .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
const bySlugId = byId(articles);
// 안전장치: 기존에 글이 있었는데 이번에 0편이면(DB 미연결·장애 가능성) 중단한다
{ let prevN = 0; try { prevN = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).filter(r => /^archive\/[^/]+\/index\.html$/.test(r) && !/^archive\/(page|topic|series)\//.test(r)).length; } catch {}
  if (!articles.length && prevN > 0 && !process.argv.includes('--allow-empty')) {
    console.error(`공개 글이 0편으로 조회되었습니다(이전 ${prevN}편). DB 연결을 확인하십시오. 모두 내리는 것이 의도라면 --allow-empty 로 실행.`);
    process.exit(1);
  } }
const written = [];
function write(rel, html) {
  const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); written.push(rel);
}

function card(a, depth) {
  const c = cats[a.primary_category_id], s = sers[a.series_id];
  return `<li class="tong-arc-item"><a href="${up(depth)}archive/${a.slug}/">
<span class="m">${esc(TYPE_LABEL[a.content_type] || '칼럼')}${c ? ' · ' + esc(c.name) : ''}${s ? ' · ' + esc(s.name) : ''}</span>
<span class="t">${esc(a.title)}</span>${a.summary ? `<span class="d">${esc(a.summary)}</span>` : ''}
<span class="w">유영준 · ${ymd(a.published_at)}</span></a></li>`;
}

// 상세
for (const a of articles) {
  const depth = 2, rel = `archive/${a.slug}/`;
  const author = auths[a.author_id] || Object.values(auths)[0];
  const c = cats[a.primary_category_id], s = sers[a.series_id];
  const sub = arr(a.categories).map(id => cats[id]).filter(x => x && x !== c);
  const { html, toc } = addHeadingIds(clean(a.content_html));
  let related = arr(a.related).map(id => bySlugId[id]).filter(Boolean);
  if (related.length < 3) {
    const pool = articles.filter(x => x.id !== a.id && !related.includes(x) &&
      ((a.series_id && x.series_id === a.series_id) || (a.primary_category_id && x.primary_category_id === a.primary_category_id)));
    related = related.concat(pool.slice(0, 3 - related.length));
  }
  const rd = arr(a.diagnoses).map(k => diags[k]).filter(Boolean);
  const rs = arr(a.services).map(k => svcs[k]).filter(Boolean);
  const canonical = a.canonical_url || `${SITE}/${rel}`;
  const desc = a.seo_description || a.summary || a.subtitle || a.title;
  const cover = a.og_image || a.cover_image;
  const authorUrl = expertExists && author?.profile_path ? `${SITE}/${author.profile_path}` : undefined;
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': a.content_type === 'research' ? 'Article' : 'BlogPosting', '@id': `${SITE}/${rel}#article`,
      headline: a.title, description: desc, datePublished: iso(a.published_at), dateModified: iso(a.pub_updated_at || a.published_at),
      inLanguage: 'ko', mainEntityOfPage: `${SITE}/${rel}`, image: cover || undefined,
      author: author ? { '@type': 'Person', name: author.name, jobTitle: author.job_title || undefined, url: authorUrl,
        sameAs: author.same_as?.length ? author.same_as : undefined } : undefined,
      publisher: ORG_LD, articleSection: c?.name, isPartOf: s ? { '@type': 'CreativeWorkSeries', name: s.name } : undefined,
      keywords: sub.map(x => x.name).join(', ') || undefined },
    crumbsLd([['홈', ''], ['아카이브', 'archive/'], [a.title, rel]])] };
  const updated = a.pub_updated_at && ymd(a.pub_updated_at) !== ymd(a.published_at);
  const authorName = author ? (authorUrl ? `<a href="${up(depth)}${author.profile_path}">${esc(author.name)}</a>` : esc(author.name)) : '';
  const srcLabel = { linkedin: 'LinkedIn', brunch: '브런치', book: '책', original: '' }[a.source_platform] ?? a.source_platform;
  const ctaText = a.content_type === 'guide'
    ? '우리 회사에 어떻게 적용할지 함께 정리하고 싶으시면 상담을 신청해 주십시오.'
    : '이 글과 관련해 지금 회사의 상황을 이야기 나누고 싶으시면 편하게 문의해 주십시오.';
  const body = `<article>
<header class="tong-arc-head"><div class="tong-arc-in">
<nav class="tong-sol-crumb" aria-label="현재 위치"><a href="${up(depth)}">홈</a> / <a href="../">아카이브</a>${c ? ` / <a href="../topic/${c.slug}/">${esc(c.name)}</a>` : ''}</nav>
<p class="tong-arc-kind">${esc(TYPE_LABEL[a.content_type] || '칼럼')}${s ? ` · <a href="../series/${s.slug}/">${esc(s.name)}</a>` : ''}</p>
<h1>${esc(a.title)}</h1>
${a.subtitle ? `<p class="tong-arc-sub">${esc(a.subtitle)}</p>` : ''}
<p class="tong-arc-meta">${authorName}<span>최초 작성 <time datetime="${iso(a.published_at)}">${ymd(a.published_at)}</time></span>${updated ? `<span>최종 수정 <time datetime="${iso(a.pub_updated_at)}">${ymd(a.pub_updated_at)}</time></span>` : ''}</p>
</div></header>
<div class="tong-arc-in tong-arc-body">
${a.cover_image ? `<figure class="tong-arc-cover"><img src="${esc(a.cover_image)}" alt="${esc(a.cover_alt || '')}" loading="eager"/></figure>` : ''}
${a.show_toc && toc.length > 2 ? `<nav class="tong-arc-toc" aria-label="목차"><p class="k">목차</p>${tocHtml(toc)}</nav>` : ''}
<div class="tong-prose">${html}</div>
${a.source_url ? `<p class="tong-arc-source">원문${srcLabel ? ` (${esc(srcLabel)})` : ''}: <a href="${esc(a.source_url)}" target="_blank" rel="noopener">${esc(a.source_url)}</a></p>` : ''}
<div class="tong-arc-terms">${c ? `<a href="../topic/${c.slug}/">${esc(c.name)}</a>` : ''}${sub.map(x => `<a href="../topic/${x.slug}/">${esc(x.name)}</a>`).join('')}${s ? `<a href="../series/${s.slug}/">${esc(s.name)}</a>` : ''}</div>
${rd.length || rs.length ? `<section class="tong-arc-next"><h2>이어서 보기</h2><ul>${rd.map(d => `<li><a href="${up(depth)}diagnosis/${d.slug}/">자가진단 · ${esc(d.name)}</a></li>`).join('')}${rs.map(v => `<li><a href="${up(depth)}${v.path}">${v.slug === 'consulting' ? '' : '문제별 해법 · '}${esc(v.name)}</a></li>`).join('')}</ul></section>` : ''}
${related.length ? `<section class="tong-arc-next"><h2>관련 글</h2><ul>${related.map(r => `<li><a href="../${r.slug}/">${esc(r.title)}</a></li>`).join('')}</ul></section>` : ''}
<p class="tong-arc-cta">${ctaText} <a href="${up(depth)}contact/">문의하기</a></p>
</div></article>`;
  write(`${rel}index.html`, page({ depth, title: `${a.seo_title || a.title} | 통 TONG`, desc, canonical, ogImage: cover, ogType: 'article', ld, body }));
}

// 목록 (페이지네이션 + 클라이언트 검색·필터)
const index = articles.map(a => ({ s: a.slug, t: a.title, d: a.summary || '', c: a.primary_category_id ? cats[a.primary_category_id]?.slug : '',
  cs: arr(a.categories).map(id => cats[id]?.slug).filter(Boolean), r: a.series_id ? sers[a.series_id]?.slug : '', k: a.content_type,
  p: ymd(a.published_at), m: [TYPE_LABEL[a.content_type], cats[a.primary_category_id]?.name, sers[a.series_id]?.name].filter(Boolean).join(' · ') }));
write('archive/index.json', JSON.stringify(index));

function listPage({ rel, depth, title, h1, lead, items, pageNo, pages, baseRel, crumbs, filters }) {
  const canonical = `${SITE}/${rel}`;
  const pager = pages > 1 ? `<nav class="tong-arc-pager" aria-label="페이지">${Array.from({ length: pages }, (_, i) => i + 1).map(n => {
    const href = up(depth) + (n === 1 ? baseRel : `${baseRel}page/${n}/`);
    return n === pageNo ? `<span aria-current="page">${n}</span>` : `<a href="${href}">${n}</a>`; }).join('')}</nav>` : '';
  const f = filters ? `<form class="tong-arc-filter" role="search" onsubmit="return false">
<input type="search" id="arcQ" placeholder="제목·요약 검색" aria-label="제목 검색"/>
<select id="arcC" aria-label="주제"><option value="">모든 주제</option>${D.categories.map(c => `<option value="${c.slug}">${esc(c.name)}</option>`).join('')}</select>
<select id="arcR" aria-label="연재"><option value="">모든 연재</option>${D.series.map(s => `<option value="${s.slug}">${esc(s.name)}</option>`).join('')}</select>
</form>` : '';
  const ld = { '@context': 'https://schema.org', '@graph': [{ '@type': 'CollectionPage', url: canonical, name: h1, inLanguage: 'ko', publisher: ORG_LD,
    mainEntity: { '@type': 'ItemList', itemListElement: items.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/archive/${a.slug}/`, name: a.title })) } },
    crumbsLd(crumbs)] };
  const body = `<header class="tong-arc-head"><div class="tong-arc-in">
<nav class="tong-sol-crumb" aria-label="현재 위치">${crumbs.map(([n, p], i) => i === crumbs.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${up(depth)}${p}">${esc(n)}</a>`).join(' / ')}</nav>
<h1>${esc(h1)}</h1>${lead ? `<p class="tong-arc-sub">${esc(lead)}</p>` : ''}
</div></header>
<div class="tong-arc-in tong-arc-body">${f}
${items.length ? `<ol class="tong-arc-list" id="arcList">${items.map(a => card(a, depth)).join('')}</ol>` : '<p class="tong-arc-empty">첫 글을 준비하고 있습니다.</p>'}
<p class="tong-arc-empty" id="arcNone" hidden>조건에 맞는 글이 없습니다.</p>
${pager}
<p class="tong-arc-browse">${D.categories.map(c => `<a href="${up(depth)}archive/topic/${c.slug}/">${esc(c.name)}</a>`).join('')}</p>
</div>
${filters ? `<script>(function(){var Q=document.getElementById('arcQ'),C=document.getElementById('arcC'),R=document.getElementById('arcR'),L=document.getElementById('arcList'),N=document.getElementById('arcNone'),P=document.querySelector('.tong-arc-pager');if(!L)return;var orig=L.innerHTML,data=null,base='${up(depth)}';
function e(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function run(){var q=Q.value.trim().toLowerCase(),c=C.value,r=R.value;if(!q&&!c&&!r){L.innerHTML=orig;N.hidden=true;if(P)P.hidden=false;return;}
var go=function(){var hit=data.filter(function(a){return(!q||(a.t+' '+a.d).toLowerCase().indexOf(q)>-1)&&(!c||a.c===c||a.cs.indexOf(c)>-1)&&(!r||a.r===r)});
L.innerHTML=hit.map(function(a){return'<li class="tong-arc-item"><a href="'+base+'archive/'+a.s+'/"><span class="m">'+e(a.m)+'</span><span class="t">'+e(a.t)+'</span>'+(a.d?'<span class="d">'+e(a.d)+'</span>':'')+'<span class="w">유영준 · '+a.p+'</span></a></li>'}).join('');N.hidden=hit.length>0;if(P)P.hidden=true;};
if(data)go();else fetch(base+'archive/index.json').then(function(r){return r.json()}).then(function(d){data=d;go()});}
[Q,C,R].forEach(function(x){x.addEventListener('input',run)});})();</script>` : ''}`;
  write(`${rel}index.html`, page({ depth, title, desc: lead || h1, canonical, ld, body }));
}

function paginate({ base, depthBase, h1, lead, list, crumbs, filters, titleBase }) {
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  for (let p = 1; p <= pages; p++) {
    const rel = p === 1 ? base : `${base}page/${p}/`;
    listPage({ rel, depth: depthBase + (p === 1 ? 0 : 2), title: `${titleBase}${p > 1 ? ` (${p}쪽)` : ''} | 통 TONG`, h1, lead,
      items: list.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE), pageNo: p, pages, baseRel: base, crumbs, filters });
  }
}

paginate({ base: 'archive/', depthBase: 1, h1: '아카이브', titleBase: '아카이브 — 경영전환 칼럼·해설·연구',
  lead: '경영 현장과 사람, 역사에서 길어 올린 경영전환의 기록입니다. 주제와 연재로 찾아보실 수 있습니다.',
  list: articles, crumbs: [['홈', ''], ['아카이브', 'archive/']], filters: true });
for (const c of D.categories) {
  const list = articles.filter(a => a.primary_category_id === c.id || arr(a.categories).includes(c.id));
  if (!list.length) continue;
  paginate({ base: `archive/topic/${c.slug}/`, depthBase: 3, h1: c.name, titleBase: `${c.name} — 아카이브`, lead: c.description || `${c.name}에 관한 글`,
    list, crumbs: [['홈', ''], ['아카이브', 'archive/'], [c.name, `archive/topic/${c.slug}/`]] });
}
for (const s of D.series) {
  const list = articles.filter(a => a.series_id === s.id);
  if (!list.length) continue;
  paginate({ base: `archive/series/${s.slug}/`, depthBase: 3, h1: s.name, titleBase: `${s.name} — 연재`, lead: s.description || `연재 「${s.name}」`,
    list, crumbs: [['홈', ''], ['아카이브', 'archive/'], [s.name, `archive/series/${s.slug}/`]] });
}

// 이전 빌드에서 만들었지만 이번에 없는 파일 삭제 (비공개 전환·삭제된 글)
let prev = []; try { prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch {}
let removed = 0;
for (const rel of prev) if (!written.includes(rel)) {
  const f = path.join(ROOT, rel);
  if (fs.existsSync(f)) { fs.unlinkSync(f); removed++; }
  let d = path.dirname(f);
  while (d.startsWith(path.join(ROOT, 'archive')) && d !== path.join(ROOT, 'archive') && fs.existsSync(d) && !fs.readdirSync(d).length) { fs.rmdirSync(d); d = path.dirname(d); }
}
fs.writeFileSync(MANIFEST, JSON.stringify(written.sort(), null, 1));

// sitemap: 수동 항목 유지 + /archive/ 항목 교체
const smPath = path.join(ROOT, 'sitemap.xml');
const sm = fs.readFileSync(smPath, 'utf8');
const keep = sm.split('\n').filter(l => l.includes('<url>') && !l.includes(`${SITE}/archive/`));
const arcUrls = written.filter(r => r.endsWith('index.html') && !r.includes('/page/')).map(r => {
  const loc = `${SITE}/${r.replace(/index\.html$/, '')}`;
  const a = articles.find(x => r === `archive/${x.slug}/index.html`);
  const lm = a ? `<lastmod>${iso(a.pub_updated_at || a.published_at).slice(0, 10)}</lastmod>` : '';
  return `<url><loc>${loc}</loc>${lm}<priority>${a ? '0.7' : '0.6'}</priority></url>`;
});
fs.writeFileSync(smPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${keep.concat(articles.length ? arcUrls : []).join('\n')}\n</urlset>\n`);

console.log(`아카이브 빌드: 글 ${articles.length}편, 파일 ${written.length}개 생성, ${removed}개 정리`);
