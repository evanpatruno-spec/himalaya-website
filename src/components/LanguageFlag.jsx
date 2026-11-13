import React, { useId } from 'react';

function buildStarPoints(cx, cy, outerR, angleDeg = -90) {
  const innerR = outerR * 0.382;
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const rad = ((angleDeg + i * 36) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(rad)).toFixed(2)},${(cy + r * Math.sin(rad)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/**
 * Vector country/language flags for native interface and broker spoken languages
 * (FR, EN, ES, ZH, AR, HY, HT).
 * Rendered as inline SVGs so flags display consistently on Windows, macOS, and mobile browsers.
 */
export default function LanguageFlag({ code, width = 22, height = 15, bordered = false, style = {} }) {
  const clipId = useId();
  const normalizedCode = String(code || '').toUpperCase();
  const baseStyle = {
    display: 'block',
    borderRadius: '2px',
    flexShrink: 0,
    ...(bordered ? { boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.16)' } : null),
    ...style
  };

  if (normalizedCode === 'FR') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" aria-hidden="true" style={baseStyle}>
        <rect x="0" y="0" width="8" height="16" fill="#002654" />
        <rect x="8" y="0" width="8" height="16" fill="#FFFFFF" />
        <rect x="16" y="0" width="8" height="16" fill="#CE1126" />
      </svg>
    );
  }

  if (normalizedCode === 'EN') {
    return (
      <svg width={width} height={height} viewBox="0 0 60 40" aria-hidden="true" style={baseStyle}>
        <defs>
          <clipPath id={clipId}>
            <rect width="60" height="40" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth="13" />
          <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7.5" />
        </g>
      </svg>
    );
  }

  if (normalizedCode === 'ES') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" aria-hidden="true" style={baseStyle}>
        <rect width="24" height="16" fill="#C60B1E" />
        <rect y="4" width="24" height="8" fill="#FFC400" />
        <rect x="5.5" y="6.2" width="2.6" height="3.6" rx="0.6" fill="#AA151B" />
        <rect x="6.1" y="5.4" width="1.4" height="0.8" rx="0.2" fill="#B58900" />
      </svg>
    );
  }

  if (normalizedCode === 'ZH') {
    return (
      <svg width={width} height={height} viewBox="0 0 30 20" aria-hidden="true" style={baseStyle}>
        <rect width="30" height="20" fill="#DE2910" />
        <polygon points={buildStarPoints(5, 5, 2.9, -90)} fill="#FFDE00" />
        <polygon points={buildStarPoints(10, 2, 0.95, -67)} fill="#FFDE00" />
        <polygon points={buildStarPoints(12, 4, 0.95, -45)} fill="#FFDE00" />
        <polygon points={buildStarPoints(12, 7, 0.95, -20)} fill="#FFDE00" />
        <polygon points={buildStarPoints(10, 9, 0.95, 0)} fill="#FFDE00" />
      </svg>
    );
  }

  if (normalizedCode === 'AR') {
    return (
      <svg width={width} height={height} viewBox="0 0 30 20" aria-hidden="true" style={baseStyle}>
        <rect width="30" height="20" fill="#006C35" />
        <g fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5,8.7 H18.2 M21.4,6.4 V8.7 M19.4,5.4 V8.7 M16.9,5.3 V8.7 H14.4 M15.6,6.7 V8.7" strokeWidth="1" />
          <path d="M13.2,8.7 H10.2 M12.2,5.1 V8.7 M10.6,5.1 V8.7 M9.1,5.4 V8.3 C8.4,8.9 7.6,8.7 7.5,7.8 V6.2" strokeWidth="1" />
          <path d="M7.5,5.2 H8.6 M11.4,4.3 H12.8 M16.2,4.3 H17.4 M20.5,4.6 H22.1" strokeWidth="0.7" />
        </g>
        <path
          d="M7.6,13.9 L20.5,13.4 L20.7,12.5 L21.4,12.5 L21.4,13.5 L23.4,13.4 L23.4,14.3 L21.4,14.3 L21.4,15.3 L20.7,15.3 L20.5,14.4 Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (normalizedCode === 'HY') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" aria-hidden="true" style={baseStyle}>
        <rect width="24" height="16" fill="#0033A0" />
        <rect x="0" y="0" width="24" height="5.4" fill="#D90012" />
        <rect x="0" y="10.6" width="24" height="5.4" fill="#F2A800" />
      </svg>
    );
  }

  if (normalizedCode === 'HT') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" aria-hidden="true" style={baseStyle}>
        <rect x="0" y="0" width="24" height="8.1" fill="#00209F" />
        <rect x="0" y="8" width="24" height="8" fill="#D21034" />
        <rect x="9" y="5" width="6" height="6" rx="0.4" fill="#FFFFFF" />
        <rect x="9.5" y="9.1" width="5" height="1.4" fill="#016A16" />
        <path
          d="M12,6 V9.2 M10.6,6.6 Q12,5.6 13.4,6.6 M10.9,7.3 Q12,6.4 13.1,7.3"
          stroke="#016A16"
          strokeWidth="0.7"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="10.7" y="8.4" width="2.6" height="0.8" fill="#D21034" />
        <circle cx="12" cy="8.2" r="0.55" fill="#F1B517" />
      </svg>
    );
  }

  return null;
}
