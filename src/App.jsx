import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import initialLiveDealsData from './data/himalayaLiveDeals.json';
import { INITIAL_HIMALAYA_BROKERS } from './data/brokersData';
import { TRANSLATIONS, tr } from './data/translations';
import {
  normalizeText,
  dealBelongsToBroker,
  submitLeadToProspection,
  getStoredWebLeads
} from './utils/prospectionBridge';
import { useExchangeRates } from './utils/currencyService';
import {
  getPropertyUrlPath,
  getBrokerUrlPath,
  getPageUrlPath,
  parseRouteFromLocation,
  updateDynamicSEO
} from './utils/seoRouter';
import HeaderNav from './components/HeaderNav';
import FooterSection from './components/FooterSection';
import HomeView from './components/HomeView';

// Code-splitting & Lazy Loading des vues et modales (#16)
const PropertiesView = lazy(() => import('./components/PropertiesView'));
const BrokersView = lazy(() => import('./components/BrokersView'));
const AgenciesView = lazy(() => import('./components/AgenciesView'));
const NewsEventsView = lazy(() => import('./components/NewsEventsView'));
const PodcastsView = lazy(() => import('./components/PodcastsView'));
const ContactView = lazy(() => import('./components/ContactView'));
const AboutPageView = lazy(() => import('./components/AboutPageView'));
const ToolsHubView = lazy(() => import('./components/ToolsHubView'));
const InternationalInvestorsView = lazy(() => import('./components/InternationalInvestorsView'));

const PropertyDetailModal = lazy(() => import('./components/PropertyDetailModal'));
const BuyerNDAModal = lazy(() => import('./components/BuyerNDAModal'));
const BrokerDetailModal = lazy(() => import('./components/BrokerDetailModal'));

