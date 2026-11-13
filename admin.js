/* ===== admin.js: অ্যাডমিন (ওভারভিউ, বুকিং, কোর্স) — শুধু #admin-এ গেলে লোড হয় ===== */
var COLORS=[['সবুজ','#1e8e5a'],['জলপাই','#5c7f2b'],['গাঢ় নীল','#0058a3'],['আকাশি','#1c7ed6'],['ইন্ডিগো','#3b5bdb'],['বেগুনি','#6f42c1'],['গোলাপি','#c2255c'],['লাল','#c92a2a'],['টিল','#0c8599'],['বাদামি','#8b5a3c'],['ধূসর নীল','#4a6a8a'],['নেভি','#1b2a4a'],['কমলা','#e8590c'],['হলুদ-কমলা','#f08c00'],['লেবু সবুজ','#74b816'],['পুদিনা','#12b886'],['সায়ান','#15aabf'],['ভায়োলেট','#9c36b5'],['ম্যাজেন্টা','#d6336c'],['মেরুন','#862e2e'],['কালো','#343a40'],['সোনালি','#c99700']];
/* ---------- admin ---------- */
var tab='ov',openK='',fOpen=false,shownN=40;
async function isAdmin(){var a=await SB.rpc('is_admin');return a.data===true}
async function initAdmin(){
  var s=await SB.auth.getSession();
  if(s.data&&s.data.session&&await isAdmin()){show('loginCard',false);show('panel',true);loadAdmin()}
  else{show('panel',false);show('loginCard',true)}
}
async function login(){
  var r=await SB.auth.signInWithPassword({email:$('ae').value.trim(),password:$('pw').value});
  if(r.error){$('lerr').textContent=r.error.message==='network'?'ইন্টারনেট সংযোগ সমস্যা, আবার চেষ্টা করো।':'ইমেইল বা পাসওয়ার্ড ভুল।';return}
  if(!(await isAdmin())){await SB.auth.signOut();$('lerr').textContent='তুমি অনুমোদিত অ্যাডমিন নও।';return}
  $('lerr').textContent='';$('pw').value='';show('loginCard',false);show('panel',true);goTab('ov');loadAdmin();
}
async function logout(){await SB.auth.signOut();rows=[];AC=[];openK='';draft=false;show('panel',false);show('loginCard',true)}
function cby(k){for(var i=0;i<AC.length;i++)if(AC[i].id===k)return AC[i];return null}
function curCount(c){return rows.filter(function(s){return s.course_id===c.id&&s.batch===c.current_batch&&s.active}).length}
function cname(s){var c=cby(s.course_id);return c?c.title:s.level}
async function loadAdmin(force,except){
  var a=await SB.from('courses').select('*').order('sort');
  var b=await SB.from('bookings').select('*').order('created_at',{ascending:false});
  AC=a.data||[];rows=b.data||[];
  fillFilters();renderNew();renderOv();renderBk();renderCtl(force,except);renderDoneAdm();
}
function goTab(t){
  tab=t;show('tOv',t==='ov');show('tBk',t==='bk');show('tCo',t==='co');
  var bs=$('tabs').querySelectorAll?$('tabs').querySelectorAll('button[data-t]'):[];
  Array.prototype.forEach.call(bs,function(b){b.classList.toggle('on',b.getAttribute('data-t')===t)});
}
$('tabs').onclick=function(e){var t=e.target,b=t&&t.closest?t.closest('button[data-t]'):null;if(b)goTab(b.getAttribute('data-t'))};

/* overview */
function renderOv(){
  var act=rows.filter(function(s){return s.active}),paid=act.filter(function(s){return s.paid}).length;
  var today=new Date().toDateString(),td=rows.filter(function(s){return new Date(s.created_at).toDateString()===today}).length;
  var t=[['মোট বুকিং',act.length],['Paid',paid],['Pending',act.length-paid],['আজকের নতুন',td]];
  $('sum').innerHTML=t.map(function(x){return '<div class="tile"><b>'+x[1]+'</b>'+x[0]+'</div>'}).join('');
  $('ovCourses').innerHTML=AC.map(function(c){
    var n=curCount(c),pc=Math.min(100,Math.round(n/c.capacity*100));
    return '<div class="row" data-k="'+c.id+'" style="cursor:pointer"><div style="flex:1;min-width:0"><b>'+esc(c.title)+'</b> <span class="sub">ব্যাচ '+esc(c.batch_code)+'</span><div class="prog"><i style="width:'+pc+'%;background:'+esc(c.color)+'"></i></div></div><span>'+n+'/'+c.capacity+'</span><span class="pill '+(c.is_open?'pd':'cx')+'">'+(c.is_open?'চালু':'বন্ধ')+'</span>'+(c.is_hidden?'<span class="pill pen">লুকানো</span>':'')+'</div>';
  }).join('')||'<p class="sub">কোনো কোর্স নেই। "কোর্স" ট্যাবে গিয়ে যোগ করো।</p>';
  $('ovRecent').innerHTML=rows.slice(0,5).map(function(s){
    return '<div class="row" data-id="'+s.id+'" style="cursor:pointer"><div style="min-width:0"><b>'+esc(s.name)+'</b>'+(isNew(s)?' <span class="pill pen">নতুন</span>':'')+'<div class="sub">'+esc(cname(s))+' · '+new Date(s.created_at).toLocaleDateString('en-GB')+'</div></div><span class="pill '+(s.paid?'pd':'pen')+'">'+(s.paid?'Paid':'Pending')+'</span></div>';
  }).join('')||'<p class="sub">এখনো কোনো বুকিং নেই।</p>';
}
$('ovCourses').onclick=function(e){
  var t=e.target,r=t&&t.closest?t.closest('[data-k]'):null;if(!r)return;
  var k=r.getAttribute('data-k');openK=k;goTab('co');renderCtl(true);
  var el=$('cr_'+k);if(el&&el.scrollIntoView)el.scrollIntoView();
};

