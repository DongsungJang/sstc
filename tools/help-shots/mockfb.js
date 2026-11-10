(function(){
window.__store=window.__SEED||{};
function prune(v){ if(v===null||v===undefined) return undefined;
  if(Array.isArray(v)){ const o={}; v.forEach((x,i)=>{const p=prune(x); if(p!==undefined) o[i]=p;}); return Object.keys(o).length?o:undefined; }
  if(typeof v==="object"){ const o={}; Object.keys(v).forEach(k=>{const p=prune(v[k]); if(p!==undefined) o[k]=p;}); return Object.keys(o).length?o:undefined; }
  return v; }
function toArr(v){ if(v&&typeof v==="object"){ const ks=Object.keys(v); const arr=ks.length&&ks.every((k,i)=>String(i)===k); const o=arr?[]:{}; ks.forEach(k=>o[k]=toArr(v[k])); return o;} return v; }
function getP(path){ return path.split("/").filter(Boolean).reduce((o,k)=>o==null?undefined:o[k],window.__store); }
function setP(path,val){ const ks=path.split("/").filter(Boolean); let o=window.__store; ks.slice(0,-1).forEach(k=>{ if(typeof o[k]!=="object"||o[k]===null) o[k]={}; o=o[k]; }); const p=prune(val); if(p===undefined) delete o[ks[ks.length-1]]; else o[ks[ks.length-1]]=p; }
const listeners=[];
const snap=(path)=>{ const v=getP(path); return {exists:()=>v!==undefined,val:()=>v===undefined?null:toArr(JSON.parse(JSON.stringify(v))),key:path.split("/").pop()}; };
function fire(){ listeners.slice().forEach(l=>l.h(snap(l.path))); }
let n=0;
function mkRef(path){ const r={ key:path.split("/").pop(),
  child:p=>mkRef(path+"/"+p),
  on:(ev,h)=>{ listeners.push({path,h}); setTimeout(()=>h(snap(path)),5); return h; },
  off:(ev,h)=>{ const i=listeners.findIndex(l=>l.h===h); if(i>=0) listeners.splice(i,1); },
  once:()=>Promise.resolve(snap(path)),
  set:v=>{ setP(path,v); setTimeout(fire,5); return Promise.resolve(); },
  update:obj=>{ Object.keys(obj).forEach(k=>setP(path+"/"+k,obj[k])); setTimeout(fire,5); return Promise.resolve(); },
  remove:()=>{ setP(path,null); setTimeout(fire,5); return Promise.resolve(); },
  push:v=>{ const k="k"+Date.now()+(n++); const c=mkRef(path+"/"+k); if(v!==undefined) c.set(v); const pr=Promise.resolve(); c.then=pr.then.bind(pr); return c; },
  orderByChild:()=>r, limitToLast:()=>r, equalTo:()=>r,
 }; return r; }
const user={uid:"u1",email:"tori@example.com"};
const authL=[];
const auth={currentUser:user,onAuthStateChanged(cb){authL.push(cb);setTimeout(()=>cb(auth.currentUser),0);return ()=>{};},
  signInWithEmailAndPassword(){auth.currentUser=user;authL.forEach(f=>f(user));return Promise.resolve({user});},
  signOut(){auth.currentUser=null;authL.forEach(f=>f(null));return Promise.resolve();},setPersistence(){return Promise.resolve();}};
window.firebase={apps:[],initializeApp(){this.apps.push(1);},database(){return {ref:p=>mkRef(p||"")};},auth(){return auth;}};
window.firebase.auth.Auth={Persistence:{LOCAL:"local",SESSION:"session"}};
window.firebase.database.ServerValue={TIMESTAMP:Date.now()};
window.FIREBASE_CONFIG={databaseURL:"mock",apiKey:"x"};
})();
