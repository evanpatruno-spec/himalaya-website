import React, { Suspense, lazy } from 'react';
import { Lock, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { INITIAL_HIMALAYA_BROKERS } from '../data/brokersData';
import { tr } from '../data/translations';
import { CURRENCY_OPTIONS, getCurrencyDisclaimerText } from '../utils/currencyService';
import PropertyCard from './PropertyCard';

const PropertiesMapView = lazy(() => import('./PropertiesMapView'));

export default function PropertiesView({
  lang,
  t,
  liveDealsData,
  filteredProperties,
  searchKeyword,
  setSearchKeyword,
  filtrePropriete,
  setFiltrePropriete,
  rechercheBut,
  setRechercheBut,
  filtreBudget,
  setFiltreBudget,
  filtreRegion,
  setFiltreRegion,
  availableRegions,
  filtreCourtier,
  setFiltreCourtier,
  sortBy,
  setSortBy,
  propertiesViewMode,
  setPropertiesViewMode,
  currency,
  setCurrency,
  exchangeRates,
  openDealModal,
  setNdaModalDeal
}) {
  // #14 — N'afficher le filtre "Vendu" que si de vraies transactions vendues existent dans les données
  const hasRealSoldTransactions = (liveDealsData || []).some(d => d && d.status === 'Vendu');

  const statusTabs = [
    { id: 'all', label: tr(lang, 'Tous', 'All', 'Todos', '全部') },
    { id: 'Vente', label: t.properties.forSale },
    { id: 'Location', label: t.properties.forRent },
    ...(hasRealSoldTransactions
      ? [{ id: 'Vendu', label: tr(lang, 'Vendu', 'Sold', 'Vendido', '已售') }]
      : [])
  ];

  return (
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
            {/* Sélecteur de devises international (Idée #11 : CAD $ | EUR € | USD $ | CNY ¥ — Banque du Canada) */}
            <div style={{
              display: 'inline-flex',
              background: 'transparent',
              border: '1px solid rgba(200, 164, 93, 0.35)',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px'
            }}>
              {CURRENCY_OPTIONS.map(curr => (
                <button
                  key={curr.id}
                  type="button"
                  onClick={() => setCurrency(curr.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    background: currency === curr.id ? 'var(--gold)' : 'transparent',
                    color: currency === curr.id ? '#09090b' : 'var(--text-secondary)'
                  }}
                >
                  {curr.label}
                </button>
              ))}
            </div>

            {/* Filtres rapides de statut */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px'
            }}>
              {statusTabs.map(st => (
                <button
                  key={st.id}
                  onClick={() => setRechercheBut(st.id)}
                  style={{
                    padding: '6px 11px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: rechercheBut === st.id ? 'var(--gold)' : 'transparent',
                    color: rechercheBut === st.id ? '#09090b' : 'var(--text-secondary)'
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Bascule Grille | Carte */}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: propertiesViewMode === 'grid' ? 'var(--gold)' : 'transparent',
                  color: propertiesViewMode === 'grid' ? '#09090b' : 'var(--text-secondary)'
                }}
              >
                <LayoutGrid size={14} /> {t.properties.viewGrid}
              </button>
              <button
                onClick={() => setPropertiesViewMode('map')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
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

        {/* Barre de filtres épurée sans boîte lourde */}
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
              <option value="camping">{tr(lang, 'Camping', 'Campgrounds', 'Camping', '露营地')}</option>
              <option value="terrain">{t.hero.catLand}</option>
              <option value="residentiel">{t.hero.catResidential}</option>
            </select>

            <select className="form-control" value={rechercheBut} onChange={e => setRechercheBut(e.target.value)}>
              <option value="all">{t.properties.saleAndRent}</option>
              <option value="Vente">{t.properties.forSale}</option>
              <option value="Location">{t.properties.forRent}</option>
              {hasRealSoldTransactions && (
                <option value="Vendu">{tr(lang, 'Vendu (Réalisées)', 'Sold (Completed)', 'Vendido (Realizadas)', '已售 (成交档案)')}</option>
              )}
            </select>

            <select className="form-control" value={filtreBudget} onChange={e => setFiltreBudget(e.target.value)}>
              <option value="all">{tr(lang, 'Tous les budgets', 'All Budgets', 'Todos los presupuestos', '全部预算范围')}</option>
              <option value="under500k">{tr(lang, 'Moins de 500 000 $', 'Under $500,000', 'Menos de 500 000 $', '50 万加元以下')}</option>
              <option value="500k_1500k">{tr(lang, '500 000 $ – 1,5 M$', '$500,000 – $1.5M', '500 000 $ – 1,5 M$', '50 万 – 150 万加元')}</option>
              <option value="1500k_5000k">{tr(lang, '1,5 M$ – 5 M$', '$1.5M – $5M', '1,5 M$ – 5 M$', '150 万 – 500 万加元')}</option>
              <option value="over5000k">{tr(lang, '5 M$ et + / Sur demande', '$5M+ / Upon Request', '5 M$ y + / Bajo solicitud', '500 万加元以上 / 面议')}</option>
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

          {currency !== 'CAD' && (
            <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--gold-light)' }}>
              {getCurrencyDisclaimerText(currency, lang, exchangeRates)}
            </div>
          )}

          {(filtrePropriete !== 'all' || rechercheBut !== 'all' || filtreBudget !== 'all' || filtreRegion !== 'all' || filtreCourtier !== 'all' || searchKeyword) && (
            <div style={{ marginTop: '12px', textAlign: 'right' }}>
              <button
                onClick={() => {
                  setFiltrePropriete('all');
                  setRechercheBut('all');
                  setFiltreBudget('all');
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
                currency={currency}
                rates={exchangeRates}
                onSelect={() => openDealModal(deal)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
