/* =====================================================================
   Site Parcours IA Filière Bois — serveur statique + capture de leads
   Kosmio × Xylofutur

   Sert les fichiers du site et expose un unique point d'entrée POST
   /api/lead qui parle à Brevo côté serveur. La clé API reste dans la
   variable d'environnement et n'est jamais envoyée au navigateur.

   Variables d'environnement :
     BREVO_API_KEY   obligatoire
     BREVO_LIST_ID   optionnel, 17 par défaut
     SITE_URL        optionnel, https://ia-automatisation.kosm.io par défaut
     NOTIFY_EMAIL    optionnel, mathieu@kosm.io par défaut
     PORT            optionnel, 80 par défaut
   ===================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 80);
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID || 17);
const SITE_URL = (process.env.SITE_URL || 'https://ia-automatisation.kosm.io').replace(/\/$/, '');
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'mathieu@kosm.io';
const SENDER = { name: 'Mathieu Pesin - Kosmio', email: 'mathieu@kosm.io' };

const MAX_BODY = 64 * 1024;
const RATE_MAX = 10;
const RATE_WINDOW = 10 * 60 * 1000;

/* ---------- Fichiers jamais servis ---------- */
const DENY = [/^\/config\.js$/i, /^\/server\.js$/i, /^\/Dockerfile$/i, /(^|\/)\.git(\/|$)/i, /(^|\/)\./];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

/* ---------- Utilitaires ---------- */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function clean(s, max) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max || 200);
}
function validEmail(e) {
  return typeof e === 'string' && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function log() {
  console.log('[' + new Date().toISOString() + ']', Array.prototype.join.call(arguments, ' '));
}

/* ---------- Limitation de débit, en mémoire ---------- */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > RATE_WINDOW) { hits.set(ip, { start: now, n: 1 }); return false; }
  rec.n += 1;
  if (hits.size > 5000) hits.clear();
  return rec.n > RATE_MAX;
}

/* ---------- Brevo ---------- */
async function brevo(pathname, method, payload) {
  const r = await fetch('https://api.brevo.com/v3' + pathname, {
    method: method,
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', 'accept': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined
  });
  const text = r.ok ? '' : await r.text().catch(function () { return ''; });
  return { ok: r.ok || r.status === 204, status: r.status, text: text };
}

async function upsertContact(email, attributes) {
  let r = await brevo('/contacts', 'POST', {
    email: email, attributes: attributes, listIds: [BREVO_LIST_ID], updateEnabled: true
  });
  if (r.ok) return true;

  /* Attribut personnalisé inexistant côté Brevo : on retente au strict nécessaire */
  if (r.status === 400 && /attribute/i.test(r.text) && !/already exist/i.test(r.text)) {
    log('Brevo attributs refusés, repli sur FIRSTNAME/SOURCE :', r.text.slice(0, 200));
    r = await brevo('/contacts', 'POST', {
      email: email,
      attributes: { FIRSTNAME: attributes.FIRSTNAME, SOURCE: attributes.SOURCE },
      listIds: [BREVO_LIST_ID], updateEnabled: true
    });
    if (r.ok) return true;
  }

  if (r.status === 400 && /already exist/i.test(r.text)) {
    const u = await brevo('/contacts/' + encodeURIComponent(email), 'PUT', {
      attributes: { FIRSTNAME: attributes.FIRSTNAME, SOURCE: attributes.SOURCE },
      listIds: [BREVO_LIST_ID]
    });
    if (u.ok) return true;
    log('Brevo PUT échec', u.status, u.text.slice(0, 200));
    return false;
  }

  log('Brevo contact échec', r.status, r.text.slice(0, 200));
  return false;
}

/* Un sujet et un nom d'affichage ne sont pas du HTML : on retire simplement
   les chevrons pour qu'aucune saisie ne ressemble à du balisage. */
function plain(s) {
  return String(s == null ? '' : s).replace(/[<>]/g, '').slice(0, 200);
}

async function sendMail(to, toName, subject, html, tags, replyTo) {
  const body = {
    sender: SENDER,
    to: [{ email: to, name: plain(toName) || to }],
    subject: plain(subject),
    htmlContent: html,
    tags: tags || []
  };
  if (replyTo) body.replyTo = { email: replyTo.email, name: plain(replyTo.name) };
  const r = await brevo('/smtp/email', 'POST', body);
  if (!r.ok) log('Brevo mail échec', r.status, r.text.slice(0, 200));
  return r.ok;
}

