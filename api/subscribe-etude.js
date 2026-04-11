// ============================================================
// Kosmio × Xylofutur — Lead capture Étude #01
// Fonction serverless (Vercel compatible)
//
// Formulaire : prénom + email uniquement
// → Crée/met à jour le contact dans Brevo (liste 17)
// → Déclenche l'envoi transactionnel si template configuré
//
// Variables d'environnement à définir dans Vercel :
//   BREVO_API_KEY           (xkeysib-...)
//   BREVO_TEMPLATE_J0_ID    (optionnel — ID du template transactionnel)
// ============================================================

const BREVO_ETUDE_LIST_ID     = 17;
const BREVO_SENDER_EMAIL      = 'mathieu@kosm.io';
const BREVO_SENDER_NAME       = 'Mathieu Pesin — Kosmio';

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { firstname, email, newsletter, source, utm } = body;

    // --- Validation ---
    if (!email || !firstname) {
      return res.status(400).json({ error: 'Prénom et email sont obligatoires' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const { BREVO_API_KEY, BREVO_TEMPLATE_J0_ID } = process.env;

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY manquant dans les variables d\'environnement');
      return res.status(500).json({ error: 'Configuration serveur incomplète' });
    }

    const listIds = [BREVO_ETUDE_LIST_ID];

    // --- 1. Créer/mettre à jour le contact dans Brevo ---
    const contactPayload = {
      email,
      attributes: {
        FIRSTNAME: firstname,
        SOURCE:    source || 'site-public',
        UTM:       utm || '',
      },
      listIds,
      updateEnabled: true,
    };

    const contactResp = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key':      BREVO_API_KEY,
        'Content-Type': 'application/json',
        'accept':       'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    if (!contactResp.ok && contactResp.status !== 204) {
      const errText = await contactResp.text();
      // Brevo retourne 400 si le contact existe déjà — on tente un PUT
      if (contactResp.status === 400 && errText.includes('already exist')) {
        const updateResp = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'api-key':      BREVO_API_KEY,
            'Content-Type': 'application/json',
            'accept':       'application/json',
          },
          body: JSON.stringify({
            attributes: { FIRSTNAME: firstname, SOURCE: source || 'site-public', UTM: utm || '' },
            listIds,
          }),
        });
        if (!updateResp.ok && updateResp.status !== 204) {
          console.error('Brevo update error:', updateResp.status, await updateResp.text());
          return res.status(502).json({ error: 'Impossible de mettre à jour le contact' });
        }
      } else {
        console.error('Brevo contact error:', contactResp.status, errText);
        return res.status(502).json({ error: 'Impossible d\'enregistrer le contact' });
      }
    }

    // --- 2. Envoi transactionnel J+0 (PDF + bonus) ---
    if (BREVO_TEMPLATE_J0_ID) {
      const txResp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key':      BREVO_API_KEY,
          'Content-Type': 'application/json',
          'accept':       'application/json',
        },
        body: JSON.stringify({
          to: [{ email, name: firstname }],
          templateId: Number(BREVO_TEMPLATE_J0_ID),
          params: { firstname },
          sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
          tags: ['etude-01', 'j0', 'lead-magnet'],
        }),
      });
      if (!txResp.ok) {
        console.warn('Brevo transac email warning:', txResp.status, await txResp.text());
        // On ne bloque pas : l'automation Brevo peut prendre le relais
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe-etude fatal:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
