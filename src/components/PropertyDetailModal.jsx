import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, MapPin, Phone, Mail, ExternalLink, FileText, Maximize2,
  ChevronLeft, ChevronRight, Sparkles, Lock, Share2, CheckCircle2, Calculator, ArrowRight
} from 'lucide-react';
import { isNdaSignedForDeal } from '../utils/prospectionBridge';
import { tr, pickLang } from '../data/translations';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80';

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

export default function PropertyDetailModal({ deal, t, onClose, onOpenNDA, onFilterByBroker, onSimulateInTools }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Calculateur de financement rapide intégré
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRate, setInterestRate] = useState(5.25);

  const photos = useMemo(() => {
    return Array.isArray(deal?.photos) && deal.photos.length > 0 
      ? deal.photos 
      : [deal?.main_photo || FALLBACK_IMG];
  }, [deal]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
      if (e.key === 'ArrowLeft' && photos.length > 1) {
        setPhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight' && photos.length > 1) {
        setPhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, photos.length, lightboxOpen]);

  if (!deal) return null;

  const handlePrev = () => setPhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  const handleNext = () => setPhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1));

  const cleanSpecs = Object.entries(deal.specs || {}).filter(([k, v]) => {
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

  // Partage avec lien direct ?propriete=... (#16 & #18)
  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?propriete=${encodeURIComponent(deal.mls_number)}#proprietes`;
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

  const ndaUnlocked = isNdaSignedForDeal(deal.mls_number);
  const lang = t?.code || 'FR';
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
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
          {/* Galerie photo haute résolution (#5) */}
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
              src={photos[photoIdx]} 
              alt={displayTitle}
              onClick={() => setLightboxOpen(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
              onError={e => { e.target.src = FALLBACK_IMG; }}
            />
            <button
              onClick={() => setLightboxOpen(true)}
              title={tr(lang, 'Plein écran', 'View Fullscreen', 'Pantalla completa', '全屏查看')}
              style={{
                position: 'absolute', top: '12px', right: '14px',
                background: 'rgba(9,9,11,0.82)', border: '1px solid var(--border-subtle)',
                color: '#fff', padding: '6px 10px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', cursor: 'pointer'
              }}
            >
              <Maximize2 size={13} /> {tr(lang, 'Agrandir', 'Fullscreen', 'Ampliar', '全屏放大')}
            </button>
            {photos.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
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
                  onClick={handleNext}
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
                  position: 'absolute', bottom: '12px', right: '14px',
                  background: 'rgba(9,9,11,0.85)', padding: '4px 11px',
                  borderRadius: '999px', fontSize: '0.75rem', border: '1px solid var(--border-subtle)'
                }}>
                  {photoIdx + 1} / {photos.length} {tr(lang, 'photos', 'photos', 'fotos', '张照片')}
                </div>
              </>
            )}
          </div>

          {/* Miniatures complètes (#5) */}
          {photos.length > 1 && (
            <div style={{
              display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '22px'
            }}>
              {photos.map((p, idx) => (
                <img 
                  key={idx}
                  src={p}
                  alt=""
                  onClick={() => setPhotoIdx(idx)}
                  onError={e => { e.target.src = FALLBACK_IMG; }}
                  style={{
                    width: '76px', height: '54px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer',
                    border: idx === photoIdx ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                    opacity: idx === photoIdx ? 1 : 0.55,
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
                <div className="serif-title gold-gradient-text" style={{
                  fontSize: '2.1rem',
                  fontWeight: 600,
                  lineHeight: 1.1
                }}>
                  {displayPrice}
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
                  <div className="badge-gold" style={{ marginBottom: '12px' }}>
                    {t?.modal?.specs || tr(lang, 'Caractéristiques techniques & Taxes', 'Technical Specifications & Taxes', 'Especificaciones técnicas e impuestos', '技术参数与税费')}
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
                          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', textAlign: 'right' }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
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
        </div>
      </div>

      {/* Lightbox Plein Écran */}
      {lightboxOpen && (
        <div
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(5, 5, 7, 0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: '20px', right: '24px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-gold)',
              color: '#fff', width: '42px', height: '42px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
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
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
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
            src={photos[photoIdx]}
            alt={displayTitle}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
          />
        </div>
      )}
    </div>
  );
}
