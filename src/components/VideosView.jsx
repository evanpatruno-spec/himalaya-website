import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Film,
  ExternalLink,
  X,
  ArrowRight,
  Clock,
  Video
} from 'lucide-react';
import { HIMALAYA_VIDEOS } from '../data/siteContent';
import { tr, pickLang } from '../data/translations';

const CATEGORY_LABELS = {
  corporate: {
    FR: 'Corporatif & Forums',
    EN: 'Corporate & Forums',
    ES: 'Corporativo y Foros',
    ZH: '企业形象与论坛'
  },
  franchises: {
    FR: 'Franchises & Paris',
    EN: 'Franchises & Paris',
    ES: 'Franquicias y París',
    ZH: '国际连锁与巴黎展'
  },
  tours: {
    FR: 'Visites & Terrain',
    EN: 'Property Tours & Field',
    ES: 'Recorridos y Terreno',
    ZH: '实景看房与实地拍摄'
  }
};

export default function VideosView({ lang = 'FR', navigateTo }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    if (!activeVideo) return undefined;
    const handleKeyDown = e => {
      if (e.key === 'Escape') setActiveVideo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo]);

  const counts = useMemo(() => {
    const corporate = HIMALAYA_VIDEOS.filter(v => v.category === 'corporate').length;
    const franchises = HIMALAYA_VIDEOS.filter(v => v.category === 'franchises').length;
    const tours = HIMALAYA_VIDEOS.filter(v => v.category === 'tours').length;
    return { all: HIMALAYA_VIDEOS.length, corporate, franchises, tours };
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'all') return HIMALAYA_VIDEOS;
    return HIMALAYA_VIDEOS.filter(v => v.category === activeCategory);
  }, [activeCategory]);

  const getCategoryLabel = cat => CATEGORY_LABELS[cat]?.[lang] || CATEGORY_LABELS[cat]?.FR || cat;

  const getThumbnailSrc = video =>
    video.sourceType === 'mp4'
      ? video.poster || '/gx/partage.jpg'
      : `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  const filterTabs = [
    {
      id: 'all',
      label: tr(lang, `Toutes (${counts.all})`, `All (${counts.all})`, `Todos (${counts.all})`, `全部 (${counts.all})`)
    },
    {
      id: 'corporate',
      label: `${getCategoryLabel('corporate')} (${counts.corporate})`
    },
    {
      id: 'franchises',
      label: `${getCategoryLabel('franchises')} (${counts.franchises})`
    },
    {
      id: 'tours',
      label: `${getCategoryLabel('tours')} (${counts.tours})`
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
          marginBottom: '28px'
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
            <Film size={15} />
            {tr(
              lang,
              'MÉDIAS • CAPSULES VIDÉO & VISITES GUIDÉES',
              'MEDIA • VIDEO INSIGHTS & PROPERTY TOURS',
              'MEDIOS • CÁPSULAS DE VIDEO Y RECORRIDOS',
              '媒体中心 • 官方视频专栏与实景看房'
            )}
          </div>

          <h2 className="serif-title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.45rem)', marginBottom: '12px' }}>
            {tr(
              lang,
              'Vidéothèque officielle & visites vidéo sur le terrain',
              'Official Video Library & On-Site Property Tours',
              'Videoteca oficial y recorridos en terreno',
              '喜马拉雅官方影像馆与实地项目视频导览'
            )}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
            {tr(
              lang,
              'Visionnez notre film corporatif, les entrevues au Salon de la Franchise à Paris, le Forum Immobilier Commercial au Casino de Montréal ainsi que les visites vidéo et survols par drone réalisés par nos courtiers.',
              'Watch our corporate presentation, Franchise Expo Paris interviews, Montreal Commercial Real Estate Forum highlights, and aerial/on-site property tours filmed by our brokers.',
              'Vea nuestro video corporativo, entrevistas en París, el Foro Inmobiliario en Montreal y recorridos aéreos realizados por nuestros corredores.',
              '观看喜马拉雅地产官方企业宣传片、巴黎国际特许经营展品牌专访、蒙特利尔商业论坛回顾以及经纪人团队实地航拍看房视频。'
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
              onClick={() => navigateTo('presse')}
              className="btn-outline"
              style={{ padding: '10px 16px', fontSize: '0.78rem' }}
            >
              {tr(lang, 'Presse & Publications', 'Press & Publications', 'Prensa y Publicaciones', '媒体与专栏')}
            </button>
          </div>
        )}
      </div>

      {/* Bandeau chaînes YouTube officielles */}
      <div
        style={{
          background: 'rgba(212, 175, 95, 0.05)',
          border: '1px solid var(--border-gold)',
          borderRadius: '8px',
          padding: '16px 22px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          <Video size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <span>
            {tr(
              lang,
              'Chaînes vidéo officielles vérifiées : Immobilier Himalaya & équipe spécialisée Campings à vendre Québec.',
              'Verified official video channels: Immobilier Himalaya & specialized Campgrounds Quebec team.',
              'Canales de video oficiales verificados: Immobilier Himalaya y equipo especializado Campings Québec.',
              '已验证官方视频频道：Immobilier Himalaya 集团频道及 Campings à vendre Québec 专业频道。'
            )}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <a
            href="https://www.youtube.com/@immobilierhimalaya659"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
          >
            @immobilierhimalaya659 <ExternalLink size={13} />
          </a>
          <a
            href="https://www.youtube.com/@campings_a_vendre_quebec_com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
          >
            @campings_a_vendre_quebec_com <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Onglets de filtrage par catégorie */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
        {filterTabs.map(tab => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={isActive ? 'btn-gold' : 'btn-outline'}
              style={{ padding: '10px 20px', fontSize: '0.82rem' }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grille des capsules vidéo */}
      <div className="properties-grid">
        {filteredVideos.map(video => {
          const title = pickLang(video, 'title', lang);
          const description = pickLang(video, 'description', lang);
          const date = pickLang(video, 'date', lang);
          const categoryLabel = getCategoryLabel(video.category);

          return (
            <article key={video.id} className="property-card">
              <div
                className="property-img-wrap"
                role="button"
                tabIndex={0}
                onClick={() => setActiveVideo(video)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveVideo(video);
                  }
                }}
                style={{
                  aspectRatio: '16 / 9',
                  cursor: 'pointer',
                  marginBottom: '18px'
                }}
              >
                <img
                  src={getThumbnailSrc(video)}
                  alt={title}
                  loading="lazy"
                />

                <span className="badge-gold">{categoryLabel}</span>

                {/* Bouton lecture centré */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <span
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(14, 18, 28, 0.84)',
                      border: '1.5px solid var(--gold)',
                      color: 'var(--gold-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.45)'
                    }}
                  >
                    <Play size={22} fill="currentColor" style={{ marginLeft: '2px' }} />
                  </span>
                </div>

                {/* Durée + Format */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    zIndex: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(12, 16, 24, 0.88)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    padding: '4px 9px',
                    borderRadius: '4px'
                  }}
                >
                  <Clock size={12} style={{ color: 'var(--gold)' }} />
                  <span>{video.duration}</span>
                  <span style={{ color: 'var(--gold)', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    {video.sourceType === 'mp4' ? 'HD MP4' : 'YouTube'}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  fontSize: '0.78rem',
                  color: 'var(--gold)',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}
              >
                <span>{video.author}</span>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{date}</span>
              </div>

              <h3
                className="serif-title"
                onClick={() => setActiveVideo(video)}
                style={{
                  fontSize: '1.14rem',
                  lineHeight: 1.38,
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  marginBottom: '18px',
                  flexGrow: 1
                }}
              >
                {description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="editorial-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {tr(lang, 'Visionner la capsule', 'Watch video', 'Ver video', '播放视频')}{' '}
                  <Play size={13} />
                </button>

                {video.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link"
                  >
                    YouTube <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Modale de lecture vidéo */}
      {activeVideo && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '940px', padding: '0', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Barre titre modale */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 22px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                <span className="badge-gold" style={{ position: 'static' }}>
                  {getCategoryLabel(activeVideo.category)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  {activeVideo.author} • {pickLang(activeVideo, 'date', lang)} • {activeVideo.duration}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label={tr(lang, 'Fermer le lecteur', 'Close player', 'Cerrar reproductor', '关闭播放器')}
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

            {/* Conteneur lecteur 16:9 */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#05070c' }}>
              {activeVideo.sourceType === 'mp4' ? (
                <video
                  key={activeVideo.id}
                  controls
                  autoPlay
                  playsInline
                  poster={activeVideo.poster || '/gx/partage.jpg'}
                  style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}
                >
                  <source src={activeVideo.videoSrc} type="video/mp4" />
                </video>
              ) : (
                <iframe
                  key={activeVideo.id}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={pickLang(activeVideo, 'title', lang)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              )}
            </div>

            {/* Détails & actions */}
            <div style={{ padding: '24px 28px 28px' }}>
              <h3 className="serif-title" style={{ fontSize: '1.38rem', lineHeight: 1.38, marginBottom: '12px' }}>
                {pickLang(activeVideo, 'title', lang)}
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.96rem',
                  lineHeight: 1.7,
                  marginBottom: '22px'
                }}
              >
                {pickLang(activeVideo, 'description', lang)}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                {activeVideo.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    {tr(lang, 'Regarder sur YouTube', 'Watch on YouTube', 'Ver en YouTube', '前往 YouTube 观看')}
                    <ExternalLink size={14} />
                  </a>
                )}

                {navigateTo && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVideo(null);
                      navigateTo('nous-joindre');
                    }}
                    className="btn-gold"
                  >
                    {tr(lang, 'Parler à un courtier', 'Speak with a broker', 'Hablar con un corredor', '咨询专业经纪人')}
                    <ArrowRight size={15} />
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
