/* GNB·푸터 정적 폴백 생성기
   navigation.js가 만드는 메뉴·푸터 HTML을 각 페이지 소스에 미리 넣어 둔다.
   → JS를 실행하지 않는 크롤러도 내부 링크·사업자 정보를 읽을 수 있다.
   → 브라우저에서는 navigation.js가 같은 마크업으로 다시 그리므로 화면 변화 없음.
   navigation.js(메뉴·푸터)를 수정한 뒤에는 반드시 다시 실행:
     node _tools/prerender-nav.js            (저장소 루트에서, Playwright 필요) */
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const SKIP=new Set(['404.html']);
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
function walk(d,o=[]){for(const f of fs.readdirSync(d)){if(f.startsWith('.')||f==='_tools'||f==='poem'||f==='lab'||f==='node_modules')continue;const p=path.join(d,f);const st=fs.statSync(p);if(st.isDirectory())walk(p,o);else if(f.endsWith('.html'))o.push(p);}return o;}
const RE_NAV=/<div id="tong-nav-root">(?:<!--prerender:nav-->[\s\S]*?<!--\/prerender:nav-->)?<\/div>/;
const RE_FOOT=/<div id="tong-footer-root">(?:<!--prerender:footer-->[\s\S]*?<!--\/prerender:footer-->)?<\/div>/;
(async()=>{
  const srv=http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);let p=path.join(ROOT,u);try{if(fs.statSync(p).isDirectory())p=path.join(p,'index.html');r.writeHead(200,{'content-type':MIME[path.extname(p)]||'application/octet-stream'});r.end(fs.readFileSync(p));}catch(e){r.writeHead(404);r.end();}}).listen(0);
  const port=srv.address().port;
  const b=await chromium.launch();const ctx=await b.newContext();
  await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
  const page=await ctx.newPage();let n=0;
  for(const f of walk(ROOT)){
    const rel=path.relative(ROOT,f).split(path.sep).join('/');
    if(SKIP.has(rel))continue;
    let src=fs.readFileSync(f,'utf8');
    if(!RE_NAV.test(src)&&!RE_FOOT.test(src))continue;
    await page.goto(`http://localhost:${port}/${rel}`,{waitUntil:'domcontentloaded'});
    const h=await page.evaluate(()=>({nav:(document.getElementById('tong-nav-root')||{}).innerHTML||'',foot:(document.getElementById('tong-footer-root')||{}).innerHTML||''}));
    if(!h.nav||!h.foot)throw new Error('렌더 실패: '+rel);
    src=src.replace(RE_NAV,`<div id="tong-nav-root"><!--prerender:nav-->${h.nav}<!--/prerender:nav--></div>`)
           .replace(RE_FOOT,`<div id="tong-footer-root"><!--prerender:footer-->${h.foot}<!--/prerender:footer--></div>`);
    fs.writeFileSync(f,src);n++;console.log('ok',rel);
  }
  await b.close();srv.close();console.log('완료:',n,'개 페이지');
})().catch(e=>{console.error(e);process.exit(1);});
