import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Building2,
  Users,
  Briefcase,
  HelpCircle,
  Link2,
  Award,
  Globe,
  Phone,
  ArrowRight
} from 'lucide-react';
import { ABOUT_CONTENT } from '../data/aboutContent';
import { submitLeadToProspection } from '../utils/prospectionBridge';

export default function AboutPageView({
  lang = 'FR',
  directors = [],
  onSelectBroker,
  onNavigate
}) {
  const isEn = lang === 'EN';
  const c = ABOUT_CONTENT[isEn ? 'EN' : 'FR'];
  const [activeTab, setActiveTab] = useState('qui-nous-sommes');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // États du formulaire de candidature intégré (#14 — Devenir courtier / Devenir affilié)
  const [careerType, setCareerType] = useState('courtier');
  const [careerName, setCareerName] = useState('');
  const [careerEmail, setCareerEmail] = useState('');
  const [careerPhone, setCareerPhone] = useState('');
  const [careerAddress, setCareerAddress] = useState('');
  const [careerMotivation, setCareerMotivation] = useState('');
  const [careerSent, setCareerSent] = useState(false);

  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    await submitLeadToProspection({
      type: careerType === 'affilie' ? 'candidature_affilie' : 'candidature_courtier',
      source: careerType === 'affilie' ? 'Formulaire Devenir Affilié (À propos)' : 'Formulaire Devenir Courtier (À propos)',
      nom: careerName,
      email: careerEmail,
      telephone: careerPhone,
      adresse: careerAddress,
      message: careerMotivation
    });
    setCareerSent(true);
  };

  const scrollToCareerForm = (volet) => {
    setCareerType(volet);
    setCareerSent(false);
    const el = document.getElementById('form-candidature-himalaya');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        {/* En-tête de la page À propos */}
        <div style={{ marginBottom: '28px' }}>
          <span className="badge-gold" style={{ marginBottom: '10px' }}>
            {isEn ? 'Founded in 2008' : 'Fondée en 2008'}
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '8px' }}>
            {c.pageTitle} <span className="gold-gradient-text">Himalaya</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', maxWidth: '760px' }}>
            {c.pageSubtitle}
          </p>
        </div>

        {/* Barre de sous-navigation officielle (comme le menu latéral de himalayacorp.com/fr/a-propos.html) */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '32px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {c.tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={isActive ? 'btn-gold' : 'btn-outline'}
                style={{
                  padding: '9px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 600
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =================================================================
            ONGLET 1 : QUI NOUS SOMMES (Profil complet, Mission, Valeurs + Aperçu)
           ================================================================= */}
        {activeTab === 'qui-nous-sommes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Bloc principal : Qui nous sommes & Notre Profil (4 paragraphes officiels) */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '32px'
              }}
            >
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '14px' }}>
                {c.whoWeAre.heading}
              </h2>
              <p
                style={{
                  fontSize: '0.98rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.75,
                  marginBottom: '28px'
                }}
              >
                {c.whoWeAre.intro}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    letterSpacing: '0.04em',
                    marginBottom: '14px'
                  }}
                >
                  {c.whoWeAre.profileTitle}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {c.whoWeAre.profileParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      style={{
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.75
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Grille Mission & Valeurs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '22px'
              }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      letterSpacing: '0.05em',
                      marginBottom: '10px'
                    }}
                  >
                    {c.whoWeAre.missionTitle}
                  </div>
                  <p style={{ fontSize: '0.96rem', color: 'var(--text-primary)', lineHeight: 1.75 }}>
                    {c.whoWeAre.missionText}
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.86rem',
                    color: 'var(--gold-light)',
                    fontWeight: 500
                  }}
                >
                  {c.whoWeAre.contactCta}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '28px'
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    letterSpacing: '0.05em',
                    marginBottom: '10px'
                  }}
                >
                  {c.whoWeAre.valuesTitle}
                </div>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginBottom: '18px'
                  }}
                >
                  {c.whoWeAre.valuesText}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {c.whoWeAre.valuesList.map((val) => (
                    <span
                      key={val}
                      className="badge-gold"
                      style={{
                        padding: '7px 14px',
                        fontSize: '0.82rem',
                        background: 'rgba(200, 164, 93, 0.12)'
                      }}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Co-fondateurs & Direction */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '28px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '20px'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '4px' }}>
                    {isEn ? 'Co-Founders & Executive Management' : 'Co-fondateurs & Direction'}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {c.coFounders.heading}
                  </p>
                </div>
                <button
                  onClick={() => switchTab('co-fondateurs')}
                  className="btn-gold"
                  style={{ padding: '9px 16px', fontSize: '0.84rem' }}
                >
                  {isEn ? 'Read Full Co-Founders Story & Video' : 'Lire l’histoire complète des co-fondateurs & vidéo'}{' '}
                  <ArrowRight size={14} />
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '22px'
                }}
              >
                {directors.map((dir) => (
                  <div
                    key={dir.id}
                    className="broker-card"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1fr',
                      overflow: 'hidden',
                      alignItems: 'stretch'
                    }}
                  >
                    <div
                      onClick={() => onSelectBroker && onSelectBroker(dir)}
                      style={{
                        background: '#09090b',
                        cursor: 'pointer',
                        minHeight: '195px'
                      }}
                    >
                      <img
                        src={dir.photo}
                        alt={dir.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          display: 'block'
                        }}
                      />
                    </div>
                    <div
                      style={{
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>
                          {isEn ? dir.shortTitle_en || dir.shortTitle : dir.shortTitle}
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>{dir.name}</h3>
                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.55,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '12px'
                          }}
                        >
                          {isEn ? dir.bio_en || dir.bio : dir.bio}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => onSelectBroker && onSelectBroker(dir)}
                          className="btn-outline"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        >
                          {isEn ? 'Broker Profile' : 'Fiche courtier'} <ChevronRight size={13} />
                        </button>
                        <button
                          onClick={() => switchTab('co-fondateurs')}
                          className="btn-outline"
                          style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: 'var(--border-subtle)' }}
                        >
                          {isEn ? 'Full Bio' : 'Biographie complète'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cartes d'accès rapide aux autres rubriques officielles d'À propos */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '16px' }}>
                {isEn ? 'Explore All About Himalaya Sections' : 'Toutes les rubriques À propos d’Himalaya'}
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px'
                }}
              >
                <div
                  onClick={() => switchTab('services')}
                  className="property-card"
                  style={{ padding: '22px', cursor: 'pointer' }}
                >
                  <Briefcase size={20} style={{ color: 'var(--gold)', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    {isEn ? 'Services & Associations' : 'Services & Associations'}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {isEn
                      ? 'Commercial & industrial brokerage, real estate consulting, international network, and CQF / FPQ memberships.'
                      : 'Courtage commercial et industriel, consultation immobilière, réseau international et adhésions CQF & FPQ.'}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {isEn ? 'View services' : 'Voir les services'} <ChevronRight size={14} />
                  </span>
                </div>

                <div
                  onClick={() => switchTab('carrieres')}
                  className="property-card"
                  style={{ padding: '22px', cursor: 'pointer' }}
                >
                  <Users size={20} style={{ color: 'var(--gold)', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    {isEn ? 'Become a Broker or Affiliate' : 'Devenir courtier ou affilié'}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {isEn
                      ? 'Discover the 8 benefits of joining Himalaya as a broker or becoming an international affiliated agency.'
                      : 'Découvrez les avantages de joindre notre équipe de courtiers ou de devenir une agence affiliée.'}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {isEn ? 'Careers & Affiliates' : 'Carrières & Affiliés'} <ChevronRight size={14} />
                  </span>
                </div>

                <div
                  onClick={() => switchTab('faq')}
                  className="property-card"
                  style={{ padding: '22px', cursor: 'pointer' }}
                >
                  <HelpCircle size={20} style={{ color: 'var(--gold)', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    {isEn ? 'Commercial Real Estate FAQ' : 'Foire aux questions (FAQ)'}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {isEn
                      ? '12 practical answers on base rent, additional rent, commercial lease negotiation, and renewal options.'
                      : '12 réponses pratiques sur le loyer de base, loyer additionnel, négociation de bail et options.'}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {isEn ? 'Read the 12 Q&As' : 'Consulter les 12 Q&R'} <ChevronRight size={14} />
                  </span>
                </div>

                <div
                  onClick={() => switchTab('liens')}
                  className="property-card"
                  style={{ padding: '22px', cursor: 'pointer' }}
                >
                  <Link2 size={20} style={{ color: 'var(--gold)', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    {isEn ? 'Real Estate Links & Partners' : 'Liens immobiliers & Partenaires'}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {isEn
                      ? 'Official government registries (Land Register, CPTAQ, MAMH) and vetted legal, notary, and appraisal partners.'
                      : 'Sites gouvernementaux (Registre foncier, CPTAQ) et partenaires (avocats, notaires, évaluateurs, environnement).'}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {isEn ? 'Open directory' : 'Voir le répertoire'} <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET 2 : CO-FONDATEURS (Texte intégral + photos + vidéo YouTube)
           ================================================================= */}
        {activeTab === 'co-fondateurs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '28px'
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                {c.coFounders.heading}
              </h2>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-primary)', lineHeight: 1.75 }}>
                {c.coFounders.intro}
              </p>
            </div>

            {c.coFounders.founders.map((founder) => {
              const matchingBroker = directors.find((d) =>
                d.name.toLowerCase().includes(founder.name.split(' ')[1].toLowerCase())
              );

              return (
                <div
                  key={founder.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '30px'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '28px',
                      alignItems: 'start'
                    }}
                  >
                    {/* Colonne portrait + galerie photos */}
                    <div style={{ maxWidth: '320px' }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '314 / 543',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-gold)',
                          background: '#09090b',
                          marginBottom: '14px'
                        }}
                      >
                        <img
                          src={founder.portrait}
                          alt={founder.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            display: 'block'
                          }}
                        />
                      </div>

                      {founder.photos && founder.photos.length > 0 && (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${founder.photos.length}, 1fr)`,
                            gap: '8px'
                          }}
                        >
                          {founder.photos.map((imgUrl, i) => (
                            <div
                              key={i}
                              style={{
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid var(--border-subtle)',
                                height: '82px',
                                background: '#09090b'
                              }}
                            >
                              <img
                                src={imgUrl}
                                alt={`${founder.name} ${i + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {matchingBroker && (
                        <button
                          onClick={() => onSelectBroker && onSelectBroker(matchingBroker)}
                          className="btn-outline"
                          style={{ width: '100%', marginTop: '12px', fontSize: '0.82rem' }}
                        >
                          {isEn ? 'View Active Listings & Contact' : 'Voir ses mandats actifs & coordonnées'}{' '}
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>

                    {/* Colonne texte biographique intégral */}
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>
                        {founder.credentials}
                      </div>
                      <h3 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '4px' }}>{founder.name}</h3>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          color: 'var(--gold-light)',
                          fontWeight: 500,
                          marginBottom: '20px',
                          paddingBottom: '14px',
                          borderBottom: '1px solid var(--border-subtle)'
                        }}
                      >
                        {founder.role}
                      </div>

                      {founder.paragraphs && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {founder.paragraphs.map((p, idx) => (
                            <p
                              key={idx}
                              style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      )}

                      {founder.sections && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {founder.sections.map((sec, idx) => (
                            <div key={idx}>
                              <h4
                                style={{
                                  fontSize: '1.05rem',
                                  fontWeight: 700,
                                  color: 'var(--text-primary)',
                                  marginBottom: '10px'
                                }}
                              >
                                {sec.subtitle}
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {sec.paragraphs.map((p, pIdx) => (
                                  <p
                                    key={pIdx}
                                    style={{
                                      fontSize: '0.95rem',
                                      color: 'var(--text-secondary)',
                                      lineHeight: 1.75
                                    }}
                                  >
                                    {p}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Vidéo officielle présente sur co-fondateurs.html */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '24px'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
                {c.coFounders.videoTitle}
              </h3>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  maxHeight: '420px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  background: '#000'
                }}
              >
                <iframe
                  src={c.coFounders.videoUrl}
                  title={c.coFounders.videoTitle}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET 3 : SERVICES & ASSOCIATIONS (services.html)
           ================================================================= */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '30px'
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                {c.services.heading}
              </h2>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '12px' }}>
                {c.services.intro1}
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {c.services.intro2}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '22px'
              }}
            >
              {/* Volet 1 : Vente, location et recherche */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '26px'
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '16px' }}>
                  {c.services.brokerageTitle}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {c.services.brokerageItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volet 2 : Consultation immobilière */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '26px'
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '16px' }}>
                  {c.services.consultingTitle}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {c.services.consultingItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Courtage international & Associations (CQF / FPQ / OACIQ) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '22px'
              }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '26px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Globe size={18} style={{ color: 'var(--gold)' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{c.services.internationalTitle}</h3>
                </div>
                <p style={{ fontSize: '0.93rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {c.services.internationalText}
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '26px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Award size={18} style={{ color: 'var(--gold)' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{c.services.associationsTitle}</h3>
                </div>
                <p
                  style={{
                    fontSize: '0.93rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    marginBottom: '16px'
                  }}
                >
                  {c.services.associationsText}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {c.services.associationsBadges.map((b) => (
                    <div
                      key={b.code}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(200, 164, 93, 0.07)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.82rem', minWidth: '52px' }}>
                        {b.code}
                      </span>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET 4 : CARRIÈRES & AFFILIÉS (devenir-courtier & devenir-affilie)
           ================================================================= */}
        {activeTab === 'carrieres' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px'
              }}
            >
              {/* Volet 1 : Devenir courtier immobilier */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '14px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge-gold" style={{ marginBottom: '12px' }}>
                    {isEn ? 'Careers — Real Estate Brokerage' : 'Carrières — Courtage immobilier'}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '14px' }}>
                    {c.careers.brokerHeading}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
                    {c.careers.brokerParagraphs.map((p, idx) => (
                      <p key={idx} style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {p}
                      </p>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                    {c.careers.brokerBenefitsTitle}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '22px' }}>
                    {c.careers.brokerBenefits.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.88rem' }}>
                        <CheckCircle2 size={15} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '3px' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => scrollToCareerForm('courtier')}
                  className="btn-gold"
                  style={{ width: '100%' }}
                >
                  {c.careers.applyBtn} <ArrowRight size={15} />
                </button>
              </div>

              {/* Volet 2 : Devenir affilié */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge-gold" style={{ marginBottom: '12px' }}>
                    {isEn ? 'International Network — Affiliated Agencies' : 'Réseau international — Agences affiliées'}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '14px' }}>
                    {c.careers.affiliateHeading}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
                    {c.careers.affiliateParagraphs.map((p, idx) => (
                      <p key={idx} style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {p}
                      </p>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                    {c.careers.affiliateBenefitsTitle}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '22px' }}>
                    {c.careers.affiliateBenefits.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.88rem' }}>
                        <CheckCircle2 size={15} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '3px' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => scrollToCareerForm('affilie')}
                  className="btn-outline"
                  style={{ width: '100%' }}
                >
                  {c.careers.applyBtn} <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Formulaire officiel de candidature intégré (#14 — devenir-courtier-immobilier.html & devenir-affilie.html) */}
            <div
              id="form-candidature-himalaya"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '32px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
                <div>
                  <span className="badge-gold" style={{ marginBottom: '8px' }}>
                    {isEn ? 'Confidential Application Form' : 'Formulaire de candidature confidentiel'}
                  </span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
                    {careerType === 'affilie'
                      ? (isEn ? 'Apply to Become an Affiliated Agency' : 'Postuler — Devenir Agence Affiliée Himalaya')
                      : (isEn ? 'Apply to Become a Himalaya Real Estate Broker' : 'Postuler — Devenir Courtier Immobilier Himalaya')}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {isEn
                      ? 'Your application is sent directly and confidentially to Roger Rhéaume & Geniev Mondoux.'
                      : 'Votre candidature est transmise directement et en toute confidentialité à la direction (Roger Rhéaume & Geniev Mondoux).'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setCareerType('courtier'); setCareerSent(false); }}
                    className={careerType === 'courtier' ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  >
                    {isEn ? 'Broker Application' : 'Volet Courtier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCareerType('affilie'); setCareerSent(false); }}
                    className={careerType === 'affilie' ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  >
                    {isEn ? 'Affiliate Application' : 'Volet Affilié'}
                  </button>
                </div>
              </div>

              {careerSent ? (
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  background: 'rgba(200, 164, 93, 0.12)',
                  border: '1px solid var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={24} color="var(--gold)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                        {isEn ? 'Application Received Successfully!' : 'Candidature transmise avec succès !'}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                        {isEn
                          ? 'Thank you for your interest in Himalaya Real Estate Corp. Our executive team will contact you shortly.'
                          : 'Merci de votre intérêt pour Immobilier Himalaya Real Estate Corp. Notre direction communiquera avec vous sous peu.'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCareerSent(false);
                      setCareerName('');
                      setCareerEmail('');
                      setCareerPhone('');
                      setCareerAddress('');
                      setCareerMotivation('');
                    }}
                    className="btn-outline"
                    style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                  >
                    {isEn ? 'New Application' : 'Nouvelle candidature'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCareerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isEn ? 'Full Name *' : 'Nom complet *'}
                      </label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={careerName}
                        onChange={(e) => setCareerName(e.target.value)}
                        placeholder={isEn ? 'Your full name' : 'Votre nom et prénom'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isEn ? 'Email Address *' : 'Adresse courriel *'}
                      </label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        value={careerEmail}
                        onChange={(e) => setCareerEmail(e.target.value)}
                        placeholder="courriel@exemple.com"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isEn ? 'Phone Number *' : 'Téléphone *'}
                      </label>
                      <input
                        type="tel"
                        required
                        className="form-control"
                        value={careerPhone}
                        onChange={(e) => setCareerPhone(e.target.value)}
                        placeholder="(514) 000-0000"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isEn ? 'City / Address / Current Agency' : 'Ville / Adresse / Agence actuelle'}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={careerAddress}
                        onChange={(e) => setCareerAddress(e.target.value)}
                        placeholder={isEn ? 'Montreal, QC (OACIQ License)' : 'Montréal, QC (Permis OACIQ)'}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {isEn
                        ? 'Why would you like to join our team? (Experience, specialties, territories) *'
                        : 'Pourquoi désirez-vous joindre notre équipe ? (Expérience, spécialités, territoires) *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="form-control"
                      value={careerMotivation}
                      onChange={(e) => setCareerMotivation(e.target.value)}
                      placeholder={
                        isEn
                          ? 'Tell us about your real estate background and goals...'
                          : 'Parlez-nous de votre parcours en courtage immobilier et de vos objectifs...'
                      }
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      * {isEn ? 'Required fields. Treated with 100% confidentiality.' : 'Champs obligatoires. Traitement 100 % confidentiel.'}
                    </span>
                    <button type="submit" className="btn-gold" style={{ padding: '11px 24px' }}>
                      {isEn ? 'Submit My Application' : 'Soumettre ma candidature'} <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET 5 : FOIRE AUX QUESTIONS — FAQ (faq.html — 12 Q&R officielles)
           ================================================================= */}
        {activeTab === 'faq' && (
          <div style={{ maxWidth: '900px' }}>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>{c.faq.heading}</h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{c.faq.subtitle}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {c.faq.items.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${isOpen ? 'var(--gold)' : 'var(--border-subtle)'}`,
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.96rem',
                        fontWeight: 600
                      }}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={18}
                        style={{
                          color: 'var(--gold)',
                          flexShrink: 0,
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: '0 20px 18px',
                          fontSize: '0.92rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.7,
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '14px'
                        }}
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET 6 : LIENS IMMOBILIERS & PARTENAIRES (liens-immobiliers.html)
           ================================================================= */}
        {activeTab === 'liens' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>{c.links.heading}</h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{c.links.subtitle}</p>
            </div>

            {/* Sites gouvernementaux officiels */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '14px' }}>
                {c.links.govTitle}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '14px'
                }}
              >
                {c.links.govLinks.map((gov, idx) => (
                  <a
                    key={idx}
                    href={gov.url}
                    target="_blank"
                    rel="noreferrer"
                    className="property-card"
                    style={{
                      padding: '18px',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}
                      >
                        <span>{gov.name}</span>
                        <ExternalLink size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '3px' }} />
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {gov.desc}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Répertoire des partenaires professionnels d'Himalaya */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '14px' }}>
                {c.links.partnersTitle}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '18px'
                }}
              >
                {c.links.partnerGroups.map((group, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '22px'
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: 'var(--gold)',
                        marginBottom: '14px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      {group.category}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {group.items.map((partner, pIdx) => (
                        <div key={pIdx} style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            {partner.name}
                          </div>
                          <div style={{ color: 'var(--gold-light)', fontSize: '0.8rem', marginBottom: '2px' }}>
                            {partner.specialty}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{partner.address}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                            {partner.contact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
