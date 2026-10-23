import { useState, useEffect } from 'react';
import { tr } from '../data/translations';

const CACHE_KEY = 'himalaya_boc_exchange_rates_v1';

// Taux de repli de référence (1 CAD vers devise cible) si hors-ligne
export const FALLBACK_CURRENCY_RATES = {
  CAD: 1,
  EUR: 0.68,
  USD: 0.73,
  CNY: 5.24
};

export const CURRENCY_OPTIONS = [
  { id: 'CAD', code: 'CAD', label: 'CAD $', symbol: '$', suffix: 'CAD $' },
  { id: 'EUR', code: 'EUR', label: 'EUR €', symbol: '€', suffix: '€ EUR' },
  { id: 'USD', code: 'USD', label: 'USD $', symbol: '$ US', suffix: '$ USD' },
  { id: 'CNY', code: 'CNY', label: 'CNY ¥', symbol: '¥ RMB', suffix: '¥ CNY' }
];

let memoryCache = null;

/**
 * Récupère les taux de change officiels de la Banque du Canada (API publique Valet)
 * Séries : FXUSDCAD, FXEURCAD, FXCNYCAD (1 unité étrangère exprimée en CAD)
 */
export async function fetchBankOfCanadaRates() {
  if (memoryCache) return memoryCache;

  try {
    const cachedRaw = sessionStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw);
      if (parsed && parsed.rates && Date.now() - (parsed.timestamp || 0) < 6 * 3600 * 1000) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(
      'https://www.bankofcanada.ca/valet/observations/FXUSDCAD,FXEURCAD,FXCNYCAD/json?recent=1',
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const obs = Array.isArray(data?.observations) && data.observations[0];
      if (obs) {
        const usdCad = parseFloat(obs?.FXUSDCAD?.v);
        const eurCad = parseFloat(obs?.FXEURCAD?.v);
        const cnyCad = parseFloat(obs?.FXCNYCAD?.v);

        const rates = {
          CAD: 1,
          USD: usdCad > 0 ? +(1 / usdCad).toFixed(4) : FALLBACK_CURRENCY_RATES.USD,
          EUR: eurCad > 0 ? +(1 / eurCad).toFixed(4) : FALLBACK_CURRENCY_RATES.EUR,
          CNY: cnyCad > 0 ? +(1 / cnyCad).toFixed(4) : FALLBACK_CURRENCY_RATES.CNY
        };

        const payload = {
          rates,
          date: obs.d || new Date().toISOString().slice(0, 10),
          source: 'Banque du Canada',
          live: true,
          timestamp: Date.now()
        };

        memoryCache = payload;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        } catch {
          // ignore
        }
        return payload;
      }
    }
  } catch {
    // Fallback silencieux si hors-ligne ou bloqueur réseau
  }

  const fallbackPayload = {
    rates: { ...FALLBACK_CURRENCY_RATES },
    date: null,
    source: 'Référence Banque du Canada',
    live: false,
    timestamp: Date.now()
  };
  memoryCache = fallbackPayload;
  return fallbackPayload;
}

/**
 * Hook React retournant les taux de change dynamiques Banque du Canada (CAD, EUR, USD, CNY)
 */
export function useExchangeRates() {
  const [rateData, setRateData] = useState(() => memoryCache || {
    rates: { ...FALLBACK_CURRENCY_RATES },
    date: null,
    source: 'Banque du Canada',
    live: false
  });

  useEffect(() => {
    let mounted = true;
    fetchBankOfCanadaRates().then(res => {
      if (mounted && res) setRateData(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return rateData;
}

/**
 * Formate un prix CAD dans la devise cible choisie (CAD, EUR, USD, CNY)
 */
export function formatDealPriceInCurrency(deal, rawPriceText, currency = 'CAD', rates = FALLBACK_CURRENCY_RATES, lang = 'FR') {
  const priceNum = Number(deal?.price) || 0;
  if (currency === 'CAD' || priceNum <= 0) return rawPriceText;

  const isRent =
    deal?.transaction_type === 'Location' ||
    /\/(mois|mo|mes|月|an|yr|año|年|pi²|sq\.ft)/i.test(rawPriceText || '');
  if (isRent && priceNum < 50000) return rawPriceText;

  const rate = rates?.[currency] || FALLBACK_CURRENCY_RATES[currency] || 1;
  const converted = Math.round(priceNum * rate);
  const locale = lang === 'EN' ? 'en-CA' : lang === 'ZH' ? 'zh-CN' : 'fr-CA';

  if (currency === 'EUR') return `≈ ${converted.toLocaleString(locale)} €`;
  if (currency === 'USD') return `≈ ${converted.toLocaleString('en-US')} $ US`;
  if (currency === 'CNY') return `≈ ¥ ${converted.toLocaleString(locale)} RMB`;
  return rawPriceText;
}

/**
 * Mention explicative du taux de change Banque du Canada (quadrilingue)
 */
export function getCurrencyDisclaimerText(currency, rateInfo, lang = 'FR') {
  if (!currency || currency === 'CAD') return '';
  const rates = rateInfo?.rates || FALLBACK_CURRENCY_RATES;
  const r = rates[currency] || FALLBACK_CURRENCY_RATES[currency];
  const rateFormatted = Number(r).toLocaleString(lang === 'EN' ? 'en-CA' : 'fr-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
  const dateSuffix = rateInfo?.date ? ` (${rateInfo.date})` : '';

  return tr(
    lang,
    `Affichage indicatif en ${currency} • Taux Banque du Canada${dateSuffix} : 1 CAD = ${rateFormatted} ${currency} • Prix contractuels en CAD $`,
    `Indicative display in ${currency} • Bank of Canada rate${dateSuffix}: 1 CAD = ${rateFormatted} ${currency} • Official contract prices in CAD $`,
    `Conversión indicativa en ${currency} • Tasa Banco de Canadá${dateSuffix}: 1 CAD = ${rateFormatted} ${currency} • Precios oficiales en CAD $`,
    `${currency} 参考折算价 • 加拿大央行汇率${dateSuffix}：1 CAD = ${rateFormatted} ${currency} • 官方合同标价以加元 CAD $ 为准`
  );
}
