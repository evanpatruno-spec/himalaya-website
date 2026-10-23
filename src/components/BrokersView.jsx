import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { INITIAL_HIMALAYA_BROKERS } from '../data/brokersData';
import { tr, pickLang } from '../data/translations';
import { dealBelongsToBroker } from '../utils/prospectionBridge';

export default function BrokersView({
  lang,
  t,
  liveDealsData,
  filteredBrokers,
  brokerSearch,
  setBrokerSearch,
  brokerCategoryFilter,
  setBrokerCategoryFilter,
  brokerLanguageFilter,
  setBrokerLanguageFilter,
  getBrokerLanguageLabels,
  openBrokerModal
}) {
  return (
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

        {/* Filtre par langue parlée */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          paddingBottom: '16px',
          marginBottom: '28px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            {tr(lang, 'Langue parlée :', 'Spoken Language:', 'Idioma hablado:', '服务语言筛选：')}
          </span>
          {[
            { id: 'all', label: tr(lang, 'Toutes (14)', 'All (14)', 'Todos (14)', '全部语言 (14)') },
            { id: 'fr', label: tr(lang, 'Français', 'French', 'Francés', '法语 (FR)') },
            { id: 'en', label: tr(lang, 'Anglais', 'English', 'Inglés', '英语 (EN)') },
            { id: 'zh', label: tr(lang, 'Mandarin (中文)', 'Mandarin (中文)', 'Mandarín (中文)', '普通话 (中文)') },
            { id: 'es', label: tr(lang, 'Espagnol', 'Spanish', 'Español', '西班牙语 (ES)') },
            { id: 'ar_hy', label: tr(lang, 'Arabe & Arménien', 'Arabic & Armenian', 'Árabe y Armenio', '阿拉伯语 / 亚美尼亚语') }
          ].map(lg => {
            const active = brokerLanguageFilter === lg.id;
            return (
              <button
                key={lg.id}
                type="button"
                onClick={() => setBrokerLanguageFilter(lg.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                  padding: '4px 2px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {lg.label}
              </button>
            );
          })}
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
                    onError={e => { e.target.src = '/gx/00/defaut_courtier.jpg'; }}
                  />
                </div>

                <div style={{ padding: '16px 2px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div onClick={() => openBrokerModal(broker)} style={{ marginBottom: '14px', cursor: 'pointer' }}>
                    <div style={{ fontSize: '0.73rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px', lineHeight: 1.4 }}>
                      {pickLang(broker, 'title', lang) || pickLang(broker, 'shortTitle', lang)}
                    </div>
                    <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600 }}>{broker.name}</h3>
                    <div className="broker-name-line" />
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>{pickLang(broker, 'city', lang)}</span>
                      {brokerDeals.length > 0 && (
                        <span style={{ color: 'var(--gold-light)', fontWeight: 600, fontSize: '0.76rem' }}>
                          {brokerDeals.length} {t.brokers.activeMandates}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {getBrokerLanguageLabels(broker).join(' • ')}
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
  );
}
