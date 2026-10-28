import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Menu, X, ArrowRight, Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS, tr } from '../data/translations';

const EXTRA_TRANSLATE_LANGUAGES = [
  { code: 'FR', label: 'Français (Original)', native: true },
  { code: 'EN', label: 'English (Native)', native: true },
  { code: 'ES', label: 'Español (Nativo)', native: true },
  { code: 'ZH', label: '中文 — Mandarin (原生)', native: true },
  { code: 'ar', label: 'العربية (Arabic)', native: false },
  { code: 'hy', label: 'Հայերեն (Armenian)', native: false },
  { code: 'pt', label: 'Português (Portuguese)', native: false },
  { code: 'it', label: 'Italiano (Italian)', native: false },
  { code: 'de', label: 'Deutsch (German)', native: false },
  { code: 'ru', label: 'Русский (Russian)', native: false },
  { code: 'ja', label: '日本語 (Japanese)', native: false },
  { code: 'ko', label: '한국어 (Korean)', native: false },
  { code: 'hi', label: 'हिन्दी (Hindi)', native: false },
  { code: 'he', label: 'עברית (Hebrew)', native: false },
  { code: 'fa', label: 'فارسی (Persian)', native: false },
  { code: 'tr', label: 'Türkçe (Turkish)', native: false },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)', native: false }
];

