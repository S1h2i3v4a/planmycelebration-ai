import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/Icon';
import {
  EVENT_CATEGORIES_PREVIEW,
  WORKFLOW_STEPS
} from '../utils/navigation';

export function WelcomePage({
  savedEventCount = 0,
  onOpenCreateEventModal,
  onSelectCategory,
  onLoadSampleEvent,
  onReturnToDashboard
}) {
  return (
    <>
      {/* Top Welcome & Empty Workspace Section */}
      <section aria-labelledby="welcome-heading">
        <div className="hero-banner">
          <Card className="hero-copy">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Badge variant="plum">Celebration & Event Planner</Badge>
                {savedEventCount > 0 && (
                  <Badge variant="coral">{savedEventCount} Saved in Browser</Badge>
                )}
              </div>
              <h2 id="welcome-heading" style={{ fontSize: 'var(--text-2xl)' }}>
                Turn your celebration vision and budget into a calm, structured plan.
              </h2>
              <p>
                PlanMyCelebration AI helps you organize weddings, milestone birthdays,
                anniversaries, college festivals, and community gatherings in one workspace.
                Establish your budget in INR, generate practical preparation timelines, and
                track every task without spreadsheet clutter.
              </p>
            </div>

            <div className="hero-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenCreateEventModal()}
              >
                <Icon name="plus" size={18} />
                <span>Create your first event</span>
              </Button>
              {savedEventCount > 0 ? (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onReturnToDashboard}
                >
                  <span>Open Overview Dashboard</span>
                  <Icon name="arrow-right" size={16} />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onLoadSampleEvent}
                >
                  <Icon name="sparkles" size={18} />
                  <span>Try with Sample Event</span>
                </Button>
              )}
            </div>
          </Card>

          {/* Honest Workspace Status Card */}
          <div className="empty-workspace-card" aria-label="Current Workspace Status">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant={savedEventCount > 0 ? 'plum' : 'neutral'}>
                  {savedEventCount > 0 ? 'Workspace Active' : 'Workspace Empty'}
                </Badge>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {savedEventCount} saved event{savedEventCount === 1 ? '' : 's'}
                </span>
              </div>
              <h3 style={{ marginTop: 'var(--space-2)' }}>
                {savedEventCount > 0
                  ? 'Your celebration data is saved in this browser'
                  : 'No events created in this browser yet'}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)' }}>
                Your events, budget allocations, and task checklists are stored locally in your
                browser so you can begin planning immediately without creating an account.
              </p>
            </div>

            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)'
              }}
            >
              <strong>Quick Tip:</strong> You can load a realistic sample wedding reception at
              any time to inspect how budget tracking and task completion work on the Overview
              Dashboard.
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant="accent"
                onClick={savedEventCount > 0 ? onReturnToDashboard : onLoadSampleEvent}
                style={{ width: '100%' }}
              >
                <span>
                  {savedEventCount > 0
                    ? 'Go to Live Overview Dashboard'
                    : 'Load Sample Event & Open Dashboard'}
                </span>
                <Icon name="arrow-right" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Explanation */}
      <section aria-labelledby="workflow-heading">
        <div className="section-header">
          <div>
            <h2 id="workflow-heading">How PlanMyCelebration AI works</h2>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              A structured three-stage workflow from initial idea to event-day execution.
            </p>
          </div>
        </div>

        <div className="grid-3">
          {WORKFLOW_STEPS.map((item) => (
            <Card key={item.step} variant="subtle">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span className="step-number">{item.step}</span>
                <h3 style={{ fontSize: 'var(--text-base)' }}>{item.title}</h3>
              </div>
              <p style={{ fontSize: 'var(--text-sm)' }}>{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Three Compact Event Category Examples */}
      <section aria-labelledby="categories-heading">
        <div className="section-header">
          <div>
            <h2 id="categories-heading">Supported celebration categories</h2>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              Explore how different celebrations organize their scope and typical budget splits.
            </p>
          </div>
        </div>

        <div className="grid-3">
          {EVENT_CATEGORIES_PREVIEW.map((cat) => (
            <Card
              key={cat.id}
              interactive
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'var(--space-4)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div>
                  <Badge variant="coral">{cat.badge}</Badge>
                </div>
                <h3 style={{ marginTop: 'var(--space-1)' }}>{cat.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)' }}>{cat.typicalScope}</p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: 'var(--space-3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)'
                }}
              >
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Example Budget Split: </strong>
                  {cat.sampleAllocation}
                </div>

                <Button
                  variant="secondary"
                  onClick={() => onSelectCategory(cat.title)}
                >
                  <span>Start {cat.title.split(' ')[0]} Plan</span>
                  <Icon name="arrow-right" size={15} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