/* bookings */
function fillFilters(){
  var sc=$('fc'),vc=sc.value,hc='<option value="">সব কোর্স</option>';
  AC.forEach(function(c){hc+='<option value="'+c.id+'">'+esc(c.title)+'</option>'});
  sc.innerHTML=hc;sc.value=vc;
  var seen={},codes=[];
  rows.forEach(function(s){if(s.batch_code&&!seen[s.batch_code]){seen[s.batch_code]=1;codes.push(s.batch_code)}});
  AC.forEach(function(c){if(c.batch_code&&!seen[c.batch_code]){seen[c.batch_code]=1;codes.push(c.batch_code)}});
  codes.sort();
  var sb=$('fb'),vb=sb.value;
  sb.innerHTML='<option value="">সব ব্যাচ কোড</option>'+codes.map(function(c){return '<option value="'+esc(c)+'">'+esc(c)+'</option>'}).join('');sb.value=vb;
}
function vis(){
  var q=$('q').value.trim().toLowerCase(),fc=$('fc').value,fb=$('fb').value,pf=$('fp').value,sf=$('fs').value;
  return rows.filter(function(s){
    if(fc&&s.course_id!==fc)return false;
    if(fb&&s.batch_code!==fb)return false;
    if(pf==='paid'&&!s.paid)return false;if(pf==='pending'&&s.paid)return false;
    if(sf==='active'&&!s.active)return false;if(sf==='cancelled'&&s.active)return false;
    if(q&&s.booking_no.toLowerCase().indexOf(q)<0&&s.phone.indexOf(q)<0&&String(s.name).toLowerCase().indexOf(q)<0&&String(s.batch_code||'').toLowerCase().indexOf(q)<0)return false;
    return true;
  });
}
function qIn(){clearTimeout(qT);qT=setTimeout(fch,180)}
function fch(){shownN=40;renderBk()}
function toggleF(){fOpen=!fOpen;show('fPanel',fOpen);renderBk()}
function moreBk(){shownN+=40;renderBk()}
function clearF(){$('q').value='';$('fc').value='';$('fb').value='';$('fp').value='';$('fs').value='';fch()}
function renderBk(){
  var V=vis(),L=V.slice(0,shownN);
  $('bkList').innerHTML=L.map(function(s){
    return '<div class="bk" data-id="'+s.id+'" style="cursor:pointer"><div class="bk-top"><b>'+esc(s.name)+'</b><span>'+(isNew(s)?'<span class="pill pen">নতুন</span> ':'')+(s.active?'':'<span class="pill cx">Cancelled</span> ')+'<span class="pill '+(s.paid?'pd':'pen')+'">'+(s.paid?'Paid':'Pending')+'</span></span></div>'
     +'<div class="sub">'+esc(s.booking_no)+' · '+esc(cname(s))+' · ব্যাচ '+esc(s.batch_code||s.batch)+'</div>'
     +'<div class="sub"><a href="tel:'+esc(s.phone)+'">'+esc(s.phone)+'</a> · '+esc(s.email)+'</div>'
     +'<div class="sub" style="display:flex;justify-content:space-between;gap:8px"><span>'+new Date(s.created_at).toLocaleString('en-GB')+'</span><span style="color:var(--p);font-weight:600;flex:none">বিস্তারিত ›</span></div>'
     +'<div class="tools"><button data-i="'+s.id+'" data-k="paid">'+(s.paid?'Pending করো':'Paid করো')+'</button><button class="g" data-i="'+s.id+'" data-k="active">'+(s.active?'বাতিল করো':'সক্রিয় করো')+'</button></div></div>';
  }).join('')||'<p class="sub">কিছু পাওয়া যায়নি</p>';
  $('shown').textContent=V.length+'টি বুকিং';
  show('moreBtn',V.length>shownN);$('moreBtn').textContent='আরও দেখাও ('+(V.length-shownN)+')';
  var n=['fc','fb','fp','fs'].filter(function(i){return $(i).value}).length;
  $('fBtn').textContent='ফিল্টার'+(n?' ('+n+')':'')+(fOpen?' ▴':' ▾');
}
$('bkList').onclick=function(e){
  var t=e.target;if(!t||!t.closest)return;
  var b=t.closest('button[data-i]');if(b){tog(b.getAttribute('data-i'),b.getAttribute('data-k'));return}
  if(t.closest('a'))return;
  var c=t.closest('.bk[data-id]');if(c)openDetail(c.getAttribute('data-id'));
};
async function tog(id,k){
  var row=rows.filter(function(x){return x.id===id})[0];if(!row)return;
  var u={};u[k]=!row[k];
  await SB.from('bookings').update(u).eq('id',id);
  await loadAdmin();loadCourses(false);
  if(dvId&&!$('dv').classList.contains('hide'))renderDetail();
}
function seenAt(){try{return localStorage.getItem('jw_seen')}catch(e){return null}}
function isNew(s){var v=seenAt();return !!v&&new Date(s.created_at)>new Date(v)}
function renderNew(){
  if(!seenAt()){try{localStorage.setItem('jw_seen',new Date().toISOString())}catch(e){}}
  var n=rows.filter(isNew).length,b=$('newBanner');
  b.classList.toggle('hide',n===0);
  b.textContent=''+n+'টি নতুন রেজিস্ট্রেশন এসেছে (ট্যাপ করে দেখো)';
  show('seenBar',n>0);$('seenTxt').textContent=''+n+'টি নতুন';
  var c=$('newCnt');c.textContent=n;c.classList.toggle('hide',n===0);
  document.title=(n?'('+n+') ':'')+'Jabirs Weg';
}
function markSeen(){
  var mx=0,pv=seenAt()?new Date(seenAt()).getTime():0;
  rows.forEach(function(s){var t=new Date(s.created_at).getTime();if(t>mx)mx=t});
  try{localStorage.setItem('jw_seen',new Date(Math.max(mx,pv)||Date.now()).toISOString())}catch(e){}
  renderNew();renderOv();renderBk();
}
/* booking detail view */
var dvId='',dvList=[],dvT=null;
function dvRow(){for(var i=0;i<rows.length;i++)if(rows[i].id===dvId)return rows[i];return null}
function openDetail(id,keep){
  if(!keep||dvList.indexOf(id)<0){dvList=vis().map(function(x){return x.id});if(dvList.indexOf(id)<0)dvList=[id]}
  dvId=id;show('dv',true);document.body.style.overflow='hidden';renderDetail();$('dv').scrollTop=0;
}
function closeDetail(){dvId='';show('dv',false);document.body.style.overflow=''}
function navDetail(d){var i=dvList.indexOf(dvId)+d;if(i<0||i>=dvList.length)return;dvId=dvList[i];renderDetail();$('dv').scrollTop=0}
function renderDetail(){
  var s=dvRow();if(!s){closeDetail();return}
  var c=cby(s.course_id),col=c?c.color:'#0058a3',cur=!!c&&s.batch===c.current_batch;
  var idx=dvList.indexOf(dvId),tot=dvList.length,nm=String(s.name);
  $('dv').style.setProperty('--p',col);$('dvh').style.background=col;
  $('dvh').innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><button class="xb" data-d="close">✕ বন্ধ</button><span style="opacity:.9;font-size:13px">'+(idx+1)+' / '+tot+'</span></div>'
    +'<div class="av">'+esc(nm.charAt(0))+'</div><h1 class="dn">'+esc(nm)+'</h1>'
    +'<div class="dno">'+esc(s.booking_no)+' <button class="cp" data-d="copy">কপি</button></div>'
    +'<div class="dp">'+(isNew(s)?'<span class="pill pen">নতুন</span>':'')+'<span class="pill '+(s.paid?'pd':'pen')+'">'+(s.paid?'Paid':'Pending')+'</span><span class="pill '+(s.active?'pd':'cx')+'">'+(s.active?'Active':'Cancelled')+'</span></div>';
  function rw(k,v){return v?'<div class="irow"><span>'+k+'</span><b>'+v+'</b></div>':''}
  var h='<div class="card"><h2 style="font-size:16px">যোগাযোগ</h2>'
    +rw('মোবাইল','<a href="tel:'+esc(s.phone)+'">'+esc(s.phone)+'</a>')+rw('ইমেইল','<a href="mailto:'+esc(s.email)+'">'+esc(s.email)+'</a>')+'</div>';
  h+='<div class="card"><h2 style="font-size:16px">বুকিংয়ের তথ্য</h2>'
    +rw('কোর্স',esc(c?c.title:s.level))+rw('ব্যাচ কোড',esc(s.batch_code||''))
    +rw('বুকিংয়ের সময়',esc(fmtDT(s.created_at))+' <span class="sub">('+ago(s.created_at)+')</span>')
    +rw('পেমেন্ট',s.paid?'Paid':'Pending')+rw('বুকিং',s.active?'Active':'Cancelled')+'</div>';
  if(c){
    if(cur){
      var left=c.start_date?daysLeft(c.start_date):null,cd='';
      if(left!==null)cd=left>1?'ক্লাস শুরু হতে '+left+' দিন বাকি':(left===1?'আগামীকাল ক্লাস শুরু':(left===0?'আজ ক্লাস শুরু':'ক্লাস শুরু হয়ে গেছে'));
      var ci=rw('ধরন',esc(lat(c.info_mode)))+rw('সময়কাল',esc(lat(c.info_duration)))+rw('সময়',esc(lat(c.info_time)))+rw('বার',esc(lat(c.info_days)))+rw('কবে থেকে শুরু',esc(lat(startTxt(c.start_date,c.info_start))));
      h+='<div class="card"><h2 style="font-size:16px">ক্লাসের তথ্য</h2>'+(ci||'<p class="sub">এখনো কোনো তথ্য দেওয়া হয়নি।</p>')+(cd?'<div class="cd" style="margin-top:10px"><b style="font-size:18px">'+cd+'</b></div>':'')+'</div>';
    }else h+='<div class="card"><p class="sub" style="margin:0">এটি আগের ব্যাচের বুকিং, তাই ক্লাসের তথ্য দেখানো হচ্ছে না।</p></div>';
  }
  var oth=rows.filter(function(x){return x.id!==s.id&&last11(x.phone)===last11(s.phone)});
  if(oth.length)h+='<div class="card"><h2 style="font-size:16px">এই নম্বরের অন্য বুকিং</h2>'+oth.map(function(x){var cc=cby(x.course_id);return '<div class="row" data-d="open" data-i="'+x.id+'" style="cursor:pointer"><div style="min-width:0"><b>'+esc(cc?cc.title:x.level)+'</b><div class="sub">'+esc(x.booking_no)+' · '+esc(x.batch_code||'')+'</div></div><span class="pill '+(x.paid?'pd':'pen')+'">'+(x.paid?'Paid':'Pending')+'</span></div>'}).join('')+'</div>';
  h+='<div class="card" style="text-align:center"><h2 style="font-size:16px;text-align:left">টিকিট</h2><img id="dvtk" class="tkimg" alt="Ticket"><button class="g" data-d="dl">টিকিট ডাউনলোড</button></div>';
  h+='<button class="g w" data-d="active">'+(s.active?'বুকিং বাতিল করো':'বুকিং সক্রিয় করো')+'</button>';
  $('dvb').innerHTML=h;
  $('dvn').innerHTML='<button class="g" data-d="prev"'+(idx<=0?' disabled':'')+'>‹ আগের</button><button class="mid" data-d="paid">'+(s.paid?'Pending করো':'✓ Paid করো')+'</button><button class="g" data-d="next"'+(idx>=tot-1?' disabled':'')+'>পরের ›</button>';
  dvT={name:nm,no:s.booking_no,title:c?c.title:s.level,code:c?c.code:s.level,batch:s.batch_code||'',color:col,time:cur?c.info_time:'',days:cur?c.info_days:'',start:cur?(c.start_date?fmtDate(c.start_date):c.info_start):''};
  var want=dvId;
  drawTicket(dvT).then(function(cv){if(dvId===want){var im=$('dvtk');if(im)im.src=cv.toDataURL('image/png')}}).catch(function(){});
}
$('dv').onclick=function(e){
  var t=e.target,b=t&&t.closest?t.closest('[data-d]'):null;if(!b)return;
  var a=b.getAttribute('data-d');
  if(a==='close')closeDetail();
  else if(a==='prev')navDetail(-1);
  else if(a==='next')navDetail(1);
  else if(a==='paid'||a==='active')tog(dvId,a);
  else if(a==='open')openDetail(b.getAttribute('data-i'),true);
  else if(a==='dl'){lastT=dvT;saveTicket()}
  else if(a==='copy'){var r=dvRow();try{navigator.clipboard.writeText(r.booking_no)}catch(x){}b.textContent='কপি হয়েছে ✓'}
};
$('ovRecent').onclick=function(e){var t=e.target,r=t&&t.closest?t.closest('.row[data-id]'):null;if(r)openDetail(r.getAttribute('data-id'))};
if(document.addEventListener)document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('dv').classList.contains('hide'))closeDetail()});

