import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/Icon';
import { loadSavedEvents } from '../utils/storage';

export function SettingsPage() {
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    try {
      const raw = window.localStorage.getItem('pmc_ai_v1_events') || '[]';
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `plan-my-celebration-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleClearAllData = () => {
    try {
      window.localStorage.removeItem('pmc_ai_v1_events');
      window.localStorage.removeItem('pmc_ai_v1_active_event_id');
      window.location.reload();
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  const { events } = loadSavedEvents();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: '4px'
          }}
        >
          <Badge variant="plum">PromptWars 2026 Challenge 5</Badge>
          <Badge variant="neutral">Version 1.0.0</Badge>
        </div>
        <h2>Settings & About — PlanMyCelebration AI</h2>
        <p style={{ fontSize: 'var(--text-sm)' }}>
          Review application architecture, local data persistence, and storage controls.
        </p>
      </div>

      {exportSuccess && (
        <div
          style={{
            padding: 'var(--space-3)',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success-text)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600
          }}
        >
          ✓ Celebration backup JSON exported successfully!
        </div>
      )}

      <div className="dashboard-split">
        {/* Left Column: About & AI Integration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3>Product Overview & Vision</h3>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              <strong>PlanMyCelebration AI</strong> is a production-inspired SaaS application built
              for PromptWars 2026. It helps individuals and community organizers plan weddings,
              birthdays, anniversaries, college festivals, and community celebrations in one
              organized workspace.
            </p>
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 'var(--space-3)'
              }}
            >
              <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: '4px' }}>
                Automated AI Synthesis
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Powered by Google Gemini 3.5 Flash, the AI Event Planner synthesizes tailored concepts,
                theme directions, preparation milestones, and sensible budget allocations instantly upon request.
              </p>
            </div>
          </Card>

          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3>Local Storage Persistence</h3>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              All celebration workspaces, budget ledgers, and task checklists are stored strictly
              in your browser's <code>localStorage</code> (<code>pmc_ai_v1_*</code>).
            </p>
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)'
              }}
            >
              <strong>Privacy Notice:</strong> Your data remains entirely on your device and is never
              synced to external cloud databases unless you export backup files manually.
            </div>
          </Card>
        </div>

        {/* Right Column: Data Management & Storage Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3>Browser Storage Statistics</h3>
            <div className="event-card-stats">
              <div>
                <span className="stat-mini-label">Saved Events</span>
                <strong className="stat-mini-value">{events.length}</strong>
              </div>
              <div>
                <span className="stat-mini-label">Namespace</span>
                <strong className="stat-mini-value">pmc_ai_v1</strong>
              </div>
              <div>
                <span className="stat-mini-label">Storage Engine</span>
                <strong className="stat-mini-value">localStorage</strong>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                marginTop: 'var(--space-2)'
              }}
            >
              <Button variant="secondary" onClick={handleExportData}>
                <Icon name="download" size={16} />
                <span>Export Celebration JSON Backup</span>
              </Button>

              <Button variant="danger" onClick={() => setClearModalOpen(true)}>
                <Icon name="trash" size={16} />
                <span>Clear All Browser Data</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Confirm Data Erasure"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClearModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearAllData}>
              Yes, Clear All Local Data
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)' }}>
          Are you sure you want to clear all saved events, budget ledgers, and task checklists
          from this browser? This action cannot be undone unless you exported a JSON backup first.
        </p>
      </Modal>
    </div>
  );
}

export default SettingsPage;
