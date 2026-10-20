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
import { TRANSLATIONS, LANGUAGE_OPTIONS, tr, pickLang } from './data/translations';
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
      if (saved === 'FR' || saved === 'EN' || saved === 'ES' || saved === 'ZH') return saved;
    } catch {}
    return 'FR';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEn = lang !== 'FR';
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

  // Lecteur Balados & Filtre de séries (Immobilier Himalaya / APCIQ / OACIQ)
  const [playingPodcastId, setPlayingPodcastId] = useState(null);
  const [podcastSeriesFilter, setPodcastSeriesFilter] = useState('all');

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
      case 'franchises': return tr(lang, 'Franchises', 'Franchises', 'Franquicias', '特许经营');
      case 'courtiers': return t.nav.brokers;
      case 'agences': return t.nav.agencies;
      case 'outils': return tr(lang, 'Outils & Calculateurs', 'Financial Tools & Simulators', 'Herramientas y Simuladores', '房地产金融工具');
      case 'evenements': return t.nav.news;
      case 'balados': return t.nav.podcasts;
      case 'nous-joindre': return t.nav.contact;
      case 'zone-equipe': return t.nav.team;
      default: return '';
    }
  }, [activePage, t, lang]);

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
                  {tr(lang, 'L’Agence', 'The Agency', 'La Agencia', '关于本行')} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'qui-nous-sommes' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Qui nous sommes', 'Who We Are', 'Quiénes somos', '公司简介')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'co-fondateurs' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Co-fondateurs', 'Co-Founders', 'Cofundadores', '联合创始人')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('agences')}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Nos agences', 'Our Offices', 'Nuestras oficinas', '分支机构')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'services' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Services & Associations', 'Services & Associations', 'Servicios y Asociaciones', '专业服务与协会')}
                    </span>
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'carrieres' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Carrières & Affiliés', 'Careers & Affiliates', 'Carreras y Afiliados', '招贤纳士与合作')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'liens' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Partenaires & Liens', 'Partners & Links', 'Socios y Enlaces', '合作伙伴')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'faq' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'FAQ', 'FAQ', 'Preguntas frecuentes', '常见问题')}
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
                      {tr(lang, 'Tous nos courtiers', 'All Brokers', 'Todos los corredores', '全部经纪人')}
                    </span>
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'direction' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Direction', 'Management', 'Dirección', '管理层')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'commercial' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Commercial', 'Commercial', 'Comercial', '商业地产')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'residentiel' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Résidentiel', 'Residential', 'Residencial', '住宅地产')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('courtiers', { brokerCategoryFilter: 'international' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'International', 'International', 'Internacional', '国际业务')}
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
                  {tr(lang, 'Franchises', 'Franchises', 'Franquicias', '特许经营')} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('franchises')}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Nos enseignes clientes', 'Our Franchise Clients', 'Nuestras marcas clientes', '合作连锁品牌')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => {
                      setContactForm(prev => ({
                        ...prev,
                        subject: tr(
                          lang,
                          'Expansion de franchise — Trouver un emplacement commercial',
                          'Franchise Expansion — Find a Commercial Location',
                          'Expansión de franquicia — Buscar local comercial',
                          '连锁特许经营拓展 — 寻找商业门店'
                        )
                      }));
                      navigateTo('nous-joindre', { contactTab: 'general' });
                    }}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Trouver un emplacement', 'Find a Location', 'Buscar una ubicación', '寻找商业选址')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('evenements')}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Réseau CQF & Paris', 'CQF & Paris Network', 'Red CQF y París', 'CQF 理事会与巴黎展会')}
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

          {/* Navigation Droite (3 onglets aérés : Propriétés ▾, Outils & Médias ▾, Nous joindre ▾ + FR | EN | ES | 中文) */}
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
                      {tr(lang, 'Toutes les propriétés', 'All Properties', 'Todas las propiedades', '全部物业')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'commercial', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Commercial & Investissement', 'Commercial & Investment', 'Comercial e Inversión', '商业与投资物业')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'pourvoirie', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Pourvoiries & Hôtellerie', 'Outfitters & Hospitality', 'Cotos Turísticos y Hotelería', '狩猎度假村与酒店')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'terrain', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Terrains', 'Land', 'Terrenos', '开发土地')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'residentiel', propertiesViewMode: 'grid' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Résidentiel', 'Residential', 'Residencial', '住宅物业')}
                    </span>
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('proprietes', { filtrePropriete: 'all', propertiesViewMode: 'map' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Carte interactive', 'Interactive Map', 'Mapa interactivo', '互动地图浏览')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => setNdaModalDeal(null)}
                  >
                    <span className="nav-dropdown-link-title" style={{ color: 'var(--gold-light)' }}>
                      {tr(lang, 'Hors-marché (NDA)', 'Off-Market (NDA)', 'Fuera de mercado (NDA)', '保密房源 (NDA)')}
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
                  {tr(lang, 'Outils & Médias', 'Tools & Media', 'Herramientas', '金融工具与媒体')} <span className="nav-btn-chevron">▾</span>
                </button>
                <div className="nav-dropdown-panel align-right">
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('outils', { toolTab: 'plex' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Rentabilité Commercial & Plex', 'Commercial & Plex ROI', 'Rentabilidad Comercial y Plex', '商业与多户投资回报')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('outils', { toolTab: 'welcome' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Taxe de bienvenue', 'Welcome Tax', 'Impuesto de transferencia', '欢迎税计算器')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('outils', { toolTab: 'mortgage' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Calculatrice hypothécaire', 'Mortgage Calculator', 'Calculadora hipotecaria', '按揭贷款计算器')}
                    </span>
                  </button>
                  <a
                    href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
                    target="_blank"
                    rel="noreferrer"
                    className="nav-dropdown-link"
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Préqualification Multi-Prêts', 'Multi-Prêts Pre-Qualification', 'Precalificación Multi-Prêts', 'Multi-Prêts 按揭预审')}
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
                      {tr(lang, 'Actualités & Événements', 'News & Events', 'Noticias y Eventos', '新闻与展会活动')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('balados')}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Balados', 'Podcasts', 'Pódcasts', '播客专栏')}
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
                      {tr(lang, 'Nous contacter', 'Contact Us', 'Contáctenos', '联系我们')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('nous-joindre', { contactTab: 'valuation' })}
                  >
                    <span className="nav-dropdown-link-title" style={{ color: 'var(--gold-light)' }}>
                      {tr(lang, 'Évaluer ma propriété', 'Evaluate My Property', 'Evaluar mi propiedad', '评估我的物业')}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="nav-dropdown-link"
                    onClick={() => navigateTo('a-propos', { aboutTab: 'carrieres' })}
                  >
                    <span className="nav-dropdown-link-title">
                      {tr(lang, 'Devenir courtier / affilié', 'Become a Broker / Affiliate', 'Ser corredor / afiliado', '成为经纪人 / 合作伙伴')}
                    </span>
                  </button>
                </div>
              </li>
            </ul>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                marginLeft: '4px',
                paddingLeft: '8px',
                borderLeft: '1px solid rgba(255,255,255,0.16)'
              }}
            >
              {LANGUAGE_OPTIONS.map((opt, idx) => (
                <React.Fragment key={opt.code}>
                  {idx > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>|</span>}
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(opt.code)}
                    title={opt.fullLabel}
                    style={{
                      background: 'transparent',
                      color: lang === opt.code ? 'var(--gold)' : '#ffffff',
                      border: 'none',
                      padding: '4px 4px',
                      fontSize: '0.76rem',
                      fontWeight: lang === opt.code ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {opt.label}
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
            background: '#09090b',
            borderBottom: '1px solid var(--border-gold)',
            padding: '68px 24px 24px'
          }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--gold)' }}>
                  {tr(lang, 'Navigation — 6 pôles', 'Navigation — 6 Poles', 'Navegación — 6 Polos', '网站导航 — 6 大板块')}
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {LANGUAGE_OPTIONS.map(opt => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => handleLanguageChange(opt.code)}
                      className={lang === opt.code ? 'btn-gold' : 'btn-outline'}
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  {
                    id: 'a-propos',
                    label: tr(lang, 'L’Agence (Montréal & Paris)', 'The Agency (Montreal & Paris)', 'La Agencia (Montreal y París)', '关于本行（蒙特利尔与巴黎）'),
                    subId: 'agences',
                    subLabel: tr(lang, 'Bureaux', 'Offices', 'Oficinas', '分支机构')
                  },
                  { id: 'courtiers', label: t.nav.brokers },
                  { id: 'franchises', label: tr(lang, 'Franchises (Pacini, Arabian Oud, Torino, La Fayette, Cotard, Daoust)', 'Franchises (Pacini, Arabian Oud, Torino, La Fayette, Cotard, Daoust)', 'Franquicias (Pacini, Arabian Oud, Torino, La Fayette, Cotard, Daoust)', '连锁特许经营 (Pacini, Arabian Oud, Torino, La Fayette, Cotard, Daoust)') },
                  { id: 'proprietes', label: `${t.nav.properties} (${liveDealsData.length})` },
                  {
                    id: 'outils',
                    label: tr(lang, 'Outils & Médias', 'Tools & Media', 'Herramientas y Medios', '金融工具与媒体'),
                    subId: 'evenements',
                    subLabel: tr(lang, 'Actualités', 'News', 'Noticias', '最新动态')
                  },
                  { id: 'nous-joindre', label: t.nav.contact }
                ].map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <button
                      onClick={() => navigateTo(item.id)}
                      className="serif-title"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        textAlign: 'left',
                        color: activePage === item.id ? 'var(--gold-light)' : '#fff',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                    {item.subId && (
                      <button
                        onClick={() => navigateTo(item.subId)}
                        className="editorial-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.74rem' }}
                      >
                        {item.subLabel} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
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
              <h1 className="serif-title" style={{ fontSize: 'clamp(2.4rem, 4.8vw, 3.85rem)', fontWeight: 600, lineHeight: 1.12, maxWidth: '880px', margin: '0 auto 16px' }}>
                {t.hero.titleStart} <span className="gold-gradient-text">{t.hero.titleHighlight}</span>
              </h1>

              <p style={{ color: '#e4e4ea', fontSize: '1.04rem', maxWidth: '640px', margin: '0 auto', letterSpacing: '0.01em' }}>
                {t.hero.subtitle}
              </p>

              {/* Moteur de recherche Hero façon « Conciergerie Privée » (#13) */}
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
                    style={{ borderRight: 'none' }}
                    value={filtreRegion}
                    onChange={e => setFiltreRegion(e.target.value)}
                  >
                    <option value="all">{t.hero.allRegions}</option>
                    {availableRegions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <button type="submit" className="btn-gold" style={{ height: '44px', padding: '0 26px', marginLeft: '6px' }}>
                    <Search size={15} /> {t.hero.searchBtn}
                  </button>
                </div>
              </form>
            </div>

            {/* Indicateur de défilement minimaliste en fil d'or vertical (#16) */}
            <div className="hero-scroll-indicator">
              <div className="hero-scroll-line" />
            </div>
          </section>

          {/* SPÉCIALITÉS (4 cartes visuelles épurées + Respiration Luxe #4) */}
          <section style={{ padding: '84px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="badge-gold" style={{ marginBottom: '6px' }}>
                    {isEn ? 'Areas of Expertise' : 'Pôles de courtage'}
                  </span>
                  <h2 className="serif-title" style={{ fontSize: '2.35rem', fontWeight: 600 }}>{t.home.specialtiesTitle}</h2>
                </div>
                <button onClick={() => navigateTo('proprietes', { filtrePropriete: 'all' })} className="editorial-link">
                  {t.home.allPropertiesBtn} ({liveDealsData.length}) <ArrowRight size={15} />
                </button>
              </div>

              <div className="specialty-grid">
                {SPECIALTIES_DATA.map((spec, idx) => (
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
                      <span className="editorial-num" style={{ marginBottom: '8px', fontSize: '1.25rem' }}>
                        0{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '4px' }}>
                        {isEn ? (spec.subtitle_en || spec.subtitle) : spec.subtitle}
                      </span>
                      <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600, marginBottom: '12px', color: '#fff', lineHeight: 1.2 }}>
                        {isEn ? (spec.title_en || spec.title) : spec.title}
                      </h3>
                      <span className="editorial-link">
                        {t.home.explore} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr className="gold-hairline" />

          {/* PROPRIÉTÉS À LA UNE */}
          <section style={{ padding: '84px 0', background: 'var(--bg-darker)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '38px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span className="badge-gold" style={{ marginBottom: '6px' }}>
                    {isEn ? 'Curated Selection' : 'Sélection de mandats'}
                  </span>
                  <h2 className="serif-title" style={{ fontSize: '2.35rem', fontWeight: 600 }}>{t.home.featuredTitle}</h2>
                </div>
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

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '48px', flexWrap: 'wrap' }}>
                <button onClick={() => navigateTo('proprietes')} className="btn-gold">
                  {t.home.viewAllProperties} ({liveDealsData.length}) <ArrowRight size={16} />
                </button>
                <button onClick={() => setNdaModalDeal(null)} className="btn-outline">
                  <Lock size={15} /> {t.home.offMarketBtn}
                </button>
              </div>
            </div>
          </section>

          <hr className="gold-hairline" />

          {/* BANNIÈRE CHIFFRES CLÉS AUTHENTIQUES & GALERIE FRANCHISES (#2, #3, #4, #14) */}
          <section style={{ padding: '84px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '28px',
                paddingBottom: '64px',
                marginBottom: '64px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                {[
                  { num: `${liveDealsData.length}`, label: t.home.statMandates },
                  { num: `${INITIAL_HIMALAYA_BROKERS.length}`, label: t.home.statBrokers },
                  { num: t.home.statFoundedNum, label: t.home.statFounded },
                  { num: t.home.statPolesNum, label: t.home.statPoles }
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '6px 12px' }}>
                    <div className="serif-title gold-gradient-text" style={{ fontSize: '2.85rem', fontWeight: 600, lineHeight: 1.05 }}>
                      {stat.num}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* GALERIE D'ENSEIGNES FRANCHISES (PACINI, ARABIAN OUD & GRILLADE TAURINO) — STYLE ÉDITORIAL (#3, #14) */}
              <div style={{ marginBottom: '72px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '38px'
                }}>
                  <div>
                    <span className="badge-gold" style={{ marginBottom: '6px' }}>
                      {tr(lang, 'Membre CQF • Clients Franchisés', 'CQF Member • Franchise Clients', 'Miembro CQF • Clientes Franquiciados', 'CQF 成员 • 特许经营客户')}
                    </span>
                    <h3 className="serif-title" style={{ fontSize: '2.2rem', fontWeight: 600 }}>
                      {tr(
                        lang,
                        'Franchises accompagnées par Immobilier Himalaya',
                        'Franchises Supported by Immobilier Himalaya',
                        'Franquicias acompañadas por Immobilier Himalaya',
                        '喜马拉雅地产服务的连锁特许经营品牌'
                      )}
                    </h3>
                  </div>
                  <button
                    onClick={() => navigateTo('franchises')}
                    className="editorial-link"
                  >
                    {tr(lang, 'Accéder à l’onglet Franchises', 'Open Franchises Section', 'Ver sección Franquicias', '进入特许经营专区')} <ArrowRight size={15} />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: '36px'
                }}>
                  {HIMALAYA_FRANCHISES.map((fr, idx) => (
                    <div
                      key={fr.id}
                      onClick={() => navigateTo('franchises')}
                      style={{
                        background: 'transparent',
                        borderTop: '1px solid rgba(200, 164, 93, 0.35)',
                        borderBottom: '1px solid var(--border-subtle)',
                        padding: '28px 0 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '20px',
                        transition: 'border-color 0.3s ease, transform 0.3s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <span className="editorial-num">0{idx + 1}</span>
                          {fr.logo && (
                            <img
                              src={fr.logo}
                              alt={fr.name}
                              style={{
                                maxHeight: fr.logoHeight || '42px',
                                maxWidth: '165px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: fr.invertLogo ? 'brightness(0) invert(1)' : 'none'
                              }}
                            />
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '6px' }}>
                          {pickLang(fr, 'category', lang)}
                        </div>
                        <h4 className="serif-title" style={{ fontSize: '1.6rem', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                          {pickLang(fr, 'name', lang)}
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                          {pickLang(fr, 'description', lang)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                          {fr.brokerNames}
                        </span>
                        <span className="editorial-link" style={{ fontSize: '0.72rem' }}>
                          {tr(lang, 'Dossier', 'Details', 'Detalles', '查看详情')} <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                paddingTop: '44px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{ maxWidth: '660px' }}>
                  <h3 className="serif-title" style={{ fontSize: '1.95rem', fontWeight: 600, marginBottom: '8px' }}>
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

            {/* Barre de filtres épurée sans boîte lourde (Audit #3) */}
            <div style={{
              paddingBottom: '22px',
              marginBottom: '32px',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                gap: '12px'
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
                      className="broker-photo-wrap"
                      onClick={() => openBrokerModal(broker)}
                    >
                      <img 
                        src={broker.photo} 
                        alt={broker.name}
                        loading="lazy"
                        decoding="async"
                        onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
                      />
                    </div>

                    <div style={{ padding: '16px 2px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div onClick={() => openBrokerModal(broker)} style={{ marginBottom: '14px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '0.73rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px', lineHeight: 1.4 }}>
                          {isEn ? (broker.title_en || broker.shortTitle_en) : (broker.title || broker.shortTitle)}
                        </div>
                        <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600 }}>{broker.name}</h3>
                        <div className="broker-name-line" />
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span>{isEn ? (broker.city_en || broker.city) : broker.city}</span>
                          {brokerDeals.length > 0 && (
                            <span style={{ color: 'var(--gold-light)', fontWeight: 600, fontSize: '0.76rem' }}>
                              {brokerDeals.length} {t.brokers.activeMandates}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <a
                          href={`tel:${broker.phone}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}
                        >
                          <Phone size={13} color="var(--gold)" /> {broker.phone}
                        </a>
                        <button 
                          onClick={() => openBrokerModal(broker)} 
                          className="editorial-link"
                          style={{ fontSize: '0.74rem' }}
                        >
                          {t.brokers.viewProfile} <ArrowRight size={13} />
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
                    {pickLang(ev, 'dateRange', lang)}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                    {pickLang(ev, 'title', lang)}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--gold)', marginBottom: '10px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '5px' }} /> {pickLang(ev, 'location', lang)}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
                    {pickLang(ev, 'description', lang)}
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
                    {yr === 'all' ? tr(lang, 'Toutes les années', 'All Years', 'Todos los años', '所有年份') : yr}
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
          PAGE 7 : BALADOS & CAPSULES VIDÉO (Immobilier Himalaya, APCIQ & OACIQ)
         ===================================================================== */}
      {activePage === 'balados' && (() => {
        const filteredPodcasts = podcastSeriesFilter === 'all'
          ? HIMALAYA_PODCASTS
          : HIMALAYA_PODCASTS.filter(p => p.series === podcastSeriesFilter);

        return (
          <main style={{ flex: 1, padding: '44px 0 80px' }}>
            <div className="container">
              {/* En-tête éditorial */}
              <div style={{ marginBottom: '36px', paddingBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="gold-eyebrow" style={{ marginBottom: '8px' }}>
                  {tr(lang,
                    'IMMOBILIER HIMALAYA • APCIQ • OACIQ',
                    'IMMOBILIER HIMALAYA • QPAREB (APCIQ) • OACIQ',
                    'IMMOBILIER HIMALAYA • APCIQ • OACIQ',
                    '喜马拉雅地产 • 魁北克地产协会 (APCIQ) • 监管局 (OACIQ)'
                  )}
                </div>
                <h1 className="serif-title" style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px' }}>
                  {tr(lang,
                    'Balados & Capsules Immobilières',
                    'Real Estate Podcasts & Video Series',
                    'Podcasts y Cápsulas Inmobiliarias',
                    '房地产播客与视频专栏'
                  )}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', maxWidth: '820px', lineHeight: 1.65 }}>
                  {tr(lang,
                    'Retrouvez la présentation vidéo officielle d’Immobilier Himalaya ainsi que les grands épisodes des balados officiels de l’APCIQ (« L’immobilier en mouvement ») et de l’OACIQ (« L’immo en règle ») disponibles sur YouTube, Spotify et Apple Podcasts.',
                    'Watch the official Immobilier Himalaya video presentation alongside featured episodes from the official QPAREB/APCIQ ("L’immobilier en mouvement") and OACIQ ("L’immo en règle") podcasts available on YouTube, Spotify, and Apple Podcasts.',
                    'Descubra la presentación en video oficial de Immobilier Himalaya junto con episodios destacados de los podcasts oficiales de la APCIQ («L’immobilier en mouvement») y de la OACIQ («L’immo en règle») disponibles en YouTube, Spotify y Apple Podcasts.',
                    '观看喜马拉雅地产官方视频介绍，并收听魁北克职业房地产协会 APCIQ（《L’immobilier en mouvement》）与监管局 OACIQ（《L’immo en règle》）在 YouTube、Spotify 与 Apple Podcasts 上发布的官方播客节目。'
                  )}
                </p>
              </div>

              {/* SECTION VEDETTE : Lecteur YouTube intégré 16:9 — Immobilier Himalaya */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
                alignItems: 'center',
                paddingBottom: '40px',
                marginBottom: '36px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                  background: '#000',
                  border: '1px solid rgba(200, 164, 93, 0.35)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <iframe
                    src="https://www.youtube.com/embed/IFmG6c3ywJY"
                    title="Immobilier Himalaya Real Estate Corp. — Roger Rhéaume & Geniev Mondoux"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span className="badge-gold">
                      {tr(lang, 'CAPSULE VIDÉO EN VEDETTE', 'FEATURED VIDEO', 'VIDEO DESTACADO', '精选官方视频')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>
                      • Roger Rhéaume & Geniev Mondoux
                    </span>
                  </div>
                  <h2 className="serif-title" style={{ fontSize: '1.85rem', fontWeight: 600, marginBottom: '12px', lineHeight: 1.25 }}>
                    {tr(lang,
                      'Présentation & Vision — Immobilier Himalaya Real Estate Corp.',
                      'Presentation & Vision — Immobilier Himalaya Real Estate Corp.',
                      'Presentación y Visión — Immobilier Himalaya Real Estate Corp.',
                      '品牌介绍与愿景 — 喜马拉雅地产 (Immobilier Himalaya)'
                    )}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.7, marginBottom: '20px' }}>
                    {tr(lang,
                      'Roger Rhéaume (président fondateur) et Geniev Mondoux présentent l’approche sur mesure d’Immobilier Himalaya : un accompagnement confidentiel et rigoureux unissant le courtage résidentiel de prestige, l’immobilier commercial, les terres agricoles et les domaines de villégiature à travers le Québec.',
                      'Roger Rhéaume (Founding President) and Geniev Mondoux present Immobilier Himalaya’s tailored approach: confidential, rigorous brokerage uniting prestige residential properties, commercial real estate, farmland, and resort estates across Quebec.',
                      'Roger Rhéaume (presidente fundador) y Geniev Mondoux presentan el enfoque a medida de Immobilier Himalaya: acompañamiento confidencial y riguroso que une el corretaje residencial de prestigio, bienes raíces comerciales, tierras agrícolas y dominios vacacionales en Quebec.',
                      '创始人兼总裁 Roger Rhéaume 与 Geniev Mondoux 介绍喜马拉雅地产量身定制的服务理念：涵盖魁北克高端住宅、商业地产、农地及度假庄园的机密与严谨经纪服务。'
                    )}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <a
                      href="https://www.youtube.com/watch?v=IFmG6c3ywJY"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gold"
                      style={{ padding: '10px 18px', fontSize: '0.8rem', textDecoration: 'none' }}
                    >
                      {tr(lang, 'Regarder sur YouTube', 'Watch on YouTube', 'Ver en YouTube', '在 YouTube 上观看')} <ExternalLink size={13} />
                    </a>
                    <button
                      onClick={() => navigateTo('nous-joindre')}
                      className="editorial-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {tr(lang, 'Prendre rendez-vous avec l’équipe', 'Book a consultation', 'Agendar una consulta', '预约团队咨询')} <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* BARRE DES CHAÎNES OFFICIELLES (APCIQ & OACIQ sur YouTube / Web) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                paddingBottom: '26px',
                marginBottom: '28px',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '4px' }}>
                    {tr(lang, 'CHAÎNES & PLATEFORMES OFFICIELLES', 'OFFICIAL CHANNELS & PLATFORMS', 'CANALES Y PLATAFORMAS OFICIALES', '官方播客频道与平台')}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    {tr(lang,
                      'Accédez directement aux chaînes YouTube et aux portails audio de l’APCIQ et de l’OACIQ :',
                      'Direct access to the official YouTube channels and audio portals of QPAREB (APCIQ) and OACIQ:',
                      'Acceso directo a los canales de YouTube y portales de audio oficiales de la APCIQ y de la OACIQ:',
                      '直接访问魁北克房地产协会 (APCIQ) 与监管局 (OACIQ) 的官方 YouTube 频道及音频平台：'
                    )}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <a
                    href="https://apciq.ca/balado-limmobilier-en-mouvement/"
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-link"
                    style={{ fontSize: '0.8rem' }}
                  >
                    APCIQ • L’immobilier en mouvement <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://www.youtube.com/@apciqqpareb"
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-link"
                    style={{ fontSize: '0.8rem' }}
                  >
                    YouTube APCIQ (@apciqqpareb) <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://www.youtube.com/@OACIQ"
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-link"
                    style={{ fontSize: '0.8rem' }}
                  >
                    YouTube OACIQ • L’immo en règle <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* FILTRES PAR SÉRIE (Tous | Immobilier Himalaya | APCIQ | OACIQ) */}
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: '14px'
              }}>
                {[
                  { id: 'all', label: tr(lang, `Tous les épisodes (${HIMALAYA_PODCASTS.length})`, `All Episodes (${HIMALAYA_PODCASTS.length})`, `Todos los episodios (${HIMALAYA_PODCASTS.length})`, `全部节目 (${HIMALAYA_PODCASTS.length})`) },
                  { id: 'himalaya', label: tr(lang, 'Immobilier Himalaya', 'Immobilier Himalaya', 'Immobilier Himalaya', '喜马拉雅地产 (Himalaya)') },
                  { id: 'apciq', label: tr(lang, 'APCIQ — L’immobilier en mouvement', 'QPAREB (APCIQ) — Market Podcast', 'APCIQ — L’immobilier en mouvement', 'APCIQ — 房产脉动播客') },
                  { id: 'oaciq', label: tr(lang, 'OACIQ — L’immo en règle', 'OACIQ — L’immo en règle', 'OACIQ — L’immo en règle', 'OACIQ — 房产合规播客') }
                ].map(tab => {
                  const active = podcastSeriesFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setPodcastSeriesFilter(tab.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px 0',
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        fontWeight: active ? 600 : 400,
                        color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                        borderBottom: active ? '2px solid var(--gold-primary)' : '2px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* RÉPERTOIRE ÉDITORIAL DES ÉPISODES (01 à 08) */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredPodcasts.map((pod, idx) => {
                  const isPlaying = playingPodcastId === pod.id;
                  const numStr = String(idx + 1).padStart(2, '0');
                  return (
                    <div key={pod.id} style={{
                      padding: '28px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '24px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', gap: '20px', flex: 1, minWidth: '280px', alignItems: 'flex-start' }}>
                          <span className="editorial-num" style={{ fontSize: '1.35rem', minWidth: '34px', paddingTop: '2px' }}>
                            {numStr}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                              <span className="badge-gold">{pickLang(pod, 'episode', lang)}</span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pod.duration}</span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>• {pickLang(pod, 'hosts', lang)}</span>
                            </div>
                            <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                              {pickLang(pod, 'title', lang)}
                            </h3>
                            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                              {pickLang(pod, 'description', lang)}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', minWidth: '210px' }}>
                          {pod.youtubeUrl && (
                            <a
                              href={pod.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-outline"
                              style={{ padding: '8px 14px', fontSize: '0.76rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              {tr(lang, 'Écouter sur YouTube', 'Watch on YouTube', 'Ver en YouTube', 'YouTube 观看/收听')} <ExternalLink size={12} />
                            </a>
                          )}
                          {pod.platformUrl && pod.platformUrl !== pod.youtubeUrl && (
                            <a
                              href={pod.platformUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="editorial-link"
                              style={{ fontSize: '0.76rem' }}
                            >
                              {pod.series === 'apciq'
                                ? tr(lang, 'Portail Balado APCIQ', 'QPAREB Podcast Portal', 'Portal Podcast APCIQ', 'APCIQ 播客门户')
                                : tr(lang, 'Portail OACIQ', 'OACIQ Portal', 'Portal OACIQ', 'OACIQ 官方门户')} <ExternalLink size={11} />
                            </a>
                          )}
                          <button
                            onClick={() => setPlayingPodcastId(isPlaying ? null : pod.id)}
                            className="editorial-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.76rem' }}
                          >
                            {isPlaying
                              ? tr(lang, 'Masquer les notes', 'Hide Notes', 'Ocultar notas', '收起详情')
                              : tr(lang, 'Points clés & Courtiers', 'Key Takeaways & Brokers', 'Puntos clave y Corredores', '核心要点与经纪人咨询')} <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>

                      {isPlaying && (
                        <div style={{
                          marginTop: '16px',
                          marginLeft: '54px',
                          paddingTop: '14px',
                          borderTop: '1px solid rgba(200, 164, 93, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
                            {tr(lang,
                              `Épisode animé par ${pickLang(pod, 'hosts', lang)}. Nos courtiers Immobilier Himalaya intègrent ces analyses économiques de l'APCIQ et les normes réglementaires de l'OACIQ dans chaque mandat d'achat ou de vente.`,
                              `Hosted by ${pickLang(pod, 'hosts', lang)}. Our Immobilier Himalaya brokers integrate these QPAREB economic insights and OACIQ regulatory standards into every buying or selling mandate.`,
                              `Presentado por ${pickLang(pod, 'hosts', lang)}. Nuestros corredores de Immobilier Himalaya integran estos análisis económicos de la APCIQ y las normas de la OACIQ en cada mandato.`,
                              `主讲嘉宾：${pickLang(pod, 'hosts', lang)}。喜马拉雅地产经纪团队在每项买卖委托中均严格结合 APCIQ 市场洞察与 OACIQ 监管标准。`
                            )}
                          </span>
                          <button onClick={() => navigateTo('nous-joindre')} className="btn-outline" style={{ padding: '7px 14px', fontSize: '0.76rem' }}>
                            {tr(lang, 'Échanger avec nos courtiers', 'Discuss with our brokers', 'Hablar con nuestros corredores', '与我们的经纪人交流')}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        );
      })()}

      {/* =====================================================================
          PAGE 8 : NOUS JOINDRE + ÉVALUER MA PROPRIÉTÉ (Architecture épurée — Audit #8)
         ===================================================================== */}
      {activePage === 'nous-joindre' && (
        <main style={{ flex: 1, padding: '44px 0 80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '56px', alignItems: 'start' }}>
              <div>
                <h1 className="serif-title" style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '10px' }}>{t.contact.title}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: 1.65 }}>
                  {t.contact.subtitle}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600 }}>{t.contact.hqLabel}</div>
                    <div className="serif-title" style={{ fontWeight: 600, fontSize: '1.35rem', marginTop: '6px' }}>Immobilier Himalaya Real Estate Corp.</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{t.contact.hqAddress}</div>
                    <div style={{ display: 'flex', gap: '18px', marginTop: '12px', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                      <a href="tel:18008204828" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>1 800 820-4828</a>
                      <a href="tel:5148984898" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>(514) 898-4898</a>
                      <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>info@himalayacorp.com</a>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600 }}>{t.contact.leadershipLabel}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px', lineHeight: 1.85 }}>
                      <strong style={{ color: '#fff' }}>Roger Rhéaume</strong> ({t.contact.rolePresident}) : <a href="tel:5145852605" style={{ color: 'var(--gold-light)' }}>(514) 585-2605</a><br />
                      <strong style={{ color: '#fff' }}>Geniev Mondoux</strong> ({t.contact.roleVP}) : <a href="tel:5148841052" style={{ color: 'var(--gold-light)' }}>(514) 884-1052</a><br />
                      <strong style={{ color: '#fff' }}>Mike Ainajian</strong> ({t.contact.roleDirector}) : <a href="tel:5148984898" style={{ color: 'var(--gold-light)' }}>(514) 898-4898</a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {/* Bascule sobre par onglets soulignés : Message général | Vendre / Évaluer ma propriété */}
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '24px'
                }}>
                  <button
                    type="button"
                    onClick={() => { setContactTab('general'); setContactSubmitted(false); }}
                    style={{
                      padding: '0 0 12px', border: 'none', cursor: 'pointer',
                      fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                      background: 'transparent',
                      color: contactTab === 'general' ? 'var(--gold-light)' : 'var(--text-secondary)',
                      borderBottom: contactTab === 'general' ? '2px solid var(--gold)' : '2px solid transparent'
                    }}
                  >
                    {t.contact.tabGeneral}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContactTab('valuation'); setContactSubmitted(false); }}
                    style={{
                      padding: '0 0 12px', border: 'none', cursor: 'pointer',
                      fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                      background: 'transparent',
                      color: contactTab === 'valuation' ? 'var(--gold-light)' : 'var(--text-secondary)',
                      borderBottom: contactTab === 'valuation' ? '2px solid var(--gold)' : '2px solid transparent'
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
          FOOTER ARCHITECTURAL 4 COLONNES AVEC FILET D'OR SUPÉRIEUR (#2, #20)
         ===================================================================== */}
      <footer style={{
        background: '#050506',
        marginTop: 'auto',
        position: 'relative'
      }}>
        <hr className="gold-hairline" />
        <div className="container" style={{ padding: '64px 24px 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '40px',
            paddingBottom: '44px',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            {/* Colonne 1 : Identité Himalaya & Multi-Prêts */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <img 
                  src="/gx/himalaya-immobilier-logo.svg" 
                  alt="Himalaya" 
                  style={{ height: '46px', display: 'block', cursor: 'pointer' }}
                  onClick={() => navigateTo('home')}
                />
                <a
                  href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
                  target="_blank"
                  rel="noreferrer"
                  style={{ opacity: 0.9, display: 'inline-flex', alignItems: 'center' }}
                  title="Multi-Prêts Hypothèques"
                >
                  <img
                    src="/gx/m/Multi_Prets.png"
                    alt="Multi-Prêts Hypothèques"
                    style={{ height: '30px', objectFit: 'contain' }}
                  />
                </a>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {tr(
                  lang,
                  'Agence immobilière (OACIQ) spécialisée en immobilier commercial, résidentiel, pourvoiries, franchises et international depuis 2008.',
                  'Real Estate Agency (OACIQ) specializing in commercial, residential, outfitter, franchise & international properties since 2008.',
                  'Agencia inmobiliaria (OACIQ) especializada en propiedades comerciales, residenciales, turísticas, franquicias e internacional desde 2008.',
                  '自 2008 年创立的魁北克持牌房地产经纪机构（OACIQ），专注于商业地产、住宅、度假庄园、连锁特许经营及国际地产。'
                )}
              </p>
            </div>

            {/* Colonne 2 : Siège social Montréal */}
            <div>
              <div className="badge-gold" style={{ marginBottom: '12px' }}>
                {tr(lang, 'Siège social — Montréal', 'Headquarters — Montreal', 'Sede Central — Montreal', '蒙特利尔总部')}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>Immobilier Himalaya Real Estate Corp.</div>
                <div>{t.contact.hqAddress}</div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <a href="tel:5143791788" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>(514) 379-1788</a>
                  <a href="tel:18008204828" style={{ color: 'var(--text-secondary)' }}>1 800 820-4828</a>
                  <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)' }}>info@himalayacorp.com</a>
                </div>
              </div>
            </div>

            {/* Colonne 3 : Bureau International Paris & Franchises */}
            <div>
              <div className="badge-gold" style={{ marginBottom: '12px' }}>
                {tr(lang, 'International — Paris & CQF', 'International — Paris & CQF', 'Internacional — París y CQF', '国际业务 — 巴黎与 CQF')}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>
                  {tr(lang, 'Bureau de représentation — Paris', 'Paris Representative Office', 'Oficina de representación — París', '法国巴黎代表处')}
                </div>
                <div>14 Avenue de l’Opéra, 75001 Paris, France</div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ color: 'var(--gold-light)', fontSize: '0.8rem' }}>
                    {tr(lang, 'Membre du Conseil québécois de la franchise (CQF)', 'Member of the Quebec Franchise Council (CQF)', 'Miembro del Consejo Quebequense de la Franquicia (CQF)', '魁北克特许经营理事会 (CQF) 成员')}
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne 4 : Navigation Rapide */}
            <div>
              <div className="badge-gold" style={{ marginBottom: '12px' }}>
                {tr(lang, 'Navigation', 'Navigation', 'Navegación', '快速导航')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.home}</button>
                <button onClick={() => navigateTo('proprietes')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.properties}</button>
                <button onClick={() => navigateTo('a-propos')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{tr(lang, 'L’Agence', 'The Agency', 'La Agencia', '关于本行')}</button>
                <button onClick={() => navigateTo('franchises')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{tr(lang, 'Franchises', 'Franchises', 'Franquicias', '特许经营')}</button>
                <button onClick={() => navigateTo('courtiers')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.brokers}</button>
                <button onClick={() => navigateTo('outils')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.tools}</button>
                <button onClick={() => navigateTo('agences')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.agencies}</button>
                <button onClick={() => navigateTo('evenements')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.news}</button>
                <button onClick={() => navigateTo('balados')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.podcasts}</button>
                <button onClick={() => navigateTo('nous-joindre')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.nav.contact}</button>
                <a
                  href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5176' : 'https://himalaya-prospection.vercel.app'}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-muted)', fontSize: '0.76rem', gridColumn: '1 / -1', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Lock size={11} color="var(--gold)" /> {tr(lang, 'Accès Intranet Courtiers', 'Broker Intranet (CRM)', 'Intranet Corredores (CRM)', '经纪人内部系统 (CRM)')}
                </a>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span>© 2026 Immobilier Himalaya Real Estate Corp. {tr(lang, 'Tous droits réservés.', 'All rights reserved.', 'Todos los derechos reservados.', '保留所有权利。')}</span>
              <span>|</span>
              <button
                onClick={() => setLegalModalType('terms')}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.76rem', textDecoration: 'underline' }}
              >
                {tr(lang, "Conditions d'utilisation", 'Terms of Use', 'Condiciones de uso', '使用条款')}
              </button>
              <span>|</span>
              <button
                onClick={() => setLegalModalType('privacy')}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.76rem', textDecoration: 'underline' }}
              >
                {tr(lang, 'Politique de confidentialité', 'Privacy Policy (Law 25)', 'Política de privacidad (Ley 25)', '隐私政策 (第25号法案)')}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
                <div key={idx} style={{ paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
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

      {/* Bouton minimaliste Retour en haut ↑ (Audit #9) */}
      {isScrolled && (
        <button
          type="button"
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={isEn ? 'Back to top' : 'Retour en haut'}
          title={isEn ? 'Back to top' : 'Retour en haut'}
        >
          ↑
        </button>
      )}
    </div>
  );
}

/* Carte Propriété Style Galerie « Sans Cadre » (#5, #6, #7, #8, #9) */
function PropertyCard({ deal, t, onSelect }) {
  const code = t?.code || 'FR';
  const isEn = code !== 'FR';
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
          position: 'absolute', top: '14px', left: '14px', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap'
        }}>
          <span className="badge-gold">
            {displayCategory}
          </span>
          {isSold && (
            <span style={{
              background: 'var(--gold)',
              color: '#09090b',
              fontWeight: 800,
              fontSize: '0.7rem',
              padding: '3px 9px',
              borderRadius: '4px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              {tr(code, 'VENDU', 'SOLD', 'VENDIDO', '已售')}
            </span>
          )}
        </div>

        {/* Prix et localisation intégrés au dégradé bas de la photo (#8) */}
        <div style={{
          position: 'absolute', bottom: '14px', left: '16px', right: '16px', zIndex: 2,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--gold-light)', fontSize: '1.15rem', letterSpacing: '0.01em', textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}>
            {displayPrice}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#e4e4ea', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
            <MapPin size={12} color="var(--gold)" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
              {locationLabel}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 2px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 className="serif-title" style={{
            fontSize: '1.32rem',
            fontWeight: 600,
            marginBottom: '12px',
            lineHeight: 1.28,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {displayTitle}
          </h3>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <img 
              src={broker.photo} 
              alt={broker.name}
              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '1px solid var(--gold)', flexShrink: 0 }}
              onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {broker.name}
            </span>
          </div>

          <span className="editorial-link" style={{ fontSize: '0.73rem' }}>
            {t.properties.viewListing} <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