/* courses */
function fld(p,k,ph,val,ml){return '<input class="t" autocomplete="off" spellcheck="false" id="'+p+'_'+k+'" maxlength="'+ml+'" placeholder="'+ph+'" value="'+esc(val||'')+'">'}
function bt(a,k,cls,txt){return '<button'+(cls?' class="'+cls+'"':'')+' data-a="'+a+'" data-k="'+k+'">'+txt+'</button>'}
function toLocalInput(iso){if(!iso)return '';var d=new Date(iso);if(isNaN(d))return '';return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())+'T'+pad2(d.getHours())+':'+pad2(d.getMinutes())}
function blank(){return{price:'',reg_open_at:null,id:null,code:'',title:'',subtitle:'',learn:'',color:'#1e8e5a',capacity:30,note:'',info_mode:'',info_duration:'',info_time:'',info_days:'',info_start:'',info_extra:'',is_open:true,is_hidden:false,current_batch:1,batch_code:'',start_date:''}}
function colorPick(k,cur){
  var sw=COLORS.map(function(x){return '<button type="button" class="sw'+(x[1].toLowerCase()===String(cur).toLowerCase()?' on':'')+'" data-a="color" data-k="'+k+'" data-c="'+x[1]+'" title="'+x[0]+'" style="background:'+x[1]+'"></button>'}).join('');
  return '<div class="grp">কোর্সের রঙ</div><div class="sws">'+sw+'<label class="swc" title="নিজের পছন্দের রঙ বেছে নাও">+<input type="color" id="cpk_'+k+'" value="'+esc(cur)+'"></label></div><input type="hidden" id="co_'+k+'" value="'+esc(cur)+'">';
}
function markSw(k,v){var bs=$('ctl').querySelectorAll?$('ctl').querySelectorAll('.sw'):[];Array.prototype.forEach.call(bs,function(el){if(el.getAttribute('data-k')===k)el.classList.toggle('on',el.getAttribute('data-c').toLowerCase()===String(v).toLowerCase())})}
function setColor(k,v){var h=$('co_'+k);if(h)h.value=v;var pk=$('cpk_'+k);if(pk)pk.value=v;markSw(k,v);dirty[k]=true}
function editorHtml(c,k,nw){
  return '<div class="ed">'
   +'<div class="grp">মূল তথ্য</div>'
   +'<div class="tools">'+fld('cd',k,'কোড (যেমন A1)',c.code,6)+fld('ti',k,'কোর্সের নাম (যেমন A1 অনলাইন)',c.title,80)+'</div>'
   +'<div class="tools">'+fld('bc',k,'ব্যাচ কোড (যেমন DFZA122)',c.batch_code,12)+fld('pc',k,'কোর্স ফি (যেমন ৳ 3,500)',c.price,40)+'</div>'
   +'<div class="tools">'+fld('su',k,'ছোট বর্ণনা (ঐচ্ছিক)',c.subtitle,120)+'</div>'+colorPick(k,c.color)
   +'<textarea class="t" id="le_'+k+'" rows="3" maxlength="600" spellcheck="false" placeholder="কী শিখবে — প্রতি লাইনে একটা করে লেখো">'+esc(c.learn||'')+'</textarea>'
   +'<div class="grp">আসন ও বার্তা</div>'
   +'<div class="tools"><input class="t" type="number" min="1" max="100" id="cap_'+k+'" value="'+c.capacity+'" style="max-width:90px" title="আসন সংখ্যা">'+fld('nt',k,'বন্ধ/পূর্ণ হলে যে মেসেজ দেখাবে (ঐচ্ছিক)',c.note,200)+'</div>'
   +'<div class="tools"><label class="sub" style="flex:1;min-width:200px">রেজিস্ট্রেশন শুরুর তারিখ ও সময় (ফাঁকা রাখলে এখনই চালু)<input class="t" type="datetime-local" id="ro_'+k+'" value="'+esc(toLocalInput(c.reg_open_at))+'"></label></div>'
   +'<div class="grp">কোর্সের বিস্তারিত (শিক্ষার্থীরা দেখবে)</div>'
   +'<div class="tools">'+fld('im',k,'অনলাইন / অফলাইন',c.info_mode,60)+fld('ic',k,'কোর্স কতদিনের (যেমন ৩ মাস)',c.info_duration,60)+'</div>'
   +'<div class="tools">'+fld('it',k,'সময় (যেমন রাত ৮টা)',c.info_time,60)+fld('dy',k,'বার (যেমন শনি, সোম, বুধ)',c.info_days,80)+'</div>'
   +'<div class="tools"><label class="sub" style="flex:1;min-width:150px">শুরুর তারিখ (কাউন্টডাউনের জন্য)<input class="t" type="date" id="sd_'+k+'" value="'+esc(c.start_date||'')+'"></label>'+fld('st',k,'শুরু নিয়ে নোট (ঐচ্ছিক)',c.info_start,60)+'</div>'
   +'<div class="tools">'+fld('ix',k,'অন্যান্য তথ্য (ঐচ্ছিক)',c.info_extra,300)+'</div>'
   +(nw?'':'<div class="grp">নতুন ব্যাচ শুরু করো</div><div class="tools">'+fld('nb',k,'নতুন ব্যাচের কোড (যেমন DFZA123)','',12)+bt('batch',k,'y','শুরু করো')+'</div>')
   +'<div class="tools" style="margin-top:12px">'+(nw?bt('save',k,'','তৈরি করো')+bt('cancelnew',k,'g','বাতিল'):bt('save',k,'','সংরক্ষণ')+bt('done',k,'g','ব্যাচ সম্পন্ন করো')+bt('del',k,'g','মুছে ফেলো'))+'</div></div>';
}
function rowHtml(c,k,nw){
  var op=openK===k,n=nw?0:curCount(c);
  return '<div class="crow" id="cr_'+k+'" style="border-left:6px solid '+esc(c.color)+'">'
   +'<div class="hd" data-a="toggle" data-k="'+k+'"><div style="min-width:0"><b>'+(nw?'নতুন কোর্স':esc(c.title))+'</b>'+(nw?'':'<div class="sub">ব্যাচ '+esc(c.batch_code)+' · বুকিং '+n+'/'+c.capacity+(c.reg_open_at&&new Date(c.reg_open_at)>new Date()?' · শুরু: '+esc(fmtShort(c.reg_open_at)):'')+'</div>')+'</div><span style="font-size:18px">'+(op?'▴':'▾')+'</span></div>'
   +(nw?'':'<div class="qk">'+bt('open',k,c.is_open?'on':'off',c.is_open?'রেজিস্ট্রেশন চালু':'রেজিস্ট্রেশন বন্ধ')+bt('hide',k,c.is_hidden?'off':'on',c.is_hidden?'হোমে লুকানো':'হোমে দেখা যাচ্ছে')+'</div>')
   +(op?editorHtml(c,k,nw):'')+'</div>';
}
function dirtyAny(){for(var k in dirty)if(dirty[k])return true;return false}
function renderCtl(force,except){
  var a=document.activeElement,keep={},box=$('ctl');
  var typing=a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.tagName==='SELECT')&&box.contains(a);
  if(!force&&(dirtyAny()||typing))return;
  if(box.querySelectorAll){Array.prototype.forEach.call(box.querySelectorAll('input,textarea,select'),function(el){var k=el.id.slice(el.id.indexOf('_')+1);if(dirty[k]&&k!==except)keep[el.id]=el.value})}
  var h=draft?rowHtml(blank(),'new',true):'';
  AC.forEach(function(c){h+=rowHtml(c,c.id,false)});
  box.innerHTML=h||'<p class="sub">কোনো কোর্স নেই। উপরের বাটনে চেপে যোগ করো।</p>';
  Object.keys(keep).forEach(function(id){var e=$(id);if(e)e.value=keep[id];if(id.indexOf('co_')===0)markSw(id.slice(3),keep[id])});
  if(except)dirty[except]=false;
}
$('ctl').onclick=function(e){
  var t=e.target,b=t&&t.closest?t.closest('[data-a]'):null;if(!b)return;
  var k=b.getAttribute('data-k'),a=b.getAttribute('data-a'),c=cby(k);
  if(a==='toggle')toggleRow(k);
  else if(a==='save')pushCourse(k,{explicit:true});
  else if(a==='open'&&c)pushCourse(k,{open:!c.is_open});
  else if(a==='hide'&&c)pushCourse(k,{hidden:!c.is_hidden});
  else if(a==='batch')newBatch(k);
  else if(a==='del')delCourse(k);
  else if(a==='color')setColor(k,b.getAttribute('data-c'));
  else if(a==='done')completeBatch(k);
  else if(a==='cancelnew')toggleRow('new');
};
$('ctl').oninput=function(e){var id=e.target&&e.target.id;if(id&&id.indexOf('_')>0){dirty[id.slice(id.indexOf('_')+1)]=true;if(id.indexOf('cpk_')===0)setColor(id.slice(4),e.target.value)}};
function toggleRow(k){
  if(openK&&dirty[openK]&&!confirm('এই কোর্সের লেখা এখনো সংরক্ষণ হয়নি। ছেড়ে যাবে?'))return;
  var was=openK;
  if(was){dirty[was]=false;if(was==='new')draft=false}
  openK=(was===k)?'':k;
  renderCtl(true);
}
function addCourse(){
  if(openK&&dirty[openK]&&!confirm('এই কোর্সের লেখা এখনো সংরক্ষণ হয়নি। ছেড়ে যাবে?'))return;
  if(openK)dirty[openK]=false;
  draft=true;openK='new';goTab('co');renderCtl(true);
}
function aerr(e){
  var m=e.message||'';
  if(m==='network')return 'ইন্টারনেট সংযোগ নেই';
  if(m.indexOf('code_taken')>=0)return 'এই ব্যাচ কোড আগে ব্যবহার হয়েছে, অন্য কোড দাও।';
  if(m.indexOf('invalid_batch_code')>=0)return 'ব্যাচ কোডে শুধু ইংরেজি অক্ষর, সংখ্যা ও - থাকবে (৩ থেকে ১২ অক্ষর)।';
  return m;
}
function gather(k,c){
  function g(p,d){var e=$(p+'_'+k);return e?e.value.trim():d}
  var capEl=$('cap_'+k),coEl=$('co_'+k),leEl=$('le_'+k);
  return{p_id:c.id,p_code:g('cd',c.code),p_title:g('ti',c.title),p_subtitle:g('su',c.subtitle),p_learn:leEl?leEl.value.trim():c.learn,p_color:coEl?coEl.value:c.color,
    p_capacity:capEl?parseInt(capEl.value,10):c.capacity,p_note:g('nt',c.note),p_mode:g('im',c.info_mode),p_duration:g('ic',c.info_duration),
    p_time:g('it',c.info_time),p_days:g('dy',c.info_days),p_start:g('st',c.info_start),p_extra:g('ix',c.info_extra),p_bcode:g('bc',c.batch_code||'').toUpperCase(),p_sdate:g('sd',c.start_date||''),p_ropen:(function(){var e=$('ro_'+k);if(!e)return c.reg_open_at||'';return e.value?new Date(e.value).toISOString():''})(),p_price:g('pc',c.price||'')};
}
async function pushCourse(k,over){
  over=over||{};var nw=k==='new',c=nw?blank():cby(k);if(!c)return false;
  var a=gather(k,c);
  if(!(a.p_capacity>=1&&a.p_capacity<=100)){alert('আসন সংখ্যা ১ থেকে ১০০-এর মধ্যে দাও।');return false}
  if(!a.p_code||!a.p_title){alert('কোড ও কোর্সের নাম দিতে হবে।');return false}
  if(nw&&!a.p_bcode){alert('ব্যাচ কোড দিতে হবে (যেমন DFZA122)।');return false}
  a.p_open=over.open!==undefined?over.open:c.is_open;a.p_hidden=over.hidden!==undefined?over.hidden:c.is_hidden;
  var r=await SB.rpc('save_course',a);
  if(r.error){alert('সমস্যা হয়েছে: '+aerr(r.error));return false}
  if(over.explicit||nw){draft=false;openK='';dirty[k]=false}
  await loadAdmin(true,k);loadCourses(false);
  if(over.explicit||nw)alert(nw?'নতুন কোর্স তৈরি হয়েছে।':'সংরক্ষিত হয়েছে।');
  return true;
}
function renderDoneAdm(){
  var box=$('doneAdm');if(!box)return;
  box.innerHTML=COMP.map(function(x){return '<div class="row" style="align-items:center"><div style="display:flex;gap:10px;align-items:center;min-width:0"><span class="dc" style="background:'+esc(x.color)+'">'+esc(x.code)+'</span><div style="min-width:0"><b>'+esc(x.title)+'</b><div class="sub">ব্যাচ '+esc(x.batch_code)+' · '+x.students+' জন · '+esc(fmtDate(x.completed_at))+'</div></div></div><button class="g" style="padding:5px 12px;font-size:12px" data-a="deldone" data-i="'+x.id+'">মুছো</button></div>'}).join('')||'<p class="sub">এখনো কোনো ব্যাচ সম্পন্ন করা হয়নি।</p>';
}
$('doneAdm').onclick=function(e){var t=e.target,b=t&&t.closest?t.closest('button[data-i]'):null;if(b)delDone(b.getAttribute('data-i'))};
async function delDone(id){
  if(!confirm('এই সম্পন্ন-তালিকার এন্ট্রি মুছবে? কোর্স বা বুকিংয়ের কিছু মুছবে না।'))return;
  var r=await SB.rpc('delete_completion',{p_id:id});
  if(r.error){alert('সমস্যা হয়েছে: '+aerr(r.error));return}
  await loadCompleted();
}
async function completeBatch(k){
  var c=cby(k);if(!c)return;
  if(!confirm('"'+c.title+'" (ব্যাচ '+c.batch_code+') সম্পন্ন হয়েছে বলে চিহ্নিত করবে?\n\n• রেজিস্ট্রেশন বন্ধ হবে\n• কোর্সটা হোম থেকে সরে যাবে\n• "সম্পন্ন কোর্স" তালিকায় দেখাবে\n\nপরে আবার চালাতে চাইলে "+ নতুন ব্যাচ" দিয়ে নতুন কোডে শুরু করতে পারবে।'))return;
  var r=await SB.rpc('complete_batch',{p_id:k});
  if(r.error){alert(r.error.message.indexOf('already_done')>=0?'এই ব্যাচ আগেই সম্পন্ন করা হয়েছে।':'সমস্যা হয়েছে: '+aerr(r.error));return}
  dirty[k]=false;openK='';
  await loadAdmin(true,k);await loadCompleted();loadCourses(false);
  alert('ব্যাচ সম্পন্ন হিসেবে চিহ্নিত হয়েছে।');
}
async function newBatch(k){
  var c=cby(k);if(!c)return;
  var code=($('nb_'+k)?$('nb_'+k).value:'').trim().toUpperCase();
  if(!/^[A-Z0-9-]{3,12}$/.test(code)){alert('নতুন ব্যাচের কোড দাও (যেমন DFZA123), ৩ থেকে ১২ অক্ষর, শুধু ইংরেজি অক্ষর, সংখ্যা ও -।');return}
  if(!confirm(c.title+'-এর জন্য নতুন ব্যাচ '+code+' শুরু হবে। আগের সব বুকিং থাকবে, নতুন রেজিস্ট্রেশন নতুন ব্যাচে যাবে। চালিয়ে যাবে?'))return;
  var r=await SB.rpc('new_batch',{p_id:k,p_code:code});
  if(r.error){alert('সমস্যা হয়েছে: '+aerr(r.error));return}
  dirty[k]=false;openK='';
  await loadAdmin(true,k);loadCourses(false);
  alert(c.title+'-এর নতুন ব্যাচ '+r.data+' শুরু হয়েছে।');
}
async function delCourse(k){
  var c=cby(k);if(!c)return;
  if(!confirm('"'+c.title+'" কোর্সটি মুছে ফেলবে? এটা আর ফেরানো যাবে না।'))return;
  var r=await SB.rpc('delete_course',{p_id:k});
  if(r.error){alert(r.error.message.indexOf('has_bookings')>=0?'এই কোর্সে বুকিং আছে, মুছা যাবে না। চাইলে "হোমে লুকানো" করে রাখো।':'সমস্যা হয়েছে: '+aerr(r.error));return}
  openK='';await loadAdmin(true,k);loadCourses(false);
}
setInterval(function(){if(!$('panel').classList.contains('hide')&&!document.hidden){loadAdmin();loadCourses(false)}},30000);

