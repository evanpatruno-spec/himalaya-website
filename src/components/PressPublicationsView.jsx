import React, { useState, useEffect, useMemo } from 'react';
import {
  Newspaper,
  BookOpen,
  ExternalLink,
  X,
  ArrowRight,
  FileText,
  Globe
} from 'lucide-react';
import { HIMALAYA_PRESS_ITEMS } from '../data/siteContent';
import { tr, pickLang } from '../data/translations';

export default function PressPublicationsView({ lang = 'FR', navigateTo }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!selectedItem) return undefined;
    const handleKeyDown = e => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const counts = useMemo(() => {
    const press = HIMALAYA_PRESS_ITEMS.filter(item => item.kind === 'press').length;
    const publication = HIMALAYA_PRESS_ITEMS.filter(item => item.kind === 'publication').length;
    return { all: HIMALAYA_PRESS_ITEMS.length, press, publication };
  }, []);

  const pressItems = useMemo(
    () =>
      activeFilter === 'publication'
        ? []
        : HIMALAYA_PRESS_ITEMS.filter(item => item.kind === 'press'),
    [activeFilter]
  );

  const publicationItems = useMemo(
    () =>
      activeFilter === 'press'
        ? []
        : HIMALAYA_PRESS_ITEMS.filter(item => item.kind === 'publication'),
    [activeFilter]
  );

  const filters = [
    {
      id: 'all',
      label: tr(lang, `Tout (${counts.all})`, `All (${counts.all})`, `Todo (${counts.all})`, `全部 (${counts.all})`)
    },
    {
      id: 'press',
      label: tr(
        lang,
        `Presse & Médias (${counts.press})`,
        `Press & Media (${counts.press})`,
        `Prensa y Medios (${counts.press})`,
        `新闻报道 (${counts.press})`
      )
    },
    {
      id: 'publication',
      label: tr(
        lang,
        `Publications & Guides (${counts.publication})`,
        `Publications & Guides (${counts.publication})`,
        `Publicaciones y Guías (${counts.publication})`,
        `专题研究与指南 (${counts.publication})`
      )
    }
  ];

  return (
    <section className="container" style={{ padding: '72px 24px 96px' }}>
      {/* En-tête éditorial */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          paddingBottom: '28px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '36px'
        }}
      >
        <div style={{ maxWidth: '760px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--gold)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}
          >
            <Newspaper size={15} />
            {tr(
              lang,
              'MÉDIAS • PRESSE & PUBLICATIONS SPÉCIALISÉES',
              'MEDIA • PRESS & SPECIALIZED PUBLICATIONS',
              'MEDIOS • PRENSA Y PUBLICACIONES ESPECIALIZADAS',
              '媒体中心 • 新闻报道与深度专栏'
            )}
          </div>
          <h2 className="serif-title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.45rem)', marginBottom: '12px' }}>
            {tr(
              lang,
              'Immobilier Himalaya dans les médias et publications d’experts',
              'Immobilier Himalaya in the Press & Expert Publications',
              'Immobilier Himalaya en prensa y publicaciones especializadas',
              '主流媒体专访与喜马拉雅专家深度专栏'
            )}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
            {tr(
              lang,
              'Retrouvez les reportages et entrevues accordés aux médias nationaux et régionaux (La Presse, Le Soleil, Le Nord-Info), ainsi que les guides techniques publiés par nos courtiers en transactions récréotouristiques et commerciales.',
              'Explore media features and interviews with national and regional outlets (La Presse, Le Soleil, Le Nord-Info), alongside technical transaction guides authored by our commercial and resort brokerage specialists.',
              'Consulte reportajes y entrevistas en medios nacionales y regionales (La Presse, Le Soleil, Le Nord-Info), junto con las guías técnicas redactadas por nuestros corredores especializados.',
              '浏览《La Presse》、《Le Soleil》、《Le Nord-Info》等魁北克主流媒体对喜马拉雅团队的报道与专访，以及旗下资深经纪人撰写的商业及旅游地产并购实务指南。'
            )}
          </p>
        </div>

        {/* Navigation rapide inter-onglets Médias */}
        {navigateTo && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigateTo('evenements')}
              className="btn-outline"
              style={{ padding: '10px 16px', fontSize: '0.78rem' }}
            >
              {tr(lang, 'Actualités & Événements', 'News & Events', 'Noticias y Eventos', '活动与新闻')}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('balados')}
              className="btn-outline"
              style={{ padding: '10px 16px', fontSize: '0.78rem' }}
            >
              {tr(lang, 'Balados', 'Podcasts', 'Pódcasts', '播客专栏')}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('videos')}
              className="btn-outline"
              style={{ padding: '10px 16px', fontSize: '0.78rem' }}
            >
              {tr(lang, 'Capsules vidéo', 'Videos', 'Videos', '视频专栏')}
            </button>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '42px' }}>
        {filters.map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={isActive ? 'btn-gold' : 'btn-outline'}
              style={{ padding: '10px 20px', fontSize: '0.82rem' }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1 : Articles de presse (avec photos officielles vérifiées) */}
      {pressItems.length > 0 && (
        <div style={{ marginBottom: publicationItems.length > 0 ? '72px' : 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '26px'
            }}
          >
            <Globe size={18} style={{ color: 'var(--gold)' }} />
            <h3 className="serif-title" style={{ fontSize: '1.45rem' }}>
              {tr(
                lang,
                'Revue de presse & Couverture médiatique',
                'Press Coverage & Media Mentions',
                'Cobertura de Prensa y Medios',
                '新闻媒体报道与权威引用'
              )}
            </h3>
          </div>

          <div className="properties-grid">
            {pressItems.map(item => {
              const title = pickLang(item, 'title', lang);
              const excerpt = pickLang(item, 'excerpt', lang);
              const date = pickLang(item, 'date', lang);
              const category = pickLang(item, 'category', lang);

              return (
                <article key={item.id} className="property-card">
                  {item.image && (
                    <div
                      className="property-img-wrap"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedItem(item)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedItem(item);
                        }
                      }}
                      style={{ cursor: 'pointer', marginBottom: '18px' }}
                    >
                      <img src={item.image} alt={title} loading="lazy" />
                      <span className="badge-gold">{category}</span>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '14px',
                          zIndex: 2,
                          background: 'rgba(12, 16, 24, 0.86)',
                          border: '1px solid var(--border-gold)',
                          color: 'var(--gold-light)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}
                      >
                        {item.outlet}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '10px',
                      fontSize: '0.78rem',
                      color: 'var(--gold)',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    <span>{item.outlet}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{date}</span>
                  </div>

                  <h4
                    className="serif-title"
                    onClick={() => setSelectedItem(item)}
                    style={{
                      fontSize: '1.16rem',
                      lineHeight: 1.38,
                      marginBottom: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    {title}
                  </h4>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.92rem',
                      lineHeight: 1.65,
                      marginBottom: '18px',
                      flexGrow: 1
                    }}
                  >
                    {excerpt}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="editorial-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {tr(lang, 'Lire le résumé', 'Read summary', 'Leer resumen', '查看摘要')}{' '}
                      <ArrowRight size={14} />
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link"
                    >
                      {tr(lang, 'Article source', 'Source article', 'Artículo fuente', '阅读原文')}{' '}
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2 : Publications & guides spécialisés (mise en page éditoriale sans image répétée) */}
      {publicationItems.length > 0 && (
        <div style={{ marginBottom: '64px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
              paddingBottom: '18px',
              borderBottom: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--gold)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}
              >
                <BookOpen size={16} />
                {tr(
                  lang,
                  'PUBLICATIONS & GUIDES TECHNIQUES DES COURTIERS',
                  'BROKER PUBLICATIONS & TECHNICAL GUIDES',
                  'PUBLICACIONES Y GUÍAS TÉCNICAS DE CORREDORES',
                  '旗下经纪人深度专题文章与并购指南'
                )}
              </div>
              <h3 className="serif-title" style={{ fontSize: '1.45rem' }}>
                {tr(
                  lang,
                  'Analyses transactionnelles en hôtellerie de plein air & M&A',
                  'Outdoor Hospitality & Commercial M&A Analysis',
                  'Análisis de Transacciones Turísticas y M&A',
                  '魁北克露营地及商业旅游地产并购交易专题'
                )}
              </h3>
            </div>

            <a
              href="https://campingsavendrequebec.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ padding: '10px 18px', fontSize: '0.8rem' }}
            >
              campingsavendrequebec.com <ExternalLink size={14} />
            </a>
          </div>

          <div>
            {publicationItems.map(pub => {
              const title = pickLang(pub, 'title', lang);
              const excerpt = pickLang(pub, 'excerpt', lang);
              const date = pickLang(pub, 'date', lang);
              const category = pickLang(pub, 'category', lang);

              return (
                <article
                  key={pub.id}
                  style={{
                    padding: '28px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px'
                  }}
                >
                  <div style={{ flex: '1 1 560px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '10px'
                      }}
                    >
                      <span className="badge-gold" style={{ position: 'static' }}>
                        {category}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                        {pub.outlet}
                      </span>
                      <span style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600 }}>
                        {date}
                      </span>
                    </div>

                    <h4
                      className="serif-title"
                      onClick={() => setSelectedItem(pub)}
                      style={{
                        fontSize: '1.22rem',
                        lineHeight: 1.4,
                        marginBottom: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {title}
                    </h4>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                      {excerpt}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(pub)}
                      className="btn-outline"
                      style={{ padding: '10px 16px', fontSize: '0.8rem' }}
                    >
                      <FileText size={14} />
                      {tr(lang, 'Aperçu', 'Overview', 'Resumen', '内容概览')}
                    </button>

                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                      style={{ padding: '10px 18px', fontSize: '0.8rem' }}
                    >
                      {tr(lang, 'Lire le guide', 'Read guide', 'Leer guía', '阅读全文')}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Bandeau Relations Médias */}
      <div
        style={{
          background: 'rgba(212, 175, 95, 0.06)',
          border: '1px solid var(--border-gold)',
          borderRadius: '8px',
          padding: '28px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <h4 className="serif-title" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
            {tr(
              lang,
              'Relations médias, entrevues & commentaires de marché',
              'Media Relations, Interviews & Market Commentary',
              'Relaciones con la prensa y entrevistas',
              '媒体采访、市场评论与机构合作联系'
            )}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.6 }}>
            {tr(
              lang,
              'Journaliste, organisateur de conférence ou partenaire ? Notre équipe de direction et nos courtiers commerciaux sont disponibles pour intervenir sur l’investissement immobilier au Québec et à l’international.',
              'Journalist, event organizer, or industry partner? Our leadership team and commercial brokers are available for commentary on Quebec and cross-border real estate.',
              '¿Periodista o socio comercial? Nuestro equipo directivo y nuestros corredores están disponibles para entrevistas sobre inversión inmobiliaria.',
              '欢迎媒体记者、行业协会或商业合作伙伴联系喜马拉雅管理团队与资深经纪人，获取魁北克及跨境地产市场深度访谈。'
            )}
          </p>
        </div>

        {navigateTo && (
          <button
            type="button"
            onClick={() => navigateTo('nous-joindre')}
            className="btn-gold"
          >
            {tr(lang, 'Contacter l’équipe', 'Contact our team', 'Contactar al equipo', '联系公关与团队')}
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* Modale de lecture détaillée */}
      {selectedItem && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span className="badge-gold" style={{ position: 'static' }}>
                {pickLang(selectedItem, 'category', lang)}
              </span>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label={tr(lang, 'Fermer', 'Close', 'Cerrar', '关闭')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  borderRadius: '6px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {selectedItem.image && (
              <div style={{ maxHeight: '340px', overflow: 'hidden', background: '#0e121b' }}>
                <img
                  src={selectedItem.image}
                  alt={pickLang(selectedItem, 'title', lang)}
                  style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            <div style={{ padding: '28px 28px 32px' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '14px',
                  fontSize: '0.82rem',
                  color: 'var(--gold)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}
              >
                <span>{selectedItem.outlet}</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {pickLang(selectedItem, 'date', lang)}
                </span>
              </div>

              <h3 className="serif-title" style={{ fontSize: '1.5rem', lineHeight: 1.35, marginBottom: '16px' }}>
                {pickLang(selectedItem, 'title', lang)}
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  marginBottom: '26px'
                }}
              >
                {pickLang(selectedItem, 'excerpt', lang)}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                >
                  {tr(lang, 'Consulter la source', 'Open source article', 'Ver fuente original', '打开官方原文')}
                  <ExternalLink size={15} />
                </a>

                {selectedItem.archiveUrl && (
                  <a
                    href={selectedItem.archiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    {tr(lang, 'Archive Himalaya', 'Himalaya Archive', 'Archivo Himalaya', '喜马拉雅存档页面')}
                    <ExternalLink size={14} />
                  </a>
                )}

                {navigateTo && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItem(null);
                      navigateTo('nous-joindre');
                    }}
                    className="btn-outline"
                  >
                    {tr(lang, 'Nous joindre', 'Contact us', 'Contáctenos', '联系我们')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
