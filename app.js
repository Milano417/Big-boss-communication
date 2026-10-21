/* ---------- état + stockage ---------- */
const $ = (id) => document.getElementById(id);
const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
const ALL = DEF_PRODUCTS.concat(EXTRA_PRODUCTS);
const cache = load('bb_cache_v2', null);
let products = cache && cache.products && cache.products.length ? cache.products : ALL;
let config = { ...DEF_CONFIG, ...((cache && cache.config) || {}) };
let cart = load('bb_cart_v2', []);
let tab = 'accueil', cat = 'all', promoOnly = false, creditOnly = false, brand = 'all', series = 'all';
let simId = '', simN = 0, scrollTo = '';
const imgOf = (p) => p.image || 'images/produits/' + p.id + '.jpg';
const isPhone = (p) => p.category === 'smartphones';
const avail = (p) => p.inStock !== false && p.stockCount !== 0;
function ph(el) {
  el.onerror = null; const p = products.find((x) => x.id === el.dataset.id) || {}; const b = BRANDS.find((x) => x.match === p.brand) || { label: p.brand || 'Big Boss', color: '#2a2630' };
  const n = (p.name || '').replace(/^(Apple|Samsung|Infinix|Tecno|itel|Oraimo) /i, '').slice(0, 28);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='#f1ede6'/><rect x='140' y='70' width='120' height='230' rx='22' fill='${b.color}'/><rect x='150' y='84' width='100' height='190' rx='12' fill='#fff' opacity='.16'/><circle cx='200' cy='287' r='5' fill='#fff' opacity='.5'/><text x='200' y='345' text-anchor='middle' font-family='Arial' font-weight='700' font-size='24' fill='#121014'>${esc(b.label)}</text><text x='200' y='374' text-anchor='middle' font-family='Arial' font-size='17' fill='#6b6570'>${esc(n)}</text></svg>`;
  el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const fcfa = (n) => Number(n || 0).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' F';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wa = (txt) => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(txt)}`;
let tt; const toast = (m) => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200); };
const icons = (root) => root.querySelectorAll('.ui').forEach((e) => { const n = e.textContent.replace('ICON:', '').trim(); if (ICONS[n]) e.outerHTML = ic(n, 20); });

/* ---------- crédit ---------- */
const numOr = (v, d) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) && n >= 0 ? n : d; };
function CR() {
  const du = String(config.creditDurees || '').split(/[,;\s]+/).map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 36);
  return { ap: Math.min(numOr(config.creditApport, 30), 100), fr: numOr(config.creditFrais, 0), du: du.length ? [...new Set(du)].sort((a, b) => a - b) : [3, 6],
    br: String(config.creditMarques || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) };
}
const canCredit = (p) => !!p && isPhone(p) && p.price >= 20000 && CR().br.includes(String(p.brand).toLowerCase());
const up = (n, step) => Math.ceil(n / step) * step;
function plan(p, n) {
  const c = CR(), apport = up(p.price * c.ap / 100, 500), total = Math.round(p.price * (1 + c.fr / 100)), reste = Math.max(total - apport, 0);
  return { apport, total, reste, mens: up(reste / n, 100), n };
}
const fromMonthly = (p) => plan(p, CR().du[CR().du.length - 1]).mens;
const creditList = () => products.filter((p) => canCredit(p) && avail(p)).sort((a, b) => a.brand.localeCompare(b.brand) || a.price - b.price);
const brandsTxt = () => { const b = CR().br.map((x) => (BRANDS.find((y) => y.match.toLowerCase() === x) || { label: x }).label); return b.length > 1 ? b.slice(0, -1).join(', ') + ' ou ' + b[b.length - 1] : b[0] || ''; };

