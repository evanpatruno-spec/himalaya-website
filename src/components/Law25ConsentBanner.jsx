import React, { useEffect, useState } from 'react';
import { ShieldCheck, SlidersHorizontal, X, Check } from 'lucide-react';
import { tr } from '../data/translations';
import {
  CONSENT_PREFERENCES_EVENT,
  CONSENT_UPDATED_EVENT,
  acceptAllConsent,
  enforceConsentSideEffects,
  getConsentCategorySpecs,
  openLegalModal,
  readConsentState,
  refuseAllOptionalConsent,
  saveConsentState
} from '../utils/consentManager';

export default function Law25ConsentBanner({ lang, onGrantTranslateConsent }) {
  const [consent, setConsent] = useState(() => readConsentState());
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({ ...readConsentState().categories }));
  const [pendingTranslateItem, setPendingTranslateItem] = useState(null);

  useEffect(() => {
    enforceConsentSideEffects(consent);

    const onUpdated = (e) => {
      const next = e.detail || readConsentState();
      setConsent(next);
      setDraft({ ...next.categories });
    };

    const onOpenPrefs = (e) => {
      const current = readConsentState();
      setConsent(current);
      setDraft({ ...current.categories });
      setPendingTranslateItem(e?.detail?.pendingTranslateItem || null);
      setPrefsOpen(true);
    };

    window.addEventListener(CONSENT_UPDATED_EVENT, onUpdated);
    window.addEventListener(CONSENT_PREFERENCES_EVENT, onOpenPrefs);
    return () => {
      window.removeEventListener(CONSENT_UPDATED_EVENT, onUpdated);
      window.removeEventListener(CONSENT_PREFERENCES_EVENT, onOpenPrefs);
    };
  }, []);

  useEffect(() => {
    if (!prefsOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPendingTranslateItem(null);
        setPrefsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prefsOpen]);

  const specs = getConsentCategorySpecs(lang);

  const handleAcceptAll = () => {
    const next = acceptAllConsent();
    setConsent(next);
    setPrefsOpen(false);
    if (pendingTranslateItem && onGrantTranslateConsent) {
      const item = pendingTranslateItem;
      setPendingTranslateItem(null);
      onGrantTranslateConsent(item);
    } else {
      setPendingTranslateItem(null);
    }
  };

  const handleRefuseAll = () => {
    const next = refuseAllOptionalConsent();
    setConsent(next);
    setPendingTranslateItem(null);
    setPrefsOpen(false);
  };

  const handleSaveCustom = () => {
    const next = saveConsentState(draft);
    setConsent(next);
    setPrefsOpen(false);
    if (next.categories.preferences && pendingTranslateItem && onGrantTranslateConsent) {
      const item = pendingTranslateItem;
      setPendingTranslateItem(null);
      onGrantTranslateConsent(item);
    } else {
      setPendingTranslateItem(null);
    }
  };

  const handleAuthorizeTranslateNow = () => {
    const next = saveConsentState({ ...draft, preferences: true });
    setConsent(next);
    const item = pendingTranslateItem;
    setPendingTranslateItem(null);
    setPrefsOpen(false);
    if (item && onGrantTranslateConsent) {
      onGrantTranslateConsent(item);
    }
  };

  const showBanner = !consent.decisionMade && !prefsOpen;

  const formattedUpdatedAt = consent.updatedAt
    ? new Date(consent.updatedAt).toLocaleString(tr(lang, 'fr-CA', 'en-CA', 'es-ES', 'zh-CN'), {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : null;

  return (
    <>
      {showBanner && (
        <aside
          className="law25-consent-banner"
          role="dialog"
          aria-live="polite"
          aria-label={tr(
            lang,
            'Gestion des témoins (Loi 25)',
            'Cookie Preferences (Law 25)',
            'Preferencias de cookies (Ley 25)',
            'Cookie 隐私偏好（第 25 号法案）'
          )}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 95, 0.14)',
                  border: '1px solid rgba(212, 175, 95, 0.38)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                <ShieldCheck size={18} style={{ color: 'var(--gold)' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.94rem', color: '#ffffff' }}>
                    {tr(
                      lang,
                      'Protection de vos renseignements personnels (Loi 25)',
                      'Your Privacy & Cookie Choices (Quebec Law 25)',
                      'Protección de datos y cookies (Ley 25 de Quebec)',
                      '个人信息与 Cookie 隐私保护（魁北克第 25 号法案）'
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--gold-light)',
                      background: 'rgba(212, 175, 95, 0.12)',
                      border: '1px solid rgba(212, 175, 95, 0.3)',
                      borderRadius: '4px',
                      padding: '2px 6px'
                    }}
                  >
                    Loi 25
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {tr(
                    lang,
                    'Nous n’activons aucun témoin publicitaire ou analytique par défaut. Seul le stockage essentiel au bon fonctionnement du site est actif sans votre accord. Vous pouvez accepter, refuser ou personnaliser les modules optionnels (tels que la traduction additionnelle Google) à tout moment. ',
                    'We do not load advertising or analytics trackers by default. Only storage strictly necessary for site functionality runs without consent. You may accept, refuse, or customize optional modules (such as additional Google Translate languages) at any time. ',
                    'No activamos ningún rastreador publicitario ni analítico por defecto. Solo el almacenamiento esencial funciona sin consentimiento. Puede aceptar, rechazar o personalizar los módulos opcionales en cualquier momento. ',
                    '本站默认不启用任何广告追踪或第三方数据分析脚本，仅保存网站基础运行所必需的本地设置。您可随时同意、拒绝或自定义附加自动翻译等可选功能。'
                  )}
                  <button
                    type="button"
                    onClick={() => openLegalModal('privacy')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--gold-light)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      cursor: 'pointer',
                      fontSize: '0.81rem',
                      fontWeight: 600
                    }}
                  >
                    {tr(
                      lang,
                      'Politique de confidentialité',
                      'Privacy Policy',
                      'Política de privacidad',
                      '查看隐私政策'
                    )}
                  </button>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setDraft({ ...consent.categories });
                  setPendingTranslateItem(null);
                  setPrefsOpen(true);
                }}
                style={{ padding: '8px 14px', fontSize: '0.8rem' }}
              >
                <SlidersHorizontal size={13} />
                {tr(lang, 'Personnaliser', 'Customize', 'Personalizar', '自定义设置')}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={handleRefuseAll}
                style={{ padding: '8px 16px', fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.28)', color: '#ffffff' }}
              >
                {tr(lang, 'Tout refuser', 'Refuse All', 'Rechazar todo', '全部拒绝')}
              </button>
              <button
                type="button"
                className="btn-gold"
                onClick={handleAcceptAll}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                {tr(lang, 'Tout accepter', 'Accept All', 'Aceptar todo', '全部接受')}
              </button>
            </div>
          </div>
        </aside>
      )}

      {prefsOpen && (
        <div
          className="modal-backdrop law25-modal"
          style={{ zIndex: 240 }}
          onClick={() => {
            setPendingTranslateItem(null);
            setPrefsOpen(false);
          }}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={tr(
              lang,
              'Centre de préférences Loi 25',
              'Law 25 Privacy & Cookie Center',
              'Centro de preferencias Ley 25',
              '第 25 号法案隐私偏好中心'
            )}
          >
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
              <span className="badge-gold">
                {tr(
                  lang,
                  'Gestion des témoins • Loi 25',
                  'Cookie Settings • Law 25',
                  'Gestión de cookies • Ley 25',
                  'Cookie 偏好中心 • 第 25 号法案'
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPendingTranslateItem(null);
                  setPrefsOpen(false);
                }}
                aria-label={tr(lang, 'Fermer', 'Close', 'Cerrar', '关闭')}
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

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>
                  {tr(
                    lang,
                    'Vos préférences de confidentialité',
                    'Your Privacy Preferences',
                    'Sus preferencias de privacidad',
                    '您的隐私与 Cookie 设置'
                  )}
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {tr(
                    lang,
                    'Conformément à la Loi 25 du Québec, toutes les catégories non essentielles sont désactivées par défaut jusqu’à votre consentement explicite. Vous pouvez modifier ou retirer votre consentement en tout temps.',
                    'Under Quebec’s Law 25, all non-essential categories remain off by default until you explicitly opt in. You may update or withdraw your consent at any time.',
                    'De acuerdo con la Ley 25 de Quebec, todas las categorías no esenciales permanecen desactivadas por defecto hasta su consentimiento explícito.',
                    '根据魁北克第 25 号法案规定，所有非必要类别在未经您明确同意前均默认关闭。您可随时更改或撤回同意。'
                  )}
                </p>
                {formattedUpdatedAt && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', marginTop: '6px' }}>
                    {tr(lang, 'Dernière décision enregistrée : ', 'Last recorded choice: ', 'Última decisión registrada: ', '上次记录的选择：')}
                    {formattedUpdatedAt}
                  </div>
                )}
              </div>

              {pendingTranslateItem && (
                <div
                  style={{
                    background: 'rgba(212, 175, 95, 0.1)',
                    border: '1px solid rgba(212, 175, 95, 0.45)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: '#ffffff', lineHeight: 1.5 }}>
                    {tr(
                      lang,
                      `La traduction vers « ${pendingTranslateItem.label} » utilise le service tiers Google Translate (témoin googtrans). Souhaitez-vous activer les témoins de préférences pour traduire cette page ?`,
                      `Translating to "${pendingTranslateItem.label}" loads the third-party Google Translate service (googtrans cookie). Allow Preferences storage to translate this page?`,
                      `La traducción a «${pendingTranslateItem.label}» utiliza el servicio externo Google Translate (cookie googtrans). ¿Desea autorizar las cookies de preferencias para traducir esta página?`,
                      `翻译为“${pendingTranslateItem.label}”需按需加载第三方 Google Translate（googtrans Cookie）。是否允许启用“偏好设置”以继续翻译？`
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={handleAuthorizeTranslateNow}
                      style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                    >
                      <Check size={13} />
                      {tr(
                        lang,
                        'Autoriser et lancer la traduction',
                        'Allow & Translate Now',
                        'Permitir y traducir',
                        '允许并立即翻译'
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {specs.map((cat) => {
                  const enabled = cat.locked ? true : Boolean(draft[cat.id]);
                  return (
                    <div
                      key={cat.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: enabled && !cat.locked
                          ? '1px solid rgba(212, 175, 95, 0.4)'
                          : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{cat.title}</span>

                        {cat.locked ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--gold-light)',
                              background: 'rgba(212, 175, 95, 0.14)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {cat.badge}
                          </span>
                        ) : (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={enabled}
                            aria-label={cat.title}
                            onClick={() => setDraft((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                            style={{
                              width: '44px',
                              height: '24px',
                              borderRadius: '999px',
                              border: enabled ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.25)',
                              background: enabled ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                              position: 'relative',
                              cursor: 'pointer',
                              flexShrink: 0,
                              transition: 'background 0.2s ease'
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                top: '2px',
                                left: enabled ? '22px' : '2px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: enabled ? '#09090b' : '#ffffff',
                                transition: 'left 0.2s ease'
                              }}
                            />
                          </button>
                        )}
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '6px' }}>
                        {cat.description}
                      </p>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{cat.details}</div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--gold-light)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.78rem'
                  }}
                >
                  {tr(lang, 'Politique de confidentialité (Loi 25)', 'Privacy Policy (Law 25)', 'Política de privacidad (Ley 25)', '查看完整隐私政策')}
                </button>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" className="btn-outline" onClick={handleRefuseAll} style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                    {tr(lang, 'Tout refuser', 'Refuse All', 'Rechazar todo', '全部拒绝')}
                  </button>
                  <button type="button" className="btn-outline" onClick={handleSaveCustom} style={{ padding: '8px 14px', fontSize: '0.8rem', borderColor: 'var(--gold)', color: 'var(--gold-light)' }}>
                    {tr(lang, 'Enregistrer mes choix', 'Save Preferences', 'Guardar preferencias', '保存当前设置')}
                  </button>
                  <button type="button" className="btn-gold" onClick={handleAcceptAll} style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                    {tr(lang, 'Tout accepter', 'Accept All', 'Aceptar todo', '全部接受')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
