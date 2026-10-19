import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, MapPin, Phone, Mail, Sparkles, 
  ArrowRight, Lock, ExternalLink, ChevronRight, 
  Play, Pause, CheckCircle2, Menu, X, LayoutGrid, Map as MapIcon
} from 'lucide-react';
import liveDealsData from './data/himalayaLiveDeals.json';
import { INITIAL_HIMALAYA_BROKERS } from './data/brokersData';
import { 
  HIMALAYA_AGENCIES, HIMALAYA_EVENTS, HIMALAYA_NEWS, 
  HIMALAYA_PODCASTS, SPECIALTIES_DATA 
} from './data/siteContent';
import { TRANSLATIONS } from './data/translations';
import { 
  normalizeText, dealBelongsToBroker, 
  submitLeadToProspection, getStoredWebLeads 
} from './utils/prospectionBridge';
import PropertyDetailModal from './components/PropertyDetailModal';
import BuyerNDAModal from './components/BuyerNDAModal';
import BrokerDetailModal from './components/BrokerDetailModal';
import PropertiesMapView from './components/PropertiesMapView';

const VALID_PAGES = ['home', 'proprietes', 'courtiers', 'agences', 'a-propos', 'evenements', 'balados', 'nous-joindre', 'zone-equipe'];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [lang, setLang] = useState('FR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.FR;

  // Filtres de recherche
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtrePropriete, setFiltrePropriete] = useState('all');
  const [rechercheBut, setRechercheBut] = useState('all');
  const [filtreRegion, setFiltreRegion] = useState('all');
  const [filtreCourtier, setFiltreCourtier] = useState('all');
  const [sortBy, setSortBy] = useState('price_desc');
  const [propertiesViewMode, setPropertiesViewMode] = useState('grid'); // 'grid' | 'map' (Point 11)

  // Filtres courtiers
  const [brokerCategoryFilter, setBrokerCategoryFilter] = useState('all');
  const [brokerSearch, setBrokerSearch] = useState('');

  // Modales (Points 14, 16)
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [ndaModalDeal, setNdaModalDeal] = useState(undefined);

  // Lecteur Balados (Point 5)
  const [playingPodcastId, setPlayingPodcastId] = useState(null);

  // Formulaire Nous joindre & Évaluation Vendeur (Points 9, 17, 20)
  const [contactTab, setContactTab] = useState('general'); // 'general' | 'valuation'
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: 'Acquérir une propriété / Dossiers hors-marché',
    assetType: 'Pourvoirie / Camping / Villégiature',
    fullName: '',
    phone: '',
    email: '',
    city: '',
    revenue: '',
    message: ''
  });
  const [webLeads, setWebLeads] = useState(() => getStoredWebLeads());

  // Synchronisation URL & Bouton Retour navigateur + Deep-linking ?mls=... (Points 3 & 14)
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const mlsParam = params.get('mls');
      if (mlsParam) {
        const found = liveDealsData.find(d => String(d.mls_number).toLowerCase() === mlsParam.toLowerCase());
        if (found) setSelectedDeal(found);
      }

      const hash = window.location.hash.replace('#', '').trim();
      if (VALID_PAGES.includes(hash)) {
        setActivePage(hash);
      } else if (!hash) {
        setActivePage('home');
      }
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  // Régions uniques nettoyées (Point 2)
  const availableRegions = useMemo(() => {
    const s = new Set();
    liveDealsData.forEach(d => {
      if (d.region) s.add(d.region);
    });
    return Array.from(s).sort();
  }, []);

  // Filtrage des propriétés avec recherche insensible aux accents (Points 4 & 8)
  const filteredProperties = useMemo(() => {
    const qNorm = normalizeText(searchKeyword);

    return liveDealsData
      .filter(d => {
        if (rechercheBut !== 'all' && d.transaction_type !== rechercheBut) return false;

        if (filtrePropriete !== 'all') {
          const cat = normalizeText(d.category);
          const desc = normalizeText(d.description);
          const title = normalizeText(d.title);
          const f = normalizeText(filtrePropriete);
          if (f === 'pourvoirie') {
            if (!cat.includes('camping') && !cat.includes('pourvoirie') && !cat.includes('hotellerie') && !desc.includes('camping') && !desc.includes('pourvoirie') && !desc.includes('chalet') && !desc.includes('villegiature')) {
              return false;
            }
          } else if (f === 'commercial') {
            if (!cat.includes('commercial') && !cat.includes('industriel') && !cat.includes('entreprise') && !cat.includes('investissement')) {
              return false;
            }
          } else if (f === 'terrain') {
            if (!cat.includes('terrain') && !title.includes('terrain') && !desc.includes('terrain vacant')) {
              return false;
            }
          } else if (f === 'residentiel') {
            if (!cat.includes('residentiel') && !desc.includes('residentiel') && !desc.includes('maison') && !desc.includes('condo')) {
              return false;
            }
          }
        }

        if (filtreRegion !== 'all') {
          if (normalizeText(d.region) !== normalizeText(filtreRegion)) {
            return false;
          }
        }

        if (filtreCourtier !== 'all') {
          if (!dealBelongsToBroker(d, filtreCourtier)) return false;
        }

        if (qNorm) {
          const haystack = normalizeText(
            `${d.title} ${d.city} ${d.region} ${d.mls_number} ${d.description} ${d.assigned_broker}`
          );
          if (!haystack.includes(qNorm)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        return (a.title || '').localeCompare(b.title || '');
      });
  }, [rechercheBut, filtrePropriete, filtreRegion, filtreCourtier, searchKeyword, sortBy]);

  // Filtrage courtiers insensible aux accents (Point 4)
  const filteredBrokers = useMemo(() => {
    const q = normalizeText(brokerSearch);
    return INITIAL_HIMALAYA_BROKERS.filter(b => {
      if (brokerCategoryFilter !== 'all' && b.category !== brokerCategoryFilter) return false;
      if (q) {
        const hay = normalizeText(`${b.name} ${b.title} ${b.city}`);
        return hay.includes(q);
      }
      return true;
    });
  }, [brokerCategoryFilter, brokerSearch]);

  const navigateTo = (page, options = {}) => {
    if (options.filtrePropriete !== undefined) setFiltrePropriete(options.filtrePropriete);
    if (options.filtreCourtier !== undefined) setFiltreCourtier(options.filtreCourtier);
    if (options.contactTab !== undefined) setContactTab(options.contactTab);
    setActivePage(page);
    setMobileMenuOpen(false);
    const newHash = page === 'home' ? '' : `#${page}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash || window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDealModal = (deal) => {
    setSelectedDeal(deal);
    if (deal?.mls_number) {
      const url = new URL(window.location.href);
      url.searchParams.set('mls', deal.mls_number);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const closeDealModal = () => {
    setSelectedDeal(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has('mls')) {
      url.searchParams.delete('mls');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    await submitLeadToProspection({
      type: contactTab === 'valuation' ? 'valuation' : 'contact',
      subject: contactTab === 'valuation' ? `Évaluation : ${contactForm.assetType}` : contactForm.subject,
      assetType: contactForm.assetType,
      fullName: contactForm.fullName,
      phone: contactForm.phone,
      email: contactForm.email,
      city: contactForm.city,
      revenue: contactForm.revenue,
      message: contactForm.message
    });
    setWebLeads(getStoredWebLeads());
    setContactSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER PRINCIPAL ÉPURÉ (Logo seul à gauche, navigation sur 1 ligne, FR/EN/ES fonctionnel) */}
      <header className="main-header">
        <div className="container header-inner">
          <div 
            onClick={() => navigateTo('home', { filtrePropriete: 'all', filtreCourtier: 'all' })}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <img 
              src="https://www.himalayacorp.com/gx/himalaya-immobilier-logo.svg" 
              alt="Immobilier Himalaya"
              style={{ height: '48px', width: 'auto', display: 'block' }}
              onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/himalaya-immobilier-logo.png'; }}
            />
          </div>

          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <button className={`nav-btn ${activePage === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'proprietes' ? 'active' : ''}`} onClick={() => navigateTo('proprietes')}>
                  {t.nav.properties} ({liveDealsData.length})
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'courtiers' ? 'active' : ''}`} onClick={() => navigateTo('courtiers')}>
                  {t.nav.brokers}
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'agences' ? 'active' : ''}`} onClick={() => navigateTo('agences')}>
                  {t.nav.agencies}
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'a-propos' ? 'active' : ''}`} onClick={() => navigateTo('a-propos')}>
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'evenements' ? 'active' : ''}`} onClick={() => navigateTo('evenements')}>
                  {t.nav.news}
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'balados' ? 'active' : ''}`} onClick={() => navigateTo('balados')}>
                  {t.nav.podcasts}
                </button>
              </li>
            </ul>
          </nav>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '7px',
              padding: '2px'
            }}>
              {['FR', 'EN', 'ES'].map(code => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    background: lang === code ? 'var(--gold)' : 'transparent',
                    color: lang === code ? '#070b0a' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '4px 8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {code}
                </button>
              ))}
            </div>

            <button 
              onClick={() => { setWebLeads(getStoredWebLeads()); navigateTo('zone-equipe'); }}
              className="btn-outline"
              style={{ padding: '7px 12px', fontSize: '0.8rem' }}
            >
              <Lock size={13} /> {t.nav.team}
            </button>
            <button 
              className="btn-gold" 
              style={{ padding: '8px 16px', fontSize: '0.84rem' }} 
              onClick={() => navigateTo('nous-joindre')}
            >
              {t.nav.contact}
            </button>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.nav.menu}</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{
            background: '#080d0b',
            borderBottom: '1px solid var(--border-gold)',
            padding: '16px 24px'
          }}>
            <div className="container">
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {['FR', 'EN', 'ES'].map(code => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={lang === code ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                  >
                    {code}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                {[
                  { id: 'home', label: t.nav.home },
                  { id: 'proprietes', label: `${t.nav.properties} (${liveDealsData.length})` },
                  { id: 'courtiers', label: t.nav.brokers },
                  { id: 'agences', label: t.nav.agencies },
                  { id: 'a-propos', label: t.nav.about },
                  { id: 'evenements', label: t.nav.news },
                  { id: 'balados', label: t.nav.podcasts },
                  { id: 'nous-joindre', label: t.nav.contact },
                  { id: 'zone-equipe', label: t.nav.team }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: activePage === item.id ? 'rgba(200,164,93,0.16)' : 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: activePage === item.id ? 'var(--gold-light)' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          PAGE 1 : ACCUEIL ÉPURÉ
         ===================================================================== */}
      {activePage === 'home' && (
        <main style={{ flex: 1 }}>
          {/* HERO VIDEO LUMINEUX */}
          <section className="hero-section">
            <video 
              className="hero-video-bg" 
              autoPlay 
              loop 
              muted 
              playsInline
              poster="https://www.himalayacorp.com/gx/partage.jpg"
            >
              <source src="https://www.himalayacorp.com/gx/video/Himalaya.mp4" type="video/mp4" />
              <source src="https://www.himalayacorp.com/gx/video/Himalaya.webm" type="video/webm" />
            </video>
            <div className="hero-overlay" />

            <div className="container hero-content">
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15, maxWidth: '820px', margin: '0 auto 14px', letterSpacing: '-0.02em' }}>
                {t.hero.titleStart} <span className="gold-gradient-text">{t.hero.titleHighlight}</span>
              </h1>

              <p style={{ color: '#e6ece9', fontSize: '1.02rem', maxWidth: '620px', margin: '0 auto' }}>
                {t.hero.subtitle}
              </p>

              {/* Moteur de recherche épuré sur 1 ligne */}
              <form 
                className="search-bar-box"
                onSubmit={e => { e.preventDefault(); navigateTo('proprietes'); }}
              >
                <div className="search-grid">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder={t.hero.searchPlaceholder}
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                  />

                  <select 
                    className="form-control"
                    value={filtrePropriete}
                    onChange={e => setFiltrePropriete(e.target.value)}
                  >
                    <option value="all">{t.hero.allCategories}</option>
                    <option value="commercial">{t.hero.catCommercial}</option>
                    <option value="pourvoirie">{t.hero.catOutfitter}</option>
                    <option value="terrain">{t.hero.catLand}</option>
                    <option value="residentiel">{t.hero.catResidential}</option>
                  </select>

                  <select 
                    className="form-control"
                    value={filtreRegion}
                    onChange={e => setFiltreRegion(e.target.value)}
                  >
                    <option value="all">{t.hero.allRegions}</option>
                    {availableRegions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <button type="submit" className="btn-gold" style={{ height: '42px', padding: '0 24px' }}>
                    <Search size={16} /> {t.hero.searchBtn}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* SPÉCIALITÉS (4 cartes visuelles épurées) */}
          <section style={{ padding: '64px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{t.home.specialtiesTitle}</h2>
                <button onClick={() => navigateTo('proprietes', { filtrePropriete: 'all' })} className="btn-outline">
                  {t.home.allPropertiesBtn} ({liveDealsData.length}) <ArrowRight size={15} />
                </button>
              </div>

              <div className="specialty-grid">
                {SPECIALTIES_DATA.map(spec => (
                  <div 
                    key={spec.id} 
                    className="specialty-card"
                    onClick={() => {
                      if (spec.id === 'pourvoirieCamping') {
                        navigateTo('proprietes', { filtrePropriete: 'pourvoirie' });
                      } else if (spec.id === 'commercial') {
                        navigateTo('proprietes', { filtrePropriete: 'commercial' });
                      } else if (spec.id === 'residentiel') {
                        navigateTo('proprietes', { filtrePropriete: 'residentiel' });
                      } else {
                        navigateTo('agences');
                      }
                    }}
                  >
                    <img 
                      src={spec.image} 
                      alt={spec.title}
                      onError={e => { e.target.src = spec.fallbackImage; }}
                    />
                    <div className="specialty-overlay">
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '4px' }}>
                        {spec.subtitle}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#fff', lineHeight: 1.25 }}>
                        {spec.title}
                      </h3>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold-light)' }}>
                        {t.home.explore} <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROPRIÉTÉS À LA UNE */}
          <section style={{ padding: '64px 0', background: 'var(--bg-darker)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{t.home.featuredTitle}</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: t.home.tabAll },
                    { id: 'pourvoirie', label: t.home.tabOutfitter },
                    { id: 'commercial', label: t.home.tabCommercial },
                    { id: 'terrain', label: t.home.tabLand }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFiltrePropriete(tab.id)}
                      className={filtrePropriete === tab.id ? 'btn-gold' : 'btn-outline'}
                      style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="properties-grid">
                {filteredProperties.slice(0, 6).map(deal => (
                  <PropertyCard 
                    key={deal.id} 
                    deal={deal} 
                    t={t}
                    onSelect={() => openDealModal(deal)}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
                <button onClick={() => navigateTo('proprietes')} className="btn-gold">
                  {t.home.viewAllProperties} ({liveDealsData.length}) <ArrowRight size={16} />
                </button>
                <button onClick={() => setNdaModalDeal(null)} className="btn-outline">
                  <Lock size={15} /> {t.home.offMarketBtn}
                </button>
              </div>
            </div>
          </section>

          {/* BANNIÈRE CHIFFRES CLÉS & PRÉSENTATION CONCISE */}
          <section style={{ padding: '64px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '18px',
                marginBottom: '40px'
              }}>
                {[
                  { num: `${liveDealsData.length}`, label: t.home.statMandates },
                  { num: '1 115+', label: t.home.statOutfitterDb },
                  { num: `${INITIAL_HIMALAYA_BROKERS.length}`, label: t.home.statBrokers },
                  { num: '5', label: t.home.statOffices }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '22px',
                    textAlign: 'center'
                  }}>
                    <div className="gold-gradient-text" style={{ fontSize: '2rem', fontWeight: 700 }}>
                      {stat.num}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{ maxWidth: '660px' }}>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '8px' }}>
                    {t.home.ctaTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                    {t.home.ctaDesc}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => navigateTo('courtiers')} className="btn-gold">
                    {t.home.ourBrokersBtn} <ArrowRight size={15} />
                  </button>
                  <button onClick={() => navigateTo('nous-joindre', { contactTab: 'valuation' })} className="btn-outline">
                    {t.home.evaluateBtn}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          PAGE 2 : NOS PROPRIÉTÉS (Grille + Vue Carte Interactive - Point 11)
         ===================================================================== */}
      {activePage === 'proprietes' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '2.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{t.properties.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                  {filteredProperties.length} {t.properties.shownCount} {liveDealsData.length} {t.properties.activeMandates}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Bascule sobre Grille | Carte (Point 11) */}
                <div style={{
                  display: 'inline-flex',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '3px'
                }}>
                  <button
                    onClick={() => setPropertiesViewMode('grid')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600,
                      background: propertiesViewMode === 'grid' ? 'var(--gold)' : 'transparent',
                      color: propertiesViewMode === 'grid' ? '#070b0a' : 'var(--text-secondary)'
                    }}
                  >
                    <LayoutGrid size={14} /> {t.properties.viewGrid}
                  </button>
                  <button
                    onClick={() => setPropertiesViewMode('map')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600,
                      background: propertiesViewMode === 'map' ? 'var(--gold)' : 'transparent',
                      color: propertiesViewMode === 'map' ? '#070b0a' : 'var(--text-secondary)'
                    }}
                  >
                    <MapIcon size={14} /> {t.properties.viewMap}
                  </button>
                </div>

                <button onClick={() => setNdaModalDeal(null)} className="btn-outline">
                  <Lock size={14} /> {t.home.offMarketBtn}
                </button>
              </div>
            </div>

            {/* Barre de filtres épurée */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '28px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                gap: '10px'
              }}>
                <input 
                  type="text"
                  className="form-control"
                  placeholder={t.hero.searchPlaceholder}
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />

                <select className="form-control" value={filtrePropriete} onChange={e => setFiltrePropriete(e.target.value)}>
                  <option value="all">{t.hero.allCategories}</option>
                  <option value="commercial">{t.hero.catCommercial}</option>
                  <option value="pourvoirie">{t.hero.catOutfitter}</option>
                  <option value="terrain">{t.hero.catLand}</option>
                  <option value="residentiel">{t.hero.catResidential}</option>
                </select>

                <select className="form-control" value={rechercheBut} onChange={e => setRechercheBut(e.target.value)}>
                  <option value="all">{t.properties.saleAndRent}</option>
                  <option value="Vente">{t.properties.forSale}</option>
                  <option value="Location">{t.properties.forRent}</option>
                </select>

                <select className="form-control" value={filtreRegion} onChange={e => setFiltreRegion(e.target.value)}>
                  <option value="all">{t.hero.allRegions}</option>
                  {availableRegions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <select className="form-control" value={filtreCourtier} onChange={e => setFiltreCourtier(e.target.value)}>
                  <option value="all">{t.properties.allBrokers}</option>
                  {INITIAL_HIMALAYA_BROKERS.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>

                <select className="form-control" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="price_desc">{t.properties.sortDesc}</option>
                  <option value="price_asc">{t.properties.sortAsc}</option>
                  <option value="title_asc">{t.properties.sortAlpha}</option>
                </select>
              </div>

              {(filtrePropriete !== 'all' || rechercheBut !== 'all' || filtreRegion !== 'all' || filtreCourtier !== 'all' || searchKeyword) && (
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <button 
                    onClick={() => {
                      setFiltrePropriete('all');
                      setRechercheBut('all');
                      setFiltreRegion('all');
                      setFiltreCourtier('all');
                      setSearchKeyword('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-light)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {t.properties.resetFilters}
                  </button>
                </div>
              )}
            </div>

            {filteredProperties.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px' }}>
                  {t.properties.noResultsTitle}
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 18px', fontSize: '0.9rem' }}>
                  {t.properties.noResultsDesc}
                </p>
                <button onClick={() => setNdaModalDeal(null)} className="btn-gold">
                  <Lock size={15} /> {t.home.offMarketBtn}
                </button>
              </div>
            ) : propertiesViewMode === 'map' ? (
              <PropertiesMapView 
                properties={filteredProperties}
                onSelectDeal={deal => openDealModal(deal)}
                t={t}
              />
            ) : (
              <div className="properties-grid">
                {filteredProperties.map(deal => (
                  <PropertyCard 
                    key={deal.id} 
                    deal={deal} 
                    t={t}
                    onSelect={() => openDealModal(deal)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 3 : À PROPOS
         ===================================================================== */}
      {activePage === 'a-propos' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ maxWidth: '880px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '18px' }}>
                {t.about.title} <span className="gold-gradient-text">Himalaya</span>
              </h1>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '28px',
                marginBottom: '36px'
              }}>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '14px' }}>
                  {t.about.p1}
                </p>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {t.about.p2}
                </p>
              </div>

              <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '18px' }}>
                {t.about.leadershipTitle}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {INITIAL_HIMALAYA_BROKERS.filter(b => b.category === 'direction').map(dir => (
                  <div 
                    key={dir.id} 
                    className="broker-card" 
                    onClick={() => setSelectedBroker(dir)}
                    style={{ padding: '22px', textAlign: 'center', cursor: 'pointer' }}
                  >
                    <img 
                      src={dir.photo} 
                      alt={dir.name}
                      style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '2px solid var(--gold)' }}
                    />
                    <span className="badge-gold" style={{ margin: '0 auto 8px' }}>{dir.shortTitle}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>{dir.name}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{dir.city}</p>
                    <span className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 14px', width: '100%' }}>
                      {t.brokers.viewProfile} <ChevronRight size={14} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 4 : AGENCES
         ===================================================================== */}
      {activePage === 'agences' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
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
                  <div className="property-img-wrap" style={{ height: '195px' }}>
                    <img src={ag.image} alt={ag.name} />
                    <span className="badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(7,11,10,0.88)' }}>
                      {ag.badge}
                    </span>
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {ag.city} • {ag.country}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0 8px' }}>{ag.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        <MapPin size={13} style={{ display: 'inline', marginRight: '5px', color: 'var(--gold)' }} />
                        {ag.address}
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
      )}

      {/* =====================================================================
          PAGE 5 : COURTIERS (Correspondance exacte mandats + Modale profil - Points 8 & 16)
         ===================================================================== */}
      {activePage === 'courtiers' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '4px' }}>{t.brokers.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {INITIAL_HIMALAYA_BROKERS.length} {t.brokers.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input 
                  type="text"
                  className="form-control"
                  style={{ width: '210px' }}
                  placeholder={t.brokers.searchPlaceholder}
                  value={brokerSearch}
                  onChange={e => setBrokerSearch(e.target.value)}
                />
                {[
                  { id: 'all', label: t.brokers.catAll },
                  { id: 'direction', label: t.brokers.catDirection },
                  { id: 'commercial', label: t.brokers.catCommercial },
                  { id: 'residentiel', label: t.brokers.catResidential },
                  { id: 'international', label: t.brokers.catInternational }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setBrokerCategoryFilter(cat.id)}
                    className={brokerCategoryFilter === cat.id ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '8px 13px', fontSize: '0.82rem' }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="brokers-grid">
              {filteredBrokers.map(broker => {
                const brokerDeals = liveDealsData.filter(d => dealBelongsToBroker(d, broker.name));

                return (
                  <div key={broker.id} className="broker-card">
                    <div 
                      onClick={() => setSelectedBroker(broker)}
                      style={{ position: 'relative', height: '250px', background: '#070b0a', overflow: 'hidden', cursor: 'pointer' }}
                    >
                      <img 
                        src={broker.photo} 
                        alt={broker.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 60%, rgba(14,21,19,0.96) 100%)'
                      }} />
                      <span className="badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(7,11,10,0.85)' }}>
                        {broker.shortTitle}
                      </span>
                      {brokerDeals.length > 0 && (
                        <span style={{
                          position: 'absolute', bottom: '10px', right: '12px',
                          background: 'rgba(7,11,10,0.88)', border: '1px solid var(--border-gold)',
                          color: 'var(--gold-light)', fontSize: '0.72rem', fontWeight: 700,
                          padding: '3px 8px', borderRadius: '99px'
                        }}>
                          {brokerDeals.length} {t.brokers.activeMandates}
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div onClick={() => setSelectedBroker(broker)} style={{ marginBottom: '14px', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>{broker.name}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {broker.city}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={`tel:${broker.phone}`} className="btn-gold" style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}>
                          <Phone size={13} /> {broker.phone}
                        </a>
                        <button 
                          onClick={() => setSelectedBroker(broker)} 
                          className="btn-outline" 
                          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                        >
                          {t.brokers.viewProfile}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 6 : ÉVÉNEMENTS & ACTUALITÉS
         ===================================================================== */}
      {activePage === 'evenements' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '28px' }}>{t.news.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '44px' }}>
              {HIMALAYA_EVENTS.map(ev => (
                <div key={ev.id} className="property-card" style={{ padding: '22px' }}>
                  <span className="badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>{ev.dateRange}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>{ev.title}</h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--gold)', marginBottom: '10px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '5px' }} /> {ev.location}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>{ev.description}</p>
                  <a href={ev.url} target="_blank" rel="noreferrer" className="btn-outline" style={{ alignSelf: 'flex-start', padding: '8px 14px', fontSize: '0.82rem' }}>
                    {t.news.detailsBtn} <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '18px' }}>
              {t.news.recentNews}
            </h2>
            <div className="properties-grid">
              {HIMALAYA_NEWS.map(news => (
                <div key={news.id} className="property-card">
                  <div className="property-img-wrap" style={{ height: '190px' }}>
                    <img 
                      src={news.image} 
                      alt={news.title}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'; }}
                    />
                  </div>
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: '6px' }}>{news.date} • {news.category}</div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{news.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>{news.excerpt}</p>
                    </div>
                    <a href={news.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-light)', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      {t.news.readArticle} <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 7 : BALADOS (Lecteur intégré propre — Point 5)
         ===================================================================== */}
      {activePage === 'balados' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '6px' }}>{t.podcasts.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                {t.podcasts.subtitle}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {HIMALAYA_PODCASTS.map(pod => {
                const isPlaying = playingPodcastId === pod.id;
                return (
                  <div key={pod.id} style={{
                    background: 'var(--bg-card)',
                    border: isPlaying ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '22px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span className="badge-gold">{pod.episode}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pod.duration}</span>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>{pod.title}</h3>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{pod.description}</p>
                      </div>
                      <button
                        onClick={() => setPlayingPodcastId(isPlaying ? null : pod.id)}
                        className={isPlaying ? 'btn-outline' : 'btn-gold'}
                      >
                        {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                        {isPlaying ? t.podcasts.pauseBtn : t.podcasts.listenBtn}
                      </button>
                    </div>

                    {isPlaying && (
                      <div style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                          {t.podcasts.playingLabel} • {pod.hosts}
                        </span>
                        <audio controls autoPlay style={{ height: '34px', maxWidth: '320px' }}>
                          <source src="https://www.himalayacorp.com/gx/video/Himalaya.mp4" type="audio/mp4" />
                        </audio>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 8 : NOUS JOINDRE + ÉVALUER MA PROPRIÉTÉ (Connecté à Himalaya Prospection - Points 9, 17, 20)
         ===================================================================== */}
      {activePage === 'nous-joindre' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '10px' }}>{t.contact.title}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.94rem' }}>
                  {t.contact.subtitle}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>{t.contact.hqLabel}</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '4px' }}>Immobilier Himalaya Real Estate Corp.</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>3905, boul. Henri-Bourassa Ouest, Montréal (QC) H4R 1Z2</div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                      <a href="tel:5148984898" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>(514) 898-4898</a>
                      <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>info@himalayacorp.com</a>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>{t.contact.leadershipLabel}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '6px', lineHeight: 1.7 }}>
                      <strong>Roger Rhéaume</strong> (Président) : 514-585-2605<br />
                      <strong>Geniev Mondoux</strong> (Vice-Présidente) : 514-898-4898<br />
                      <strong>Mike Ainajian</strong> (Directeur d’Agence) : 514-898-4898
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '26px'
              }}>
                {/* Bascule sobre : Message général | Vendre / Évaluer ma propriété (Point 17) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '4px',
                  borderRadius: '9px',
                  marginBottom: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => { setContactTab('general'); setContactSubmitted(false); }}
                    style={{
                      padding: '8px 10px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600,
                      background: contactTab === 'general' ? 'var(--gold)' : 'transparent',
                      color: contactTab === 'general' ? '#070b0a' : 'var(--text-secondary)'
                    }}
                  >
                    {t.contact.tabGeneral}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContactTab('valuation'); setContactSubmitted(false); }}
                    style={{
                      padding: '8px 10px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600,
                      background: contactTab === 'valuation' ? 'var(--gold)' : 'transparent',
                      color: contactTab === 'valuation' ? '#070b0a' : 'var(--text-secondary)'
                    }}
                  >
                    {t.contact.tabValuation}
                  </button>
                </div>

                {contactSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '28px 10px' }}>
                    <CheckCircle2 size={42} color="#70e000" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px' }}>{t.contact.sentTitle}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '18px', fontSize: '0.88rem' }}>
                      {t.contact.sentDesc}
                    </p>
                    <button onClick={() => setContactSubmitted(false)} className="btn-gold">{t.contact.newMsgBtn}</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {contactTab === 'valuation' ? (
                        <>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              {t.contact.assetTypeLabel}
                            </label>
                            <select 
                              className="form-control"
                              value={contactForm.assetType}
                              onChange={e => setContactForm({ ...contactForm, assetType: e.target.value })}
                            >
                              <option>Pourvoirie / Camping / Domaine de villégiature</option>
                              <option>Immeuble commercial / Industriel / Bureau</option>
                              <option>Hôtel / Auberge / Restauration</option>
                              <option>Terrain de développement</option>
                              <option>Résidentiel de prestige</option>
                            </select>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input 
                              required 
                              type="text" 
                              className="form-control" 
                              placeholder={t.contact.cityPlaceholder}
                              value={contactForm.city}
                              onChange={e => setContactForm({ ...contactForm, city: e.target.value })}
                            />
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder={t.contact.revenuePlaceholder}
                              value={contactForm.revenue}
                              onChange={e => setContactForm({ ...contactForm, revenue: e.target.value })}
                            />
                          </div>
                        </>
                      ) : (
                        <select 
                          className="form-control"
                          value={contactForm.subject}
                          onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                        >
                          <option>Acquérir une propriété / Dossiers hors-marché</option>
                          <option>Implanter une franchise au Québec / Canada</option>
                          <option>Devenir courtier ou agence affiliée Himalaya</option>
                        </select>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input 
                          required 
                          type="text" 
                          className="form-control" 
                          placeholder={t.contact.namePlaceholder}
                          value={contactForm.fullName}
                          onChange={e => setContactForm({ ...contactForm, fullName: e.target.value })}
                        />
                        <input 
                          required 
                          type="tel" 
                          className="form-control" 
                          placeholder={t.contact.phonePlaceholder}
                          value={contactForm.phone}
                          onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                      <input 
                        required 
                        type="email" 
                        className="form-control" 
                        placeholder={t.contact.emailPlaceholder}
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                      <textarea 
                        required 
                        rows={3} 
                        className="form-control" 
                        placeholder={t.contact.msgPlaceholder}
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      />
                      <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                        {contactTab === 'valuation' ? t.contact.submitValuationBtn : t.contact.submitBtn}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 9 : ZONE ÉQUIPE & SYNCHRONISATION HIMALAYA PROSPECTION (Point 20)
         ===================================================================== */}
      {activePage === 'zone-equipe' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--gold)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
                <div>
                  <span className="badge-gold" style={{ marginBottom: '10px' }}>
                    <Lock size={12} /> Portail Interne
                  </span>
                  <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
                    Zone Équipe &amp; <span className="gold-gradient-text">Himalaya Prospection CRM</span>
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
                    Passerelle directe vers le logiciel interne de prospection, gestion des 1 115+ actifs et salle de données NDA.
                  </p>
                </div>

                <a 
                  href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5176' : 'https://himalaya-prospection.vercel.app'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-gold"
                >
                  <Sparkles size={16} /> Ouvrir Himalaya Prospection <ExternalLink size={14} />
                </a>
              </div>

              {/* Journal des prospects et NDA capturés depuis le site web (Points 9 & 20) */}
              {webLeads.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                    Dernières demandes &amp; signatures NDA capturées ({webLeads.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {webLeads.slice(0, 8).map(lead => (
                      <div key={lead.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '0.84rem'
                      }}>
                        <div>
                          <span className="badge-gold" style={{ marginRight: '10px' }}>
                            {lead.type === 'nda' ? 'NDA Signé' : (lead.type === 'valuation' ? 'Évaluation Vendeur' : 'Contact')}
                          </span>
                          <strong>{lead.fullName}</strong> • {lead.phone} • {lead.email}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          {lead.dealTitle || lead.subject || lead.assetType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          FOOTER ÉPURÉ
         ===================================================================== */}
      <footer style={{
        background: '#030504',
        borderTop: '1px solid var(--border-subtle)',
        padding: '44px 0 28px',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="https://www.himalayacorp.com/gx/himalaya-immobilier-logo.svg" 
                alt="Himalaya" 
                style={{ height: '42px', display: 'block' }}
                onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/himalaya-immobilier-logo.png'; }}
              />
            </div>

            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <button onClick={() => navigateTo('proprietes')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.properties}</button>
              <button onClick={() => navigateTo('courtiers')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.brokers}</button>
              <button onClick={() => navigateTo('agences')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.agencies}</button>
              <button onClick={() => navigateTo('nous-joindre')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.contact}</button>
              <button onClick={() => navigateTo('zone-equipe')} style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer', fontWeight: 600 }}>{t.nav.team}</button>
            </div>
          </div>

          <div style={{
            paddingTop: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            <div>© 2026 Immobilier Himalaya Real Estate Corp.</div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <a href="https://www.facebook.com/himalayarealestate/" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.linkedin.com/company/immobilier-himalaya-real-estate-corp." target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/himalayaimmobilier/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALES */}
      {selectedDeal && (
        <PropertyDetailModal 
          deal={selectedDeal}
          t={t}
          onClose={closeDealModal}
          onOpenNDA={deal => setNdaModalDeal(deal)}
          onFilterByBroker={brokerName => navigateTo('proprietes', { filtreCourtier: brokerName })}
        />
      )}

      {selectedBroker && (
        <BrokerDetailModal
          broker={selectedBroker}
          deals={liveDealsData.filter(d => dealBelongsToBroker(d, selectedBroker.name))}
          t={t}
          onClose={() => setSelectedBroker(null)}
          onSelectDeal={deal => openDealModal(deal)}
        />
      )}

      {ndaModalDeal !== undefined && (
        <BuyerNDAModal 
          deal={ndaModalDeal}
          t={t}
          onClose={() => { setWebLeads(getStoredWebLeads()); setNdaModalDeal(undefined); }}
        />
      )}
    </div>
  );
}

/* Carte Propriété épurée (sans pavé de texte, régions nettoyées, boutons sur 1 ligne) */
function PropertyCard({ deal, t, onSelect }) {
  const broker = (deal.brokers_details && deal.brokers_details[0]) || {
    name: deal.assigned_broker || 'Équipe Himalaya',
    photo: 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'
  };

  const locationLabel = deal.city && deal.region && deal.city !== deal.region
    ? `${deal.city} (${deal.region})`
    : (deal.city || deal.region);

  return (
    <div className="property-card" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <div className="property-img-wrap">
        <img 
          src={deal.main_photo} 
          alt={deal.title}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'; }}
        />
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <span className="badge-gold" style={{ background: 'rgba(7,11,10,0.88)', backdropFilter: 'blur(6px)' }}>
            {deal.category || deal.transaction_type}
          </span>
        </div>

        <div style={{
          position: 'absolute', bottom: '12px', left: '12px',
          background: 'rgba(7,11,10,0.92)', border: '1px solid var(--border-gold)',
          padding: '5px 11px', borderRadius: '7px', fontWeight: 700, color: 'var(--gold-light)',
          fontSize: '0.96rem', whiteSpace: 'nowrap'
        }}>
          {deal.price_raw}
        </div>
      </div>

      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            marginBottom: '6px',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {deal.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <MapPin size={13} color="var(--gold)" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {locationLabel}
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <img 
              src={broker.photo} 
              alt={broker.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gold)', flexShrink: 0 }}
              onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {broker.name}
            </span>
          </div>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-light)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {t?.properties?.viewListing || 'Voir la fiche'} <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
