/**
 * Vercel Serverless Function — Passerelle Officielle API Centris / RESO Web API (MLS)
 * Route : GET / POST /api/centris-sync
 *
 * Variables d'environnement supportées sur Vercel :
 * - CENTRIS_API_KEY      : Clé API Centris / Matrix RESO Web API (Bearer Token ou Client Secret)
 * - CENTRIS_API_URL      : Endpoint OData / REST Centris (défaut : https://api.centris.ca/odata/Property)
 * - CENTRIS_AGENCY_CODE  : Code d'agence Himalaya (filtrage automatique des inscriptions de l'agence)
 */

const edgeListingsCache = (globalThis.__himalayaCentrisCache = globalThis.__himalayaCentrisCache || {
  lastSync: null,
  deals: []
});

function mapCentrisPropertyToHimalayaDeal(raw) {
  const mls = String(raw.ListingKey || raw.ListingId || raw.MlsNumber || raw.NoCentris || raw.id || '');
  const priceNum = Number(raw.ListPrice || raw.ClosePrice || raw.Prix || raw.price_numeric || 0);
  const isSold =
    raw.StandardStatus === 'Closed' ||
    raw.MlsStatus === 'Sold' ||
    raw.Statut === 'Vendu' ||
    raw.status === 'Vendu';

  return {
    mls_number: mls,
    title: raw.PublicRemarksTitle || raw.UnparsedAddress || raw.title || `Inscription Centris #${mls}`,
    city: raw.City || raw.Municipalite || raw.city || 'Québec',
    region: raw.StateOrProvince || raw.Region || raw.region || 'Québec',
    category: raw.PropertySubType || raw.PropertyType || raw.category || 'Commercial',
    status: isSold ? 'Vendu' : 'En vigueur',
    price_numeric: priceNum,
    price: priceNum > 0 ? `${priceNum.toLocaleString('fr-CA')} $` : (raw.price || 'Prix sur demande'),
    assigned_broker: raw.ListAgentFullName || raw.assigned_broker || 'Roger Rhéaume',
    description: raw.PublicRemarks || raw.description || '',
    photos: Array.isArray(raw.Media)
      ? raw.Media.map((m) => m.MediaURL).filter(Boolean)
      : Array.isArray(raw.photos)
      ? raw.photos
      : [],
    lat: Number(raw.Latitude || raw.lat || 45.5017),
    lng: Number(raw.Longitude || raw.lng || -73.5673),
    centris_url: raw.centris_url || (mls ? `https://www.centris.ca/fr/propriete/${mls}` : ''),
    synced_from_centris_api: true,
    updated_at: raw.ModificationTimestamp || new Date().toISOString()
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.CENTRIS_API_KEY;
  const apiUrl = process.env.CENTRIS_API_URL || 'https://api.centris.ca/odata/Property';
  const agencyCode = process.env.CENTRIS_AGENCY_CODE || 'HIMALAYA';

  // Permet aussi à un webhook Centris / CRM de pousser des inscriptions en POST
  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const incoming = Array.isArray(payload.deals) ? payload.deals : Array.isArray(payload) ? payload : [];
      if (incoming.length > 0) {
        edgeListingsCache.deals = incoming.map(mapCentrisPropertyToHimalayaDeal);
        edgeListingsCache.lastSync = new Date().toISOString();
      }
      return res.status(200).json({
        ok: true,
        synced_count: edgeListingsCache.deals.length,
        last_sync: edgeListingsCache.lastSync
      });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  }

  // Si la clé API Centris est configurée sur Vercel, synchronisation automatique en direct
  if (apiKey) {
    try {
      const url = new URL(apiUrl);
      if (!url.searchParams.has('$top')) {
        url.searchParams.set('$top', '200');
      }
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
          'X-Agency-Code': agencyCode
        }
      });

      if (response.ok) {
        const data = await response.json();
        const records = Array.isArray(data.value) ? data.value : Array.isArray(data) ? data : [];
        edgeListingsCache.deals = records.map(mapCentrisPropertyToHimalayaDeal);
        edgeListingsCache.lastSync = new Date().toISOString();

        return res.status(200).json({
          ok: true,
          centris_live: true,
          last_sync: edgeListingsCache.lastSync,
          deals: edgeListingsCache.deals
        });
      }
    } catch {
      // Fallback sur le cache Edge si l'API Centris met trop de temps à répondre
    }
  }

  return res.status(200).json({
    ok: true,
    centris_live: Boolean(apiKey),
    ready_for_key: !apiKey,
    last_sync: edgeListingsCache.lastSync,
    deals: edgeListingsCache.deals
  });
}
