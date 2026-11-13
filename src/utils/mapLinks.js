const CONFIDENTIAL_RE = /non disponible|unavailable/i;
const CIVIC_ONLY_RE = /^\d+(?:[\s\-]+\d+)?[A-Za-z]?$/;
const CANADIAN_POSTAL_RE = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;

function formatPostalCode(rawPostal) {
  const trimmed = String(rawPostal || '').trim().toUpperCase();
  if (!trimmed || !/\d/.test(trimmed)) return '';
  const compact = trimmed.replace(/\s+/g, '');
  if (CANADIAN_POSTAL_RE.test(compact)) {
    return `${compact.slice(0, 3)} ${compact.slice(3)}`;
  }
  return trimmed;
}

function extractStreetSegment(deal) {
  const rawAddress = String(deal?.address || '').trim();
  const rawTitle = String(deal?.title || '').trim();

  if (CONFIDENTIAL_RE.test(rawAddress)) {
    return '';
  }

  if (CIVIC_ONLY_RE.test(rawAddress)) {
    if (!rawTitle || CONFIDENTIAL_RE.test(rawTitle)) {
      return '';
    }
    return rawTitle;
  }

  if (rawTitle && !CONFIDENTIAL_RE.test(rawTitle) && /^\d/.test(rawTitle) && rawAddress.startsWith(rawTitle)) {
    return rawTitle;
  }

  if (!rawAddress || /^hotel$/i.test(rawAddress)) {
    return '';
  }

  return rawAddress;
}

/**
 * Construit une requête d'adresse normalisée et précise pour Google Maps à partir d'une fiche propriété.
 * Gère les cas où deal.address ne contient que le numéro civique (complété par deal.title)
 * ou où l'adresse est confidentielle / internationale.
 */
export function buildGoogleMapsQuery(deal) {
  if (!deal) return '';

  const street = extractStreetSegment(deal);
  const city = String(deal.city || '').trim();
  const region = String(deal.region || '').trim();
  const postalCode = formatPostalCode(deal.postal_code);
  const country = String(deal.specs?.Pays || deal.country || '').trim() || 'Canada';

  const parts = [];
  const lowerStreet = street.toLowerCase();

  if (street) {
    parts.push(street);
  }

  if (city) {
    const baseCity = city.split('(')[0].trim().toLowerCase();
    if (!baseCity || !lowerStreet.includes(baseCity)) {
      parts.push(city);
    }
  }

  const lowerJoinedSoFar = parts.join(' ').toLowerCase();
  if (
    region &&
    region.toLowerCase() !== country.toLowerCase() &&
    !lowerJoinedSoFar.includes(region.toLowerCase())
  ) {
    parts.push(region);
  }

  const hasLocationData = Boolean(street || city || region || postalCode);
  if (!hasLocationData) return '';

  const isQuebecPostal = /^[GHJ]/.test(postalCode);
  if (country.toLowerCase() === 'canada' && isQuebecPostal && !lowerJoinedSoFar.includes('qc')) {
    parts.push('QC');
  }

  if (postalCode && !street.toUpperCase().includes(postalCode)) {
    parts.push(postalCode);
  }

  if (country && !parts.join(' ').toLowerCase().includes(country.toLowerCase())) {
    parts.push(country);
  }

  return parts.filter(Boolean).join(', ');
}

export function buildGoogleMapsUrl(deal) {
  const query = buildGoogleMapsQuery(deal);
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
