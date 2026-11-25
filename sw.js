/* ===== sw.js: Jabirs Weg অফলাইন সহায়ক =====
   নতুন ফাইল আপলোডের পর পুরনো কপি যেন না আটকে থাকে, তাই আগে ইন্টারনেট থেকে আনে, না পেলে জমানো কপি দেখায়। */
var V='jw-v1';
var FILES=['index.html','learn.html','vocab.html','manifest.webmanifest','base.css','fonts.css','bn-400.woff','bn-600.woff','bn-700.woff','bn-900.woff','nav.js','pwa.js','config.js','core.js','courses.js','goal.js','ticket.js','payment.js','my.js','home2.js','boot.js','learn.js','vocab-app.js','words-a1.js','words-a2.js','words-b1.js','mock.js','mock-a1-lesen.js','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return Promise.all(FILES.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==location.origin)return;          /* Supabase, ফন্ট ইত্যাদি সরাসরি যাবে */
  e.respondWith(
    fetch(r).then(function(res){
      if(res&&res.status===200&&res.type==='basic'){
        var cp=res.clone();
        caches.open(V).then(function(c){
          c.keys().then(function(ks){ks.forEach(function(k){var x=new URL(k.url);if(x.pathname===u.pathname&&x.search!==u.search)c.delete(k)})}).then(function(){c.put(r,cp)});
        });
      }
      return res;
    }).catch(function(){
      return caches.match(r,{ignoreSearch:true}).then(function(m){
        return m||(r.mode==='navigate'?caches.match('index.html'):undefined);
      });
    })
  );
});
