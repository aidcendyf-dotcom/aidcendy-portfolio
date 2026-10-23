const R=document.documentElement,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],RM=matchMedia('(prefers-reduced-motion:reduce)').matches,tg=$('#tg');
/* theme: toggle with a circular reveal, remember choice, press T */
function setT(v){R.dataset.theme=v;tg.setAttribute('aria-checked',v==='dark')}
let t='dark';try{t=localStorage.getItem('theme')||'dark'}catch(e){}
setT(t);
tg.onclick=()=>{const v=R.dataset.theme==='dark'?'light':'dark',go=()=>{setT(v);try{localStorage.setItem('theme',v)}catch(e){}};
if(!document.startViewTransition||RM)return go();
const r=tg.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
R.classList.add('nt');const vt=document.startViewTransition(go);
vt.ready.then(()=>R.animate({clipPath:[`circle(0 at ${x}px ${y}px)`,`circle(${rad}px at ${x}px ${y}px)`]},{duration:280,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(root)'}));
vt.finished.finally(()=>R.classList.remove('nt'))};
/* header, scroll-to-top, progress fallback */
$('#yr').textContent=new Date().getFullYear();
const hd=$('#hd');addEventListener('scroll',()=>hd.classList.toggle('sc',scrollY>20),{passive:true});
$('#up').onclick=()=>scrollTo({top:0,behavior:'instant'});
if(!CSS.supports('animation-timeline','scroll()')){const p=$('#prog');addEventListener('scroll',()=>p.style.transform=`scaleX(${scrollY/Math.max(1,R.scrollHeight-innerHeight)})`,{passive:true})}
/* floating nav: sliding indicator follows hover and the section in view */
const nv=$('#nv'),links=$$('#nv a');let cur=links[0];
const mv=a=>{nv.style.setProperty('--x',a.offsetLeft+'px');nv.style.setProperty('--w',a.offsetWidth+'px');nv.style.setProperty('--o',1)};
links.forEach(a=>a.onpointerenter=()=>mv(a));nv.onpointerleave=()=>mv(cur);
const act=a=>{cur=a;links.forEach(l=>l.classList.toggle('act',l===a));mv(a)};
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const l=links.find(a=>a.hash==='#'+e.target.id);if(l)act(l)}}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section').forEach(s=>spy.observe(s));
addEventListener('resize',()=>mv(cur));document.fonts&&document.fonts.ready.then(()=>mv(cur));
/* reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target)}),{threshold:.12,rootMargin:'0px 0px -4% 0px'});
$$('.rv').forEach(e=>{const i=[...e.parentElement.children].indexOf(e);e.style.setProperty('--d',Math.min(i,7)*.04+'s');io.observe(e)});
/* snappy section jumps: instant scroll plus a quick entrance */
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const s=$(a.hash);if(!s)return;e.preventDefault();s.scrollIntoView({behavior:'instant'});history.pushState(null,'',a.hash);if(RM)return;s.classList.remove('flip');void s.offsetWidth;s.classList.add('flip')}));
/* photo lightbox */
const lb=$('#lb'),li=lb.querySelector('img');let last;
const close=()=>{if(!lb.classList.contains('on'))return;lb.classList.remove('on');last&&last.focus()};
$$('.gal button').forEach(b=>b.onclick=()=>{const i=b.querySelector('img');li.src=i.currentSrc||i.src;li.alt=i.alt;last=b;lb.classList.add('on');lb.querySelector('button').focus()});
lb.onclick=close;
/* copy email, toast, shortcuts */
const toast=$('#toast');
function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('on'),2200)}
$('#cp').onclick=async()=>{const m='aidcendyf@gmail.com';
try{await navigator.clipboard.writeText(m);say('Email copied to clipboard')}
catch(e){const a=document.createElement('textarea');a.value=m;document.body.append(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}a.remove();say(ok?'Email copied to clipboard':'Copy failed. Select the address and copy it manually.')}};
addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='t'&&!e.metaKey&&!e.ctrlKey&&!e.altKey)tg.click()});

/* extra motion: ripple everywhere, pointer effects only with a mouse and motion allowed */
$$('.btn').forEach(b=>b.addEventListener('pointerdown',e=>{if(RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rp';s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';b.append(s);s.onanimationend=()=>s.remove()}));
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
const track=(el,move,reset)=>{el.addEventListener('pointermove',e=>move(e,el.getBoundingClientRect()));el.addEventListener('pointerleave',reset)};
$$('.sk li,.pc').forEach(c=>track(c,(e,r)=>{c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')},()=>{}));
const pt=$('.pt'),fr=$('.fr'),tilt=(x,y)=>{fr.style.setProperty('--ry',x+'deg');fr.style.setProperty('--rx',y+'deg')};
track(pt,(e,r)=>tilt(((e.clientX-r.left)/r.width-.5)*10,-((e.clientY-r.top)/r.height-.5)*10),()=>tilt(0,0));
$$('.btn.pri').forEach(b=>{const set=(x,y)=>{b.style.setProperty('--tx',x+'px');b.style.setProperty('--ty',y+'px')};track(b,(e,r)=>set((e.clientX-r.left-r.width/2)*.18,(e.clientY-r.top-r.height/2)*.28),()=>set(0,0))});
$$('.gal button').forEach(b=>{const set=(x,y)=>{b.style.setProperty('--px',x+'px');b.style.setProperty('--py',y+'px')};track(b,(e,r)=>set(-((e.clientX-r.left)/r.width-.5)*12,-((e.clientY-r.top)/r.height-.5)*12),()=>set(0,0))});
}
