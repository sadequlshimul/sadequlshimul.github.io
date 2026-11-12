/* ===== vocab.js: ভোকাবুলারি — শব্দ থাকে data/vocab-*.json ফাইলে, ভোকাবুলারি ট্যাপ করলে তবেই লোড হয় ===== */
(function(){
var s3=document.createElement('style');
s3.textContent+='.der{--a:#1c7ed6}.die{--a:#e03131}.das{--a:#2f9e44}.vleg{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.vleg span{background:var(--a);color:#fff;font-weight:700;font-size:13px;border-radius:20px;padding:4px 12px}'
+'.mf button.der{color:#1c7ed6}.mf button.die{color:#e03131}.mf button.das{color:#2f9e44}.mf button.der.on{background:#1c7ed6;color:#fff}.mf button.die.on{background:#e03131;color:#fff}.mf button.das.on{background:#2f9e44;color:#fff}'
+'.vg{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px}@media(min-width:600px){.vg{grid-template-columns:repeat(3,1fr)}}@media(min-width:900px){.vg{grid-template-columns:repeat(5,1fr)}}'
+'.wc{position:relative;background:var(--card);border-radius:16px;padding:12px 12px 12px 18px;border:1px solid var(--line);box-shadow:0 2px 8px rgba(0,30,70,.06);overflow:hidden}.wc:before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--a)}'
+'.wc .ar{display:inline-block;background:var(--a);color:#fff;font-weight:700;font-size:12px;border-radius:20px;padding:1px 10px}.wc .nn{font-size:21px;font-weight:700;margin-top:6px;color:var(--a);word-break:break-word}.wc .bn{font-size:15px;margin-top:2px}.wc small{display:block;color:var(--mute);font-size:12px}'
+'.wc .sp{position:absolute;right:8px;top:8px;width:30px;height:30px;border-radius:50%;padding:0;background:var(--soft);color:var(--a);font-size:14px;line-height:1}';
s3.textContent+='.mf{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.mf button{background:var(--soft);color:var(--ink);padding:6px 12px;font-size:13px}.mf button.on{background:var(--p);color:#fff}.wc .ex{font-size:12px;font-style:italic;color:var(--mute);margin-top:4px}';
document.head.appendChild(s3);
var LVS=[],DATA={},vl='',va='',V=function(){return window.JW_V||'1'};
function J(u){return fetch(u+'?v='+V()).then(function(r){if(!r.ok)throw 0;return r.json()})}
async function level(l){if(!DATA[l])DATA[l]=await J('data/vocab-'+l.toLowerCase()+'.json');return DATA[l]}
window.vocLv=async function(l){vl=l;await level(l);draw()};
window.vocAr=function(x){va=x;draw()};
window.vocSay=function(t){try{var u=new SpeechSynthesisUtterance(t);u.lang='de-DE';u.rate=.85;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}};
function draw(){
  var spk='speechSynthesis' in window,W0=DATA[vl]||[];
  $('vLv').innerHTML=LVS.map(function(l){return '<button class="'+(l===vl?'on':'')+'" onclick="vocLv(\''+l+'\')">'+l+(DATA[l]?' · '+DATA[l].length+'টি':'')+'</button>'}).join('');
  $('vAr').innerHTML=[['','সব'],['der','der'],['die','die'],['das','das']].map(function(x){return '<button class="'+x[0]+(va===x[0]?' on':'')+'" onclick="vocAr(\''+x[0]+'\')">'+x[1]+'</button>'}).join('');
  $('vGrid').innerHTML=W0.filter(function(w){return !va||w.a===va}).map(function(w){
    return '<div class="wc '+esc(w.a)+'"><span class="ar">'+esc(w.a)+'</span>'+(spk?'<button class="sp" aria-label="উচ্চারণ শোনো" onclick="vocSay(\''+esc(w.a+' '+w.w).replace(/\'/g,'')+'\')">🔊</button>':'')
     +'<div class="nn">'+esc(w.w)+'</div><div class="bn">'+esc(w.bn)+'</div><small>'+esc(w.p||'')+(w.pl?' · বহুবচন: die '+esc(w.pl):'')+'</small>'+(w.ex?'<div class="ex">'+esc(w.ex)+'</div>':'')+'</div>'}).join('')||'<p class="sub">এই তালিকায় কিছু নেই।</p>';
}
window.initVocab=async function(panel){
  panel.innerHTML='<div class="card"><h2>📚 ভোকাবুলারি</h2><p class="sub">লেভেল বেছে নাও। প্রতিটা আর্টিকেলের আলাদা রঙ, রঙ দেখেই শব্দের লিঙ্গ মনে রাখো।</p><div class="mf" id="vLv"></div><div class="vleg"><span class="der">der · পুংলিঙ্গ</span><span class="die">die · স্ত্রীলিঙ্গ</span><span class="das">das · ক্লীবলিঙ্গ</span></div><div class="mf" id="vAr"></div><div class="vg" id="vGrid"><p class="sub">লোড হচ্ছে…</p></div></div>';
  try{LVS=await J('data/vocab-index.json');vl=LVS[0];await level(vl);draw()}
  catch(e){$('vGrid').innerHTML='<p class="sub">শব্দ লোড হয়নি, আবার চেষ্টা করো।</p>'}
};
})();
