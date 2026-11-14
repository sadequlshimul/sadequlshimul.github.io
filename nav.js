/* ===== nav.js: ডান পাশের ভাসমান মেনু বাটন। এক ট্যাপে হোম, লক্ষ্য, কোর্স, মক টেস্ট, Lernpunkt, আমার ব্যাচে যাওয়া যায় ===== */
(function(){
if(window.__jwnav)return;window.__jwnav=1;
var P=location.pathname.split('/').pop();var INDEX=(P===''||P==='index.html');
var S='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
var IT=[
 {k:'home',t:'হোম',c:'#ffd91f',f:'#0b2447',i:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'},
 {k:'goal',t:'লক্ষ্য',c:'#e8590c',i:'<path d="M5 21V4m0 0h11l-2 4 2 4H5"/>'},
 {k:'courses',t:'কোর্স',c:'#1e8e5a',i:'<path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14"/>'},
 {k:'mock',t:'মক টেস্ট',c:'#6f42c1',i:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>'},
 {k:'learn',t:'Lernpunkt',c:'#c2255c',i:'<text x="12" y="17.5" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor" stroke="none" font-family="Georgia,serif">A</text>'}
];
var css='.jwn{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));z-index:9000;font-family:"Hind Siliguri",system-ui,sans-serif;-webkit-tap-highlight-color:transparent}'
+'.jwn *{-webkit-tap-highlight-color:transparent}.jwn.joff{display:none}'
+'.jwn-f{position:relative;width:68px;height:68px;border-radius:50%;border:0;background:#ffd91f;color:#0b2447;box-shadow:0 6px 18px rgba(0,30,70,.28);cursor:pointer;padding:0;display:block;transition:transform .15s ease}'
+'.jwn-f:active{transform:scale(.93)}'
+'.jwn-f svg{position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;transition:transform .24s ease,opacity .18s ease}'
+'.jwn-f .jix{opacity:0;transform:rotate(-90deg) scale(.5)}.jwn.jon .jwn-f .jig{opacity:0;transform:rotate(90deg) scale(.5)}.jwn.jon .jwn-f .jix{opacity:1;transform:none}'
+'.jwn-bd{position:fixed;left:0;top:0;right:0;bottom:0;display:none}.jwn.jon .jwn-bd{display:block}'
+'.jwn-m{position:absolute;right:4px;bottom:84px;min-width:224px;background:var(--card,#fff);border-radius:22px;padding:8px;box-shadow:0 10px 30px rgba(0,30,70,.25);opacity:0;transform:translateY(10px) scale(.9);transform-origin:bottom right;pointer-events:none;transition:opacity .16s ease,transform .2s ease}'
+'.jwn.jon .jwn-m{opacity:1;transform:none;pointer-events:auto}'
+'.jwn-i{display:flex;align-items:center;gap:14px;width:100%;border:0;background:transparent;color:var(--ink,#14213d);padding:7px 10px;border-radius:16px;font:600 18px "Hind Siliguri",system-ui,sans-serif;text-align:left;cursor:pointer;opacity:0;transform:translateY(10px);transition:opacity .16s ease,transform .2s ease,background-color .2s}'
+'.jwn.jon .jwn-i{opacity:1;transform:none;transition-delay:calc(var(--n)*30ms)}'
+'.jwn-i .jic{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;flex:none;background:var(--c);color:var(--fg,#fff)}.jwn-i .jic svg{width:22px;height:22px}'
+'.jwn-i .jck{margin-left:auto;display:none;width:22px;height:22px}.jwn-i.jcur{background:color-mix(in srgb,var(--c) 14%,transparent)}.jwn-i.jcur .jck{display:block}'
+'.jwn-i:active{transform:scale(.98)}body{padding-bottom:104px}'
+'@media (prefers-reduced-motion:reduce){.jwn-m,.jwn-f,.jwn-f svg,.jwn-i{transition:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var box=document.createElement('div');box.className='jwn';
box.innerHTML='<div class="jwn-bd"></div><div class="jwn-m" role="menu"></div><button class="jwn-f" type="button" aria-label="মেনু" aria-expanded="false">'
+S.replace('stroke-width="2"','stroke-width="2.4"').replace('<svg','<svg class="jig"')+'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>'
+S.replace('stroke-width="2"','stroke-width="2.4"').replace('<svg','<svg class="jix"')+'<path d="M6 6l12 12M18 6L6 18"/></svg></button>';
document.body.appendChild(box);
var M=box.querySelector('.jwn-m'),F=box.querySelector('.jwn-f');
function cur(){if(!INDEX)return 'learn';var h=location.hash.replace('#','');if(!h)return 'home';if(h==='goal'||h==='mock'||h==='my')return h;if(h==='vocab')return 'learn';if(h==='admin')return '';return 'courses'}
function fit(){box.classList.toggle('joff',cur()==='')}
function build(){M.innerHTML=IT.map(function(x,n){return '<button class="jwn-i" type="button" role="menuitem" data-k="'+x.k+'" style="--c:'+x.c+(x.f?';--fg:'+x.f:'')+';--n:'+(IT.length-1-n)+'"><span class="jic">'+S+x.i+'</svg></span><span>'+x.t+'</span>'+S.replace('<svg','<svg class="jck"').replace('stroke-width="2"','stroke-width="2.6"')+'<path d="M5 12l5 5 9-10"/></svg></button>'}).join('')}
function mark(){var c=cur();[].forEach.call(M.children,function(b){b.classList.toggle('jcur',b.getAttribute('data-k')===c)})}
function open(o){box.classList.toggle('jon',o);F.setAttribute('aria-expanded',o?'true':'false');if(o)mark()}
function go(k){open(false);if(k===cur()){return}
 if(INDEX){if(k==='home'){typeof window.go==='function'?window.go(''):(location.hash='');return}
  if(k==='learn'){location.href='learn.html';return}
  typeof window.go==='function'?window.go(k):(location.hash=k);return}
 location.href=k==='home'?'index.html':k==='learn'?'learn.html':'index.html#'+k}
F.addEventListener('click',function(){open(!box.classList.contains('jon'))});
box.querySelector('.jwn-bd').addEventListener('click',function(){open(false)});
M.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.jwn-i'):null;if(b)go(b.getAttribute('data-k'))});
document.addEventListener('keydown',function(e){if(e.key==='Escape')open(false)});
window.addEventListener('hashchange',function(){open(false);fit()});window.addEventListener('popstate',function(){open(false);fit()});
build();fit();
})();
