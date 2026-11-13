import { tr } from '../data/translations';

export const CONSENT_STORAGE_KEY = 'himalaya_law25_consent_v1';
export const CONSENT_POLICY_VERSION = '2026-11';
export const CONSENT_UPDATED_EVENT = 'himalaya:consent-updated';
export const CONSENT_PREFERENCES_EVENT = 'himalaya:open-cookie-preferences';
export const OPEN_LEGAL_EVENT = 'himalaya:open-legal';

export const DEFAULT_CONSENT_STATE = {
  version: CONSENT_POLICY_VERSION,
  decisionMade: false,
  updatedAt: null,
  categories: {
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false
  }
};

/**
 * Supprime les témoins et widgets Google Translate lorsque la catégorie
 * « Préférences » n'est pas autorisée ou est révoquée (Loi 25).
 */
export function clearGoogleTranslateArtifacts() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const host = window.location.hostname;
  const domainParts = host.split('.');
  const domains = ['', host, `.${host}`];
  if (domainParts.length >= 2) {
    domains.push(`.${domainParts.slice(-2).join('.')}`);
  }

  for (const dom of domains) {
    const domainPart = dom ? ` domain=${dom};` : '';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domainPart}`;
  }

  const combo = document.querySelector('.goog-te-combo');
  if (combo && combo.value) {
    combo.value = '';
    combo.dispatchEvent(new Event('change'));
  }
}

export function enforceConsentSideEffects(state) {
  if (!state?.decisionMade || !state?.categories?.preferences) {
    clearGoogleTranslateArtifacts();
  }
}

export function readConsentState() {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONSENT_STATE, categories: { ...DEFAULT_CONSENT_STATE.categories } };

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CONSENT_POLICY_VERSION || typeof parsed.categories !== 'object') {
      return { ...DEFAULT_CONSENT_STATE, categories: { ...DEFAULT_CONSENT_STATE.categories } };
    }

    return {
      version: CONSENT_POLICY_VERSION,
      decisionMade: Boolean(parsed.decisionMade),
      updatedAt: parsed.updatedAt || null,
      categories: {
        necessary: true,
        preferences: Boolean(parsed.categories.preferences),
        analytics: Boolean(parsed.categories.analytics),
        marketing: Boolean(parsed.categories.marketing)
      }
    };
  } catch {
    return { ...DEFAULT_CONSENT_STATE, categories: { ...DEFAULT_CONSENT_STATE.categories } };
  }
}

export function saveConsentState(categoriesInput = {}) {
  const nextState = {
    version: CONSENT_POLICY_VERSION,
    decisionMade: true,
    updatedAt: new Date().toISOString(),
    categories: {
      necessary: true,
      preferences: Boolean(categoriesInput.preferences),
      analytics: Boolean(categoriesInput.analytics),
      marketing: Boolean(categoriesInput.marketing)
    }
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // ignore storage quota / private mode restrictions
  }

  enforceConsentSideEffects(nextState);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: nextState }));
  }

  return nextState;
}

export function acceptAllConsent() {
  return saveConsentState({
    necessary: true,
    preferences: true,
    analytics: true,
    marketing: true
  });
}

export function refuseAllOptionalConsent() {
  return saveConsentState({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false
  });
}

export function hasConsentFor(category) {
  if (category === 'necessary') return true;
  const state = readConsentState();
  return Boolean(state.decisionMade && state.categories[category]);
}

export function openCookiePreferencesModal(pendingTranslateItem = null) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(CONSENT_PREFERENCES_EVENT, { detail: { pendingTranslateItem } })
    );
  }
}

export function openLegalModal(type = 'privacy') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_LEGAL_EVENT, { detail: type }));
  }
}

export function getConsentCategorySpecs(lang) {
  return [
    {
      id: 'necessary',
      locked: true,
      title: tr(
        lang,
        'Témoins strictement nécessaires',
        'Strictly Necessary Storage',
        'Almacenamiento estrictamente necesario',
        '严格必要存储'
      ),
      badge: tr(lang, 'Toujours actif', 'Always Active', 'Siempre activo', '始终启用'),
      description: tr(
        lang,
        'Indispensables au fonctionnement du site : langue d’affichage native (FR/EN/ES/ZH), mémorisation de votre choix Loi 25, session NDA et routage sécurisé des formulaires.',
        'Essential for core site operation: native display language (FR/EN/ES/ZH), your Law 25 consent record, NDA session status, and secure form routing.',
        'Indispensables para el funcionamiento del sitio: idioma nativo (FR/EN/ES/ZH), registro de su decisión de la Ley 25, estado NDA y envío seguro de formularios.',
        '保障网站基础运行所必需：原生界面语言（FR/EN/ES/ZH）、第 25 号法案同意记录、NDA 会话状态及表单安全提交。'
      ),
      details: tr(
        lang,
        'Clés locales : himalaya_site_lang, himalaya_law25_consent_v1, himalaya_website_signed_ndas',
        'Local keys: himalaya_site_lang, himalaya_law25_consent_v1, himalaya_website_signed_ndas',
        'Claves locales: himalaya_site_lang, himalaya_law25_consent_v1, himalaya_website_signed_ndas',
        '本地键值：himalaya_site_lang、himalaya_law25_consent_v1、himalaya_website_signed_ndas'
      )
    },
    {
      id: 'preferences',
      locked: false,
      title: tr(
        lang,
        'Préférences & Traduction additionnelle',
        'Preferences & Additional Translation',
        'Preferencias y traducción adicional',
        '偏好设置与附加自动翻译'
      ),
      badge: null,
      description: tr(
        lang,
        'Autorise le chargement sur demande du module externe Google Translate pour les langues additionnelles (hors FR, EN, ES et 中文 déjà traduits nativement sans aucun témoin).',
        'Allows on-demand loading of the external Google Translate widget for extra languages (beyond FR, EN, ES, and 中文 which run natively with zero third-party cookies).',
        'Autoriza la carga bajo demanda del widget externo Google Translate para idiomas adicionales (FR, EN, ES y 中文 funcionan de forma nativa sin cookies de terceros).',
        '仅在您选择扩展语言时按需加载 Google Translate（FR、EN、ES 与中文为本站原生翻译，不使用任何第三方 Cookie）。'
      ),
      details: tr(
        lang,
        'Service / témoin conditionnel : Google Translate (googtrans) — désactivé par défaut',
        'Conditional service/cookie: Google Translate (googtrans) — off by default',
        'Servicio / cookie condicional: Google Translate (googtrans) — desactivado por defecto',
        '条件启用服务/Cookie：Google Translate（googtrans）— 默认关闭'
      )
    },
    {
      id: 'analytics',
      locked: false,
      title: tr(
        lang,
        'Statistiques & Mesure d’audience',
        'Analytics & Audience Measurement',
        'Estadísticas y medición de audiencia',
        '统计与受众分析'
      ),
      badge: null,
      description: tr(
        lang,
        'Permet de mesurer l’achalandage et d’améliorer nos fiches immobilières de manière agrégée. Aucun traceur analytique tiers n’est actif actuellement sur le site.',
        'Measures traffic and improves property listings in aggregate. No third-party analytics tracker is currently active on this website.',
        'Permite medir la audiencia y mejorar las fichas inmobiliarias de forma agregada. Actualmente no hay ningún rastreador analítico de terceros activo en el sitio.',
        '用于聚合统计访问量并优化房源展示。目前本网站未启用任何第三方数据分析追踪脚本。'
      ),
      details: tr(
        lang,
        'État : aucun outil tiers actif — consentement préalable requis (Loi 25)',
        'Status: no third-party tracker active — prior opt-in required (Law 25)',
        'Estado: sin rastreadores de terceros activos — consentimiento previo requerido (Ley 25)',
        '状态：当前无第三方统计追踪器运行 — 需事先明确同意（第 25 号法案）'
      )
    },
    {
      id: 'marketing',
      locked: false,
      title: tr(
        lang,
        'Marketing & Campagnes ciblées',
        'Marketing & Targeted Campaigns',
        'Marketing y campañas dirigidas',
        '营销与定向推广'
      ),
      badge: null,
      description: tr(
        lang,
        'Réservé au suivi publicitaire ou au reciblage éventuel. Immobilier Himalaya n’active aucun pixel publicitaire ni partage tiers sur ce site.',
        'Reserved for optional advertising attribution or retargeting. Immobilier Himalaya loads zero advertising pixels or third-party ad trackers on this site.',
        'Reservado para atribución publicitaria opcional. Immobilier Himalaya no activa ningún píxel publicitario ni compartición con terceros en este sitio.',
        '保留用于可选广告归因。喜马拉雅地产目前不在本网站加载任何广告像素或第三方营销追踪代码。'
      ),
      details: tr(
        lang,
        'État : aucun pixel publicitaire actif — désactivé par défaut',
        'Status: zero advertising pixels active — off by default',
        'Estado: sin píxeles publicitarios activos — desactivado por defecto',
        '状态：当前未启用任何广告像素 — 默认关闭'
      )
    }
  ];
}
