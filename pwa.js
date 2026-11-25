/* ===== pwa.js: হোম স্ক্রিনে যোগ করার বাটন + অফলাইন সহায়ক চালু করা ===== */
(function(){
if('serviceWorker' in navigator){window.addEventListener('load',function(){try{navigator.serviceWorker.register('sw.js').catch(function(){})}catch(e){}})}
var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
if(standalone)return;
var P=location.pathname.split('/').pop();if(!(P===''||P==='index.html'))return;
var dis=0;try{dis=+localStorage.getItem('jw_pwa_x')||0}catch(e){}
if(Date.now()-dis<14*864e5)return;
var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
var dp=null,box=null;
var css='.pwa{display:flex;align-items:center;gap:12px;background:var(--card,#fff);border-radius:16px;box-shadow:0 2px 10px rgba(0,30,70,.1);border-left:8px solid #ffda1a;padding:12px;margin:0 0 12px;position:relative}'
+'.pwa img{width:46px;height:46px;border-radius:12px;flex:none}.pwa b{display:block;font-size:15px;line-height:1.3}.pwa small{display:block;color:var(--mute,#6a7385);font-size:12.5px;line-height:1.35}'
+'.pwa .pb{margin-left:auto;flex:none;background:#ffda1a;color:#0b2447;border:0;border-radius:99px;padding:9px 14px;font:700 14px "Noto Sans Bengali","Hind Siliguri",system-ui,sans-serif;cursor:pointer}'
+'.pwa .px{position:absolute;right:6px;top:2px;background:none;border:0;color:var(--mute,#6a7385);font-size:20px;line-height:1;padding:4px 8px;cursor:pointer}'
+'.pwa .hint{flex-basis:100%;font-size:13px;line-height:1.5;background:var(--soft,#e3ecf6);border-radius:10px;padding:8px 10px;margin-top:2px}.pwa.col{flex-wrap:wrap}';
function hashOk(){var h=location.hash;return h===''||h==='#'}
function sync(){if(box)box.style.display=hashOk()?'':'none'}
function show(){
  if(box)return;var main=document.querySelector('main');if(!main)return;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  box=document.createElement('div');box.className='pwa';box.setAttribute('data-nosnippet','');
  box.innerHTML='<img src="icon-192.png" alt=""><div style="min-width:0;padding-right:18px"><b>ফোনের হোম স্ক্রিনে যোগ করুন</b><small>অ্যাপের মতো খুলবে, নেট কম থাকলেও পাঠ চলবে</small></div><button class="pb" type="button">যোগ করুন</button><button class="px" type="button" aria-label="বন্ধ করুন">&times;</button>';
  main.insertBefore(box,main.firstChild);sync();
  box.querySelector('.px').onclick=function(){try{localStorage.setItem('jw_pwa_x',String(Date.now()))}catch(e){}box.remove();box=null};
  box.querySelector('.pb').onclick=function(){
    if(dp){dp.prompt();dp.userChoice&&dp.userChoice.then(function(){dp=null;if(box){box.remove();box=null}}).catch(function(){});return}
    if(!box.querySelector('.hint')){
      var h=document.createElement('div');h.className='hint';
      h.innerHTML=ios?'Safari তে নিচের মেনু থেকে <b>Share</b> (বর্গ থেকে ওপরে তীর) চাপুন, তারপর <b>Add to Home Screen</b> বেছে নিন।':'ব্রাউজারের মেনু (⋮) খুলে <b>Add to Home screen</b> বা <b>Install app</b> চাপুন।';
      box.classList.add('col');box.appendChild(h)}
  };
}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;show()});
window.addEventListener('appinstalled',function(){if(box){box.remove();box=null}});
window.addEventListener('hashchange',sync);
if(ios)window.addEventListener('load',show);
})();
