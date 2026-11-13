import React from 'react';
import { MapPin, Phone, Mail, ExternalLink, Globe } from 'lucide-react';
import { HIMALAYA_AGENCIES } from '../data/siteContent';
import { pickLang, tr } from '../data/translations';

export default function AgenciesView({ lang, t }) {
  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '6px' }}>{t.agencies.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            {t.agencies.subtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))', gap: '24px' }}>
          {HIMALAYA_AGENCIES.map(ag => (
            <div key={ag.id} className="property-card">
              <div
                style={{
                  position: 'relative',
                  height: '205px',
                  background: '#ffffff',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '46px 28px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.14)'
                }}
              >
                <img
                  src={ag.image}
                  alt={pickLang(ag, 'name', lang)}
                  style={{
                    maxWidth: '88%',
                    maxHeight: '105px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={e => { if (ag.fallbackImage) e.target.src = ag.fallbackImage; }}
                />
                <span
                  className="badge-gold"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(17, 21, 31, 0.92)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.7rem'
                  }}
                >
                  {pickLang(ag, 'badge', lang)}
                </span>
              </div>
              <div style={{ padding: '20px 4px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {pickLang(ag, 'city', lang)} • {pickLang(ag, 'country', lang)}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0 8px' }}>
                    {pickLang(ag, 'name', lang)}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: ag.website ? '8px' : '16px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '5px', color: 'var(--gold)' }} />
                    {pickLang(ag, 'address', lang)}
                  </p>
                  {ag.website && (
                    <p style={{ fontSize: '0.83rem', color: 'var(--gold-light)', marginBottom: '16px' }}>
                      <Globe size={13} style={{ display: 'inline', marginRight: '6px', color: 'var(--gold)' }} />
                      <a
                        href={ag.website}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
                      >
                        {ag.website.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <a href={`tel:${ag.phone}`} className="btn-gold" style={{ flex: 1, minWidth: '150px', padding: '8px 12px', fontSize: '0.82rem' }}>
                    <Phone size={13} /> {ag.phone}
                  </a>
                  <a href={`mailto:${ag.email}`} className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                    <Mail size={13} /> {t.agencies.emailBtn}
                  </a>
                  {ag.website && (
                    <a href={ag.website} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                      <ExternalLink size={13} /> {t.agencies.websiteBtn || tr(lang, 'Site web', 'Website', 'Sitio web', '官方网站')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
