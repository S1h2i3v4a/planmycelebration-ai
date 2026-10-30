import React from 'react';

export function Badge({ children, variant = 'neutral', className = '' }) {
  const variantClass = {
    plum: 'badge-plum',
    coral: 'badge-coral',
    gold: 'badge-gold',
    info: 'badge-info',
    neutral: 'badge-neutral'
  }[variant] || 'badge-neutral';

  return (
    <span className={`badge ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
