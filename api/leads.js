import nodemailer from 'nodemailer';

/**
 * Vercel Serverless Function — Réception, Persistance Cloud & Notification en temps réel des prospects Himalaya
 * Route : GET / POST /api/leads
 *
 * Variables d'environnement supportées sur Vercel (optionnelles) :
 * - RESEND_API_KEY          : Clé API Resend (https://resend.com) pour envoi courriel transactionnel HTML
 * - RESEND_FROM_EMAIL       : Expéditeur Resend vérifié (défaut : Portail Himalaya <notifications@himalayacorp.com>)
 * - SMTP_HOST               : Hôte SMTP (ex. smtp.office365.com, smtp.gmail.com, mail.himalayacorp.com)
 * - SMTP_PORT               : Port SMTP (défaut : 587)
 * - SMTP_SECURE             : 'true' pour TLS implicite (port 465), 'false' pour STARTTLS (défaut : true si port 465)
 * - SMTP_USER               : Utilisateur / courriel SMTP
 * - SMTP_PASS               : Mot de passe ou mot de passe d'application SMTP
 * - SMTP_FROM               : Expéditeur SMTP (défaut : SMTP_USER)
 * - LEAD_NOTIFICATION_EMAIL : Courriel de copie optionnel ajouté en plus des courtiers attitrés (par défaut aucun ; info@himalayacorp.com en repli s'il n'y a aucun courtier attitré)
 * - CRM_WEBHOOK_URL         : URL Webhook CRM (défaut : https://himalaya-prospection.vercel.app/api/cloud-sync)
 */

const DEFAULT_AGENCY_EMAIL = 'info@himalayacorp.com';
const DEFAULT_CRM_WEBHOOK = 'https://himalaya-prospection.vercel.app/api/cloud-sync';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const edgeLeadsStore = (globalThis.__himalayaEdgeLeads = globalThis.__himalayaEdgeLeads || []);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHeader(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_PATTERN.test(value.trim());
}

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function buildRecipients(lead, agencyEmailSetting = process.env.LEAD_NOTIFICATION_EMAIL) {
  const candidates = [];
  if (Array.isArray(lead?.broker_emails)) {
    candidates.push(...lead.broker_emails);
  }
  if (lead?.broker_email) {
    candidates.push(lead.broker_email);
  }

  const agencySetting = agencyEmailSetting ? String(agencyEmailSetting).trim() : '';
  if (agencySetting && agencySetting.toLowerCase() !== 'none' && agencySetting.toLowerCase() !== 'false') {
    candidates.push(...agencySetting.split(/[,;]/));
  }

  const seen = new Set();
  const recipients = [];
  for (const raw of candidates) {
    if (!isValidEmail(raw)) continue;
    const addr = raw.trim();
    const key = addr.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      recipients.push(addr);
    }
  }

  if (recipients.length === 0) {
    recipients.push(DEFAULT_AGENCY_EMAIL);
  }
  return recipients;
}

