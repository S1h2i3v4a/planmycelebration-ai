import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/Icon';

export function ModulePlaceholderPage({
  navItem,
  onReturnHome,
  onOpenCreateEventModal
}) {
  return (
    <section aria-labelledby="placeholder-heading">
      <Card style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <Badge variant="info">
            Module {navItem.moduleNumber} — Coming Next
          </Badge>
          <Badge variant="neutral">Foundation Ready</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <h2 id="placeholder-heading">{navItem.label}</h2>
          <p>{navItem.description}</p>
        </div>

        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
            <Icon name="info" size={16} />
            <span>Transparent Implementation Status</span>
          </div>
          This destination is intentionally stubbed as part of{' '}
          <strong>Module 1 (Project Foundation & Design System)</strong>. No simulated data
          or non-functional controls are shown here until its dedicated module is implemented.
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <Button variant="primary" onClick={onReturnHome}>
            Return to Welcome & Overview
          </Button>
          <Button variant="secondary" onClick={() => onOpenCreateEventModal()}>
            <Icon name="plus" size={16} />
            <span>Preview Create Event Action</span>
          </Button>
        </div>
      </Card>
    </section>
  );
}
