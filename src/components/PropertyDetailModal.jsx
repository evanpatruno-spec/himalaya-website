import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, MapPin, Phone, Mail, ExternalLink, FileText, Maximize2,
  ChevronLeft, ChevronRight, Sparkles, Lock, Share2, CheckCircle2, Calculator, ArrowRight, ArrowLeftRight
} from 'lucide-react';
import { isNdaSignedForDeal } from '../utils/prospectionBridge';
import { tr, pickLang } from '../data/translations';
import liveDealsData from '../data/himalayaLiveDeals.json';
import {
  useExchangeRates,
  CURRENCY_OPTIONS,
  FALLBACK_CURRENCY_RATES,
  getCurrencyDisclaimerText
} from '../utils/currencyService';
import { getPropertyUrlPath } from '../utils/seoRouter';
import ChiffrierDealSimulator from './ChiffrierDealSimulator';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80';

function parseLocaleNumber(raw) {
  if (!raw) return NaN;
  let cleaned = String(raw).trim().replace(/\s+/g, '');
  // Si virgule suivie de 3 chiffres exactement (ex: 2,359,724), c'est un séparateur de milliers
  if (/^\d{1,3}(,\d{3})+$/.test(cleaned)) {
    cleaned = cleaned.replace(/,/g, '');
  } else {
    cleaned = cleaned.replace(',', '.');
  }
  return parseFloat(cleaned);
}

function formatSpecUnitValue(val, unitSystem, lang) {
  if (!val || typeof val !== 'string') return val;
  const numLocale = lang === 'EN' ? 'en-CA' : 'fr-CA';

  if (unitSystem === 'metric') {
    // 1. Valeurs en pi² / pc / PC / sq.ft. / pieds carrés -> m² (et ha si >= 10 000 m²)
    const sqftRegex = /([\d][\d\s,.]*)\s*(pi²|pi2|pc|PC|sq\.?\s*ft\.?|pieds?\s*carrés?)\b/gi;
    if (sqftRegex.test(val)) {
      return val.replace(sqftRegex, (match, numStr) => {
        const n = parseLocaleNumber(numStr);
        if (isNaN(n) || n <= 0) return match;
        const m2 = n / 10.7639;
        const m2Formatted = m2 >= 100
          ? Math.round(m2).toLocaleString(numLocale)
          : m2.toLocaleString(numLocale, { maximumFractionDigits: 1 });
        const haPart = m2 >= 10000
          ? ` / ${(m2 / 10000).toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`
          : '';
        return `${m2Formatted} m²${haPart} (${n.toLocaleString(numLocale)} pi²)`;
      });
    }

    // 2. Valeurs en acres / arpents -> ha (hectares)
    const acreRegex = /([\d][\d\s,.]*)\s*(acres?|arpents?)\b/gi;
    if (acreRegex.test(val)) {
      return val.replace(acreRegex, (match, numStr, unitStr) => {
        const n = parseLocaleNumber(numStr);
        if (isNaN(n) || n <= 0) return match;
        const ha = n * 0.404686;
        return `${ha.toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha (${n.toLocaleString(numLocale)} ${unitStr.toLowerCase()})`;
      });
    }

    // 3. Dimensions en pieds (ex: 30' x 40', 50 x 100 pi, 50 X 100 P) -> mètres
    const dimFeetPairRegex = /([\d][\d\s,.]*)\s*(?:'|pi|ft|p)?\s*[xX×]\s*([\d][\d\s,.]*)\s*(?:'|pi\b|ft\b|P\b)/g;
    if (dimFeetPairRegex.test(val)) {
      return val.replace(dimFeetPairRegex, (match, d1, d2) => {
        const n1 = parseLocaleNumber(d1);
        const n2 = parseLocaleNumber(d2);
        if (isNaN(n1) || isNaN(n2)) return match;
        const m1 = (n1 * 0.3048).toLocaleString(numLocale, { maximumFractionDigits: 1 });
        const m2 = (n2 * 0.3048).toLocaleString(numLocale, { maximumFractionDigits: 1 });
        return `${m1} m × ${m2} m (${match.trim()})`;
      });
    }

    // 4. Valeurs Centris déjà en MC (mètres carrés) -> formatage propre m² + ha
    const mcRegex = /^([\d][\d\s,.]*)\s*MC$/i;
    const mcMatch = val.trim().match(mcRegex);
    if (mcMatch) {
      const n = parseLocaleNumber(mcMatch[1]);
      if (!isNaN(n) && n > 0) {
        const m2Formatted = Math.round(n).toLocaleString(numLocale);
        const haPart = n >= 10000
          ? ` (${(n / 10000).toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha)`
          : '';
        return `${m2Formatted} m²${haPart}`;
      }
    }
  } else {
    // Mode impérial : si la valeur brute Centris est en MC / m², afficher l'équivalent en pi² / acres
    const mcRegex = /^([\d][\d\s,.]*)\s*(?:MC|m²|m2)$/i;
    const mcMatch = val.trim().match(mcRegex);
    if (mcMatch) {
      const n = parseLocaleNumber(mcMatch[1]);
      if (!isNaN(n) && n > 0) {
        const sqft = Math.round(n * 10.7639).toLocaleString(numLocale);
        const acresPart = n >= 4047
          ? ` / ${(n / 4046.86).toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} acres`
          : '';
        return `${sqft} pi²${acresPart} (${Math.round(n).toLocaleString(numLocale)} m²)`;
      }
    }
    // Formatage lisible pour "2359724 PC" en mode impérial
    const pcRegex = /^([\d][\d\s,.]*)\s*PC$/i;
    const pcMatch = val.trim().match(pcRegex);
    if (pcMatch) {
      const n = parseLocaleNumber(pcMatch[1]);
      if (!isNaN(n) && n > 0) {
        const acresPart = n >= 43560
          ? ` (${(n / 43560).toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} acres)`
          : '';
        return `${Math.round(n).toLocaleString(numLocale)} pi²${acresPart}`;
      }
    }
  }

  return val;
}

