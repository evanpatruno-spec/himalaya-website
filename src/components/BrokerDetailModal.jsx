import React, { useEffect, useState } from 'react';
import { X, Phone, Mail, MapPin, Globe, ChevronRight, Share2 } from 'lucide-react';
import { HIMALAYA_FRANCHISES } from '../data/siteContent';

export default function BrokerDetailModal({ broker, deals = [], t, onClose, onSelectDeal }) {
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!broker) return null;

  const isEn = Boolean(t?.code && t.code !== 'FR');
  const displayShortTitle = isEn ? (broker.shortTitle_en || broker.shortTitle) : broker.shortTitle;
  const displayTitle = isEn ? (broker.title_en || broker.title) : broker.title;
  const displayAddress = isEn ? (broker.address_en || broker.city_en || broker.city) : (broker.address || broker.city);
  const displayBio = isEn ? (broker.bio_en || broker.bio) : broker.bio;
  const displayMarkets = isEn ? (broker.markets_en || broker.markets) : broker.markets;
  const brokerFranchises = HIMALAYA_FRANCHISES.filter(f => f.brokerIds && f.brokerIds.includes(broker.id));

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?courtier=${encodeURIComponent(broker.id)}#courtiers`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(18, 18, 21, 0.96)',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span className="badge-gold">{displayShortTitle}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handleShareProfile} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <Share2 size={13} />
              {copied ? (isEn ? 'Profile link copied!' : 'Lien du profil copié !') : (isEn ? 'Share profile' : 'Partager le profil')}
            </button>
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

        <div style={{ padding: '28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            paddingBottom: '24px',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <img
                src={broker.photo}
                alt={broker.name}
                style={{
                  width: '96px',
                  aspectRatio: '314 / 460',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  border: '1px solid var(--border-gold)',
                  flexShrink: 0,
                  display: 'block'
                }}
                onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
              />
              <div>
                <h2 className="serif-title" style={{ fontSize: '1.85rem', fontWeight: 600, marginBottom: '4px' }}>{broker.name}</h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--gold-light)', marginBottom: '6px' }}>{displayTitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={13} color="var(--gold)" /> {displayAddress}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <a href={`tel:${broker.phone}`} className="btn-gold">
                <Phone size={15} /> {broker.phone}
              </a>
              <a href={`mailto:${broker.email}`} className="btn-outline" title={broker.email}>
                <Mail size={15} /> {broker.email}
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
                style={{ padding: '8px 12px', fontSize: '0.76rem' }}
              >
                {emailCopied ? (isEn ? 'Copied!' : 'Copié !') : (isEn ? 'Copy Email' : 'Copier courriel')}
              </button>
            </div>
          </div>

          {displayBio && (
            <div style={{ marginBottom: '24px' }}>
              <div className="badge-gold" style={{ marginBottom: '8px' }}>
                {isEn ? 'Biography & Expertise' : 'Parcours & Expertise'}
              </div>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: 1.75,
                whiteSpace: 'pre-line'
              }}>
                {displayBio}
              </p>
            </div>
          )}

          {displayMarkets && displayMarkets.length > 0 && (
            <div style={{
              paddingTop: '16px',
              paddingBottom: deals.length > 0 ? '20px' : '4px',
              marginBottom: deals.length > 0 ? '24px' : '0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: deals.length > 0 ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.73rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>
                <Globe size={13} style={{ display: 'inline', marginRight: '6px' }} />
                {t?.brokers?.specialties || 'Marchés & Pays'}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{displayMarkets.join(' • ')}</div>
            </div>
          )}

          {brokerFranchises.length > 0 && (
            <div style={{
              paddingBottom: deals.length > 0 ? '20px' : '4px',
              marginBottom: deals.length > 0 ? '24px' : '0',
              borderBottom: deals.length > 0 ? '1px solid var(--border-subtle)' : 'none'
            }}>
              <div className="badge-gold" style={{ marginBottom: '14px' }}>
                {isEn ? 'Franchises Supported' : 'Franchises accompagnées'}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '28px',
                flexWrap: 'wrap'
              }}>
                {brokerFranchises.map(fr => (
                  <div key={fr.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {fr.logo && (
                      <img
                        src={fr.logo}
                        alt={fr.name}
                        title={fr.name}
                        style={{
                          height: '32px',
                          maxWidth: '120px',
                          width: 'auto',
                          objectFit: 'contain',
                          filter: fr.invertLogo ? 'brightness(0) invert(1)' : 'none'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {deals.length > 0 && (
            <div>
              <div className="badge-gold" style={{ marginBottom: '14px' }}>
                {deals.length} {t?.brokers?.activeMandates || 'inscription(s)'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {deals.map(d => (
                  <div
                    key={d.id}
                    onClick={() => { onClose(); onSelectDeal(d); }}
                    style={{
                      background: 'transparent',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ aspectRatio: '16 / 10', borderRadius: '6px', overflow: 'hidden', position: 'relative', marginBottom: '10px' }}>
                      <img
                        src={d.main_photo}
                        alt={isEn ? (d.title_en || d.title) : d.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'; }}
                      />
                      <span style={{
                        position: 'absolute', bottom: '8px', left: '10px',
                        fontSize: '0.86rem', fontWeight: 700, color: 'var(--gold-light)',
                        textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                      }}>
                        {isEn ? (d.price_raw_en || d.price_raw) : d.price_raw}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div className="serif-title" style={{ fontSize: '1.05rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {isEn ? (d.title_en || d.title) : d.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {d.city}
                        </div>
                      </div>
                      <ChevronRight size={15} color="var(--gold)" style={{ flexShrink: 0 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
