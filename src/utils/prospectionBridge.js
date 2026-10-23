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

  // 2. Synchronisation directe avec le serveur Himalaya Prospection (/api/public/web-lead)
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
