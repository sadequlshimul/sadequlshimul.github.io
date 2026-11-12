/* ===== core.js: সবার ভিত্তি: Supabase সংযোগ, ছোট সাহায্যকারী ফাংশন, দরকার মতো ফাইল লোড ===== */
/*CLIENT_START*/
var SUPABASE_URL=window.JW_URL||'https://tnxamkcdlutigzwigipu.supabase.co',SUPABASE_KEY=window.JW_KEY||'PASTE_PUBLISHABLE_KEY';
var NE={message:'network'};
function tok(){try{return JSON.parse(localStorage.getItem('jw_sess'))}catch(e){return null}}
function setTok(v){try{if(v)localStorage.setItem('jw_sess',JSON.stringify(v));else localStorage.removeItem('jw_sess')}catch(e){}}
function saveSess(j){setTok({access_token:j.access_token,refresh_token:j.refresh_token,expires_at:Math.floor(Date.now()/1000)+(j.expires_in||3600)})}
async function bearer(){
  var t=tok();if(!t)return null;
  if(t.expires_at*1000-Date.now()>60000)return t.access_token;
  try{
    var r=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:t.refresh_token})});
    var j=await r.json();
    if(!r.ok){setTok(null);return null}
    saveSess(j);return j.access_token;
  }catch(e){return t.access_token}
}
async function http(path,opt){
  opt=opt||{};
  var h={apikey:SUPABASE_KEY,'Content-Type':'application/json'};
  var t=await bearer();
  if(t)h.Authorization='Bearer '+t;else if(SUPABASE_KEY.indexOf('sb_')!==0)h.Authorization='Bearer '+SUPABASE_KEY;
  try{
    var r=await fetch(SUPABASE_URL+path,{method:opt.method||'GET',headers:h,body:opt.body?JSON.stringify(opt.body):undefined});
    var txt=await r.text(),j=null;
    try{j=txt?JSON.parse(txt):null}catch(e){}
    if(!r.ok)return{data:null,error:{message:(j&&(j.message||j.msg||j.error_description))||('http '+r.status)}};
    return{data:j,error:null};
  }catch(e){return{data:null,error:NE}}
}
var SB={
  rpc:function(fn,args){return http('/rest/v1/rpc/'+fn,{method:'POST',body:args||{}})},
  from:function(tbl){
    var st={m:'GET',q:[],b:null};
    var o={
      select:function(c){st.q.push('select='+encodeURIComponent(c||'*'));return o},
      order:function(c,op){st.q.push('order='+c+(op&&op.ascending===false?'.desc':'.asc'));return o},
      update:function(b){st.m='PATCH';st.b=b;return o},
      eq:function(c,v){st.q.push(c+'=eq.'+encodeURIComponent(v));return o},
      then:function(res,rej){return http('/rest/v1/'+tbl+(st.q.length?'?'+st.q.join('&'):''),{method:st.m,body:st.b}).then(res,rej)}
    };
    return o;
  },
  auth:{
    getSession:async function(){var t=await bearer();return{data:{session:t?{access_token:t}:null}}},
    signInWithPassword:async function(c){
      try{
        var r=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email:c.email,password:c.password})});
        var j=await r.json();
        if(!r.ok)return{error:{message:j.error_description||j.msg||'invalid'}};
        saveSess(j);return{error:null};
      }catch(e){return{error:NE}}
    },
    signOut:async function(){setTok(null);return{}}
  }
};
/*CLIENT_END*/
var COMP=[],formT=0,srvOff=0,chal=null,chalBusy=false,cur='',lastNo='',PC=[],CBY={},loaded=false,AC=[],rows=[],dirty={},draft=false,qT=0;
function $(id){return document.getElementById(id)}
function show(id,on){$(id).classList.toggle('hide',!on)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function lat(t){return String(t).replace(/[০-৯]/g,function(d){return '০১২৩৪৫৬৭৮৯'.indexOf(d)})}
function go(v){location.hash=v}
var MON=['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
function fmtDate(s){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||'');return m?(+m[3])+' '+MON[+m[2]-1]+' '+m[1]:''}
function startTxt(sd,note){var d=fmtDate(sd);if(!d)return note||'';return(note&&lat(note).replace(/\s/g,'')!==d.replace(/\s/g,''))?d+' ('+note+')':d}
function daysLeft(s){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||'');if(!m)return null;var t=new Date(+m[1],+m[2]-1,+m[3]),n=new Date();n.setHours(0,0,0,0);return Math.round((t-n)/86400000)}
function pad2(n){return n<10?'0'+n:''+n}
function fmtDT(iso){var d=new Date(iso);if(isNaN(d))return '';var h=d.getHours(),ap=h>=12?'PM':'AM';h=h%12||12;return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear()+', '+h+':'+pad2(d.getMinutes())+' '+ap}
function ago(iso){var m=Math.round((Date.now()-new Date(iso).getTime())/60000);if(m<1)return 'এইমাত্র';if(m<60)return m+' মিনিট আগে';var h=Math.round(m/60);if(h<24)return h+' ঘণ্টা আগে';return Math.round(h/24)+' দিন আগে'}
function last11(v){return String(v||'').replace(/\D/g,'').slice(-11)}
/* অন্য ফাইল থেকে ব্যবহারের ছোট সাহায্যকারী */
var RAWRPC=SB.rpc;
function rp(f,a){return RAWRPC.call(SB,f,a)}
function W(n,f){if(typeof window[n]==='function')window[n]=f(window[n])}
function bkPrice(s){var c=typeof cby==='function'?cby(s.course_id):null;return s.price||(c&&c.price)||''}
(function(){var st=document.createElement('style');st.textContent='html{-webkit-tap-highlight-color:transparent}button,a,input,select,textarea{touch-action:manipulation}';document.head.appendChild(st)})();
var _stScroll=window.scrollTo.bind(window);
window.scrollTo=function(a,b){if(a&&typeof a==='object')a={top:a.top,left:a.left,behavior:'auto'};return _stScroll(a,b)};
/* দরকার হলে তবেই ফাইল লোড (অ্যাডমিন, মক টেস্ট, ভোকাবুলারি) */
function LJ(src){
  LJ.c=LJ.c||{};
  return LJ.c[src]||(LJ.c[src]=new Promise(function(res,rej){
    var s=document.createElement('script');s.src=src+'?v='+(window.JW_V||'1');
    s.onload=res;s.onerror=function(){delete LJ.c[src];rej(new Error('load '+src))};document.head.appendChild(s)}));
}
function initAdmin(){
  return LJ('js/admin.js').then(function(){return LJ('js/admin-match.js')}).then(function(){return window.initAdmin!==stubInitAdmin?window.initAdmin():null})
    .catch(function(){alert('অ্যাডমিনের ফাইল লোড হয়নি। ইন্টারনেট দেখে পেজ রিফ্রেশ করো।')});
}
var stubInitAdmin=initAdmin;
/* হোমের কার্ড ট্যাপ করলে নতুন পেজ: হ্যাশ → পেজের নাম */
var PG={courses:'list',goal:'goal',mock:'mock',vocab:'vocab'};
var PAGE_MOD={mock:['js/mock.js','initMock'],vocab:['js/vocab.js','initVocab']};
function pageInit(k){
  var m=PAGE_MOD[k];pageInit.d=pageInit.d||{};if(!m||pageInit.d[k])return;pageInit.d[k]=1;
  var box=$(k+'Box');box.innerHTML='<div class="card"><p class="sub">লোড হচ্ছে…</p></div>';
  LJ(m[0]).then(function(){window[m[1]](box)}).catch(function(){pageInit.d[k]=0;box.innerHTML='<div class="card"><p class="sub">লোড হয়নি, ইন্টারনেট দেখে পেজ রিফ্রেশ করো।</p></div>'});
}