export default function App() {
  const [liveDealsData, setLiveDealsData] = useState(initialLiveDealsData);
  const [activePage, setActivePage] = useState('home');

  // Synchronisation automatique en arrière-plan avec la passerelle Centris / MLS (/api/centris-sync)
  useEffect(() => {
    fetch('/api/centris-sync')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.deals) && data.deals.length > 0) {
          setLiveDealsData(prev => {
            const byMls = new Map(prev.map(d => [String(d.mls_number), d]));
            data.deals.forEach(item => {
              if (item && item.mls_number) {
                const existing = byMls.get(String(item.mls_number)) || {};
                byMls.set(String(item.mls_number), { ...existing, ...item });
              }
            });
            return Array.from(byMls.values());
          });
        }
      })
      .catch(() => {});
  }, []);
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('himalaya_site_lang');
      if (saved === 'FR' || saved === 'EN' || saved === 'ES' || saved === 'ZH') return saved;
    } catch {}
    return 'FR';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.FR;

  // Taux de change en direct de la Banque du Canada (#11 : CAD, EUR, USD, CNY)
  const exchangeRates = useExchangeRates();
  const [currency, setCurrency] = useState('CAD');

  const handleLanguageChange = (code) => {
    setLang(code);
    try {
      localStorage.setItem('himalaya_site_lang', code);
      document.documentElement.lang = code.toLowerCase();
    } catch {}
  };

  // Filtres de recherche Propriétés
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtrePropriete, setFiltrePropriete] = useState('all');
  const [rechercheBut, setRechercheBut] = useState('all');
  const [filtreRegion, setFiltreRegion] = useState('all');
  const [filtreCourtier, setFiltreCourtier] = useState('all');
  const [filtreBudget, setFiltreBudget] = useState('all');
  const [sortBy, setSortBy] = useState('price_desc');
  const [propertiesViewMode, setPropertiesViewMode] = useState('grid');

  // Filtres Courtiers
  const [brokerCategoryFilter, setBrokerCategoryFilter] = useState('all');
  const [brokerLanguageFilter, setBrokerLanguageFilter] = useState('all');
  const [brokerSearch, setBrokerSearch] = useState('');

  // Modales & États de navigation
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [ndaModalDeal, setNdaModalDeal] = useState(undefined);
  const [toolPreselectedDeal, setToolPreselectedDeal] = useState(null);
  const [toolInitialTab, setToolInitialTab] = useState('plex');
  const [aboutInitialTab, setAboutInitialTab] = useState('qui-nous-sommes');
  const [newsYearFilter, setNewsYearFilter] = useState('all');
  const [selectedNewsArticle, setSelectedNewsArticle] = useState(null);
  const [legalModalType, setLegalModalType] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Lecteur Balados
  const [playingPodcastId, setPlayingPodcastId] = useState(null);
  const [podcastSeriesFilter, setPodcastSeriesFilter] = useState('all');

  // Formulaire Nous joindre & Évaluation Vendeur
  const [contactTab, setContactTab] = useState('general');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: 'Acquérir une propriété / Dossiers hors-marché',
    assetType: 'Pourvoirie / Camping / Villégiature',
    preferredTime: 'Matin (8h–12h)',
    fullName: '',
    phone: '',
    email: '',
    city: '',
    revenue: '',
    message: ''
  });
  const [webLeads, setWebLeads] = useState(() => getStoredWebLeads());

  // Détection du défilement avec hystérésis
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(prev => (prev ? y > 35 : y > 110));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Synchronisation URL propre (/proprietes/slug, /courtiers/slug, /investisseurs-internationaux, etc.) + rétrocompatibilité ?propriete= & #hash (#15)
  useEffect(() => {
    const syncFromUrl = () => {
      const parsed = parseRouteFromLocation(liveDealsData, INITIAL_HIMALAYA_BROKERS);
      setActivePage(parsed.page || 'home');
      setSelectedDeal(parsed.deal || null);
      setSelectedBroker(parsed.broker || null);
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  // Mise à jour dynamique SEO, OpenGraph & Schema.org JSON-LD (#15)
  useEffect(() => {
    updateDynamicSEO({
      page: activePage,
      deal: selectedDeal,
      broker: selectedBroker,
      lang
    });
  }, [activePage, selectedDeal, selectedBroker, lang]);

  // Régions uniques nettoyées
  const availableRegions = useMemo(() => {
    const s = new Set();
    liveDealsData.forEach(d => {
      if (d.region) s.add(d.region);
    });
    return Array.from(s).sort();
  }, [liveDealsData]);

  // Filtrage des propriétés (#14 : distinction stricte Actif vs Vendu)
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

        if (filtreBudget !== 'all') {
          const p = Number(d.price) || 0;
          if (filtreBudget === 'under500k' && !(p > 0 && p < 500000)) return false;
          if (filtreBudget === '500k_1500k' && !(p >= 500000 && p <= 1500000)) return false;
          if (filtreBudget === '1500k_5000k' && !(p > 1500000 && p <= 5000000)) return false;
          if (filtreBudget === 'over5000k' && !(p > 5000000 || p === 0)) return false;
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
  }, [liveDealsData, rechercheBut, filtrePropriete, filtreRegion, filtreCourtier, filtreBudget, searchKeyword, sortBy]);

  // Langues parlées par courtier
  const getBrokerLanguages = (b) => {
    const id = b.id || '';
    const codes = ['fr', 'en'];
    if (['olivier_meunier', 'yun_zhang', 'pengbo_zhao'].includes(id)) codes.push('zh');
    if (['roger_rheaume', 'sylvie_castonguay', 'eric_barelier'].includes(id)) codes.push('es');
    if (['mike_ainajian', 'joseph_jacob'].includes(id)) codes.push('ar');
    if (['mike_ainajian', 'taline_ovayan'].includes(id)) codes.push('hy');
    return codes;
  };

  const getBrokerLanguageLabels = (b) => {
    const codes = getBrokerLanguages(b);
    const map = {
      fr: 'FR',
      en: 'EN',
      zh: tr(lang, 'Mandarin (中文)', 'Mandarin (中文)', 'Mandarín (中文)', '普通话 (中文)'),
      es: tr(lang, 'Espagnol', 'Spanish', 'Español', '西班牙语'),
      ar: tr(lang, 'Arabe', 'Arabic', 'Árabe', '阿拉伯语'),
      hy: tr(lang, 'Arménien', 'Armenian', 'Armenio', '亚美尼亚语')
    };
    return codes.map(c => map[c]).filter(Boolean);
  };

  const filteredBrokers = useMemo(() => {
    const q = normalizeText(brokerSearch);
    return INITIAL_HIMALAYA_BROKERS.filter(b => {
      if (brokerCategoryFilter !== 'all') {
        const cats = Array.isArray(b.categories) ? b.categories : [b.category];
        if (!cats.includes(brokerCategoryFilter)) return false;
      }
      if (brokerLanguageFilter !== 'all') {
        const spoken = getBrokerLanguages(b);
        if (brokerLanguageFilter === 'ar_hy') {
          if (!spoken.includes('ar') && !spoken.includes('hy')) return false;
        } else if (!spoken.includes(brokerLanguageFilter)) {
          return false;
        }
      }
      if (q) {
        const hay = normalizeText(`${b.name} ${b.title} ${b.shortTitle} ${b.city}`);
        return hay.includes(q);
      }
      return true;
    });
  }, [brokerCategoryFilter, brokerLanguageFilter, brokerSearch, lang]);

  // Navigation avec URLs dédiées propres (#15)
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

    setSelectedDeal(null);
    setSelectedBroker(null);
    setActivePage(page);
    setMobileMenuOpen(false);

    const targetPath = getPageUrlPath(page);
    if (window.location.pathname !== targetPath || window.location.search || window.location.hash) {
      window.history.pushState({ page }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDealModal = (deal) => {
    setSelectedDeal(deal);
    if (deal) {
      const cleanPath = getPropertyUrlPath(deal);
      window.history.pushState({ dealId: deal.id, mls: deal.mls_number }, '', cleanPath);
    }
  };

  const closeDealModal = () => {
    setSelectedDeal(null);
    const targetPath = getPageUrlPath(activePage);
    window.history.replaceState({ page: activePage }, '', targetPath);
  };

  const openBrokerModal = (broker) => {
    setSelectedBroker(broker);
    if (broker) {
      const cleanPath = getBrokerUrlPath(broker);
      window.history.pushState({ brokerId: broker.id }, '', cleanPath);
    }
  };

  const closeBrokerModal = () => {
    setSelectedBroker(null);
    const targetPath = getPageUrlPath(activePage);
    window.history.replaceState({ page: activePage }, '', targetPath);
  };

  const internalBannerTitle = useMemo(() => {
    switch (activePage) {
      case 'a-propos': return t.nav.about;
      case 'proprietes': return t.nav.properties;
      case 'franchises': return tr(lang, 'Franchises', 'Franchises', 'Franquicias', '特许经营');
      case 'investisseurs-internationaux': return tr(lang, 'Portail Investisseurs Internationaux', 'International Investors Desk', 'Portal de Inversores Internacionales', '国际买家与投资专区');
      case 'courtiers': return t.nav.brokers;
      case 'agences': return t.nav.agencies;
      case 'outils': return tr(lang, 'Outils & Simulateur SCHL APH Select', 'MREX & CMHC MLI Select Simulators', 'Herramientas y Simulador SCHL APH Select', 'MREX 与 SCHL APH Select 金融模拟器');
      case 'evenements': return t.nav.news;
      case 'balados': return t.nav.podcasts;
      case 'nous-joindre': return t.nav.contact;
      default: return '';
    }
  }, [activePage, t, lang]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    await submitLeadToProspection({
      type: contactTab === 'valuation' ? 'valuation' : 'contact',
      subject: contactTab === 'valuation' ? `Évaluation : ${contactForm.assetType}` : contactForm.subject,
      assetType: contactForm.assetType,
      preferredTime: contactForm.preferredTime,
      fullName: contactForm.fullName,
      phone: contactForm.phone,
      email: contactForm.email,
      city: contactForm.city,
      revenue: contactForm.revenue,
      message: contactForm.message
        ? `[Rappel souhaité : ${contactForm.preferredTime}] ${contactForm.message}`
        : `[Rappel souhaité : ${contactForm.preferredTime}]`
    });
    setWebLeads(getStoredWebLeads());
    setContactSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER PRINCIPAL */}
      <HeaderNav
        activePage={activePage}
        lang={lang}
        t={t}
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLanguageChange={handleLanguageChange}
        navigateTo={navigateTo}
        setContactForm={setContactForm}
        setNdaModalDeal={setNdaModalDeal}
        liveDealsCount={liveDealsData.length}
      />

      {/* BANDEAU PANORAMIQUE MONTAGNE ENNEIGÉE NOIR & BLANC SOUS LE LOSANGE */}
      {activePage !== 'home' && (
        <section className="internal-mountain-banner">
          <h1 className="internal-banner-title">{internalBannerTitle}</h1>
        </section>
      )}

      {/* PAGE 1 : ACCUEIL */}
      {activePage === 'home' && (
        <HomeView
          lang={lang}
          t={t}
          liveDealsData={liveDealsData}
          filteredProperties={filteredProperties}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          filtrePropriete={filtrePropriete}
          setFiltrePropriete={setFiltrePropriete}
          filtreRegion={filtreRegion}
          setFiltreRegion={setFiltreRegion}
          availableRegions={availableRegions}
          currency={currency}
          setCurrency={setCurrency}
          exchangeRates={exchangeRates}
          navigateTo={navigateTo}
          openDealModal={openDealModal}
          setNdaModalDeal={setNdaModalDeal}
        />
      )}

      {/* VUES SECONDAIRES AVEC LAZY LOADING (#16) */}
      <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold-light)' }}>Chargement...</div>}>
        {activePage === 'proprietes' && (
          <PropertiesView
            lang={lang}
            t={t}
            liveDealsData={liveDealsData}
            filteredProperties={filteredProperties}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            filtrePropriete={filtrePropriete}
            setFiltrePropriete={setFiltrePropriete}
            rechercheBut={rechercheBut}
            setRechercheBut={setRechercheBut}
            filtreBudget={filtreBudget}
            setFiltreBudget={setFiltreBudget}
            filtreRegion={filtreRegion}
            setFiltreRegion={setFiltreRegion}
            availableRegions={availableRegions}
            filtreCourtier={filtreCourtier}
            setFiltreCourtier={setFiltreCourtier}
            sortBy={sortBy}
            setSortBy={setSortBy}
            propertiesViewMode={propertiesViewMode}
            setPropertiesViewMode={setPropertiesViewMode}
            currency={currency}
            setCurrency={setCurrency}
            exchangeRates={exchangeRates}
            openDealModal={openDealModal}
            setNdaModalDeal={setNdaModalDeal}
          />
        )}

        {activePage === 'a-propos' && (
          <AboutPageView
            lang={lang}
            directors={INITIAL_HIMALAYA_BROKERS.filter(b => b.category === 'direction')}
            onSelectBroker={openBrokerModal}
            onNavigate={navigateTo}
            initialTab={aboutInitialTab}
          />
        )}

        {activePage === 'franchises' && (
          <AboutPageView
            lang={lang}
            directors={INITIAL_HIMALAYA_BROKERS.filter(b => b.category === 'direction')}
            onSelectBroker={openBrokerModal}
            onNavigate={navigateTo}
            initialTab="franchises"
            standaloneFranchisePage={true}
          />
        )}

        {activePage === 'investisseurs-internationaux' && (
          <InternationalInvestorsView
            lang={lang}
            rates={exchangeRates}
            currency={currency}
            onCurrencyChange={setCurrency}
            onSelectBroker={openBrokerModal}
            onNavigate={navigateTo}
            onLeadsUpdated={() => setWebLeads(getStoredWebLeads())}
          />
        )}

        {activePage === 'outils' && (
          <ToolsHubView
            lang={lang}
            onNavigate={navigateTo}
            preselectedDeal={toolPreselectedDeal}
            onClearPreselectedDeal={() => setToolPreselectedDeal(null)}
            initialTool={toolInitialTab}
          />
        )}

        {activePage === 'agences' && (
          <AgenciesView lang={lang} t={t} />
        )}

        {activePage === 'courtiers' && (
          <BrokersView
            lang={lang}
            t={t}
            liveDealsData={liveDealsData}
            filteredBrokers={filteredBrokers}
            brokerSearch={brokerSearch}
            setBrokerSearch={setBrokerSearch}
            brokerCategoryFilter={brokerCategoryFilter}
            setBrokerCategoryFilter={setBrokerCategoryFilter}
            brokerLanguageFilter={brokerLanguageFilter}
            setBrokerLanguageFilter={setBrokerLanguageFilter}
            getBrokerLanguageLabels={getBrokerLanguageLabels}
            openBrokerModal={openBrokerModal}
          />
        )}

        {activePage === 'evenements' && (
          <NewsEventsView
            lang={lang}
            t={t}
            newsYearFilter={newsYearFilter}
            setNewsYearFilter={setNewsYearFilter}
            selectedNewsArticle={selectedNewsArticle}
            setSelectedNewsArticle={setSelectedNewsArticle}
            navigateTo={navigateTo}
          />
        )}

        {activePage === 'balados' && (
          <PodcastsView
            lang={lang}
            podcastSeriesFilter={podcastSeriesFilter}
            setPodcastSeriesFilter={setPodcastSeriesFilter}
            playingPodcastId={playingPodcastId}
            setPlayingPodcastId={setPlayingPodcastId}
            navigateTo={navigateTo}
          />
        )}

        {activePage === 'nous-joindre' && (
          <ContactView
            lang={lang}
            t={t}
            contactTab={contactTab}
            setContactTab={setContactTab}
            contactSubmitted={contactSubmitted}
            setContactSubmitted={setContactSubmitted}
            contactForm={contactForm}
            setContactForm={setContactForm}
            handleContactSubmit={handleContactSubmit}
          />
        )}
      </Suspense>

      {/* FOOTER ARCHITECTURAL & BARRE MOBILE */}
      <FooterSection
        lang={lang}
        t={t}
        activePage={activePage}
        isScrolled={isScrolled}
        navigateTo={navigateTo}
        legalModalType={legalModalType}
        setLegalModalType={setLegalModalType}
      />

      {/* MODALES AVEC LAZY LOADING */}
      <Suspense fallback={null}>
        {selectedDeal && (
          <PropertyDetailModal
            deal={selectedDeal}
            t={t}
            currency={currency}
            rates={exchangeRates}
            onCurrencyChange={setCurrency}
            onSelectDeal={deal => openDealModal(deal)}
            onClose={closeDealModal}
            onOpenNDA={deal => setNdaModalDeal(deal)}
            onFilterByBroker={brokerName => navigateTo('proprietes', { filtreCourtier: brokerName })}
            onOpenCalculator={price => {
              const dealWithPrice = { ...selectedDeal, price: price || selectedDeal.price };
              closeDealModal();
              setToolPreselectedDeal(dealWithPrice);
              navigateTo('outils', { toolTab: 'mortgage' });
            }}
            onSimulateInTools={deal => {
              closeDealModal();
              setToolPreselectedDeal(deal);
              navigateTo('outils', { toolTab: 'plex' });
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
            onClose={() => {
              setWebLeads(getStoredWebLeads());
              setNdaModalDeal(undefined);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
