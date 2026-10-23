import React from 'react';
import { MapPin, ExternalLink, ArrowRight, X } from 'lucide-react';
import { HIMALAYA_EVENTS, HIMALAYA_NEWS } from '../data/siteContent';
import { tr, pickLang } from '../data/translations';

export default function NewsEventsView({
  lang,
  t,
  newsYearFilter,
  setNewsYearFilter,
  selectedNewsArticle,
  setSelectedNewsArticle,
  navigateTo
}) {
  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="badge-gold" style={{ marginBottom: '6px' }}>
            {tr(lang, 'Congrès & Présence Internationale', 'Conventions & International Presence', 'Congresos y Presencia Internacional', '行业峰会与国际展会')}
          </span>
          <h2 className="serif-title" style={{ fontSize: '2.2rem', fontWeight: 600 }}>{t.news.title}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px', marginBottom: '56px' }}>
          {HIMALAYA_EVENTS.map(ev => (
            <div
              key={ev.id}
              style={{
                background: 'transparent',
                borderTop: '1px solid rgba(200, 164, 93, 0.38)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '26px 0 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span className="badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                  {pickLang(ev, 'dateRange', lang)}
                </span>
                <h3 className="serif-title" style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>
                  {pickLang(ev, 'title', lang)}
                </h3>
                <div style={{ fontSize: '0.84rem', color: 'var(--gold-light)', marginBottom: '12px' }}>
                  <MapPin size={13} style={{ display: 'inline', marginRight: '5px' }} /> {pickLang(ev, 'location', lang)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '18px' }}>
                  {pickLang(ev, 'description', lang)}
                </p>
              </div>
              <a href={ev.url} target="_blank" rel="noreferrer" className="editorial-link" style={{ alignSelf: 'flex-start' }}>
                {t.news.detailsBtn} <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="serif-title" style={{ fontSize: '1.9rem', fontWeight: 600 }}>
            {t.news.recentNews}
          </h2>

          {/* Filtres d'archives par année */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {['all', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'].map(yr => {
              const active = newsYearFilter === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setNewsYearFilter(yr)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                    padding: '4px 2px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 400,
                    color: active ? 'var(--gold-light)' : 'var(--text-secondary)'
                  }}
                >
                  {yr === 'all' ? tr(lang, 'Toutes', 'All', 'Todos', '全部') : yr}
                </button>
              );
            })}
          </div>
        </div>

        <div className="properties-grid">
          {HIMALAYA_NEWS.filter(n => newsYearFilter === 'all' || n.year === newsYearFilter).map(news => (
            <div
              key={news.id}
              onClick={() => setSelectedNewsArticle(news)}
              style={{
                background: 'transparent',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div>
                <div className="property-img-wrap" style={{ height: '200px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                  <img
                    src={news.image}
                    alt={pickLang(news, 'title', lang)}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'; }}
                  />
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  {pickLang(news, 'date', lang)} • {pickLang(news, 'category', lang)}
                </div>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                  {pickLang(news, 'title', lang)}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                  {pickLang(news, 'excerpt', lang)}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNewsArticle(news);
                  }}
                  className="editorial-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.74rem' }}
                >
                  {tr(lang, 'Lire l’analyse complète', 'Read Full Article', 'Leer análisis completo', '阅读完整专题分析')} <ArrowRight size={12} />
                </button>
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    {tr(lang, 'Source', 'Source', 'Fuente', '官方来源')} <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modale Lecture Article Complet */}
      {selectedNewsArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedNewsArticle(null)}>
          <div className="modal-panel" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(18, 18, 21, 0.96)'
            }}>
              <span className="badge-gold">
                {pickLang(selectedNewsArticle, 'date', lang)} • {pickLang(selectedNewsArticle, 'category', lang)}
              </span>
              <button
                onClick={() => setSelectedNewsArticle(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)',
                  color: '#fff', width: '34px', height: '34px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '28px 30px' }}>
              <div style={{ height: '270px', borderRadius: '6px', overflow: 'hidden', marginBottom: '22px', background: '#09090b' }}>
                <img
                  src={selectedNewsArticle.image}
                  alt={pickLang(selectedNewsArticle, 'title', lang)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'; }}
                />
              </div>

              <h2 className="serif-title" style={{ fontSize: '1.85rem', fontWeight: 600, marginBottom: '14px', lineHeight: 1.25 }}>
                {pickLang(selectedNewsArticle, 'title', lang)}
              </h2>

              <p style={{ fontSize: '0.96rem', color: 'var(--text-main)', lineHeight: 1.75, marginBottom: '22px' }}>
                {pickLang(selectedNewsArticle, 'excerpt', lang)}
              </p>

              <div style={{
                paddingTop: '18px',
                paddingBottom: '18px',
                borderTop: '1px solid rgba(200, 164, 93, 0.35)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '22px'
              }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  {tr(lang, 'Perspective & Accompagnement Immobilier Himalaya', 'Immobilier Himalaya Perspective & Advisory', 'Perspectiva y Acompañamiento Immobilier Himalaya', '喜马拉雅地产专业洞察与顾问服务')}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {tr(
                    lang,
                    'Nos courtiers agréés OACIQ et notre équipe de direction suivent de près ces évolutions réglementaires, économiques et commerciales afin de sécuriser chaque transaction — qu’il s’agisse d’expansion de franchises (membre CQF), d’acquisitions commerciales, de pourvoiries ou d’immobilier résidentiel au Québec et à l’international.',
                    'Our OACIQ certified brokers and executive team closely track these regulatory, economic, and commercial developments to safeguard every transaction — whether for franchise expansion (CQF member), commercial acquisitions, outfitters, or residential real estate across Quebec and internationally.',
                    'Nuestros corredores certificados por la OACIQ y nuestro equipo directivo siguen de cerca estas evoluciones regulatorias, económicas y comerciales para asegurar cada transacción, ya sea en expansión de franquicias (miembro CQF), adquisiciones comerciales, pourvoiries o bienes raíces residenciales en Quebec y a nivel internacional.',
                    '我们的 OACIQ 持牌经纪人与管理团队密切跟踪上述监管、经济与商业趋势，全方位保障每一笔交易的安全与价值——涵盖连锁特许经营拓展（CQF 成员）、商业地产并购、度假庄园及魁北克与国际住宅交易。'
                  )}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => {
                      setSelectedNewsArticle(null);
                      navigateTo('nous-joindre');
                    }}
                  >
                    {tr(lang, 'Discuter avec un courtier', 'Speak with a Broker', 'Hablar con un corredor', '联系专业经纪人')} <ArrowRight size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setSelectedNewsArticle(null);
                      navigateTo('proprietes');
                    }}
                  >
                    {tr(lang, 'Voir nos propriétés', 'View Properties', 'Ver propiedades', '浏览在售物业')}
                  </button>
                </div>

                {selectedNewsArticle.url && (
                  <a
                    href={selectedNewsArticle.url}
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-link"
                    style={{ fontSize: '0.78rem' }}
                  >
                    {tr(lang, 'Consulter la source officielle', 'View Official Source', 'Ver fuente oficial', '查看官方原文来源')} <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