(function(){
var _from=SB.from;
SB.from=function(t){var o=_from.call(SB,t);
  if(t==='bookings'){var _t=o.then;o.then=function(res,rej){return _t.call(o,function(r){if(r&&Array.isArray(r.data))r.data.forEach(function(s){s.bn=s.booking_no;if(s.student_no)s.booking_no=s.student_no});return res?res(r):r},rej)}}
  return o};
W('editorHtml',function(o){return function(c,k,nw){
  var h=o(c,k,nw),m='<div class="grp">কোর্সের বিস্তারিত';
  var f='<div class="grp">পেমেন্টের তথ্য (বুকিং কনফার্ম হলে শিক্ষার্থী দেখবে)</div><div class="tools">'+fld('pbk',k,'ব্যাংকের নাম',c.pay_bank,80)+fld('pnm',k,'অ্যাকাউন্টের নাম',c.pay_name,80)+'</div><div class="tools">'+fld('pac',k,'অ্যাকাউন্ট নম্বর',c.pay_no,40)+fld('pbr',k,'শাখা',c.pay_branch,80)+'</div><div class="tools">'+fld('pnt',k,'অতিরিক্ত নির্দেশনা (ঐচ্ছিক)',c.pay_note,200)+'</div><div class="tools"><label class="sub" style="flex:1">পেমেন্টের সময়সীমা (মিনিট): এর মধ্যে প্রমাণ জমা না দিলে বুকিং বাতিল ও আসন ফাঁকা<input class="t" type="number" min="1" max="1440" id="pmn_'+k+'" value="'+(c.pay_minutes||30)+'"></label></div>';
  return h.indexOf(m)>=0?h.replace(m,f+m):h}});
/* ---- অ্যাডমিন: দাম, কোর্স আইডি, মোছা ---- */
async function delProof(path){
  try{var tk=await bearer(),x=await fetch(SUPABASE_URL+'/storage/v1/object/proofs/'+path,{method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+tk}});return x.ok||x.status===404}catch(e){return false}
}
window.delBk=async function(id){
  var r=rows.filter(function(x){return x.id===id})[0];if(!r)return;
  if(!confirm('"'+r.name+'" ('+r.booking_no+') বুকিংটি স্থায়ীভাবে মুছে যাবে। এটা আর ফেরানো যাবে না। শুধু বাতিল করলে ডেটা থাকে। সত্যিই মুছবে?'))return;
  if(!confirm('শেষবার জিজ্ঞেস করছি: '+r.booking_no+' চিরতরে মুছে ফেলবো?'))return;
  if(r.proof_path&&!(await delProof(r.proof_path))&&!confirm('পেমেন্টের ছবিটা মোছা যায়নি (ছবি স্টোরেজে থেকে যাবে)। তবুও বুকিং মুছবে?'))return;
  var x=await rp('delete_booking',{p_id:id});
  if(x.error){alert('সমস্যা হয়েছে: '+x.error.message);return}
  closeDetail();await loadAdmin();loadCourses(false);
};
W('tog',function(o){return function(id,k){return k==='del'?delBk(id):o(id,k)}});
W('renderBk',function(o){return function(){
  o();
  Array.prototype.forEach.call(document.querySelectorAll('#bkList .bk[data-id]'),function(el){
    var s=rows.filter(function(x){return x.id===el.getAttribute('data-id')})[0];if(!s)return;
    var sub=el.querySelector('.sub'),pr=bkPrice(s);
    if(sub&&el.textContent.indexOf('কোর্স আইডি')<0)sub.innerHTML+=(pr?' · '+esc(lat(pr)):'')+'<br>কোর্স আইডি: <b>'+esc(s.cid||'—')+'</b>';
    var t=el.querySelector('.tools'),tp=el.querySelector('.bk-top span'),stt=s.paid?'':(s.expired_at?'<span class="pill cx">মেয়াদ শেষ</span> ':(s.proof_at?'<span class="pill pen">যাচাই চলছে</span> ':''));
    if(tp&&stt&&el.textContent.indexOf('যাচাই চলছে')<0&&el.textContent.indexOf('মেয়াদ শেষ')<0)tp.insertAdjacentHTML('afterbegin',stt);
    if(t&&s.proof_at&&!t.querySelector('[data-pf]'))t.insertAdjacentHTML('beforeend','<button class="g" data-pf="'+s.id+'">প্রমাণ</button>');
    if(t&&!t.querySelector('[data-k="del"]'))t.insertAdjacentHTML('beforeend','<button class="g" data-i="'+s.id+'" data-k="del" style="color:#c92a2a">মুছো</button>');
  })}});
W('renderDetail',function(o){return function(){
  o();var s=dvRow();if(!s)return;
  var rw=function(k,v){return '<div class="irow cidrow"><span>'+k+'</span><b>'+v+'</b></div>'},pr=bkPrice(s);
  Array.prototype.forEach.call(document.querySelectorAll('#dvb .card'),function(c){
    if(c.textContent.indexOf('বুকিংয়ের তথ্য')>=0&&c.textContent.indexOf('কোর্স আইডি')<0)c.insertAdjacentHTML('beforeend',rw('কোর্স আইডি (পেমেন্ট রেফ)',esc(s.cid||'—'))+(pr?rw('কোর্স ফি',esc(lat(pr))):'')+(s.proof_at?rw('পেমেন্টের প্রমাণ',esc(s.proof_trx||'স্ক্রিনশট')+' <button class="g" data-pf="'+s.id+'" style="padding:3px 10px;font-size:12px">দেখো</button>'):'')+(s.expired_at?rw('অবস্থা','মেয়াদ শেষে স্বয়ংক্রিয় বাতিল'):''))});
  var ab=document.querySelector('#dvb button[data-d="active"]');
  if(ab&&!document.querySelector('#dvb button[data-d="del"]'))ab.insertAdjacentHTML('afterend','<button class="g w" data-d="del" style="color:#c92a2a;margin-bottom:70px">স্থায়ীভাবে মুছে ফেলো</button>');
}});
window.viewProof=async function(id){
  var s=rows.filter(function(x){return x.id===id})[0];if(!s)return;
  var info='ট্রানজেকশন আইডি: '+(s.proof_trx||'—')+'\nকোর্স আইডি: '+(s.cid||'—');
  var box=function(img){var o=document.createElement('div');o.id='pfv';o.innerHTML=(img?'<img src="'+img+'">':'')+'<div style="white-space:pre-line;text-align:center">'+esc(info)+'</div><button onclick="this.parentNode.remove()">বন্ধ করো</button>';document.body.appendChild(o)};
  if(!s.proof_path){box('');return}
  try{
    var tk=await bearer(),r=await fetch(SUPABASE_URL+'/storage/v1/object/sign/proofs/'+s.proof_path,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+tk,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:300})}),j=await r.json();
    if(!r.ok||!j.signedURL)throw 1;
    var im=await fetch(SUPABASE_URL+'/storage/v1'+j.signedURL),b=await im.blob();box(URL.createObjectURL(b));
  }catch(e){box('');alert('ছবি আনা যায়নি।')}
};
$('bkList').addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('[data-pf]'):null;if(b){e.stopPropagation();viewProof(b.getAttribute('data-pf'))}},true);
$('dv').addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('[data-pf]'):null;if(b)viewProof(b.getAttribute('data-pf'))});
$('dv').addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('[data-d="del"]'):null;if(b)delBk(dvId)});
W('vis',function(o){return function(){
  var qe=$('q'),q=qe.value.trim().toLowerCase();if(!q)return o();
  qe.value='';var all=o();qe.value=q;
  return all.filter(function(s){return String(s.booking_no).toLowerCase().indexOf(q)>=0||String(s.phone).indexOf(q)>=0||String(s.name).toLowerCase().indexOf(q)>=0||String(s.batch_code||'').toLowerCase().indexOf(q)>=0||String(s.cid||'').toLowerCase().indexOf(q)>=0})}});
