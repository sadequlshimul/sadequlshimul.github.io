/* ===== admin-match.js: অ্যাডমিন: পেমেন্ট মেলাও (ব্যাংক স্টেটমেন্টের সাথে) ===== */
(function(){
/* ---- স্টেটমেন্ট মেলানো (নতুন ডিজাইন) ---- */
var st2=document.createElement('style');
st2.textContent='.mhead{display:flex;align-items:center;gap:14px;background:var(--soft);border-radius:16px;padding:12px;margin:12px 0}'
+'.ring{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;flex:none;background:conic-gradient(#1e8e5a calc(var(--v)*1%),var(--line) 0)}.ring b{width:48px;height:48px;border-radius:50%;background:var(--card);display:grid;place-items:center;font-size:15px}'
+'.mf{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.mf button{background:var(--soft);color:var(--ink);padding:6px 12px;font-size:13px}.mf button.on{background:var(--p);color:#fff}'
+'.mc{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px;margin-bottom:10px}.mc.sel{border-color:#1e8e5a;box-shadow:0 0 0 2px rgba(30,142,90,.25)}'
+'.mc .top{display:flex;gap:10px;align-items:flex-start}.mc .top input{width:22px;height:22px;margin-top:2px;flex:none}'
+'.mp{display:flex;align-items:flex-start;margin:10px 0 8px}.mp div{flex:1;text-align:center;font-size:11px;color:var(--mute);position:relative}'
+'.mp div:before{content:"";position:absolute;top:10px;left:-50%;width:100%;border-top:3px dashed var(--line)}.mp div:first-child:before{display:none}'
+'.mp i{position:relative;z-index:1;display:grid;place-items:center;width:22px;height:22px;margin:0 auto 3px;border-radius:50%;background:var(--card);border:2px solid var(--line);font-style:normal;font-size:12px}'
+'.mp .ok i{background:#1e8e5a;border-color:#1e8e5a;color:#fff}.mp .ok:before{border-top-color:#1e8e5a}.mp .no i{background:#fdecea;border-color:#e57373;color:#c62828}.mp .na i{opacity:.5}'
+'.mtk{position:relative;background:var(--soft);border-radius:10px;padding:9px 10px 9px 18px;font:12px/1.5 ui-monospace,Menlo,Consolas,monospace;word-break:break-word}'
+'.mtk:before{content:"";position:absolute;left:6px;top:8px;bottom:8px;border-left:3px dotted var(--mute);opacity:.5}'
+'.mtk mark{border-radius:4px;padding:0 2px;color:#0b2447}.mr{background:#ffda1a}.mt2{background:#9ad0ff}.ma{background:#9be7b4}'
+'.mbar{position:sticky;bottom:8px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:10px;box-shadow:0 4px 16px rgba(0,30,70,.15);margin-top:10px}'
+'.mq{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.mq input{flex:1;min-width:90px;margin:0}';
document.head.appendChild(st2);
function nz(s){return String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'')}
function nums(t){return (String(t).match(/\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/g)||[]).map(function(x){return parseFloat(x.replace(/,/g,''))}).filter(function(n){return n>0})}
function priceNum(s){return parseFloat(lat(bkPrice(s)||'').replace(/[^\d.]/g,''))||0}
var mState=[],mUnk=[],mFilter='all',mT=0;
function hl(line,x){
  var s=x.s,h=esc(String(line).slice(0,200)),rx=function(tok){return new RegExp(tok.split('').join('[\\s\\-]?'),'i')},c=nz(s.cid),t=nz(s.proof_trx),pn=priceNum(s);
  if(x.r&&c)h=h.replace(rx(c),function(m){return '<mark class="mr">'+m+'</mark>'});
  if(x.t&&t)h=h.replace(rx(t),function(m){return '<mark class="mt2">'+m+'</mark>'});
  if(pn)h=h.replace(/\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/g,function(m){return Math.abs(parseFloat(m.replace(/,/g,''))-pn)<.5?'<mark class="ma">'+m+'</mark>':m});
  return h}
window.matchRun=function(){
  var lines=($('mtTx').value||'').split(/\r?\n/).filter(function(l){return l.trim()}),N=lines.map(nz),known={},seenU={};
  rows.forEach(function(s){if(s.cid)known[nz(s.cid)]=1;if(s.proof_trx)known[nz(s.proof_trx)]=1});
  var idx=function(k){var r=[];if(k&&k.length>=5)N.forEach(function(n,i){if(n.indexOf(k)>=0)r.push(i)});return r};
  mState=[];mUnk=[];
  rows.filter(function(s){return !s.paid}).forEach(function(s){
    var kc=nz(s.cid),kt=nz(s.proof_trx),hr=idx(kc),ht=idx(kt),both=hr.filter(function(i){return ht.indexOf(i)>=0}),
        li=both.length?both[0]:(hr.length?hr[0]:(ht.length?ht[0]:-1)),r=hr.length>0,t=ht.length>0,pn=priceNum(s),a=false,ns=[],line='';
    if(li>=0){line=lines[li];ns=nums(String(line).replace(new RegExp(kc||'^$','i'),' ').replace(new RegExp(kt||'^$','i'),' '));if(!ns.length)ns=nums(lines[li+1]||'');a=pn?ns.some(function(n){return Math.abs(n-pn)<.5}):false}
    var hasT=!!kt;
    mState.push({s:s,line:line,r:r,t:t,a:a,hasT:hasT,ns:ns.slice(0,5),hit:li>=0,full:r&&a&&(t||!hasT),dup:hr.length>1});
  });
  lines.forEach(function(l){(l.match(/\b[A-Za-z]{1,4}\d{6,8}\b/g)||[]).forEach(function(k){if(!known[nz(k)]&&!seenU[l]){seenU[l]=1;mUnk.push(l)}})});
  $('mtLines').textContent=lines.length;matchRender();
};
window.mfSet=function(k){mFilter=k;matchRender()};
window.mcCount=function(){var n=document.querySelectorAll('#mtRes input[data-id]:checked').length,e=$('mCnt');if(e)e.textContent=n;Array.prototype.forEach.call(document.querySelectorAll('#mtRes .mc'),function(c){var i=c.querySelector('input');if(i)c.classList.toggle('sel',i.checked)})};
function mcard(x){
  var s=x.s,st=function(on,na,lbl){return '<div class="'+(na?'na':(on?'ok':'no'))+'"><i>'+(na?'–':(on?'✓':'✗'))+'</i>'+lbl+'</div>'};
  return '<div class="mc'+(x.full?' sel':'')+'"><div class="top"><input type="checkbox" data-id="'+s.id+'" onchange="mcCount()"'+(x.full?' checked':'')+'><div style="min-width:0;flex:1"><b>'+esc(s.name)+'</b> · '+esc(cname(s))+' '
   +(x.full?'<span class="pill pd">পূর্ণ মিল</span>':'<span class="pill pen">আংশিক মিল</span>')+(!s.active?' <span class="pill cx">মেয়াদ শেষ ছিল</span>':'')
   +'<div class="sub">কোর্স আইডি '+esc(s.cid||'')+' · ফি '+esc(lat(bkPrice(s))||'—')+(s.proof_trx?' · ট্রানজেকশন '+esc(s.proof_trx):' · ট্রানজেকশন নম্বর জমা দেয়নি')+'</div></div></div>'
   +'<div class="mp">'+st(x.r,false,'রেফারেন্স')+st(x.t,!x.hasT,'ট্রানজেকশন')+st(x.a,false,'টাকা')+'</div>'
   +'<div class="mtk">'+hl(x.line,x)+'</div>'
   +(!x.a?'<div class="sub" style="margin-top:6px">স্টেটমেন্টে পাওয়া অঙ্ক: '+esc(x.ns.join(', ')||'—')+'</div>':'')
   +(x.dup?'<div class="sub">রেফারেন্সটা স্টেটমেন্টে একাধিকবার আছে</div>':'')
   +(!s.active?'<div class="sub">Paid করলে বুকিং আবার সক্রিয় হবে</div>':'')+'</div>'}
window.matchRender=function(){
  var S=mState,tot=S.length,full=S.filter(function(x){return x.full}),part=S.filter(function(x){return x.hit&&!x.full}),none=S.filter(function(x){return !x.hit});
  $('mtSum').innerHTML=$('mtTx').value.trim()?'<div class="mhead"><div class="ring" style="--v:'+(tot?Math.round(full.length/tot*100):0)+'"><b>'+full.length+'/'+tot+'</b></div><div><b>পূর্ণ মিল '+full.length+'টি</b><div class="sub">আংশিক '+part.length+' · টাকা আসেনি '+none.length+' · অজানা '+mUnk.length+'</div></div></div>':'';
  var tabs=[['all','সব মিল',full.length+part.length],['full','পূর্ণ',full.length],['part','আংশিক',part.length],['none','আসেনি',none.length],['unk','অজানা',mUnk.length]];
  $('mtF').innerHTML=$('mtTx').value.trim()?tabs.map(function(t){return '<button class="'+(mFilter===t[0]?'on':'')+'" onclick="mfSet(\''+t[0]+'\')">'+t[1]+' '+t[2]+'</button>'}).join(''):'';
  var h='';
  if(!$('mtTx').value.trim())h='<p class="sub">স্টেটমেন্ট পেস্ট করলে বা ফাইল বাছলে নিজে থেকেই মিলিয়ে দেখাবে।</p>';
  else if(mFilter==='none')h=none.map(function(x){return '<div class="row"><span>'+esc(x.s.name)+' · '+esc(x.s.cid||'')+(x.s.proof_trx?' · '+esc(x.s.proof_trx):'')+'</span><span class="sub">'+esc(lat(bkPrice(x.s))||'')+'</span></div>'}).join('')||'<p class="sub">সবার টাকা এসেছে </p>';
  else if(mFilter==='unk')h=mUnk.slice(0,30).map(function(l){return '<div class="mtk" style="margin-bottom:8px">'+esc(String(l).slice(0,200))+'</div>'}).join('')||'<p class="sub">অজানা রেফারেন্স নেই।</p>';
  else{var L=mFilter==='full'?full:(mFilter==='part'?part:full.concat(part));
    h=L.map(mcard).join('')||'<p class="sub">এই তালিকায় কিছু নেই।</p>';
    if(L.length)h+='<div class="mbar"><button class="w" style="margin:0" onclick="matchApply()">নির্বাচিত <span id="mCnt">'+L.filter(function(x){return x.full}).length+'</span>টি Paid করো</button></div>'}
  $('mtRes').innerHTML=h;
};
window.matchApply=async function(){
  var ids=Array.prototype.map.call(document.querySelectorAll('#mtRes input[data-id]:checked'),function(e){return e.getAttribute('data-id')});
  if(!ids.length){alert('কিছু নির্বাচন করো।');return}
  if(!confirm(ids.length+'টি বুকিং Paid করবে? (মেয়াদ শেষ হয়ে থাকলে বুকিং আবার সক্রিয় হবে)'))return;
  var n=0;
  for(var i=0;i<ids.length;i++){var s=rows.filter(function(x){return x.id===ids[i]})[0],u={paid:true};if(s&&!s.active)u.active=true;
    var r=await SB.from('bookings').update(u).eq('id',ids[i]);if(!r||!r.error)n++}
  await loadAdmin();loadCourses(false);matchRun();
  $('mtMsg').innerHTML='<div class="pay ok">'+n+'টি বুকিং Paid হয়েছে।</div>';
};
window.mtAdd=function(){
  var r=$('mqR').value.trim(),t=$('mqT').value.trim(),a=$('mqA').value.trim();if(!r&&!t)return;
  var ta=$('mtTx');ta.value=(ta.value?ta.value.replace(/\s+$/,'')+'\n':'')+'হাতে-লেখা রেফারেন্স '+r+' ট্রানজেকশন '+t+' টাকা '+a;
  ['mqR','mqT','mqA'].forEach(function(i){$(i).value=''});matchRun();
};
W('goTab',function(o){return function(t){o(t);show('tMt',t==='mt')}});
var lo=$('tabs')&&$('tabs').querySelector('.lo');
if(lo&&$('tCo')){
  lo.insertAdjacentHTML('beforebegin','<button data-t="mt">মেলাও</button>');
  $('tCo').insertAdjacentHTML('afterend','<div id="tMt" class="hide"><h2 class="sh" style="margin-top:4px">পেমেন্ট মেলাও</h2><p class="sub">ব্যাংক স্টেটমেন্টের লেখা পেস্ট করো, ফাইল বাছো, বা নিচে হাতে লিখে দাও। সাইট নিজে থেকেই তিনটা জিনিস মেলায়: <b>রেফারেন্স (কোর্স আইডি)</b>, <b>ট্রানজেকশন নম্বর</b> আর <b>টাকার অঙ্ক</b>। লেখাটা শুধু তোর ব্রাউজারেই থাকে।</p><textarea class="t" id="mtTx" rows="6" spellcheck="false" placeholder="এখানে স্টেটমেন্টের লাইনগুলো পেস্ট করো…"></textarea><div class="sub" style="margin-top:4px">স্টেটমেন্টের লাইন: <b id="mtLines">0</b></div><label class="pfile" style="margin:8px 0">CSV/টেক্সট ফাইল বেছে নাও<input type="file" accept=".csv,.txt,text/*" id="mtFile"></label><div class="sub">হাতে লিখে যোগ করো</div><div class="mq"><input class="t" id="mqR" placeholder="রেফারেন্স (কোর্স আইডি)"><input class="t" id="mqT" placeholder="ট্রানজেকশন নম্বর"><input class="t" id="mqA" inputmode="numeric" placeholder="টাকা"><button class="y" onclick="mtAdd()">যোগ</button></div><div id="mtMsg"></div><div id="mtSum"></div><div class="mf" id="mtF"></div><div id="mtRes"></div></div>');
  $('mtFile').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){$('mtTx').value=String(r.result);matchRun()};r.readAsText(f)};
  $('mtTx').addEventListener('input',function(){clearTimeout(mT);mT=setTimeout(matchRun,500)});
  matchRender();
}
})();
