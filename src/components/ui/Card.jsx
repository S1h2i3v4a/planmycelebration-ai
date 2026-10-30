import React from 'react';

export function Card({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  as: Component = 'div',
  ...rest
}) {
  const variantClass = variant === 'subtle' ? 'card-subtle' : '';
  const interactiveClass = interactive ? 'card-interactive' : '';

  return (
    <Component
      className={`card ${variantClass} ${interactiveClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}
