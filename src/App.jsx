import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { 
  Search, MapPin, Phone, Mail, Sparkles, 
  ArrowRight, Lock, ExternalLink, ChevronRight, 
  Play, Pause, CheckCircle2, Menu, X, LayoutGrid, Map as MapIcon
} from 'lucide-react';
import liveDealsData from './data/himalayaLiveDeals.json';
import { INITIAL_HIMALAYA_BROKERS } from './data/brokersData';
import { 
  HIMALAYA_AGENCIES, HIMALAYA_EVENTS, HIMALAYA_NEWS, 
  HIMALAYA_PODCASTS, SPECIALTIES_DATA, OFFICIAL_SOCIAL_LINKS, LEGAL_DOCUMENTS,
  HIMALAYA_FRANCHISES
} from './data/siteContent';
import { TRANSLATIONS } from './data/translations';
import { 
  normalizeText, dealBelongsToBroker, 
  submitLeadToProspection, getStoredWebLeads 
} from './utils/prospectionBridge';

// Code-splitting & Lazy Loading des vues lourdes et modales (#19)
const PropertyDetailModal = lazy(() => import('./components/PropertyDetailModal'));
const BuyerNDAModal = lazy(() => import('./components/BuyerNDAModal'));
const BrokerDetailModal = lazy(() => import('./components/BrokerDetailModal'));
const PropertiesMapView = lazy(() => import('./components/PropertiesMapView'));
const AboutPageView = lazy(() => import('./components/AboutPageView'));
const ToolsHubView = lazy(() => import('./components/ToolsHubView'));

