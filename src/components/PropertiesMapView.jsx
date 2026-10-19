import React, { useState, useMemo } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

/**
 * Vue Carte Interactive minimaliste et sobre (Point 11)
 * Affiche les pôles géographiques sur une carte interactive épurée + sélection directe des propriétés
 */
const REGION_POSITIONS = {
  'Abitibi-Témiscamingue': { x: 18, y: 42 },
  'Outaouais': { x: 26, y: 68 },
  'Laurentides': { x: 36, y: 58 },
  'Lanaudière': { x: 43, y: 54 },
  'Laval': { x: 39, y: 69 },
  'Montréal': { x: 42, y: 74 },
  'Montérégie': { x: 46, y: 80 },
  'Estrie': { x: 54, y: 82 },
  'Mauricie': { x: 49, y: 46 },
  'Région de Québec': { x: 60, y: 48 },
  'Bas-Saint-Laurent': { x: 72, y: 38 },
  'Côte-Nord': { x: 74, y: 22 },
  'Gaspésie': { x: 85, y: 34 },
  'République Dominicaine': { x: 84, y: 82 }
};

export default function PropertiesMapView({ properties, onSelectDeal, t }) {
  const groupedByRegion = useMemo(() => {
    const map = {};
    properties.forEach(p => {
      const reg = p.region || 'Montréal';
      if (!map[reg]) map[reg] = [];
      map[reg].push(p);
    });
    return map;
  }, [properties]);

  const regionsList = Object.keys(groupedByRegion);
  const [activeRegion, setActiveRegion] = useState(regionsList[0] || 'Montréal');

  const currentRegion = groupedByRegion[activeRegion] ? activeRegion : (regionsList[0] || '');
  const regionDeals = groupedByRegion[currentRegion] || [];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '14px',
      padding: '20px'
    }}>
      {/* Carte interactive des pôles régionaux */}
      <div style={{
        position: 'relative',
        height: '440px',
        background: 'radial-gradient(circle at 45% 55%, #13201c 0%, #070b0a 100%)',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        {/* Grille cartographique subtile */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.22 }}>
          <path d="M 10 85 Q 35 65 55 48 T 92 25" fill="none" stroke="#c8a45d" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#ffffff" strokeWidth="0.15" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeWidth="0.15" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#ffffff" strokeWidth="0.15" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="#ffffff" strokeWidth="0.15" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="0.15" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="#ffffff" strokeWidth="0.15" />
        </svg>

        <div style={{
          position: 'absolute', top: '12px', left: '14px',
          fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>
          {t?.properties?.mapTitle || 'Québec & International — Cliquez sur une région'}
        </div>

        {regionsList.map(reg => {
          const pos = REGION_POSITIONS[reg] || { x: 50, y: 50 };
          const count = groupedByRegion[reg].length;
          const isSelected = reg === currentRegion;

          return (
            <button
              key={reg}
              onClick={() => setActiveRegion(reg)}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                background: isSelected ? 'var(--gold)' : 'rgba(14, 21, 19, 0.92)',
                color: isSelected ? '#070b0a' : 'var(--text-main)',
                border: isSelected ? '2px solid #fff' : '1px solid var(--gold)',
                borderRadius: '999px',
                padding: '5px 11px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 0 20px rgba(200,164,93,0.6)' : '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: isSelected ? 10 : 2,
                transition: 'all 0.2s ease'
              }}
            >
              <MapPin size={12} />
              <span>{reg}</span>
              <span style={{
                background: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(200,164,93,0.2)',
                color: isSelected ? '#070b0a' : 'var(--gold-light)',
                padding: '1px 6px',
                borderRadius: '99px',
                fontSize: '0.7rem'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Liste des propriétés de la région sélectionnée */}
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '440px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{currentRegion}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {regionDeals.length} {t?.properties?.activeMandates || 'inscriptions'}
            </span>
          </div>
        </div>

        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
          {regionDeals.map(deal => (
            <div
              key={deal.id}
              onClick={() => onSelectDeal(deal)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
            >
              <img
                src={deal.main_photo}
                alt={t?.code === 'EN' ? (deal.title_en || deal.title) : deal.title}
                style={{ width: '78px', height: '62px', objectFit: 'cover', borderRadius: '7px', flexShrink: 0 }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'; }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t?.code === 'EN' ? (deal.title_en || deal.title) : deal.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {deal.city} • MLS {deal.mls_number}
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '3px' }}>
                  {t?.code === 'EN' ? (deal.price_raw_en || deal.price_raw) : deal.price_raw}
                </div>
              </div>
              <ChevronRight size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
