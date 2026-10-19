const PROSPECTION_API_BASE = 'http://localhost:8000';
const LEADS_STORAGE_KEY = 'himalaya_website_synced_leads';
const NDA_STORAGE_KEY = 'himalaya_website_signed_ndas';

/**
 * Normalise un texte pour une recherche insensible aux accents et à la casse (Point 4)
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
 * Vérifie si un mandat appartient à un courtier donné (incluant co-inscriptions dans brokers_details) (Point 8)
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
 * Envoie un prospect (NDA, Contact ou Demande d'évaluation vendeur) vers Himalaya Prospection CRM (Points 9, 17, 20)
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
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch {
    // ignore
  }

  // 2. Tentative de synchronisation directe avec le serveur Himalaya Prospection (localhost:8000)
  try {
    // Création dans l'annuaire CRM central (/api/crm/contacts)
    const contactPayload = {
      nom: leadData.fullName || leadData.name || 'Visiteur Site Web',
      entreprise: leadData.company || '',
      role: leadData.type === 'valuation' ? 'Propriétaire Vendeur' : (leadData.type === 'nda' ? 'Acquéreur Qualifié (NDA)' : 'Contact Site Web'),
      telephone: leadData.phone || '',
      email: leadData.email || '',
      ville: leadData.city || leadData.dealCity || '',
      region: leadData.region || '',
      notes: `[Site Web Himalaya] ${leadData.subject || ''} | ${leadData.message || ''} | Mise de fonds: ${leadData.liquidity || 'N/A'} | Mandat: ${leadData.mls || 'Général'}`,
      assigned_broker: leadData.assigned_broker || 'Roger Rhéaume'
    };

    const res = await fetch(`${PROSPECTION_API_BASE}/api/crm/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    });

    if (res.ok) {
      entry.synced_to_crm = true;
    }

    // Si c'est un NDA acheteur, l'ajouter aussi dans /api/buyer-leads
    if (leadData.type === 'nda') {
      await fetch(`${PROSPECTION_API_BASE}/api/buyer-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: leadData.fullName,
          entreprise: leadData.company || '',
          email: leadData.email,
          telephone: leadData.phone,
          budget_max: leadData.liquidity === '3m_plus' ? 5000000 : (leadData.liquidity === '1m_3m' ? 3000000 : 1000000),
          mise_de_fonds: leadData.liquidity,
          statut_nda: 'Signé (Site Web)',
          notes: `NDA signé en ligne pour ${leadData.dealTitle || 'Pocket Listings'} (MLS ${leadData.mls || 'Hors-Marché'})`,
          assigned_broker: leadData.assigned_broker || 'Roger Rhéaume'
        })
      });
    }

    // Si c'est une demande d'évaluation vendeur (Point 17), l'ajouter aussi dans /api/prospects
    if (leadData.type === 'valuation') {
      await fetch(`${PROSPECTION_API_BASE}/api/prospects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: `${leadData.assetType || 'Propriété'} — ${leadData.city || 'Québec'} (${leadData.fullName})`,
          categorie: leadData.assetType || 'Commercial',
          ville: leadData.city || '',
          region: leadData.city || '',
          telephone: leadData.phone || '',
          email: leadData.email || '',
          site_web: '',
          statut_prospection: 'Demande Évaluation Site Web',
          notes_prospection: `Demande d'évaluation vendeur via himalayacorp.com | Prix/Revenus: ${leadData.revenue || 'Non précisé'} | Message: ${leadData.message || ''}`,
          assigned_broker: 'Roger Rhéaume'
        })
      });
    }

    // Mettre à jour le statut synced_to_crm dans localStorage
    if (entry.synced_to_crm) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
    }
  } catch {
    // Si le backend local n'est pas lancé (ex: visiteur sur Vercel), la sauvegarde locale reste active
  }

  return entry;
}
