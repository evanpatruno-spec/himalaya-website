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
 * Vector country/language flags for native interface languages (FR, EN, ES, ZH).
 * Rendered as inline SVGs so flags display consistently on Windows, macOS, and mobile browsers.
 */
export default function LanguageFlag({ code, width = 22, height = 15, style = {} }) {
  const clipId = useId();
  const baseStyle = {
    display: 'block',
    borderRadius: '2px',
    flexShrink: 0,
    ...style
  };

  if (code === 'FR') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" aria-hidden="true" style={baseStyle}>
        <rect x="0" y="0" width="8" height="16" fill="#002654" />
        <rect x="8" y="0" width="8" height="16" fill="#FFFFFF" />
        <rect x="16" y="0" width="8" height="16" fill="#CE1126" />
      </svg>
    );
  }

  if (code === 'EN') {
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

  if (code === 'ES') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" aria-hidden="true" style={baseStyle}>
        <rect width="24" height="16" fill="#C60B1E" />
        <rect y="4" width="24" height="8" fill="#FFC400" />
        <rect x="5.5" y="6.2" width="2.6" height="3.6" rx="0.6" fill="#AA151B" />
        <rect x="6.1" y="5.4" width="1.4" height="0.8" rx="0.2" fill="#B58900" />
      </svg>
    );
  }

  if (code === 'ZH') {
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

  return null;
}
