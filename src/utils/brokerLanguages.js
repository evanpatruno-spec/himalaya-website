import { tr } from '../data/translations.js';

/**
 * Returns the canonical language codes spoken by a given broker.
 * Always includes French ('fr') and English ('en'), plus additional languages by broker profile.
 */
export function getBrokerLanguages(broker) {
  const id = broker?.id || '';
  const codes = ['fr', 'en'];
  if (['olivier_meunier', 'yun_zhang', 'pengbo_zhao'].includes(id)) codes.push('zh');
  if (['roger_rheaume', 'sylvie_castonguay', 'eric_barelier'].includes(id)) codes.push('es');
  if (['mike_ainajian', 'joseph_jacob'].includes(id)) codes.push('ar');
  if (['mike_ainajian', 'taline_ovayan'].includes(id)) codes.push('hy');
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
    hy: tr(lang, 'Arménien', 'Armenian', 'Armenio', '亚美尼亚语')
  };
  return labels[normalized] || '';
}