function formatQuebecTimestamp(isoTimestamp) {
  try {
    return new Date(isoTimestamp).toLocaleString('fr-CA', {
      timeZone: 'America/Toronto',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return String(isoTimestamp);
  }
}

function buildEmailSubject(leadData) {
  if (leadData.subject) {
    return sanitizeHeader(`[Prospect Himalaya] ${leadData.subject} — ${leadData.fullName}`);
  }
  const mlsSuffix = leadData.mlsNumber ? ` (#${leadData.mlsNumber})` : '';
  return sanitizeHeader(`[Prospect Himalaya] ${leadData.sourceLabel} — ${leadData.fullName}${mlsSuffix}`);
}

function buildEmailText(leadData) {
  const lines = [
    'IMMOBILIER HIMALAYA REAL ESTATE CORP. — NOUVEAU PROSPECT WEB',
    `Identifiant : ${leadData.leadId}`,
    `Source : ${leadData.sourceLabel}`,
    `Nom complet : ${leadData.fullName}`,
    `Courriel : ${leadData.email}`,
    `Téléphone : ${leadData.phone}`
  ];
  if (leadData.city) lines.push(`Secteur / Ville : ${leadData.city}`);
  if (leadData.franchiseName) lines.push(`Franchise / Bannière : ${leadData.franchiseName}`);
  lines.push(`Courtier(s) attitré(s) : ${leadData.broker}`);
  if (leadData.propertyTitle || leadData.mlsNumber) {
    lines.push(`Dossier / Propriété : ${leadData.propertyTitle || ''} ${leadData.mlsNumber ? `(Centris #${leadData.mlsNumber})` : ''}`.trim());
  }
  if (leadData.message) {
    lines.push('', 'Détails :', leadData.message);
  }
  lines.push('', `Reçu le ${formatQuebecTimestamp(leadData.timestamp)}`);
  return lines.join('\n');
}

function buildEmailHtml(leadData) {
  const safeEmail = escapeHtml(leadData.email);
  const safePhone = escapeHtml(leadData.phone);
  const emailCell = isValidEmail(leadData.email)
    ? `<a href="mailto:${safeEmail}" style="color: #e3c485;">${safeEmail}</a>`
    : `<span style="color: #e4e4ea;">${safeEmail}</span>`;
  const phoneDigits = String(leadData.phone || '').replace(/[^\d+]/g, '');
  const phoneCell = phoneDigits
    ? `<a href="tel:${escapeHtml(phoneDigits)}" style="color: #e3c485;">${safePhone}</a>`
    : `<span style="color: #e4e4ea;">${safePhone}</span>`;

  const optionalRows = [];
  if (leadData.city) {
    optionalRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #8a8a94;">Secteur / Ville :</td>
        <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(leadData.city)}</td>
      </tr>`);
  }
  if (leadData.franchiseName) {
    optionalRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #8a8a94;">Franchise / Bannière :</td>
        <td style="padding: 8px 0; color: #c8a45d; font-weight: 600;">${escapeHtml(leadData.franchiseName)}</td>
      </tr>`);
  }
  if (leadData.propertyTitle || leadData.mlsNumber) {
    const propertyText = `${leadData.propertyTitle || ''} ${leadData.mlsNumber ? `(Centris #${leadData.mlsNumber})` : ''}`.trim();
    optionalRows.push(`
      <tr>
        <td style="padding: 8px 0; color: #8a8a94;">Dossier / Propriété :</td>
        <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(propertyText)}</td>
      </tr>`);
  }

  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #09090b; color: #ffffff; border: 1px solid #c8a45d; border-radius: 8px; overflow: hidden;">
      <div style="background: #121215; padding: 20px 24px; border-bottom: 1px solid rgba(200,164,93,0.35);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #c8a45d; font-weight: 700;">
          IMMOBILIER HIMALAYA REAL ESTATE CORP. &bull; NOUVEAU PROSPECT WEB
        </div>
        <h2 style="margin: 6px 0 0; font-size: 20px; color: #ffffff;">
          ${escapeHtml(leadData.sourceLabel)} &mdash; ${escapeHtml(leadData.fullName)}
        </h2>
      </div>
      <div style="padding: 24px; font-size: 14px; line-height: 1.6; color: #e4e4ea;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
          <tr>
            <td style="padding: 8px 0; color: #8a8a94; width: 38%;">Identifiant :</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${escapeHtml(leadData.leadId)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8a8a94;">Nom complet :</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${escapeHtml(leadData.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8a8a94;">Courriel :</td>
            <td style="padding: 8px 0;">${emailCell}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8a8a94;">Téléphone :</td>
            <td style="padding: 8px 0;">${phoneCell}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8a8a94;">Courtier(s) attitré(s) :</td>
            <td style="padding: 8px 0; color: #c8a45d; font-weight: 600;">${escapeHtml(leadData.broker)}</td>
          </tr>
          ${optionalRows.join('')}
        </table>
        ${
          leadData.message
            ? `<div style="background: #151519; border-left: 3px solid #c8a45d; padding: 14px 16px; border-radius: 4px; margin-top: 12px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #c8a45d; font-weight: 700; margin-bottom: 6px;">Détails &amp; Demande :</div>
                <div style="white-space: pre-line; color: #c4c4cc;">${escapeHtml(leadData.message)}</div>
              </div>`
            : ''
        }
      </div>
      <div style="background: #050506; padding: 14px 24px; font-size: 12px; color: #8a8a94; border-top: 1px solid rgba(255,255,255,0.08);">
        Reçu le ${escapeHtml(formatQuebecTimestamp(leadData.timestamp))} &bull; Portail Web Immobilier Himalaya 2.0
      </div>
    </div>
  `;
}

async function sendViaResend({ to, replyTo, subject, html, text }) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return null;

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Portail Himalaya <notifications@himalayacorp.com>',
        to,
        reply_to: replyTo,
        subject,
        html,
        text
      })
    });
    if (emailRes.ok) {
      return { ok: true, provider: 'resend' };
    }
    const errText = await emailRes.text().catch(() => '');
    return {
      ok: false,
      provider: 'resend',
      error: `Resend HTTP ${emailRes.status}${errText ? `: ${errText.slice(0, 200)}` : ''}`
    };
  } catch (err) {
    return {
      ok: false,
      provider: 'resend',
      error: err?.message || 'Resend request failed'
    };
  }
}

async function sendViaSmtp({ to, replyTo, subject, html, text }) {
  if (!isSmtpConfigured()) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : port === 465;
  const user = process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.RESEND_FROM_EMAIL || `Portail Himalaya <${user}>`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      auth: {
        user,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from,
      to: to.join(', '),
      replyTo,
      subject,
      text,
      html
    });

    return { ok: true, provider: 'smtp' };
  } catch (err) {
    return {
      ok: false,
      provider: 'smtp',
      error: err?.message || 'SMTP send failed'
    };
  }
}

async function dispatchEmailNotification(mailPayload) {
  const transports = [sendViaResend, sendViaSmtp];
  let lastResult = null;

  for (const sendFn of transports) {
    const attempt = await sendFn(mailPayload);
    if (!attempt) continue;
    lastResult = attempt;
    if (attempt.ok) {
      return { sent: true, provider: attempt.provider, error: null };
    }
  }

  if (!lastResult) {
    return {
      sent: false,
      provider: 'none',
      error: 'Aucun fournisseur courriel configuré sur Vercel (RESEND_API_KEY ou SMTP_HOST/SMTP_USER/SMTP_PASS).'
    };
  }

  return { sent: false, provider: lastResult.provider, error: lastResult.error };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const resendReady = Boolean(process.env.RESEND_API_KEY);
    const smtpReady = isSmtpConfigured();

    return res.status(200).json({
      status: 'ok',
      service: 'Himalaya Website 2.0 — Lead Dispatch & Cloud Sync Gateway',
      channels: {
        resend_email: resendReady,
        smtp_email: smtpReady,
        email_ready: resendReady || smtpReady,
        crm_cloud_bridge: true,
        stored_leads_count: edgeLeadsStore.length
      },
      leads: edgeLeadsStore.slice(0, 100)
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
    const city = lead.city || null;
    const franchiseName = lead.franchise_name || null;
    const broker = lead.assigned_broker || lead.broker || 'Direction Himalaya (Montréal)';
    const propertyTitle = lead.property_title || lead.deal_title || null;
    const mlsNumber = lead.mls_number || lead.centris_number || null;
    const message = lead.message || lead.notes || '';
    const recipients = buildRecipients(lead);

    const normalizedLead = {
      ...lead,
      id: leadId,
      created_at: timestamp,
      source: sourceLabel,
      name: fullName,
      email,
      phone,
      city,
      franchise_name: franchiseName,
      assigned_broker: broker,
      broker_emails: recipients,
      property_title: propertyTitle,
      mls_number: mlsNumber,
      message,
      origin: 'himalaya-website-vercel'
    };

    const existingIdx = edgeLeadsStore.findIndex((l) => l.id === leadId);
    if (existingIdx !== -1) {
      edgeLeadsStore[existingIdx] = normalizedLead;
    } else {
      edgeLeadsStore.unshift(normalizedLead);
      if (edgeLeadsStore.length > 200) edgeLeadsStore.length = 200;
    }

    const deliveryResults = {
      lead_id: leadId,
      timestamp,
      email_sent: false,
      email_provider: 'none',
      email_recipients: recipients,
      email_error: null,
      webhook_forwarded: false
    };

    // 1. Pont automatique vers Himalaya Prospection Cloud (et tout webhook configuré)
    const webhookUrl =
      process.env.CRM_WEBHOOK_URL ||
      process.env.PROSPECTION_REMOTE_URL ||
      DEFAULT_CRM_WEBHOOK;

    try {
      const whRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ingest_web_lead',
          lead: normalizedLead
        })
      });
      deliveryResults.webhook_forwarded = whRes.ok;
    } catch {
      deliveryResults.webhook_forwarded = false;
    }

    // 2. Notification courriel HTML aux courtiers attitrés (+ copie agence) via Resend ou SMTP
    const mailData = {
      leadId,
      timestamp,
      sourceLabel,
      subject: lead.subject || null,
      fullName,
      email,
      phone,
      city,
      franchiseName,
      broker,
      propertyTitle,
      mlsNumber,
      message
    };

    const emailOutcome = await dispatchEmailNotification({
      to: recipients,
      replyTo: isValidEmail(email) ? sanitizeHeader(email) : undefined,
      subject: buildEmailSubject(mailData),
      html: buildEmailHtml(mailData),
      text: buildEmailText(mailData)
    });

    deliveryResults.email_sent = emailOutcome.sent;
    deliveryResults.email_provider = emailOutcome.provider;
    deliveryResults.email_error = emailOutcome.error;

    return res.status(200).json({
      ok: true,
      ...deliveryResults
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err.message || 'Invalid payload'
    });
  }
}
