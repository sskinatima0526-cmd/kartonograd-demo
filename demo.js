const products=[
  {name:'Старт',parts:'255 деталей',desc:'Для первого знакомства или как небольшой подарок.',price:1000},
  {name:'Для всей семьи',parts:'370 деталей',desc:'Для вечеров и выходных, когда собираете вместе.',price:1490},
  {name:'На праздник!',parts:'490 деталей',desc:'Для дня рождения и компании друзей.',price:1690}
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fmt=n=>n.toLocaleString('ru-RU').replace(/\s/g,' ')+' ₽';
const cart={};
const overlay=$('#overlay'),modal=$('#modal'),drawer=$('#drawer');
function closeAll(){overlay.classList.remove('on');modal.classList.remove('on');drawer.classList.remove('on')}
overlay.onclick=closeAll;$$('[data-close]').forEach(b=>b.onclick=closeAll);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),1800)}
function render(){
  const ids=Object.keys(cart).filter(k=>cart[k]>0);let sum=0,cnt=0;
  $('#items').innerHTML=ids.length?ids.map(i=>{const p=products[i];sum+=p.price*cart[i];cnt+=cart[i];
    return `<div class="item"><b>Набор «${p.name}»</b><span>${fmt(p.price*cart[i])}</span><span>${p.parts}</span><span class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="Меньше">−</button>${cart[i]}<button type="button" data-q="${i}" data-d="1" aria-label="Больше">+</button></span></div>`}).join(''):'<p class="empty">Корзина пока пустая. Выберите набор выше.</p>';
  $('#total').textContent=fmt(sum);const c=$('#cartCount');c.textContent=cnt;c.classList.toggle('on',cnt>0);
}
document.addEventListener('click',e=>{
  const q=e.target.closest('[data-q]');if(q){cart[q.dataset.q]=Math.max(0,(cart[q.dataset.q]||0)+ +q.dataset.d);render();return}
  const a=e.target.closest('[data-add]');if(a){add(a.dataset.add)}
  const p=e.target.closest('[data-product]');if(p){openProduct(p.dataset.product,p)}
  if(e.target.closest('[data-open-cart]')){overlay.classList.add('on');drawer.classList.add('on')}
  const v=e.target.closest('.video');if(v){toast('Здесь будет ролик – вы подключите его после переноса')}
});
function add(i){cart[i]=(cart[i]||0)+1;render();closeAll();toast('Набор «'+products[i].name+'» в корзине')}
function openProduct(i,src){const p=products[i];$('#mTitle').textContent=p.name;$('#mParts').textContent=p.parts;$('#mDesc').textContent=p.desc;$('#mPrice').textContent=fmt(p.price);
  $('#mPic').innerHTML=src.innerHTML;$('#mAdd').onclick=()=>add(i);overlay.classList.add('on');modal.classList.add('on')}
$('#checkout').onclick=()=>toast('В демо оформление выключено – в Тильде здесь будет форма заказа');
render();

// mobile menu
const burger=$('#burger'),mnav=$('#mnav');
burger.onclick=()=>{const on=mnav.classList.toggle('on');burger.setAttribute('aria-expanded',on)};
mnav.addEventListener('click',e=>{if(e.target.tagName==='A'){mnav.classList.remove('on');burger.setAttribute('aria-expanded',false)}});

// collection filter (phone: 4 cards, desktop: 6)
$$('.tab').forEach(t=>t.onclick=()=>{
  $$('.tab').forEach(x=>x.setAttribute('aria-pressed',x===t));
  const f=t.dataset.f;
  $$('.fig').forEach(c=>{c.hidden=!(f==='all'||c.dataset.c.split(' ').includes(f));c.classList.toggle('lim',f==='all'&&[...c.parentNode.children].indexOf(c)>3)});
});

// sticky CTA: visible after hero, hidden in sets block
const mcta=$('#mcta'),heroBtn=$('#hero .btn'),sets=$('#sets');
const upd=()=>{const pastHero=heroBtn.getBoundingClientRect().bottom<0,s=sets.getBoundingClientRect(),inSets=s.top<innerHeight*.7&&s.bottom>0;
  const on=pastHero&&!inSets;mcta.classList.toggle('on',on);document.body.classList.toggle('cta-on',on&&innerWidth<=900)};
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();

// demo: heading font variants
// on the phone only the active variant is shown – a tap switches to the next one
const fbtn=$$('.fonts button');
fbtn.forEach((b,i)=>b.onclick=()=>{const t=innerWidth<=900?fbtn[(i+1)%3]:b;document.documentElement.dataset.hf=t.dataset.hf;fbtn.forEach(x=>x.setAttribute('aria-pressed',x===t))});
