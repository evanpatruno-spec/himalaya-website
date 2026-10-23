const PROSPECTION_API_BASE = 'http://localhost:8000';
const LEADS_STORAGE_KEY = 'himalaya_website_synced_leads';
const NDA_STORAGE_KEY = 'himalaya_website_signed_ndas';
const BROKER_TOKEN_KEY = 'himalaya_website_broker_jwt';

export { PROSPECTION_API_BASE };

/**
 * Normalise un texte pour une recherche insensible aux accents et à la casse
 */
export function normalizeText(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Vérifie si un mandat appartient à un courtier donné (incluant co-inscriptions dans brokers_details)
 */
export function dealBelongsToBroker(deal, brokerName) {
  if (!deal || !brokerName || brokerName === 'all') return true;
  const target = normalizeText(brokerName);
  const targetParts = target.split(/\s+/).filter(Boolean);
  const lastName = targetParts[targetParts.length - 1] || target;

  const assigned = normalizeText(deal.assigned_broker);
  if (assigned && (assigned.includes(target) || assigned.includes(lastName))) {
    return true;
  }

  if (Array.isArray(deal.brokers_details)) {
    return deal.brokers_details.some(b => {
      const bn = normalizeText(b.name);
      return bn.includes(target) || bn.includes(lastName);
    });
  }
  return false;
}

/**
 * Vérifie si le NDA a été signé pour un mandat donné durant la session
 */
export function isNdaSignedForDeal(mlsNumber) {
  try {
    const raw = localStorage.getItem(NDA_STORAGE_KEY);
    if (!raw) return false;
    const list = JSON.parse(raw);
    return list.includes('ALL') || (mlsNumber && list.includes(String(mlsNumber)));
  } catch {
    return false;
  }
}

export function markNdaSigned(mlsNumber) {
  try {
    const raw = localStorage.getItem(NDA_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const key = mlsNumber ? String(mlsNumber) : 'ALL';
    if (!list.includes(key)) list.push(key);
    localStorage.setItem(NDA_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

/**
 * Récupère tous les prospects capturés sur le site web
 */
export function getStoredWebLeads() {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Vérifie en direct la connexion avec le backend FastAPI Himalaya Prospection (#17)
 */
export async function fetchCrmConnectionStatus() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${PROSPECTION_API_BASE}/api/public/crm-status`, {
      signal: controller.signal
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        ...data
      };
    }
  } catch {
    // Backend local non démarré
  }
  return {
    online: false,
    crm_connected: false,
    centris_api_ready: true,
    metrics: null
  };
}

/**
 * Envoie un prospect (NDA, Contact, Évaluation vendeur, Investisseur International ou Simulation Chiffrier)
 * directement vers Himalaya Prospection CRM via /api/public/web-lead (#17)
 */
export async function submitLeadToProspection(leadData) {
  const entry = {
    id: `WEB-${Date.now()}`,
    created_at: new Date().toISOString(),
    synced_to_crm: false,
    ...leadData
  };

  // 1. Sauvegarde immédiate locale (consultable dans Zone Équipe)
  const existing = getStoredWebLeads();
  existing.unshift(entry);
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing.slice(0, 150)));
  } catch {
    // ignore
  }

  // 2. Envoi vers la passerelle Serverless Vercel (/api/leads) pour notification courriel & webhook cloud
  try {
    const cloudRes = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json().catch(() => ({}));
      entry.cloud_dispatched = true;
      entry.email_sent = Boolean(cloudData.email_sent);
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing.slice(0, 150)));
    }
  } catch {
    // En mode dev local pur sans Vercel CLI, on continue vers le backend FastAPI
  }

  // 3. Synchronisation directe avec le serveur Himalaya Prospection (/api/public/web-lead)
  try {
    const res = await fetch(`${PROSPECTION_API_BASE}/api/public/web-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });

    if (res.ok) {
      const data = await res.json();
      entry.synced_to_crm = true;
      entry.crm_contact_id = data.contact_id || null;
      entry.crm_buyer_lead_id = data.buyer_lead_id || null;
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing.slice(0, 150)));
    }
  } catch {
    // Si le backend local n'est pas lancé, la sauvegarde locale reste en file d'attente
  }

  return entry;
}

/**
 * Génère un lien mailto: pré-rempli pour transférer ou répondre à un prospect en 1 clic
 */
export function buildLeadMailtoUrl(lead, targetEmail = 'info@himalayacorp.com') {
  if (!lead) return `mailto:${targetEmail}`;
  const subject = `[Prospect Himalaya] ${lead.source || 'Portail Web'} — ${lead.name || 'Client'}${lead.mls_number ? ` (Centris #${lead.mls_number})` : ''}`;
  const bodyLines = [
    `Identifiant : ${lead.id || ''}`,
    `Date : ${lead.created_at ? new Date(lead.created_at).toLocaleString('fr-CA') : ''}`,
    `Source : ${lead.source || 'Portail Web'}`,
    `Nom : ${lead.name || ''}`,
    `Courriel : ${lead.email || ''}`,
    `Téléphone : ${lead.phone || ''}`,
    `Courtier assigné : ${lead.assigned_broker || 'Direction Himalaya'}`,
    lead.property_title ? `Propriété : ${lead.property_title} (${lead.mls_number || ''})` : '',
    '',
    'Détails / Message :',
    lead.message || lead.notes || ''
  ].filter(Boolean);

  return `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
}

/**
 * Exporte la liste des prospects capturés en fichier CSV téléchargeable
 */
export function exportStoredLeadsToCsv() {
  const leads = getStoredWebLeads();
  if (!leads.length) return false;

  const headers = ['ID', 'Date', 'Source', 'Nom', 'Courriel', 'Telephone', 'Courtier', 'MLS_Centris', 'Propriete', 'Synced_CRM', 'Message'];
  const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;

  const rows = leads.map((l) =>
    [
      l.id,
      l.created_at,
      l.source || l.type || '',
      l.name || '',
      l.email || '',
      l.phone || '',
      l.assigned_broker || '',
      l.mls_number || '',
      l.property_title || '',
      l.synced_to_crm ? 'OUI' : 'EN_ATTENTE',
      l.message || l.notes || ''
    ]
      .map(escapeCsv)
      .join(',')
  );

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Himalaya_Prospects_Web_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Resynchronise en un clic tous les leads locaux en attente vers le backend CRM (#17)
 */
export async function resyncPendingWebLeads() {
  const all = getStoredWebLeads();
  let newlySynced = 0;

  for (const item of all) {
    if (item.synced_to_crm) continue;
    try {
      const res = await fetch(`${PROSPECTION_API_BASE}/api/public/web-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const data = await res.json();
        item.synced_to_crm = true;
        item.crm_contact_id = data.contact_id || null;
        newlySynced++;
      }
    } catch {
      break;
    }
  }

  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }

  return { leads: all, newlySynced };
}

