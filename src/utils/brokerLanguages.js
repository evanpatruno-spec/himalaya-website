import { tr } from '../data/translations.js';

export const BROKER_SPOKEN_LANGUAGES = ['fr', 'en', 'zh', 'es', 'ar', 'hy', 'ht', 'ta', 'mu'];

const EXTRA_LANGUAGE_BROKERS = {
  zh: ['olivier_meunier', 'yun_zhang', 'pengbo_zhao'],
  es: ['roger_rheaume', 'sylvie_castonguay', 'eric_barelier'],
  ar: ['mike_ainajian', 'joseph_jacob'],
  hy: ['mike_ainajian', 'taline_ovayan'],
  ht: ['shella_hubert'],
  ta: ['nagatharsini_rajartnam'],
  mu: ['hemkesh_nivan_ramgolam']
};

/**
 * Returns the canonical language codes spoken by a given broker.
 * Always includes French ('fr') and English ('en'), plus additional languages by broker profile.
 */
export function getBrokerLanguages(broker) {
  const id = broker?.id || '';
  const codes = ['fr', 'en'];
  for (const [langCode, brokerIds] of Object.entries(EXTRA_LANGUAGE_BROKERS)) {
    if (brokerIds.includes(id)) codes.push(langCode);
  }
  return codes;
}

/**
 * Returns the localized full language name for tooltips, aria-labels, filters, and broker profiles.
 */
export function getBrokerLanguageName(code, lang) {
  const normalized = String(code || '').toLowerCase();
  const labels = {
    fr: tr(lang, 'Français', 'French', 'Francés', '法语'),
    en: tr(lang, 'Anglais', 'English', 'Inglés', '英语'),
    zh: tr(lang, 'Mandarin', 'Mandarin', 'Mandarín', '普通话'),
    es: tr(lang, 'Espagnol', 'Spanish', 'Español', '西班牙语'),
    ar: tr(lang, 'Arabe', 'Arabic', 'Árabe', '阿拉伯语'),
    hy: tr(lang, 'Arménien', 'Armenian', 'Armenio', '亚美尼亚语'),
    ht: tr(lang, 'Créole haïtien', 'Haitian Creole', 'Criollo haitiano', '海地克里奥尔语'),
    ta: tr(lang, 'Tamoul', 'Tamil', 'Tamil', '泰米尔语'),
    mu: tr(lang, 'Créole mauricien', 'Mauritian Creole', 'Criollo mauriciano', '毛里求斯克里奥尔语')
  };
  return labels[normalized] || '';
}
