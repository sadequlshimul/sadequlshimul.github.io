/* ===== mock.js: মক টেস্ট (A1 · A2 · B1) — মক টেস্ট ট্যাপ করলে তবেই লোড হয়।
   A1 · Lesen চালু (Goethe-Zertifikat A1: Start Deutsch 1 এর ধাঁচে)। প্রশ্নের তালিকা mock-a1-lesen.js ফাইলে ===== */
(function(){
var CSS=''
+'.lv{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.lv button{display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--soft);color:var(--ink);border-radius:16px;padding:14px 6px;font-size:13px;line-height:1.3}'
+'.lv i{font-style:normal;display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:var(--c);color:#fff;font-weight:700;font-size:20px}.lv button.on{background:var(--c);color:#fff}.lv button.on i{background:rgba(255,255,255,.25)}'
+'.mods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.mods>div,.mods>button{background:var(--soft);color:var(--ink);border-radius:12px;padding:10px;font-size:14px;text-align:left;overflow-wrap:anywhere}.mods small{display:block;color:var(--mute);font-size:12px}'
+'.mods>button{border:2px solid #1e8e5a;font-weight:500}.mods>button b{color:#1e8e5a}'
+'.mx-pre{white-space:pre-line;overflow-wrap:anywhere}'
+'.mx-bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:6;display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--card);padding:10px 14px;border-radius:14px;box-shadow:0 2px 10px rgba(0,30,70,.12);margin-bottom:12px}'
+'.mx-bar b{display:block;font-size:15px;overflow-wrap:anywhere}.mx-bar small{color:var(--mute);font-size:12px}.mx-tm{font-weight:700;font-size:24px;font-variant-numeric:tabular-nums;flex:none}.mx-tm.lo{color:#d6336c}'
+'.mx-teil{margin-top:20px}.mx-teil h3{font-size:17px;margin:0 0 6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.mx-teil h3 span{background:#1e8e5a;color:#fff;border-radius:8px;padding:1px 10px;font-size:14px}'
+'.mx-ins{font-size:14px;font-weight:600;margin:0 0 2px;overflow-wrap:anywhere}.mx-bn{font-size:13px;color:var(--mute);margin:0 0 10px;overflow-wrap:anywhere}'
+'.mx-txt{background:var(--soft);border-radius:14px;padding:12px 14px;margin:8px 0;font-size:15px;line-height:1.55}.mx-txt h4{margin:0 0 6px;font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.4px}'
+'.mx-q{border:2px solid var(--line);border-radius:16px;padding:12px;margin:10px 0}.mx-q.un{border-color:#d6336c}'
+'.mx-no{display:inline-grid;place-items:center;min-width:28px;height:28px;border-radius:50%;background:#1e8e5a;color:#fff;font-weight:700;font-size:13px;margin-right:8px;vertical-align:middle}'
+'.mx-s{font-weight:600;overflow-wrap:anywhere;line-height:1.45}'
+'.mx-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}'
+'.mx-ch{background:transparent;color:var(--ink);border:2px solid var(--line);border-radius:12px;padding:10px 8px;font-weight:600;transition:background-color .15s,border-color .15s}'
+'.mx-ch.sel{border-color:#1e8e5a;background:color-mix(in srgb,#1e8e5a 18%,transparent)}'
+'.mx-ab{display:grid;gap:8px;margin-top:10px}.mx-ab .mx-ch{text-align:left;font-weight:500;display:flex;gap:10px;align-items:flex-start;padding:10px;line-height:1.45}'
+'.mx-ab .mx-ch>b{flex:none;width:26px;height:26px;border-radius:50%;background:var(--soft);display:grid;place-items:center;font-size:13px}.mx-ab .sel>b{background:#1e8e5a;color:#fff}.mx-ab .mx-ch>span{overflow-wrap:anywhere;min-width:0}'
+'.mx-sign{border:3px solid var(--ink);border-radius:10px;padding:10px 12px;text-align:center;font-weight:700;margin:8px 0;white-space:pre-line;overflow-wrap:anywhere;line-height:1.45}'
+'.mx-go{width:100%;margin-top:18px;background:#1e8e5a;color:#fff;font-size:17px;padding:14px}'
+'.mx-score{text-align:center;padding:6px 0 10px}.mx-big{font-size:46px;font-weight:800;line-height:1.1}.mx-pill{display:inline-block;border-radius:99px;padding:4px 14px;font-weight:700;font-size:14px;margin-top:8px}'
+'.mx-pill.ok{background:color-mix(in srgb,#1e8e5a 20%,transparent);color:#1e8e5a}.mx-pill.no{background:color-mix(in srgb,#d6336c 18%,transparent);color:#d6336c}'
+'.mx-parts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}.mx-parts div{background:var(--soft);border-radius:12px;padding:10px 4px;text-align:center;font-size:12px;color:var(--mute)}.mx-parts b{display:block;font-size:20px;color:var(--ink)}'
+'.mx-r{border-radius:14px;padding:12px;margin:10px 0;background:var(--soft);border-left:6px solid var(--line)}.mx-r.ok{border-left-color:#1e8e5a}.mx-r.bad{border-left-color:#d6336c}'
+'.mx-r p{margin:6px 0 0;overflow-wrap:anywhere}.mx-rs{font-size:13px;color:var(--mute)}.mx-ex{font-size:14px;line-height:1.5}'
+'.mx-sets{display:grid;gap:10px;margin-top:12px}.mx-sets button{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--soft);color:var(--ink);border:2px solid transparent;border-radius:14px;padding:14px;text-align:left}.mx-sets button b{font-size:16px}.mx-sets small{display:block;color:var(--mute);font-size:12px}.mx-sets em{font-style:normal;font-weight:700;color:#1e8e5a;font-size:13px;flex:none}'
+'.mx-chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.mx-chips span{background:var(--soft);border-radius:99px;padding:4px 12px;font-size:13px}'
+'.mx-act{display:grid;gap:8px;margin-top:14px}.mx-act button.g{background:transparent;color:var(--ink);border:2px solid var(--line)}.mx-exam .jwn{display:none}';
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);

var LV=[['A1','#1e8e5a'],['A2','#0c8599'],['B1','#6f42c1']];
var MD=[['Lesen','পড়া'],['Hören','শোনা'],['Schreiben','লেখা'],['Sprechen','বলা']];
var MIN=25;
var PM=null,cur='home',curLv='',ST=null,TM=null;
function el(i){return document.getElementById(i)}
function nb(n){return String(n).replace(/\d/g,function(d){return '০১২৩৪৫৬৭৮৯'[d]})}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function sets(){return window.MOCK_A1_LESEN||[]}
function saved(id){try{return JSON.parse(localStorage.getItem('jwm_'+id)||'null')}catch(e){return null}}
function save(id,sc){try{var o=saved(id)||{};o.last=sc;o.best=Math.max(o.best||0,sc);o.n=(o.n||0)+1;localStorage.setItem('jwm_'+id,JSON.stringify(o))}catch(e){}}
function clock(s){var m=Math.floor(s/60),x=s%60;return nb((m<10?'0':'')+m)+':'+nb((x<10?'0':'')+x)}

/* ---------- দৃশ্য ---------- */
function viewHome(){
  var h='<div class="card"><h2>মক টেস্ট</h2><p class="sub">আপনার লেভেল বেছে নিন</p><div class="lv">'
   +LV.map(function(l){return '<button data-l="'+l[0]+'" class="'+(curLv===l[0]?'on':'')+'" style="--c:'+l[1]+'"><i>'+l[0]+'</i><b>মক টেস্ট '+l[0]+'</b></button>'}).join('')+'</div><div id="lvDet">'+detail()+'</div></div>';
  PM.innerHTML=h;
}
function detail(){
  if(!curLv)return '';
  var col=(LV.filter(function(l){return l[0]===curLv})[0]||[0,'#1e8e5a'])[1];
  var live=curLv==='A1'&&sets().length>=0;
  return '<div style="margin-top:14px;border-left:6px solid '+col+';padding-left:12px"><h2 style="font-size:18px">মক টেস্ট '+curLv+'</h2><p class="sub">'+(curLv==='A1'?'পড়ার (Lesen) অংশটা এখন চালু। বাকি তিনটা শীঘ্রই আসছে।':'চারটা অংশে পুরো পরীক্ষার মতো অনুশীলন। শীঘ্রই আসছে।')+'</p></div><div class="mods">'
   +MD.map(function(m,i){return (curLv==='A1'&&i===0)?'<button data-m="lesen"><b>'+m[0]+'</b><small>'+m[1]+' · ৩টা মডেল টেস্ট</small></button>':'<div><b>'+m[0]+'</b><small>'+m[1]+' · শীঘ্রই</small></div>'}).join('')+'</div>';
}
function viewSets(){
  var S=sets();
  PM.innerHTML='<div class="card"><h2>A1 · Lesen</h2><p class="sub">Goethe-Zertifikat A1: Start Deutsch 1 এর ধাঁচে অনুশীলন</p>'
   +'<div class="mx-chips"><span>১৫টা প্রশ্ন</span><span>'+nb(MIN)+' মিনিট</span><span>Teil 1 · 2 · 3</span></div>'
   +'<p class="mx-bn">Teil 1: ২টা লেখা, Richtig/Falsch (১–৫)। Teil 2: কোন লেখায় তথ্য আছে, a বা b (৬–১০)। Teil 3: সাইনবোর্ড ও নোটিশ, Richtig/Falsch (১১–১৫)।</p>'
   +'<div class="mx-sets">'+S.map(function(s){var v=saved(s.id);return '<button data-set="'+s.id+'"><span><b>'+esc(s.title)+'</b><small>'+(v?'সেরা ফল: '+nb(v.best)+'/১৫ · '+nb(v.n)+' বার':'এখনো দেওয়া হয়নি')+'</small></span><em>শুরু ›</em></button>'}).join('')+'</div></div>';
}
function q(set){ /* সব প্রশ্ন এক তালিকায় */
  var L=[];
  set.t1.q.forEach(function(x,i){L.push({n:i+1,t:1,s:x.s,k:x.a?'r':'f',e:x.e,kind:'rf'})});
  set.t2.forEach(function(x,i){L.push({n:i+6,t:2,s:x.s,a:x.a,b:x.b,k:x.k,e:x.e,kind:'ab'})});
  set.t3.forEach(function(x,i){L.push({n:i+11,t:3,s:x.s,sign:x.sign,k:x.a?'r':'f',e:x.e,kind:'rf'})});
  return L;
}
function rf(n,v){return '<div class="mx-row"><button class="mx-ch'+(v==='r'?' sel':'')+'" data-q="'+n+'" data-v="r">Richtig</button><button class="mx-ch'+(v==='f'?' sel':'')+'" data-q="'+n+'" data-v="f">Falsch</button></div>'}
function ab(n,x,v){return '<div class="mx-ab"><button class="mx-ch'+(v==='a'?' sel':'')+'" data-q="'+n+'" data-v="a"><b>a</b><span class="mx-pre">'+esc(x.a)+'</span></button><button class="mx-ch'+(v==='b'?' sel':'')+'" data-q="'+n+'" data-v="b"><b>b</b><span class="mx-pre">'+esc(x.b)+'</span></button></div>'}
function viewExam(mark){
  var S=ST.set,A=ST.ans,qs=ST.qs;
  var done=Object.keys(A).length;
  var h='<div class="card"><div class="mx-bar"><div><b>Lesen · '+esc(S.title)+'</b><small id="mxCnt">'+nb(done)+'/১৫ উত্তর দেওয়া হয়েছে</small></div><div class="mx-tm" id="mxTm">'+clock(ST.left)+'</div></div>';
  function bad(n){return mark&&!A[n]?' un':''}
  h+='<div class="mx-teil"><h3><span>Teil 1</span></h3><p class="mx-ins">Lesen Sie die beiden Texte und die Aufgaben 1 bis 5. Kreuzen Sie an: Richtig oder Falsch.</p><p class="mx-bn">দুটো লেখা ও ১–৫ নম্বর প্রশ্ন পড়ুন। ঠিক হলে Richtig, ভুল হলে Falsch বেছে নিন।</p>'
   +S.t1.texts.map(function(t){return '<div class="mx-txt"><h4>'+esc(t.h)+'</h4><div class="mx-pre">'+esc(t.t)+'</div></div>'}).join('');
  qs.filter(function(x){return x.t===1}).forEach(function(x){h+='<div class="mx-q'+bad(x.n)+'" id="mq'+x.n+'"><span class="mx-no">'+nb(x.n)+'</span><span class="mx-s">'+esc(x.s)+'</span>'+rf(x.n,A[x.n])+'</div>'});
  h+='</div><div class="mx-teil"><h3><span>Teil 2</span></h3><p class="mx-ins">Lesen Sie die Texte und die Aufgaben 6 bis 10. Wo finden Sie Informationen? Kreuzen Sie an: a oder b.</p><p class="mx-bn">৬–১০ নম্বর প্রশ্ন পড়ুন। তথ্যটা কোন লেখায় আছে, a না b, বেছে নিন।</p>';
  qs.filter(function(x){return x.t===2}).forEach(function(x){h+='<div class="mx-q'+bad(x.n)+'" id="mq'+x.n+'"><span class="mx-no">'+nb(x.n)+'</span><span class="mx-s">'+esc(x.s)+'</span>'+ab(x.n,x,A[x.n])+'</div>'});
  h+='</div><div class="mx-teil"><h3><span>Teil 3</span></h3><p class="mx-ins">Lesen Sie die Texte und die Aufgaben 11 bis 15. Kreuzen Sie an: Richtig oder Falsch.</p><p class="mx-bn">৫টা সাইন বা নোটিশ পড়ুন। নিচের বাক্যটা ঠিক না ভুল, বেছে নিন।</p>';
  qs.filter(function(x){return x.t===3}).forEach(function(x){h+='<div class="mx-q'+bad(x.n)+'" id="mq'+x.n+'"><span class="mx-no">'+nb(x.n)+'</span><div class="mx-sign">'+esc(x.sign)+'</div><span class="mx-s">'+esc(x.s)+'</span>'+rf(x.n,A[x.n])+'</div>'});
  h+='</div><button class="mx-go" data-act="submit">জমা দিন (Abgeben)</button></div>';
  var y=window.pageYOffset;PM.innerHTML=h;if(mark!==undefined)window.scrollTo(0,y);
}
function viewResult(){
  var S=ST.set,A=ST.ans,qs=ST.qs,ok=0,p=[0,0,0,0];
  qs.forEach(function(x){if(A[x.n]===x.k){ok++;p[x.t]++}});
  var pc=Math.round(ok/15*100),used=MIN*60-ST.left;
  var h='<div class="card"><div class="mx-score"><p class="sub">Lesen · '+esc(S.title)+'</p><div class="mx-big">'+nb(ok)+' / ১৫</div><p class="sub">'+nb(pc)+'% · সময় লেগেছে '+nb(Math.floor(used/60))+' মিনিট '+nb(used%60)+' সেকেন্ড'+(ST.timeup?' (সময় শেষ)':'')+'</p>'
   +'<span class="mx-pill '+(pc>=60?'ok':'no')+'">'+(pc>=60?'ভালো প্রস্তুতি (৬০% বা বেশি)':'আরও অনুশীলন দরকার (৬০% এর কম)')+'</span></div>'
   +'<div class="mx-parts"><div><b>'+nb(p[1])+'/৫</b>Teil 1</div><div><b>'+nb(p[2])+'/৫</b>Teil 2</div><div><b>'+nb(p[3])+'/৫</b>Teil 3</div></div>'
   +'<p class="mx-bn">পরীক্ষায় পাস করতে মোট ৬০% নম্বর লাগে। এটা অনুশীলনের ফল, আসল পরীক্ষার নম্বর নয়।</p>'
   +'<div class="mx-act"><button data-act="again">আবার দিন</button><button class="g" data-act="sets">অন্য মডেল টেস্ট</button></div></div>'
   +'<div class="card" style="margin-top:12px"><h2>উত্তর ও ব্যাখ্যা</h2>';
  function an(x,v){if(!v)return 'উত্তর দেননি';return x.kind==='ab'?v:(v==='r'?'Richtig':'Falsch')}
  qs.forEach(function(x){
    var good=A[x.n]===x.k;
    h+='<div class="mx-r '+(good?'ok':'bad')+'"><b>'+nb(x.n)+'. '+(good?'✓ সঠিক':'✕ ভুল')+'</b><p class="mx-s">'+esc(x.s)+'</p>'
     +(x.sign?'<div class="mx-sign" style="font-size:14px">'+esc(x.sign)+'</div>':'')
     +(x.kind==='ab'?'<div class="mx-ab" style="margin-top:6px"><div class="mx-ch'+(x.k==='a'?' sel':'')+'"><b>a</b><span class="mx-pre">'+esc(x.a)+'</span></div><div class="mx-ch'+(x.k==='b'?' sel':'')+'"><b>b</b><span class="mx-pre">'+esc(x.b)+'</span></div></div>':'')
     +'<p class="mx-rs">আপনার উত্তর: <b>'+an(x,A[x.n])+'</b> · সঠিক উত্তর: <b>'+an(x,x.k)+'</b></p><p class="mx-ex">'+esc(x.e)+'</p></div>';
  });
  PM.innerHTML=h+'<div class="mx-act"><button data-act="again">আবার দিন</button><button class="g" data-act="sets">অন্য মডেল টেস্ট</button></div></div>';
  window.scrollTo(0,0);
}
function draw(){
  document.body.classList.toggle('mx-exam',cur==='exam'&&!!ST&&!ST.done);
  if(cur==='home')viewHome();
  else if(cur==='sets')viewSets();
  else if(cur==='exam'&&ST)ST.done?viewResult():viewExam();
  else viewHome();
}

/* ---------- ইতিহাস (ফোনের ব্যাক বাটনের জন্য) ---------- */
function go(v,rep){cur=v;try{rep?history.replaceState({jwm:v},''):history.pushState({jwm:v},'')}catch(e){}draw();window.scrollTo(0,0)}
function stop(){if(TM){clearInterval(TM);TM=null}}
function onPop(e){
  if(!PM||!PM.offsetParent&&cur!=='exam')return;
  var v=(e.state&&e.state.jwm)||'home';
  if(cur==='exam'&&ST&&!ST.done){
    if(!confirm('পরীক্ষা মাঝপথে ছেড়ে দেবেন? আপনার উত্তরগুলো মুছে যাবে।')){try{history.pushState({jwm:'exam'},'')}catch(x){}return}
  }
  stop();ST=null;
  if(cur==='exam'&&v==='exam')v='sets';
  cur=v;draw();window.scrollTo(0,0);
}
function tick(){
  if(!ST||ST.done){stop();return}
  ST.left--;
  var t=el('mxTm');if(t){t.textContent=clock(ST.left);t.classList.toggle('lo',ST.left<=300)}
  if(ST.left<=0){ST.timeup=true;finish()}
}
function start(id){
  var S=sets().filter(function(x){return x.id===id})[0];if(!S)return;
  ST={set:S,qs:q(S),ans:{},left:MIN*60,done:false,timeup:false};
  stop();TM=setInterval(tick,1000);go('exam',cur==='exam');
}
function finish(){
  if(!ST||ST.done)return;
  ST.done=true;stop();
  var ok=0;ST.qs.forEach(function(x){if(ST.ans[x.n]===x.k)ok++});
  save(ST.set.id,ok);document.body.classList.remove('mx-exam');viewResult();
}
function onClick(e){
  var t=e.target&&e.target.closest?e.target.closest('button'):null;if(!t)return;
  var d=t.dataset;
  if(d.l){curLv=d.l;var det=el('lvDet');Array.prototype.forEach.call(PM.querySelectorAll('.lv button'),function(x){x.classList.toggle('on',x===t)});if(det)det.innerHTML=detail();return}
  if(d.m==='lesen'){go('sets');return}
  if(d.set){start(d.set);return}
  if(d.q&&ST&&!ST.done){
    var n=+d.q;ST.ans[n]=d.v;
    var box=el('mq'+n);if(box){box.classList.remove('un');Array.prototype.forEach.call(box.querySelectorAll('.mx-ch'),function(x){x.classList.toggle('sel',x.dataset.v===d.v)})}
    var c=el('mxCnt');if(c)c.textContent=nb(Object.keys(ST.ans).length)+'/১৫ উত্তর দেওয়া হয়েছে';return}
  if(d.act==='submit'){
    var left=15-Object.keys(ST.ans).length;
    if(left>0){
      if(!confirm(nb(left)+'টা প্রশ্নের উত্তর দেননি। তবুও জমা দেবেন?')){
        var f=ST.qs.filter(function(x){return !ST.ans[x.n]})[0];viewExam(true);
        var b=f&&el('mq'+f.n);if(b)b.scrollIntoView({block:'center'});return}
    }
    finish();return}
  if(d.act==='again'&&ST){start(ST.set.id);return}
  if(d.act==='sets'){history.back();return}
}
window.addEventListener('hashchange',function(){stop();ST=null;cur='home';if(PM)draw()});
window.addEventListener('beforeunload',function(e){if(ST&&!ST.done&&cur==='exam'){e.preventDefault();e.returnValue=''}});

window.initMock=function(pm){
  PM=pm;pm.addEventListener('click',onClick);window.addEventListener('popstate',onPop);
  var f=window.LJ?window.LJ('mock-a1-lesen.js').catch(function(){}):Promise.resolve();
  f.then(function(){cur='home';draw()});
};
})();