/* ---------- Composition des emails ---------- */
function wrap(inner) {
  return '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1F2D3D;max-width:640px;">' +
    inner +
    '<hr style="border:none;border-top:1px solid #C9BFB1;margin:28px 0;">' +
    '<p style="font-size:13px;color:#5D6C73;">Mathieu Pesin · Kosmio × Xylofutur<br>Accompagnement IA filière bois · ' +
    '<a href="mailto:mathieu@kosm.io" style="color:#5D6C73;">mathieu@kosm.io</a></p>' +
    '<p style="font-size:11px;color:#999;">Vous recevez ce message à la suite de votre demande sur ' + esc(SITE_URL) +
    '. <a href="mailto:mathieu@kosm.io?subject=Desabonnement" style="color:#999;">Se désabonner</a>.</p>' +
    '</div>';
}

function etudeHtml(firstname) {
  return wrap(
    '<div style="background:#00B194;padding:24px 32px;border-radius:8px;">' +
    '<h1 style="color:#fff;font-size:22px;margin:0;">Votre étude est prête</h1></div>' +
    '<p>Bonjour ' + esc(firstname) + ',</p>' +
    '<p>Merci pour votre intérêt. Voici les ressources promises :</p>' +
    '<p style="margin:24px 0;"><a href="' + esc(SITE_URL) + '/Articles/bonus-dirigeant-etude-01.pdf" ' +
    'style="display:inline-block;background:#00B194;color:#fff;padding:14px 28px;border-radius:4px;text-decoration:none;font-weight:600;">' +
    'Télécharger le PDF et le bonus dirigeant →</a></p>' +
    '<p>Vous pouvez aussi <a href="' + esc(SITE_URL) + '/Articles/article_ia_filiere_bois_v3.html" style="color:#009982;">lire l\'étude en ligne</a>.</p>' +
    '<p>Si vous souhaitez en discuter, je vous propose un échange de 30 minutes, sans engagement : ' +
    '<a href="https://cal.com/kosmio/ia-automatisation" style="color:#009982;font-weight:600;">réserver un créneau →</a></p>'
  );
}

function recoHtml(firstname, res) {
  const why = (res.reasons || []).map(function (t) {
    return '<li style="margin-bottom:8px;">' + esc(t) + '</li>';
  }).join('');
  return wrap(
    '<p>Bonjour ' + esc(firstname) + ',</p>' +
    '<p>Voici la synthèse de votre diagnostic, tel que vous venez de le remplir sur le site.</p>' +
    '<h2 style="font-size:18px;margin:24px 0 8px;">Notre recommandation : ' + esc(res.topName) + '</h2>' +
    '<p style="color:#5D6C73;margin:0 0 12px;">' + esc(res.topTag) + '</p>' +
    (why ? '<ul style="padding-left:18px;margin:0 0 16px;">' + why + '</ul>' : '') +
    '<p><strong>Budget indicatif :</strong> ' + esc(res.topBudget) + '</p>' +
    '<p><strong>Les deux autres options étudiées :</strong> ' + esc(res.altNames) + '. Elles ne sont pas de mauvais outils, ' +
    'elles répondent moins bien à votre situation précise.</p>' +
    '<h2 style="font-size:18px;margin:28px 0 8px;">Le temps en jeu</h2>' +
    '<p>Avec un simple abonnement bien utilisé, de l\'ordre de <strong>' + esc(res.gainAbo) + ' heures par mois</strong> ' +
    'pour votre entreprise. En automatisant réellement les processus concernés, de l\'ordre de ' +
    '<strong>' + esc(res.gainAuto) + ' heures par mois</strong>. Ce sont des ordres de grandeur issus de nos interventions ' +
    'dans la filière, à confirmer en regardant vos processus réels.</p>' +
    '<h2 style="font-size:18px;margin:28px 0 8px;">Les trois conditions à réunir</h2>' +
    '<ol style="padding-left:18px;">' +
    '<li style="margin-bottom:8px;">Vérifier ce que vous payez déjà. Une partie des fonctions est peut-être incluse dans votre abonnement bureautique actuel.</li>' +
    '<li style="margin-bottom:8px;">Commencer petit et en mensuel résiliable, avec deux ou trois personnes volontaires, avant tout engagement annuel.</li>' +
    '<li style="margin-bottom:8px;">Poser une règle écrite d\'une page : ce qu\'on confie à l\'outil, ce qu\'on ne lui confie jamais, qui relit avant envoi.</li>' +
    '</ol>' +
    '<p style="margin-top:28px;">Le choix de l\'outil compte moins que ce que vous allez en faire. Si vous voulez qu\'on regarde ensemble ' +
    'lesquels de vos processus méritent d\'être automatisés, mon agenda est ouvert : ' +
    '<a href="https://cal.com/kosmio/ia-automatisation" style="color:#009982;font-weight:600;">cal.com/kosmio/ia-automatisation</a></p>'
  );
}

