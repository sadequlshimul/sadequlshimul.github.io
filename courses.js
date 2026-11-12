/* ===== courses.js: কোর্স তালিকা, কোর্স পেজ, বুকিং ফর্ম, রুট ===== */
/* ---------- public ---------- */
function norm(x){return{slug:x.slug,code:x.code,title:x.title,subtitle:x.subtitle||'',learn:String(x.learn||'').split('\n').map(function(t){return t.trim()}).filter(Boolean),color:x.color||'#0058a3',cnt:x.cnt||0,bt:x.bt||1,bc:x.bc||'',op:x.op!==false,cap:x.cap||30,nt:x.nt||'',i:{mode:x.i_mode||'',dur:x.i_dur||'',time:x.i_time||'',days:x.i_days||'',start:x.i_start||'',extra:x.i_extra||'',sd:x.i_sd||''},ro:x.i_ro||'',price:x.i_price||''}}
var lastSig='',lastExp=0;
async function loadCourses(first){
  if(Date.now()-lastExp>20000){lastExp=Date.now();await rp('expire_bookings')}
  var r=await SB.rpc('public_courses');
  if(!r.error&&Array.isArray(r.data)){
    if(r.data.length&&r.data[0].i_now){srvOff=new Date(r.data[0].i_now).getTime()-Date.now()}
    var sg=JSON.stringify(r.data.map(function(x){var y={};for(var k in x)if(k!=='i_now')y[k]=x[k];return y}));
    if(!first&&loaded&&sg===lastSig){var c=CBY[cur];if(c&&!$('waitCard').classList.contains('hide')&&!isWait(c))render();return}
    lastSig=sg;PC=r.data.map(norm);CBY={};if(typeof loadCompleted==='function')loadCompleted();PC.forEach(function(c){CBY[c.slug]=c});loaded=true;
    if(first)route();else render();
  }else if(!loaded){
    $('cards').innerHTML='<div class="card wide"><p class="sub">'+(r.error&&r.error.message==='network'?'ইন্টারনেট সংযোগ সমস্যা, পেজ রিফ্রেশ করো।':'কোর্সের তথ্য আনা যায়নি, একটু পরে আবার চেষ্টা করো।')+'</p></div>';
  }
}
function route(){
  var v=(location.hash||'').replace('#',''),c=CBY[v];
  if(v&&v!=='admin'&&v!=='my'&&!PG[v]&&!c&&loaded){location.hash='';return}
  var view=v==='admin'?'adm':(v==='my'?'my':(PG[v]?PG[v]:(c?'course':'home')));
  cur=c?v:'';
  if(c)document.body.style.setProperty('--p',c.color);else document.body.style.removeProperty('--p');
  show('home',view==='home');show('course',view==='course');show('adm',view==='adm');show('my',view==='my');['list','goal','mock','vocab'].forEach(function(x){show(x,view===x)});
  show('hHome',view==='home');show('hCourse',view==='course');show('hAdm',view==='adm');show('hMy',view==='my');['list','goal','mock','vocab'].forEach(function(x){show('h'+x.charAt(0).toUpperCase()+x.slice(1),view===x)});
  show('bk',view!=='home');var pv0=window.__lv;window.__lv=view;$('bk').onclick=function(){go(view==='course'&&pv0==='list'?'courses':'')};if(view==='mock'||view==='vocab')pageInit(view);
  if(view==='course'){show('okCard',false);$('err').textContent='';formT=Date.now();chal=null}
  if(view==='adm')initAdmin();
  if(view==='my')initMy();
  var ms=myLS();$('myBtn').textContent=ms&&ms.k?'আমার ব্যাচ দেখো ('+ms.k+') →':'আমার ব্যাচ দেখো →';
  render();
  if(loaded&&view!=='adm')loadCourses(false);
  window.scrollTo(0,0);
}
function render(){if(!$('home').classList.contains('hide')||($('list')&&!$('list').classList.contains('hide')))renderHome();if(!$('course').classList.contains('hide'))renderCourse()}
function nowMs(){return Date.now()+srvOff}
function isWait(c){return !!c.ro&&nowMs()<new Date(c.ro).getTime()}
function cdTxt(ms){var s=Math.max(0,Math.floor(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60,o=[];if(d)o.push(d+' দিন');if(d||h)o.push(h+' ঘণ্টা');o.push(m+' মিনিট');o.push(x+' সেকেন্ড');return o.join(' ')}
function fmtShort(iso){var d=new Date(iso);if(isNaN(d))return '';var h=d.getHours(),ap=h>=12?'PM':'AM';h=h%12||12;return d.getDate()+' '+MON[d.getMonth()]+(d.getFullYear()!==new Date().getFullYear()?' '+d.getFullYear():'')+', '+h+':'+(d.getMinutes()<10?'0':'')+d.getMinutes()+' '+ap}
function tickWait(){var c=CBY[cur];if(!c||!isWait(c))return;$('waitWhen').textContent=fmtDT(c.ro);$('waitCd').textContent=cdTxt(new Date(c.ro).getTime()-nowMs())}
setInterval(function(){
  var c=CBY[cur];if(!c||!c.ro||$('course').classList.contains('hide'))return;
  if(isWait(c))tickWait();else if(!$('waitCard').classList.contains('hide'))loadCourses(false);
},1000);
async function loadChallenge(force){
  if(chalBusy||(chal&&!force))return;
  chalBusy=true;chal=null;$('chQ').textContent='…';$('chA').value='';
  var r=await SB.rpc('new_challenge');
  chalBusy=false;
  if(r.error||!r.data||!r.data.length){$('chQ').textContent=r.error&&r.error.message.indexOf('too_many')>=0?'কিছুক্ষণ পরে চেষ্টা করো':'প্রশ্ন আসেনি, "অন্য প্রশ্ন" চাপো';return}
  chal={cid:r.data[0].cid,q:r.data[0].q};$('chQ').textContent=chal.q+' = ?'; 
}
async function loadCompleted(){
  var r=await SB.rpc('public_completed');
  if(!r.error&&Array.isArray(r.data)){COMP=r.data;renderDone();if(typeof renderDoneAdm==='function')renderDoneAdm()}
}
function renderDone(){
  $('doneList').innerHTML=COMP.map(function(x){
    return '<div class="row" style="align-items:center"><div style="display:flex;gap:10px;align-items:center;min-width:0"><span class="dc" style="background:'+esc(x.color)+'">'+esc(x.code)+'</span><div style="min-width:0"><b>'+esc(x.title)+'</b><div class="sub">ব্যাচ '+esc(x.batch_code)+(x.students?' · '+x.students+' জন শিক্ষার্থী':'')+'</div></div></div><span class="sub" style="flex:none">'+esc(fmtDate(x.completed_at))+'</span></div>';
  }).join('');
  show('doneCard',COMP.length>0);
}
function renderHome(){
  if(!loaded)return;
  var codes={};PC.forEach(function(c){codes[c.code]=(codes[c.code]||0)+1});
  $('cards').innerHTML=PC.map(function(c){
    var left=Math.max(0,c.cap-c.cnt),w=c.op&&isWait(c),off=(!c.op||left<=0)&&!w;
    var hot=c.op&&!w&&left>0&&left<=5,chs=[];
    if(c.i.mode)chs.push(c.i.mode);if(c.i.sd)chs.push('শুরু '+fmtDate(c.i.sd));
    var pct=Math.min(100,Math.round(c.cnt/Math.max(1,c.cap)*100));
    return '<button class="cc" style="--c:'+esc(c.color)+'" data-s="'+esc(c.slug)+'"><em'+(c.code.length>2?' style="font-size:20px"':'')+'>'+esc(c.code)+'</em><span>'+(c.price?'<div class="pr">'+esc(lat(c.price))+'</div>':'')+'<b>'+esc(c.title)+'</b><small>'+esc(lat(c.subtitle))+'</small>'+(chs.length?'<span class="chs">'+chs.map(function(t){return '<u>'+esc(t)+'</u>'}).join('')+'</span>':'')+'<span class="bar"><s style="width:'+pct+'%"></s></span><span class="bdg'+(off?' off':(hot?' hot':''))+'">'+(w?'শুরু: '+esc(fmtShort(c.ro)):(!c.op?'রেজিস্ট্রেশন বন্ধ':(left<=0?'পূর্ণ':(hot?'মাত্র '+left+'টি আসন বাকি':left+'টি খালি'))))+'</span></span><span class="go">›</span></button>';
  }).join('')||'<div class="card wide"><p class="sub">বর্তমানে কোনো কোর্সের রেজিস্ট্রেশন চালু নেই। নতুন ব্যাচ শুরু হলে এখানে জানানো হবে।</p></div>';
  
  renderWg();
  $('fsub0').innerHTML=PC.map(function(c){
    var left=Math.max(0,c.cap-c.cnt),w=c.op&&isWait(c),off=(!c.op||left<=0)&&!w;
    return '<span class="bdg'+(off?' off':'')+'" style="font-size:14px;padding:4px 14px">'+esc(codes[c.code]>1?c.title:c.code)+' = '+(w?'শীঘ্রই':(!c.op?'বন্ধ':(left<=0?'পূর্ণ':left+' খালি')))+'</span>';
  }).join('');
  show('chipCard',PC.length>0);
}
function renderCourse(){
  var c=CBY[cur];if(!c)return;
  var left=Math.max(0,c.cap-c.cnt),h='';
  $('cBig').textContent=c.code;$('cBig').style.fontSize=c.code.length>3?'48px':'';
  $('cTitle').textContent=c.title;$('cDesc').textContent=lat(c.subtitle);
  $('cPrice').textContent=c.price?'কোর্স ফি: '+lat(c.price):'';show('cPrice',!!c.price);
  show('learnWrap',c.learn.length>0);
  $('cList').innerHTML=c.learn.map(function(x){return '<li>'+esc(x)+'</li>'}).join('');
  $('fTitle').textContent=c.title+' – রেজিস্ট্রেশন';
  for(var i=0;i<c.cap;i++)h+='<i class="'+(i<c.cnt?'t':'')+'"></i>';
  $('seats').innerHTML=h;$('fn').textContent=left;
  $('fsub').textContent=left>0&&left<=10?'তাড়াতাড়ি করো, আসন প্রায় শেষ!':c.cap+'টি আসন';
  var I=c.i,ri=[['কোর্স ফি',c.price],['ধরন',I.mode],['সময়কাল',I.dur],['সময়',I.time],['বার',I.days],['কবে থেকে শুরু',startTxt(I.sd,I.start)],['বিস্তারিত',I.extra]].filter(function(x){return x[1]});
  $('cInfo').innerHTML=ri.length?'<h2 style="font-size:16px;margin:14px 0 4px">কোর্সের বিস্তারিত</h2>'+ri.map(function(x){return '<div class="irow"><span>'+x[0]+'</span><b>'+esc(lat(x[1]))+'</b></div>'}).join(''):'';
  var ok=!$('okCard').classList.contains('hide'),off=!c.op,wait=c.op&&isWait(c),full=c.op&&!wait&&c.cnt>=c.cap;
  show('closedCard',(off||full)&&!ok);show('waitCard',wait&&!ok);show('formCard',!off&&!full&&!wait&&!ok);
  if(!off&&!full&&!wait&&!ok&&!chal)loadChallenge();
  if(wait)tickWait();
  if(off||full){
    $('clTitle').textContent=off?'রেজিস্ট্রেশন এখন বন্ধ':'Registration Closed';
    $('clMsg').textContent=(off?'এই ব্যাচের রেজিস্ট্রেশন এখন বন্ধ আছে।':'দুঃখিত, এই ব্যাচের '+c.cap+'টি বুকিং পূর্ণ হয়েছে।')+' '+(lat(c.nt)||'চালু হলে এখানেই রেজিস্ট্রেশন খুলবে।');
  }
}
$('cards').onclick=function(e){var t=e.target,b=t&&t.closest?t.closest('button[data-s]'):null;if(b)go(b.getAttribute('data-s'))};
function msgOf(e){
  var m=(e&&e.message)||'';
  if(m==='network')return 'ইন্টারনেট সংযোগ সমস্যা, আবার চেষ্টা করো।';
  if(m.indexOf('bad_answer')>=0)return 'যোগ-বিয়োগের উত্তর ঠিক হয়নি। নতুন প্রশ্নটা দেখো।';
  if(m.indexOf('not_yet')>=0)return 'এই কোর্সের রেজিস্ট্রেশন এখনো শুরু হয়নি।';
  if(m.indexOf('too_many')>=0)return 'অল্প সময়ে অনেকবার রেজিস্ট্রেশন হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করো।';
  if(m.indexOf('busy')>=0)return 'এই মুহূর্তে অনেক রেজিস্ট্রেশন চলছে, ১০ মিনিট পরে আবার চেষ্টা করো।';
  if(m.indexOf('reg_off')>=0)return 'এই ব্যাচের রেজিস্ট্রেশন এখন বন্ধ আছে।';
  if(m.indexOf('closed')>=0)return 'দুঃখিত, এই ব্যাচের সব বুকিং পূর্ণ হয়েছে।';
  if(m.indexOf('duplicate')>=0)return 'এই নম্বর দিয়ে আগেই বুকিং আছে।';
  if(m.indexOf('invalid_name')>=0)return 'সঠিক নাম লেখো।';
  if(m.indexOf('invalid_phone')>=0)return 'সঠিক মোবাইল নম্বর দাও।';
  if(m.indexOf('invalid_email')>=0)return 'সঠিক ইমেইল দাও।';
  return 'একটু সমস্যা হয়েছে, আবার চেষ্টা করো।';
}
async function submitReg(){
  var c=CBY[cur];if(!c)return;
  if($('hp').value)return;
  var err=$('err');err.textContent='';
  if(Date.now()-formT<2000){err.textContent='একটু অপেক্ষা করে আবার চাপো।';return}
  var nm=$('nm').value.trim(),ph=$('ph').value.trim().replace(/[\s-]/g,''),em=$('em').value.trim();
  if(nm.length<2){err.textContent='সঠিক নাম লেখো।';return}
  if(!/^(\+?88)?01[3-9]\d{8}$/.test(ph)){err.textContent='সঠিক মোবাইল নম্বর দাও।';return}
  if(!/^\S+@\S+\.\S+$/.test(em)){err.textContent='সঠিক ইমেইল দাও।';return}
  var ans=parseInt($('chA').value,10);
  if(!chal||isNaN(ans)){err.textContent=chal?'নিরাপত্তা প্রশ্নের উত্তর (সংখ্যা) লেখো।':'নিরাপত্তা প্রশ্ন আসেনি, "অন্য প্রশ্ন" চাপো।';return}
  var b=$('subBtn');b.disabled=true;b.textContent='অপেক্ষা করো…';
  var cid=chal.cid;chal=null;
  var r=await SB.rpc('register_booking',{p_slug:c.slug,p_name:nm,p_phone:ph,p_email:em,p_cid:cid,p_ans:ans});
  b.disabled=false;b.textContent='আমার আসন বুক করো →';
  if(r.error){err.textContent=msgOf(r.error);loadChallenge();loadCourses(false);return}
  lastNo=r.data;saveMy(lastNo);
  $('okNo').textContent=lastNo;
  show('okCard',true);$('cpBtn').textContent='আমার আইডি কপি করো';
  try{await showTicket(tdata(c,nm,lastNo),'tkImg','shBtn')}catch(e){}
  await loadCourses(false);window.scrollTo({top:0,behavior:'smooth'});
}
function copyNo(){try{navigator.clipboard.writeText(lastNo);$('cpBtn').textContent='কপি হয়েছে ✓'}catch(e){$('cpBtn').textContent=lastNo}}
/* ---------- dates ---------- */

