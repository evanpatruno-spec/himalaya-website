import React, { useState } from 'react';
import { X, Shield, CheckCircle2, Lock, Sparkles, Building2, FileText, ArrowRight } from 'lucide-react';

export default function BuyerNDAModal({ deal, onClose }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptNDA) return;
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 26px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(12, 19, 17, 0.98)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="var(--gold)" />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gold-light)' }}>
              Portail de Confidentialité OACIQ & Salle de Données Himalaya
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(56, 176, 0, 0.15)', border: '1px solid var(--success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', color: '#70e000'
              }}>
                <CheckCircle2 size={34} />
              </div>
              <h3 className="serif-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
                Entente de Confidentialité (NDA) Enregistrée
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: '520px', margin: '0 auto 22px' }}>
                Votre profil d’acquéreur qualifié a été transmis automatiquement dans le pipeline <strong>Himalaya Prospection & CRM</strong> et assigné à <strong>{deal?.assigned_broker || 'la Direction Himalaya'}</strong>.
              </p>
              <div style={{
                background: 'rgba(200, 164, 93, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '24px'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--gold-light)', marginBottom: '6px' }}>
                  ⚡ Automatisation Écosystème Himalaya (Zéro saisie manuelle) :
                </div>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Génération instantanée du PDF <code>TEMPLATE_NDA_Himalaya_Remplissable.pdf</code> horodaté</li>
                  <li>Création de la fiche acquéreur dans le CRM avec niveau de mise de fonds vérifié</li>
                  <li>Notification immédiate au courtier inscripteur pour déverrouiller les états financiers</li>
                </ul>
              </div>
              <button onClick={onClose} className="btn-gold">
                Retourner au portail Himalaya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                background: 'rgba(200, 164, 93, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    Dossier sélectionné
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.98rem' }}>
                    {deal ? `${deal.title} — ${deal.city} (MLS ${deal.mls_number})` : 'Accès Prioritaire Pocket Listings & Off-Market'}
                  </div>
                </div>
                {deal && (
                  <span className="badge-gold">{deal.price_raw}</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Nom complet de l’acquéreur *
                  </label>
                  <input 
                    required
                    type="text"
                    className="form-control"
                    placeholder="Ex. Jean-François Tremblay"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Société / Groupe d’investissement
                  </label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Ex. Groupe Immobilier Nord Inc."
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Courriel professionnel *
                  </label>
                  <input 
                    required
                    type="email"
                    className="form-control"
                    placeholder="nom@entreprise.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Téléphone direct *
                  </label>
                  <input 
                    required
                    type="tel"
                    className="form-control"
                    placeholder="(514) 000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Mise de fonds / Liquidités disponibles *
                  </label>
                  <select 
                    className="form-control"
                    value={formData.liquidity}
                    onChange={e => setFormData({ ...formData, liquidity: e.target.value })}
                  >
                    <option value="250k_500k">250 000 $ à 500 000 $</option>
                    <option value="500k_1m">500 000 $ à 1 000 000 $</option>
                    <option value="1m_3m">1 000 000 $ à 3 000 000 $</option>
                    <option value="3m_plus">Plus de 3 000 000 $ (Institutionnel)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Expérience en gestion commerciale / hôtelière
                  </label>
                  <select 
                    className="form-control"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="oui">Oui — Exploitant ou investisseur actif</option>
                    <option value="acquisition">En processus de première acquisition</option>
                    <option value="partenaire">Accompagné d’un gestionnaire en place</option>
                  </select>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '20px'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                  <input 
                    type="checkbox" 
                    required
                    checked={formData.acceptNDA}
                    onChange={e => setFormData({ ...formData, acceptNDA: e.target.checked })}
                    style={{ marginTop: '4px', accentColor: 'var(--gold)' }}
                  />
                  <span>
                    Je m’engage formellement à respecter la confidentialité stricte des états financiers, du nom de l’entreprise et des renseignements divulgués par <strong>Immobilier Himalaya Real Estate Corp.</strong>, et à ne pas contacter directement les employés ou propriétaires sans l’autorisation écrite du courtier inscripteur.
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={onClose} className="btn-outline">
                  Annuler
                </button>
                <button type="submit" className="btn-gold">
                  <Lock size={15} /> Signer le NDA
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
