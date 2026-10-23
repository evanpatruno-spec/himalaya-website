import { normalizeText } from './prospectionBridge';
import { pickLang, tr } from '../data/translations';

export const VALID_SITE_PAGES = [
  'home',
  'proprietes',
  'franchises',
  'courtiers',
  'agences',
  'a-propos',
  'outils',
  'investisseurs-internationaux',
  'evenements',
  'balados',
  'nous-joindre',
  'zone-equipe'
];

export function slugifySegment(text) {
  if (!text) return '';
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Génère une URL dédiée propre et optimisée SEO pour une propriété Centris / Himalaya (#15)
 * Ex: /proprietes/22685883-boul-ste-rose-e-laval
 */
export function getPropertyUrlPath(deal) {
  if (!deal || !deal.mls_number) return '/proprietes';
  const mls = encodeURIComponent(String(deal.mls_number).trim());
  const slug = slugifySegment(`${deal.title || ''} ${deal.city || ''}`);
  return slug ? `/proprietes/${mls}-${slug}` : `/proprietes/${mls}`;
}

/**
 * Génère une URL dédiée propre et optimisée SEO pour un courtier Himalaya (#15)
 * Ex: /courtiers/roger-rheaume
 */
export function getBrokerUrlPath(broker) {
  if (!broker) return '/courtiers';
  const slug = slugifySegment(broker.id || broker.name);
  return slug ? `/courtiers/${slug}` : '/courtiers';
}

/**
 * Génère le chemin URL d'une page principale
 */
export function getPageUrlPath(page) {
  if (!page || page === 'home') return '/';
  return `/${page}`;
}

/**
 * Analyse l'URL courante (pathname + query params + hash) pour supporter :
 * - Les nouvelles routes SEO dédiées (/proprietes/22685883-..., /courtiers/roger-rheaume, /investisseurs-internationaux, etc.)
 * - La rétrocompatibilité totale avec ?propriete=..., ?mls=..., ?courtier=... et #proprietes
 */
export function parseRouteFromLocation(deals = [], brokers = []) {
  const pathname = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(window.location.search);
  const hash = (window.location.hash || '').replace(/^#/, '').trim();

  let detectedPage = 'home';
  let foundDeal = null;
  let foundBroker = null;

  const segments = pathname.split('/').filter(Boolean);

  // 1. Route dédiée /proprietes/:mlsAndSlug
  if (segments[0] === 'proprietes' && segments[1]) {
    detectedPage = 'proprietes';
    const rawSeg = decodeURIComponent(segments[1]);
    const mlsCandidate = rawSeg.split('-')[0].toLowerCase();
    foundDeal =
      deals.find(d => String(d.mls_number).toLowerCase() === rawSeg.toLowerCase()) ||
      deals.find(d => String(d.mls_number).toLowerCase() === mlsCandidate) ||
      deals.find(d => `${String(d.mls_number).toLowerCase()}-${slugifySegment(`${d.title || ''} ${d.city || ''}`)}` === rawSeg.toLowerCase());
  }
  // 2. Route dédiée /courtiers/:brokerSlug
  else if (segments[0] === 'courtiers' && segments[1]) {
    detectedPage = 'courtiers';
    const rawBrokerSeg = decodeURIComponent(segments[1]).toLowerCase();
    const normSeg = normalizeText(rawBrokerSeg.replace(/-/g, ' '));
    foundBroker = brokers.find(
      b =>
        b.id.toLowerCase() === rawBrokerSeg ||
        slugifySegment(b.id) === rawBrokerSeg ||
        slugifySegment(b.name) === rawBrokerSeg ||
        normalizeText(b.name) === normSeg
    );
  }
  // 3. Route de section principale (/proprietes, /courtiers, /investisseurs-internationaux, etc.)
  else if (segments[0] && VALID_SITE_PAGES.includes(segments[0])) {
    detectedPage = segments[0];
  }
  // 4. Rétrocompatibilité #hash
  else if (hash && VALID_SITE_PAGES.includes(hash)) {
    detectedPage = hash;
  }

  // 5. Rétrocompatibilité Query Params ?propriete=... / ?mls=... / ?courtier=...
  const propParam = params.get('propriete') || params.get('mls');
  if (!foundDeal && propParam) {
    foundDeal = deals.find(d => String(d.mls_number).toLowerCase() === propParam.toLowerCase()) || null;
  }

  const brokerParam = params.get('courtier');
  if (!foundBroker && brokerParam) {
    foundBroker =
      brokers.find(
        b =>
          b.id.toLowerCase() === brokerParam.toLowerCase() ||
          slugifySegment(b.id) === slugifySegment(brokerParam) ||
          normalizeText(b.name) === normalizeText(brokerParam)
      ) || null;
  }

  return {
    page: detectedPage,
    deal: foundDeal,
    broker: foundBroker
  };
}

function setMetaTag(selector, attrName, attrVal, contentVal) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', contentVal || '');
}

/**
 * Met à jour en direct le <title>, les balises OpenGraph / Twitter Card, l'URL canonique
 * et le script Schema.org JSON-LD (RealEstateListing / RealEstateAgent) (#15)
 */
export function updateDynamicSEO({ activePage, selectedDeal, selectedBroker, lang = 'FR' }) {
  if (typeof document === 'undefined') return;

  const baseUrl = window.location.origin || 'https://www.himalayacorp.com';
  let title = 'Immobilier Himalaya Real Estate Corp | Commercial, Villégiature, Franchises & International';
  let description =
    'Immobilier Himalaya Real Estate Corp (OACIQ) : agence immobilière spécialisée en immobilier commercial, pourvoiries, campings, franchises, résidentiel et international.';
  let image = `${baseUrl}/gx/partage.jpg`;
  let canonicalUrl = `${baseUrl}${getPageUrlPath(activePage)}`;
  let jsonLd = null;

  if (selectedDeal) {
    const dealTitle = pickLang(selectedDeal, 'title', lang) || selectedDeal.title;
    const dealPrice = pickLang(selectedDeal, 'price_raw', lang) || selectedDeal.price_raw || '';
    const dealCat = pickLang(selectedDeal, 'category', lang) || selectedDeal.category || 'Immobilier';
    const dealDesc = (pickLang(selectedDeal, 'description', lang) || selectedDeal.description || '').slice(0, 220);
    const dealPath = getPropertyUrlPath(selectedDeal);

    title = `${dealTitle} (${selectedDeal.city || 'Québec'}) — ${dealPrice} | MLS ${selectedDeal.mls_number} | Immobilier Himalaya`;
    description = `${dealCat} • ${selectedDeal.city || ''} (${selectedDeal.region || ''}) • ${dealPrice} • MLS ${selectedDeal.mls_number}. ${dealDesc}`;
    image = selectedDeal.main_photo || (Array.isArray(selectedDeal.photos) && selectedDeal.photos[0]) || image;
    canonicalUrl = `${baseUrl}${dealPath}`;

    const brokerObj = (selectedDeal.brokers_details && selectedDeal.brokers_details[0]) || {
      name: selectedDeal.assigned_broker || 'Immobilier Himalaya'
    };

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: `${dealTitle} — ${selectedDeal.city || ''}`,
      description: dealDesc,
      url: canonicalUrl,
      image: Array.isArray(selectedDeal.photos) && selectedDeal.photos.length > 0 ? selectedDeal.photos : [image],
      identifier: selectedDeal.mls_number,
      offers: {
        '@type': 'Offer',
        price: Number(selectedDeal.price) || undefined,
        priceCurrency: 'CAD',
        availability: selectedDeal.status === 'Vendu' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: selectedDeal.address || dealTitle,
        addressLocality: selectedDeal.city || 'Montréal',
        addressRegion: selectedDeal.region || 'QC',
        postalCode: selectedDeal.postal_code || '',
        addressCountry: 'CA'
      },
      ...(selectedDeal.lat && selectedDeal.lng
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: selectedDeal.lat,
              longitude: selectedDeal.lng
            }
          }
        : {}),
      broker: {
        '@type': 'RealEstateAgent',
        name: brokerObj.name,
        telephone: brokerObj.phone || '+1-800-820-4828',
        email: brokerObj.email || 'info@himalayacorp.com',
        parentOrganization: {
          '@type': 'Organization',
          name: 'Immobilier Himalaya Real Estate Corp.'
        }
      }
    };
  } else if (selectedBroker) {
    const brokerRole = pickLang(selectedBroker, 'title', lang) || selectedBroker.title;
    const brokerBio = (pickLang(selectedBroker, 'bio', lang) || selectedBroker.bio || '').replace(/\s+/g, ' ').trim().slice(0, 220);
    const brokerPath = getBrokerUrlPath(selectedBroker);

    title = `${selectedBroker.name} — ${brokerRole} | Immobilier Himalaya Real Estate Corp.`;
    description = `${selectedBroker.name}, ${brokerRole} chez Immobilier Himalaya (${selectedBroker.city || 'Montréal'}). ${brokerBio}`;
    image = selectedBroker.photo || image;
    canonicalUrl = `${baseUrl}${brokerPath}`;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: selectedBroker.name,
      jobTitle: brokerRole,
      description: brokerBio,
      url: canonicalUrl,
      image: selectedBroker.photo,
      telephone: selectedBroker.phone,
      email: selectedBroker.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: selectedBroker.address || '2000, avenue McGill College, bureau 600',
        addressLocality: selectedBroker.city || 'Montréal',
        addressRegion: 'QC',
        addressCountry: 'CA'
      },
      parentOrganization: {
        '@type': 'Organization',
        name: 'Immobilier Himalaya Real Estate Corp.'
      }
    };
  } else {
    const pageTitles = {
      proprietes: tr(
        lang,
        'Propriétés commerciales, pourvoiries, terrains & résidentiel | Immobilier Himalaya',
        'Commercial Properties, Outfitters, Land & Residential | Immobilier Himalaya',
        'Propiedades comerciales, pourvoiries, terrenos y residencial | Immobilier Himalaya',
        '在售商业地产、狩猎度假庄园、开发土地与住宅 | 喜马拉雅地产'
      ),
      courtiers: tr(
        lang,
        'Nos courtiers immobiliers agréés OACIQ | Immobilier Himalaya',
        'Our OACIQ Certified Real Estate Brokers | Immobilier Himalaya',
        'Nuestros corredores inmobiliarios certificados OACIQ | Immobilier Himalaya',
        'OACIQ 持牌房地产经纪人团队 | 喜马拉雅地产'
      ),
      franchises: tr(
        lang,
        'Franchises & Expansion commerciale (Membre CQF) | Immobilier Himalaya',
        'Franchises & Retail Expansion (CQF Member) | Immobilier Himalaya',
        'Franquicias y Expansión comercial (Miembro CQF) | Immobilier Himalaya',
        '连锁特许经营与商业选址拓展 (CQF 成员) | 喜马拉雅地产'
      ),
      outils: tr(
        lang,
        'Chiffrier MREX, APH Select & Calculateurs immobiliers | Immobilier Himalaya',
        'MREX Financial Simulator, APH Select & Real Estate Calculators | Immobilier Himalaya',
        'Simulador financiero MREX, APH Select y Calculadoras | Immobilier Himalaya',
        'MREX 商业多户财务模型、APH Select 与按揭计算器 | 喜马拉雅地产'
      ),
      'investisseurs-internationaux': tr(
        lang,
        'Portail Investisseurs Internationaux — Fiscalité, Loi Non-Résidents & Financement | Immobilier Himalaya',
        'International Investors Portal — Taxation, Foreign Buyer Exemptions & Financing | Immobilier Himalaya',
        'Portal de Inversores Internacionales — Fiscalidad, Exenciones y Financiamiento | Immobilier Himalaya',
        '国际投资者门户 — 魁北克商业地产豁免政策、税务与跨境融资指南 | 喜马拉雅地产'
      ),
      'zone-equipe': 'Portail Zone Équipe & Synchronisation CRM | Immobilier Himalaya'
    };
    if (pageTitles[activePage]) {
      title = pageTitles[activePage];
    }
  }

  document.title = title;
  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

  let canonEl = document.querySelector('link[rel="canonical"]');
  if (!canonEl) {
    canonEl = document.createElement('link');
    canonEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonEl);
  }
  canonEl.setAttribute('href', canonicalUrl);

  let ldScript = document.getElementById('himalaya-dynamic-jsonld');
  if (jsonLd) {
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'himalaya-dynamic-jsonld';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(jsonLd);
  } else if (ldScript) {
    ldScript.remove();
  }
}