export default function HeaderNav({
  activePage,
  isScrolled,
  lang,
  t,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleLanguageChange,
  navigateTo,
  setContactForm,
  setNdaModalDeal,
  liveDealsCount = 0,
  totalDealsCount = 0
}) {
  const dealsCount = liveDealsCount || totalDealsCount;
  const [translateMenuOpen, setTranslateMenuOpen] = useState(false);
  const [activeAutoTranslate, setActiveAutoTranslate] = useState('');
  const translateRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (translateRef.current && !translateRef.current.contains(e.target)) {
        setTranslateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const triggerPageTranslation = (item) => {
    setTranslateMenuOpen(false);
    if (item.native) {
      setActiveAutoTranslate('');
      // Nettoyer le cookie Google Translate si actif
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }
      handleLanguageChange(item.code);
      return;
    }

    // Traduction automatique Google Translate dans la langue choisie
    setActiveAutoTranslate(item.code);
    const cookieVal = `/fr/${item.code}`;
    document.cookie = `googtrans=${cookieVal}; path=/`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;

    const applyCombo = () => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = item.code;
        combo.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    if (!applyCombo()) {
      if (!document.getElementById('hm-google-translate-elem')) {
        const holder = document.createElement('div');
        holder.id = 'hm-google-translate-elem';
        holder.style.display = 'none';
        document.body.appendChild(holder);
      }
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'fr', autoDisplay: false },
            'hm-google-translate-elem'
          );
          setTimeout(applyCombo, 350);
          setTimeout(applyCombo, 900);
        }
      };
      if (!document.getElementById('hm-google-translate-script')) {
        const s = document.createElement('script');
        s.id = 'hm-google-translate-script';
        s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        s.async = true;
        document.body.appendChild(s);
      } else {
        setTimeout(applyCombo, 300);
      }
    }
  };
  return (
    <header className={`main-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        {/* Navigation Gauche (3 onglets aérés : L'Agence ▾, Courtiers ▾, Franchises ▾) */}
        <nav className="desktop-nav header-nav-side header-nav-left">
          <a
            href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
            target="_blank"
            rel="noreferrer"
            className="header-multiprets-link"
            title={tr(
              lang,
              'Multi-Prêts Hypothèques — Préqualification',
              'Multi-Prêts Mortgages — Pre-Qualification',
              'Multi-Prêts Hipotecas — Precalificación',
              'Multi-Prêts 按揭贷款 — 预审资格'
            )}
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
                className={`nav-btn ${
                  activePage === 'a-propos' ||
                  activePage === 'agences' ||
                  activePage === 'investisseurs-internationaux'
                    ? 'active'
                    : ''
                }`}
                onClick={() => navigateTo('a-propos', { aboutTab: 'qui-nous-sommes' })}
              >
                {tr(lang, 'L’Agence', 'The Agency', 'La Agencia', '关于本行')}{' '}
                <span className="nav-btn-chevron">▾</span>
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
                  onClick={() => navigateTo('investisseurs-internationaux')}
                >
                  <span className="nav-dropdown-link-title" style={{ color: 'var(--gold-light)' }}>
                    {tr(
                      lang,
                      'Investisseurs Internationaux',
                      'International Investors Portal',
                      'Portal Inversores Internacionales',
                      '国际投资者专属门户'
                    )}
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
                {tr(lang, 'Franchises', 'Franchises', 'Franquicias', '特许经营')}{' '}
                <span className="nav-btn-chevron">▾</span>
              </button>
              <div className="nav-dropdown-panel align-right">
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

        {/* Losange Central Officiel Himalaya */}
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
              <div className="nav-dropdown-panel">
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
                  onClick={() => navigateTo('proprietes', { filtrePropriete: 'camping', propertiesViewMode: 'grid' })}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(lang, 'Camping', 'Campgrounds', 'Camping', '露营地')}
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

            {/* 5. OUTILS ▾ (Calculateurs, évaluation immobilière et ressources) */}
            <li className="nav-item-dropdown">
              <button
                className={`nav-btn ${activePage === 'outils' ? 'active' : ''}`}
                onClick={() => navigateTo('outils', { toolTab: 'plex' })}
              >
                {tr(lang, 'Outils', 'Tools', 'Herramientas', '金融工具')}{' '}
                <span className="nav-btn-chevron">▾</span>
              </button>
              <div className="nav-dropdown-panel">
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('outils', { toolTab: 'valuation' })}
                >
                  <span className="nav-dropdown-link-title" style={{ color: 'var(--gold-light)' }}>
                    {tr(lang, 'Vendre ou louer avec nous', 'Sell or Lease With Us', 'Vender o alquilar con nosotros', '与我们携手出售或出租')}
                  </span>
                </button>
                <div className="nav-dropdown-divider" />
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('outils', { toolTab: 'plex' })}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(
                      lang,
                      'Chiffrier financier & APH Select',
                      'Financial & MLI Select Simulator',
                      'Simulador financiero y APH Select',
                      '商业多户与 APH Select 精算模型'
                    )}
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
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('outils', { toolTab: 'affordability' })}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(lang, 'Capacité d’emprunt & Frais', 'Borrowing Capacity & Costs', 'Capacidad de préstamo y costos', '贷款能力与交割费用')}
                  </span>
                </button>
                <div className="nav-dropdown-divider" />
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('investisseurs-internationaux')}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(
                      lang,
                      'Ressources : Investisseurs Internationaux',
                      'Resources: International Investors',
                      'Recursos: Inversores Internacionales',
                      '资源：国际投资者指南'
                    )}
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
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('a-propos', { aboutTab: 'liens' })}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(lang, 'Ressources & Partenaires officiels', 'Resources & Official Partners', 'Recursos y Socios oficiales', '行业资源与官方合作伙伴')}
                  </span>
                </button>
              </div>
            </li>

            {/* 6. MÉDIAS ▾ (Activités, événements et actualités) */}
            <li className="nav-item-dropdown">
              <button
                className={`nav-btn ${
                  activePage === 'evenements' || activePage === 'balados' ? 'active' : ''
                }`}
                onClick={() => navigateTo('evenements')}
              >
                {tr(lang, 'Médias', 'Media', 'Medios', '媒体动态')}{' '}
                <span className="nav-btn-chevron">▾</span>
              </button>
              <div className="nav-dropdown-panel align-right">
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('evenements')}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(lang, 'Activités, événements et actualités', 'Activities, Events & News', 'Actividades, eventos y noticias', '最新活动、展会与新闻动态')}
                  </span>
                </button>
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('balados')}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(lang, 'Balados & Conférences', 'Podcasts & Talks', 'Pódcasts y Conferencias', '播客专栏与行业论坛')}
                  </span>
                </button>
              </div>
            </li>

            {/* 7. NOUS JOINDRE ▾ */}
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
                    {tr(lang, 'Vendre ou louer avec nous', 'Sell or Lease With Us', 'Vender o alquilar con nosotros', '与我们携手出售或出租')}
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

          {/* Sélecteur de langues + Bouton « Translate this page into your language » */}
          <div
            ref={translateRef}
            style={{
              position: 'relative',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '3px',
              marginLeft: '4px',
              paddingLeft: '8px',
              borderLeft: '1px solid rgba(255,255,255,0.16)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              {LANGUAGE_OPTIONS.map((opt, idx) => (
                <React.Fragment key={opt.code}>
                  {idx > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>|</span>}
                  <button
                    type="button"
                    onClick={() => triggerPageTranslation({ code: opt.code, native: true })}
                    title={opt.fullLabel}
                    style={{
                      background: 'transparent',
                      color: lang === opt.code && !activeAutoTranslate ? 'var(--gold)' : '#ffffff',
                      border: 'none',
                      padding: '2px 4px',
                      fontSize: '0.74rem',
                      fontWeight: lang === opt.code && !activeAutoTranslate ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {opt.label}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTranslateMenuOpen(prev => !prev)}
              title="Translate this page into your language"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                padding: '1px 4px',
                fontSize: '0.62rem',
                fontWeight: 500,
                color: translateMenuOpen || activeAutoTranslate ? 'var(--gold)' : 'rgba(255,255,255,0.68)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
                transition: 'color 0.2s ease'
              }}
            >
              <Globe size={10} style={{ color: 'var(--gold)' }} />
              <span>Translate this page into your language ▾</span>
            </button>

            {translateMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '235px',
                  maxHeight: '360px',
                  overflowY: 'auto',
                  background: 'rgba(9, 9, 11, 0.98)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(200, 164, 93, 0.45)',
                  borderRadius: '10px',
                  padding: '8px',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.85)',
                  zIndex: 260
                }}
              >
                <div
                  style={{
                    fontSize: '0.66rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--gold)',
                    fontWeight: 700,
                    padding: '4px 8px 6px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '4px'
                  }}
                >
                  Translate this page into your language
                </div>
                {EXTRA_TRANSLATE_LANGUAGES.map(item => {
                  const isCurrent = item.native
                    ? lang === item.code && !activeAutoTranslate
                    : activeAutoTranslate === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => triggerPageTranslation(item)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: isCurrent ? 'rgba(200, 164, 93, 0.16)' : 'transparent',
                        color: isCurrent ? 'var(--gold-light)' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '7px 10px',
                        fontSize: '0.78rem',
                        fontWeight: isCurrent ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{item.label}</span>
                      {isCurrent && <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
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
        <div
          style={{
            background: '#09090b',
            borderBottom: '1px solid var(--border-gold)',
            padding: '68px 24px 24px'
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  color: 'var(--gold)'
                }}
              >
                {tr(lang, 'Navigation Principale', 'Main Navigation', 'Navegación Principal', '网站主导航')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {LANGUAGE_OPTIONS.map(opt => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => triggerPageTranslation({ code: opt.code, native: true })}
                      className={lang === opt.code && !activeAutoTranslate ? 'btn-gold' : 'btn-outline'}
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <select
                  aria-label="Translate this page into your language"
                  value={activeAutoTranslate || lang}
                  onChange={e => {
                    const val = e.target.value;
                    const found = EXTRA_TRANSLATE_LANGUAGES.find(x => x.code === val);
                    if (found) triggerPageTranslation(found);
                  }}
                  style={{
                    background: 'rgba(200, 164, 93, 0.12)',
                    color: 'var(--gold-light)',
                    border: '1px solid rgba(200, 164, 93, 0.45)',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <option value={lang} disabled>
                    🌐 Translate this page into your language
                  </option>
                  {EXTRA_TRANSLATE_LANGUAGES.map(item => (
                    <option key={item.code} value={item.code} style={{ background: '#09090b', color: '#fff' }}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                {
                  id: 'home',
                  label: tr(lang, 'Accueil', 'Home', 'Inicio', '首页')
                },
                {
                  id: 'a-propos',
                  label: tr(lang, 'L’Agence', 'The Agency', 'La Agencia', '关于本行'),
                  subId: 'agences',
                  subLabel: tr(lang, 'Nos agences', 'Our Offices', 'Oficinas', '分支机构')
                },
                { id: 'courtiers', label: t.nav.brokers },
                {
                  id: 'franchises',
                  label: tr(
                    lang,
                    'Franchises (Pacini, Arabian Oud, Grillades Torino, La Fayette, Cotard, Daoust)',
                    'Franchises (Pacini, Arabian Oud, Grillades Torino, La Fayette, Cotard, Daoust)',
                    'Franquicias (Pacini, Arabian Oud, Grillades Torino, La Fayette, Cotard, Daoust)',
                    '连锁特许经营 (Pacini, Arabian Oud, Grillades Torino, La Fayette, Cotard, Daoust)'
                  )
                },
                {
                  id: 'proprietes',
                  label: `${t.nav.properties} (${dealsCount || 59})`
                },
                {
                  id: 'investisseurs-internationaux',
                  label: tr(
                    lang,
                    'Investisseurs Internationaux',
                    'International Investors',
                    'Inversores Internacionales',
                    '国际投资者门户'
                  )
                },
                {
                  id: 'outils',
                  label: tr(lang, 'Outils (Calculateurs, Évaluation & Ressources)', 'Tools (Calculators, Valuation & Resources)', 'Herramientas (Calculadoras y Evaluación)', '金融工具（计算器、物业估值与资源）')
                },
                {
                  id: 'evenements',
                  label: tr(lang, 'Médias (Activités, Événements & Actualités)', 'Media (Activities, Events & News)', 'Medios (Actividades, Eventos y Noticias)', '媒体动态（活动、展会与新闻）'),
                  subId: 'balados',
                  subLabel: tr(lang, 'Balados', 'Podcasts', 'Pódcasts', '播客专栏')
                },
                {
                  id: 'nous-joindre',
                  label: t.nav.contact
                }
              ].map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.07)'
                  }}
                >
                  <button
                    onClick={() => navigateTo(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      color: activePage === item.id ? 'var(--gold)' : '#ffffff',
                      fontWeight: activePage === item.id ? 700 : 600,
                      fontSize: '0.92rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
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
  );
}
