import React, { useState, useEffect } from 'react';
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
  Mail,
  ArrowRight,
  Store,
  Search
} from 'lucide-react';
import { ABOUT_CONTENT } from '../data/aboutContent';
import {
  HIMALAYA_FRANCHISES,
  HIMALAYA_FRANCHISE_HIGHLIGHTS
} from '../data/siteContent';
import { tr, pickLang } from '../data/translations';
import { submitLeadToProspection } from '../utils/prospectionBridge';

export default function AboutPageView({
  lang = 'FR',
  directors = [],
  onSelectBroker,
  onNavigate,
  initialTab = 'qui-nous-sommes',
  standaloneFranchisePage = false
}) {
  const c = ABOUT_CONTENT[lang] || ABOUT_CONTENT.FR;
  const [activeTab, setActiveTab] = useState(standaloneFranchisePage ? 'franchises' : (initialTab || 'qui-nous-sommes'));
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [linksSection, setLinksSection] = useState('partenaires');
  const [expandedFounders, setExpandedFounders] = useState({});
  const [franchiseSectorFilter, setFranchiseSectorFilter] = useState('all');
  const [franchiseFormMode, setFranchiseFormMode] = useState('tenant');

  useEffect(() => {
    if (standaloneFranchisePage) {
      setActiveTab('franchises');
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, standaloneFranchisePage]);

  const matchesFranchiseSector = (fr, sectorKey) => {
    if (!sectorKey || sectorKey === 'all') return true;
    const name = fr.name || '';
    const id = fr.id || '';
    const sectorVal = fr.sectorValue || '';
    if (sectorKey === 'restauration') {
      return (
        sectorVal === 'Restauration & Alimentation' ||
        ['Subway', 'Thaïzone', 'Les Moulins La Fayette', 'Pacini', 'Grillades Torino', 'Grillade Torino', 'Chocolat Cotard'].includes(name) ||
        ['pacini', 'grillade_torino', 'moulin_lafayette', 'chocolat_cotard'].includes(id)
      );
    }
    if (sectorKey === 'commerce_detail') {
      return (
        sectorVal === 'Commerce de détail' ||
        ['Arabian Oud'].includes(name) ||
        ['arabian_oud'].includes(id)
      );
    }
    if (sectorKey === 'services') {
      return (
        sectorVal === 'Services & Cliniques' ||
        ['Nettoyeur Daoust'].includes(name) ||
        ['nettoyeur_daoust'].includes(id)
      );
    }
    return true;
  };

  const filteredFranchises = HIMALAYA_FRANCHISES.filter((fr) =>
    matchesFranchiseSector(fr, franchiseSectorFilter)
  );

  // États du formulaire Franchiseur / Recherche d'emplacement (#36) & Propriétaire (#8)
  const [franchiseBrand, setFranchiseBrand] = useState('');
  const [franchiseSector, setFranchiseSector] = useState('Restauration & Alimentation');
  const [franchiseSqft, setFranchiseSqft] = useState('');
  const [franchiseRegions, setFranchiseRegions] = useState('');
  const [franchiseContactName, setFranchiseContactName] = useState('');
  const [franchiseEmail, setFranchiseEmail] = useState('');
  const [franchisePhone, setFranchisePhone] = useState('');
  const [franchiseNotes, setFranchiseNotes] = useState('');
  const [franchiseSent, setFranchiseSent] = useState(false);

  const scrollToFranchiseForm = (mode = 'tenant') => {
    setFranchiseFormMode(mode);
    setFranchiseSent(false);
    const el = document.getElementById('franchise-contact-form') || document.getElementById('form-franchise-himalaya');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFranchiseSubmit = async (e) => {
    e.preventDefault();
    if (franchiseFormMode === 'landlord') {
      await submitLeadToProspection({
        type: 'franchise_local_proprietaire',
        source: 'Formulaire Propriétaire — Proposer un local commercial (#8)',
        subject: `Local commercial proposé aux bannières : ${franchiseRegions} (${franchiseSqft || franchiseBrand})`,
        fullName: franchiseContactName,
        email: franchiseEmail,
        phone: franchisePhone,
        city: franchiseRegions,
        message: `Profil: Propriétaire d'immeuble | Adresse / Ville du local: ${franchiseRegions} | Superficie disponible: ${franchiseSqft} | Loyer net demandé / Détails: ${franchiseBrand} | Configuration / Vocation: ${franchiseSector} | Notes: ${franchiseNotes}`
      });
    } else {
      await submitLeadToProspection({
        type: 'franchise_implantation',
        source: 'Formulaire Franchises & Bannières (#36)',
        subject: `Implantation Franchise : ${franchiseBrand} (${franchiseSector})`,
        fullName: franchiseContactName,
        email: franchiseEmail,
        phone: franchisePhone,
        city: franchiseRegions,
        message: `Bannière: ${franchiseBrand} | Secteur: ${franchiseSector} | Superficie recherchée: ${franchiseSqft} | Régions cibles: ${franchiseRegions} | Détails: ${franchiseNotes}`
      });
    }
    setFranchiseSent(true);
  };

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
    <main style={{ flex: 1, padding: '24px 0 80px' }}>
      <div className="container">
        {!standaloneFranchisePage && (
          <>
            {/* Barre de sous-navigation éditoriale épurée sur 1 seule ligne */}
            <div
              className="hide-scrollbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                marginBottom: '36px',
                borderBottom: '1px solid var(--border-subtle)',
                scrollbarWidth: 'none'
              }}
            >
              {c.tabs
                .filter((tab) => tab.id !== 'franchises')
                .map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => switchTab(tab.id)}
                      style={{
                        padding: '10px 14px',
                        fontSize: '0.82rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
            </div>
          </>
        )}

        {/* =================================================================
            ONGLET 1 : QUI NOUS SOMMES (Mise en page éditoriale épurée, sans cadres imbriqués)
           ================================================================= */}
        {activeTab === 'qui-nous-sommes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Bloc principal éditorial ouvert : Qui nous sommes & Notre Profil */}
            <div style={{ paddingBottom: '32px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '14px' }}>
                {c.whoWeAre.heading}
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.8,
                  marginBottom: '28px',
                  maxWidth: '960px'
                }}
              >
                {c.whoWeAre.intro}
              </p>

              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--gold)',
                  letterSpacing: '0.1em',
                  marginBottom: '14px'
                }}
              >
                {c.whoWeAre.profileTitle}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {c.whoWeAre.profileParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    style={{
                      fontSize: '0.94rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.75
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Grille Mission & Valeurs épurée */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
                paddingBottom: '32px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    letterSpacing: '0.1em',
                    marginBottom: '10px'
                  }}
                >
                  {c.whoWeAre.missionTitle}
                </div>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '14px' }}>
                  {c.whoWeAre.missionText}
                </p>
                <div style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontWeight: 500 }}>
                  {c.whoWeAre.contactCta}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    letterSpacing: '0.1em',
                    marginBottom: '10px'
                  }}
                >
                  {c.whoWeAre.valuesTitle}
                </div>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    marginBottom: '16px'
                  }}
                >
                  {c.whoWeAre.valuesText}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {c.whoWeAre.valuesList.map((val) => (
                    <span
                      key={val}
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--gold-light)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ color: 'var(--gold)' }}>•</span> {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Co-fondateurs & Direction (sans cadre englobant superflu) */}
            <div style={{ paddingBottom: '32px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '22px'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '4px' }}>
                    {tr(lang, 'Co-fondateurs & Direction', 'Co-Founders & Executive Management', 'Cofundadores y Dirección Ejecutiva', '联合创始人与管理团队')}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {c.coFounders.heading}
                  </p>
                </div>
                <button
                  onClick={() => switchTab('co-fondateurs')}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  {tr(lang, 'Histoire des co-fondateurs & vidéo', 'Read Full Co-Founders Story & Video', 'Historia de los cofundadores y video', '联合创始人故事与视频介绍')}{' '}
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
                      gridTemplateColumns: '125px 1fr',
                      overflow: 'hidden',
                      alignItems: 'stretch'
                    }}
                  >
                    <div
                      onClick={() => onSelectBroker && onSelectBroker(dir)}
                      style={{
                        background: '#09090b',
                        cursor: 'pointer',
                        minHeight: '185px'
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
                        <div style={{ fontSize: '0.73rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>
                          {pickLang(dir, 'shortTitle', lang)}
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
                          {pickLang(dir, 'bio', lang)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span
                          onClick={() => onSelectBroker && onSelectBroker(dir)}
                          style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {tr(lang, 'Fiche courtier', 'Broker Profile', 'Perfil del corredor', '经纪人档案')} <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET 2 : CO-FONDATEURS (Mise en page éditoriale épurée)
           ================================================================= */}
        {activeTab === 'co-fondateurs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                {c.coFounders.heading}
              </h2>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.8, maxWidth: '920px' }}>
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
                    paddingBottom: '36px',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '32px',
                      alignItems: 'start'
                    }}
                  >
                    {/* Colonne portrait + galerie photos */}
                    <div style={{ maxWidth: '300px' }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '314 / 460',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-subtle)',
                          background: '#09090b',
                          marginBottom: '12px'
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
                                height: '78px',
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
                          {tr(lang, 'Voir ses mandats actifs & coordonnées', 'View Active Listings & Contact', 'Ver propiedades activas y contacto', '查看在售房源与联系方式')}{' '}
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>

                    {/* Colonne texte biographique intégral */}
                    <div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
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

                      {founder.paragraphs && (() => {
                        const isExpanded = !!expandedFounders[founder.id];
                        const visibleParas = isExpanded ? founder.paragraphs : founder.paragraphs.slice(0, 2);
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {visibleParas.map((p, idx) => (
                              <p
                                key={idx}
                                style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}
                              >
                                {p}
                              </p>
                            ))}
                            {founder.paragraphs.length > 2 && (
                              <button
                                type="button"
                                onClick={() => setExpandedFounders((prev) => ({ ...prev, [founder.id]: !prev[founder.id] }))}
                                style={{
                                  alignSelf: 'flex-start',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--gold-light)',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: '4px 0',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                {isExpanded
                                  ? tr(lang, 'Réduire la biographie ↑', 'Show less ↑', 'Mostrar menos ↑', '收起简介 ↑')
                                  : tr(lang, 'Lire le parcours complet ↓', 'Read full biography ↓', 'Leer biografía completa ↓', '阅读完整履历 ↓')}
                              </button>
                            )}
                          </div>
                        );
                      })()}

                      {founder.sections && (() => {
                        const isExpanded = !!expandedFounders[founder.id];
                        const visibleSections = isExpanded ? founder.sections : founder.sections.slice(0, 1);
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {visibleSections.map((sec, idx) => (
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
                                  {(isExpanded ? sec.paragraphs : sec.paragraphs.slice(0, 2)).map((p, pIdx) => (
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
                            {(founder.sections.length > 1 || (founder.sections[0]?.paragraphs?.length || 0) > 2) && (
                              <button
                                type="button"
                                onClick={() => setExpandedFounders((prev) => ({ ...prev, [founder.id]: !prev[founder.id] }))}
                                style={{
                                  alignSelf: 'flex-start',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--gold-light)',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: '4px 0',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                {isExpanded
                                  ? tr(lang, 'Réduire la biographie ↑', 'Show less ↑', 'Mostrar menos ↑', '收起简介 ↑')
                                  : tr(lang, 'Lire le parcours complet ↓', 'Read full biography ↓', 'Leer biografía completa ↓', '阅读完整履历 ↓')}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Vidéo officielle présente sur co-fondateurs.html */}
            <div>
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
            ONGLET 3 : SERVICES & ASSOCIATIONS (services.html — mise en page épurée)
           ================================================================= */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div style={{ paddingBottom: '28px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                {c.services.heading}
              </h2>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.8, marginBottom: '12px', maxWidth: '940px' }}>
                {c.services.intro1}
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '940px' }}>
                {c.services.intro2}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
                paddingBottom: '32px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              {/* Volet 1 : Vente, location et recherche */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '16px' }}>
                  {c.services.brokerageTitle}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {c.services.brokerageItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volet 2 : Consultation immobilière */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '16px' }}>
                  {c.services.consultingTitle}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {c.services.consultingItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
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
                gap: '36px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Globe size={18} style={{ color: 'var(--gold)' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{c.services.internationalTitle}</h3>
                </div>
                <p style={{ fontSize: '0.93rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {c.services.internationalText}
                </p>
              </div>

              <div>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {c.services.associationsBadges.map((b) => (
                    <div
                      key={b.code}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.84rem', minWidth: '56px' }}>
                        {b.code}
                      </span>
                      <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET FRANCHISES : PACINI, ARABIAN OUD & GRILLADE TAURINO
            (Avec logos officiels et mise en page épurée sans cadres imbriqués)
           ================================================================= */}
        {activeTab === 'franchises' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* En-tête éditorial ouvert (aucun cadre autour de l'introduction) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '20px',
                paddingBottom: '28px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ maxWidth: '800px' }}>
                <div className="badge-gold" style={{ marginBottom: '8px' }}>
                  {tr(lang, 'Membre du Conseil québécois de la franchise (CQF)', 'Member of the Quebec Franchise Council (CQF)', 'Miembro del Consejo Quebequense de la Franquicia (CQF)', '魁北克特许经营理事会 (CQF) 官方成员')}
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                  {tr(lang, 'Franchises accompagnées par Immobilier Himalaya', 'Franchises Supported by Immobilier Himalaya', 'Franquicias acompañadas por Immobilier Himalaya', '喜马拉雅地产服务的连锁特许经营品牌')}
                </h2>
                <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {tr(
                    lang,
                    'Immobilier Himalaya Real Estate Corp. accompagne les bannières et les clients franchisés dans la recherche d’emplacements commerciaux et la négociation de baux.',
                    'Immobilier Himalaya Real Estate Corp. accompanies franchise banners and franchisees in selecting commercial locations and negotiating leases.',
                    'Immobilier Himalaya Real Estate Corp. acompaña a las marcas y franquiciados en la búsqueda de ubicaciones comerciales y la negociación de contratos de arrendamiento.',
                    'Immobilier Himalaya Real Estate Corp. 协助各大连锁品牌及特许经营加盟商进行商业门店选址与租约谈判。'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => scrollToFranchiseForm('tenant')}
                className="btn-gold"
              >
                <Store size={15} /> {tr(lang, 'Contacter notre équipe Franchise', 'Contact Our Franchise Team', 'Contactar al equipo de Franquicias', '联系特许经营顾问团队')}
              </button>
            </div>

            {/* BARRE DE FILTRAGE PAR SECTEUR MINIMALISTE (Idée #6) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '12px'
              }}
            >
              {[
                {
                  id: 'all',
                  label: tr(lang, 'Toutes les enseignes (6)', 'All Brands (6)', 'Todas las marcas (6)', '全部合作品牌 (6)')
                },
                {
                  id: 'restauration',
                  label: tr(lang, 'Restauration & Alimentation (4)', 'Food & Dining (4)', 'Restauración y Alimentación (4)', '餐饮与食品零售 (4)')
                },
                {
                  id: 'commerce_detail',
                  label: tr(lang, 'Commerce de détail & Parfumerie (1)', 'Retail & Perfumery (1)', 'Comercio minorista y Perfumería (1)', '奢华香氛与精品零售 (1)')
                },
                {
                  id: 'services',
                  label: tr(lang, 'Services & Entretien (1)', 'Services & Dry Cleaning (1)', 'Servicios y Tintorería (1)', '生活服务与干洗 (1)')
                }
              ].map((tab) => {
                const isSelected = franchiseSectorFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFranchiseSectorFilter(tab.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: isSelected ? '2px solid var(--gold)' : '2px solid transparent',
                      padding: '6px 0 10px',
                      marginBottom: '-13px',
                      color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)',
                      fontSize: '0.86rem',
                      fontWeight: isSelected ? 700 : 500,
                      letterSpacing: '0.02em',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease, border-color 0.2s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* GALERIE ÉPURÉE DES 6 ENSEIGNES FRANCHISES (LOGOS AGRANDIS & CENTRÉS, SANS TEXTE RÉPÉTITIF) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '36px' }}>
              {filteredFranchises.map((fr) => (
                <div
                  key={fr.id}
                  onClick={() => {
                    setFranchiseFormMode('tenant');
                    setFranchiseBrand(fr.name);
                    if (fr.sectorValue) setFranchiseSector(fr.sectorValue);
                    const el = document.getElementById('franchise-contact-form') || document.getElementById('form-franchise-himalaya');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    background: 'transparent',
                    borderTop: '1px solid rgba(200, 164, 93, 0.38)',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '34px 20px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.25s ease, transform 0.25s ease'
                  }}
                >
                  {/* Zone Logo Officiel Agrandi & Centré */}
                  <div
                    style={{
                      height: '132px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}
                  >
                    <img
                      src={fr.logo}
                      alt={fr.name}
                      style={{
                        height: fr.logoHeight || '68px',
                        maxWidth: '240px',
                        width: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                        filter: fr.invertLogo ? 'brightness(0) invert(1)' : 'none'
                      }}
                    />
                  </div>

                  {/* Sous-titre épuré & Nom de la bannière centrés */}
                  <div style={{ fontSize: '0.73rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    {pickLang(fr, 'category', lang)}
                  </div>
                  <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600, color: '#fff', margin: '0 0 14px' }}>
                    {pickLang(fr, 'name', lang)}
                  </h3>

                  {/* Actions discrètes (#1 & #5 : Pré-remplir le formulaire + Site officiel) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    <span className="editorial-link" style={{ fontSize: '0.73rem' }}>
                      {tr(lang, 'Chercher un local', 'Find a Location', 'Buscar local', '寻找门店选址')} <ArrowRight size={12} />
                    </span>
                    {fr.website && (
                      <a
                        href={fr.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: '0.73rem',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {tr(lang, 'Site officiel', 'Official Website', 'Sitio oficial', '官方网站')} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* APPEL À L'ACTION RAPIDE POUR LES PROPRIÉTAIRES DE LOCAUX COMMERCIAUX (Idée #8) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '4px'
              }}
            >
              <button
                type="button"
                onClick={() => scrollToFranchiseForm('landlord')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--gold)',
                  padding: '8px 4px',
                  color: 'var(--gold-light)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s ease'
                }}
              >
                {tr(
                  lang,
                  "Vous êtes propriétaire d'un local commercial ? Proposer votre emplacement à nos bannières →",
                  'Own a commercial space? Submit your location to our partner brands →',
                  '¿Es propietario de un local comercial? Proponga su ubicación a nuestras marcas →',
                  '拥有商业铺位？向我们的合作品牌推荐您的物业 →'
                )}
              </button>
            </div>

            {/* SECTION BASSE ÉPURÉE EN 2 COLONNES SANS BOÎTE (Infos CQF/Paris + Courtiers à gauche, Formulaire minimaliste à droite) */}
            <div
              id="franchise-contact-form"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '56px',
                alignItems: 'start',
                paddingTop: '44px',
                borderTop: '1px solid rgba(200, 164, 93, 0.32)'
              }}
            >
              {/* COLONNE GAUCHE : Piliers CQF / Paris / Partenaires (en 3 lignes courtes) + Courtiers attitrés */}
              <div id="form-franchise-himalaya">
                <div className="gold-eyebrow" style={{ marginBottom: '8px' }}>
                  {tr(lang, 'DIVISION FRANCHISE', 'FRANCHISE DIVISION', 'DIVISIÓN FRANQUICIAS', '特许经营专部')}
                </div>
                <h3 className="serif-title" style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
                  {tr(
                    lang,
                    'Expansion réseau & sélection de sites commerciaux',
                    'Network Expansion & Commercial Site Selection',
                    'Expansión de red y selección de sitios comerciales',
                    '品牌网络拓展与商业门店选址'
                  )}
                </h3>

                {/* 3 points clés ultra-concis au lieu de 3 longs blocs de texte */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', paddingBottom: '28px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--gold)' }}>•</span>
                    <span>
                      <strong style={{ color: '#fff', fontWeight: 600 }}>Conseil québécois de la franchise (CQF)</strong> — {tr(lang, 'Membre officiel accompagnant franchiseurs et franchisés.', 'Official member supporting franchisors and franchisees.', 'Miembro oficial para franquiciadores y franquiciados.', '官方成员，服务各大特许经营总部与加盟商。')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--gold)' }}>•</span>
                    <span>
                      <strong style={{ color: '#fff', fontWeight: 600 }}>Salon de la Franchise à Paris & ICSC</strong> — {tr(lang, 'Rayonnement international (Porte de Versailles, Las Vegas, Toronto).', 'International presence (Paris, Las Vegas, Toronto).', 'Presencia internacional (París, Las Vegas, Toronto).', '出席巴黎国际特许经营展与 ICSC 峰会。')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--gold)' }}>•</span>
                    <span>
                      <strong style={{ color: '#fff', fontWeight: 600 }}>{tr(lang, 'Écosystème spécialisé', 'Specialized Partner Network', 'Red de socios especializados', '专业合作伙伴网络')}</strong> — {tr(lang, 'Droit de la franchise, géomarketing et design commercial (Fasken, Tutino, FlagFranchise, Indicia).', 'Franchise law, geomarketing, and commercial design (Fasken, Tutino, FlagFranchise, Indicia).', 'Derecho de franquicias, geomarketing y diseño comercial.', '涵盖特许经营法律、地理营销与商业设计。')}
                    </span>
                  </div>
                </div>

                {/* Courtiers attitrés */}
                <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                  {tr(lang, 'Courtiers attitrés — Division Franchise', 'Assigned Brokers — Franchise Division', 'Corredores asignados — División Franquicias', '特许经营专属经纪人')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
                  {directors
                    .filter((d) => ['roger_rheaume', 'mike_ainajian'].includes(d.id))
                    .map((brk) => (
                      <div key={brk.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={brk.photo}
                          alt={brk.name}
                          onClick={() => onSelectBroker && onSelectBroker(brk)}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            border: '1px solid var(--gold)',
                            cursor: 'pointer'
                          }}
                        />
                        <div>
                          <div
                            onClick={() => onSelectBroker && onSelectBroker(brk)}
                            style={{ fontWeight: 600, fontSize: '0.96rem', color: '#fff', cursor: 'pointer' }}
                          >
                            {brk.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                            <a href={`tel:${brk.phone}`} style={{ fontSize: '0.84rem', color: 'var(--gold-light)', textDecoration: 'none' }}>
                              {brk.phone}
                            </a>
                            <a href={`mailto:${brk.email}`} style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center' }} title={brk.email}>
                              <Mail size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* COLONNE DROITE : Formulaire architectural ouvert (zéro boîte grise, champs soulignés épurés) */}
              <div>
                {/* SÉLECTEUR DE PROFIL EN 2 MODES SOULIGNÉS D'OR (Idée #8) */}
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '20px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFranchiseFormMode('tenant');
                      setFranchiseSent(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: franchiseFormMode === 'tenant' ? '2px solid var(--gold)' : '2px solid transparent',
                      padding: '6px 0 10px',
                      marginBottom: '-1px',
                      color: franchiseFormMode === 'tenant' ? 'var(--gold-light)' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: franchiseFormMode === 'tenant' ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {tr(
                      lang,
                      'Franchiseur / Franchisé — Chercher un emplacement',
                      'Franchisor / Franchisee — Find a Location',
                      'Franquiciador / Franquiciado — Buscar local',
                      '特许品牌 / 加盟商 — 寻找商业选址'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFranchiseFormMode('landlord');
                      setFranchiseSent(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: franchiseFormMode === 'landlord' ? '2px solid var(--gold)' : '2px solid transparent',
                      padding: '6px 0 10px',
                      marginBottom: '-1px',
                      color: franchiseFormMode === 'landlord' ? 'var(--gold-light)' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: franchiseFormMode === 'landlord' ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {tr(
                      lang,
                      "Propriétaire d'immeuble — Proposer un local commercial",
                      'Property Owner — Submit a Commercial Space',
                      'Propietario — Proponer un local comercial',
                      '商业业主 — 推荐可用商铺/物业'
                    )}
                  </button>
                </div>

                <div className="gold-eyebrow" style={{ marginBottom: '8px' }}>
                  {franchiseFormMode === 'landlord'
                    ? tr(lang, 'PROPOSER UN LOCAL À NOS CHAÎNES', 'SUBMIT A COMMERCIAL SPACE TO OUR BRANDS', 'PROPONER UN LOCAL A NUESTRAS MARCAS', '向合作品牌推荐商业铺位')
                    : tr(lang, 'TROUVER UN EMPLACEMENT', 'FIND A COMMERCIAL LOCATION', 'BUSCAR UN LOCAL COMERCIAL', '寻找商业门店选址')}
                </div>
                <h3 className="serif-title" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff', marginBottom: '22px' }}>
                  {franchiseFormMode === 'landlord'
                    ? tr(lang, 'Soumettre votre emplacement commercial en 30 secondes', 'Submit Your Commercial Space in 30 Seconds', 'Presente su local comercial en 30 segundos', '30 秒快速提交您的商业物业信息')
                    : tr(lang, 'Transmettre vos critères d’emplacement', 'Submit Your Location Criteria', 'Enviar sus criterios de ubicación', '提交您的门店选址需求')}
                </h3>

                {franchiseSent ? (
                  <div
                    style={{
                      padding: '24px 0',
                      borderTop: '1px solid var(--gold)',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={22} color="var(--gold)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
                          {tr(lang, 'Demande transmise avec succès', 'Franchise Request Sent', 'Solicitud enviada con éxito', '选址需求已成功发送')}
                        </div>
                        <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                          {tr(lang, 'Roger Rhéaume ou Mike Ainajian communiquera avec vous rapidement.', 'Roger Rhéaume or Mike Ainajian will contact you shortly.', 'Roger Rhéaume o Mike Ainajian se pondrá en contacto con usted.', 'Roger Rhéaume 或 Mike Ainajian 将尽快与您联系。')}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFranchiseSent(false)}
                      className="btn-outline"
                      style={{ fontSize: '0.78rem', padding: '7px 14px' }}
                    >
                      {tr(lang, 'Nouvelle demande', 'New Request', 'Nueva solicitud', '新咨询')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFranchiseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    {franchiseFormMode === 'landlord' ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Adresse / Ville du local *', 'Property Address / City *', 'Dirección / Ciudad del local *', '物业地址 / 所在城市 *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={franchiseRegions}
                              onChange={(e) => setFranchiseRegions(e.target.value)}
                              placeholder={tr(lang, 'Ex. : Boul. Taschereau, Brossard ou Centre-ville Montréal', 'Ex: Sainte-Catherine St., Montreal', 'Ej.: Calle Sainte-Catherine, Montreal', '例如：蒙特利尔市中心或拉瓦尔主干道')}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Superficie disponible (en pi²) *', 'Available Area (sq.ft.) *', 'Superficie disponible (pies²) *', '可用面积（平方英尺）*')}
                            </label>
                            <input
                              type="text"
                              required
                              value={franchiseSqft}
                              onChange={(e) => setFranchiseSqft(e.target.value)}
                              placeholder={tr(lang, 'Ex. : 1 800 pi² (divisible, coin de rue, drive-thru)', 'Ex: 1,800 sq.ft. (corner unit, drive-thru)', 'Ej.: 1 800 pies² (esquina, drive-thru)', '例如：1,800 平方英尺（街角铺位）')}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Loyer net demandé ou détails du local *', 'Asking Net Rent or Space Details *', 'Alquiler neto solicitado o detalles *', '期望净租金或铺位详情 *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={franchiseBrand}
                              onChange={(e) => setFranchiseBrand(e.target.value)}
                              placeholder={tr(lang, 'Ex. : 32 $/pi² net • Ventilation restaurant en place', 'Ex: $32/sq.ft. net • Restaurant hood installed', 'Ej.: 32 $/pie² neto • Extracción instalada', '例如：$32/平方英尺净租 • 已配餐饮排风系统')}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Nom complet (Propriétaire / Bailleur) *', 'Full Name (Landlord / Owner) *', 'Nombre completo (Propietario) *', '业主 / 出租方姓名 *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={franchiseContactName}
                              onChange={(e) => setFranchiseContactName(e.target.value)}
                              placeholder={tr(lang, 'Votre nom complet ou société immobilière', 'Your full name or property group', 'Su nombre completo o sociedad inmobiliaria', '您的姓名或地产公司名称')}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Franchise / Bannière *', 'Franchise / Banner *', 'Franquicia / Marca *', '连锁品牌名称 *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={franchiseBrand}
                              onChange={(e) => setFranchiseBrand(e.target.value)}
                              placeholder="Subway, Thaïzone, Les Moulins La Fayette..."
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Secteur d’activité', 'Business Sector', 'Sector de actividad', '行业类别')}
                            </label>
                            <select
                              value={franchiseSector}
                              onChange={(e) => setFranchiseSector(e.target.value)}
                              style={{
                                width: '100%',
                                background: '#0a0a0c',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            >
                              <option value="Restauration & Alimentation">{tr(lang, 'Restauration & Alimentation', 'Food Service & Restaurants', 'Restauración y Alimentación', '餐饮与食品零售')}</option>
                              <option value="Commerce de détail">{tr(lang, 'Commerce de détail & Boutique', 'Retail & Storefront', 'Comercio minorista y Boutique', '精品零售与商业门店')}</option>
                              <option value="Services & Cliniques">{tr(lang, 'Services & Nettoyeurs', 'Services, Clinics & Dry Cleaning', 'Servicios, Clínicas y Tintorerías', '生活服务与连锁干洗')}</option>
                              <option value="Hôtellerie & Villégiature">{tr(lang, 'Hôtellerie & Villégiature', 'Hospitality & Resort', 'Hotelería y Complejos turísticos', '酒店与旅游度假')}</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Régions ciblées & Superficie *', 'Target Regions & Area *', 'Regiones y Superficie *', '目标区域与面积需求 *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={franchiseRegions}
                              onChange={(e) => setFranchiseRegions(e.target.value)}
                              placeholder={tr(lang, 'Ex. : Montréal, Laval • 1 500 à 3 000 pi²', 'Ex: Montreal, Laval • 2,000 sq.ft.', 'Ej.: Montreal, Laval • 1 500 a 3 000 pies²', '例如：蒙特利尔、拉瓦尔 • 1,500 至 3,000 平方英尺')}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                              {tr(lang, 'Nom complet *', 'Full Name *', 'Nombre completo *', '您的姓名 *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={franchiseContactName}
                              onChange={(e) => setFranchiseContactName(e.target.value)}
                              placeholder={tr(lang, 'Votre nom complet', 'Your full name', 'Su nombre completo', '请输入您的姓名')}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 0',
                                color: '#fff',
                                fontSize: '0.94rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                          {tr(lang, 'Courriel *', 'Email *', 'Correo electrónico *', '电子邮箱 *')}
                        </label>
                        <input
                          type="email"
                          required
                          value={franchiseEmail}
                          onChange={(e) => setFranchiseEmail(e.target.value)}
                          placeholder="courriel@exemple.com"
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.2)',
                            padding: '10px 0',
                            color: '#fff',
                            fontSize: '0.94rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                          {tr(lang, 'Téléphone *', 'Phone *', 'Teléfono *', '联系电话 *')}
                        </label>
                        <input
                          type="tel"
                          required
                          value={franchisePhone}
                          onChange={(e) => setFranchisePhone(e.target.value)}
                          placeholder="(514) 000-0000"
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.2)',
                            padding: '10px 0',
                            color: '#fff',
                            fontSize: '0.94rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        * {tr(lang, 'Traitement confidentiel — Roger Rhéaume & Mike Ainajian', 'Confidential handling — Roger Rhéaume & Mike Ainajian', 'Tratamiento confidencial — Roger Rhéaume & Mike Ainajian', '由 Roger Rhéaume 与 Mike Ainajian 保密跟进')}
                      </span>
                      <button type="submit" className="btn-gold" style={{ padding: '11px 24px' }}>
                        {franchiseFormMode === 'landlord'
                          ? tr(lang, 'Proposer mon local', 'Submit My Space', 'Proponer mi local', '提交铺位推荐')
                          : tr(lang, 'Envoyer ma demande', 'Submit Inquiry', 'Enviar solicitud', '提交选址咨询')}{' '}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            ONGLET 4 : CARRIÈRES & AFFILIÉS (devenir-courtier & devenir-affilie — Style architectural ouvert « Sans Boîte »)
           ================================================================= */}
        {activeTab === 'carrieres' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '44px'
              }}
            >
              {/* Volet 1 : Devenir courtier immobilier */}
              <div
                style={{
                  background: 'transparent',
                  borderTop: '1px solid rgba(200, 164, 93, 0.35)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '28px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge-gold" style={{ marginBottom: '12px' }}>
                    {tr(lang, 'Carrières — Courtage immobilier', 'Careers — Real Estate Brokerage', 'Carreras — Corretaje inmobiliario', '职业发展 — 房地产经纪')}
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
                  background: 'transparent',
                  borderTop: '1px solid rgba(200, 164, 93, 0.35)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '28px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge-gold" style={{ marginBottom: '12px' }}>
                    {tr(lang, 'Réseau international — Agences affiliées', 'International Network — Affiliated Agencies', 'Red internacional — Agencias afiliadas', '国际合作网络 — 加盟经纪机构')}
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

            {/* Formulaire officiel de candidature intégré (#14 & #18 — Section ouverte sans boîte avec champs architecturaux soulignés) */}
            <div
              id="form-candidature-himalaya"
              style={{
                background: 'transparent',
                borderTop: '1px solid rgba(200, 164, 93, 0.35)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '36px 0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                <div>
                  <div className="gold-eyebrow" style={{ marginBottom: '8px' }}>
                    {tr(lang, 'FORMULAIRE DE CANDIDATURE CONFIDENTIEL', 'CONFIDENTIAL APPLICATION FORM', 'FORMULARIO DE CANDIDATURA CONFIDENCIAL', '保密申请表')}
                  </div>
                  <h3 className="serif-title" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff' }}>
                    {careerType === 'affilie'
                      ? tr(lang, 'Postuler — Devenir Agence Affiliée Himalaya', 'Apply to Become an Affiliated Agency', 'Postular — Convertirse en Agencia Afiliada Himalaya', '申请成为喜马拉雅国际合作加盟机构')
                      : tr(lang, 'Postuler — Devenir Courtier Immobilier Himalaya', 'Apply to Become a Himalaya Real Estate Broker', 'Postular — Convertirse en Corredor Inmobiliario Himalaya', '申请成为喜马拉雅地产认证经纪人')}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    {tr(
                      lang,
                      'Votre candidature est transmise directement et en toute confidentialité à la direction (Roger Rhéaume & Geniev Mondoux).',
                      'Your application is sent directly and confidentially to Roger Rhéaume & Geniev Mondoux.',
                      'Su candidatura se envía directamente y con total confidencialidad a la dirección (Roger Rhéaume y Geniev Mondoux).',
                      '您的申请将直接以严格保密方式发送至管理层（Roger Rhéaume 与 Geniev Mondoux）。'
                    )}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setCareerType('courtier'); setCareerSent(false); }}
                    className={careerType === 'courtier' ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  >
                    {tr(lang, 'Volet Courtier', 'Broker Application', 'Candidatura Corredor', '经纪人申请')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCareerType('affilie'); setCareerSent(false); }}
                    className={careerType === 'affilie' ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  >
                    {tr(lang, 'Volet Affilié', 'Affiliate Application', 'Candidatura Afiliado', '合作机构申请')}
                  </button>
                </div>
              </div>

              {careerSent ? (
                <div style={{
                  padding: '24px 0',
                  borderTop: '1px solid var(--gold)',
                  borderBottom: '1px solid var(--border-subtle)',
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
                        {tr(lang, 'Candidature transmise avec succès !', 'Application Received Successfully!', '¡Candidatura enviada con éxito!', '申请已成功提交！')}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                        {tr(
                          lang,
                          'Merci de votre intérêt pour Immobilier Himalaya Real Estate Corp. Notre direction communiquera avec vous sous peu.',
                          'Thank you for your interest in Himalaya Real Estate Corp. Our executive team will contact you shortly.',
                          'Gracias por su interés en Immobilier Himalaya Real Estate Corp. Nuestra dirección se pondrá en contacto con usted en breve.',
                          '感谢您对喜马拉雅地产集团的关注，我们的管理团队将尽快与您联系。'
                        )}
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
                    {tr(lang, 'Nouvelle candidature', 'New Application', 'Nueva candidatura', '提交新申请')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCareerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                        {tr(lang, 'Nom complet *', 'Full Name *', 'Nombre completo *', '姓名 *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={careerName}
                        onChange={(e) => setCareerName(e.target.value)}
                        placeholder={tr(lang, 'Votre nom et prénom', 'Your full name', 'Su nombre y apellido', '请输入您的全名')}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          padding: '10px 0',
                          color: '#fff',
                          fontSize: '0.94rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                        {tr(lang, 'Adresse courriel *', 'Email Address *', 'Correo electrónico *', '电子邮箱 *')}
                      </label>
                      <input
                        type="email"
                        required
                        value={careerEmail}
                        onChange={(e) => setCareerEmail(e.target.value)}
                        placeholder="courriel@exemple.com"
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          padding: '10px 0',
                          color: '#fff',
                          fontSize: '0.94rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                        {tr(lang, 'Téléphone *', 'Phone Number *', 'Teléfono *', '联系电话 *')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={careerPhone}
                        onChange={(e) => setCareerPhone(e.target.value)}
                        placeholder="(514) 000-0000"
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          padding: '10px 0',
                          color: '#fff',
                          fontSize: '0.94rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                        {tr(lang, 'Ville / Adresse / Agence actuelle', 'City / Address / Current Agency', 'Ciudad / Dirección / Agencia actual', '所在城市 / 地址 / 当前所属机构')}
                      </label>
                      <input
                        type="text"
                        value={careerAddress}
                        onChange={(e) => setCareerAddress(e.target.value)}
                        placeholder={tr(lang, 'Montréal, QC (Permis OACIQ)', 'Montreal, QC (OACIQ License)', 'Montreal, QC (Licencia OACIQ)', '蒙特利尔, QC (OACIQ 牌照)')}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          padding: '10px 0',
                          color: '#fff',
                          fontSize: '0.94rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', marginBottom: '6px' }}>
                      {tr(
                        lang,
                        'Pourquoi désirez-vous joindre notre équipe ? (Expérience, spécialités, territoires) *',
                        'Why would you like to join our team? (Experience, specialties, territories) *',
                        '¿Por qué desea unirse a nuestro equipo? (Experiencia, especialidades, territorios) *',
                        '您为何希望加入我们的团队？（从业经验、专业领域、业务区域）*'
                      )}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={careerMotivation}
                      onChange={(e) => setCareerMotivation(e.target.value)}
                      placeholder={tr(
                        lang,
                        'Parlez-nous de votre parcours en courtage immobilier et de vos objectifs...',
                        'Tell us about your real estate background and goals...',
                        'Cuéntenos sobre su trayectoria en corretaje inmobiliario y sus objetivos...',
                        '请简要介绍您的房地产从业背景与职业发展目标...'
                      )}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                        padding: '10px 0',
                        color: '#fff',
                        fontSize: '0.94rem',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      * {tr(lang, 'Champs obligatoires. Traitement 100 % confidentiel.', 'Required fields. Treated with 100% confidentiality.', 'Campos obligatorios. Tratamiento 100 % confidencial.', '必填项。所有信息均严格保密处理。')}
                    </span>
                    <button type="submit" className="btn-gold" style={{ padding: '11px 24px' }}>
                      {tr(lang, 'Soumettre ma candidature', 'Submit My Application', 'Enviar mi candidatura', '提交申请')} <ArrowRight size={15} />
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
        {activeTab === 'faq' && (() => {
          const normalizeFaqText = (str = '') =>
            String(str)
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase();
          const trimmedQuery = faqSearchQuery.trim();
          const normalizedQuery = normalizeFaqText(trimmedQuery);
          const isSearchActive = normalizedQuery.length > 0;
          const filteredFaqItems = c.faq.items
            .map((item, originalIdx) => ({ ...item, originalIdx }))
            .filter((item) => {
              if (!isSearchActive) return true;
              return (
                normalizeFaqText(item.q).includes(normalizedQuery) ||
                normalizeFaqText(item.a).includes(normalizedQuery)
              );
            });

          return (
            <div style={{ maxWidth: '900px' }}>
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>{c.faq.heading}</h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{c.faq.subtitle}</p>
              </div>

              {/* Champ de recherche architectural souligné (Idée #15) */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '28px',
                  borderBottom: '1px solid rgba(200, 164, 93, 0.45)',
                  paddingBottom: '8px'
                }}
              >
                <Search size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder={tr(
                    lang,
                    'Rechercher un sujet dans la FAQ : OACIQ, mise de fonds, bail commercial, commission...',
                    'Search a topic in the FAQ: OACIQ, down payment, commercial lease, commission...',
                    'Buscar un tema en las FAQ: OACIQ, pago inicial, contrato comercial, comisión...',
                    '在常见问题中搜索：OACIQ、首付、商业租约、佣金...'
                  )}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '6px 0',
                    color: '#fff',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                {faqSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery('')}
                    aria-label={tr(lang, 'Effacer la recherche', 'Clear search', 'Borrar búsqueda', '清除搜索')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gold-light)',
                      fontSize: '1.15rem',
                      lineHeight: 1,
                      padding: '2px 6px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              {filteredFaqItems.length === 0 ? (
                <div
                  style={{
                    padding: '28px 0',
                    borderTop: '1px solid rgba(200, 164, 93, 0.35)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.94rem',
                    lineHeight: 1.7
                  }}
                >
                  <p style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>
                    {tr(
                      lang,
                      'Aucune question de la FAQ ne correspond à votre recherche. N’hésitez pas à reformuler votre mot-clé ou à communiquer directement avec nos courtiers.',
                      'No FAQ question matches your search. Please try another keyword or contact our brokers directly.',
                      'Ninguna pregunta de las FAQ coincide con su búsqueda. Intente con otra palabra clave o contacte directamente a nuestros corredores.',
                      '未找到与您搜索词匹配的常见问题。请尝试其他关键词或直接联系我们的专业经纪人。'
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery('')}
                    className="btn-outline"
                    style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  >
                    {tr(lang, 'Réinitialiser la recherche', 'Reset search', 'Restablecer búsqueda', '重置搜索')}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredFaqItems.map((item, idx) => {
                    const isOpen = isSearchActive ? true : openFaqIndex === item.originalIdx;
                    return (
                      <div
                        key={item.originalIdx}
                        style={{
                          background: 'transparent',
                          borderTop: idx === 0 ? '1px solid rgba(200, 164, 93, 0.35)' : 'none',
                          borderBottom: `1px solid ${isOpen ? 'var(--gold)' : 'var(--border-subtle)'}`
                        }}
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : item.originalIdx)}
                          style={{
                            width: '100%',
                            padding: '18px 0',
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
                              padding: '0 0 18px',
                              fontSize: '0.92rem',
                              color: 'var(--text-secondary)',
                              lineHeight: 1.7
                            }}
                          >
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* =================================================================
            ONGLET 6 : LIENS IMMOBILIERS & PARTENAIRES (liens-immobiliers.html)
           ================================================================= */}
        {activeTab === 'liens' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '4px' }}>{c.links.heading}</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{c.links.subtitle}</p>
              </div>

              <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                {[
                  {
                    id: 'partenaires',
                    label: tr(lang, 'Partenaires multidisciplinaires', 'Multidisciplinary Partners', 'Socios multidisciplinarios', '多学科专业合作伙伴')
                  },
                  {
                    id: 'gouvernement',
                    label: tr(lang, 'Sites gouvernementaux officiels', 'Official Government Links', 'Portales gubernamentales', '官方政府机构名录')
                  }
                ].map((sec) => {
                  const isCurrent = linksSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setLinksSection(sec.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: isCurrent ? '2px solid var(--gold)' : '2px solid transparent',
                        padding: '6px 2px',
                        color: isCurrent ? 'var(--gold-light)' : 'var(--text-secondary)',
                        fontSize: '0.82rem',
                        fontWeight: isCurrent ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {sec.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sites gouvernementaux officiels */}
            {linksSection === 'gouvernement' && (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px 32px'
                  }}
                >
                  {c.links.govLinks.map((gov, idx) => (
                    <a
                      key={idx}
                      href={gov.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                        padding: '14px 0',
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '4px'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>{gov.name}</span>
                        <ExternalLink size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {gov.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Répertoire des partenaires professionnels d'Himalaya — Version épurée sans surcharge visuelle */}
            {linksSection === 'partenaires' && (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '28px 36px'
                  }}
                >
                  {c.links.partnerGroups.map((group, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'transparent',
                        padding: '4px 0 18px'
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--gold)',
                          marginBottom: '14px',
                          paddingBottom: '8px',
                          borderBottom: '1px solid rgba(200, 164, 93, 0.3)'
                        }}
                      >
                        {group.category}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {group.items.map((partner, pIdx) => {
                          const contactParts = (partner.contact || '')
                            .split('•')
                            .map((s) => s.trim())
                            .filter(Boolean);

                          return (
                            <div
                              key={pIdx}
                              style={{
                                fontSize: '0.84rem',
                                paddingBottom: '12px',
                                borderBottom: pIdx < group.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: 'var(--text-primary)',
                                  marginBottom: '2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '8px'
                                }}
                              >
                                {partner.website ? (
                                  <a
                                    href={partner.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      color: 'var(--text-primary)',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                                  >
                                    <span>{partner.name}</span>
                                    <ExternalLink size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                  </a>
                                ) : (
                                  <span>{partner.name}</span>
                                )}
                              </div>

                              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '5px' }}>
                                {partner.specialty}
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: '12px',
                                  fontSize: '0.76rem'
                                }}
                              >
                                {contactParts.map((part, cIdx) => {
                                  if (part.includes('@')) {
                                    return (
                                      <a
                                        key={cIdx}
                                        href={`mailto:${part}`}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          color: 'var(--gold-light)',
                                          textDecoration: 'none'
                                        }}
                                      >
                                        <Mail size={11} style={{ color: 'var(--gold)' }} />
                                        {part}
                                      </a>
                                    );
                                  }

                                  if (/^www\.|^https?:\/\//i.test(part)) {
                                    return null;
                                  }

                                  const firstPhone = part
                                    .split('/')[0]
                                    .trim();
                                  const mainNumber = firstPhone.split(/poste|ext\.?/i)[0];
                                  const dialDigits = mainNumber.replace(/[^\d+]/g, '');
                                  if (dialDigits.length >= 7) {
                                    return (
                                      <a
                                        key={cIdx}
                                        href={`tel:${dialDigits}`}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          color: 'var(--text-secondary)',
                                          textDecoration: 'none'
                                        }}
                                      >
                                        <Phone size={11} style={{ color: 'var(--gold)' }} />
                                        {firstPhone}
                                      </a>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
