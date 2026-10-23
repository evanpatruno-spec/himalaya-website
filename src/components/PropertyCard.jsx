import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { tr, pickLang } from '../data/translations';
import { formatDealPriceInCurrency, FALLBACK_CURRENCY_RATES } from '../utils/currencyService';

export default function PropertyCard({ deal, t, currency = 'CAD', rates = FALLBACK_CURRENCY_RATES, onSelect }) {
  const code = t?.code || 'FR';
  const isSold = deal.status === 'Vendu';
  const broker = (deal.brokers_details && deal.brokers_details[0]) || {
    name: deal.assigned_broker || 'Équipe Himalaya',
    photo: '/gx/00/defaut_courtier.jpg'
  };

  const locationLabel =
    deal.city && deal.region && deal.city !== deal.region
      ? `${deal.city} (${deal.region})`
      : deal.city || deal.region;

  const displayCategory = pickLang(deal, 'category', code) || deal.transaction_type;
  const rawPrice = pickLang(deal, 'price_raw', code);
  const displayPrice = formatDealPriceInCurrency(deal, rawPrice, currency, rates, code);
  const displayTitle = pickLang(deal, 'title', code);

  return (
    <div className="property-card" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <div className="property-img-wrap">
        <img
          src={deal.main_photo}
          alt={displayTitle}
          loading="lazy"
          decoding="async"
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80';
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap'
          }}
        >
          <span className="badge-gold">{displayCategory}</span>
          {isSold && (
            <span
              style={{
                background: 'var(--gold)',
                color: '#09090b',
                fontWeight: 800,
                fontSize: '0.7rem',
                padding: '3px 9px',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              {tr(code, 'VENDU', 'SOLD', 'VENDIDO', '已售')}
            </span>
          )}
        </div>

        {/* Prix et localisation intégrés au dégradé bas de la photo */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '16px',
            right: '16px',
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--gold-light)',
              fontSize: '1.15rem',
              letterSpacing: '0.01em',
              textShadow: '0 2px 10px rgba(0,0,0,0.85)'
            }}
          >
            {displayPrice}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              color: '#e4e4ea',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)'
            }}
          >
            <MapPin size={12} color="var(--gold)" style={{ flexShrink: 0 }} />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '170px'
              }}
            >
              {locationLabel}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '18px 2px 0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h3
            className="serif-title"
            style={{
              fontSize: '1.32rem',
              fontWeight: 600,
              marginBottom: '12px',
              lineHeight: 1.28,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {displayTitle}
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <img
              src={broker.photo}
              alt={broker.name}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'top center',
                border: '1px solid var(--gold)',
                flexShrink: 0
              }}
              onError={e => {
                e.target.src = '/gx/00/defaut_courtier.jpg';
              }}
            />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {broker.name}
            </span>
          </div>

          <span className="editorial-link" style={{ fontSize: '0.73rem' }}>
            {t.properties.viewListing} <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
