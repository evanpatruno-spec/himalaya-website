import React from 'react';
import { tr } from '../data/translations';
import { openLegalModal } from '../utils/consentManager';

/**
 * Case de consentement Loi 25 réutilisable sur tous les formulaires
 * recueillant des renseignements personnels.
 */
export default function Law25FormConsent({
  lang,
  checked,
  onChange,
  compact = false
}) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: compact ? '10px 12px' : '12px 14px'
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          cursor: 'pointer',
          fontSize: compact ? '0.77rem' : '0.8rem',
          lineHeight: 1.5,
          color: 'var(--text-secondary)'
        }}
      >
        <input
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{
            marginTop: '3px',
            flexShrink: 0,
            width: '15px',
            height: '15px',
            accentColor: 'var(--gold)',
            cursor: 'pointer'
          }}
        />
        <span>
          {tr(
            lang,
            'J’accepte que mes renseignements personnels soient utilisés par Immobilier Himalaya Real Estate Corp. pour traiter ma demande, conformément à la Loi 25 et à la ',
            'I consent to Immobilier Himalaya Real Estate Corp. collecting and using my personal information to respond to my inquiry, in accordance with Law 25 and the ',
            'Acepto que mis datos personales sean utilizados por Immobilier Himalaya Real Estate Corp. para atender mi solicitud, conforme a la Ley 25 y a la ',
            '本人同意喜马拉雅地产集团（Immobilier Himalaya Real Estate Corp.）根据魁北克第 25 号法案及以下文件处理我的个人信息以回复本次咨询：'
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openLegalModal('privacy');
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--gold-light)',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontWeight: 600
            }}
          >
            {tr(
              lang,
              'Politique de confidentialité',
              'Privacy Policy',
              'Política de privacidad',
              '隐私政策'
            )}
          </button>
          .
        </span>
      </label>
    </div>
  );
}
