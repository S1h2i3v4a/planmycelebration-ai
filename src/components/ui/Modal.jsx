import React, { useEffect } from 'react';
import { Icon } from '../Icon';
import { Button } from './Button';

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'lg' ? 'modal-panel-lg' : '';

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-panel ${sizeClass}`.trim()}>
        <div className="modal-header">
          <h2 id="modal-dialog-title" style={{ fontSize: 'var(--text-lg)' }}>
            {title}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ padding: '0.35rem' }}
          >
            <Icon name="close" size={18} />
          </Button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
