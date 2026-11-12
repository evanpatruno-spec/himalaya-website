import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { HIMALAYA_PODCASTS } from '../data/siteContent';
import { tr, pickLang } from '../data/translations';

export default function PodcastsView({
  lang,
  podcastSeriesFilter,
  setPodcastSeriesFilter,
  playingPodcastId,
  setPlayingPodcastId,
  navigateTo
}) {
  const filteredPodcasts = (podcastSeriesFilter === 'all' || podcastSeriesFilter === 'himalaya')
    ? HIMALAYA_PODCASTS
    : HIMALAYA_PODCASTS.filter(p => p.series === podcastSeriesFilter);

  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        {/* En-tête éditorial */}
        <div style={{ marginBottom: '36px', paddingBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '6px' }}>
            {tr(
              lang,
              'IMMOBILIER HIMALAYA • APCIQ • OACIQ',
              'IMMOBILIER HIMALAYA • QPAREB (APCIQ) • OACIQ',
              'IMMOBILIER HIMALAYA • APCIQ • OACIQ',
              '喜马拉雅地产 • APCIQ 协会 • OACIQ 监管局'
            )}
          </div>
          <h1 className="serif-title" style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px' }}>
            {tr(
              lang,
              'Balados & Capsules Immobilières',
              'Real Estate Podcasts & Video Series',
              'Podcasts y Cápsulas Inmobiliarias',
              '房地产播客与视频专栏'
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', maxWidth: '820px', lineHeight: 1.65 }}>
            {tr(
              lang,
              'Retrouvez les grands épisodes des balados officiels de l’APCIQ (« L’immobilier en mouvement ») et de l’OACIQ (« L’immo en règle ») disponibles sur YouTube, Spotify et Apple Podcasts.',
              'Explore featured episodes from the official QPAREB/APCIQ ("L’immobilier en mouvement") and OACIQ ("L’immo en règle") podcasts available on YouTube, Spotify, and Apple Podcasts.',
              'Descubra episodios destacados de los podcasts oficiales de la APCIQ («L’immobilier en mouvement») y de la OACIQ («L’immo en règle») disponibles en YouTube, Spotify y Apple Podcasts.',
              '收听魁北克职业房地产协会 APCIQ（《L’immobilier en mouvement》）与监管局 OACIQ（《L’immo en règle》）在 YouTube、Spotify 与 Apple Podcasts 上发布的官方播客节目。'
            )}
          </p>
        </div>

        {/* BARRE DES CHAÎNES OFFICIELLES */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          paddingBottom: '26px',
          marginBottom: '28px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '4px' }}>
              {tr(lang, 'CHAÎNES & PLATEFORMES OFFICIELLES', 'OFFICIAL CHANNELS & PLATFORMS', 'CANALES Y PLATAFORMAS OFICIALES', '官方播客频道与平台')}
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              {tr(
                lang,
                'Accédez directement aux chaînes YouTube et aux portails audio de l’APCIQ et de l’OACIQ :',
                'Direct access to the official YouTube channels and audio portals of QPAREB (APCIQ) and OACIQ:',
                'Acceso directo a los canales de YouTube y portales de audio oficiales de la APCIQ y de la OACIQ:',
                '直接访问魁北克房地产协会 (APCIQ) 与监管局 (OACIQ) 的官方 YouTube 频道及音频平台：'
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://apciq.ca/balado-limmobilier-en-mouvement/"
              target="_blank"
              rel="noreferrer"
              className="editorial-link"
              style={{ fontSize: '0.8rem' }}
            >
              APCIQ • L’immobilier en mouvement <ExternalLink size={12} />
            </a>
            <a
              href="https://www.youtube.com/channel/UCQpZgmTsZ3b-fmq9XN6GcEg"
              target="_blank"
              rel="noreferrer"
              className="editorial-link"
              style={{ fontSize: '0.8rem' }}
            >
              YouTube APCIQ <ExternalLink size={12} />
            </a>
            <a
              href="https://www.youtube.com/@OACIQ"
              target="_blank"
              rel="noreferrer"
              className="editorial-link"
              style={{ fontSize: '0.8rem' }}
            >
              YouTube OACIQ • L’immo en règle <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* FILTRES PAR SÉRIE */}
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '14px'
        }}>
          {[
            { id: 'all', label: tr(lang, `Tous les épisodes (${HIMALAYA_PODCASTS.length})`, `All Episodes (${HIMALAYA_PODCASTS.length})`, `Todos los episodios (${HIMALAYA_PODCASTS.length})`, `全部节目 (${HIMALAYA_PODCASTS.length})`) },
            { id: 'apciq', label: tr(lang, 'APCIQ — L’immobilier en mouvement', 'QPAREB (APCIQ) — Market Podcast', 'APCIQ — L’immobilier en mouvement', 'APCIQ — 房产脉动播客') },
            { id: 'oaciq', label: tr(lang, 'OACIQ — L’immo en règle', 'OACIQ — L’immo en règle', 'OACIQ — L’immo en règle', 'OACIQ — 房产合规播客') }
          ].map(tab => {
            const active = podcastSeriesFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPodcastSeriesFilter(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 0',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                  borderBottom: active ? '2px solid var(--gold-primary)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* RÉPERTOIRE ÉDITORIAL SANS BOÎTE DES ÉPISODES */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredPodcasts.map((pod) => {
            const isPlaying = playingPodcastId === pod.id;
            return (
              <div key={pod.id} style={{
                padding: '30px 0',
                background: 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '28px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.73rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {pickLang(pod, 'episode', lang)}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>• {pod.duration}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>• {pickLang(pod, 'hosts', lang)}</span>
                    </div>
                    <h3 className="serif-title" style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                      {pickLang(pod, 'title', lang)}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.68, maxWidth: '820px' }}>
                      {pickLang(pod, 'description', lang)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', minWidth: '210px', paddingTop: '4px' }}>
                    {pod.youtubeUrl && (
                      <a
                        href={pod.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-link"
                        style={{ fontSize: '0.78rem' }}
                      >
                        {tr(lang, 'Écouter sur YouTube', 'Watch on YouTube', 'Ver en YouTube', 'YouTube 观看/收听')} <ExternalLink size={12} />
                      </a>
                    )}
                    {pod.platformUrl && pod.platformUrl !== pod.youtubeUrl && (
                      <a
                        href={pod.platformUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-link"
                        style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                      >
                        {pod.series === 'apciq'
                          ? tr(lang, 'Portail Balado APCIQ', 'QPAREB Podcast Portal', 'Portal Podcast APCIQ', 'APCIQ 播客门户')
                          : tr(lang, 'Portail OACIQ', 'OACIQ Portal', 'Portal OACIQ', 'OACIQ 官方门户')} <ExternalLink size={11} />
                      </a>
                    )}
                    <button
                      onClick={() => setPlayingPodcastId(isPlaying ? null : pod.id)}
                      className="editorial-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                    >
                      {isPlaying
                        ? tr(lang, 'Masquer les notes', 'Hide Notes', 'Ocultar notas', '收起详情')
                        : tr(lang, 'Points clés & Courtiers', 'Key Takeaways & Brokers', 'Puntos clave y Corredores', '核心要点与经纪人咨询')} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                {isPlaying && (
                  <div style={{
                    marginTop: '18px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(200, 164, 93, 0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '760px', lineHeight: 1.65 }}>
                      {tr(
                        lang,
                        `Épisode animé par ${pickLang(pod, 'hosts', lang)}. Nos courtiers Immobilier Himalaya intègrent ces analyses économiques de l'APCIQ et les normes réglementaires de l'OACIQ dans chaque mandat d'achat ou de vente.`,
                        `Hosted by ${pickLang(pod, 'hosts', lang)}. Our Immobilier Himalaya brokers integrate these QPAREB economic insights and OACIQ regulatory standards into every buying or selling mandate.`,
                        `Presentado por ${pickLang(pod, 'hosts', lang)}. Nuestros corredores de Immobilier Himalaya integran estos análisis económicos de la APCIQ y las normas de la OACIQ en cada mandato.`,
                        `主讲嘉宾：${pickLang(pod, 'hosts', lang)}。喜马拉雅地产经纪团队在每项买卖委托中均严格结合 APCIQ 市场洞察与 OACIQ 监管标准。`
                      )}
                    </span>
                    <button
                      onClick={() => navigateTo('nous-joindre')}
                      className="editorial-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      {tr(lang, 'Échanger avec nos courtiers', 'Discuss with our brokers', 'Hablar con nuestros corredores', '与我们的经纪人交流')} <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