function drawSim() {
  const l = creditList(), c = CR();
  if (!l.some((p) => p.id === simId)) simId = (l.find((p) => p.isPopular) || l[0] || {}).id || '';
  if (!c.du.includes(simN)) simN = c.du[c.du.length - 1];
  const opts = l.map((p) => `<option value="${esc(p.id)}" ${p.id === simId ? 'selected' : ''}>${esc(p.name)} · ${fcfa(p.price)}</option>`).join('');
  $('simP').innerHTML = opts || '<option value="">Aucun téléphone éligible pour le moment</option>';
  $('cfP').innerHTML = opts || '<option value="">Aucun téléphone éligible</option>';
  $('simD').innerHTML = c.du.map((n) => `<button type="button" class="${n === simN ? 'on' : ''}" onclick="setN(${n})">${n} mois</button>`).join('');
  $('cfN').innerHTML = c.du.map((n) => `<option value="${n}" ${n === simN ? 'selected' : ''}>${n} mois</option>`).join('');
  const p = l.find((x) => x.id === simId);
  if (!p) { ['sPrice', 'sApport', 'sReste', 'sMens'].forEach((k) => { $(k).textContent = '—'; }); $('sN').textContent = ''; $('cfRecap').innerHTML = ''; return; }
  const r = plan(p, simN);
  $('sPrice').textContent = fcfa(p.price); $('sApport').textContent = fcfa(r.apport); $('sReste').textContent = fcfa(r.reste);
  $('sMens').textContent = fcfa(r.mens); $('sN').textContent = ` × ${simN} mois`;
  $('sFine').textContent = 'Simulation indicative' + (c.fr > 0 ? `, frais de ${c.fr} % inclus` : '') + '. Les conditions exactes sont confirmées par notre conseiller.';
  $('cfRecap').innerHTML = `<span>Apport <b>${fcfa(r.apport)}</b></span><span>puis <b>${fcfa(r.mens)}</b> × ${simN} mois</span>`;
}
function setN(n) { simN = n; drawSim(); }
function creditAsk() { if (tab !== 'credit') { scrollTo = 'creditForm'; go('credit'); } else $('creditForm').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function openCredit(id) { simId = id; closeAll(); scrollTo = 'simBox'; if (tab === 'credit') { drawSim(); $('simBox').scrollIntoView({ behavior: 'smooth', block: 'center' }); } else go('credit'); }

/* ---------- navigation ---------- */
function go(t) { if (location.hash.slice(1) === t) route(); else location.hash = t; }
function route() {
  tab = location.hash.slice(1); if (!TABS.some((x) => x[0] === tab)) tab = 'accueil';
  document.querySelectorAll('[data-tabs]').forEach((s) => { s.hidden = !s.dataset.tabs.split(' ').includes(tab); });
  document.querySelectorAll('#nav button,.tabbar button[data-t]').forEach((b) => b.classList.toggle('on', b.dataset.t === tab));
  closeAll();
  const mn = $('main'); mn.classList.remove('fade'); void mn.offsetWidth; mn.classList.add('fade');
  promoOnly = tab === 'promotions';
  if (tab === 'boutique' && cat !== 'smartphones') cat = 'smartphones';
  if (tab === 'accessoires' && (cat === 'smartphones' || cat === 'all')) cat = 'acc';
  if (tab === 'promotions') cat = 'all';
  if (tab !== 'boutique') creditOnly = false;
  drawCatalog(); drawSim();
  const target = scrollTo && $(scrollTo); scrollTo = '';
  if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: target.id === 'simBox' ? 'center' : 'start' }), 60); else window.scrollTo({ top: 0 });
}
function closeAnn() { $('ann').hidden = true; clearInterval(annT); }

