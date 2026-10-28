import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { tr } from '../data/translations';

export default function ContactView({
  lang,
  t,
  contactTab,
  setContactTab,
  contactSubmitted,
  setContactSubmitted,
  contactForm,
  setContactForm,
  handleContactSubmit
}) {
  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '56px', alignItems: 'start' }}>
          <div>
            <h1 className="serif-title" style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '10px' }}>{t.contact.title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: 1.65 }}>
              {t.contact.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600 }}>{t.contact.hqLabel}</div>
                <div className="serif-title" style={{ fontWeight: 600, fontSize: '1.35rem', marginTop: '6px' }}>Immobilier Himalaya Real Estate Corp.</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{t.contact.hqAddress}</div>
                <div style={{ display: 'flex', gap: '18px', marginTop: '12px', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                  <a href="tel:18008204828" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>1 800 820-4828</a>
                  <a href="mailto:info@himalayacorp.com" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>info@himalayacorp.com</a>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600 }}>{t.contact.leadershipLabel}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px', lineHeight: 1.85 }}>
                  <strong style={{ color: '#fff' }}>Roger Rhéaume</strong> ({t.contact.rolePresident}) : <a href="tel:5145852605" style={{ color: 'var(--gold-light)' }}>(514) 585-2605</a><br />
                  <strong style={{ color: '#fff' }}>Geniev Mondoux</strong> ({t.contact.roleVP}) : <a href="tel:5148841052" style={{ color: 'var(--gold-light)' }}>(514) 884-1052</a><br />
                  <strong style={{ color: '#fff' }}>Mike Ainajian</strong> ({t.contact.roleDirector}) : <a href="tel:5148984898" style={{ color: 'var(--gold-light)' }}>(514) 898-4898</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Bascule sobre par onglets soulignés : Message général | Vendre / Évaluer ma propriété */}
            <div style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '24px'
            }}>
              <button
                type="button"
                onClick={() => { setContactTab('general'); setContactSubmitted(false); }}
                style={{
                  padding: '0 0 12px', border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: 'transparent',
                  color: contactTab === 'general' ? 'var(--gold-light)' : 'var(--text-secondary)',
                  borderBottom: contactTab === 'general' ? '2px solid var(--gold)' : '2px solid transparent'
                }}
              >
                {t.contact.tabGeneral}
              </button>
              <button
                type="button"
                onClick={() => { setContactTab('valuation'); setContactSubmitted(false); }}
                style={{
                  padding: '0 0 12px', border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: 'transparent',
                  color: contactTab === 'valuation' ? 'var(--gold-light)' : 'var(--text-secondary)',
                  borderBottom: contactTab === 'valuation' ? '2px solid var(--gold)' : '2px solid transparent'
                }}
              >
                {t.contact.tabValuation}
              </button>
            </div>

            {contactSubmitted ? (
              <div style={{ textAlign: 'center', padding: '28px 10px' }}>
                <CheckCircle2 size={42} color="#e3c485" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px' }}>{t.contact.sentTitle}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '18px', fontSize: '0.88rem' }}>
                  {t.contact.sentDesc}
                </p>
                <button onClick={() => setContactSubmitted(false)} className="btn-gold">{t.contact.newMsgBtn}</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {contactTab === 'valuation' ? (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {t.contact.assetTypeLabel}
                        </label>
                        <select
                          className="form-control"
                          value={contactForm.assetType}
                          onChange={e => setContactForm({ ...contactForm, assetType: e.target.value })}
                        >
                          <option value={t.contact.assetOpt1}>{t.contact.assetOpt1}</option>
                          <option value={t.contact.assetOpt2}>{t.contact.assetOpt2}</option>
                          <option value={t.contact.assetOpt3}>{t.contact.assetOpt3}</option>
                          <option value={t.contact.assetOpt4}>{t.contact.assetOpt4}</option>
                          <option value={t.contact.assetOpt5}>{t.contact.assetOpt5}</option>
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder={t.contact.cityPlaceholder}
                          value={contactForm.city}
                          onChange={e => setContactForm({ ...contactForm, city: e.target.value })}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t.contact.revenuePlaceholder}
                          value={contactForm.revenue}
                          onChange={e => setContactForm({ ...contactForm, revenue: e.target.value })}
                        />
                      </div>
                    </>
                  ) : (
                    <select
                      className="form-control"
                      value={contactForm.subject}
                      onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    >
                      <option value={t.contact.subjectOpt1}>{t.contact.subjectOpt1}</option>
                      <option value={t.contact.subjectOpt2}>{t.contact.subjectOpt2}</option>
                      <option value={t.contact.subjectOpt3}>{t.contact.subjectOpt3}</option>
                    </select>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      required
                      type="text"
                      className="form-control"
                      placeholder={t.contact.namePlaceholder}
                      value={contactForm.fullName}
                      onChange={e => setContactForm({ ...contactForm, fullName: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      className="form-control"
                      placeholder={t.contact.phonePlaceholder}
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                  <input
                    required
                    type="email"
                    className="form-control"
                    placeholder={t.contact.emailPlaceholder}
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  />

                  {/* Créneau de rappel préféré */}
                  <div style={{ paddingTop: '6px', paddingBottom: '4px' }}>
                    <div style={{ fontSize: '0.73rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '8px' }}>
                      {tr(lang, 'Moment de rappel préféré', 'Preferred Callback Time', 'Horario de contacto preferido', '首选回电时段')}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { id: 'Matin (8h–12h)', label: tr(lang, 'Matin (8h–12h)', 'Morning (8am–12pm)', 'Mañana (8h–12h)', '上午 (8:00–12:00)') },
                        { id: 'Après-midi (12h–17h)', label: tr(lang, 'Après-midi (12h–17h)', 'Afternoon (12pm–5pm)', 'Tarde (12h–17h)', '下午 (12:00–17:00)') },
                        { id: 'Soir (17h–20h)', label: tr(lang, 'Soir (17h–20h)', 'Evening (5pm–8pm)', 'Noche (17h–20h)', '晚间 (17:00–20:00)') },
                        { id: 'Par courriel', label: tr(lang, 'Par courriel', 'By Email Only', 'Solo por correo', '仅限邮件联系') }
                      ].map(slot => {
                        const active = contactForm.preferredTime === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setContactForm({ ...contactForm, preferredTime: slot.id })}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: active ? 600 : 400,
                              cursor: 'pointer',
                              background: active ? 'rgba(200, 164, 93, 0.16)' : 'transparent',
                              border: active ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.14)',
                              color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={3}
                    className="form-control"
                    placeholder={t.contact.msgPlaceholder}
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                  <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                    {contactTab === 'valuation' ? t.contact.submitValuationBtn : t.contact.submitBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
