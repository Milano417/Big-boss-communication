'use strict';
const L = require('./_lib');
const reply = (res, status, code, message) => L.send(res, status, { ok: false, code, message });

/* Toutes les actions de l'administrateur passent par ici : connexion, produits, coordonnées, import, photos. */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST' || !req.headers['x-requested-with']) return reply(res, 405, 'method', 'Requête refusée.');
  const b = req.body && typeof req.body === 'object' ? req.body : {}, action = String(b.action || '');
  try {
    if (action === 'login') {
      if (L.adminPassword() && L.adminPassword().length < 10) return reply(res, 503, 'config', 'ADMIN_PASSWORD est trop court (10 caractères minimum) : corrigez-le ou supprimez-le dans les variables d\'environnement.');
      if (await L.tooManyAttempts(req)) return reply(res, 429, 'rate', 'Trop de tentatives. Réessayez dans 15 minutes.');
      if (!L.passwordOk(b.password)) return reply(res, 401, 'bad-login', 'Mot de passe incorrect.');
      L.setSession(req, res, true); return L.send(res, 200, { ok: true });
    }
    if (action === 'logout') { L.setSession(req, res, false); return L.send(res, 200, { ok: true }); }
    if (!L.isAdmin(req)) return reply(res, 401, 'unauthorized', 'Session expirée. Reconnectez-vous.');

    if (action === 'me') return L.send(res, 200, { ok: true });

    if (action === 'saveProduct') {
      const p = L.cleanProduct(b.product); if (!p) return reply(res, 400, 'invalid', 'Fiche produit invalide.');
      if ((await L.redis(['HLEN', 'bb:products'])) === 0) return reply(res, 409, 'no-catalog', 'Importez d\'abord le catalogue initial (onglet Sauvegarde).');
      const prev = await L.redis(['HGET', 'bb:products', p.id]); await L.redis(['HSET', 'bb:products', p.id, JSON.stringify(p)]);
      try { const o = prev && JSON.parse(prev).image; if (o && o.startsWith('/api/img?id=') && o !== p.image) await L.redis(['DEL', 'bb:img:' + o.split('=')[1]]); } catch (e) { /* nettoyage facultatif */ }
      return L.send(res, 200, { ok: true });
    }
    if (action === 'deleteProduct') {
      const id = String(b.id || ''); if (!L.ID_RE.test(id)) return reply(res, 400, 'invalid', 'Identifiant invalide.');
      const prev = await L.redis(['HGET', 'bb:products', id]); await L.redis(['HDEL', 'bb:products', id]);
      try { const o = prev && JSON.parse(prev).image; if (o && o.startsWith('/api/img?id=')) await L.redis(['DEL', 'bb:img:' + o.split('=')[1]]); } catch (e) { /* facultatif */ }
      return L.send(res, 200, { ok: true });
    }
    if (action === 'saveConfig') {
      const c = L.cleanConfig(b.config); if (!c || c.error) return reply(res, 400, 'invalid', (c && c.error) || 'Coordonnées invalides.');
      await L.redis(['SET', 'bb:config', JSON.stringify(c)]); return L.send(res, 200, { ok: true });
    }
    if (action === 'import' || action === 'reset') {
      const list = Array.isArray(b.products) ? b.products.slice(0, 400).map(L.cleanProduct) : [];
      if (!list.length || list.some((x) => !x)) return reply(res, 400, 'invalid', 'Fichier de produits invalide.');
      if (action === 'reset') await L.redis(['DEL', 'bb:products']); // remplace tout : les anciens produits disparaissent
      const args = []; list.forEach((p) => args.push(p.id, JSON.stringify(p)));
      for (let i = 0; i < args.length; i += 100) await L.redis(['HSET', 'bb:products', ...args.slice(i, i + 100)]);
      return L.send(res, 200, { ok: true, count: list.length });
    }
    if (action === 'uploadImage') {
      const id = String(b.id || ''), d = String(b.dataUrl || '');
      if (!L.ID_RE.test(id) || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(d) || d.length > 420000) return reply(res, 400, 'invalid', 'Image invalide ou trop lourde.');
      const imgId = id + '-' + Date.now().toString(36); await L.redis(['SET', 'bb:img:' + imgId, d]);
      return L.send(res, 200, { ok: true, url: '/api/img?id=' + imgId });
    }
    return reply(res, 400, 'action', 'Action inconnue.');
  } catch (e) { return reply(res, e.code === 'no-db' ? 503 : 500, e.code || 'error', e.code === 'no-db' ? 'La base de données n\'est pas connectée (voir le guide).' : 'Erreur du serveur. Réessayez.'); }
};
