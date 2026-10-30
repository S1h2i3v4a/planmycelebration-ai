import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PlanMyCelebration AI Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 'var(--space-10) var(--space-4)',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <Card
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              textAlign: 'center'
            }}
          >
            <h2>Something unexpected occurred in this workspace</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {this.state.error?.message || 'An unexpected rendering or storage error occurred.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
              <Button
                variant="primary"
                onClick={() => {
                  window.localStorage.removeItem('pmc_ai_v1_active_event_id');
                  window.location.reload();
                }}
              >
                Reload Application & Reset Active State
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