const SPEC_TRANSLATIONS = {
  "No MLS": ["No MLS", "MLS / Centris #", "N.º MLS / Centris", "MLS / Centris 编号"],
  "Région": ["Région", "Region", "Región", "地区"],
  "Quartier": ["Quartier", "Neighborhood", "Barrio / Sector", "街区"],
  "Pays": ["Pays", "Country", "País", "国家"],
  "Superficie du terrain": ["Superficie du terrain", "Lot Area", "Superficie del terreno", "土地面积"],
  "Superficie habitable": ["Superficie habitable", "Living Area", "Superficie habitable", "居住面积"],
  "Superficie commerciale": ["Superficie commerciale", "Commercial Area", "Superficie comercial", "商业面积"],
  "Superficie du bâtiment": ["Superficie du bâtiment", "Building Area", "Superficie del edificio", "建筑面积"],
  "Dimensions du terrain": ["Dimensions du terrain", "Lot Dimensions", "Dimensiones del terreno", "土地尺寸"],
  "Dimensions du bâtiment": ["Dimensions du bâtiment", "Building Dimensions", "Dimensiones del edificio", "建筑尺寸"],
  "Année de construction": ["Année de construction", "Year Built", "Año de construcción", "建造年份"],
  "Année d'évaluation": ["Année d'évaluation", "Assessment Year", "Año de evaluación", "评估年份"],
  "Évaluation municipale du terrain": ["Évaluation municipale du terrain", "Municipal Land Assessment", "Evaluación municipal del terreno", "市政土地估值"],
  "Évaluation municipale du bâtiment": ["Évaluation municipale du bâtiment", "Municipal Building Assessment", "Evaluación municipal del edificio", "市政建筑估值"],
  "Taxes municipales": ["Taxes municipales", "Municipal Taxes", "Impuestos municipales", "市政税"],
  "Taxes scolaires": ["Taxes scolaires", "School Taxes", "Impuestos escolares", "学校税"],
  "Nombre d'unités au total": ["Nombre d'unités au total", "Total Units", "Total de unidades", "总单元数"],
  "Type de bâtiment": ["Type de bâtiment", "Building Style", "Tipo de edificio", "建筑类型"],
  "Nombre de chambres": ["Nombre de chambres", "Bedrooms", "Dormitorios", "卧室数量"],
  "Nombre de salles de bains": ["Nombre de salles de bains", "Bathrooms", "Baños", "浴室数量"],
  "Nombre de salles d'eau": ["Nombre de salles d'eau", "Powder Rooms", "Aseos / Medios baños", "盥洗室数量"],
  "Stationnement total": ["Stationnement total", "Parking", "Estacionamiento total", "总车位数"],
  "Reprise de finance": ["Reprise de finance", "Foreclosure", "Recuperación bancaria", "银行法拍物业"],
  "Approvisionnement en eau": ["Approvisionnement en eau", "Water Supply", "Suministro de agua", "供水系统"],
  "Système d'égouts": ["Système d'égouts", "Sewage System", "Sistema de alcantarillado", "排污系统"],
  "Particularités": ["Particularités", "Features", "Características especiales", "物业特色"],
  "Proximité": ["Proximité", "Nearby", "Proximidad", "周边配套"],
  "Topographie": ["Topographie", "Topography", "Topografía", "地形特征"],
  "Zonage": ["Zonage", "Zoning", "Zonificación", "分区规划 (Zoning)"]
};

