/* 아카이브 글 공유 이미지(16:9, 1200×675) 생성기
   content/archive/*.md 의 제목·분류로 TONG 틀 이미지를 만들어 assets/og/archive/<주소>.jpg 로 저장한다.
   제목·분류가 바뀐 글만 다시 그린다(.og-manifest.json). 본문은 읽지 않는다.
   실행: node _tools/og_build.js && node _build/build-archive.mjs && node _tools/prerender-nav.js */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');const OUT=path.join(ROOT,'assets','og','archive');const MAN=path.join(OUT,'.og-manifest.json');
const VERSION='v2';
const T=JSON.parse(fs.readFileSync(path.join(ROOT,'content','taxonomy.json'),'utf8'));
const CAT=Object.fromEntries(T.categories.map(c=>[c.id,c.name]));const SER=Object.fromEntries(T.series.map(c=>[c.id,c.name]));
function fm(raw){const m=raw.match(/^---\n([\s\S]*?)\n---/);const o={};for(const l of m[1].split('\n')){const k=l.match(/^([a-z_]+):\s*(.*)$/);if(k)o[k[1]]=k[2];}return o;}
const unq=v=>{v=(v||'').trim();if(v==='null'||!v)return '';try{return JSON.parse(v)}catch(e){return v.replace(/^['"]|['"]$/g,'')}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function html(title,label){return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face{font-family:P;src:url(/assets/fonts/PretendardVariable.woff2) format('woff2');font-weight:45 920}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1200px;height:675px}
body{font-family:P,sans-serif;background:#fff;position:relative;overflow:hidden;color:#161d29;word-break:keep-all}
.bar{position:absolute;left:0;top:0;bottom:0;width:14px;background:#3684FF}
.glow{position:absolute;right:-180px;top:-160px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(54,132,255,.16),transparent 66%)}
.tong{position:absolute;right:56px;bottom:-60px;font-size:400px;font-weight:900;color:#3684FF;opacity:.06;line-height:1}
.brand{position:absolute;left:88px;top:70px;display:flex;align-items:center;gap:14px;font-size:24px;font-weight:700;color:#161d29}
.brand img{height:46px}
.mid{position:absolute;left:88px;right:130px;top:150px;bottom:130px;display:flex;flex-direction:column;justify-content:center}
.lab{margin-bottom:22px;font-size:24px;font-weight:700;color:#3684FF;letter-spacing:.02em}
.t{font-size:var(--fs);font-weight:820;line-height:1.28;letter-spacing:-.035em;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.foot{position:absolute;left:88px;bottom:62px;font-size:22px;color:#7b879c;font-weight:600}
.foot b{color:#161d29}
</style></head><body><div class="bar"></div><div class="glow"></div><div class="tong">通</div>
<div class="brand"><img src="/assets/images/tong-logo.png"><span>경영전환연구소 TONG</span></div>
<div class="mid"><div class="lab">${esc(label)}</div><div class="t" id="t">${esc(title)}</div></div>
<div class="foot"><b>유영준</b> · workstong.com 아카이브</div></body></html>`;}
(async()=>{
  const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);if(u==='/__og'){r.writeHead(200,{'content-type':'text/html; charset=utf-8'});return r.end(srv.page)}try{r.end(fs.readFileSync(path.join(ROOT,u)))}catch(e){r.writeHead(404);r.end()}}).listen(0);
  const port=srv.address().port;let man={};try{man=JSON.parse(fs.readFileSync(MAN,'utf8'))}catch(e){}
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1200,height:675}});let made=0,kept=0;const seen=new Set();
  for(const f of fs.readdirSync(path.join(ROOT,'content','archive')).filter(x=>x.endsWith('.md')).sort()){
    const slug=f.slice(0,-3);seen.add(slug);const h=fm(fs.readFileSync(path.join(ROOT,'content','archive',f),'utf8'));
    if((unq(h.status)||'published')!=='published')continue;
    const title=unq(h.title);const label=[CAT[unq(h.category)],SER[unq(h.series)]].filter(Boolean).join(' · ');
    const key=crypto.createHash('sha1').update(VERSION+'|'+title+'|'+label).digest('hex');const out=path.join(OUT,slug+'.jpg');
    if(man[slug]===key&&fs.existsSync(out)){kept++;continue;}
    srv.page=html(title,label);await pg.goto(`http://localhost:${port}/__og`);await pg.evaluate(()=>document.fonts.ready);
    await pg.evaluate(()=>{const t=document.getElementById('t');const len=t.textContent.length;t.style.setProperty('--fs',(len<=18?72:len<=30?62:54)+'px');});
    await pg.screenshot({path:out,type:'jpeg',quality:86});man[slug]=key;made++;}
  for(const k of Object.keys(man))if(!seen.has(k)){delete man[k];try{fs.unlinkSync(path.join(OUT,k+'.jpg'))}catch(e){}}
  fs.writeFileSync(MAN,JSON.stringify(man,null,1)+'\n');await b.close();srv.close();console.log('공유 이미지: 새로 그림',made,'· 그대로',kept);
})().catch(e=>{console.error(e);process.exit(1)});