function notifyHtml(kind, firstname, email, company, res) {
  let rows = '';
  if (res && Array.isArray(res.answers)) {
    rows = res.answers.map(function (a) {
      return '<tr>' +
        '<td style="padding:6px 10px;border-bottom:1px solid #eee;color:#5D6C73;width:55%;">' + esc(a.q) + '</td>' +
        '<td style="padding:6px 10px;border-bottom:1px solid #eee;"><strong>' + esc(a.a || 'non renseigné') + '</strong></td>' +
        '</tr>';
    }).join('');
  }
  return '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1F2D3D;">' +
    '<p><strong>' + esc(firstname) + '</strong> (' + esc(email) + ')' + (company ? ' · ' + esc(company) : '') + '</p>' +
    '<p>Origine : ' + esc(kind) + '</p>' +
    (res ? '<p>Recommandation : <strong>' + esc(res.topName) + '</strong><br>' +
      'Autres options : ' + esc(res.altNames) + '<br>' +
      'Gain estimé : ' + esc(res.gainAbo) + ' h/mois avec abonnement, ' + esc(res.gainAuto) + ' h/mois automatisé.</p>' +
      '<h3 style="font-size:15px;">Réponses</h3><table style="border-collapse:collapse;font-size:13px;width:100%;">' + rows + '</table>'
      : '') +
    '</div>';
}

/* ---------- Point d'entrée capture ---------- */
async function handleLead(req, res, ip) {
  if (!BREVO_API_KEY) {
    log('BREVO_API_KEY absente');
    return json(res, 503, { error: 'service indisponible' });
  }
  if (rateLimited(ip)) return json(res, 429, { error: 'trop de demandes' });

  let raw = '';
  let done = false;
  req.on('data', function (c) {
    if (done) return;
    raw += c;
    if (raw.length > MAX_BODY) {
      done = true;
      json(res, 413, { error: 'requete trop volumineuse' });
      req.destroy();
    }
  });

  req.on('end', async function () {
    if (done) return;
    done = true;

    let body;
    try { body = JSON.parse(raw || '{}'); } catch (e) { return json(res, 400, { error: 'json invalide' }); }

    const firstname = clean(body.firstname, 80);
    const email = clean(body.email, 254);
    const company = clean(body.company, 120);
    const kind = body.kind === 'choix-ia' ? 'choix-ia' : 'etude';

    if (!firstname || !validEmail(email)) return json(res, 400, { error: 'prenom ou email invalide' });

    /* Données de résultat, nettoyées et bornées */
    let result = null;
    if (kind === 'choix-ia' && body.result && typeof body.result === 'object') {
      const r = body.result;
      result = {
        topName: clean(r.topName, 80),
        topTag: clean(r.topTag, 160),
        topBudget: clean(r.topBudget, 300),
        altNames: clean(r.altNames, 160),
        gainAbo: String(Math.max(0, Math.min(9999, Number(r.gainAbo) || 0))),
        gainAuto: String(Math.max(0, Math.min(9999, Number(r.gainAuto) || 0))),
        reasons: Array.isArray(r.reasons) ? r.reasons.slice(0, 5).map(function (t) { return clean(t, 400); }) : [],
        answers: Array.isArray(r.answers) ? r.answers.slice(0, 20).map(function (a) {
          return { q: clean(a && a.q, 200), a: clean(a && a.a, 300) };
        }) : []
      };
      if (!result.topName) result = null;
    }

    try {
      const attrs = {
        FIRSTNAME: firstname,
        SOURCE: kind === 'choix-ia' ? 'outil-choix-ia' : 'site-public-lead-magnet'
      };
      if (company) attrs.COMPANY = company;
      if (result) {
        attrs.RECO = result.topName;
        attrs.UTM = ('reco=' + result.topName + '; gain=' + result.gainAbo + 'h').slice(0, 250);
      }

      const stored = await upsertContact(email, attrs);

      /* La notification interne part en premier : même si l'envoi au prospect
         échoue, le lead ne doit jamais être perdu. */
      let notified, sent;
      if (kind === 'choix-ia' && result) {
        notified = await sendMail(NOTIFY_EMAIL, 'Mathieu Pesin',
          'Nouveau diagnostic IA · ' + (company || firstname) + ' · ' + result.topName,
          notifyHtml('outil choix IA', firstname, email, company, result),
          ['outil-choix-ia', 'notification'], { email: email, name: firstname });
        sent = await sendMail(email, firstname, 'Votre recommandation : ' + result.topName,
          recoHtml(firstname, result), ['outil-choix-ia', 'lead-magnet']);
      } else {
        notified = await sendMail(NOTIFY_EMAIL, 'Mathieu Pesin',
          'Nouvelle demande d\'étude · ' + (company || firstname),
          notifyHtml('étude PDF', firstname, email, company, null),
          ['etude-01', 'notification'], { email: email, name: firstname });
        sent = await sendMail(email, firstname, firstname + ', votre étude IA et filière bois est prête',
          etudeHtml(firstname), ['etude-01', 'lead-magnet']);
      }

      log('lead', kind, email,
        'contact=' + (stored ? 'ok' : 'echec'),
        'notif=' + (notified ? 'ok' : 'echec'),
        'envoi=' + (sent ? 'ok' : 'echec'));

      /* Ce qui est promis au visiteur, c'est de recevoir le document.
         Si l'envoi a échoué, on le dit plutôt que d'afficher un faux succès. */
      if (!sent) return json(res, 502, { error: 'envoi impossible' });
      return json(res, 200, { ok: true });
    } catch (err) {
      log('erreur lead', err && err.message);
      return json(res, 502, { error: 'envoi impossible' });
    }
  });
}