/**
 * Authentification directe d'un courtier dans la Zone Équipe connectée à Himalaya Prospection (#17)
 */
export async function loginBrokerToProspection(username, password) {
  const res = await fetch(`${PROSPECTION_API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Identifiants invalides');
  }
  const data = await res.json();
  if (data.token) {
    try {
      sessionStorage.setItem(BROKER_TOKEN_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }
  return data;
}

export function getSavedBrokerSession() {
  try {
    const raw = sessionStorage.getItem(BROKER_TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearBrokerSession() {
  try {
    sessionStorage.removeItem(BROKER_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function fetchCrmLiveDashboard(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const [contactsRes, buyersRes, cockpitRes] = await Promise.all([
    fetch(`${PROSPECTION_API_BASE}/api/crm/contacts`, { headers }),
    fetch(`${PROSPECTION_API_BASE}/api/buyer-leads`, { headers }),
    fetch(`${PROSPECTION_API_BASE}/api/morning-cockpit`, { headers })
  ]);

  const contacts = contactsRes.ok ? await contactsRes.json() : [];
  const buyers = buyersRes.ok ? await buyersRes.json() : [];
  const cockpit = cockpitRes.ok ? await cockpitRes.json() : null;

  return {
    contacts: Array.isArray(contacts) ? contacts : [],
    buyers: Array.isArray(buyers) ? buyers : [],
    cockpit
  };
}
