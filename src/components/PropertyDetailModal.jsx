import React, { useState } from 'react';
import { 
  X, MapPin, Tag, Building2, Phone, Mail, ExternalLink, 
  ChevronLeft, ChevronRight, Shield, FileText, Sparkles, CheckCircle2, Lock, Share2
} from 'lucide-react';

export default function PropertyDetailModal({ deal, onClose, onOpenNDA, onFilterByBroker }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!deal) return null;

  const photos = Array.isArray(deal.photos) && deal.photos.length > 0 
    ? deal.photos 
    : [deal.main_photo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'];

  const handlePrev = () => setPhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  const handleNext = () => setPhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1));

  // Filter useful specs from the scraped specs object
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
    email: 'info@himalayacorp.com',
    photo: 'https://www.himalayacorp.com/gx/himalaya-immobilier-logo.png'
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(deal.url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 26px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          background: 'rgba(12, 19, 17, 0.96)',
          backdropFilter: 'blur(12px)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="badge-gold">
              {deal.transaction_type || 'Vente'} • {deal.category || 'Immobilier'}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              No Centris / MLS : <strong style={{ color: 'var(--text-main)' }}>{deal.mls_number}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleShare} className="btn-outline" style={{ padding: '7px 12px', fontSize: '0.8rem' }}>
              <Share2 size={14} />
              {copied ? 'Lien copié !' : 'Partager'}
            </button>
            {deal.url && (
              <a href={deal.url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '7px 12px', fontSize: '0.8rem' }}>
                <ExternalLink size={14} /> Fiche originale
              </a>
            )}
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                width: '36px',
                height: '36px',
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

        {/* Main Content */}
        <div style={{ padding: '26px' }}>
          {/* Photo Gallery */}
          <div style={{
            position: 'relative',
            height: '420px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: '#050807',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px'
          }}>
            <img 
              src={photos[photoIdx]} 
              alt={deal.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'; }}
            />
            {photos.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  style={{
                    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(7,11,10,0.75)', border: '1px solid var(--border-gold)',
                    color: '#fff', width: '42px', height: '42px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  onClick={handleNext}
                  style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(7,11,10,0.75)', border: '1px solid var(--border-gold)',
                    color: '#fff', width: '42px', height: '42px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <ChevronRight size={22} />
                </button>
                <div style={{
                  position: 'absolute', bottom: '14px', right: '16px',
                  background: 'rgba(7,11,10,0.82)', padding: '5px 12px',
                  borderRadius: '999px', fontSize: '0.78rem', border: '1px solid var(--border-subtle)'
                }}>
                  Photo {photoIdx + 1} / {photos.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div style={{
              display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '22px'
            }}>
              {photos.slice(0, 12).map((p, idx) => (
                <img 
                  key={idx}
                  src={p}
                  alt=""
                  onClick={() => setPhotoIdx(idx)}
                  style={{
                    width: '76px', height: '54px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer',
                    border: idx === photoIdx ? '2px solid var(--gold)' : '1px solid transparent',
                    opacity: idx === photoIdx ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          )}

          {/* Two Column Layout: Details & Broker / Data Room */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            alignItems: 'start'
          }}>
            {/* Left Column */}
            <div style={{ gridColumn: 'span 1' }}>
              <h2 className="serif-title" style={{ fontSize: '2rem', lineHeight: 1.2, marginBottom: '8px' }}>
                {deal.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <MapPin size={16} color="var(--gold)" />
                <span>{deal.address}, {deal.city} ({deal.region})</span>
              </div>

              <div style={{
                fontSize: '1.65rem',
                fontWeight: 700,
                color: 'var(--gold-light)',
                padding: '14px 18px',
                background: 'rgba(200, 164, 93, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: '10px',
                marginBottom: '22px',
                display: 'inline-block'
              }}>
                {deal.price_raw}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Description de la propriété
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.75, marginBottom: '24px', whiteSpace: 'pre-line' }}>
                {deal.description || 'Description détaillée disponible auprès du courtier inscripteur.'}
              </p>

              {/* Caracteristiques techniques */}
              {cleanSpecs.length > 0 && (
                <>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Caractéristiques & Fiche Technique
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    {cleanSpecs.map(([label, val], i) => (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        padding: '10px 12px',
                        borderRadius: '8px'
                      }}>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Broker Card + Exclusive Prospection AI Integration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Courtier Inscripteur */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '22px'
              }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '14px', fontWeight: 600 }}>
                  Courtier Inscripteur Himalaya
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                  <img 
                    src={broker.photo} 
                    alt={broker.name}
                    style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }}
                    onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{broker.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Immobilier Himalaya Real Estate Corp.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  <a href={`tel:${broker.phone}`} className="btn-gold" style={{ width: '100%' }}>
                    <Phone size={16} /> {broker.phone}
                  </a>
                  <a href={`mailto:${broker.email}?subject=Demande d'information - MLS ${deal.mls_number} (${deal.title})`} className="btn-outline" style={{ width: '100%' }}>
                    <Mail size={16} /> {broker.email}
                  </a>
                </div>

                {onFilterByBroker && (
                  <button 
                    onClick={() => { onFilterByBroker(broker.name); onClose(); }}
                    style={{
                      width: '100%', background: 'transparent', border: 'none',
                      color: 'var(--gold-light)', fontSize: '0.82rem', cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Voir tous les mandats de {broker.name} →
                  </button>
                )}
              </div>

              {/* INNOVATION : Pont vers Himalaya Prospection (Salle de données & NDA électronique) */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(200, 164, 93, 0.14) 0%, rgba(14, 21, 19, 0.95) 100%)',
                border: '1px solid var(--gold)',
                borderRadius: '14px',
                padding: '22px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                  <Sparkles size={16} /> SALLE DE DONNÉES & NDA AUTOMATISÉ
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Ce dossier bénéficie de la technologie <strong>Himalaya Prospection & CRM</strong> : signature d’entente de confidentialité (NDA) en ligne et accès rapide au mémorandum financier pour acheteurs qualifiés.
                </p>
                <button 
                  onClick={() => { onClose(); onOpenNDA(deal); }}
                  className="btn-gold" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Lock size={15} /> Signer le NDA & Accéder au Dossier Financier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
