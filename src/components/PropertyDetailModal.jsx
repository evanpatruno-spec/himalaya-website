import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, MapPin, Phone, Mail, ExternalLink, FileText, Maximize2,
  ChevronLeft, ChevronRight, Sparkles, Lock, Share2, CheckCircle2, Calculator, ArrowRight
} from 'lucide-react';
import { isNdaSignedForDeal } from '../utils/prospectionBridge';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80';

const SPEC_TRANSLATIONS_EN = {
  "No MLS": "MLS / Centris #",
  "Région": "Region",
  "Quartier": "Neighborhood",
  "Pays": "Country",
  "Superficie du terrain": "Lot Area",
  "Superficie habitable": "Living Area",
  "Superficie commerciale": "Commercial Area",
  "Superficie du bâtiment": "Building Area",
  "Dimensions du terrain": "Lot Dimensions",
  "Dimensions du bâtiment": "Building Dimensions",
  "Année de construction": "Year Built",
  "Année d'évaluation": "Assessment Year",
  "Évaluation municipale du terrain": "Municipal Land Assessment",
  "Évaluation municipale du bâtiment": "Municipal Building Assessment",
  "Taxes municipales": "Municipal Taxes",
  "Taxes scolaires": "School Taxes",
  "Nombre d'unités au total": "Total Units",
  "Type de bâtiment": "Building Style",
  "Nombre de chambres": "Bedrooms",
  "Nombre de salles de bains": "Bathrooms",
  "Nombre de salles d'eau": "Powder Rooms",
  "Stationnement total": "Parking",
  "Reprise de finance": "Foreclosure",
  "Approvisionnement en eau": "Water Supply",
  "Système d'égouts": "Sewage System",
  "Particularités": "Features",
  "Proximité": "Nearby",
  "Topographie": "Topography",
  "Zonage": "Zoning"
};

