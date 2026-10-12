// Title keys treat remastered/remix versions as the same song title.
(function(root){'use strict';
function titleKey(s){return String(s).normalize('NFKC').toLocaleLowerCase().replace(/\s*\((?:remastered|remix)\)\s*$/i,'').replace(/[^\p{L}\p{N}]/gu,'')}
function shuffled(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function recent(tracks){return [...tracks].sort((a,b)=>(Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0)||a.id.localeCompare(b.id))}
function pick(poems,catalog,limit=100,random=Math.random){const result=[],poemTitles=new Set(),songTitles=new Set(),ids=new Set();for(const p of shuffled(poems,random)){const pk=titleKey(p.title);if(poemTitles.has(pk))continue;const options=shuffled(recent(catalog[String(p.n)]||[]).slice(0,2),random).filter(t=>!ids.has(t.id)&&!songTitles.has(titleKey(t.title)));if(!options.length)continue;const t=options[0];result.push({...t,n:p.n,poem_title:p.title});poemTitles.add(pk);songTitles.add(titleKey(t.title));ids.add(t.id);if(result.length>=limit)break}return result}
root.PoetryShuffle={titleKey,recent,pick,shuffled};
})(typeof window==='undefined'?globalThis:window);