/* ---------- cartes produit ---------- */
function stockTxt(p) { if (!avail(p)) return '<span class="stock out">Rupture</span>'; return p.stockCount <= 5 ? `<span class="stock low">Plus que ${p.stockCount}</span>` : '<span class="stock">En stock</span>'; }
function card(p) {
  const out = !avail(p), cr = canCredit(p) && !out;
  return `<article class="pc rv"><button class="pim" onclick="openProduct('${p.id}')" aria-label="Voir ${esc(p.name)}">
    <img src="${esc(imgOf(p))}" data-id="${p.id}" onerror="ph(this)" alt="" loading="lazy">
    <span class="tags">${p.isPromo && p.originalPrice > p.price ? `<i class="t-promo">-${Math.round((1 - p.price / p.originalPrice) * 100)} %</i>` : ''}${p.isNew ? '<i class="t-new">Nouveau</i>' : ''}${cr ? '<i class="t-cr">Crédit</i>' : ''}</span></button>
    <div class="pbd"><p class="pbr">${esc(p.brand)}${p.series ? ' · ' + esc(p.series) : ''}</p><h3><button onclick="openProduct('${p.id}')">${esc(p.name)}</button></h3>
    <p class="ppr"><b>${fcfa(p.price)}</b>${p.originalPrice > p.price ? `<s>${fcfa(p.originalPrice)}</s>` : ''}</p>
    ${cr ? `<p class="pcr">ou <b>${fcfa(fromMonthly(p))}</b>/mois</p>` : ''}
    <div class="pft">${stockTxt(p)}<span class="pact">${cr ? `<button class="crb" onclick="openCredit('${p.id}')">À crédit</button>` : ''}<button class="addb" ${out ? 'disabled' : ''} onclick="addCart('${p.id}')" aria-label="Ajouter ${esc(p.name)} au panier">${ic('plus', 18)}</button></span></div></div></article>`;
}
const fill = (id, list, empty) => { $(id).innerHTML = list.length ? list.map(card).join('') : `<div class="empty">${empty}</div>`; };

