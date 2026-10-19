import React, { useState, useEffect } from 'react';
import { X, Shield, CheckCircle2, Lock } from 'lucide-react';
import { submitLeadToProspection, markNdaSigned } from '../utils/prospectionBridge';

export default function BuyerNDAModal({ deal, t, onClose }) {
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
          background: 'rgba(12, 19, 17, 0.98)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--gold)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gold-light)' }}>
              {t?.nda?.header || 'Entente de Confidentialité (NDA)'}
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
              <CheckCircle2 size={44} color="#70e000" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
                {t?.nda?.successTitle || 'NDA enregistré et synchronisé'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 20px' }}>
                {t?.nda?.successDesc || 'Votre profil d’acquéreur qualifié a été transmis au courtier inscripteur et synchronisé dans Himalaya Prospection.'}
              </p>
              <button onClick={onClose} className="btn-gold">
                {t?.nda?.backBtn || 'Retourner au site'}
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
                    {t?.nda?.selectedFile || 'Dossier sélectionné'}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                    {deal ? `${deal.title} — ${deal.city}` : (t?.nda?.offMarketAccess || 'Accès Prioritaire Dossiers Hors-Marché')}
                  </div>
                </div>
                {deal && <span className="badge-gold">{deal.price_raw}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t?.nda?.fullName || 'Nom complet *'}
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
                    {t?.nda?.company || 'Société / Groupe'}
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
                    {t?.nda?.email || 'Courriel *'}
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
                    {t?.nda?.phone || 'Téléphone *'}
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
                    {t?.nda?.liquidity || 'Mise de fonds disponible *'}
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
                    {t?.nda?.experience || 'Profil d’acquéreur'}
                  </label>
                  <select 
                    className="form-control"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="oui">{t?.nda?.expActive || 'Exploitant ou investisseur actif'}</option>
                    <option value="acquisition">{t?.nda?.expFirst || 'Première acquisition'}</option>
                    <option value="partenaire">{t?.nda?.expPartner || 'Accompagné d’un gestionnaire'}</option>
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
                    {t?.nda?.legalText || 'Je m’engage à respecter la confidentialité stricte des états financiers et des renseignements divulgués par Immobilier Himalaya Real Estate Corp.'}
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={onClose} className="btn-outline">
                  {t?.nda?.cancel || 'Annuler'}
                </button>
                <button type="submit" className="btn-gold">
                  <Lock size={14} /> {t?.nda?.submit || 'Signer le NDA'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
