import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { HIMALAYA_AGENCIES } from '../data/siteContent';
import { pickLang } from '../data/translations';

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '22px' }}>
          {HIMALAYA_AGENCIES.map(ag => (
            <div key={ag.id} className="property-card">
              <div className="property-img-wrap" style={{ height: '195px', background: '#09090b' }}>
                <img
                  src={ag.image}
                  alt={pickLang(ag, 'name', lang)}
                  style={{ objectFit: ag.id === 'montreal_hq' ? 'contain' : 'cover', padding: ag.id === 'montreal_hq' ? '28px' : '0' }}
                  onError={e => { if (ag.fallbackImage) e.target.src = ag.fallbackImage; }}
                />
                <span className="badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(9,9,11,0.88)' }}>
                  {pickLang(ag, 'badge', lang)}
                </span>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {pickLang(ag, 'city', lang)} • {pickLang(ag, 'country', lang)}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0 8px' }}>
                    {pickLang(ag, 'name', lang)}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '5px', color: 'var(--gold)' }} />
                    {pickLang(ag, 'address', lang)}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <a href={`tel:${ag.phone}`} className="btn-gold" style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}>
                    <Phone size={13} /> {ag.phone}
                  </a>
                  <a href={`mailto:${ag.email}`} className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                    <Mail size={13} /> {t.agencies.emailBtn}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
