import React, { useEffect } from 'react';
import { X, Phone, Mail, MapPin, Globe, ChevronRight } from 'lucide-react';

export default function BrokerDetailModal({ broker, deals = [], t, onClose, onSelectDeal }) {
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

  const isEn = t?.code === 'EN';
  const displayShortTitle = isEn ? (broker.shortTitle_en || broker.shortTitle) : broker.shortTitle;
  const displayTitle = isEn ? (broker.title_en || broker.title) : broker.title;
  const displayAddress = isEn ? (broker.address_en || broker.city_en || broker.city) : (broker.address || broker.city);
  const displayBio = isEn ? (broker.bio_en || broker.bio) : broker.bio;
  const displayMarkets = isEn ? (broker.markets_en || broker.markets) : broker.markets;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(12, 19, 17, 0.96)'
        }}>
          <span className="badge-gold">{displayShortTitle}</span>
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

        <div style={{ padding: '26px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            marginBottom: '26px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <img
                src={broker.photo}
                alt={broker.name}
                style={{
                  width: '96px',
                  aspectRatio: '314 / 543',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  border: '1px solid var(--border-gold)',
                  flexShrink: 0,
                  display: 'block'
                }}
                onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
              />
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '4px' }}>{broker.name}</h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--gold-light)', marginBottom: '6px' }}>{displayTitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={13} color="var(--gold)" /> {displayAddress}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <a href={`tel:${broker.phone}`} className="btn-gold">
                <Phone size={15} /> {broker.phone}
              </a>
              <a href={`mailto:${broker.email}`} className="btn-outline">
                <Mail size={15} /> {broker.email}
              </a>
            </div>
          </div>

          {displayBio && (
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              lineHeight: 1.65,
              padding: '16px 18px',
              background: 'rgba(255,255,255,0.025)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '22px',
              whiteSpace: 'pre-line'
            }}>
              {displayBio}
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: deals.length > 0 ? '26px' : '0' }}>
            {displayMarkets && displayMarkets.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Globe size={12} style={{ display: 'inline', marginRight: '5px', color: 'var(--gold)' }} />
                  {t?.brokers?.specialties || 'Marchés & Pays'}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{displayMarkets.join(' • ')}</div>
              </div>
            )}
          </div>

          {deals.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--gold-light)' }}>
                {deals.length} {t?.brokers?.activeMandates || 'inscription(s)'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {deals.map(d => (
                  <div
                    key={d.id}
                    onClick={() => { onClose(); onSelectDeal(d); }}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={d.main_photo}
                        alt={isEn ? (d.title_en || d.title) : d.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'; }}
                      />
                      <span style={{
                        position: 'absolute', bottom: '8px', left: '8px',
                        background: 'rgba(7,11,10,0.9)', padding: '3px 8px', borderRadius: '5px',
                        fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-light)'
                      }}>
                        {isEn ? (d.price_raw_en || d.price_raw) : d.price_raw}
                      </span>
                    </div>
                    <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {isEn ? (d.title_en || d.title) : d.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