const HEAD = {
  boutique: ['Boutique', 'Nos téléphones', 'Tecno, Infinix, itel, Samsung et iPhone : originaux, scellés et garantis.'],
  accessoires: ['Boutique', 'Accessoires de téléphone', 'Chargeurs, écouteurs, coques, power banks : tout pour votre téléphone.'],
  promotions: ['Promotions', 'Les bonnes affaires', 'Prix barrés sur une sélection de téléphones et d\'accessoires.']
};
function drawCatalog() {
  fill('popular', products.filter((p) => p.isPopular && isPhone(p)).slice(0, 8), 'Aucun téléphone populaire.');
  fill('accGrid', products.filter((p) => p.isPopular && !isPhone(p)).slice(0, 4), 'Aucun accessoire pour le moment.');
  fill('promoGrid', products.filter((p) => p.isPromo).slice(0, 4), 'Aucune promotion en cours.');
  const phones = products.filter(isPhone), cnt = (b) => phones.filter((p) => p.brand === b.match).length;
  const pb = BRANDS.filter((b) => cnt(b) > 0);
  const bb = (b, on, home) => `<button class="bl rv ${on ? 'on' : ''}" onclick="setBrand('${b.id}')${home ? ";go('boutique')" : ''}" aria-label="${esc(b.label)}"><img src="images/brands/${b.id}.png" alt="${esc(b.label)}" onerror="this.replaceWith(Object.assign(document.createElement('strong'),{textContent:this.alt}))"><em>${cnt(b)} modèles${CR().br.includes(b.match.toLowerCase()) ? ' · <u>crédit</u>' : ''}</em></button>`;
  $('homeBrands').innerHTML = pb.map((b) => bb(b, false, true)).join('');

  const h = HEAD[tab] || HEAD.boutique; $('catKick').textContent = h[0]; $('catTitle').textContent = h[1]; $('catSub').textContent = h[2];
  const phoneMode = tab === 'boutique', accMode = tab === 'accessoires';
  $('brands').hidden = !phoneMode;
  $('brands').innerHTML = phoneMode ? `<button class="bl rv ${brand === 'all' ? 'on' : ''}" onclick="setBrand('all')"><strong>Toutes</strong><em>${phones.length} modèles</em></button>` + pb.map((b) => bb(b, brand === b.id, false)).join('') : '';
  const cb = phoneMode ? BRANDS.find((b) => b.id === brand) : null, sl = cb ? [...new Set(phones.filter((p) => p.brand === cb.match).map((p) => p.series).filter(Boolean))] : [];
  $('series').innerHTML = sl.length > 1 ? ['all'].concat(sl).map((s) => `<button class="${series === s ? 'on' : ''}" onclick="setSeries(this.dataset.s)" data-s="${esc(s)}">${s === 'all' ? 'Toutes les séries' : esc(s)}</button>`).join('') : '';
  const accCats = CATS.filter((c) => c.id !== 'smartphones');
  $('chips').innerHTML = phoneMode ? `<button class="${creditOnly ? 'on' : ''}" onclick="creditOnly=!creditOnly;drawCatalog()">${ic('card', 16)} Disponibles à crédit</button>`
    : accMode ? [['acc', 'Tous les accessoires']].concat(accCats.map((c) => [c.id, c.name])).map(([id, n]) => `<button class="${cat === id ? 'on' : ''}" onclick="setCat('${id}')">${esc(n)}</button>`).join('') : '';

  const q = $('q').value.trim().toLowerCase(), s = $('sort').value;
  let l = products.filter((p) => (cat === 'all' || (cat === 'acc' ? !isPhone(p) : p.category === cat)) && (!cb || p.brand === cb.match) && (series === 'all' || p.series === series)
    && (!promoOnly || p.isPromo) && (!creditOnly || canCredit(p)) && (!q || (p.name + ' ' + p.brand + ' ' + (p.series || '')).toLowerCase().includes(q)));
  if (s === 'asc') l.sort((a, b) => a.price - b.price); else if (s === 'desc') l.sort((a, b) => b.price - a.price); else l.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  $('count').textContent = l.length + ' article' + (l.length > 1 ? 's' : '');
  fill('catalogGrid', l, 'Aucun produit ne correspond. Essayez une autre recherche.');
  $('cats').innerHTML = accCats.map((c) => `<button class="cat rv" onclick="setCat('${c.id}');go('accessoires')"><span class="cic">${c.icon}</span><span><b>${esc(c.name)}</b><small>${products.filter((p) => p.category === c.id).length} article(s)</small></span></button>`).join('');
  reveal();
}
function setCat(id) { cat = id; drawCatalog(); }
function setBrand(id) { brand = id; series = 'all'; if (tab === 'boutique') drawCatalog(); }
function setSeries(s) { series = s; drawCatalog(); }

