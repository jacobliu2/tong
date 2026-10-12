(function(root){'use strict';
const KEY='poetry-suno-bookmarks:v1',valid=id=>typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
function parse(value){const d=typeof value==='string'?JSON.parse(value):value;if(!d||d.version!==1||!Array.isArray(d.song_ids)||d.song_ids.length>10000||!d.song_ids.every(valid))throw Error('Invalid bookmark file');return [...new Set(d.song_ids.map(id=>id.toLowerCase()))]}
function create(storage){let ids=new Set(),persistent=true,dirty=false;function refresh(force=false){if(dirty&&!force)return [...ids];try{const s=storage===undefined?root.localStorage:storage;if(!s)throw Error('Storage unavailable');const raw=s.getItem(KEY);ids=new Set(raw?parse(raw):[]);persistent=true;dirty=false}catch{persistent=false}return [...ids]}
 function save(){try{const s=storage===undefined?root.localStorage:storage;s.setItem(KEY,JSON.stringify({version:1,song_ids:[...ids]}));persistent=true;dirty=false}catch{persistent=false;dirty=true}return persistent}
 refresh();return {refresh,has:id=>ids.has(id),snapshot:()=>[...ids],isPersistent:()=>persistent,toggle(id){if(!valid(id))throw Error('Invalid song ID');refresh();id=id.toLowerCase();ids.has(id)?ids.delete(id):ids.add(id);save();return ids.has(id)},merge(value){const incoming=parse(value);refresh();incoming.forEach(id=>ids.add(id));save();return incoming.length},export:()=>({version:1,song_ids:[...ids]})};
}
root.PoetryBookmarks={KEY,create,parse};
})(typeof window==='undefined'?globalThis:window);
