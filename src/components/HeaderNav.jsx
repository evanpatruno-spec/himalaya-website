import React from 'react';
import { ExternalLink, Menu, X, ArrowRight } from 'lucide-react';
import { LANGUAGE_OPTIONS, tr } from '../data/translations';

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
                className={`nav-btn ${
                  activePage === 'outils' || activePage === 'evenements' || activePage === 'balados'
                    ? 'active'
                    : ''
                }`}
                onClick={() => navigateTo('outils', { toolTab: 'plex' })}
              >
                {tr(lang, 'Outils & Médias', 'Tools & Media', 'Herramientas', '金融工具与媒体')}{' '}
                <span className="nav-btn-chevron">▾</span>
              </button>
              <div className="nav-dropdown-panel">
                <button
                  type="button"
                  className="nav-dropdown-link"
                  onClick={() => navigateTo('outils', { toolTab: 'plex' })}
                >
                  <span className="nav-dropdown-link-title">
                    {tr(
                      lang,
                      'Chiffrier MREX & APH Select',
                      'MREX & MLI Select Simulator',
                      'Simulador MREX y APH Select',
                      'MREX 与 APH Select 精算模型'
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
                  onClick={() => navigateTo('investisseurs-internationaux')}
                >
                  <span className="nav-dropdown-link-title" style={{ color: 'var(--gold-light)' }}>
                    {tr(
                      lang,
                      'Portail Investisseurs Internationaux',
                      'International Investors Guide',
                      'Guía Inversores Internacionales',
                      '国际买家税务与豁免指南'
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
                  label: tr(lang, 'Franchises', 'Franchises', 'Franquicias', '特许经营')
                },
                {
                  id: 'proprietes',
                  label: dealsCount > 0 ? `${t.nav.properties} (${dealsCount})` : t.nav.properties
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
                  label: tr(lang, 'Outils & Médias', 'Tools & Media', 'Herramientas y Medios', '金融工具与媒体'),
                  subId: 'evenements',
                  subLabel: tr(lang, 'Actualités', 'News', 'Noticias', '最新动态')
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