/* ---------- fiche produit ---------- */
function openProduct(id) {
  const p = products.find((x) => x.id === id); if (!p) return;
  const out = !avail(p), cr = canCredit(p) && !out, r = cr ? plan(p, CR().du[CR().du.length - 1]) : null;
  $('mbox').innerHTML = `<button class="x" onclick="closeAll()" aria-label="Fermer">✕</button><div class="mim"><img src="${esc(imgOf(p))}" data-id="${p.id}" onerror="ph(this)" alt="${esc(p.name)}"></div>
  <div class="min"><p class="pbr">${esc(p.brand)}${p.series ? ' · ' + esc(p.series) : ''}</p><h2>${esc(p.name)}</h2>
  <p class="ppr big"><b>${fcfa(p.price)}</b>${p.originalPrice > p.price ? `<s>${fcfa(p.originalPrice)}</s>` : ''} ${stockTxt(p)}</p>
  ${cr ? `<div class="crbox"><div><small>À crédit</small><b>${fcfa(r.apport)}</b> d'apport, puis <b>${fcfa(r.mens)}</b> × ${r.n} mois</div><button class="btn sm" onclick="openCredit('${p.id}')">Simuler mon crédit</button></div>` : ''}
  <p class="desc">${esc(p.description)}</p>
  <table class="sp">${Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}<tr><td>Garantie</td><td>${esc(p.warranty)}</td></tr></table>
  <div class="macts"><button class="btn" ${out ? 'disabled' : ''} onclick="addCart('${p.id}');closeAll();openCart()">Ajouter au panier</button>
  <a class="btn wa" target="_blank" rel="noopener" href="${wa(`Bonjour, je suis intéressé par : ${p.name} (${fcfa(p.price)}). Est-il disponible ?`)}">${ic('chat', 18)} WhatsApp</a></div></div>`;
  $('modal').classList.add('show'); $('ov').classList.add('show');
}

/* ---------- panier ---------- */
const saveCart = () => { save('bb_cart_v2', cart); drawCart(); };
function addCart(id) { const it = cart.find((c) => c.id === id); if (it) it.q++; else cart.push({ id, q: 1 }); saveCart(); toast('Ajouté au panier'); bump(); }
function qty(id, d) { const it = cart.find((c) => c.id === id); if (!it) return; it.q += d; if (it.q <= 0) cart = cart.filter((c) => c.id !== id); saveCart(); }
const lines = () => cart.map((c) => ({ p: products.find((x) => x.id === c.id), q: c.q })).filter((l) => l.p);
const total = () => lines().reduce((s, l) => s + l.p.price * l.q, 0);
function drawCart() {
  const ls = lines(), n = ls.reduce((s, l) => s + l.q, 0); $('cartCount').textContent = n; $('cartCount2').textContent = n;
  $('cartBody').innerHTML = ls.length ? ls.map((l) => `<div class="line"><img src="${esc(imgOf(l.p))}" data-id="${l.p.id}" onerror="ph(this)" alt=""><div><b>${esc(l.p.name)}</b><br>${fcfa(l.p.price)}<div class="qty"><button onclick="qty('${l.p.id}',-1)" aria-label="Moins">−</button><span>${l.q}</span><button onclick="qty('${l.p.id}',1)" aria-label="Plus">+</button></div></div><b>${fcfa(l.p.price * l.q)}</b></div>`).join('') : '<div class="empty">Votre panier est vide.<br>Ajoutez un téléphone ou un accessoire depuis la boutique.</div>';
  const crs = ls.filter((l) => canCredit(l.p));
  $('cartFoot').innerHTML = ls.length ? `<div class="tot"><span>Total comptant</span><span>${fcfa(total())}</span></div>
  ${crs.length ? `<button class="crlink" onclick="openCredit('${crs[0].p.id}')">${ic('card', 18)} Prendre le ${esc(crs[0].p.name)} à crédit plutôt ?</button>` : ''}
  <form class="f" id="orderForm"><div class="two"><label>Nom complet<input name="n" required autocomplete="name"></label><label>Téléphone<input name="t" type="tel" required autocomplete="tel"></label></div>
  <div class="two"><label>Réception<select name="d"><option value="boutique">Retrait en boutique</option><option value="livraison">Livraison</option></select></label><label>Quartier<input name="q" placeholder="Pour la livraison"></label></div>
  <label>Notes (modèle pour coque ou verre…)<input name="o"></label>
  <button class="btn wa wide" type="submit">${ic('chat', 18)} Commander sur WhatsApp</button></form>` : '';
  const f = $('orderForm'); if (f) f.onsubmit = (e) => {
    e.preventDefault(); const d = new FormData(f);
    const msg = `Bonjour ${config.storeName}, je souhaite commander :\n` + ls.map((l) => `• ${l.q} x ${l.p.name} — ${fcfa(l.p.price * l.q)}`).join('\n') + `\n\nTotal : ${fcfa(total())}\nNom : ${d.get('n')}\nTéléphone : ${d.get('t')}\nRéception : ${d.get('d') === 'livraison' ? 'Livraison — quartier : ' + (d.get('q') || 'à préciser') : 'Retrait en boutique'}` + (d.get('o') ? `\nNotes : ${d.get('o')}` : '');
    window.open(wa(msg), '_blank', 'noopener');
  };
}
function openCart() { $('drawer').classList.add('show'); $('ov').classList.add('show'); }
function closeAll() { $('drawer').classList.remove('show'); $('modal').classList.remove('show'); $('ov').classList.remove('show'); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

/* ---------- textes dépendants de la config ---------- */
let annT, annI = 0;
function drawConfig() {
  const c = CR(), tel = config.primaryPhone.replace(/\s/g, '');
  $('ann').hidden = !config.showAnnouncement;
  const ms = [config.announcementBanner, `${brandsTxt()} à crédit : ${c.ap} % d'apport seulement`, 'Livraison rapide ou retrait en boutique', 'Paiement Wave, Orange Money, MTN MoMo et Moov Money'].filter(Boolean);
  clearInterval(annT); annI = 0; $('annTxt').textContent = ms[0];
  if (config.showAnnouncement && ms.length > 1) annT = setInterval(() => { const t = $('annTxt'); t.classList.add('out'); setTimeout(() => { annI = (annI + 1) % ms.length; t.textContent = ms[annI]; t.classList.remove('out'); }, 350); }, 4500);
  $('annTel').href = 'tel:' + tel; $('annTel').innerHTML = ic('phone', 14) + ' ' + esc(config.primaryPhone);
  $('fwa').href = wa('Bonjour, j\'ai une question sur vos produits.');
  $('hApport').textContent = c.ap + ' %'; $('hDuree').textContent = c.du[c.du.length - 1] + ' mois';
  const l = creditList(); $('hFrom').textContent = l.length ? fcfa(Math.min(...l.map(fromMonthly))) : '—';
  $('cBrands').textContent = brandsTxt(); document.querySelectorAll('.cAp').forEach((e) => { e.textContent = c.ap + ' %'; });
  $('faqBrands').textContent = `Les téléphones ${brandsTxt()} en stock, marqués « Crédit » dans la boutique. L'apport minimum est de ${c.ap} % du prix, et le reste se paie en ${c.du.join(', ')} mois au choix.`;
  $('docs').innerHTML = String(config.creditPieces || '').split(';').map((s) => s.trim()).filter(Boolean).map((s) => `<li>${ic('check', 18)}<span>${esc(s)}</span></li>`).join('');
  $('mapBtn').href = config.googleMapsUrl;
  $('fTag').textContent = config.tagline + '. Téléphones originaux, accessoires et crédit en Côte d\'Ivoire.';
  $('fHours').innerHTML = `${esc(config.openingHoursWeek)}<br>${esc(config.openingHoursSunday)}`;
  $('fContact').innerHTML = `<a href="tel:${tel}">${esc(config.primaryPhone)}</a><br><a href="tel:${config.secondaryPhone.replace(/\s/g, '')}">${esc(config.secondaryPhone)}</a><br>${esc(config.address)}, ${esc(config.city)}`;
  $('ci').innerHTML = `<div>${ic('pin', 20)}<span><b>Adresse</b>${esc(config.address)}, ${esc(config.city)}</span></div><div>${ic('clock', 20)}<span><b>Horaires</b>${esc(config.openingHoursWeek)}<br>${esc(config.openingHoursSunday)}</span></div>
    <a href="tel:${tel}">${ic('phone', 20)}<span><b>Appeler</b>${esc(config.primaryPhone)} · ${esc(config.secondaryPhone)}</span></a><a target="_blank" rel="noopener" href="${wa('Bonjour !')}">${ic('chat', 20)}<span><b>WhatsApp</b>Réponse rapide</span></a>`;
}