const VALID_PAGES = ['home', 'proprietes', 'franchises', 'courtiers', 'agences', 'a-propos', 'outils', 'evenements', 'balados', 'nous-joindre', 'zone-equipe'];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('himalaya_site_lang');
      if (saved === 'FR' || saved === 'EN') return saved;
    } catch {}
    return 'FR';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEn = lang === 'EN';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.FR;

  const handleLanguageChange = (code) => {
    setLang(code);
    try {
      localStorage.setItem('himalaya_site_lang', code);
      document.documentElement.lang = code.toLowerCase();
    } catch {}
  };

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

  // Modales & États additionnels (#3, #4, #6, #15, #16, #18)
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [ndaModalDeal, setNdaModalDeal] = useState(undefined);
  const [toolPreselectedDeal, setToolPreselectedDeal] = useState(null);
  const [toolInitialTab, setToolInitialTab] = useState('plex');
  const [aboutInitialTab, setAboutInitialTab] = useState('qui-nous-sommes');
  const [newsYearFilter, setNewsYearFilter] = useState('all');
  const [legalModalType, setLegalModalType] = useState(null); // 'terms' | 'privacy' | null
  const [isScrolled, setIsScrolled] = useState(false);

  // Détection du défilement avec hystérésis (zéro clignotement / oscillation au scroll #3)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(prev => (prev ? y > 35 : y > 110));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  // Synchronisation URL & Bouton Retour navigateur + Deep-linking ?propriete=... & ?courtier=... (#16, #18)
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const propParam = params.get('propriete') || params.get('mls');
      if (propParam) {
        const found = liveDealsData.find(d => String(d.mls_number).toLowerCase() === propParam.toLowerCase());
        if (found) setSelectedDeal(found);
      } else {
        setSelectedDeal(null);
      }

      const brokerParam = params.get('courtier');
      if (brokerParam) {
        const foundBroker = INITIAL_HIMALAYA_BROKERS.find(
          b => b.id.toLowerCase() === brokerParam.toLowerCase() || normalizeText(b.name) === normalizeText(brokerParam)
        );
        if (foundBroker) setSelectedBroker(foundBroker);
      } else {
        setSelectedBroker(null);
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

  // Filtrage des propriétés avec distinction claire À vendre / À louer / Vendu (#8)
  const filteredProperties = useMemo(() => {
    const qNorm = normalizeText(searchKeyword);

    return liveDealsData
      .filter(d => {
        if (rechercheBut === 'Vendu') {
          if (d.status !== 'Vendu') return false;
        } else if (rechercheBut === 'Vente') {
          if (d.transaction_type !== 'Vente' || d.status === 'Vendu') return false;
        } else if (rechercheBut === 'Location') {
          if (d.transaction_type !== 'Location' || d.status === 'Vendu') return false;
        }

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

  // Filtrage courtiers multi-rôles (Résidentiel & Commercial, Direction, International)
  const filteredBrokers = useMemo(() => {
    const q = normalizeText(brokerSearch);
    return INITIAL_HIMALAYA_BROKERS.filter(b => {
      if (brokerCategoryFilter !== 'all') {
        const cats = Array.isArray(b.categories) ? b.categories : [b.category];
        if (!cats.includes(brokerCategoryFilter)) return false;
      }
      if (q) {
        const hay = normalizeText(`${b.name} ${b.title} ${b.shortTitle} ${b.city}`);
        return hay.includes(q);
      }
      return true;
    });
  }, [brokerCategoryFilter, brokerSearch]);

  const navigateTo = (page, options = {}) => {
    if (options.filtrePropriete !== undefined) setFiltrePropriete(options.filtrePropriete);
    if (options.filtreCourtier !== undefined) setFiltreCourtier(options.filtreCourtier);
    if (options.rechercheBut !== undefined) setRechercheBut(options.rechercheBut);
    if (options.propertiesViewMode !== undefined) setPropertiesViewMode(options.propertiesViewMode);
    if (options.brokerCategoryFilter !== undefined) setBrokerCategoryFilter(options.brokerCategoryFilter);
    if (options.contactTab !== undefined) setContactTab(options.contactTab);
    if (options.aboutTab !== undefined) setAboutInitialTab(options.aboutTab);
    if (options.toolTab !== undefined) setToolInitialTab(options.toolTab);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
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
      url.searchParams.delete('mls');
      url.searchParams.set('propriete', deal.mls_number);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const closeDealModal = () => {
    setSelectedDeal(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('mls');
    url.searchParams.delete('propriete');
    window.history.replaceState(null, '', url.toString());
  };

  const openBrokerModal = (broker) => {
    setSelectedBroker(broker);
    if (broker?.id) {
      const url = new URL(window.location.href);
      url.searchParams.set('courtier', broker.id);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const closeBrokerModal = () => {
    setSelectedBroker(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('courtier');
    window.history.replaceState(null, '', url.toString());
  };

  const internalBannerTitle = useMemo(() => {
    switch (activePage) {
      case 'a-propos': return t.nav.about;
      case 'proprietes': return t.nav.properties;
      case 'franchises': return 'Franchises';
      case 'courtiers': return t.nav.brokers;
      case 'agences': return t.nav.agencies;
      case 'outils': return isEn ? 'Financial Tools & Simulators' : 'Outils & Calculateurs';
      case 'evenements': return t.nav.news;
      case 'balados': return t.nav.podcasts;
      case 'nous-joindre': return t.nav.contact;
      case 'zone-equipe': return t.nav.team;
      default: return '';
    }
  }, [activePage, t, isEn]);

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
      {/* HEADER PRINCIPAL — Architecture 3 Gauche / Losange Central / 3 Droite + Sous-menus épurés (1 à 20) */}
      <header className={`main-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          {/* Navigation Gauche (3 onglets aérés : L'Agence ▾, Courtiers ▾, Franchises ▾) */}
          <nav className="desktop-nav header-nav-side header-nav-left">
            <a
              href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
              target="_blank"
              rel="noreferrer"
              className="header-multiprets-link"
              title={isEn ? 'Multi-Prêts Mortgages — Pre-Qualification' : 'Multi-Prêts Hypothèques — Préqualification'}
            >
              <img
                src="/gx/m/Multi_Prets.png"
                alt="Multi-Prêts Hypothèques"
                fetchPriority="high"
                decoding="sync"
              />
            </a>
            <ul className="nav-links">
              {/* 1. L'AGENCE ▾ */}
              <li className="nav-item-dropdown">
                <button
                  className={`nav-btn ${(activePage === 'a-propos' || activePage === 'agences') ? 'active' : ''}`}
                  onClick={() => navigateTo('a-propos', { aboutTab: 'qui-nous-sommes' })}
                >
                  {isEn ? 'The Agency' : 'L’Agence'} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'qui-nous-sommes' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Who We Are' : 'Qui nous sommes'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'co-fondateurs' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Co-Founders' : 'Co-fondateurs'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('agences')}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Our Offices' : 'Nos agences'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'services' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Services & Associations' : 'Services & Associations'}
                    </span>
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'carrieres' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Careers & Affiliates' : 'Carrières & Affiliés'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'liens' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Partners & Links' : 'Partenaires & Liens'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'faq' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'FAQ' : 'FAQ'}
                    </span>
                  </button>
                </div>
              </li>

              {/* 2. COURTIERS ▾ */}
              <li className="nav-item-dropdown">
                <button
                  className={`nav-btn ${activePage === 'courtiers' ? 'active' : ''}`}
                  onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'all' })}
                >
                  {t.nav.brokers} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'all' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'All Brokers' : 'Tous nos courtiers'}
                    </span>
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'direction' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Management' : 'Direction'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'commercial' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Commercial' : 'Commercial'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'residentiel' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Residential' : 'Résidentiel'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'international' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'International' : 'International'}
                    </span>
                  </button>
                </div>
              </li>

              {/* 3. FRANCHISES ▾ */}
              <li className="nav-item-dropdown">
                <button
                  className={`nav-btn ${activePage === 'franchises' ? 'active' : ''}`}
                  onClick={() => navigateTo('franchises')}
                >
                  Franchises <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('franchises')}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Our Franchise Clients' : 'Nos enseignes clientes'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => {
                      setContactForm(prev => ({
                        ...prev,
                        subject: isEn
                          ? 'Franchise Expansion — Find a Commercial Location'
                          : 'Expansion de franchise — Trouver un emplacement commercial'
                      }));
                      navigateTo('nous-joindre', { contactTab: 'general' });
                    }}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Find a Location' : 'Trouver un emplacement'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('evenements')}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'CQF & Paris Network' : 'Réseau CQF & Paris'}
                    </span>
                  </button>
                </div>
              </li>
            </ul>
          </nav>

          {/* Losange Central Officiel Himalaya (Déployé en haut, Fondu fluide au défilement #3) */}
          <div className="header-diamond-wrap">
            <div
              className="header-diamond-box"
              onClick={() => navigateTo('home', { filtrePropriete: 'all', filtreCourtier: 'all' })}
              title={t.nav.home}
            >
              <img
                className="diamond-logo-full"
                src="/gx/himalaya-immobilier-logo.svg"
                alt="Immobilier Himalaya Real Estate Corp."
                fetchPriority="high"
                decoding="sync"
              />
            </div>
            <div
              className="header-compact-brand"
              onClick={() => navigateTo('home', { filtrePropriete: 'all', filtreCourtier: 'all' })}
              title={t.nav.home}
            >
              <span className="gold-gradient-text" style={{ fontSize: '1.22rem', fontWeight: 800, letterSpacing: '0.22em' }}>
                HIMALAYA
              </span>
              <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.78)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '2px' }}>
                Immobilier | Real Estate
              </span>
            </div>
          </div>

          {/* Navigation Droite (3 onglets aérés : Propriétés ▾, Outils & Médias ▾, Nous joindre ▾ + FR | EN) */}
          <div className="desktop-nav header-nav-side header-nav-right">
            <ul className="nav-links">
              {/* 4. PROPRIÉTÉS ▾ */}
              <li className="nav-item-dropdown">
                <button
                  className={`nav-btn ${activePage === 'proprietes' ? 'active' : ''}`}
                  onClick={() => navigateTo('proprietes', { filtrePropriete: 'all', propertiesViewMode: 'grid' })}
                >
                  {t.nav.properties} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel align-right">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'all', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'All Properties' : 'Toutes les propriétés'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'commercial', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Commercial & Investment' : 'Commercial & Investissement'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'pourvoirie', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Outfitters & Hospitality' : 'Pourvoiries & Hôtellerie'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'terrain', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Land' : 'Terrains'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'residentiel', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Residential' : 'Résidentiel'}
                    </span>
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'all', propertiesViewMode: 'map' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Interactive Map' : 'Carte interactive'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => setNdaModalDeal(null)}
                  >
                    <span className="nav-dropdown-link-title" style={{ color: 'var(--gold-light)' }}>
                      {isEn ? 'Off-Market (NDA)' : 'Hors-marché (NDA)'}
                    </span>
                  </button>
                </div>
              </li>

              {/* 5. OUTILS & MÉDIAS ▾ */}
              <li className="nav-item-dropdown">
                <button
                  className={`nav-btn ${(activePage === 'outils' || activePage === 'evenements' || activePage === 'balados') ? 'active' : ''}`}
                  onClick={() => navigateTo('outils', { toolTab: 'plex' })}
                >
                  {isEn ? 'Tools & Media' : 'Outils & Médias'} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel align-right">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('outils', { toolTab: 'plex' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Commercial & Plex ROI' : 'Rentabilité Commercial & Plex'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('outils', { toolTab: 'welcome' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Welcome Tax' : 'Taxe de bienvenue'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('outils', { toolTab: 'mortgage' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Mortgage Calculator' : 'Calculatrice hypothécaire'}
                    </span>
                  </button>
                  <a
                    href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
                    target="_blank"
                    rel="noreferrer"
                    className="nav-dropdown-link"
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Multi-Prêts Pre-Qualification' : 'Préqualification Multi-Prêts'}
                      <ExternalLink size={12} style={{ color: 'var(--gold)' }} />
                    </span>
                  </a>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('evenements')}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'News & Events' : 'Actualités & Événements'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('balados')}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Podcasts' : 'Balados'}
                    </span>
                  </button>
                </div>
              </li>

              {/* 6. NOUS JOINDRE ▾ */}
              <li className="nav-item-dropdown">
                <button
                  className={`nav-btn nav-btn-cta ${activePage === 'nous-joindre' ? 'active' : ''}`}
                  onClick={() => navigateTo('nous-joindre', { contactTab: 'general' })}
                >
                  {t.nav.contact} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel align-right">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('nous-joindre', { contactTab: 'general' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Contact Us' : 'Nous contacter'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('nous-joindre', { contactTab: 'valuation' })}
                  >
                    <span className="nav-dropdown-link-title" style={{ color: 'var(--gold-light)' }}>
                      {isEn ? 'Evaluate My Property' : 'Évaluer ma propriété'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'carrieres' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {isEn ? 'Become a Broker / Affiliate' : 'Devenir courtier / affilié'}
                    </span>
                  </button>
                </div>
              </li>
            </ul>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '4px',
                paddingLeft: '10px',
                borderLeft: '1px solid rgba(255,255,255,0.16)'
              }}
            >
              {['FR', 'EN'].map((code, idx) => (
                <React.Fragment key={code}>
                  {idx > 0 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>|</span>}
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(code)}
                    style={{
                      background: 'transparent',
                      color: lang === code ? 'var(--gold)' : '#ffffff',
                      border: 'none',
                      padding: '4px 5px',
                      fontSize: '0.8rem',
                      fontWeight: lang === code ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {code}
                  </button>
                </React.Fragment>
              ))}
            </div>
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
            background: '#0d0d10',
            borderBottom: '1px solid var(--border-gold)',
            padding: '64px 24px 16px'
          }}>
            <div className="container">
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {['FR', 'EN'].map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleLanguageChange(code)}
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
                  { id: 'a-propos', label: t.nav.about },
                  { id: 'agences', label: t.nav.agencies },
                  { id: 'courtiers', label: t.nav.brokers },
                  { id: 'proprietes', label: `${t.nav.properties} (${liveDealsData.length})` },
                  { id: 'franchises', label: 'Franchises' },
                  { id: 'outils', label: t.nav.tools },
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

      {/* BANDEAU PANORAMIQUE MONTAGNE ENNEIGÉE NOIR & BLANC SOUS LE LOSANGE (#1) */}
      {activePage !== 'home' && (
        <section className="internal-mountain-banner">
          <h1 className="internal-banner-title">{internalBannerTitle}</h1>
        </section>
      )}

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
              preload="metadata"
              poster="/gx/partage.jpg"
            >
              <source src="https://www.himalayacorp.com/gx/video/Himalaya.mp4" type="video/mp4" />
              <source src="https://www.himalayacorp.com/gx/video/Himalaya.webm" type="video/webm" />
            </video>
            <div className="hero-overlay" />

            <div className="container hero-content">
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15, maxWidth: '820px', margin: '0 auto 14px', letterSpacing: '-0.02em' }}>
                {t.hero.titleStart} <span className="gold-gradient-text">{t.hero.titleHighlight}</span>
              </h1>

              <p style={{ color: '#f4f4f6', fontSize: '1.02rem', maxWidth: '640px', margin: '0 auto' }}>
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
                      alt={isEn ? (spec.title_en || spec.title) : spec.title}
                      onError={e => { e.target.src = spec.fallbackImage; }}
                    />
                    <div className="specialty-overlay">
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '4px' }}>
                        {isEn ? (spec.subtitle_en || spec.subtitle) : spec.subtitle}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#fff', lineHeight: 1.25 }}>
                        {isEn ? (spec.title_en || spec.title) : spec.title}
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

          {/* BANNIÈRE CHIFFRES CLÉS AUTHENTIQUES & PRÉSENTATION ÉPURÉE */}
          <section style={{ padding: '64px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                padding: '28px 0',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '56px'
              }}>
                {[
                  { num: `${liveDealsData.length}`, label: t.home.statMandates },
                  { num: `${INITIAL_HIMALAYA_BROKERS.length}`, label: t.home.statBrokers },
                  { num: t.home.statFoundedNum, label: t.home.statFounded },
                  { num: t.home.statPolesNum, label: t.home.statPoles }
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '6px 12px' }}>
                    <div className="gold-gradient-text" style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.1 }}>
                      {stat.num}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* VITRINE FRANCHISES SUR L'ACCUEIL (PACINI, ARABIAN OUD & GRILLADE TAURINO) — SANS CADRES IMBRIQUÉS */}
              <div style={{ marginBottom: '56px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '28px'
                }}>
                  <div>
                    <span className="badge-gold" style={{ marginBottom: '6px' }}>
                      {isEn ? 'CQF Member • Franchise Clients' : 'Membre CQF • Clients Franchisés'}
                    </span>
                    <h3 style={{ fontSize: '1.65rem', fontWeight: 700 }}>
                      {isEn
                        ? 'Franchises Supported by Immobilier Himalaya'
                        : 'Franchises accompagnées par Immobilier Himalaya'}
                    </h3>
                  </div>
                  <button
                    onClick={() => navigateTo('franchises')}
                    className="btn-outline"
                    style={{ fontSize: '0.84rem', padding: '10px 18px' }}
                  >
                    {isEn ? 'Open Franchises Section' : 'Accéder à l’onglet Franchises'} <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px'
                }}>
                  {HIMALAYA_FRANCHISES.map(fr => (
                    <div
                      key={fr.id}
                      onClick={() => navigateTo('franchises')}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '14px',
                        padding: '26px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '18px',
                        transition: 'border-color 0.25s ease, transform 0.25s ease'
                      }}
                    >
                      <div>
                        {fr.logo && (
                          <div style={{
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginBottom: '18px',
                            paddingBottom: '14px',
                            borderBottom: '1px solid var(--border-subtle)'
                          }}>
                            <img
                              src={fr.logo}
                              alt={fr.name}
                              style={{
                                maxHeight: fr.logoHeight || '44px',
                                maxWidth: '180px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: fr.invertLogo ? 'brightness(0) invert(1)' : 'none'
                              }}
                            />
                          </div>
                        )}
                        <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                          {isEn ? fr.category_en : fr.category}
                        </div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                          {isEn ? fr.name_en : fr.name}
                        </h4>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {isEn ? fr.description_en : fr.description}
                        </p>
                      </div>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                        {isEn ? 'Assigned Broker(s): ' : 'Courtier(s) attitré(s) : '} <span style={{ color: '#fff' }}>{fr.brokerNames}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                paddingTop: '36px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{ maxWidth: '660px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                    {t.home.ctaTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6 }}>
                    {t.home.ctaDesc}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
          PAGE 2 : NOS PROPRIÉTÉS (Grille + Vue Carte Interactive + Filtre Vendu #8)
         ===================================================================== */}
      {activePage === 'proprietes' && (
        <main style={{ flex: 1, padding: '44px 0 80px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{t.properties.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                  {filteredProperties.length} {t.properties.shownCount} {liveDealsData.length} {t.properties.activeMandates}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Filtres rapides de statut (#8 : Tous | À vendre | À louer | Vendu) */}
                <div style={{
                  display: 'inline-flex',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '3px',
                  gap: '2px'
                }}>
                  {[
                    { id: 'all', label: isEn ? 'All' : 'Tous' },
                    { id: 'Vente', label: t.properties.forSale },
                    { id: 'Location', label: t.properties.forRent }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setRechercheBut(st.id)}
                      style={{
                        padding: '6px 11px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 600,
                        background: rechercheBut === st.id ? 'var(--gold)' : 'transparent',
                        color: rechercheBut === st.id ? '#09090b' : 'var(--text-secondary)'
                      }}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

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
                      color: propertiesViewMode === 'grid' ? '#09090b' : 'var(--text-secondary)'
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
                      color: propertiesViewMode === 'map' ? '#09090b' : 'var(--text-secondary)'
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
              <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold-light)' }}>Chargement de la carte...</div>}>
                <PropertiesMapView 
                  properties={filteredProperties}
                  onSelectDeal={deal => openDealModal(deal)}
                  t={t}
                />
              </Suspense>
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
          PAGE 3 : À PROPOS (Contenu intégral himalayacorp.com FR & EN)
         ===================================================================== */}
      {activePage === 'a-propos' && (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold-light)' }}>Chargement...</div>}>
          <AboutPageView
            lang={lang}
            directors={INITIAL_HIMALAYA_BROKERS.filter(b => b.category === 'direction')}
            onSelectBroker={openBrokerModal}
            onNavigate={navigateTo}
            initialTab={aboutInitialTab}
          />
        </Suspense>
      )}

      {/* =====================================================================
          PAGE FRANCHISES (Pacini, Arabian Oud & Grillade Taurino)
         ===================================================================== */}
      {activePage === 'franchises' && (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold-light)' }}>Chargement...</div>}>
          <AboutPageView
            lang={lang}
            directors={INITIAL_HIMALAYA_BROKERS.filter(b => b.category === 'direction')}
            onSelectBroker={openBrokerModal}
            onNavigate={navigateTo}
            initialTab="franchises"
            standaloneFranchisePage={true}
          />
        </Suspense>
      )}

      {/* =====================================================================
          PAGE 3B : OUTILS IMMOBILIERS & FINANCIERS (Snippet evanpatruno.ca + #6)
         ===================================================================== */}
      {activePage === 'outils' && (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold-light)' }}>Chargement des outils...</div>}>
          <ToolsHubView
            lang={lang}
            onNavigate={navigateTo}
            preselectedDeal={toolPreselectedDeal}
            onClearPreselectedDeal={() => setToolPreselectedDeal(null)}
            initialTool={toolInitialTab}
          />
        </Suspense>
      )}

      {/* =====================================================================
          PAGE 4 : AGENCES
         ===================================================================== */}
      {activePage === 'agences' && (
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
                      alt={isEn ? (ag.name_en || ag.name) : ag.name}
                      style={{ objectFit: ag.id === 'montreal_hq' ? 'contain' : 'cover', padding: ag.id === 'montreal_hq' ? '28px' : '0' }}
                      onError={e => { if (ag.fallbackImage) e.target.src = ag.fallbackImage; }}
                    />
                    <span className="badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(9,9,11,0.88)' }}>
                      {isEn ? (ag.badge_en || ag.badge) : ag.badge}
                    </span>
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {isEn ? (ag.city_en || ag.city) : ag.city} • {isEn ? (ag.country_en || ag.country) : ag.country}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0 8px' }}>
                        {isEn ? (ag.name_en || ag.name) : ag.name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        <MapPin size={13} style={{ display: 'inline', marginRight: '5px', color: 'var(--gold)' }} />
                        {isEn ? (ag.address_en || ag.address) : ag.address}
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
          PAGE 5 : COURTIERS (Correspondance exacte mandats + Modale profil - #16)
         ===================================================================== */}
      {activePage === 'courtiers' && (
        <main style={{ flex: 1, padding: '44px 0 80px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 700, marginBottom: '4px' }}>{t.brokers.title}</h2>
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
                      onClick={() => openBrokerModal(broker)}
                      style={{ position: 'relative', width: '100%', aspectRatio: '314 / 543', background: '#09090b', overflow: 'hidden', cursor: 'pointer' }}
                    >
                      <img 
                        src={broker.photo} 
                        alt={broker.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                        onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
                      />
                    </div>

                    <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div onClick={() => openBrokerModal(broker)} style={{ marginBottom: '14px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '5px', lineHeight: 1.4 }}>
                          {isEn ? (broker.title_en || broker.shortTitle_en) : (broker.title || broker.shortTitle)}
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>{broker.name}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span>{isEn ? (broker.city_en || broker.city) : broker.city}</span>
                          {brokerDeals.length > 0 && (
                            <span style={{ color: 'var(--gold-light)', fontWeight: 600, fontSize: '0.76rem' }}>
                              {brokerDeals.length} {t.brokers.activeMandates}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={`tel:${broker.phone}`} className="btn-gold" style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}>
                          <Phone size={13} /> {broker.phone}
                        </a>
                        <button 
                          onClick={() => openBrokerModal(broker)} 
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
          PAGE 6 : ÉVÉNEMENTS & ACTUALITÉS (Avec archives multi-années #15)
         ===================================================================== */}
      {activePage === 'evenements' && (
        <main style={{ flex: 1, padding: '44px 0 80px' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 700, marginBottom: '22px' }}>{t.news.title}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '44px' }}>
              {HIMALAYA_EVENTS.map(ev => (
                <div key={ev.id} className="property-card" style={{ padding: '22px' }}>
                  <span className="badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                    {isEn ? (ev.dateRange_en || ev.dateRange) : ev.dateRange}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                    {isEn ? (ev.title_en || ev.title) : ev.title}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--gold)', marginBottom: '10px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '5px' }} /> {isEn ? (ev.location_en || ev.location) : ev.location}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
                    {isEn ? (ev.description_en || ev.description) : ev.description}
                  </p>
                  <a href={ev.url} target="_blank" rel="noreferrer" className="btn-outline" style={{ alignSelf: 'flex-start', padding: '8px 14px', fontSize: '0.82rem' }}>
                    {t.news.detailsBtn} <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {t.news.recentNews}
              </h2>

              {/* Filtres d'archives par année (#15) */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['all', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setNewsYearFilter(yr)}
                    className={newsYearFilter === yr ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    {yr === 'all' ? (isEn ? 'All Years' : 'Toutes les années') : yr}
                  </button>
                ))}
              </div>
            </div>

            <div className="properties-grid">
              {HIMALAYA_NEWS.filter(n => newsYearFilter === 'all' || n.year === newsYearFilter).map(news => (
                <div key={news.id} className="property-card">
                  <div className="property-img-wrap" style={{ height: '190px' }}>
                    <img 
                      src={news.image} 
                      alt={isEn ? (news.title_en || news.title) : news.title}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'; }}
                    />
                  </div>
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: '6px' }}>
                        {isEn ? (news.date_en || news.date) : news.date} • {isEn ? (news.category_en || news.category) : news.category}
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                        {isEn ? (news.title_en || news.title) : news.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        {isEn ? (news.excerpt_en || news.excerpt) : news.excerpt}
                      </p>
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
        <main style={{ flex: 1, padding: '44px 0 80px' }}>
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
                          <span className="badge-gold">{isEn ? (pod.episode_en || pod.episode) : pod.episode}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pod.duration}</span>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                          {isEn ? (pod.title_en || pod.title) : pod.title}
                        </h3>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                          {isEn ? (pod.description_en || pod.description) : pod.description}
                        </p>
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
                          {t.podcasts.playingLabel} • {isEn ? (pod.hosts_en || pod.hosts) : pod.hosts}
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
        <main style={{ flex: 1, padding: '44px 0 80px' }}>
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
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>{t.contact.hqAddress}</div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                      <a href="tel:18008204828" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>1 800 820-4828</a>
                      <a href="tel:5148984898" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>(514) 898-4898</a>
                      <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>info@himalayacorp.com</a>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>{t.contact.leadershipLabel}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '6px', lineHeight: 1.7 }}>
                      <strong>Roger Rhéaume</strong> ({t.contact.rolePresident}) : (514) 585-2605<br />
                      <strong>Geniev Mondoux</strong> ({t.contact.roleVP}) : (514) 884-1052<br />
                      <strong>Mike Ainajian</strong> ({t.contact.roleDirector}) : (514) 898-4898
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
                      color: contactTab === 'general' ? '#09090b' : 'var(--text-secondary)'
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
                      color: contactTab === 'valuation' ? '#09090b' : 'var(--text-secondary)'
                    }}
                  >
                    {t.contact.tabValuation}
                  </button>
                </div>

                {contactSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '28px 10px' }}>
                    <CheckCircle2 size={42} color="#e3c485" style={{ margin: '0 auto 12px' }} />
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
                              <option value={t.contact.assetOpt1}>{t.contact.assetOpt1}</option>
                              <option value={t.contact.assetOpt2}>{t.contact.assetOpt2}</option>
                              <option value={t.contact.assetOpt3}>{t.contact.assetOpt3}</option>
                              <option value={t.contact.assetOpt4}>{t.contact.assetOpt4}</option>
                              <option value={t.contact.assetOpt5}>{t.contact.assetOpt5}</option>
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
                          <option value={t.contact.subjectOpt1}>{t.contact.subjectOpt1}</option>
                          <option value={t.contact.subjectOpt2}>{t.contact.subjectOpt2}</option>
                          <option value={t.contact.subjectOpt3}>{t.contact.subjectOpt3}</option>
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
        <main style={{ flex: 1, padding: '44px 0 80px' }}>
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
                    <Lock size={12} /> {t.team.badge}
                  </span>
                  <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
                    {t.team.titleStart} <span className="gold-gradient-text">Himalaya Prospection CRM</span>
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
                    {t.team.subtitle}
                  </p>
                </div>

                <a 
                  href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5176' : 'https://himalaya-prospection.vercel.app'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-gold"
                >
                  <Sparkles size={16} /> {t.team.openCrmBtn} <ExternalLink size={14} />
                </a>
              </div>

              {/* Journal des prospects et NDA capturés depuis le site web (Points 9 & 20) */}
              {webLeads.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '12px' }}>
                    {t.team.leadsTitle} ({webLeads.length})
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
                            {lead.type === 'nda' ? t.team.badgeNda : (lead.type === 'valuation' ? t.team.badgeValuation : t.team.badgeContact)}
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
          FOOTER OFFICIEL ENRICHI (#4)
         ===================================================================== */}
      <footer style={{
        background: '#050506',
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px 0 28px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <img 
                src="/gx/himalaya-immobilier-logo.svg" 
                alt="Himalaya" 
                style={{ height: '42px', display: 'block', cursor: 'pointer' }}
                onClick={() => navigateTo('home')}
              />
              <a
                href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
                target="_blank"
                rel="noreferrer"
                style={{ opacity: 0.85, display: 'inline-flex', alignItems: 'center' }}
                title="Multi-Prêts Hypothèques"
              >
                <img
                  src="/gx/m/Multi_Prets.png"
                  alt="Multi-Prêts Hypothèques"
                  style={{ height: '28px', objectFit: 'contain' }}
                />
              </a>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.home}</button>
              <button onClick={() => navigateTo('a-propos')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.about}</button>
              <button onClick={() => navigateTo('proprietes')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.properties}</button>
              <button onClick={() => navigateTo('franchises')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Franchises</button>
              <button onClick={() => navigateTo('outils')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.tools}</button>
              <button onClick={() => navigateTo('courtiers')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.brokers}</button>
              <button onClick={() => navigateTo('agences')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.agencies}</button>
              <button onClick={() => navigateTo('evenements')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.news}</button>
              <button onClick={() => navigateTo('balados')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{t.nav.podcasts}</button>
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
            gap: '14px',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span>© 2026 Immobilier Himalaya Real Estate Corp. {isEn ? 'All rights reserved.' : 'Tous droits réservés.'}</span>
              <span>|</span>
              <button
                onClick={() => setLegalModalType('terms')}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.76rem', textDecoration: 'underline' }}
              >
                {isEn ? 'Terms of Use' : "Conditions d'utilisation"}
              </button>
              <span>|</span>
              <button
                onClick={() => setLegalModalType('privacy')}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.76rem', textDecoration: 'underline' }}
              >
                {isEn ? 'Privacy Policy (Law 25)' : 'Politique de confidentialité'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {OFFICIAL_SOCIAL_LINKS.map(soc => (
                <a key={soc.id} href={soc.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-light)', fontWeight: 500 }}>
                  {soc.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* MODALES AVEC LAZY LOADING (#4, #5, #6, #16, #19) */}
      <Suspense fallback={null}>
        {selectedDeal && (
          <PropertyDetailModal 
            deal={selectedDeal}
            t={t}
            onClose={closeDealModal}
            onOpenNDA={deal => setNdaModalDeal(deal)}
            onFilterByBroker={brokerName => navigateTo('proprietes', { filtreCourtier: brokerName })}
            onSimulateInTools={deal => {
              closeDealModal();
              setToolPreselectedDeal(deal);
              navigateTo('outils');
            }}
          />
        )}

        {selectedBroker && (
          <BrokerDetailModal
            broker={selectedBroker}
            deals={liveDealsData.filter(d => dealBelongsToBroker(d, selectedBroker.name))}
            t={t}
            onClose={closeBrokerModal}
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
      </Suspense>

      {/* Modale Conditions d'utilisation & Politique de confidentialité (#4) */}
      {legalModalType && LEGAL_DOCUMENTS[legalModalType] && (
        <div className="modal-backdrop" onClick={() => setLegalModalType(null)}>
          <div className="modal-panel" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(18, 18, 21, 0.96)'
            }}>
              <span className="badge-gold">
                {isEn ? LEGAL_DOCUMENTS[legalModalType].title_en : LEGAL_DOCUMENTS[legalModalType].title}
              </span>
              <button
                onClick={() => setLegalModalType(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)',
                  color: '#fff', width: '34px', height: '34px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
                {isEn ? LEGAL_DOCUMENTS[legalModalType].title_en : LEGAL_DOCUMENTS[legalModalType].title}
              </h2>
              {LEGAL_DOCUMENTS[legalModalType].sections.map((sec, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px 18px' }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '6px' }}>
                    {isEn ? sec.heading_en : sec.heading}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {isEn ? sec.body_en : sec.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Carte Propriété épurée (avec badge Vendu #8) */
function PropertyCard({ deal, t, onSelect }) {
  const isEn = t?.code === 'EN';
  const isSold = deal.status === 'Vendu';
  const broker = (deal.brokers_details && deal.brokers_details[0]) || {
    name: deal.assigned_broker || 'Équipe Himalaya',
    photo: 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'
  };

  const locationLabel = deal.city && deal.region && deal.city !== deal.region
    ? `${deal.city} (${deal.region})`
    : (deal.city || deal.region);

  const displayCategory = isEn ? (deal.category_en || deal.category || deal.transaction_type) : (deal.category || deal.transaction_type);
  const displayPrice = isEn ? (deal.price_raw_en || deal.price_raw) : deal.price_raw;
  const displayTitle = isEn ? (deal.title_en || deal.title) : deal.title;

  return (
    <div className="property-card" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <div className="property-img-wrap">
        <img 
          src={deal.main_photo} 
          alt={displayTitle}
          loading="lazy"
          decoding="async"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'; }}
        />
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap'
        }}>
          <span className="badge-gold" style={{ background: 'rgba(9,9,11,0.88)', backdropFilter: 'blur(6px)' }}>
            {displayCategory}
          </span>
          {isSold && (
            <span style={{
              background: 'var(--gold)',
              color: '#09090b',
              fontWeight: 800,
              fontSize: '0.7rem',
              padding: '3px 9px',
              borderRadius: '999px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              {isEn ? 'SOLD' : 'VENDU'}
            </span>
          )}
        </div>

        <div style={{
          position: 'absolute', bottom: '12px', left: '12px',
          background: 'rgba(9,9,11,0.92)', border: '1px solid var(--border-gold)',
          padding: '5px 11px', borderRadius: '7px', fontWeight: 700, color: 'var(--gold-light)',
          fontSize: '0.96rem', whiteSpace: 'nowrap'
        }}>
          {displayPrice}
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
            {displayTitle}
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
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '1px solid var(--gold)', flexShrink: 0 }}
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
