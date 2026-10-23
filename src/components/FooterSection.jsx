import React from 'react';
import { Lock, Phone, LayoutGrid, Sparkles, Mail, X } from 'lucide-react';
import { OFFICIAL_SOCIAL_LINKS, LEGAL_DOCUMENTS } from '../data/siteContent';
import { tr, pickLang } from '../data/translations';

export default function FooterSection({
  lang,
  t,
  activePage,
  isScrolled,
  navigateTo,
  legalModalType,
  setLegalModalType
}) {
  return (
    <>
      <footer
        style={{
          background: '#050506',
          marginTop: 'auto',
          position: 'relative'
        }}
      >
        <hr className="gold-hairline" />
        <div className="container" style={{ padding: '64px 24px 32px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '40px',
              paddingBottom: '44px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {/* Colonne 1 : Identité Himalaya & Multi-Prêts */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <img
                  src="/gx/himalaya-immobilier-logo.svg"
                  alt="Himalaya"
                  style={{ height: '46px', display: 'block', cursor: 'pointer' }}
                  onClick={() => navigateTo('home')}
                />
                <a
                  href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
                  target="_blank"
                  rel="noreferrer"
                  style={{ opacity: 0.9, display: 'inline-flex', alignItems: 'center' }}
                  title="Multi-Prêts Hypothèques"
                >
                  <img
                    src="/gx/m/Multi_Prets.png"
                    alt="Multi-Prêts Hypothèques"
                    style={{ height: '30px', objectFit: 'contain' }}
                  />
                </a>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {tr(
                  lang,
                  'Agence immobilière (OACIQ) spécialisée en immobilier commercial, résidentiel, pourvoiries, franchises et international depuis 2008.',
                  'Real Estate Agency (OACIQ) specializing in commercial, residential, outfitter, franchise & international properties since 2008.',
                  'Agencia inmobiliaria (OACIQ) especializada en propiedades comerciales, residenciales, turísticas, franquicias e internacional desde 2008.',
                  '自 2008 年创立的魁北克持牌房地产经纪机构（OACIQ），专注于商业地产、住宅、度假庄园、连锁特许经营及国际地产。'
                )}
              </p>
            </div>

            {/* Colonne 2 : Siège social Montréal */}
            <div>
              <div className="badge-gold" style={{ marginBottom: '12px' }}>
                {tr(lang, 'Siège social — Montréal', 'Headquarters — Montreal', 'Sede Central — Montreal', '蒙特利尔总部')}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>Immobilier Himalaya Real Estate Corp.</div>
                <div>{t.contact.hqAddress}</div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <a href="tel:5143791788" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                    (514) 379-1788
                  </a>
                  <a href="tel:18008204828" style={{ color: 'var(--text-secondary)' }}>
                    1 800 820-4828
                  </a>
                  <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)' }}>
                    info@himalayacorp.com
                  </a>
                </div>
              </div>
            </div>

            {/* Colonne 3 : Navigation Rapide */}
            <div>
              <div className="badge-gold" style={{ marginBottom: '12px' }}>
                {tr(lang, 'Navigation', 'Navigation', 'Navegación', '快速导航')}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px 14px',
                  fontSize: '0.83rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <button
                  onClick={() => navigateTo('home')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.nav.home}
                </button>
                <button
                  onClick={() => navigateTo('proprietes')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.nav.properties}
                </button>
                <button
                  onClick={() => navigateTo('a-propos')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {tr(lang, 'L’Agence', 'The Agency', 'La Agencia', '关于本行')}
                </button>
                <button
                  onClick={() => navigateTo('franchises')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {tr(lang, 'Franchises', 'Franchises', 'Franquicias', '特许经营')}
                </button>
                <button
                  onClick={() => navigateTo('courtiers')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.nav.brokers}
                </button>
                <button
                  onClick={() => navigateTo('outils')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.nav.tools}
                </button>
                <button
                  onClick={() => navigateTo('investisseurs-internationaux')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer', textAlign: 'left' }}
                >
                  {tr(lang, 'International', 'International', 'Internacional', '国际投资')}
                </button>
                <button
                  onClick={() => navigateTo('evenements')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.nav.news}
                </button>
                <button
                  onClick={() => navigateTo('balados')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.nav.podcasts}
                </button>
                <button
                  onClick={() => navigateTo('nous-joindre')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.nav.contact}
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              fontSize: '0.76rem',
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span>
                © 2026 Immobilier Himalaya Real Estate Corp.{' '}
                {tr(lang, 'Tous droits réservés.', 'All rights reserved.', 'Todos los derechos reservados.', '保留所有权利。')}
              </span>
              <span>|</span>
              <button
                onClick={() => setLegalModalType('terms')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  textDecoration: 'underline'
                }}
              >
                {tr(lang, "Conditions d'utilisation", 'Terms of Use', 'Condiciones de uso', '使用条款')}
              </button>
              <span>|</span>
              <button
                onClick={() => setLegalModalType('privacy')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  textDecoration: 'underline'
                }}
              >
                {tr(lang, 'Politique de confidentialité', 'Privacy Policy (Law 25)', 'Política de privacidad (Ley 25)', '隐私政策 (第25号法案)')}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {OFFICIAL_SOCIAL_LINKS.map(soc => (
                <a key={soc.id} href={soc.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-light)', fontWeight: 500 }}>
                  {soc.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modale Conditions d'utilisation & Politique de confidentialité */}
      {legalModalType && LEGAL_DOCUMENTS[legalModalType] && (
        <div className="modal-backdrop" onClick={() => setLegalModalType(null)}>
          <div className="modal-panel" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(18, 18, 21, 0.96)'
              }}
            >
              <span className="badge-gold">{pickLang(LEGAL_DOCUMENTS[legalModalType], 'title', lang)}</span>
              <button
                onClick={() => setLegalModalType(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
                {pickLang(LEGAL_DOCUMENTS[legalModalType], 'title', lang)}
              </h2>
              {LEGAL_DOCUMENTS[legalModalType].sections.map((sec, idx) => (
                <div key={idx} style={{ paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '6px' }}>
                    {pickLang(sec, 'heading', lang)}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {pickLang(sec, 'body', lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Barre d'action flottante mobile (< 720px) */}
      <nav className="mobile-bottom-bar" aria-label="Navigation rapide mobile">
        <a href="tel:5143791788" className="mobile-bottom-bar-item">
          <Phone size={16} color="var(--gold)" />
          <span>{tr(lang, 'Appeler', 'Call', 'Llamar', '致电')}</span>
        </a>
        <button
          type="button"
          onClick={() => navigateTo('proprietes')}
          className={`mobile-bottom-bar-item ${activePage === 'proprietes' ? 'active' : ''}`}
        >
          <LayoutGrid size={16} color="var(--gold)" />
          <span>{tr(lang, 'Propriétés', 'Properties', 'Propiedades', '房源')}</span>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('courtiers')}
          className={`mobile-bottom-bar-item ${activePage === 'courtiers' ? 'active' : ''}`}
        >
          <Sparkles size={16} color="var(--gold)" />
          <span>{tr(lang, 'Courtiers', 'Brokers', 'Corredores', '经纪人')}</span>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('nous-joindre')}
          className={`mobile-bottom-bar-item ${activePage === 'nous-joindre' ? 'active' : ''}`}
        >
          <Mail size={16} color="var(--gold)" />
          <span>{tr(lang, 'Écrire', 'Contact', 'Contacto', '联系')}</span>
        </button>
      </nav>

      {/* Bouton minimaliste Retour en haut ↑ */}
      {isScrolled && (
        <button
          type="button"
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={tr(lang, 'Retour en haut', 'Back to top', 'Volver arriba', '返回顶部')}
          title={tr(lang, 'Retour en haut', 'Back to top', 'Volver arriba', '返回顶部')}
        >
          ↑
        </button>
      )}
    </>
  );
}