window.csv=function(){
  var out=[['Student ID','Course ID (Payment Ref)','Course','Code','Batch','Name','Mobile','Email','Course Fee','Registered At','Payment','Booking','Booking Ref','Payment Status','Transaction ID','Screenshot']];
  vis().forEach(function(s){out.push([s.booking_no,s.cid||'',cname(s),s.level,s.batch_code,s.name,'\t'+s.phone,s.email,bkPrice(s),new Date(s.created_at).toLocaleString('en-GB'),s.paid?'Paid':'Pending',s.active?'Active':'Cancelled',s.bn||'',s.paid?'Paid':(s.expired_at?'Expired':(!s.active?'Cancelled':(s.proof_at?'Verifying':'Pending'))),s.proof_trx||'',s.proof_path?'Yes':'No'])});
  var t='\uFEFF'+out.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(',')}).join('\r\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download='students.csv';document.body.appendChild(a);a.click();a.remove();
};

/* ---- সেটআপ যাচাই (অ্যাডমিন ওভারভিউয়ের নিচে) ---- */
window.selfCheck=async function(){
  var box=$('chkBox'),out=[];box.innerHTML='যাচাই হচ্ছে…';
  var ok=function(t){out.push('✓ '+t)},no=function(t){out.push('✕ '+t)};
  var r1=await rp('expire_bookings');r1.error?no('অটো-বাতিলের ফাংশন (expire_bookings) নেই। SQL চালানো হয়নি।'):ok('অটো-বাতিলের ফাংশন আছে');
  var r2=await rp('student_ids',{p_nos:[]});r2.error?no('আমার আইডির ফাংশন (student_ids) নেই। SQL চালানো হয়নি।'):ok('আমার আইডির ফাংশন আছে');
  var r3=await rp('save_pay',{p_id:null,p_bcode:'ZZZ'});r3.error?no('save_pay ফাংশন নেই বা পুরনো: '+r3.error.message):ok('save_pay ফাংশন আছে');
  var c=AC[0];if(c)('pay_minutes' in c)?ok('courses-এ pay_minutes কলাম আছে'):no('courses-এ pay_minutes কলাম নেই');
  var b=rows[0];
  if(b){
    var miss=['cid','student_no','price','expires_at','proof_at','expired_at'].filter(function(k){return !(k in b)});
    miss.length?no('bookings-এ কলাম নেই: '+miss.join(', ')):ok('বুকিংয়ের নতুন কলামগুলো আছে');
    var q=await rp('pay_info',{p_no:b.bn||b.booking_no});
    if(q.error)no('pay_info এরর: '+q.error.message);
    else('st' in q.data)?ok('pay_info নতুন ভার্সন'):no('pay_info পুরনো ভার্সন (স্ট্যাটাস ও বাকি সময় নেই)। SQL আবার চালাও।');
    var nb=rows.filter(function(x){return !x.paid&&x.active})[0];
    if(nb&&!nb.expires_at)out.push('সর্বশেষ Pending বুকিংয়ে শেষ সময় (expires_at) নেই। বুকিংটা SQL চালানোর আগের হলে ঠিক আছে, নতুন বুকিং হলে ট্রিগার আপডেট হয়নি।');
  }else out.push('ℹ️ কোনো বুকিং নেই। একটা টেস্ট বুকিং করে আবার যাচাই করো।');
  box.innerHTML=out.join('<br>');
};
if($('tOv'))$('tOv').insertAdjacentHTML('beforeend','<button class="g w" onclick="selfCheck()">সেটআপ যাচাই</button><div class="sub" id="chkBox" style="margin-top:8px;line-height:1.8"></div>');
})();
(function(){
var _p0=SB.rpc;
SB.rpc=function(fn,a){var p=_p0.call(SB,fn,a);
  if(fn==='save_course')return p.then(async function(r){
    if(!r.error&&a){var k=a.p_id||'new',g=function(x){var e=$(x+'_'+k);return e?e.value.trim():''};
      if($('pbk_'+k)){var r2=await rp('save_pay',{p_id:a.p_id||null,p_bcode:a.p_bcode||'',p_bank:g('pbk'),p_name:g('pnm'),p_acc:g('pac'),p_branch:g('pbr'),p_note:g('pnt'),p_min:parseInt(g('pmn'),10)||null});
        if(r2.error)alert('কোর্স সংরক্ষিত হয়েছে, কিন্তু পেমেন্টের তথ্য সংরক্ষণ হয়নি: '+r2.error.message)}}
    return r});
  return p;
};
})();