export default function PropertyDetailModal({
  deal,
  t,
  onClose,
  onOpenNDA,
  onFilterByBroker,
  onSimulateInTools,
  onOpenCalculator,
  currency = 'CAD',
  onCurrencyChange,
  allDeals = liveDealsData,
  onSelectDeal
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Idée #11 : Sélecteur de devises dynamique Banque du Canada (CAD $ | EUR € | USD $ | CNY ¥)
  const exchangeRateInfo = useExchangeRates();
  const activeRates = exchangeRateInfo?.rates || FALLBACK_CURRENCY_RATES;
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'CAD');
  useEffect(() => {
    if (currency) setSelectedCurrency(currency);
  }, [currency]);

  const handleCurrencyChange = (nextCurr) => {
    setSelectedCurrency(nextCurr);
    if (onCurrencyChange) onCurrencyChange(nextCurr);
  };

  // Idée #2 : Convertisseur d'unités de superficie (imperial: pi²/acres ⇄ metric: m²/ha)
  const [unitSystem, setUnitSystem] = useState('imperial');

  const modalBackdropRef = useRef(null);
  const modalPanelRef = useRef(null);

  // Calculateur de financement rapide intégré
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRate, setInterestRate] = useState(5.25);

  useEffect(() => {
    setActiveImgIdx(0);
    setIsLightboxOpen(false);
  }, [deal?.id, deal?.mls_number]);

  const gallery = useMemo(() => {
    return Array.isArray(deal?.photos) && deal.photos.length > 0 
      ? deal.photos 
      : [deal?.main_photo || FALLBACK_IMG];
  }, [deal]);
  const photos = gallery;
  const photoIdx = activeImgIdx;

  // Idée #5 : Jusqu'à 3 propriétés similaires actives (même catégorie ou même région en priorité)
  const similarDeals = useMemo(() => {
    if (!deal) return [];
    const pool = Array.isArray(allDeals) && allDeals.length > 0 ? allDeals : liveDealsData;
    const currentPrice = Number(deal.price) || 0;

    return pool
      .filter(d => d && d.id !== deal.id && d.mls_number !== deal.mls_number && d.status !== 'Vendu')
      .map(d => {
        const sameCategory = d.category && deal.category && d.category === deal.category;
        const sameRegion = d.region && deal.region && d.region === deal.region;
        const score = (sameCategory ? 2 : 0) + (sameRegion ? 1 : 0);
        const priceDiff = Math.abs((Number(d.price) || 0) - currentPrice);
        return { dealItem: d, score, priceDiff };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.priceDiff - b.priceDiff;
      })
      .slice(0, 3)
      .map(item => item.dealItem);
  }, [deal, allDeals]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        else onClose();
      }
      if (e.key === 'ArrowRight' && gallery.length > 1) {
        setActiveImgIdx(prev => (prev + 1) % gallery.length);
      }
      if (e.key === 'ArrowLeft' && gallery.length > 1) {
        setActiveImgIdx(prev => (prev - 1 + gallery.length) % gallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, gallery.length, isLightboxOpen]);

  if (!deal) return null;

  const handlePrev = () => setActiveImgIdx(prev => (prev - 1 + gallery.length) % gallery.length);
  const handleNext = () => setActiveImgIdx(prev => (prev + 1) % gallery.length);

  const rawSpecs = deal.specs || deal.specifications || {};
  const cleanSpecs = Object.entries(rawSpecs).filter(([k, v]) => {
    if (!k || !v) return false;
    const skipKeys = ['Français', 'Photos', "Conditions d'utilisation", 'Politique de confidentialité', 'Nom', 'Adresse courriel', 'Téléphone', 'Votre message'];
    if (skipKeys.includes(k)) return false;
    if (k.includes(deal.title) || v === '*' || v === '|') return false;
    return true;
  });

  const broker = (deal.brokers_details && deal.brokers_details[0]) || {
    name: deal.assigned_broker || 'Direction Himalaya',
    phone: '514-898-4898',
    email: 'r.rheaume@himalayacorp.com',
    photo: 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'
  };

  // Partage avec URL dédiée SEO /proprietes/22685883-... (#15)
  const handleShare = () => {
    const shareUrl = `${window.location.origin}${getPropertyUrlPath(deal)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const priceNum = Number(deal.price) || 0;
  const isSold = deal.status === 'Vendu';
  const showCalculator = deal.transaction_type !== 'Location' && priceNum >= 50000;
  const loanAmount = priceNum * (1 - downPaymentPct / 100);
  const monthlyRate = (interestRate / 100) / 12;
  const totalMonths = 25 * 12;
  const monthlyPayment = monthlyRate > 0
    ? Math.round((loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths)))
    : Math.round(loanAmount / totalMonths);

  // Simulateur de financement rapide intégré (20% mise de fonds, 4.79%, 25 ans = 300 mois)
  const quickMortgageMonthlyCAD = useMemo(() => {
    if (!(priceNum > 0)) return 0;
    const principal = priceNum * 0.8;
    const r = 0.0479 / 12;
    const n = 300;
    return Math.round((principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1));
  }, [priceNum]);

  const ndaUnlocked = isNdaSignedForDeal(deal.mls_number);
  const lang = t?.code || 'FR';
  const numLocale = lang === 'EN' ? 'en-CA' : 'fr-CA';
  const quickMortgageRate = activeRates[selectedCurrency] || 1;
  const quickMortgageConverted = Math.round(quickMortgageMonthlyCAD * quickMortgageRate).toLocaleString(numLocale);
  const quickMortgageCurrencySuffix =
    selectedCurrency === 'EUR' ? '€ EUR' : selectedCurrency === 'USD' ? '$ USD' : selectedCurrency === 'CNY' ? '¥ CNY' : 'CAD $';
  const displayCategory = pickLang(deal, 'category', lang) || tr(lang, 'Immobilier', 'Real Estate', 'Inmobiliaria', '房地产');
  const displayTitle = pickLang(deal, 'title', lang);
  const displayPrice = pickLang(deal, 'price_raw', lang);
  const displayDesc = pickLang(deal, 'description', lang);
  const displayUrl = pickLang(deal, 'url', lang) || deal.url;
  const displayTransactionType =
    deal.transaction_type === 'Location'
      ? tr(lang, 'À louer', 'For Rent', 'En alquiler', '出租')
      : tr(lang, 'À vendre', 'For Sale', 'En venta', '出售');

  return (
    <div className="modal-backdrop" ref={modalBackdropRef} onClick={onClose}>
      <div className="modal-panel" ref={modalPanelRef} onClick={e => e.stopPropagation()}>
        {/* Barre supérieure */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          background: 'rgba(18, 18, 21, 0.96)',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge-gold">
              {displayCategory} • {displayTransactionType}
            </span>
            {isSold && (
              <span style={{
                background: 'var(--gold)',
                color: '#09090b',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '3px 10px',
                borderRadius: '999px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                {tr(lang, 'VENDU / RÉALISÉ', 'SOLD / REALIZED', 'VENDIDO / REALIZADO', '已售 / 已成交')}
              </span>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              MLS <strong style={{ color: 'var(--text-main)' }}>{deal.mls_number}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleShare} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <Share2 size={13} />
              {copied
                ? tr(lang, 'Lien direct copié !', 'Direct link copied!', '¡Enlace directo copiado!', '直达链接已复制！')
                : tr(lang, 'Copier le lien', 'Copy direct link', 'Copiar enlace', '复制链接')}
            </button>
            {deal.pdf_url && (
              <a href={deal.pdf_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <FileText size={13} /> {tr(lang, 'Fiche imprimable', 'Printable Sheet', 'Ficha imprimible', '可打印宣传单')}
              </a>
            )}
            {displayUrl && (
              <a href={displayUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <ExternalLink size={13} /> {t?.modal?.originalListing || tr(lang, 'Fiche officielle', 'Original Listing', 'Ficha oficial', '官方房源页')}
              </a>
            )}
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ padding: '24px' }}>
          {/* Galerie photo haute résolution (#5 & Idée #17) */}
          <div style={{
            position: 'relative',
            height: '430px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#09090b',
            border: '1px solid var(--border-subtle)',
            marginBottom: '12px'
          }}>
            <img 
              src={gallery[activeImgIdx]} 
              alt={displayTitle}
              onClick={() => setIsLightboxOpen(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
              onError={e => { e.target.src = FALLBACK_IMG; }}
            />
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              title={tr(lang, 'Plein écran', 'View Fullscreen', 'Pantalla completa', '全屏查看')}
              style={{
                position: 'absolute', bottom: '12px', right: '14px',
                background: 'rgba(9,9,11,0.82)', border: '1px solid var(--border-subtle)',
                color: '#fff', padding: '6px 11px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', cursor: 'pointer'
              }}
            >
              <Maximize2 size={13} /> {tr(lang, 'Plein écran', 'Fullscreen', 'Pantalla completa', '全屏放大')}
            </button>
            {gallery.length > 1 && (
              <>
                <button 
                  type="button"
                  onClick={handlePrev}
                  aria-label={tr(lang, 'Photo précédente', 'Previous photo', 'Foto anterior', '上一张照片')}
                  style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(9,9,11,0.78)', border: '1px solid var(--border-gold)',
                    color: '#fff', width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  type="button"
                  onClick={handleNext}
                  aria-label={tr(lang, 'Photo suivante', 'Next photo', 'Foto siguiente', '下一张照片')}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(9,9,11,0.78)', border: '1px solid var(--border-gold)',
                    color: '#fff', width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
                <div style={{
                  position: 'absolute', bottom: '12px', left: '14px',
                  background: 'rgba(9,9,11,0.85)', padding: '4px 11px',
                  borderRadius: '999px', fontSize: '0.75rem', border: '1px solid var(--border-subtle)',
                  color: '#fff'
                }}>
                  {activeImgIdx + 1} / {gallery.length}
                </div>
              </>
            )}
          </div>

          {/* Miniatures complètes (#5) */}
          {gallery.length > 1 && (
            <div style={{
              display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '22px'
            }}>
              {gallery.map((p, idx) => (
                <img 
                  key={idx}
                  src={p}
                  alt=""
                  onClick={() => setActiveImgIdx(idx)}
                  onError={e => { e.target.src = FALLBACK_IMG; }}
                  style={{
                    width: '76px', height: '54px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer',
                    border: idx === activeImgIdx ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                    opacity: idx === activeImgIdx ? 1 : 0.55,
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          )}

          {/* Grille 2 colonnes éditoriale épurée (zéro boîte dans des boîtes #1) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}>
            <div>
              <h2 className="serif-title" style={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '8px' }}>
                {displayTitle}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '18px' }}>
                <MapPin size={15} color="var(--gold)" />
                <span>{deal.address ? `${deal.address}, ` : ''}{deal.city} ({deal.region})</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                flexWrap: 'wrap',
                paddingBottom: '18px',
                marginBottom: '22px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="serif-title gold-gradient-text" style={{
                      fontSize: '2.1rem',
                      fontWeight: 600,
                      lineHeight: 1.1
                    }}>
                      {displayPrice}
                    </div>

                    {/* Idée #11 : Sélecteur de devises Banque du Canada (CAD $ | EUR € | USD $ | CNY ¥) */}
                    {priceNum > 0 && (
                      <div
                        className="no-print"
                        role="group"
                        aria-label={tr(lang, 'Sélecteur de devise', 'Currency selector', 'Selector de divisa', '货币切换')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '999px',
                          padding: '2px',
                          background: 'rgba(255,255,255,0.03)',
                          gap: '2px'
                        }}
                      >
                        {CURRENCY_OPTIONS.map(curr => {
                          const active = selectedCurrency === curr.code;
                          return (
                            <button
                              key={curr.code}
                              type="button"
                              onClick={() => handleCurrencyChange(curr.code)}
                              style={{
                                background: active ? 'var(--gold)' : 'transparent',
                                color: active ? '#09090b' : 'var(--text-muted)',
                                fontWeight: active ? 700 : 500,
                                fontSize: '0.7rem',
                                padding: '3px 9px',
                                borderRadius: '999px',
                                border: 'none',
                                cursor: 'pointer',
                                letterSpacing: '0.04em',
                                transition: 'all 0.18s ease'
                              }}
                            >
                              {curr.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {priceNum > 0 && selectedCurrency !== 'CAD' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      flexWrap: 'wrap',
                      fontSize: '0.84rem',
                      color: 'var(--gold-light)'
                    }}>
                      <strong className="serif-title" style={{ fontSize: '1.18rem', fontWeight: 600 }}>
                        ≈ {Math.round(priceNum * (activeRates[selectedCurrency] || 1)).toLocaleString(lang === 'EN' ? 'en-CA' : 'fr-CA')}{' '}
                        {selectedCurrency === 'EUR' ? '€ EUR' : selectedCurrency === 'USD' ? '$ USD' : '¥ CNY (RMB)'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ({getCurrencyDisclaimerText(selectedCurrency, exchangeRateInfo, lang)})
                      </span>
                    </div>
                  )}
                </div>

                {/* Bouton direct vers les Outils & Calculateurs avec prix pré-rempli (#6) */}
                {showCalculator && onSimulateInTools && (
                  <button
                    onClick={() => onSimulateInTools(deal)}
                    className="editorial-link"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <Calculator size={14} color="var(--gold)" />
                    {tr(lang, 'Analyser dans nos Outils financiers', 'Analyze in Financial Tools', 'Analizar en Herramientas financieras', '在金融工具中模拟分析')}
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              <div className="badge-gold" style={{ marginBottom: '8px' }}>
                {t?.modal?.description || tr(lang, 'Description détaillée', 'Detailed Description', 'Descripción detallada', '详细说明')}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.75, marginBottom: '26px', whiteSpace: 'pre-line' }}>
                {displayDesc || t?.modal?.defaultDesc || tr(lang, 'Description détaillée disponible auprès du courtier inscripteur.', 'Full details available from the listing broker.', 'Descripción detallada disponible con el corredor responsable.', '详细资料可向负责经纪人索取。')}
              </p>

              {(deal.inclusions || deal.exclusions) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px',
                  paddingTop: '16px',
                  paddingBottom: '20px',
                  marginBottom: '22px',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  {deal.inclusions && (
                    <div>
                      <div className="badge-gold" style={{ marginBottom: '4px' }}>
                        {tr(lang, 'Inclusions', 'Inclusions', 'Inclusiones', '包含项目')}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{deal.inclusions}</div>
                    </div>
                  )}
                  {deal.exclusions && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
                        {tr(lang, 'Exclusions', 'Exclusions', 'Exclusiones', '不包含项目')}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{deal.exclusions}</div>
                    </div>
                  )}
                </div>
              )}

              {cleanSpecs.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '12px'
                  }}>
                    <div className="badge-gold">
                      {t?.modal?.specs || tr(lang, 'Caractéristiques techniques & Taxes', 'Technical Specifications & Taxes', 'Especificaciones técnicas e impuestos', '技术参数与税费')}
                    </div>

                    {/* Idée #2 : Convertisseur d'unités de superficie (pi² / acres ⇄ m² / ha) */}
                    <button
                      type="button"
                      className="no-print"
                      onClick={() => setUnitSystem(prev => (prev === 'imperial' ? 'metric' : 'imperial'))}
                      title={tr(
                        lang,
                        'Basculer entre unités impériales (pi² / acres) et métriques (m² / ha)',
                        'Toggle between imperial (sq.ft. / acres) and metric (m² / ha) units',
                        'Alternar entre unidades imperiales (pies² / acres) y métricas (m² / ha)',
                        '切换英制 (平方英尺 / 英亩) 与公制 (平方米 / 公顷) 面积单位'
                      )}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 11px',
                        borderRadius: '999px',
                        border: '1px solid var(--border-gold)',
                        background: unitSystem === 'metric' ? 'rgba(212, 175, 55, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                        color: 'var(--gold-light)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <ArrowLeftRight size={12} color="var(--gold)" />
                      <span style={{ opacity: unitSystem === 'imperial' ? 1 : 0.6, fontWeight: unitSystem === 'imperial' ? 700 : 500 }}>
                        {tr(lang, 'pi² / acres', 'sq.ft. / acres', 'pies² / acres', '平方英尺 / 英亩')}
                      </span>
                      <span style={{ color: 'var(--gold)' }}>⇄</span>
                      <span style={{ opacity: unitSystem === 'metric' ? 1 : 0.6, fontWeight: unitSystem === 'metric' ? 700 : 500 }}>
                        {tr(lang, 'm² / ha', 'm² / ha', 'm² / ha', '平方米 / 公顷')}
                      </span>
                    </button>
                  </div>

                  {/* Tableau architectural à filets fins (#1) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    columnGap: '28px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    {cleanSpecs.map(([label, val], i) => {
                      const specTuple = SPEC_TRANSLATIONS[label];
                      const displayLabel = specTuple
                        ? tr(lang, specTuple[0], specTuple[1], specTuple[2], specTuple[3])
                        : label;
                      const formattedVal = formatSpecUnitValue(val, unitSystem, lang);
                      return (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          gap: '12px',
                          padding: '10px 0',
                          borderBottom: '1px solid rgba(255,255,255,0.06)'
                        }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{displayLabel}</span>
                          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', textAlign: 'right' }}>{formattedVal}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Idée #5 — Intégration directe du « Himalaya Chiffrier » (MREX & SCHL APH Select) dans la fiche propriété */}
              {deal.price > 0 && deal.status !== 'Vendu' && (
                <div className="no-print" style={{ marginTop: cleanSpecs.length > 0 ? '26px' : '8px' }}>
                  <ChiffrierDealSimulator
                    deal={deal}
                    lang={lang}
                    compact={true}
                    onOpenFullChiffrier={(d) => {
                      if (onSimulateInTools) onSimulateInTools(d);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Colonne droite épurée : Courtier + Salle NDA + Simulateur (sans boîtes imbriquées #1, #4) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '26px',
              paddingLeft: '24px',
              borderLeft: '1px solid var(--border-subtle)'
            }}>
              <div style={{ paddingBottom: '22px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="badge-gold" style={{ marginBottom: '12px' }}>
                  {t?.modal?.listingBroker || tr(lang, 'Courtier inscripteur', 'Listing Broker', 'Corredor responsable', '负责经纪人')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img 
                    src={broker.photo} 
                    alt={broker.name}
                    style={{ width: '58px', aspectRatio: '314 / 460', borderRadius: '6px', objectFit: 'cover', objectPosition: 'top center', border: '1px solid var(--border-gold)', flexShrink: 0, display: 'block' }}
                    onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
                  />
                  <div>
                    <h4 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600 }}>{broker.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Immobilier Himalaya</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <a href={`tel:${broker.phone}`} className="btn-gold" style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem' }}>
                    <Phone size={14} /> {broker.phone}
                  </a>
                  <a
                    href={`mailto:${broker.email}?subject=MLS ${deal.mls_number} - ${displayTitle}`}
                    className="btn-outline"
                    style={{ padding: '9px 12px', fontSize: '0.82rem' }}
                    title={broker.email}
                  >
                    <Mail size={14} />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard && broker.email) {
                        navigator.clipboard.writeText(broker.email);
                        setEmailCopied(true);
                        setTimeout(() => setEmailCopied(false), 2200);
                      }
                    }}
                    className="btn-outline"
                    style={{ padding: '9px 12px', fontSize: '0.76rem' }}
                  >
                    {emailCopied
                      ? tr(lang, 'Courriel copié !', 'Email copied!', '¡Correo copiado!', '邮箱已复制！')
                      : tr(lang, 'Copier courriel', 'Copy Email', 'Copiar correo', '复制邮箱')}
                  </button>
                </div>

                {onFilterByBroker && (
                  <button 
                    onClick={() => { onFilterByBroker(broker.name); onClose(); }}
                    className="editorial-link"
                    style={{ fontSize: '0.73rem', marginTop: '4px' }}
                  >
                    {t?.modal?.seeBrokerMandates || tr(lang, 'Voir tous les mandats de', 'See all listings by', 'Ver todas las propiedades de', '查看该经纪人的全部房源：')} {broker.name} <ArrowRight size={13} />
                  </button>
                )}
              </div>

              {/* Salle de données NDA épurée */}
              <div style={{ paddingBottom: '22px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  <Sparkles size={14} /> {t?.modal?.dataRoomTitle || tr(lang, 'SALLE DE DONNÉES CONFIDENTIELLE', 'CONFIDENTIAL DATA ROOM', 'SALA DE DATOS CONFIDENCIAL', '机密数据室 (NDA)')}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.55 }}>
                  {t?.modal?.dataRoomDesc || tr(lang, 'Accès aux états financiers après signature de l’entente de confidentialité (NDA).', 'Access financial statements upon signing the Non-Disclosure Agreement (NDA).', 'Acceso a los estados financieros tras firmar el acuerdo de confidencialidad (NDA).', '签署保密协议 (NDA) 后即可查阅财务报表与机密运营数据。')}
                </p>
                {ndaUnlocked ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#e3c485', fontSize: '0.82rem', fontWeight: 600
                  }}>
                    <CheckCircle2 size={15} /> {t?.modal?.ndaUnlocked || tr(lang, 'NDA signé — Dossier demandé', 'NDA Signed — File Requested', 'NDA firmado — Expediente solicitado', '已签署 NDA — 资料已申请')}
                  </div>
                ) : (
                  <button 
                    onClick={() => { onClose(); onOpenNDA(deal); }}
                    className="btn-gold" 
                    style={{ width: '100%' }}
                  >
                    <Lock size={14} /> {t?.modal?.signNdaBtn || tr(lang, 'Signer le NDA (États financiers)', 'Sign NDA (Financial Statements)', 'Firmar NDA (Estados financieros)', '签署保密协议 (获取财务报表)')}
                  </button>
                )}
              </div>

              {/* Simulateur de financement + Lien vers Outils (#6) & Multi-Prêts (#2) */}
              {showCalculator && (
                <div>
                  <div className="badge-gold" style={{ marginBottom: '12px' }}>
                    <Calculator size={13} color="var(--gold)" /> {t?.modal?.calcTitle || tr(lang, 'Simulateur de financement', 'Financing Calculator', 'Simulador de financiamiento', '融资按揭模拟器')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {t?.modal?.downPayment || tr(lang, 'Mise de fonds', 'Down Payment', 'Pago inicial', '首付比例')} ({downPaymentPct}%)
                      </label>
                      <select
                        className="form-control"
                        style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        value={downPaymentPct}
                        onChange={e => setDownPaymentPct(Number(e.target.value))}
                      >
                        <option value={20}>20 % ({Math.round(priceNum * 0.2).toLocaleString('fr-CA')} $)</option>
                        <option value={25}>25 % ({Math.round(priceNum * 0.25).toLocaleString('fr-CA')} $)</option>
                        <option value={35}>35 % ({Math.round(priceNum * 0.35).toLocaleString('fr-CA')} $)</option>
                        <option value={50}>50 % ({Math.round(priceNum * 0.5).toLocaleString('fr-CA')} $)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {t?.modal?.interestRate || tr(lang, 'Taux annuel', 'Annual Rate', 'Tasa anual', '年利率')}
                      </label>
                      <select
                        className="form-control"
                        style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        value={interestRate}
                        onChange={e => setInterestRate(Number(e.target.value))}
                      >
                        <option value={4.49}>4,49 %</option>
                        <option value={4.99}>4,99 %</option>
                        <option value={5.25}>5,25 %</option>
                        <option value={5.95}>5,95 %</option>
                      </select>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    paddingTop: '10px', paddingBottom: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.82rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t?.modal?.monthlyEst || tr(lang, 'Versement mensuel (25 ans)', 'Monthly Payment (25 yrs)', 'Pago mensual (25 años)', '预估月供 (25年摊销)')}</span>
                    <strong className="serif-title" style={{ color: 'var(--gold-light)', fontSize: '1.35rem' }}>
                      {monthlyPayment.toLocaleString('fr-CA')} $ / {tr(lang, 'mois', 'mo', 'mes', '月')}
                    </strong>
                  </div>

                  {onSimulateInTools && (
                    <button
                      onClick={() => onSimulateInTools(deal)}
                      className="btn-outline"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: '12px',
                        fontSize: '0.78rem',
                        padding: '9px 12px',
                        borderColor: 'var(--border-gold)',
                        color: 'var(--gold-light)'
                      }}
                    >
                      <Calculator size={13} />
                      {tr(lang, 'Simuler rentabilité & taxe de bienvenue →', 'Simulate Full Return & Welcome Tax →', 'Simular rentabilidad e impuesto de transferencia →', '模拟投资回报率与欢迎税 →')}
                    </button>
                  )}

                  <a
                    href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      fontSize: '0.76rem',
                      color: 'var(--gold-light)',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{t?.modal?.multiPretsLink || tr(lang, 'Préqualification Multi-Prêts →', 'Multi-Prêts Pre-Qualification →', 'Precalificación Multi-Prêts →', 'Multi-Prêts 按揭预审 →')}</span>
                    <img
                      src="https://www.himalayacorp.com/gx/m/Multi_Prets.png"
                      alt="Multi-Prêts Hypothèques"
                      style={{ height: '18px', objectFit: 'contain' }}
                    />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Idée #5 : Section « Propriétés similaires » en bas de la fiche propriété */}
          {similarDeals.length > 0 && (
            <div
              className="no-print"
              style={{
                marginTop: '36px',
                paddingTop: '28px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '18px'
              }}>
                <div>
                  <div className="badge-gold" style={{ marginBottom: '4px' }}>
                    {tr(lang, 'OPPORTUNITÉS COMPARABLES', 'COMPARABLE OPPORTUNITIES', 'OPORTUNIDADES COMPARABLES', '同类精选资产')}
                  </div>
                  <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600 }}>
                    {tr(lang, 'Propriétés similaires', 'Similar Properties', 'Propiedades similares', '相似物业推荐')}
                  </h3>
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {tr(
                    lang,
                    'Même catégorie d’actif ou même région',
                    'Same asset category or same region',
                    'Misma categoría de activo o misma región',
                    '同类别商业资产或同一地区'
                  )}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '24px'
              }}>
                {similarDeals.map(sim => {
                  const simTitle = pickLang(sim, 'title', lang);
                  const simCategory = pickLang(sim, 'category', lang) || tr(lang, 'Immobilier', 'Real Estate', 'Inmobiliaria', '房地产');
                  const simPrice = pickLang(sim, 'price_raw', lang);
                  const simPhoto = (Array.isArray(sim.photos) && sim.photos[0]) || sim.main_photo || FALLBACK_IMG;

                  return (
                    <div
                      key={sim.id || sim.mls_number}
                      onClick={() => {
                        if (onSelectDeal) onSelectDeal(sim);
                        if (modalPanelRef.current) {
                          modalPanelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                        if (modalBackdropRef.current) {
                          modalBackdropRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        aspectRatio: '16 / 10',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#09090b',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '2px'
                      }}>
                        <img
                          src={simPhoto}
                          alt={simTitle}
                          onError={e => { e.target.src = FALLBACK_IMG; }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.35s ease'
                          }}
                        />
                      </div>

                      <div style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)'
                      }}>
                        {simCategory}
                      </div>

                      <div className="serif-title" style={{
                        fontSize: '1.08rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        lineHeight: 1.25
                      }}>
                        {simTitle}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <MapPin size={12} color="var(--gold)" />
                        <span>{sim.city}{sim.region ? ` (${sim.region})` : ''}</span>
                      </div>

                      <div className="serif-title gold-gradient-text" style={{
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        marginTop: '2px'
                      }}>
                        {simPrice}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Plein Écran (Idée #17) */}
      {isLightboxOpen && (
        <div
          onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(5,5,7,0.96)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
          }}
        >
          {/* Compteur en haut à gauche */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', top: '22px', left: '28px',
              background: 'rgba(9,9,11,0.85)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.06em'
            }}
          >
            {activeImgIdx + 1} / {gallery.length}
          </div>

          {/* Bouton de fermeture × */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label={tr(lang, 'Fermer le plein écran', 'Close fullscreen', 'Cerrar pantalla completa', '关闭全屏')}
            style={{
              position: 'absolute', top: '20px', right: '24px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-gold)',
              color: '#fff', width: '42px', height: '42px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.35rem', lineHeight: 1, cursor: 'pointer'
            }}
          >
            ×
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label={tr(lang, 'Photo précédente', 'Previous photo', 'Foto anterior', '上一张照片')}
                style={{
                  position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(9,9,11,0.85)', border: '1px solid var(--border-gold)',
                  color: '#fff', width: '48px', height: '48px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label={tr(lang, 'Photo suivante', 'Next photo', 'Foto siguiente', '下一张照片')}
                style={{
                  position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(9,9,11,0.85)', border: '1px solid var(--border-gold)',
                  color: '#fff', width: '48px', height: '48px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <img
            src={gallery[activeImgIdx]}
            alt={displayTitle}
            onClick={(e) => e.stopPropagation()}
            onError={e => { e.target.src = FALLBACK_IMG; }}
            style={{
              maxHeight: '86vh',
              maxWidth: '92vw',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}
          />

          {/* Légende traduite de la propriété */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: '14px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              maxWidth: '80vw'
            }}
          >
            <span className="serif-title" style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>
              {displayTitle}
            </span>
            {deal.city && (
              <span style={{ color: 'var(--gold-light)', marginLeft: '10px', fontSize: '0.82rem' }}>
                • {deal.city}{deal.region ? ` (${deal.region})` : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
