import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Phone, Mail, Globe, Sparkles, 
  ArrowRight, Lock, ExternalLink, ChevronRight, 
  Play, CheckCircle2, Menu, X
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
  const [activePage, setActivePage] = useState('home');
  const [lang, setLang] = useState('FR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtres de recherche
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtrePropriete, setFiltrePropriete] = useState('all');
  const [rechercheBut, setRechercheBut] = useState('all');
  const [filtreRegion, setFiltreRegion] = useState('all');
  const [filtreCourtier, setFiltreCourtier] = useState('all');
  const [sortBy, setSortBy] = useState('price_desc');

  // Filtres courtiers
  const [brokerCategoryFilter, setBrokerCategoryFilter] = useState('all');
  const [brokerSearch, setBrokerSearch] = useState('');

  // Modales
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [ndaModalDeal, setNdaModalDeal] = useState(undefined);
  const [contactSubmitted, setContactSubmitted] = useState(false);

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

  const filteredBrokers = useMemo(() => {
    return INITIAL_HIMALAYA_BROKERS.filter(b => {
      if (brokerCategoryFilter !== 'all' && b.category !== brokerCategoryFilter) return false;
      if (brokerSearch.trim()) {
        const q = brokerSearch.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.title.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [brokerCategoryFilter, brokerSearch]);

  const navigateTo = (page, options = {}) => {
    if (options.filtrePropriete !== undefined) setFiltrePropriete(options.filtrePropriete);
    if (options.filtreCourtier !== undefined) setFiltreCourtier(options.filtreCourtier);
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER PRINCIPAL ÉPURÉ (Logo seul à gauche, sans texte qui déborde) */}
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
                  Accueil
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'proprietes' ? 'active' : ''}`} onClick={() => navigateTo('proprietes')}>
                  Propriétés ({liveDealsData.length})
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'courtiers' ? 'active' : ''}`} onClick={() => navigateTo('courtiers')}>
                  Courtiers
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'agences' ? 'active' : ''}`} onClick={() => navigateTo('agences')}>
                  Agences
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'a-propos' ? 'active' : ''}`} onClick={() => navigateTo('a-propos')}>
                  À propos
                </button>
              </li>
              <li>
                <button className={`nav-btn ${activePage === 'evenements' ? 'active' : ''}`} onClick={() => navigateTo('evenements')}>
                  Actualités
                </button>
              </li>
            </ul>
          </nav>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button 
              onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')}
              className="btn-outline"
              style={{ padding: '7px 11px', fontSize: '0.78rem' }}
            >
              {lang}
            </button>
            <button 
              onClick={() => navigateTo('zone-equipe')}
              className="btn-outline"
              style={{ padding: '7px 12px', fontSize: '0.8rem' }}
            >
              <Lock size={13} /> Équipe
            </button>
            <button 
              className="btn-gold" 
              style={{ padding: '8px 16px', fontSize: '0.84rem' }} 
              onClick={() => navigateTo('nous-joindre')}
            >
              Nous joindre
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
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Menu</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{
            background: '#080d0b',
            borderBottom: '1px solid var(--border-gold)',
            padding: '16px 24px'
          }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'proprietes', label: `Propriétés (${liveDealsData.length})` },
                { id: 'courtiers', label: 'Courtiers' },
                { id: 'agences', label: 'Agences' },
                { id: 'a-propos', label: 'À propos' },
                { id: 'evenements', label: 'Actualités' },
                { id: 'balados', label: 'Balados' },
                { id: 'nous-joindre', label: 'Nous joindre' },
                { id: 'zone-equipe', label: 'Accès Équipe' }
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
                    fontSize: '0.86rem',
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
          PAGE 1 : ACCUEIL ÉPURÉ
         ===================================================================== */}
      {activePage === 'home' && (
        <main style={{ flex: 1 }}>
          {/* HERO VIDEO */}
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
                Immobilier commercial, villégiature <span className="gold-gradient-text">&amp; prestige</span>
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', maxWidth: '620px', margin: '0 auto' }}>
                Acquisitions commerciales, pourvoiries, campings, domaines privés et investissements internationaux.
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
                    placeholder="Ville, mot-clé ou No Centris/MLS..."
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                  />

                  <select 
                    className="form-control"
                    value={filtrePropriete}
                    onChange={e => setFiltrePropriete(e.target.value)}
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="commercial">Commercial &amp; Industriel</option>
                    <option value="pourvoirie">Pourvoirie, Camping &amp; Auberge</option>
                    <option value="terrain">Terrain &amp; Développement</option>
                    <option value="residentiel">Résidentiel &amp; Prestige</option>
                  </select>

                  <select 
                    className="form-control"
                    value={filtreRegion}
                    onChange={e => setFiltreRegion(e.target.value)}
                  >
                    <option value="all">Toutes les régions</option>
                    {availableRegions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <button type="submit" className="btn-gold" style={{ height: '42px', padding: '0 24px' }}>
                    <Search size={16} /> Rechercher
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* SPÉCIALITÉS (4 cartes visuelles épurées) */}
          <section style={{ padding: '64px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Nos pôles d’expertise</h2>
                <button onClick={() => navigateTo('proprietes', { filtrePropriete: 'all' })} className="btn-outline">
                  Toutes les propriétés ({liveDealsData.length}) <ArrowRight size={15} />
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
                        Explorer <ChevronRight size={15} />
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
                <div>
                  <h2 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Propriétés à la une</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    onSelect={() => setSelectedDeal(deal)}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
                <button onClick={() => navigateTo('proprietes')} className="btn-gold">
                  Voir les {liveDealsData.length} propriétés <ArrowRight size={16} />
                </button>
                <button onClick={() => setNdaModalDeal(null)} className="btn-outline">
                  <Lock size={15} /> Dossiers hors-marché (NDA)
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
                  { num: `${liveDealsData.length}`, label: 'Mandats actifs publics' },
                  { num: '1 115+', label: 'Dossiers récréotouristiques qualifiés' },
                  { num: `${INITIAL_HIMALAYA_BROKERS.length}`, label: 'Courtiers & directeurs dédiés' },
                  { num: '5 bureaux', label: 'Montréal, St-Sauveur, Québec, Paris, Caraïbes' }
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
                <div style={{ maxWidth: '680px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                    Une équipe d’expérience tournée vers vos résultats
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                    Sous la direction de Roger Rhéaume, Geniev Mondoux et Mike Ainajian, nos courtiers vous accompagnent en 5 langues pour l’achat ou la vente d’actifs commerciaux, récréotouristiques et résidentiels.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => navigateTo('courtiers')} className="btn-gold">
                    Nos courtiers <ArrowRight size={15} />
                  </button>
                  <button onClick={() => navigateTo('nous-joindre')} className="btn-outline">
                    Nous joindre
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          PAGE 2 : NOS PROPRIÉTÉS
         ===================================================================== */}
      {activePage === 'proprietes' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '2.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Nos propriétés</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
                  {filteredProperties.length} propriété(s) affichée(s) sur {liveDealsData.length} mandats actifs
                </p>
              </div>
              <button onClick={() => setNdaModalDeal(null)} className="btn-outline">
                <Lock size={14} /> Accès hors-marché (NDA)
              </button>
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
                  placeholder="Ville, titre, MLS..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />

                <select className="form-control" value={filtrePropriete} onChange={e => setFiltrePropriete(e.target.value)}>
                  <option value="all">Toutes catégories</option>
                  <option value="commercial">Commercial &amp; Industriel</option>
                  <option value="pourvoirie">Pourvoiries &amp; Campings</option>
                  <option value="terrain">Terrains</option>
                  <option value="residentiel">Résidentiel</option>
                </select>

                <select className="form-control" value={rechercheBut} onChange={e => setRechercheBut(e.target.value)}>
                  <option value="all">Vente &amp; Location</option>
                  <option value="Vente">À vendre</option>
                  <option value="Location">À louer</option>
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
                  <option value="title_asc">Ordre A → Z</option>
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
                    Réinitialiser les filtres
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
                  Aucun mandat public pour ces critères
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 18px', fontSize: '0.9rem' }}>
                  Plusieurs pourvoiries, campings et immeubles commerciaux sont disponibles en mode confidentiel (hors-marché).
                </p>
                <button onClick={() => setNdaModalDeal(null)} className="btn-gold">
                  <Lock size={15} /> Accéder aux dossiers hors-marché
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {filteredProperties.map(deal => (
                  <PropertyCard 
                    key={deal.id} 
                    deal={deal} 
                    onSelect={() => setSelectedDeal(deal)}
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
                À propos d’Immobilier <span className="gold-gradient-text">Himalaya</span>
              </h1>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '28px',
                marginBottom: '36px'
              }}>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '14px' }}>
                  Sous la présidence de <strong>Roger Rhéaume</strong> et la vice-présidence de <strong>Geniev Mondoux</strong>, accompagnés à la direction d’agence par <strong>Mike Ainajian</strong>, <strong>Immobilier Himalaya Real Estate Corp.</strong> est une agence de référence pour les transactions commerciales, les domaines de villégiature et l’investissement international.
                </p>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Notre équipe accompagne les vendeurs et acquéreurs en 5 langues avec une rigueur déontologique OACIQ irréprochable, de l’évaluation confidentielle jusqu’à l’acte notarié.
                </p>
              </div>

              <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '18px' }}>
                Direction de l’agence
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {INITIAL_HIMALAYA_BROKERS.filter(b => b.category === 'direction').map(dir => (
                  <div key={dir.id} className="broker-card" style={{ padding: '22px', textAlign: 'center' }}>
                    <img 
                      src={dir.photo} 
                      alt={dir.name}
                      style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '2px solid var(--gold)' }}
                    />
                    <span className="badge-gold" style={{ margin: '0 auto 8px' }}>{dir.shortTitle}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>{dir.name}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{dir.city}</p>
                    <a href={`mailto:${dir.email}`} className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 14px', width: '100%' }}>
                      <Mail size={14} /> Contacter
                    </a>
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
              <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '6px' }}>Nos agences</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                Montréal, Saint-Sauveur, Québec, Paris et République Dominicaine.
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
                        <Mail size={13} /> Courriel
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
          PAGE 5 : COURTIERS (Cartes uniformes sans pavé de texte)
         ===================================================================== */}
      {activePage === 'courtiers' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '4px' }}>Courtiers et équipe</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {INITIAL_HIMALAYA_BROKERS.length} courtiers et directeurs à votre service
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input 
                  type="text"
                  className="form-control"
                  style={{ width: '210px' }}
                  placeholder="Chercher un courtier..."
                  value={brokerSearch}
                  onChange={e => setBrokerSearch(e.target.value)}
                />
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'direction', label: 'Direction' },
                  { id: 'commercial', label: 'Commercial' },
                  { id: 'residentiel', label: 'Résidentiel' },
                  { id: 'international', label: 'International' }
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
                const brokerDealsCount = liveDealsData.filter(d => 
                  (d.assigned_broker || '').toLowerCase().includes(broker.name.split(' ')[0].toLowerCase())
                ).length;

                return (
                  <div key={broker.id} className="broker-card">
                    <div style={{ position: 'relative', height: '250px', background: '#070b0a', overflow: 'hidden' }}>
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
                    </div>

                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>{broker.name}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {broker.city}
                        </div>
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
                            className="btn-outline"
                            style={{ width: '100%', padding: '7px 10px', fontSize: '0.78rem' }}
                          >
                            Voir ses {brokerDealsCount} mandat(s)
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
          PAGE 6 : ÉVÉNEMENTS & ACTUALITÉS
         ===================================================================== */}
      {activePage === 'evenements' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '28px' }}>Événements et actualités</h1>

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
                    Détails <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '18px' }}>
              Actualités récentes
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
                      Lire l’article <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 7 : BALADOS
         ===================================================================== */}
      {activePage === 'balados' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '6px' }}>Balados Himalaya</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                Capsules stratégiques sur l’immobilier commercial, la villégiature et l’investissement.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {HIMALAYA_PODCASTS.map(pod => (
                <div key={pod.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '22px',
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
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{pod.title}</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{pod.description}</p>
                  </div>
                  <button onClick={() => setNdaModalDeal(null)} className="btn-gold">
                    <Play size={15} /> Écouter
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          PAGE 8 : NOUS JOINDRE
         ===================================================================== */}
      {activePage === 'nous-joindre' && (
        <main style={{ flex: 1, padding: '44px 0 72px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '10px' }}>Nous joindre</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.94rem' }}>
                  Évaluation confidentielle, acquisition d’actifs ou candidature de courtier : notre direction vous répond rapidement.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>Siège Social Montréal</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '4px' }}>Immobilier Himalaya Real Estate Corp.</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>3905, boul. Henri-Bourassa Ouest, Montréal (QC) H4R 1Z2</div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                      <a href="tel:5148984898" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>(514) 898-4898</a>
                      <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>info@himalayacorp.com</a>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>Direction</div>
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
                padding: '28px'
              }}>
                {contactSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '32px 10px' }}>
                    <CheckCircle2 size={44} color="#70e000" style={{ margin: '0 auto 14px' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Message envoyé</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '18px', fontSize: '0.9rem' }}>
                      Votre demande a été transmise à la direction d’Immobilier Himalaya.
                    </p>
                    <button onClick={() => setContactSubmitted(false)} className="btn-gold">Nouveau message</button>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setContactSubmitted(true); }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
                      Envoyer un message
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <select className="form-control">
                        <option>Vendre une propriété (Évaluation confidentielle)</option>
                        <option>Acquérir une propriété / Dossiers hors-marché</option>
                        <option>Devenir courtier ou agence affiliée Himalaya</option>
                      </select>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input required type="text" className="form-control" placeholder="Nom complet *" />
                        <input required type="tel" className="form-control" placeholder="Téléphone *" />
                      </div>
                      <input required type="email" className="form-control" placeholder="Adresse courriel *" />
                      <textarea required rows={4} className="form-control" placeholder="Votre message..." />
                      <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                        Envoyer
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
          PAGE 9 : ZONE ÉQUIPE & LOGICIEL HIMALAYA PROSPECTION
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

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px'
              }}>
                {[
                  {
                    title: 'Synchronisation des Mandats',
                    desc: `${liveDealsData.length} mandats actifs synchronisés entre le site public et le CRM.`
                  },
                  {
                    title: 'Qualification NDA Automatisée',
                    desc: 'Signature électronique NDA et vérification de mise de fonds en ligne.'
                  },
                  {
                    title: 'Cloisonnement OACIQ',
                    desc: 'Protection des dossiers par courtier et supervision pour la Direction.'
                  }
                ].map((card, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '18px'
                  }}>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '6px' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
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
              <button onClick={() => navigateTo('proprietes')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Propriétés</button>
              <button onClick={() => navigateTo('courtiers')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Courtiers</button>
              <button onClick={() => navigateTo('agences')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Agences</button>
              <button onClick={() => navigateTo('nous-joindre')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Nous joindre</button>
              <button onClick={() => navigateTo('zone-equipe')} style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer', fontWeight: 600 }}>Accès Équipe</button>
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
            <div>© 2026 Immobilier Himalaya Real Estate Corp. Tous droits réservés.</div>
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

/* Carte Propriété épurée (sans pavé de texte, boutons sur 1 ligne) */
function PropertyCard({ deal, onSelect }) {
  const broker = (deal.brokers_details && deal.brokers_details[0]) || {
    name: deal.assigned_broker || 'Équipe Himalaya',
    photo: 'https://www.himalayacorp.com/gx/00/defaut_courtier.jpg'
  };

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
              {deal.city} ({deal.region})
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
            Voir la fiche <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
