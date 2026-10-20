import React, { useState, useEffect } from 'react';
import { X, Shield, CheckCircle2, Lock } from 'lucide-react';
import { submitLeadToProspection, markNdaSigned } from '../utils/prospectionBridge';
import { tr, pickLang } from '../data/translations';

export default function BuyerNDAModal({ deal, t, onClose }) {
  const lang = t?.code || 'FR';
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    liquidity: '500k_1m',
    experience: 'oui',
    acceptNDA: false
  });
  const [submitted, setSubmitted] = useState(false);

  // Verrouillage du scroll + touche Escape (Point 7)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptNDA) return;

    markNdaSigned(deal?.mls_number);
    await submitLeadToProspection({
      type: 'nda',
      fullName: formData.fullName,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      liquidity: formData.liquidity,
      experience: formData.experience,
      mls: deal?.mls_number || 'Hors-Marché',
      dealTitle: deal?.title || 'Pocket Listings',
      dealCity: deal?.city || '',
      region: deal?.region || '',
      assigned_broker: deal?.assigned_broker || 'Roger Rhéaume'
    });
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(18, 18, 21, 0.98)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--gold)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gold-light)' }}>
              {t?.nda?.header || tr(lang, 'Entente de Confidentialité (NDA)', 'Non-Disclosure Agreement (NDA)', 'Acuerdo de Confidencialidad (NDA)', '保密协议 (NDA)')}
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <CheckCircle2 size={44} color="#e3c485" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
                {t?.nda?.successTitle || tr(lang, 'NDA enregistré et synchronisé', 'NDA Registered & Synchronized', 'NDA registrado y sincronizado', '保密协议 (NDA) 已签署并同步')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 20px' }}>
                {t?.nda?.successDesc || tr(
                  lang,
                  'Votre profil d’acquéreur qualifié a été transmis au courtier inscripteur et synchronisé dans Himalaya Prospection.',
                  'Your qualified buyer profile has been forwarded to the listing broker and synchronized with Himalaya Prospection.',
                  'Su perfil de comprador calificado ha sido enviado al corredor responsable y sincronizado con Himalaya Prospection.',
                  '您的合格买家资料已转发给负责经纪人，并同步至喜马拉雅客户管理系统。'
                )}
              </p>
              <button onClick={onClose} className="btn-gold">
                {t?.nda?.backBtn || tr(lang, 'Retourner au site', 'Return to site', 'Volver al sitio', '返回网站')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                background: 'rgba(200, 164, 93, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    {t?.nda?.selectedFile || tr(lang, 'Dossier sélectionné', 'Selected File', 'Expediente seleccionado', '已选项目档案')}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                    {deal
                      ? `${pickLang(deal, 'title', lang)} — ${deal.city}`
                      : (t?.nda?.offMarketAccess || tr(lang, 'Accès Prioritaire Dossiers Hors-Marché', 'Priority Access to Off-Market Listings', 'Acceso Prioritario a Propiedades Fuera de Mercado', '场外机密房源优先访问权限'))}
                  </div>
                </div>
                {deal && <span className="badge-gold">{pickLang(deal, 'price_raw', lang)}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t?.nda?.fullName || tr(lang, 'Nom complet *', 'Full Name *', 'Nombre completo *', '姓名 *')}
                  </label>
                  <input 
                    required
                    type="text"
                    className="form-control"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t?.nda?.company || tr(lang, 'Société / Groupe', 'Company / Group', 'Empresa / Grupo', '公司 / 集团')}
                  </label>
                  <input 
                    type="text"
                    className="form-control"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t?.nda?.email || tr(lang, 'Courriel *', 'Email *', 'Correo electrónico *', '电子邮箱 *')}
                  </label>
                  <input 
                    required
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t?.nda?.phone || tr(lang, 'Téléphone *', 'Phone *', 'Teléfono *', '联系电话 *')}
                  </label>
                  <input 
                    required
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t?.nda?.liquidity || tr(lang, 'Mise de fonds disponible *', 'Available Down Payment *', 'Capital disponible (Pago inicial) *', '可用首付资金 *')}
                  </label>
                  <select 
                    className="form-control"
                    value={formData.liquidity}
                    onChange={e => setFormData({ ...formData, liquidity: e.target.value })}
                  >
                    <option value="250k_500k">250 000 $ – 500 000 $</option>
                    <option value="500k_1m">500 000 $ – 1 000 000 $</option>
                    <option value="1m_3m">1 000 000 $ – 3 000 000 $</option>
                    <option value="3m_plus">3 000 000 $ +</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t?.nda?.experience || tr(lang, 'Profil d’acquéreur', 'Buyer Profile', 'Perfil del comprador', '买家背景')}
                  </label>
                  <select 
                    className="form-control"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="oui">{t?.nda?.expActive || tr(lang, 'Exploitant ou investisseur actif', 'Active Operator or Investor', 'Operador o inversionista activo', '活跃运营商或资深投资者')}</option>
                    <option value="acquisition">{t?.nda?.expFirst || tr(lang, 'Première acquisition', 'First Acquisition', 'Primera adquisición', '首次收购')}</option>
                    <option value="partenaire">{t?.nda?.expPartner || tr(lang, 'Accompagné d’un gestionnaire', 'Partnered with a Manager', 'Acompañado por un gestor', '携手专业运营管理团队')}</option>
                  </select>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '18px'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <input 
                    type="checkbox" 
                    required
                    checked={formData.acceptNDA}
                    onChange={e => setFormData({ ...formData, acceptNDA: e.target.checked })}
                    style={{ marginTop: '3px', accentColor: 'var(--gold)' }}
                  />
                  <span>
                    {t?.nda?.legalText || tr(
                      lang,
                      'Je m’engage à respecter la confidentialité stricte des états financiers et des renseignements divulgués par Immobilier Himalaya Real Estate Corp.',
                      'I agree to maintain strict confidentiality regarding all financial statements and information disclosed by Immobilier Himalaya Real Estate Corp.',
                      'Me comprometo a mantener estricta confidencialidad sobre los estados financieros y la información divulgada por Immobilier Himalaya Real Estate Corp.',
                      '我承诺对 Immobilier Himalaya Real Estate Corp. 披露的所有财务报表及商业信息严格保密。'
                    )}
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={onClose} className="btn-outline">
                  {t?.nda?.cancel || tr(lang, 'Annuler', 'Cancel', 'Cancelar', '取消')}
                </button>
                <button type="submit" className="btn-gold">
                  <Lock size={14} /> {t?.nda?.submit || tr(lang, 'Signer le NDA', 'Sign NDA', 'Firmar NDA', '签署保密协议 (NDA)')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
