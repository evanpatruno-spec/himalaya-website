import React from 'react';
import { MapPin, Phone, Mail, ExternalLink, Globe, ArrowUpRight, UserCheck } from 'lucide-react';
import { HIMALAYA_AGENCIES } from '../data/siteContent';
import { INITIAL_HIMALAYA_BROKERS } from '../data/brokersData';
import { pickLang, tr } from '../data/translations';

const cleanTelHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;

/**
 * Résout de manière uniforme les courtiers rattachés à une agence partenaire
 * (à partir de `agency.brokers`, avec enrichissement optionnel depuis `brokers`).
 */
function resolvePartnerBrokers(agency, allBrokers, lang) {
  const entries = Array.isArray(agency.brokers) ? agency.brokers : [];

  return entries
    .map((entry, idx) => {
      const linkedBroker = entry.brokerId
        ? allBrokers.find((b) => b.id === entry.brokerId) || null
        : null;

      const name = entry.name || linkedBroker?.name || '';
      if (!name) return null;

      const role =
        pickLang(entry, 'role', lang) ||
        (linkedBroker ? pickLang(linkedBroker, 'shortTitle', lang) || pickLang(linkedBroker, 'title', lang) : '');

      return {
        key: entry.brokerId || `${agency.id}-broker-${idx}`,
        name,
        role,
        phone: entry.phone || linkedBroker?.phone || agency.phone || '',
        email: entry.email || linkedBroker?.email || agency.email || '',
        photo: entry.photo || linkedBroker?.photo || '/gx/00/defaut_courtier.jpg',
        photoPosition: entry.photoPosition || 'top center',
        photoScale: entry.photoScale || null,
        linkedBroker
      };
    })
    .filter(Boolean);
}

export default function AgenciesView({ lang, t, brokers = INITIAL_HIMALAYA_BROKERS, onSelectBroker }) {
  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '6px' }}>{t.agencies.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            {t.agencies.subtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: '24px' }}>
          {HIMALAYA_AGENCIES.map((ag) => {
            const partnerBrokers = resolvePartnerBrokers(ag, brokers, lang);

            return (
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
                    onError={(e) => {
                      if (ag.fallbackImage) e.target.src = ag.fallbackImage;
                    }}
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

                    {/* Bloc standardisé du courtier immobilier rattaché à l'agence partenaire */}
                    {partnerBrokers.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        {partnerBrokers.map((pb) => {
                          const canOpenModal = Boolean(pb.linkedBroker && onSelectBroker);

                          return (
                            <div
                              key={pb.key}
                              style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(200, 164, 93, 0.28)',
                                borderRadius: '8px',
                                padding: '12px 14px'
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '8px',
                                  marginBottom: '10px'
                                }}
                              >
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--gold)'
                                  }}
                                >
                                  <UserCheck size={12} />
                                  {tr(lang, 'Courtier immobilier', 'Real Estate Broker', 'Corredor inmobiliario', '合作房产经纪人')}
                                </span>
                                {canOpenModal && (
                                  <button
                                    type="button"
                                    onClick={() => onSelectBroker(pb.linkedBroker)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: 0,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      fontSize: '0.74rem',
                                      fontWeight: 600,
                                      color: 'var(--gold-light)'
                                    }}
                                  >
                                    {tr(lang, 'Voir la fiche', 'View profile', 'Ver perfil', '查看资料')}
                                    <ArrowUpRight size={12} />
                                  </button>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div
                                  onClick={canOpenModal ? () => onSelectBroker(pb.linkedBroker) : undefined}
                                  style={{
                                    width: '74px',
                                    height: '90px',
                                    flexShrink: 0,
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(200, 164, 93, 0.45)',
                                    background: 'rgba(15, 19, 28, 0.8)',
                                    cursor: canOpenModal ? 'pointer' : 'default'
                                  }}
                                >
                                  <img
                                    src={pb.photo}
                                    alt={pb.name}
                                    loading="lazy"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: pb.photoPosition,
                                      transform: pb.photoScale ? `scale(${pb.photoScale})` : undefined,
                                      transformOrigin: pb.photoScale ? pb.photoPosition : undefined,
                                      display: 'block'
                                    }}
                                    onError={(e) => {
                                      e.target.src = '/gx/00/defaut_courtier.jpg';
                                    }}
                                  />
                                </div>

                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div
                                    onClick={canOpenModal ? () => onSelectBroker(pb.linkedBroker) : undefined}
                                    style={{
                                      fontSize: '1rem',
                                      fontWeight: 700,
                                      color: '#ffffff',
                                      lineHeight: 1.25,
                                      cursor: canOpenModal ? 'pointer' : 'default'
                                    }}
                                  >
                                    {pb.name}
                                  </div>
                                  {pb.role && (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 8px' }}>
                                      {pb.role}
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                                    {pb.phone && (
                                      <a
                                        href={cleanTelHref(pb.phone)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          color: 'var(--text-primary)'
                                        }}
                                      >
                                        <Phone size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                        <span>{pb.phone}</span>
                                      </a>
                                    )}
                                    {pb.email && (
                                      <a
                                        href={`mailto:${pb.email}`}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          color: 'var(--gold-light)',
                                          wordBreak: 'break-all'
                                        }}
                                      >
                                        <Mail size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                        <span>{pb.email}</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <a href={cleanTelHref(ag.phone)} className="btn-gold" style={{ flex: 1, minWidth: '150px', padding: '8px 12px', fontSize: '0.82rem' }}>
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
            );
          })}
        </div>
      </div>
    </main>
  );
}
