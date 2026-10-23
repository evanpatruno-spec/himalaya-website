/**
 * Vercel Serverless Function — Réception & Notification en temps réel des prospects Himalaya
 * Route : POST /api/leads
 *
 * Variables d'environnement supportées sur Vercel (optionnelles) :
 * - RESEND_API_KEY          : Clé API Resend (https://resend.com) pour envoi courriel transactionnel HTML
 * - LEAD_NOTIFICATION_EMAIL : Courriel de réception principal (défaut : info@himalayacorp.com)
 * - CRM_WEBHOOK_URL         : URL Webhook externe (Himalaya Prospection Cloud, Zoho, Make, Zapier)
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'Himalaya Website 2.0 — Lead Dispatch Gateway',
      channels: {
        resend_email: Boolean(process.env.RESEND_API_KEY),
        crm_webhook: Boolean(process.env.CRM_WEBHOOK_URL)
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const lead = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const timestamp = lead.created_at || new Date().toISOString();
    const leadId = lead.id || `WEB-${Date.now()}`;
    const sourceLabel = lead.source || lead.type || 'Portail Web Himalaya';
    const fullName = lead.name || lead.fullName || 'Visiteur Web';
    const email = lead.email || 'Non renseigné';
    const phone = lead.phone || 'Non renseigné';
    const broker = lead.assigned_broker || lead.broker || 'Direction Himalaya (Montréal)';
    const brokerEmail = lead.broker_email || null;
    const propertyTitle = lead.property_title || lead.deal_title || null;
    const mlsNumber = lead.mls_number || lead.centris_number || null;
    const message = lead.message || lead.notes || '';

    const deliveryResults = {
      lead_id: leadId,
      timestamp,
      email_sent: false,
      webhook_forwarded: false
    };

    // 1. Envoi vers Webhook CRM externe (Himalaya Prospection Cloud / Zoho / Make / Zapier)
    const webhookUrl = process.env.CRM_WEBHOOK_URL || process.env.PROSPECTION_REMOTE_URL;
    if (webhookUrl) {
      try {
        const whRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...lead,
            id: leadId,
            created_at: timestamp,
            origin: 'himalaya-website-vercel'
          })
        });
        deliveryResults.webhook_forwarded = whRes.ok;
      } catch {
        deliveryResults.webhook_forwarded = false;
      }
    }

    // 2. Envoi de notification courriel HTML via Resend API (si RESEND_API_KEY configurée)
    const resendKey = process.env.RESEND_API_KEY;
    const targetEmail = process.env.LEAD_NOTIFICATION_EMAIL || 'info@himalayacorp.com';

    if (resendKey) {
      const recipients = [targetEmail];
      if (brokerEmail && brokerEmail.includes('@') && !recipients.includes(brokerEmail)) {
        recipients.push(brokerEmail);
      }

      const htmlBody = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #09090b; color: #ffffff; border: 1px solid #c8a45d; border-radius: 8px; overflow: hidden;">
          <div style="background: #121215; padding: 20px 24px; border-bottom: 1px solid rgba(200,164,93,0.35);">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #c8a45d; font-weight: 700;">
              IMMOBILIER HIMALAYA REAL ESTATE CORP. • NOUVEAU PROSPECT WEB
            </div>
            <h2 style="margin: 6px 0 0; font-size: 20px; color: #ffffff;">
              ${sourceLabel} — ${fullName}
            </h2>
          </div>
          <div style="padding: 24px; font-size: 14px; line-height: 1.6; color: #e4e4ea;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
              <tr>
                <td style="padding: 8px 0; color: #8a8a94; width: 38%;">Identifiant :</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${leadId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a8a94;">Nom complet :</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a8a94;">Courriel :</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #e3c485;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a8a94;">Téléphone :</td>
                <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #e3c485;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a8a94;">Courtier assigné :</td>
                <td style="padding: 8px 0; color: #c8a45d; font-weight: 600;">${broker}</td>
              </tr>
              ${
                propertyTitle || mlsNumber
                  ? `<tr>
                      <td style="padding: 8px 0; color: #8a8a94;">Dossier / Propriété :</td>
                      <td style="padding: 8px 0; color: #ffffff;">${propertyTitle || ''} ${mlsNumber ? `(Centris #${mlsNumber})` : ''}</td>
                    </tr>`
                  : ''
              }
            </table>
            ${
              message
                ? `<div style="background: #151519; border-left: 3px solid #c8a45d; padding: 14px 16px; border-radius: 4px; margin-top: 12px;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #c8a45d; font-weight: 700; margin-bottom: 6px;">Détails & Simulation :</div>
                    <div style="white-space: pre-line; color: #c4c4cc;">${message}</div>
                  </div>`
                : ''
            }
          </div>
          <div style="background: #050506; padding: 14px 24px; font-size: 12px; color: #8a8a94; border-top: 1px solid rgba(255,255,255,0.08);">
            Reçu le ${new Date(timestamp).toLocaleString('fr-CA')} • Portail Web Immobilier Himalaya 2.0
          </div>
        </div>
      `;

      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Immobilier Himalaya <onboarding@resend.dev>',
            to: recipients,
            reply_to: email && email.includes('@') ? email : undefined,
            subject: `[Himalaya Web] ${sourceLabel} — ${fullName}${mlsNumber ? ` (#${mlsNumber})` : ''}`,
            html: htmlBody
          })
        });
        deliveryResults.email_sent = emailRes.ok;
      } catch {
        deliveryResults.email_sent = false;
      }
    }

    return res.status(200).json({
      ok: true,
      ...deliveryResults
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err?.message || 'Invalid lead payload'
    });
  }
}