function json(res, code, obj) {
  const b = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(b) });
  res.end(b);
}

/* ---------- Fichiers statiques ---------- */
function serveStatic(req, res, pathname) {
  for (const rx of DENY) {
    if (rx.test(pathname)) { res.writeHead(404); return res.end('Not found'); }
  }

  let rel = decodeURIComponent(pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) {
    res.writeHead(403); return res.end('Forbidden');
  }

  fs.stat(file, function (err, st) {
    if (err || !st.isFile()) {
      const notFound = path.join(ROOT, '404.html');
      return fs.readFile(notFound, function (e2, buf) {
        if (e2) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Page introuvable'); }
        res.writeHead(404, { 'Content-Type': MIME['.html'] }); res.end(buf);
      });
    }
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const cache = /\.(css|js|svg|png|jpe?g|webp|woff2?|ico|mp4|vtt)$/i.test(file)
      ? 'public, max-age=86400'
      : 'no-cache';
    /* Lecture partielle (Range) : indispensable pour la vidéo sur Safari et pour se déplacer dans la timeline */
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (m && (m[1] || m[2])) {
      let start = m[1] ? parseInt(m[1], 10) : st.size - parseInt(m[2], 10);
      let end = m[1] && m[2] ? parseInt(m[2], 10) : st.size - 1;
      if (start < 0) start = 0;
      if (end >= st.size) end = st.size - 1;
      if (start > end || start >= st.size) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + st.size }); return res.end();
      }
      res.writeHead(206, { 'Content-Type': type, 'Cache-Control': cache, 'Accept-Ranges': 'bytes',
        'Content-Range': 'bytes ' + start + '-' + end + '/' + st.size, 'Content-Length': end - start + 1 });
      return fs.createReadStream(file, { start: start, end: end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache, 'Accept-Ranges': 'bytes', 'Content-Length': st.size });
    fs.createReadStream(file).pipe(res);
  });
}

/* ---------- Serveur ---------- */
const server = http.createServer(function (req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'inconnu';

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (pathname === '/api/lead') {
    if (req.method === 'POST') return handleLead(req, res, ip);
    res.writeHead(405); return res.end('Method not allowed');
  }
  if (pathname === '/api/health') {
    /* Sans parametre : reponse immediate, utilisee par le healthcheck Docker.
       Avec ?check=brevo : interroge Brevo pour savoir si la cle est acceptee.
       Aucune valeur de cle n'est renvoyee, seulement le verdict de Brevo. */
    if (url.searchParams.get('check') !== 'brevo') {
      return json(res, 200, { ok: true, brevo: Boolean(BREVO_API_KEY) });
    }
    if (!BREVO_API_KEY) return json(res, 200, { ok: true, cle: 'absente' });
    return brevo('/account', 'GET', null).then(function (r) {
      let detail = '';
      try { detail = JSON.parse(r.text || '{}').message || ''; } catch (e) { detail = ''; }
      json(res, 200, {
        ok: true,
        cle: 'presente (' + BREVO_API_KEY.length + ' caracteres)',
        brevoStatus: r.status,
        brevoAccepte: r.ok,
        brevoMessage: detail.slice(0, 200)
      });
    }).catch(function (e) {
      json(res, 200, { ok: true, cle: 'presente', erreurReseau: String(e && e.message).slice(0, 200) });
    });
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end('Method not allowed'); }
  serveStatic(req, res, pathname);
});

server.listen(PORT, function () {
  log('site en ecoute sur le port ' + PORT + ', Brevo ' + (BREVO_API_KEY ? 'configure' : 'NON CONFIGURE'));
});
