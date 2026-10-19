import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Phone, Mail, Globe, Award, Shield, Sparkles, 
  Calendar, ArrowRight, Building2, Trees, Home, Compass, Lock, 
  ExternalLink, ChevronRight, Users, Play, CheckCircle2, Filter, 
  SlidersHorizontal, Eye, Layers, Briefcase, Mic, Newspaper, Menu, X
} from 'lucide-react';
import liveDealsData from './data/himalayaLiveDeals.json';
import { INITIAL_HIMALAYA_BROKERS } from './data/brokersData';
import { 
  HIMALAYA_AGENCIES, HIMALAYA_EVENTS, HIMALAYA_NEWS, 
  HIMALAYA_PODCASTS, SPECIALTIES_DATA 
} from './data/siteContent';
import PropertyDetailModal from './components/PropertyDetailModal';
import BuyerNDAModal from './components/BuyerNDAModal';

export default function App() {
  // Navigation : 'home' | 'proprietes' | 'a-propos' | 'agences' | 'courtiers' | 'evenements' | 'balados' | 'nous-joindre' | 'zone-equipe'
  const [activePage, setActivePage] = useState('home');
  const [lang, setLang] = useState('FR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtres de recherche (reproduction exacte du formulaire himalayacorp.com + améliorations)
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtrePropriete, setFiltrePropriete] = useState('all'); // 'all', 'Commercial', 'Camping', 'Pourvoirie', 'Résidentiel', 'Terrain'
  const [rechercheBut, setRechercheBut] = useState('all'); // 'all', 'Vente', 'Location'
  const [filtreRegion, setFiltreRegion] = useState('all');
  const [filtreCourtier, setFiltreCourtier] = useState('all');
  const [sortBy, setSortBy] = useState('price_desc');

  // Filtre page courtiers
  const [brokerCategoryFilter, setBrokerCategoryFilter] = useState('all');
  const [brokerSearch, setBrokerSearch] = useState('');

  // Modales
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [ndaModalDeal, setNdaModalDeal] = useState(undefined); // undefined = closed, null = generic NDA, deal = specific deal NDA
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Régions uniques extraites des vrais mandats
  const availableRegions = useMemo(() => {
    const s = new Set();
    liveDealsData.forEach(d => {
      if (d.region && d.region.length > 2 && !/^[A-Z]\d[A-Z]/i.test(d.region)) {
        s.add(d.region);
      } else if (d.city) {
        s.add(d.city.split(' ')[0]);
      }
    });
    return Array.from(s).sort();
  }, []);

  // Filtrage des propriétés
  const filteredProperties = useMemo(() => {
    return liveDealsData
      .filter(d => {
        if (rechercheBut !== 'all' && d.transaction_type !== rechercheBut) return false;

        if (filtrePropriete !== 'all') {
          const cat = (d.category || '').toLowerCase();
          const desc = (d.description || '').toLowerCase();
          const title = (d.title || '').toLowerCase();
          const f = filtrePropriete.toLowerCase();
          if (f === 'pourvoirie') {
            if (!cat.includes('camping') && !cat.includes('pourvoirie') && !cat.includes('hôtellerie') && !desc.includes('camping') && !desc.includes('pourvoirie') && !desc.includes('chalet') && !desc.includes('villégiature')) {
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
            if (!cat.includes('résidentiel') && !cat.includes('residentiel') && !desc.includes('résidentiel') && !desc.includes('maison') && !desc.includes('condo')) {
              return false;
            }
          }
        }

        if (filtreRegion !== 'all') {
          const r = (d.region || '').toLowerCase();
          const c = (d.city || '').toLowerCase();
          if (!r.includes(filtreRegion.toLowerCase()) && !c.includes(filtreRegion.toLowerCase())) {
            return false;
          }
        }

        if (filtreCourtier !== 'all') {
          const b = (d.assigned_broker || '').toLowerCase();
          if (!b.includes(filtreCourtier.toLowerCase())) return false;
        }

        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase().trim();
          const match = 
            (d.title || '').toLowerCase().includes(q) ||
            (d.city || '').toLowerCase().includes(q) ||
            (d.region || '').toLowerCase().includes(q) ||
            (d.mls_number || '').toLowerCase().includes(q) ||
            (d.description || '').toLowerCase().includes(q) ||
            (d.assigned_broker || '').toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        return (a.title || '').localeCompare(b.title || '');
      });
  }, [rechercheBut, filtrePropriete, filtreRegion, filtreCourtier, searchKeyword, sortBy]);

  // Courtiers filtrés
  const filteredBrokers = useMemo(() => {
    return INITIAL_HIMALAYA_BROKERS.filter(b => {
      if (brokerCategoryFilter !== 'all' && b.category !== brokerCategoryFilter) return false;
      if (brokerSearch.trim()) {
        const q = brokerSearch.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.title.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          (b.bio || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [brokerCategoryFilter, brokerSearch]);

  // Navigation handler
  const navigateTo = (page, options = {}) => {
    if (options.filtrePropriete !== undefined) setFiltrePropriete(options.filtrePropriete);
    if (options.filtreCourtier !== undefined) setFiltreCourtier(options.filtreCourtier);
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Volume total des mandats
  const totalVolumeMillion = useMemo(() => {
    const sum = liveDealsData
      .filter(d => d.transaction_type === 'Vente')
      .reduce((acc, d) => acc + (d.price || 0), 0);
    return Math.round(sum / 1000000);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TOP BAR (Partenaire Multi-Prêts, Téléphone, Multilingue 5 langues, Zone Équipe) */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <a 
              href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya" 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)', fontWeight: 600 }}
            >
              <img 
                src="https://www.himalayacorp.com/gx/m/Multi_Prets.png" 
                alt="Multi-Prêts Hypothèques" 
                style={{ height: '20px', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span>Partenaire Hypothécaire Multi-Prêts</span>
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="tel:5148984898" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={12} color="var(--gold)" /> (514) 898-4898
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={12} color="var(--gold)" /> Montréal • Saint-Sauveur • Québec • Paris • Caraïbes
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Sélecteur des 5 langues officielles de himalayacorp.com */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {[
                { code: 'FR', label: 'FR' },
                { code: 'EN', label: 'EN' },
                { code: 'ES', label: 'ES' },
                { code: 'AR', label: 'عربى' },
                { code: 'ZH', label: '中国' }
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    background: lang === l.code ? 'rgba(200, 164, 93, 0.2)' : 'transparent',
                    border: lang === l.code ? '1px solid var(--gold)' : '1px solid transparent',
                    color: lang === l.code ? 'var(--gold-light)' : 'var(--text-muted)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontSize: '0.73rem',
                    cursor: 'pointer',
                    fontWeight: lang === l.code ? 700 : 400
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => navigateTo('zone-equipe')}
              style={{
                background: 'rgba(200, 164, 93, 0.14)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold-light)',
                padding: '4px 11px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <Lock size={11} /> Zone Exclusive - Équipe & CRM
            </button>
          </div>
        </div>
      </div>

      {/* HEADER PRINCIPAL (Logo officiel Himalaya + Navigation structurée) */}
      <header className="main-header">
        <div className="container header-inner">
          {/* Logo Officiel */}
          <div 
            onClick={() => navigateTo('home', { filtrePropriete: 'all', filtreCourtier: 'all' })}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          >
            <img 
              src="https://www.himalayacorp.com/gx/himalaya-immobilier-logo.svg" 
              alt="Immobilier Himalaya Real Estate Corp"
              style={{ height: '54px', width: 'auto' }}
              onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/himalaya-immobilier-logo.png'; }}
            />
            <div>
              <div className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.05, letterSpacing: '0.04em' }}>
                IMMOBILIER <span className="gold-gradient-text">HIMALAYA</span>
              </div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--text-muted)', marginTop: '3px' }}>
                Real Estate Corp. • Commercial • Villégiature • Prestige
              </div>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <button className={`nav-btn ${activePage === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
                  Accueil
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'proprietes' ? 'active' : ''}`} onClick={() => navigateTo('proprietes')}>
                  Propriétés <span style={{ fontSize: '0.7rem', background: 'rgba(200,164,93,0.2)', color: 'var(--gold-light)', padding: '1px 6px', borderRadius: '99px' }}>{liveDealsData.length}</span>
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'a-propos' ? 'active' : ''}`} onClick={() => navigateTo('a-propos')}>
                  À propos
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'agences' ? 'active' : ''}`} onClick={() => navigateTo('agences')}>
                  Agences
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'courtiers' ? 'active' : ''}`} onClick={() => navigateTo('courtiers')}>
                  Courtiers
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'evenements' ? 'active' : ''}`} onClick={() => navigateTo('evenements')}>
                  Événements & Actualités
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'balados' ? 'active' : ''}`} onClick={() => navigateTo('balados')}>
                  Balados
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'nous-joindre' ? 'active' : ''}`} onClick={() => navigateTo('nous-joindre')}>
                  Nous joindre
                </button>
              </li>
            </ul>
          </nav>

          {/* Bouton Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Menu</span>
          </button>
        </div>

        {/* Menu Burger déroulant (identique au menuBurger complet de himalayacorp.com) */}
        {mobileMenuOpen && (
          <div style={{
            background: '#080d0b',
            borderBottom: '1px solid var(--border-gold)',
            padding: '20px 24px'
          }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'proprietes', label: `Nos Propriétés (${liveDealsData.length})` },
                { id: 'a-propos', label: 'À propos d’Himalaya' },
                { id: 'agences', label: 'Nos Agences & Bureaux' },
                { id: 'courtiers', label: `Courtiers & Équipe (${INITIAL_HIMALAYA_BROKERS.length})` },
                { id: 'evenements', label: 'Événements & Actualités' },
                { id: 'balados', label: 'Balados / Podcasts' },
                { id: 'nous-joindre', label: 'Nous joindre / Devenir affilié' },
                { id: 'zone-equipe', label: '🔒 Zone exclusive - Équipe & CRM' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: activePage === item.id ? 'rgba(200,164,93,0.16)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: activePage === item.id ? 'var(--gold-light)' : 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          PAGE 1 : ACCUEIL (Reproduction structurée + Modernisation Élite)
         ===================================================================== */}
      {activePage === 'home' && (
        <main style={{ flex: 1 }}>
          {/* SECTION 1 : HERO VIDEO (#homeVideo) */}
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
              <div className="badge-gold" style={{ marginBottom: '18px' }}>
                <Sparkles size={13} /> IMMOBILIER HIMALAYA REAL ESTATE CORP.
              </div>

              <h1 className="serif-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 1.1, maxWidth: '920px', margin: '0 auto 16px' }}>
                Une agence immobilière <br />
                <span className="gold-gradient-text">Commerciale, résidentielle et internationale</span>
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '720px', margin: '0 auto' }}>
                Nous proposons uniquement des propriétés de qualité exceptionnelle à notre clientèle : actifs commerciaux, pourvoiries, terrains de camping, domaines privés et investissements internationaux.
              </p>

              {/* Moteur de recherche structuré (#formRechAcc) */}
              <form 
                className="search-bar-box"
                onSubmit={e => { e.preventDefault(); navigateTo('proprietes'); }}
              >
                <div className="search-grid">
                  <div>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Mot-clé, ville, No Centris/MLS..."
                      value={searchKeyword}
                      onChange={e => setSearchKeyword(e.target.value)}
                    />
                  </div>

                  <div>
                    <select 
                      className="form-control"
                      value={filtrePropriete}
                      onChange={e => setFiltrePropriete(e.target.value)}
                    >
                      <option value="all">Tous types de propriétés</option>
                      <option value="commercial">Commercial & Industriel</option>
                      <option value="pourvoirie">Pourvoirie, Camping & Auberge</option>
                      <option value="terrain">Terrain vacant & Développement</option>
                      <option value="residentiel">Résidentiel & Prestige</option>
                    </select>
                  </div>

                  <div>
                    <select 
                      className="form-control"
                      value={rechercheBut}
                      onChange={e => setRechercheBut(e.target.value)}
                    >
                      <option value="all">À vendre / À louer</option>
                      <option value="Vente">À vendre</option>
                      <option value="Location">À louer</option>
                    </select>
                  </div>

                  <div>
                    <select 
                      className="form-control"
                      value={filtreRegion}
                      onChange={e => setFiltreRegion(e.target.value)}
                    >
                      <option value="all">Toutes les régions (Québec & Int.)</option>
                      {availableRegions.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select className="form-control" defaultValue="Canada">
                      <option value="Canada">Canada</option>
                      <option value="International">International (Caraïbes / Europe)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-gold" style={{ height: '45px', padding: '0 26px' }}>
                    <Search size={17} /> Rechercher
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span>🔥 <strong>{liveDealsData.length} mandats actifs</strong> synchronisés</span>
                    <span>•</span>
                    <span>💎 Volume en portefeuille : <strong>+{totalVolumeMillion} M$</strong></span>
                    <span>•</span>
                    <span>🌲 Base récréotouristique : <strong>1 115+ dossiers qualifiés</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      type="button"
                      onClick={() => setNdaModalDeal(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                    >
                      Accès Acheteurs Qualifiés & Pocket Listings (Hors-Marché) →
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* SECTION 2 : CERTAINES DE NOS SPÉCIALITÉS (#conteneurSpecialite) */}
          <section style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div className="badge-gold" style={{ marginBottom: '10px' }}>Pôles d’Expertise</div>
                  <h2 className="serif-title" style={{ fontSize: '2.5rem' }}>Certaines de nos spécialités</h2>
                </div>
                <button onClick={() => navigateTo('proprietes', { filtrePropriete: 'all' })} className="btn-outline">
                  Voir toutes nos propriétés ({liveDealsData.length}) <ArrowRight size={16} />
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
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '4px' }}>
                        {spec.subtitle}
                      </span>
                      <h3 className="serif-title" style={{ fontSize: '1.65rem', marginBottom: '8px', color: '#fff' }}>
                        {spec.title}
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                        {spec.description}
                      </p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold-light)' }}>
                        Explorer la division <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3 : PROPRIÉTÉS VEDETTES EN DIRECT (Ajout haute valeur avec les vrais mandats himalayacorp.com) */}
          <section style={{ padding: '80px 0', background: 'var(--bg-darker)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div className="badge-gold" style={{ marginBottom: '10px' }}>Portefeuille Exclusif</div>
                  <h2 className="serif-title" style={{ fontSize: '2.5rem' }}>Propriétés et Mandats à la Une</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                    Sélection d’opportunités commerciales, terrains de développement, campings et pourvoiries actuellement sur le marché.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'Tous' },
                    { id: 'pourvoirie', label: 'Campings & Pourvoiries' },
                    { id: 'commercial', label: 'Commercial' },
                    { id: 'terrain', label: 'Terrains' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFiltrePropriete(tab.id)}
                      className={filtrePropriete === tab.id ? 'btn-gold' : 'btn-outline'}
                      style={{ padding: '8px 16px', fontSize: '0.84rem' }}
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
                    onSelect={() => setSelectedDeal(deal)}
                    onOpenNDA={() => setNdaModalDeal(deal)}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '42px' }}>
                <button onClick={() => navigateTo('proprietes')} className="btn-gold" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
                  Consulter l’ensemble de nos {liveDealsData.length} propriétés <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4 : À PROPOS (#conteneurAbout) & AVANTAGE TECHNOLOGIQUE HIMALAYA */}
          <section style={{ padding: '85px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '48px',
                alignItems: 'center'
              }}>
                <div>
                  <div className="badge-gold" style={{ marginBottom: '14px' }}>L’Excellence Himalaya</div>
                  <h2 className="serif-title" style={{ fontSize: '2.6rem', lineHeight: 1.15, marginBottom: '20px' }}>
                    Des courtiers intègres dotés d’une <span className="gold-gradient-text">vaste expérience</span>
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '18px' }}>
                    Chez <strong>Immobilier Himalaya Real Estate Corp.</strong>, nous sommes portés par le souci de l’<strong>excellence</strong> et celui d’offrir un service hors pair à nos clients, qu’ils soient issus du secteur commercial, industriel, récréotouristique ou résidentiel.
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '28px' }}>
                    Nos courtiers immobiliers sont reconnus pour leur <strong>expertise</strong> et leur <strong>expérience</strong>. Venant de différentes cultures et parlant 5 langues, notre équipe comprend parfaitement vos besoins et vos impératifs, et vous offre une visibilité locale comme internationale.
                  </p>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <button onClick={() => navigateTo('a-propos')} className="btn-gold">
                      Découvrir notre histoire <ArrowRight size={16} />
                    </button>
                    <button onClick={() => navigateTo('courtiers')} className="btn-outline">
                      Rencontrer nos {INITIAL_HIMALAYA_BROKERS.length} courtiers
                    </button>
                  </div>
                </div>

                {/* Carte synergie : Site Web + Himalaya Prospection IA */}
                <div style={{
                  background: 'linear-gradient(145deg, #101916 0%, #090e0c 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '18px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                    <Sparkles size={18} /> Propulsé par l’Écosystème Technologique Himalaya
                  </div>
                  <h3 className="serif-title" style={{ fontSize: '1.8rem', marginBottom: '14px' }}>
                    Plus qu’une vitrine : une machine d’acquisition et de qualification
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '22px' }}>
                    Contrairement aux sites immobiliers traditionnels, notre plateforme est directement reliée à notre moteur interne de prospection et de jumelage d’acheteurs qualifiés :
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      {
                        title: 'Base de données propriétaire de +1 115 dossiers',
                        desc: 'Pourvoiries, campings, auberges et actifs commerciaux répertoriés et analysés à travers tout le Québec.'
                      },
                      {
                        title: 'Salle de Données & Signature NDA Automatisée',
                        desc: 'Protection stricte de la confidentialité des vendeurs avec qualification financière préalable des acheteurs.'
                      },
                      {
                        title: 'Jumelage IA Acheteurs / Vendeurs (Matching Engine)',
                        desc: 'Croisement instantané entre les critères d’investissement de nos acheteurs VIP et nos mandats exclusifs ou hors-marché.'
                      }
                    ].map((feat, idx) => (
                      <div key={idx} style={{
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                        background: 'rgba(255,255,255,0.025)', padding: '12px 14px',
                        borderRadius: '10px', border: '1px solid var(--border-subtle)'
                      }}>
                        <CheckCircle2 size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>{feat.title}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{feat.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 : ÉVÉNEMENTS À VENIR & DERNIÈRES ACTUALITÉS (#conteneurEventNews) */}
          <section style={{ padding: '80px 0', background: 'var(--bg-darker)', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="container">
              {/* Événements à venir */}
              <div style={{ marginBottom: '64px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div className="badge-gold" style={{ marginBottom: '8px' }}>Rayonnement International</div>
                    <h2 className="serif-title" style={{ fontSize: '2.3rem' }}>Événements à venir</h2>
                  </div>
                  <button onClick={() => navigateTo('evenements')} className="btn-outline">
                    Voir tous les événements <ArrowRight size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                  {HIMALAYA_EVENTS.map(ev => (
                    <div key={ev.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '14px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'relative', minHeight: '190px' }}>
                        <img 
                          src={ev.image} 
                          alt={ev.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'; }}
                        />
                        <div style={{
                          position: 'absolute', top: '12px', left: '12px',
                          background: 'rgba(7,11,10,0.9)', border: '1px solid var(--gold)',
                          borderRadius: '8px', padding: '6px 10px', textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)', lineHeight: 1 }}>{ev.day}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase' }}>{ev.month}</div>
                        </div>
                      </div>
                      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '0.73rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase' }}>
                            {ev.dateRange} • {ev.location}
                          </span>
                          <h3 className="serif-title" style={{ fontSize: '1.35rem', margin: '6px 0 8px' }}>{ev.title}</h3>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{ev.description}</p>
                        </div>
                        <div style={{ marginTop: '14px' }}>
                          <button onClick={() => navigateTo('nous-joindre')} style={{ background: 'none', border: 'none', color: 'var(--gold-light)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            Planifier une rencontre sur place <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dernières actualités */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div className="badge-gold" style={{ marginBottom: '8px' }}>Vie d’Agence & Sommets</div>
                    <h2 className="serif-title" style={{ fontSize: '2.3rem' }}>Dernières actualités</h2>
                  </div>
                  <button onClick={() => navigateTo('evenements')} className="btn-outline">
                    Voir plus d’actualités <ArrowRight size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
                  {HIMALAYA_NEWS.slice(0, 3).map(news => (
                    <div key={news.id} className="property-card">
                      <div className="property-img-wrap" style={{ height: '200px' }}>
                        <img 
                          src={news.image} 
                          alt={news.title}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'; }}
                        />
                        <span style={{
                          position: 'absolute', top: '12px', left: '12px',
                          background: 'rgba(7,11,10,0.85)', border: '1px solid var(--border-gold)',
                          padding: '4px 10px', borderRadius: '99px', fontSize: '0.72rem', color: 'var(--gold-light)'
                        }}>
                          {news.category}
                        </span>
                      </div>
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            Publié le {news.date}
                          </div>
                          <h3 className="serif-title" style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                            {news.title}
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {news.excerpt}
                          </p>
                        </div>
                        <a 
                          href={news.url} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 600 }}
                        >
                          Lire l’article complet <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6 : RECRUTEMENT & AFFILIATION (#conteneurCta : "Joignez-vous à une bannière immobilière qui déplace des montagnes!") */}
          <section style={{
            padding: '85px 0',
            background: 'linear-gradient(180deg, #0b1310 0%, #070b0a 100%)',
            borderTop: '1px solid var(--border-gold)'
          }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 44px' }}>
                <div className="badge-gold" style={{ marginBottom: '12px' }}>Carrière & Expansion</div>
                <h2 className="serif-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>
                  Joignez-vous à une bannière immobilière qui <span className="gold-gradient-text">déplace des montagnes!</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.75 }}>
                  Joignez-vous à Himalaya en devenant courtier ou affilié! Himalaya est un leader dans le domaine immobilier, que ce soit au Québec, au Canada ou ailleurs dans le monde. Gravissez de nouveaux sommets d’excellence en rejoignant une équipe dévouée, unie par un même désir d’offrir un service à la clientèle de qualité irréprochable.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
                <div 
                  className="specialty-card" 
                  style={{ height: '300px' }}
                  onClick={() => navigateTo('nous-joindre')}
                >
                  <img 
                    src="https://www.himalayacorp.com/gx/01/cta1.jpg" 
                    alt="Devenir courtier immobilier"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80'; }}
                  />
                  <div className="specialty-overlay">
                    <span className="badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>Courtiers OACIQ</span>
                    <h3 className="serif-title" style={{ fontSize: '2rem', color: '#fff', marginBottom: '6px' }}>
                      Devenir courtier immobilier Himalaya
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      Accédez à nos outils IA de prospection, notre réseau international et un accompagnement de direction de premier plan.
                    </p>
                    <span style={{ color: 'var(--gold-light)', fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      Soumettre ma candidature <ArrowRight size={15} />
                    </span>
                  </div>
                </div>

                <div 
                  className="specialty-card" 
                  style={{ height: '300px' }}
                  onClick={() => navigateTo('nous-joindre')}
                >
                  <img 
                    src="https://www.himalayacorp.com/gx/01/cta2.jpg" 
                    alt="Devenir affilié"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80'; }}
                  />
                  <div className="specialty-overlay">
                    <span className="badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>Expansion Internationale</span>
                    <h3 className="serif-title" style={{ fontSize: '2rem', color: '#fff', marginBottom: '6px' }}>
                      Devenir une agence affiliée
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      Ralliez votre agence sous la bannière Immobilier Himalaya et profitez de nos synergies commerciales et internationales.
                    </p>
                    <span style={{ color: 'var(--gold-light)', fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      Discuter avec la Direction <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          PAGE 2 : NOS PROPRIÉTÉS (/fr/proprietes.html)
         ===================================================================== */}
      {activePage === 'proprietes' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div style={{ marginBottom: '32px' }}>
              <div className="badge-gold" style={{ marginBottom: '10px' }}>Catalogue Officiel Synchronisé</div>
              <h1 className="serif-title" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>Nos propriétés à vendre ou à louer</h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '880px', fontSize: '0.96rem' }}>
                Immobilier Himalaya propose une vaste sélection de propriétés commerciales, résidentielles, récréotouristiques ou industrielles, à vendre ou à louer. Consultez nos mandats actifs ou activez une alerte d’acquéreur qualifié.
              </p>
            </div>

            {/* Barre de filtres complète */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '12px'
              }}>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Rechercher (Ville, titre, MLS...)"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />

                <select className="form-control" value={filtrePropriete} onChange={e => setFiltrePropriete(e.target.value)}>
                  <option value="all">Toutes les catégories</option>
                  <option value="commercial">Commercial & Industriel</option>
                  <option value="pourvoirie">Pourvoiries, Campings & Auberges</option>
                  <option value="terrain">Terrains de développement</option>
                  <option value="residentiel">Résidentiel & Prestige</option>
                </select>

                <select className="form-control" value={rechercheBut} onChange={e => setRechercheBut(e.target.value)}>
                  <option value="all">Vente & Location</option>
                  <option value="Vente">À vendre uniquement</option>
                  <option value="Location">À louer uniquement</option>
                </select>

                <select className="form-control" value={filtreRegion} onChange={e => setFiltreRegion(e.target.value)}>
                  <option value="all">Toutes les régions</option>
                  {availableRegions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <select className="form-control" value={filtreCourtier} onChange={e => setFiltreCourtier(e.target.value)}>
                  <option value="all">Tous les courtiers</option>
                  {INITIAL_HIMALAYA_BROKERS.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>

                <select className="form-control" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="price_desc">Prix : Élevé → Bas</option>
                  <option value="price_asc">Prix : Bas → Élevé</option>
                  <option value="title_asc">Ordre alphabétique</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  Affichage de <strong style={{ color: 'var(--gold-light)' }}>{filteredProperties.length}</strong> propriété(s) sur {liveDealsData.length} mandats actifs
                  {filtreCourtier !== 'all' && (
                    <span> • Courtier : <strong>{filtreCourtier}</strong></span>
                  )}
                </div>
                {(filtrePropriete !== 'all' || rechercheBut !== 'all' || filtreRegion !== 'all' || filtreCourtier !== 'all' || searchKeyword) && (
                  <button 
                    onClick={() => {
                      setFiltrePropriete('all');
                      setRechercheBut('all');
                      setFiltreRegion('all');
                      setFiltreCourtier('all');
                      setSearchKeyword('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Réinitialiser tous les filtres
                  </button>
                )}
              </div>
            </div>

            {/* Grille des propriétés */}
            {filteredProperties.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--bg-card)',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)'
              }}>
                <h3 className="serif-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
                  Aucun mandat public ne correspond à ces critères précis
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 20px' }}>
                  Plusieurs de nos propriétés (notamment les pourvoiries, campings et hôtels) sont vendues en mode confidentiel (Pocket Listings / Off-Market).
                </p>
                <button onClick={() => setNdaModalDeal(null)} className="btn-gold">
                  <Lock size={16} /> Demander l’accès aux dossiers hors-marché (NDA)
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {filteredProperties.map(deal => (
                  <PropertyCard 
                    key={deal.id} 
                    deal={deal} 
                    onSelect={() => setSelectedDeal(deal)}
                    onOpenNDA={() => setNdaModalDeal(deal)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 3 : À PROPOS (/fr/a-propos.html)
         ===================================================================== */}
      {activePage === 'a-propos' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="badge-gold" style={{ marginBottom: '12px' }}>À Propos d’Immobilier Himalaya</div>
              <h1 className="serif-title" style={{ fontSize: '3rem', lineHeight: 1.15, marginBottom: '22px' }}>
                Une vision sans frontières du courtage immobilier <span className="gold-gradient-text">commercial, récréotouristique et résidentiel</span>
              </h1>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '36px'
              }}>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '18px' }}>
                  Sous la présidence de <strong>Roger Rhéaume</strong> et la vice-présidence de <strong>Geniev Mondoux</strong>, accompagnés à la direction d’agence par <strong>Mike Ainajian</strong>, <strong>Immobilier Himalaya Real Estate Corp.</strong> s’est imposée comme une agence immobilière de référence pour les transactions complexes, les actifs commerciaux, les domaines de villégiature et les investissements internationaux.
                </p>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  Réputée pour son intégrité, sa rigueur déontologique OACIQ et la force de son réseau d’investisseurs au Québec, en France, en Asie et dans les Caraïbes, notre équipe accompagne les vendeurs et acquéreurs à chaque étape : de l’évaluation financière confidentielle jusqu’à la clôture notariée.
                </p>
              </div>

              {/* Chiffres clés */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '18px',
                marginBottom: '44px'
              }}>
                {[
                  { num: `${liveDealsData.length}+`, label: 'Mandats Actifs Publics' },
                  { num: '1 115+', label: 'Actifs Récréotouristiques Qualifiés' },
                  { num: '5 Langues', label: 'Français, Anglais, Espagnol, Arabe, Mandarin' },
                  { num: `${INITIAL_HIMALAYA_BROKERS.length}`, label: 'Courtiers & Directeurs Dédiés' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '22px',
                    textAlign: 'center'
                  }}>
                    <div className="serif-title gold-gradient-text" style={{ fontSize: '2.4rem', fontWeight: 700 }}>
                      {stat.num}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Équipe de Direction */}
              <h2 className="serif-title" style={{ fontSize: '2.2rem', marginBottom: '20px' }}>
                La Direction d’Immobilier Himalaya
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
                {INITIAL_HIMALAYA_BROKERS.filter(b => b.category === 'direction').map(dir => (
                  <div key={dir.id} className="broker-card" style={{ padding: '22px', textAlign: 'center' }}>
                    <img 
                      src={dir.photo} 
                      alt={dir.name}
                      style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', border: '2px solid var(--gold)' }}
                    />
                    <span className="badge-gold" style={{ margin: '0 auto 8px' }}>{dir.shortTitle}</span>
                    <h3 className="serif-title" style={{ fontSize: '1.5rem' }}>{dir.name}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>{dir.bio}</p>
                    <a href={`mailto:${dir.email}`} className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                      <Mail size={14} /> {dir.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 4 : AGENCES (/fr/agences-immobilieres.html)
         ===================================================================== */}
      {activePage === 'agences' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div style={{ marginBottom: '36px' }}>
              <div className="badge-gold" style={{ marginBottom: '10px' }}>Présence Locale & Internationale</div>
              <h1 className="serif-title" style={{ fontSize: '2.8rem', marginBottom: '10px' }}>Nos agences et pôles d’affaires</h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '800px' }}>
                Du siège social de Montréal jusqu’aux Laurentides, Québec, Paris et la République Dominicaine, nos bureaux assurent un pont stratégique pour vos transactions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '26px' }}>
              {HIMALAYA_AGENCIES.map(ag => (
                <div key={ag.id} className="property-card">
                  <div className="property-img-wrap" style={{ height: '210px' }}>
                    <img src={ag.image} alt={ag.name} />
                    <span className="badge-gold" style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(7,11,10,0.88)' }}>
                      {ag.badge}
                    </span>
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {ag.city} • {ag.country}
                      </div>
                      <h3 className="serif-title" style={{ fontSize: '1.5rem', margin: '6px 0 10px' }}>{ag.name}</h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        <MapPin size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--gold)' }} />
                        {ag.address}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                        {ag.specialties.map((s, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.74rem', padding: '4px 10px', borderRadius: '6px',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)'
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                      <a href={`tel:${ag.phone}`} className="btn-gold" style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem' }}>
                        <Phone size={14} /> {ag.phone}
                      </a>
                      <a href={`mailto:${ag.email}`} className="btn-outline" style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem' }}>
                        <Mail size={14} /> Courriel
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
          PAGE 5 : COURTIERS (/fr/courtiers-immobiliers.html)
         ===================================================================== */}
      {activePage === 'courtiers' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="badge-gold" style={{ marginBottom: '10px' }}>Équipe Multidisciplinaire & Multilingue</div>
                <h1 className="serif-title" style={{ fontSize: '2.8rem', marginBottom: '8px' }}>Courtiers et équipe</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '720px' }}>
                  Des courtiers immobiliers d’expérience à votre service. Chez Immobilier Himalaya, notre expérience et notre expertise sont vos atouts!
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input 
                  type="text"
                  className="form-control"
                  style={{ width: '240px' }}
                  placeholder="Chercher un courtier..."
                  value={brokerSearch}
                  onChange={e => setBrokerSearch(e.target.value)}
                />
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'direction', label: 'Direction' },
                  { id: 'commercial', label: 'Commercial & Villégiature' },
                  { id: 'residentiel', label: 'Résidentiel' },
                  { id: 'international', label: 'International' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setBrokerCategoryFilter(cat.id)}
                    className={brokerCategoryFilter === cat.id ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="brokers-grid">
              {filteredBrokers.map(broker => {
                const brokerDealsCount = liveDealsData.filter(d => 
                  (d.assigned_broker || '').toLowerCase().includes(broker.name.split(' ')[0].toLowerCase())
                ).length;

                return (
                  <div key={broker.id} className="broker-card">
                    <div style={{ position: 'relative', height: '270px', background: '#070b0a', overflow: 'hidden' }}>
                      <img 
                        src={broker.photo} 
                        alt={broker.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 55%, rgba(14,21,19,0.98) 100%)'
                      }} />
                      <span className="badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(7,11,10,0.85)' }}>
                        {broker.shortTitle}
                      </span>
                    </div>

                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 className="serif-title" style={{ fontSize: '1.45rem', marginBottom: '4px' }}>{broker.name}</h3>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gold)', marginBottom: '10px' }}>
                          {broker.city} • {broker.markets?.join(', ')}
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
                          {broker.bio}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a href={`tel:${broker.phone}`} className="btn-gold" style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}>
                            <Phone size={13} /> {broker.phone}
                          </a>
                          <a href={`mailto:${broker.email}`} className="btn-outline" style={{ padding: '8px 12px', fontSize: '0.8rem' }} title={broker.email}>
                            <Mail size={14} />
                          </a>
                        </div>
                        {brokerDealsCount > 0 && (
                          <button 
                            onClick={() => navigateTo('proprietes', { filtreCourtier: broker.name })}
                            style={{
                              background: 'rgba(200,164,93,0.1)',
                              border: '1px solid var(--border-gold)',
                              color: 'var(--gold-light)',
                              padding: '7px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Voir ses {brokerDealsCount} mandat(s) actif(s) →
                          </button>
                        )}
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
          PAGE 6 : ÉVÉNEMENTS & ACTUALITÉS (/fr/evenements.html & /fr/actualites.html)
         ===================================================================== */}
      {activePage === 'evenements' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div className="badge-gold" style={{ marginBottom: '10px' }}>Agenda & Presse</div>
            <h1 className="serif-title" style={{ fontSize: '2.8rem', marginBottom: '32px' }}>Événements et Actualités Himalaya</h1>

            <h2 className="serif-title" style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--gold-light)' }}>
              Événements internationaux à venir
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '56px' }}>
              {HIMALAYA_EVENTS.map(ev => (
                <div key={ev.id} className="property-card" style={{ padding: '24px' }}>
                  <span className="badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '12px' }}>{ev.dateRange}</span>
                  <h3 className="serif-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{ev.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gold)', marginBottom: '12px' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} /> {ev.location}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>{ev.description}</p>
                  <a href={ev.url} target="_blank" rel="noreferrer" className="btn-outline" style={{ alignSelf: 'flex-start' }}>
                    Détails officiels <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>

            <h2 className="serif-title" style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--gold-light)' }}>
              Toutes nos actualités récentes
            </h2>
            <div className="properties-grid">
              {HIMALAYA_NEWS.map(news => (
                <div key={news.id} className="property-card">
                  <div className="property-img-wrap" style={{ height: '210px' }}>
                    <img 
                      src={news.image} 
                      alt={news.title}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'; }}
                    />
                  </div>
                  <div style={{ padding: '22px' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--gold)', marginBottom: '6px' }}>{news.date} • {news.category}</div>
                    <h3 className="serif-title" style={{ fontSize: '1.35rem', marginBottom: '10px' }}>{news.title}</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{news.excerpt}</p>
                    <a href={news.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-light)', fontSize: '0.84rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      Voir sur himalayacorp.com <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 7 : BALADOS / PODCASTS (/fr/podcast.html)
         ===================================================================== */}
      {activePage === 'balados' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div style={{ maxWidth: '820px', marginBottom: '40px' }}>
              <div className="badge-gold" style={{ marginBottom: '10px' }}>Média & Stratégie Immobilière</div>
              <h1 className="serif-title" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>Balados Immobilier Himalaya</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
                Écoutez nos capsules stratégiques animées par la direction et les experts d’Immobilier Himalaya : tendances du marché commercial, acquisition de pourvoiries et campings, implantation de franchises et innovations technologiques.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {HIMALAYA_PODCASTS.map(pod => (
                <div key={pod.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '14px',
                  padding: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span className="badge-gold">{pod.episode}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Durée : {pod.duration}</span>
                    </div>
                    <h3 className="serif-title" style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{pod.title}</h3>
                    <div style={{ fontSize: '0.84rem', color: 'var(--gold)', marginBottom: '10px' }}>{pod.hosts}</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{pod.description}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {pod.topics.map((t, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setNdaModalDeal(null)} className="btn-gold">
                    <Play size={16} /> Écouter / Recevoir la synthèse
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 8 : NOUS JOINDRE (/fr/nous-joindre.html)
         ===================================================================== */}
      {activePage === 'nous-joindre' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px' }}>
              <div>
                <div className="badge-gold" style={{ marginBottom: '12px' }}>Contact Direct & Confidentiel</div>
                <h1 className="serif-title" style={{ fontSize: '2.8rem', marginBottom: '14px' }}>Nous joindre</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.7 }}>
                  Que vous souhaitiez obtenir une évaluation confidentielle de votre propriété commerciale, pourvoirie ou terrain de camping, acquérir un actif au Québec ou à l’international, ou rejoindre notre bannière, notre direction vous répondra dans les plus brefs délais.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>Siège Social Montréal</div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', marginTop: '4px' }}>Immobilier Himalaya Real Estate Corp.</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>3905, boul. Henri-Bourassa Ouest, Montréal (QC) H4R 1Z2</div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.9rem' }}>
                      <a href="tel:5148984898" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>📞 514-898-4898</a>
                      <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>✉️ info@himalayacorp.com</a>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>Présidence & Direction</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
                      <strong>Roger Rhéaume</strong> (Président, DA) : 514-585-2605 • r.rheaume@himalayacorp.com<br />
                      <strong>Geniev Mondoux</strong> (Vice-Présidente, DA) : 514-898-4898 • g.mondoux@himalayacorp.com<br />
                      <strong>Mike Ainajian</strong> (Directeur d’Agence, DA) : 514-898-4898 • m.ainajian@himalayacorp.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire de contact connecté au pipeline */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '16px',
                padding: '32px'
              }}>
                {contactSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                    <CheckCircle2 size={48} color="#70e000" style={{ margin: '0 auto 16px' }} />
                    <h3 className="serif-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Message transmis avec succès</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                      Votre demande a été enregistrée et acheminée directement à la direction d’Immobilier Himalaya.
                    </p>
                    <button onClick={() => setContactSubmitted(false)} className="btn-gold">Envoyer un autre message</button>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setContactSubmitted(true); }}>
                    <h3 className="serif-title" style={{ fontSize: '1.75rem', marginBottom: '18px' }}>
                      Envoyer une demande à l’agence
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Objet de votre demande *</label>
                        <select className="form-control">
                          <option>Vendre une propriété commerciale / pourvoirie / camping (Évaluation)</option>
                          <option>Acquérir une propriété ou accéder aux Pocket Listings</option>
                          <option>Implanter une franchise au Québec / Canada</option>
                          <option>Devenir courtier immobilier chez Himalaya</option>
                          <option>Devenir une agence affiliée Himalaya</option>
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Nom complet *</label>
                          <input required type="text" className="form-control" placeholder="Votre nom" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Téléphone *</label>
                          <input required type="tel" className="form-control" placeholder="(514) 000-0000" />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Adresse courriel *</label>
                        <input required type="email" className="form-control" placeholder="votre@courriel.com" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Votre message *</label>
                        <textarea required rows={4} className="form-control" placeholder="Précisez vos besoins ou le numéro MLS/Centris concerné..." />
                      </div>
                      <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '6px' }}>
                        Envoyer la demande à l’équipe Himalaya
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
          PAGE 9 : ZONE EXCLUSIVE - ÉQUIPE & LOGICIEL HIMALAYA PROSPECTION
          (/fr/zone-exclusive-equipe.html — Ton arme secrète pour Roger & Geniev !)
         ===================================================================== */}
      {activePage === 'zone-equipe' && (
        <main style={{ flex: 1, padding: '50px 0 80px' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(145deg, #101a16 0%, #070b0a 100%)',
              border: '1px solid var(--gold)',
              borderRadius: '18px',
              padding: '40px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <div className="badge-gold" style={{ marginBottom: '12px' }}>
                    <Lock size={13} /> PORTAIL INTERNE — DIRECTION & COURTIERS HIMALAYA
                  </div>
                  <h1 className="serif-title" style={{ fontSize: '2.8rem', lineHeight: 1.15 }}>
                    Zone Exclusive - Équipe & <span className="gold-gradient-text">Himalaya Prospection CRM</span>
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '760px', marginTop: '8px' }}>
                    Connexion directe entre la vitrine publique <strong>himalayacorp.com</strong> et le logiciel propriétaire <strong>Himalaya Prospection & CRM Pipeline</strong> (évaluation IA, génération de contrats OACIQ, NDA remplissables et base de 1 115+ actifs).
                  </p>
                </div>

                <a 
                  href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5176' : 'https://himalaya-prospection.vercel.app'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-gold"
                  style={{ padding: '14px 24px', fontSize: '0.95rem' }}
                >
                  <Sparkles size={17} /> Ouvrir le Logiciel Himalaya Prospection (CRM & IA) <ExternalLink size={15} />
                </a>
              </div>

              {/* Architecture unifiée pour la démo avec Roger & Geniev */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                {[
                  {
                    title: '1. Synchronisation Automatique des Mandats',
                    desc: `Les ${liveDealsData.length} mandats actifs des courtiers Himalaya sont synchronisés automatiquement entre le site public et le CRM interne, sans double saisie.`
                  },
                  {
                    title: '2. Capture & Qualification NDA en Temps Réel',
                    desc: 'Lorsqu’un investisseur signe un NDA sur le site web, sa fiche acquéreur, sa capacité financière et son PDF NDA officiel sont créés dans le CRM et assignés au courtier inscripteur.'
                  },
                  {
                    title: '3. Isolation Déontologique OACIQ',
                    desc: 'Chaque courtier protège ses contacts et ses rétributions (splits), tandis que la Direction (Roger Rhéaume, Geniev Mondoux, Mike Ainajian) dispose d’une vue de supervision globale.'
                  },
                  {
                    title: '4. Zéro Frais d’Agence Web Externe',
                    desc: 'Autonomie technologique complète : ajout de courtiers, balados, événements, pocket listings et pages d’atterrissage internationales en quelques secondes.'
                  }
                ].map((card, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '22px'
                  }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '8px' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(200, 164, 93, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>Accès rapide aux ressources internes des courtiers</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Listes de vérification Pourvoiries & Auberges (PDF remplissables), Modèle NDA officiel Himalaya, Pipeline Kanban et Jumelage IA.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setNdaModalDeal(null)} className="btn-outline">
                    Tester le portail NDA Acheteur
                  </button>
                  <button onClick={() => navigateTo('proprietes')} className="btn-gold">
                    Voir le catalogue public
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PIED DE PAGE OFFICIEL (#piedPage)
         ===================================================================== */}
      <footer style={{
        background: '#030504',
        borderTop: '1px solid var(--border-gold)',
        padding: '60px 0 36px',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '44px'
          }}>
            <div>
              <img 
                src="https://www.himalayacorp.com/gx/himalaya-immobilier-logo.svg" 
                alt="Himalaya" 
                style={{ height: '50px', marginBottom: '14px' }}
                onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/himalaya-immobilier-logo.png'; }}
              />
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Immobilier Himalaya Real Estate Corp. est l’agence immobilière qui saura trouver la propriété commerciale, résidentielle, récréotouristique ou internationale dont vous avez besoin au bon prix.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '14px' }}>
                Navigation Rapide
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <li><button onClick={() => navigateTo('proprietes')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Nos Propriétés ({liveDealsData.length})</button></li>
                <li><button onClick={() => navigateTo('courtiers')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Courtiers & Équipe ({INITIAL_HIMALAYA_BROKERS.length})</button></li>
                <li><button onClick={() => navigateTo('agences')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Nos Agences</button></li>
                <li><button onClick={() => navigateTo('evenements')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Événements & Actualités</button></li>
                <li><button onClick={() => navigateTo('balados')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Balados / Podcasts</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '14px' }}>
                Spécialités
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <li><button onClick={() => navigateTo('proprietes', { filtrePropriete: 'commercial' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Immobilier Commercial & Industriel</button></li>
                <li><button onClick={() => navigateTo('proprietes', { filtrePropriete: 'pourvoirie' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Pourvoiries, Campings & Auberges</button></li>
                <li><button onClick={() => navigateTo('proprietes', { filtrePropriete: 'terrain' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Terrains de Développement</button></li>
                <li><button onClick={() => navigateTo('proprietes', { filtrePropriete: 'residentiel' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Résidentiel Clients Privilégiés</button></li>
                <li><button onClick={() => navigateTo('agences')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>International & Franchises</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '14px' }}>
                Accès Équipe & Réseaux
              </h4>
              <button 
                onClick={() => navigateTo('zone-equipe')} 
                className="btn-gold" 
                style={{ width: '100%', marginBottom: '14px', fontSize: '0.82rem' }}
              >
                <Lock size={14} /> Zone exclusive - Équipe
              </button>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <a href="https://www.facebook.com/himalayarealestate/" target="_blank" rel="noreferrer">Facebook</a>
                <span>•</span>
                <a href="https://www.linkedin.com/company/immobilier-himalaya-real-estate-corp." target="_blank" rel="noreferrer">LinkedIn</a>
                <span>•</span>
                <a href="https://www.instagram.com/himalayaimmobilier/" target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              © 2026 Himalaya Immobilier / Real Estate Corp. Tous droits réservés.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Conditions d’utilisation</span>
              <span>|</span>
              <span>Politique de confidentialité</span>
              <span>|</span>
              <span style={{ color: 'var(--gold-light)' }}>Architecture interne propulsée par Himalaya Prospection IA</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALES */}
      {selectedDeal && (
        <PropertyDetailModal 
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onOpenNDA={deal => setNdaModalDeal(deal)}
          onFilterByBroker={brokerName => navigateTo('proprietes', { filtreCourtier: brokerName })}
        />
      )}

      {ndaModalDeal !== undefined && (
        <BuyerNDAModal 
          deal={ndaModalDeal}
          onClose={() => setNdaModalDeal(undefined)}
        />
      )}
    </div>
  );
}

/* Sous-composant Carte Propriété */
function PropertyCard({ deal, onSelect, onOpenNDA }) {
  const broker = (deal.brokers_details && deal.brokers_details[0]) || {
    name: deal.assigned_broker || 'Équipe Himalaya',
    photo: 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'
  };

  return (
    <div className="property-card">
      <div className="property-img-wrap" onClick={onSelect} style={{ cursor: 'pointer' }}>
        <img 
          src={deal.main_photo} 
          alt={deal.title}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'; }}
        />
        <div style={{
          position: 'absolute', top: '12px', left: '12px', right: '12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'
        }}>
          <span className="badge-gold" style={{ background: 'rgba(7,11,10,0.88)', backdropFilter: 'blur(6px)' }}>
            {deal.transaction_type} • {deal.category}
          </span>
          <span style={{
            background: 'rgba(7,11,10,0.82)', padding: '4px 9px', borderRadius: '6px',
            fontSize: '0.72rem', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)'
          }}>
            MLS {deal.mls_number}
          </span>
        </div>

        <div style={{
          position: 'absolute', bottom: '12px', left: '12px',
          background: 'rgba(7,11,10,0.9)', border: '1px solid var(--border-gold)',
          padding: '6px 12px', borderRadius: '8px', fontWeight: 700, color: 'var(--gold-light)',
          fontSize: '1.05rem'
        }}>
          {deal.price_raw}
        </div>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 
            className="serif-title" 
            onClick={onSelect}
            style={{ fontSize: '1.4rem', marginBottom: '6px', cursor: 'pointer' }}
          >
            {deal.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <MapPin size={14} color="var(--gold)" />
            <span>{deal.city} ({deal.region})</span>
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '18px'
          }}>
            {deal.description}
          </p>
        </div>

        <div>
          {/* Courtier + Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <img 
                src={broker.photo} 
                alt={broker.name}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gold)' }}
                onError={e => { e.target.src = 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'; }}
              />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Courtier inscripteur</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{broker.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={onOpenNDA} 
                className="btn-outline" 
                style={{ padding: '7px 10px', fontSize: '0.76rem' }}
                title="Signer NDA & Demander États Financiers"
              >
                <Lock size={13} /> NDA
              </button>
              <button 
                onClick={onSelect} 
                className="btn-gold" 
                style={{ padding: '7px 13px', fontSize: '0.78rem' }}
              >
                Fiche <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
