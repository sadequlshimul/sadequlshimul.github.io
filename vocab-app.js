const RAW=[].concat(window.W_A1||[],window.W_A2||[],window.W_B1||[]);
const fold=s=>s.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss");
const E=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const _k=d=>fold(d.de.replace(/\|/g,"").replace(/^[^a-zA-ZäöüÄÖÜß]+/,""));RAW.sort((a,b)=>{const x=_k(a),y=_k(b);return x<y?-1:x>y?1:0});
const D=RAW.map((d,i)=>{d.i=i;d.lv=d.lv||"A1";d.id=d.lv==="A1"?(d.a?d.a+" ":"")+d.de:d.lv+" "+(d.a?d.a+" ":"")+d.de+"|"+d.en;d.w=d.de.replace(/\|/g,"");d.L=(fold(d.de.replace(/^[^a-zA-ZäöüÄÖÜß]+/,""))[0]||"#").toUpperCase();return d});
const NB=n=>n.toLocaleString("bn-BD",{useGrouping:false});
let ty="",mode="d",q="",unk=false,bo=true,hideM=false,exAll=false,wr=false,wrong=new Set(),lk=-1,os=-1,al="",lim=60,F=null,ar="",lvl="A1",pass=new Set(),CUR=[],Q=null,qk="m",known=new Set(),open=new Set(),rev=new Set();
try{known=new Set(JSON.parse(localStorage.getItem("a1k2")||"[]"))}catch(e){}
try{wrong=new Set(JSON.parse(localStorage.getItem("a1w")||"[]"))}catch(e){}
try{pass=new Set(JSON.parse(localStorage.getItem("a1p")||"[]"))}catch(e){}
const savePass=()=>{try{localStorage.setItem("a1p",JSON.stringify([...pass]))}catch(e){}};
const saveW=()=>{try{localStorage.setItem("a1w",JSON.stringify([...wrong]))}catch(e){}};
const $=s=>document.getElementById(s);
try{const l=localStorage.getItem("lv");if(l)lvl=l}catch(e){}
const save=()=>{try{localStorage.setItem("a1k2",JSON.stringify([...known]))}catch(e){}};
const sh=a=>a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
const ac=d=>d.t==="N"&&d.a?d.a.split("/")[0]:d.t==="O"?"ot":"vb";
const full=d=>(d.t==="N"&&d.a?d.a+" ":"")+d.w;
function say(t){try{const u=new SpeechSynthesisUtterance(t);u.lang="de-DE";u.rate=.85;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
const inL=d=>lvl==="All"||d.lv===lvl;
function flt(){const r=flt0();return r}
function flt0(){const t=q.trim().toLowerCase();return D.filter(d=>inL(d)&&(!ar||d.a===ar)&&(!ty||(ty==="V"?d.t==="S"||d.t==="W":d.t===ty))&&(!bo||d.bn)&&(!unk||!known.has(d.id))&&(!wr||wrong.has(d.id))&&(!t||(d.w+" "+d.en+" "+(d.bn||"")).toLowerCase().includes(t)))}
function prog(){const b=D.filter(d=>inL(d)&&(!bo||d.bn)),n=b.filter(d=>known.has(d.id)).length,p=b.length?Math.round(n/b.length*100):0,T=TH.filter(t=>lvl==="All"||t.lv===lvl),sp=T.filter(t=>pass.has(t.k)).length;
 $("pn").textContent=NB(n);$("pl").textContent=" / "+NB(b.length)+" শব্দ শেখা হয়েছে";$("pp").textContent=NB(p)+"%";$("pb2").style.width=p+"%";$("s1").textContent=NB(n);$("s2").textContent=NB(b.length-n);$("s3").textContent=NB(sp)+" / "+NB(T.length)}
function chips(){const T={N:"Noun",V:"Verb",ADJ:"Adjective",ADV:"Adverb",O:"Other"},tc=d=>d.t==="S"||d.t==="W"?"V":d.t,has=new Set(D.filter(d=>inL(d)).map(tc));$("chips").innerHTML=[["","All"]].concat(Object.keys(T).filter(k=>has.has(k)).map(k=>[k,T[k]])).map(c=>`<button class="chip ${c[0]===ty?"on":""}" data-c="${c[0]}">${c[1]}</button>`).join("")}
function tgs(){document.querySelectorAll(".tgb").forEach(b=>{const t=b.dataset.t;b.classList.toggle("on",t==="unk"?unk:t==="wr"?wr:t==="bo"?bo:t==="hide"?hideM:exAll)});$("wrb").textContent="কুইজে ভুল করা শব্দ ("+NB(wrong.size)+")";const l=mode==="d";$("tl").style.display=mode==="t"?"none":"flex";if(mode==="t")$("filt").classList.remove("on");tabs();$("tg").style.display=l?"flex":"none";$("az").style.display=l?"flex":"none";$("st").style.display=l?"block":"none"}
function mkq(){const n=Q.items[Q.i];Q.a=null;if(Q.k==="m")Q.o=sh([n,...sh(D.filter(d=>d.bn&&d!==n&&d.bn!==n.bn)).slice(0,3)])}
function quiz(){
 const kb=Q&&Q.st?"":`<div class="seg bn qkb"><button data-qk="m" class="${qk==="m"?"on":""}">শব্দের অর্থ চেনা</button><button data-qk="a" class="${qk==="a"?"on":""}">der / die / das চেনা</button></div>`;
 if(!Q){const b=flt().filter(d=>qk==="m"?d.bn:d.t==="N"&&/^(der|die|das)$/.test(d.a||""));if(!b.length)return kb+'<div class="empty bn">কুইজের জন্য কোনো শব্দ নেই</div>';Q={k:qk,items:sh(b).slice(0,10),i:0,s:0};mkq()}
 const T=Q.items.length;
 if(Q.i>=T){const f=Q.s/T;return kb+`<div class="qc bn"><div class="res">${f>=.8?"":f>=.5?"":""}</div><h2>${NB(Q.s)} / ${NB(T)}</h2><p>${f>=.8?"দারুণ! চালিয়ে যান।":f>=.5?"ভালো হয়েছে, আরেকবার চেষ্টা করুন।":"অভ্যাস করলেই হবে, তালিকা থেকে আবার দেখে নিন।"}</p>${Q.st?(f>=.7?"<p>স্টেশন পাস! পরের স্টেশন খুলে গেছে।</p>":"<p>পাস করতে ৭০% লাগে, আবার চেষ্টা করুন।</p>")+'<button class="big" data-back="1">পথে ফিরুন</button>':'<button class="big" data-qr="1">আবার খেলুন</button>'}</div>`}
 const n=Q.items[Q.i],a=Q.a!==null,m=Q.k==="m";
 const w=m?full(n):"___ "+n.w;
 const ops=m?Q.o.map(o=>`<button class="op ${a?(o.i===n.i?"ok":String(o.i)===Q.a?"no":"dim"):""}" data-a="${o.i}" ${a?"disabled":""}><span>${E(o.bn)}</span><small>${E(o.en)}</small></button>`).join(""):["der","die","das"].map(x=>`<button class="op ${a?(x===n.a?"ok":x===Q.a?"no":"dim"):""}" data-a="${x}" ${a?"disabled":""}><span class="${x}">${x}</span></button>`).join("");
 return kb+`<div class="qc bn"><div class="qh"><span>প্রশ্ন ${NB(Q.i+1)} / ${NB(T)}</span><span>স্কোর: ${NB(Q.s)}</span></div>${m?"":'<div class="sm">এর Artikel কী?</div>'}<div class="qw ${m&&n.t==="N"?ac(n):""}">${E(w)}</div>${m?"":`<div class="en3">${E(n.en)}${n.bn?" · "+E(n.bn):""}</div>`}<div class="ops">${ops}</div>${a?`<button class="big" data-nx="1">${Q.i+1>=T?"ফলাফল দেখুন":"পরের প্রশ্ন →"}</button>`:""}</div>`}
function sub(d){let x="";if(d.t==="N"&&d.pl)x=d.pl==="(nur Plural)"?"শুধু বহুবচন":"Pl.: die "+d.pl;else if(d.er)x="er/sie "+d.er+(d.pr?" · "+d.pr:"")+(d.pf?" · "+d.pf:"");return x?`<small class="fm">${E(x)}</small>`:""}
function info(d){let r="";
 if(d.t==="N"&&d.pl)r+=`<div class="en3">বহুবচন: ${d.pl==="(nur Plural)"?"শুধু বহুবচন":"die "+E(d.pl)}</div>`;
 if(d.er)r+=`<div class="en3">er/sie ${E(d.er)}${d.pr?" · "+E(d.pr):""}${d.pf?" · "+E(d.pf):""}</div>`;
 return r}
const card=d=>{const c=ac(d),bl=hideM&&!rev.has(d.id)?" bl":"",pill=d.t==="N"&&d.a?E(d.a):d.t==="S"||d.t==="W"?"Verb":d.t==="ADJ"?"Adjective":d.t==="ADV"?"Adverb":"Other";
 return`<div class="wc r-${c}" data-o="${d.i}"><div class="wtop"><span class="ap ${c}">${pill}</span>${lvl==="All"?`<span class="lb l${({A1:1,A2:2,B1:3})[d.lv]}">${d.lv}</span>`:""}<button class="ck ${known.has(d.id)?"on":""} ${lk===d.i?"pop":""}" data-k="${d.i}" aria-label="known">✓</button></div><div class="wde ${d.t==="N"?c:""}">${E(d.de).replace("|","·")}</div>${sub(d)}<div class="wbn bn${bl}">${d.bn?E(d.bn):""}</div><div class="wen${bl}">${E(d.en)}</div></div>`};
function AF(){return`<div class="leg2"><span class="ap der">der · পুংলিঙ্গ</span><span class="ap die">die · স্ত্রীলিঙ্গ</span><span class="ap das">das · ক্লীবলিঙ্গ</span></div><div class="arf bn">${["","der","die","das"].map(x=>`<button class="chip ${ar===x?"on":""}" data-ar="${x}">${x||"সব"}</button>`).join("")}</div>`}
function render(){render0();fitWords()}
function fitWords(){const els=[...document.querySelectorAll(".wde")];els.forEach(e=>{e.style.fontSize=""});const r=els.map(e=>[e.scrollWidth,e.clientWidth]);els.forEach((e,i)=>{const sw=r[i][0],cw=r[i][1];if(cw>0&&sw>cw)e.style.fontSize=Math.max(10,Math.floor(23*cw/sw*10)/10)+"px"})}
function render0(){
 prog();tgs();const v=$("view");
 if(mode==="q"){v.innerHTML=quiz();return}
 if(mode==="t"){v.innerHTML=learn();return}
const B=flt(),L0=0;if(al&&!B.some(d=>d.L===al))al="";const L=al?B.filter(d=>d.L===al):B;
 $("st").textContent="মোট "+NB(L.length)+"টি শব্দ দেখানো হচ্ছে";
 $("az").innerHTML="";
 if(!L.length){v.innerHTML=AF()+'<div class="empty bn">'+(D.some(d=>inL(d))?"কোনো শব্দ পাওয়া যায়নি":lvl+" লেভেলের শব্দ শীঘ্রই যোগ হবে")+"</div>";return}
 let last="",h="";L.slice(0,lim).forEach(d=>{if(!al&&d.L!==last){last=d.L;h+=`<div class="lh">${last}</div>`}h+=card(d)});
 if(L.length>lim)h+=`<button class="big" data-more="1">আরও দেখান (${NB(L.length-lim)}টি বাকি)</button>`;
 const lt=[...new Set(B.map(d=>d.L))];
 v.innerHTML=AF()+'<div class="cards">'+h+'</div>';$("az").innerHTML=[""].concat(lt).map(l=>`<button class="chip ${l===al?"on":""}" data-l="${l}">${l||"সব"}</button>`).join("");lk=-1}
$("view").addEventListener("click",e=>{
 const b=e.target.closest("button"),t=e.target;
 if(b){const s=b.dataset;
  if(s.ar!==undefined){ar=s.ar;lim=60;render();return}
  if(s.g!==undefined){og.has(s.g)?og.delete(s.g):og.add(s.g);render();return}   if(s.st!==undefined){os=os===+s.st?-2:+s.st;render();return}
  if(s.more){lim+=60;render();return}
  if(s.fs!==undefined){const t=CUR[+s.fs];F={t,q:sh(t.w),flip:false,total:t.w.length,done:0};render();return}
  if(s.fx){F=null;render();return}
  if(s.fa){const d=F.q.shift();if(s.fa==="again")F.q.push(d);else{F.done++;known.add(d.id);save()}F.flip=false;if(!F.q.length){const t=F.t;F=null;Q={k:"m",items:sh(t.w).slice(0,10),i:0,s:0,st:t.k};mkq();mode="q"}render();return}
  if(s.sq!==undefined){const t=CUR[+s.sq];Q={k:"m",items:sh(t.w).slice(0,10),i:0,s:0,st:t.k};mkq();mode="q";render();return}
  if(s.back){mode="t";Q=null;F=null;os=-1;lim=60;render();return}
  if(s.s!==undefined){say(D[s.s].w);return}
  if(s.sx!==undefined){say(D[s.sx].ex[0]);return}
  if(s.k!==undefined){const d=D[+s.k],was=known.has(d.id);was?known.delete(d.id):known.add(d.id);save();if(unk||mode==="t"){lk=was?-1:d.i;render()}else{b.classList.toggle("on",!was);if(!was){b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop")}prog()}return}
  if(s.qk){qk=s.qk;Q=null;render();return}
  if(s.a!==undefined&&Q.a===null){Q.a=s.a;const n=Q.items[Q.i];if(Q.k==="m"?s.a===String(n.i):s.a===n.a){Q.s++;wrong.delete(n.id)}else wrong.add(n.id);saveW();render();return}
  if(s.nx){Q.i++;if(Q.i<Q.items.length)mkq();else if(Q.st&&Q.s/Q.items.length>=.7){pass.add(Q.st);Q.items.forEach(d=>known.add(d.id));save();savePass()}render();return}
  if(s.qr){Q=null;render();return}
  return}
 if(F&&t.closest(".fcard")){F.flip=!F.flip;render();return}
 const tr=t.closest(".wc[data-o]");
 if(tr){const d=D[+tr.dataset.o];if(hideM&&!rev.has(d.id)){rev.add(d.id);tr.querySelectorAll(".bl").forEach(x=>x.classList.remove("bl"))}}
});
$("az").addEventListener("click",e=>{const b=e.target.closest("button");if(b){al=b.dataset.l;lim=60;render()}});
$("chips").addEventListener("click",e=>{const c=e.target.closest("button");if(c){ty=c.dataset.c;Q=null;os=-1;lim=60;chips();render()}});
$("tg").addEventListener("click",e=>{const t=e.target.dataset.t;if(!t)return;if(t==="unk")unk=!unk;if(t==="wr")wr=!wr;if(t==="bo")bo=!bo;if(t==="hide"){hideM=!hideM;rev.clear()}if(t==="ex")exAll=!exAll;Q=null;os=-1;lim=60;render()});
let qt;$("q").oninput=e=>{q=e.target.value;Q=null;os=-1;lim=60;al="";clearTimeout(qt);qt=setTimeout(render,150)};
$("tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;mode=b.dataset.m;Q=null;F=null;os=-1;lim=60;render()});
function theme(t){document.documentElement.setAttribute("data-theme",t);try{localStorage.setItem("th",t)}catch(e){}}
$("th").onclick=()=>{const c=document.documentElement.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");theme(c==="dark"?"light":"dark")};
try{const s=localStorage.getItem("th");if(s)document.documentElement.setAttribute("data-theme",s)}catch(e){}
const TH=[{k:"a1_gruss",lv:"A1",ti:"অভিবাদন ও ভদ্রতা"},{k:"a1_zahlen",lv:"A1",ti:"সংখ্যা"},{k:"a1_familie",lv:"A1",ti:"পরিবার"},{k:"a1_mensch_1",lv:"A1",ti:"মানুষ ও পেশা (১)"},{k:"a1_mensch_2",lv:"A1",ti:"মানুষ ও পেশা (২)"},{k:"a1_essen_1",lv:"A1",ti:"খাবার ও পানীয় (১)"},{k:"a1_essen_2",lv:"A1",ti:"খাবার ও পানীয় (২)"},{k:"a1_essen_3",lv:"A1",ti:"খাবার ও পানীয় (৩)"},{k:"a1_essen_4",lv:"A1",ti:"খাবার ও পানীয় (৪)"},{k:"a1_essen_5",lv:"A1",ti:"খাবার ও পানীয় (৫)"},{k:"a1_farben",lv:"A1",ti:"রং"},{k:"a1_kleidung_1",lv:"A1",ti:"পোশাক (১)"},{k:"a1_kleidung_2",lv:"A1",ti:"পোশাক (২)"},{k:"a1_wohnen_1",lv:"A1",ti:"বাড়ি ও ঘর (১)"},{k:"a1_wohnen_2",lv:"A1",ti:"বাড়ি ও ঘর (২)"},{k:"a1_wohnen_3",lv:"A1",ti:"বাড়ি ও ঘর (৩)"},{k:"a1_wohnen_4",lv:"A1",ti:"বাড়ি ও ঘর (৪)"},{k:"a1_zeit_1",lv:"A1",ti:"সময় ও দিন (১)"},{k:"a1_zeit_2",lv:"A1",ti:"সময় ও দিন (২)"},{k:"a1_zeit_3",lv:"A1",ti:"সময় ও দিন (৩)"},{k:"a1_zeit_4",lv:"A1",ti:"সময় ও দিন (৪)"},{k:"a1_zeit_5",lv:"A1",ti:"সময় ও দিন (৫)"},{k:"a1_zeit_6",lv:"A1",ti:"সময় ও দিন (৬)"},{k:"a1_wetter_1",lv:"A1",ti:"আবহাওয়া ও ঋতু (১)"},{k:"a1_wetter_2",lv:"A1",ti:"আবহাওয়া ও ঋতু (২)"},{k:"a1_koerper_1",lv:"A1",ti:"শরীর ও স্বাস্থ্য (১)"},{k:"a1_koerper_2",lv:"A1",ti:"শরীর ও স্বাস্থ্য (২)"},{k:"a1_koerper_3",lv:"A1",ti:"শরীর ও স্বাস্থ্য (৩)"},{k:"a1_koerper_4",lv:"A1",ti:"শরীর ও স্বাস্থ্য (৪)"},{k:"a1_stadt_1",lv:"A1",ti:"শহর ও যাতায়াত (১)"},{k:"a1_stadt_2",lv:"A1",ti:"শহর ও যাতায়াত (২)"},{k:"a1_stadt_3",lv:"A1",ti:"শহর ও যাতায়াত (৩)"},{k:"a1_stadt_4",lv:"A1",ti:"শহর ও যাতায়াত (৪)"},{k:"a1_stadt_5",lv:"A1",ti:"শহর ও যাতায়াত (৫)"},{k:"a1_beruf_1",lv:"A1",ti:"পেশা (১)"},{k:"a1_beruf_2",lv:"A1",ti:"পেশা (২)"},{k:"a1_freizeit_1",lv:"A1",ti:"অবসর ও খেলাধুলা (১)"},{k:"a1_freizeit_2",lv:"A1",ti:"অবসর ও খেলাধুলা (২)"},{k:"a1_kaufen_1",lv:"A1",ti:"কেনাকাটা ও টাকা (১)"},{k:"a1_kaufen_2",lv:"A1",ti:"কেনাকাটা ও টাকা (২)"},{k:"a1_kaufen_3",lv:"A1",ti:"কেনাকাটা ও টাকা (৩)"},{k:"a1_kaufen_4",lv:"A1",ti:"কেনাকাটা ও টাকা (৪)"},{k:"a1_kommu_1",lv:"A1",ti:"যোগাযোগ ও মিডিয়া (১)"},{k:"a1_kommu_2",lv:"A1",ti:"যোগাযোগ ও মিডিয়া (২)"},{k:"a1_kommu_3",lv:"A1",ti:"যোগাযোগ ও মিডিয়া (৩)"},{k:"a1_land_1",lv:"A1",ti:"দেশ ও ভাষা (১)"},{k:"a1_land_2",lv:"A1",ti:"দেশ ও ভাষা (২)"},{k:"a1_gramm_1",lv:"A1",ti:"ব্যাকরণ ও ক্লাসের শব্দ (১)"},{k:"a1_gramm_2",lv:"A1",ti:"ব্যাকরণ ও ক্লাসের শব্দ (২)"},{k:"a1_gramm_3",lv:"A1",ti:"ব্যাকরণ ও ক্লাসের শব্দ (৩)"},{k:"a1_gramm_4",lv:"A1",ti:"ব্যাকরণ ও ক্লাসের শব্দ (৪)"},{k:"a1_gramm_5",lv:"A1",ti:"ব্যাকরণ ও ক্লাসের শব্দ (৫)"},{k:"a1_gramm_6",lv:"A1",ti:"ব্যাকরণ ও ক্লাসের শব্দ (৬)"},{k:"a1_verben_1",lv:"A1",ti:"দৈনন্দিন ক্রিয়া (১)"},{k:"a1_verben_2",lv:"A1",ti:"দৈনন্দিন ক্রিয়া (২)"},{k:"a1_vsep_1",lv:"A1",ti:"আলাদা হওয়া ক্রিয়া (১)"},{k:"a1_vsep_2",lv:"A1",ti:"আলাদা হওয়া ক্রিয়া (২)"},{k:"a1_vsep_3",lv:"A1",ti:"আলাদা হওয়া ক্রিয়া (৩)"},{k:"a1_vsep_4",lv:"A1",ti:"আলাদা হওয়া ক্রিয়া (৪)"},{k:"a1_vrest_1",lv:"A1",ti:"আরও ক্রিয়া (১)"},{k:"a1_vrest_2",lv:"A1",ti:"আরও ক্রিয়া (২)"},{k:"a1_vrest_3",lv:"A1",ti:"আরও ক্রিয়া (৩)"},{k:"a1_vrest_4",lv:"A1",ti:"আরও ক্রিয়া (৪)"},{k:"a1_vrest_5",lv:"A1",ti:"আরও ক্রিয়া (৫)"},{k:"a1_vrest_6",lv:"A1",ti:"আরও ক্রিয়া (৬)"},{k:"a1_vrest_7",lv:"A1",ti:"আরও ক্রিয়া (৭)"},{k:"a1_vrest_8",lv:"A1",ti:"আরও ক্রিয়া (৮)"},{k:"a1_nrest_1",lv:"A1",ti:"আরও বিশেষ্য (১)"},{k:"a1_nrest_2",lv:"A1",ti:"আরও বিশেষ্য (২)"},{k:"a1_nrest_3",lv:"A1",ti:"আরও বিশেষ্য (৩)"},{k:"a1_nrest_4",lv:"A1",ti:"আরও বিশেষ্য (৪)"},{k:"a1_nrest_5",lv:"A1",ti:"আরও বিশেষ্য (৫)"},{k:"a1_nrest_6",lv:"A1",ti:"আরও বিশেষ্য (৬)"},{k:"a1_nrest_7",lv:"A1",ti:"আরও বিশেষ্য (৭)"},{k:"a1_nrest_8",lv:"A1",ti:"আরও বিশেষ্য (৮)"},{k:"a1_nrest_9",lv:"A1",ti:"আরও বিশেষ্য (৯)"},{k:"a1_nrest_10",lv:"A1",ti:"আরও বিশেষ্য (১০)"},{k:"a1_nrest_11",lv:"A1",ti:"আরও বিশেষ্য (১১)"},{k:"a1_nrest_12",lv:"A1",ti:"আরও বিশেষ্য (১২)"},{k:"a1_orest_1",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (১)"},{k:"a1_orest_2",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (২)"},{k:"a1_orest_3",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (৩)"},{k:"a1_orest_4",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (৪)"},{k:"a1_orest_5",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (৫)"},{k:"a1_orest_6",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (৬)"},{k:"a1_orest_7",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (৭)"},{k:"a1_orest_8",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (৮)"},{k:"a1_orest_9",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (৯)"},{k:"a1_orest_10",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (১০)"},{k:"a1_orest_11",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (১১)"},{k:"a1_orest_12",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (১২)"},{k:"a1_orest_13",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (১৩)"},{k:"a1_orest_14",lv:"A1",ti:"বিশেষণ, অব্যয় ও অন্যান্য (১৪)"},{k:"a2_gefuehle",lv:"A2",ti:"অনুভূতি"},{k:"a2_arbeit",lv:"A2",ti:"কাজ ও পেশা"},{k:"a2_gesundheit",lv:"A2",ti:"স্বাস্থ্য ও চিকিৎসা"},{k:"a2_wohnen",lv:"A2",ti:"বাড়ি ও বসবাস"},{k:"a2_reisen",lv:"A2",ti:"ভ্রমণ ও যানবাহন"},{k:"a2_freizeit2",lv:"A2",ti:"অবসর ও শখ"},{k:"a2_technik",lv:"A2",ti:"প্রযুক্তি ও মিডিয়া"},{k:"a2_schule",lv:"A2",ti:"স্কুল ও শিক্ষা"},{k:"a2_natur",lv:"A2",ti:"প্রকৃতি ও প্রাণী"},{k:"a2_feste",lv:"A2",ti:"উৎসব ও সমাজ"},{k:"a2_essen2",lv:"A2",ti:"খাবার ও টাকাপয়সা"},{k:"a2_verben2",lv:"A2",ti:"দরকারি ক্রিয়া"},{k:"b1_k1_s0_1",lv:"B1",ti:"অধ্যায় ১ · শুভ যাত্রা (১)"},{k:"b1_k1_s0_2",lv:"B1",ti:"অধ্যায় ১ · শুভ যাত্রা (২)"},{k:"b1_k1_s1",lv:"B1",ti:"অধ্যায় ১ · ছুটির পরিকল্পনা"},{k:"b1_k1_s2",lv:"B1",ti:"অধ্যায় ১ · ট্রাভেল এজেন্সিতে"},{k:"b1_k1_s3_1",lv:"B1",ti:"অধ্যায় ১ · জার্মানির ভ্রমণ গন্তব্য (১)"},{k:"b1_k1_s3_2",lv:"B1",ti:"অধ্যায় ১ · জার্মানির ভ্রমণ গন্তব্য (২)"},{k:"b1_k1_s4",lv:"B1",ti:"অধ্যায় ১ · যাত্রাপথে"},{k:"b1_k1_s5_1",lv:"B1",ti:"অধ্যায় ১ · ছুটি নাকি কাজ? (১)"},{k:"b1_k1_s5_2",lv:"B1",ti:"অধ্যায় ১ · ছুটি নাকি কাজ? (২)"},{k:"b1_k2_s0",lv:"B1",ti:"অধ্যায় ২ · ব্যবহারিক গ্যাজেট"},{k:"b1_k2_s1",lv:"B1",ti:"অধ্যায় ২ · সব মেরামত করাই"},{k:"b1_k2_s2_1",lv:"B1",ti:"অধ্যায় ২ · বদলে নিতে চাই (১)"},{k:"b1_k2_s2_2",lv:"B1",ti:"অধ্যায় ২ · বদলে নিতে চাই (২)"},{k:"b1_k2_s3_1",lv:"B1",ti:"অধ্যায় ২ · স্মার্ট বাসস্থান (১)"},{k:"b1_k2_s3_2",lv:"B1",ti:"অধ্যায় ২ · স্মার্ট বাসস্থান (২)"},{k:"b1_k2_s4_1",lv:"B1",ti:"অধ্যায় ২ · রঙিন বিজ্ঞাপন (১)"},{k:"b1_k2_s4_2",lv:"B1",ti:"অধ্যায় ২ · রঙিন বিজ্ঞাপন (২)"},{k:"b1_k3_t0_1",lv:"B1",ti:"অধ্যায় ৩ · পরিবর্তনের সূচনা (১)"},{k:"b1_k3_t0_2",lv:"B1",ti:"অধ্যায় ৩ · পরিবর্তনের সূচনা (২)"},{k:"b1_k3_t1_1",lv:"B1",ti:"অধ্যায় ৩ · হঠাৎ সব বদলে গেল (১)"},{k:"b1_k3_t1_2",lv:"B1",ti:"অধ্যায় ৩ · হঠাৎ সব বদলে গেল (২)"},{k:"b1_k3_t1_3",lv:"B1",ti:"অধ্যায় ৩ · হঠাৎ সব বদলে গেল (৩)"},{k:"b1_k3_t1_4",lv:"B1",ti:"অধ্যায় ৩ · হঠাৎ সব বদলে গেল (৪)"},{k:"b1_k3_t2_1",lv:"B1",ti:"অধ্যায় ৩ · সুখের ব্যাপার (১)"},{k:"b1_k3_t2_2",lv:"B1",ti:"অধ্যায় ৩ · সুখের ব্যাপার (২)"},{k:"b1_k3_t3",lv:"B1",ti:"অধ্যায় ৩ · তারপর অনেক কিছু বদলাল"},{k:"b1_k3_t4_1",lv:"B1",ti:"অধ্যায় ৩ · ভদ্রতা ও আদবকায়দা (১)"},{k:"b1_k3_t4_2",lv:"B1",ti:"অধ্যায় ৩ · ভদ্রতা ও আদবকায়দা (২)"},{k:"b1_k4_u0_1",lv:"B1",ti:"অধ্যায় ৪ · কর্মজগতের পরিচয় (১)"},{k:"b1_k4_u0_2",lv:"B1",ti:"অধ্যায় ৪ · কর্মজগতের পরিচয় (২)"},{k:"b1_k4_u0_3",lv:"B1",ti:"অধ্যায় ৪ · কর্মজগতের পরিচয় (৩)"},{k:"b1_k4_u1_1",lv:"B1",ti:"অধ্যায় ৪ · কাজের আলাপ ও ভুল হলে (১)"},{k:"b1_k4_u1_2",lv:"B1",ti:"অধ্যায় ৪ · কাজের আলাপ ও ভুল হলে (২)"},{k:"b1_k4_u2_1",lv:"B1",ti:"অধ্যায় ৪ · সঠিক চাকরির আবেদন (১)"},{k:"b1_k4_u2_2",lv:"B1",ti:"অধ্যায় ৪ · সঠিক চাকরির আবেদন (২)"},{k:"b1_k4_u2_3",lv:"B1",ti:"অধ্যায় ৪ · সঠিক চাকরির আবেদন (৩)"},{k:"b1_k4_u3_1",lv:"B1",ti:"অধ্যায় ৪ · ইন্টারভিউ (১)"},{k:"b1_k4_u3_2",lv:"B1",ti:"অধ্যায় ৪ · ইন্টারভিউ (২)"},{k:"b1_k5_v0_1",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশ ও পরিসংখ্যান (১)"},{k:"b1_k5_v0_2",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশ ও পরিসংখ্যান (২)"},{k:"b1_k5_v0_3",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশ ও পরিসংখ্যান (৩)"},{k:"b1_k5_v1_1",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশ-দ্বন্দ্ব (১)"},{k:"b1_k5_v1_2",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশ-দ্বন্দ্ব (২)"},{k:"b1_k5_v2_1",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশের জন্য (১)"},{k:"b1_k5_v2_2",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশের জন্য (২)"},{k:"b1_k5_v2_3",lv:"B1",ti:"অধ্যায় ৫ · পরিবেশের জন্য (৩)"},{k:"b1_k5_v3",lv:"B1",ti:"অধ্যায় ৫ · আবহাওয়া"},{k:"b1_k5_v4_1",lv:"B1",ti:"অধ্যায় ৫ · মানুষ ও প্রকৃতির জন্য উদ্যোগ (১)"},{k:"b1_k5_v4_2",lv:"B1",ti:"অধ্যায় ৫ · মানুষ ও প্রকৃতির জন্য উদ্যোগ (২)"},{k:"b1_k5_v4_3",lv:"B1",ti:"অধ্যায় ৫ · মানুষ ও প্রকৃতির জন্য উদ্যোগ (৩)"},{k:"b1_k6_w0",lv:"B1",ti:"অধ্যায় ৬ · ভবিষ্যতের প্রযুক্তি"},{k:"b1_k6_w1_1",lv:"B1",ti:"অধ্যায় ৬ · ভালো সংকল্প? (১)"},{k:"b1_k6_w1_2",lv:"B1",ti:"অধ্যায় ৬ · ভালো সংকল্প? (২)"},{k:"b1_k6_w2_1",lv:"B1",ti:"অধ্যায় ৬ · ভবিষ্যতের শহর (১)"},{k:"b1_k6_w2_2",lv:"B1",ti:"অধ্যায় ৬ · ভবিষ্যতের শহর (২)"},{k:"b1_k6_w2_3",lv:"B1",ti:"অধ্যায় ৬ · ভবিষ্যতের শহর (৩)"},{k:"b1_k6_w3_1",lv:"B1",ti:"অধ্যায় ৬ · গান ও সুর (১)"},{k:"b1_k6_w3_2",lv:"B1",ti:"অধ্যায় ৬ · গান ও সুর (২)"}];
function tabs(){const on=mode==="q"&&Q&&Q.st?"t":mode;$("tabs").innerHTML=[["d","Wörter","শব্দকোষ"],["t","Lernen","শেখা"],["q","Quiz","কুইজ"]].map(x=>`<button class="${x[0]===on?"on":""}" data-m="${x[0]}"><b class="g">${x[1]}</b><small>${x[2]}</small></button>`).join("")}
function flash(){const t=F.t,d=F.q[0];
 return`<div class="qc bn"><div class="qh"><span>${t.ti}</span><span>${NB(F.done)} / ${NB(F.total)}</span></div><div class="fcard"><div class="fw ${d.t==="N"?ac(d):""}">${d.t==="N"&&d.a?E(d.a)+" ":""}${E(d.de).replace("|","·")}</div>${sub(d)}${F.flip?`<div class="fe">${E(d.en)}</div><div class="fb">${E(d.bn)}</div>`:'<div class="hint">অর্থ দেখতে ট্যাপ করুন</div>'}</div>${F.flip?'<div class="two"><button class="op" data-fa="again"><span>আবার দেখব</span></button><button class="op ok" data-fa="know"><span>জানি</span></button></div>':""}<button class="ghost" data-fx="1">বন্ধ করুন</button></div>`}
function learn(){
 if(F)return flash();
 const M={A1:1,A2:2,B1:3};
 if(!window.og)window.og=new Set();
 if(!window.TW){TW={};D.forEach(d=>{if(d.th)(TW[d.th]=TW[d.th]||[]).push(d)});for(const k in TW)TW[k].sort((a,b)=>a.to-b.to)}
 CUR=TH.map(t=>({k:t.k,lv:t.lv,ti:t.ti,w:TW[t.k]||[]})).filter(t=>t.w.length>=4);
 if(!CUR.length)return'<div class="empty bn">শেখার পাঠ শীঘ্রই যোগ হবে</div>';
 const un=k=>k===0||CUR[k-1].lv!==CUR[k].lv||pass.has(CUR[k-1].k),cur=new Set();
 ["A1","A2","B1"].forEach(l=>{const i=CUR.findIndex(t=>t.lv===l&&!pass.has(t.k));if(i>=0)cur.add(i)});
 if(os===-1)os=cur.size?Math.min(...cur):0;
 let ix=0,h="";
 const gm={};CUR.forEach(t=>{const g=gm[t.lv]=gm[t.lv]||{n:0,p:0};g.n++;if(pass.has(t.k))g.p++});
 CUR.forEach((t,k)=>{if(k===0||CUR[k-1].lv!==t.lv){ix=0;const g=gm[t.lv],op=og.has(t.lv);if(k>0)h+='</div>';h+=`<button class="lg l${M[t.lv]} ${op?"on":""}" data-g="${t.lv}" aria-expanded="${op}"><span class="gt"><b>${t.lv}</b><small>${NB(g.n)}টি স্টেশন · ${NB(g.p)}/${NB(g.n)} পাস</small></span><i class="gc"></i></button><div class="lgb ${op?"on":""}">`}ix++;
  const dn=pass.has(t.k),lc=!un(k),o=os===k&&!lc,n=t.w.filter(d=>known.has(d.id)).length;
  h+=`<section class="stn ${dn?"done":""} ${cur.has(k)?"cur":""} ${lc?"lock":""} ${o?"open":""}"><span class="nd">${dn?"✓":lc?"লক":NB(ix)}</span><button class="sh bn" data-st="${k}" ${lc?"disabled":""}><span class="sl"><b>${t.ti}</b><small>${lc?"আগের স্টেশন পাস করলে খুলবে":NB(t.w.length)+"টি শব্দ"}</small></span><span class="lb l${M[t.lv]}">${t.lv}</span><span class="sp">${NB(n)}/${NB(t.w.length)}</span></button>${o?'<div class="cards">'+t.w.map(card).join("")+`<p class="en3">শব্দ শিখে কুইজে ৭০% পেলে পরের স্টেশন খুলবে।</p><button class="big" data-fs="${k}">শেখা শুরু করুন</button><button class="ghost" data-sq="${k}">সরাসরি কুইজ দিন</button></div>`:""}</section>`});
 return`<div class="stat bn">স্টেশন পাস: ${NB(CUR.filter(t=>pass.has(t.k)).length)} / ${NB(CUR.length)} • সব লেভেলের জন্য একটাই পথ • পাস করতে ৭০%</div><div class="rail">`+h+'</div><div class="end bn">শেষ স্টেশন</div></div>'}
function lvs(){const M={A1:1,A2:2,B1:3},bt=l=>`<button class="lvb ${l==="All"?"all":"l"+M[l]} ${l===lvl?"on":""}" data-l="${l}">${l}<small>${(l==="All"||D.some(d=>d.lv===l))?NB(D.filter(d=>(l==="All"||d.lv===l)&&d.bn).length)+"টি":"শীঘ্রই"}</small></button>`;$("lvs").innerHTML=bt("All")+'<i class="vd"></i>'+["A1","A2","B1"].map(bt).join("")}
$("lvs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;lvl=b.dataset.l;try{localStorage.setItem("lv",lvl)}catch(x){}ty="";Q=null;os=-1;lim=60;lvs();chips();render()});
lvs();
$("fb").onclick=()=>{$("fb").classList.toggle("on",$("filt").classList.toggle("on"))};
let rt;window.addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(fitWords,150)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitWords);
chips();render();
/* ফোনের ব্যাক বাটনের জন্য: ভেতরের ধাপ ব্রাউজারের ইতিহাসে জমা হয় */
(function(){var _r=render,_hk="d",_pop=false,_i=0;function key(){return mode+(F?"F":"")+(Q?"Q":"")}
try{history.replaceState({k:"d",m:"d",i:0},"")}catch(e){}
render=function(){_r.apply(this,arguments);if(_pop)return;var k=key();if(k!==_hk){_hk=k;_i++;try{history.pushState({k:k,m:mode,i:_i},"")}catch(e){}}};
window.addEventListener("popstate",function(e){var st=e.state||{k:"d",m:"d",i:0};_pop=true;mode=st.m||"d";Q=null;F=null;os=-1;lim=60;_i=st.i||0;_r();_hk=mode;_pop=false;window.scrollTo(0,0)});
})();