/* ---------- init ---------- */
$('nav').firstElementChild.innerHTML = TABS.map(([t, l]) => `<button data-t="${t}" onclick="go('${t}')" ${t === 'credit' ? 'class="hot"' : ''}>${l}</button>`).join('');
$('reviews').innerHTML = REVIEWS.map((r) => `<figure class="rev rv"><div class="stars" aria-label="5 étoiles sur 5">★★★★★</div><blockquote>${esc(r[1])}</blockquote><figcaption><b>${esc(r[0])}</b><span>${esc(r[2])}</span></figcaption></figure>`).join('');
$('yr').textContent = new Date().getFullYear();
$('fNav').innerHTML = TABS.map(([t, l]) => `<li><button onclick="go('${t}')">${l}</button></li>`).join('');
icons(document);
$('q').addEventListener('input', drawCatalog); $('sort').addEventListener('change', drawCatalog);
$('hs').addEventListener('submit', (e) => {
  e.preventDefault(); const v = $('hq').value.trim(), m = products.filter((p) => (p.name + ' ' + p.brand + ' ' + (p.series || '')).toLowerCase().includes(v.toLowerCase()));
  $('q').value = v; brand = 'all'; series = 'all'; creditOnly = false;
  if (m.length && m.every((p) => !isPhone(p))) { cat = 'acc'; go('accessoires'); } else go('boutique');
});
$('simP').addEventListener('change', (e) => { simId = e.target.value; drawSim(); });
$('cfP').addEventListener('change', (e) => { simId = e.target.value; drawSim(); });
$('cfN').addEventListener('change', (e) => { simN = Number(e.target.value); drawSim(); });
$('creditForm').addEventListener('submit', (e) => {
  e.preventDefault(); const d = new FormData(e.target), p = products.find((x) => x.id === d.get('p'));
  if (!p) { toast('Choisissez un téléphone éligible.'); return; }
  const r = plan(p, Number(d.get('n')) || simN);
  window.open(wa(`Bonjour ${config.storeName}, je souhaite acheter à crédit :\n• ${p.name} — ${fcfa(p.price)}\n• Apport : ${fcfa(r.apport)}\n• Puis ${fcfa(r.mens)} × ${r.n} mois (simulation du site)\n\nNom : ${d.get('nom')}\nTéléphone : ${d.get('tel')}\nCommune / quartier : ${d.get('lieu')}` + (d.get('job') ? `\nActivité : ${d.get('job')}` : '') + '\n\nQuand puis-je passer avec mes pièces ?'), '_blank', 'noopener');
});
$('contactForm').addEventListener('submit', (e) => { e.preventDefault(); const d = new FormData(e.target); window.open(wa(`Bonjour, je suis ${d.get('n')} (${d.get('t')}).\n${d.get('m')}`), '_blank', 'noopener'); });
window.addEventListener('hashchange', route);
document.querySelectorAll('.sec .kick,.sec h2,.sh .sub,.usp .wrap>div,.afig figure,.card-f,.info>*,.steps li,.sim,.docs,.faq').forEach((e) => e.classList.add('rv'));
const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; const el = e.target, i = [...el.parentElement.children].indexOf(el);
  el.style.transitionDelay = Math.min(i, 7) * 60 + 'ms'; el.classList.add('in'); io.unobserve(el);
  setTimeout(() => { el.style.transitionDelay = ''; el.classList.add('done'); }, 1000);
}), { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }) : null;
function reveal() { document.querySelectorAll('.rv:not(.in)').forEach((el) => (io ? io.observe(el) : el.classList.add('in', 'done'))); }
function bump() { ['cartCount', 'cartCount2'].forEach((id) => { const b = $(id); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }); }
window.addEventListener('scroll', () => { $('top').classList.toggle('sc', window.scrollY > 30); }, { passive: true });
drawConfig(); drawCart(); route();
/* ---------- données en ligne : le site public lit seulement ---------- */
function applyRemote(r) {
  if (!r) return; if (r.products && r.products.length) products = r.products; if (r.config) config = { ...DEF_CONFIG, ...r.config };
  save('bb_cache_v2', { products, config, v: r.v }); drawConfig(); drawCatalog(); drawSim(); drawCart();
}
function bootStore() { window.Store.loadAll().then(applyRemote).catch(() => { }); }
if (window.Store) bootStore(); else window.addEventListener('store-ready', bootStore, { once: true });