export default function PropertyDetailModal({ deal, t, onClose, onOpenNDA, onFilterByBroker, onSimulateInTools }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const isEn = t?.code === 'EN';
  const displayCategory = isEn ? (deal.category_en || deal.category || 'Real Estate') : (deal.category || deal.transaction_type || 'Immobilier');
  const displayTitle = isEn ? (deal.title_en || deal.title) : deal.title;
  const displayPrice = isEn ? (deal.price_raw_en || deal.price_raw) : deal.price_raw;
  const displayDesc = isEn ? (deal.description_en || deal.description) : deal.description;
  const displayUrl = isEn ? (deal.url_en || deal.url) : deal.url;

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
              {displayCategory}
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
                {isEn ? 'SOLD / REALIZED' : 'VENDU / RÉALISÉ'}
              </span>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              MLS <strong style={{ color: 'var(--text-main)' }}>{deal.mls_number}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleShare} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <Share2 size={13} />
              {copied ? (isEn ? 'Direct link copied!' : 'Lien direct copié !') : (isEn ? 'Copy direct link' : 'Copier le lien')}
            </button>
            {deal.pdf_url && (
              <a href={deal.pdf_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <FileText size={13} /> {isEn ? 'Printable Sheet' : 'Fiche imprimable'}
              </a>
            )}
            {displayUrl && (
              <a href={displayUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <ExternalLink size={13} /> {t?.modal?.originalListing || 'Source'}
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
              title={isEn ? 'View Fullscreen' : 'Plein écran'}
              style={{
                position: 'absolute', top: '12px', right: '14px',
                background: 'rgba(9,9,11,0.82)', border: '1px solid var(--border-subtle)',
                color: '#fff', padding: '6px 10px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', cursor: 'pointer'
              }}
            >
              <Maximize2 size={13} /> {isEn ? 'Fullscreen' : 'Agrandir'}
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
                  {photoIdx + 1} / {photos.length} {isEn ? 'photos' : 'photos'}
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

          {/* Grille 2 colonnes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '6px' }}>
                {displayTitle}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '14px' }}>
                <MapPin size={15} color="var(--gold)" />
                <span>{deal.address ? `${deal.address}, ` : ''}{deal.city} ({deal.region})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: 'var(--gold-light)',
                  padding: '10px 16px',
                  background: 'rgba(200, 164, 93, 0.08)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}>
                  {displayPrice}
                </div>

                {/* Bouton direct vers les Outils & Calculateurs avec prix pré-rempli (#6) */}
                {showCalculator && onSimulateInTools && (
                  <button
                    onClick={() => onSimulateInTools(deal)}
                    className="btn-outline"
                    style={{
                      borderColor: 'var(--border-gold)',
                      color: 'var(--gold-light)',
                      padding: '10px 14px',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px'
                    }}
                  >
                    <Calculator size={14} color="var(--gold)" />
                    {isEn ? 'Analyze in Financial Tools' : 'Analyser dans nos Outils financiers'}
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              <h3 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t?.modal?.description || 'Description détaillée'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.72, marginBottom: '22px', whiteSpace: 'pre-line' }}>
                {displayDesc || t?.modal?.defaultDesc || 'Description détaillée disponible auprès du courtier inscripteur.'}
              </p>

              {(deal.inclusions || deal.exclusions) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px',
                  marginBottom: '22px'
                }}>
                  {deal.inclusions && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                        {isEn ? 'Inclusions' : 'Inclusions'}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{deal.inclusions}</div>
                    </div>
                  )}
                  {deal.exclusions && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                        {isEn ? 'Exclusions' : 'Exclusions'}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{deal.exclusions}</div>
                    </div>
                  )}
                </div>
              )}

              {cleanSpecs.length > 0 && (
                <>
                  <h3 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isEn ? 'Technical Specifications & Taxes' : (t?.modal?.specs || 'Caractéristiques techniques & Taxes')}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
                    gap: '8px'
                  }}>
                    {cleanSpecs.map(([label, val], i) => {
                      const displayLabel = isEn ? (SPEC_TRANSLATIONS_EN[label] || label) : label;
                      return (
                        <div key={i} style={{
                          background: 'rgba(255,255,255,0.025)',
                          border: '1px solid var(--border-subtle)',
                          padding: '9px 12px',
                          borderRadius: '7px'
                        }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{displayLabel}</div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{val}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Colonne droite : Courtier + Salle NDA + Simulateur */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '12px',
                padding: '18px'
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold)', marginBottom: '10px', fontWeight: 600 }}>
                  {t?.modal?.listingBroker || 'Courtier inscripteur'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <img 
                    src={broker.photo} 
                    alt={broker.name}
                    style={{ width: '54px', aspectRatio: '314 / 543', borderRadius: '8px', objectFit: 'cover', objectPosition: 'top center', border: '1px solid var(--border-gold)', flexShrink: 0, display: 'block' }}
                    onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{broker.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Immobilier Himalaya</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <a href={`tel:${broker.phone}`} className="btn-gold" style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem' }}>
                    <Phone size={14} /> {broker.phone}
                  </a>
                  <a href={`mailto:${broker.email}?subject=MLS ${deal.mls_number} - ${deal.title}`} className="btn-outline" style={{ padding: '9px 12px', fontSize: '0.82rem' }}>
                    <Mail size={14} />
                  </a>
                </div>

                {onFilterByBroker && (
                  <button 
                    onClick={() => { onFilterByBroker(broker.name); onClose(); }}
                    style={{
                      width: '100%', background: 'transparent', border: 'none',
                      color: 'var(--gold-light)', fontSize: '0.78rem', cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {t?.modal?.seeBrokerMandates || 'Voir tous les mandats de'} {broker.name} →
                  </button>
                )}
              </div>

              {/* Salle de données NDA */}
              <div style={{
                background: 'rgba(200, 164, 93, 0.07)',
                border: '1px solid var(--border-gold)',
                borderRadius: '12px',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px' }}>
                  <Sparkles size={14} /> {t?.modal?.dataRoomTitle || 'SALLE DE DONNÉES CONFIDENTIELLE'}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  {t?.modal?.dataRoomDesc || 'Accès aux états financiers après signature de l’entente de confidentialité (NDA).'}
                </p>
                {ndaUnlocked ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 12px', borderRadius: '8px',
                    background: 'rgba(200, 164, 93, 0.14)', border: '1px solid var(--success)',
                    color: '#e3c485', fontSize: '0.8rem', fontWeight: 600
                  }}>
                    <CheckCircle2 size={15} /> {t?.modal?.ndaUnlocked || 'NDA signé — Dossier demandé'}
                  </div>
                ) : (
                  <button 
                    onClick={() => { onClose(); onOpenNDA(deal); }}
                    className="btn-gold" 
                    style={{ width: '100%' }}
                  >
                    <Lock size={14} /> {t?.modal?.signNdaBtn || 'Signer le NDA (États financiers)'}
                  </button>
                )}
              </div>

              {/* Simulateur de financement + Lien vers Outils (#6) & Multi-Prêts (#2) */}
              {showCalculator && (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                    <Calculator size={14} color="var(--gold)" /> {t?.modal?.calcTitle || 'Simulateur de financement'}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {t?.modal?.downPayment || 'Mise de fonds'} ({downPaymentPct}%)
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
                        {t?.modal?.interestRate || 'Taux annuel'}
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
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem',
                    marginBottom: '12px'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t?.modal?.monthlyEst || 'Versement mensuel (25 ans)'}</span>
                    <strong style={{ color: 'var(--gold-light)', fontSize: '0.96rem' }}>
                      {monthlyPayment.toLocaleString('fr-CA')} $ / {isEn ? 'mo' : 'mois'}
                    </strong>
                  </div>

                  {onSimulateInTools && (
                    <button
                      onClick={() => onSimulateInTools(deal)}
                      className="btn-outline"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        fontSize: '0.78rem',
                        padding: '8px 12px',
                        borderColor: 'var(--border-gold)',
                        color: 'var(--gold-light)'
                      }}
                    >
                      <Calculator size={13} />
                      {isEn ? 'Simulate Full Return & Welcome Tax →' : 'Simuler rentabilité & taxe de bienvenue →'}
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
                      marginTop: '6px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.75rem',
                      color: 'var(--gold-light)',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{t?.modal?.multiPretsLink || 'Préqualification Multi-Prêts →'}</span>
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
