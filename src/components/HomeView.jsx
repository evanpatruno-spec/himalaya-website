import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Lock, ExternalLink } from 'lucide-react';
import { SPECIALTIES_DATA, HIMALAYA_FRANCHISES } from '../data/siteContent';
import { INITIAL_HIMALAYA_BROKERS } from '../data/brokersData';
import { tr, pickLang } from '../data/translations';
import { CURRENCY_OPTIONS, getCurrencyDisclaimerText } from '../utils/currencyService';
import PropertyCard from './PropertyCard';

/* Compteur animé des chiffres clés au défilement */
function AnimatedStatValue({ target, suffix = '', isYear = false }) {
  const [val, setVal] = useState(isYear ? 2000 : 0);
  const ref = React.useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frameId;
    let started = false;

    const runAnimation = () => {
      if (started) return;
      started = true;
      const startVal = isYear ? 1995 : 0;
      const duration = 1100;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (target - startVal) * eased);
        setVal(current);
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        }
      };
      frameId = requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === 'undefined') {
      setVal(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, isYear]);

  return (
    <span ref={ref}>
      {val}{suffix}
    </span>
  );
}

export default function HomeView({
  lang,
  t,
  liveDealsData,
  filteredProperties,
  searchKeyword,
  setSearchKeyword,
  filtrePropriete,
  setFiltrePropriete,
  filtreRegion,
  setFiltreRegion,
  availableRegions,
  currency,
  setCurrency,
  exchangeRates,
  navigateTo,
  openDealModal,
  setNdaModalDeal
}) {
  // #14 — STRICT : Uniquement si de vraies transactions vendues existent dans les données (Centris API)
  const verifiedSoldDeals = (liveDealsData || []).filter(d => d && d.status === 'Vendu');

  return (
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
          <source src="/gx/video/Himalaya.mp4" type="video/mp4" />
          <source src="/gx/video/Himalaya.webm" type="video/webm" />
        </video>
        <div className="hero-overlay" />

        <div className="container hero-content">
          <h1 className="serif-title" style={{ fontSize: 'clamp(2.4rem, 4.8vw, 3.85rem)', fontWeight: 600, lineHeight: 1.12, maxWidth: '880px', margin: '0 auto 16px' }}>
            {t.hero.titleStart} <span className="gold-gradient-text">{t.hero.titleHighlight}</span>
          </h1>

          <p style={{ color: '#e4e4ea', fontSize: '1.04rem', maxWidth: '640px', margin: '0 auto', letterSpacing: '0.01em' }}>
            {t.hero.subtitle}
          </p>

          {/* Moteur de recherche Hero façon « Conciergerie Privée » */}
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

        {/* Indicateur de défilement minimaliste en fil d'or vertical */}
        <div className="hero-scroll-indicator">
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* SPÉCIALITÉS (4 cartes visuelles épurées + Lien vers Portail Investisseurs Internationaux #20) */}
      <section style={{ padding: '84px 0', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '6px' }}>
                {tr(lang, 'Pôles de courtage', 'Areas of Expertise', 'Áreas de especialización', '核心经纪业务')}
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
                    navigateTo('investisseurs-internationaux');
                  }
                }}
              >
                <img
                  src={spec.image}
                  alt={pickLang(spec, 'title', lang)}
                  onError={e => { e.target.src = spec.fallbackImage; }}
                />
                <div className="specialty-overlay">
                  <span className="editorial-num" style={{ marginBottom: '8px', fontSize: '1.25rem' }}>
                    0{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '4px' }}>
                    {pickLang(spec, 'subtitle', lang)}
                  </span>
                  <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600, marginBottom: '12px', color: '#fff', lineHeight: 1.2 }}>
                    {pickLang(spec, 'title', lang)}
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

      {/* PROPRIÉTÉS À LA UNE + Sélecteur 4 Devises Banque du Canada (#11) */}
      <section style={{ padding: '84px 0', background: 'var(--bg-darker)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '38px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '6px' }}>
                {tr(lang, 'Sélection de mandats', 'Curated Selection', 'Selección de mandatos', '精选在售物业')}
              </span>
              <h2 className="serif-title" style={{ fontSize: '2.35rem', fontWeight: 600 }}>{t.home.featuredTitle}</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Sélecteur de devises en temps réel (CAD $ | EUR € | USD $ | CNY ¥ — Idée #11) */}
              <div
                style={{
                  display: 'inline-flex',
                  border: '1px solid rgba(200, 164, 93, 0.35)',
                  borderRadius: '6px',
                  padding: '2px',
                  marginRight: '4px'
                }}
              >
                {CURRENCY_OPTIONS.map(curr => (
                  <button
                    key={curr.id}
                    type="button"
                    onClick={() => setCurrency(curr.id)}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.73rem',
                      fontWeight: 600,
                      background: currency === curr.id ? 'var(--gold)' : 'transparent',
                      color: currency === curr.id ? '#09090b' : 'var(--text-secondary)'
                    }}
                  >
                    {curr.label}
                  </button>
                ))}
              </div>
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

          {currency !== 'CAD' && (
            <div style={{ marginBottom: '22px', fontSize: '0.78rem', color: 'var(--gold-light)' }}>
              {getCurrencyDisclaimerText(currency, lang, exchangeRates)}
            </div>
          )}

          <div className="properties-grid">
            {filteredProperties.slice(0, 6).map(deal => (
              <PropertyCard
                key={deal.id}
                deal={deal}
                t={t}
                currency={currency}
                rates={exchangeRates}
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

      {/* #14 — SECTION TRANSACTIONS RÉALISÉES : Strictement conditionnelle à l'existence de vraies transactions vendues (0 fausse donnée) */}
      {verifiedSoldDeals.length > 0 && (
        <>
          <hr className="gold-hairline" />
          <section style={{ padding: '84px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '38px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span className="badge-gold" style={{ marginBottom: '6px' }}>
                    {tr(lang, 'Track Record Vérifié • Centris / OACIQ', 'Verified Track Record • Centris / OACIQ', 'Historial Verificado • Centris / OACIQ', 'Centris / OACIQ 真实成交记录')}
                  </span>
                  <h2 className="serif-title" style={{ fontSize: '2.35rem', fontWeight: 600 }}>
                    {tr(lang, 'Transactions Réalisées', 'Completed Transactions', 'Transacciones Realizadas', '已成交物业档案')}
                  </h2>
                </div>
                <button
                  onClick={() => navigateTo('proprietes', { rechercheBut: 'Vendu' })}
                  className="editorial-link"
                >
                  {tr(lang, 'Voir toutes les transactions réalisées', 'View All Sold Properties', 'Ver todas las propiedades vendidas', '查看全部已售物业')} ({verifiedSoldDeals.length}) <ArrowRight size={15} />
                </button>
              </div>

              <div className="properties-grid">
                {verifiedSoldDeals.slice(0, 6).map(deal => (
                  <PropertyCard
                    key={deal.id}
                    deal={deal}
                    t={t}
                    currency={currency}
                    rates={exchangeRates}
                    onSelect={() => openDealModal(deal)}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <hr className="gold-hairline" />

      {/* BANNIÈRE CHIFFRES CLÉS AUTHENTIQUES & GALERIE FRANCHISES */}
      <section style={{ padding: '84px 0', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '28px',
            paddingBottom: '64px',
            marginBottom: '64px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {[
              { target: liveDealsData.length, suffix: '', label: t.home.statMandates },
              { target: INITIAL_HIMALAYA_BROKERS.length, suffix: '', label: t.home.statBrokers },
              { target: 35, suffix: '+', label: tr(lang, 'Années d’expertise cumulée', 'Years of Combined Expertise', 'Años de experiencia acumulada', '年累计行业经验') },
              { target: HIMALAYA_FRANCHISES.length, suffix: '+', label: tr(lang, 'Bannières nationales (CQF)', 'National Franchise Brands (CQF)', 'Marcas nacionales (CQF)', '全国连锁合作品牌 (CQF)') },
              { target: 2008, suffix: '', isYear: true, label: t.home.statFounded }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '6px 12px' }}>
                <div className="num-metric gold-gradient-text" style={{ fontSize: '2.35rem', fontWeight: 700, lineHeight: 1.05 }}>
                  <AnimatedStatValue target={stat.target} suffix={stat.suffix} isYear={stat.isYear} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* GALERIE D'ENSEIGNES FRANCHISES — STYLE ÉDITORIAL */}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '36px'
            }}>
              {HIMALAYA_FRANCHISES.map((fr) => (
                <div
                  key={fr.id}
                  onClick={() => navigateTo('franchises')}
                  style={{
                    background: 'transparent',
                    borderTop: '1px solid rgba(200, 164, 93, 0.35)',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '32px 20px 26px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    transition: 'border-color 0.3s ease, transform 0.3s ease'
                  }}
                >
                  <div style={{
                    height: '124px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px'
                  }}>
                    {fr.logo && (
                      <img
                        src={fr.logo}
                        alt={fr.name}
                        style={{
                          height: fr.logoHeight || '64px',
                          maxWidth: '230px',
                          width: 'auto',
                          objectFit: 'contain',
                          filter: fr.invertLogo ? 'brightness(0) invert(1)' : 'none'
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    {pickLang(fr, 'category', lang)}
                  </div>
                  <h4 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600, color: '#fff', margin: '0 0 12px' }}>
                    {pickLang(fr, 'name', lang)}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span className="editorial-link" style={{ fontSize: '0.72rem' }}>
                      {tr(lang, 'Chercher un local', 'Find a Location', 'Buscar local', '寻找门店选址')} <ArrowRight size={12} />
                    </span>
                    {fr.website && (
                      <a
                        href={fr.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: '0.72rem',
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
              <button onClick={() => navigateTo('investisseurs-internationaux')} className="btn-outline">
                {tr(lang, 'Portail International', 'International Desk', 'Portal Internacional', '国际买家专区')}
              </button>
              <button onClick={() => navigateTo('nous-joindre', { contactTab: 'valuation' })} className="btn-outline">
                {t.home.evaluateBtn}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
