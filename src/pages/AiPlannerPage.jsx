import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/Icon';
import { requestAiEventPlan, generateDemoAiPlan } from '../utils/aiService';

export function AiPlannerPage({
  activeEvent,
  onUpdateEvent,
  onOpenCreateEventModal,
  onLoadSampleEvent
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDemoModeActive, setIsDemoModeActive] = useState(false);

  if (!activeEvent) {
    return (
      <section aria-labelledby="ai-empty-heading">
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <Badge variant="plum">AI Event Planner</Badge>
            <h2 id="ai-empty-heading" style={{ marginTop: 'var(--space-2)' }}>
              Select or create an event to generate an AI plan
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
              Transform your event requirements and budget into structured concepts, theme ideas,
              and preparation phases.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Button variant="primary" onClick={() => onOpenCreateEventModal()}>
              <Icon name="plus" size={16} />
              <span>Create Event</span>
            </Button>
            <Button variant="secondary" onClick={onLoadSampleEvent}>
              <Icon name="sparkles" size={16} />
              <span>Load Sample Event</span>
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  const aiPlan = activeEvent.aiPlan;
  const isPlanDemo = Boolean(aiPlan?.isDemo || aiPlan?.mode === 'demo' || isDemoModeActive);

  const handleGeneratePlan = async (forceDemo = false) => {
    setLoading(true);
    setErrorMessage('');

    if (forceDemo) {
      // Simulate brief network delay for honest demo mode
      await new Promise((r) => setTimeout(r, 600));
      const demoResult = generateDemoAiPlan(activeEvent);
      setIsDemoModeActive(true);
      setLoading(false);
      onUpdateEvent({
        ...activeEvent,
        aiPlan: demoResult,
        updatedAt: new Date().toISOString()
      });
      return;
    }

    const result = await requestAiEventPlan(activeEvent);
    setLoading(false);

    if (result.success) {
      setIsDemoModeActive(false);
      onUpdateEvent({
        ...activeEvent,
        aiPlan: result.plan,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Fallback to demo mode cleanly with error notification
      setIsDemoModeActive(true);
      setErrorMessage(
        `Live AI unavailable (${result.error}). Displaying offline Demo Mode plan.`
      );
      onUpdateEvent({
        ...activeEvent,
        aiPlan: result.demoPlan,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: '4px'
            }}
          >
            <Badge variant="plum">{activeEvent.type}</Badge>
            {aiPlan && (
              <Badge variant={isPlanDemo ? 'gold' : 'coral'}>
                {isPlanDemo ? 'Demo Mode (Offline Sample)' : 'Live AI Generated'}
              </Badge>
            )}
          </div>
          <h2>AI Event Planner — {activeEvent.name}</h2>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Turn your guest count, theme, and budget into structured concepts and preparation
            milestones.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            onClick={() => handleGeneratePlan(true)}
            disabled={loading}
          >
            <Icon name="sparkles" size={16} />
            <span>Load Demo Plan</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => handleGeneratePlan(false)}
            disabled={loading}
          >
            <Icon name="sparkles" size={16} />
            <span>{loading ? 'Generating...' : aiPlan ? 'Regenerate AI Plan' : 'Generate AI Plan'}</span>
          </Button>
        </div>
      </div>

      {/* Error or Notice Banner */}
      {errorMessage && (
        <div className="budget-validation-alert" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card
          style={{
            textAlign: 'center',
            padding: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}
        >
          <div className="ai-spinner" aria-hidden="true" />
          <h3>Generating your customized event plan...</h3>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Synthesizing themes, preparation phases, and budget guidance for {activeEvent.name}.
          </p>
        </Card>
      )}

      {/* Empty State when no AI plan exists yet */}
      {!aiPlan && !loading && (
        <Card
          style={{
            textAlign: 'center',
            padding: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name="sparkles" size={24} />
          </div>

          <div>
            <h3>No AI Plan Generated for This Event Yet</h3>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                marginTop: '4px',
                maxWidth: '520px',
                marginInline: 'auto'
              }}
            >
              Click <strong>Generate AI Plan</strong> to query Google Gemini through our secure
              backend, or click <strong>Load Demo Plan</strong> to test the workspace immediately without
              an API key.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="primary" onClick={() => handleGeneratePlan(false)}>
              <Icon name="sparkles" size={16} />
              <span>Generate AI Plan</span>
            </Button>
            <Button variant="secondary" onClick={() => handleGeneratePlan(true)}>
              Load Demo Plan
            </Button>
          </div>
        </Card>
      )}

      {/* Render AI Plan Content */}
      {aiPlan && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Concept Overview Card */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-2)'
              }}
            >
              <Badge variant="plum">Concept & Vision</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Theme: {activeEvent.theme} • Guests: {activeEvent.guestCount}
              </span>
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)' }}>{aiPlan.conceptTitle}</h3>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
              {aiPlan.executiveSummary}
            </p>
          </Card>

          {/* Theme & Decor Ideas */}
          {Array.isArray(aiPlan.themeIdeas) && aiPlan.themeIdeas.length > 0 && (
            <section aria-labelledby="theme-ideas-heading">
              <div className="section-header">
                <div>
                  <h3 id="theme-ideas-heading">Theme & Decor Highlights</h3>
                  <p style={{ fontSize: 'var(--text-xs)' }}>Atmospheric and visual design recommendations</p>
                </div>
              </div>
              <div className="grid-3">
                {aiPlan.themeIdeas.map((idea, idx) => (
                  <Card
                    key={idx}
                    variant="subtle"
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
                  >
                    <Badge variant="coral">Highlight 0{idx + 1}</Badge>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      {idea.title}
                    </strong>
                    <p style={{ fontSize: 'var(--text-xs)' }}>{idea.description}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Preparation Phases */}
          {Array.isArray(aiPlan.preparationPhases) && aiPlan.preparationPhases.length > 0 && (
            <section aria-labelledby="ai-phases-heading">
              <div className="section-header">
                <div>
                  <h3 id="ai-phases-heading">Recommended Preparation Phases</h3>
                  <p style={{ fontSize: 'var(--text-xs)' }}>Milestone focus areas and key actions</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {aiPlan.preparationPhases.map((phase, idx) => (
                  <Card key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span className="step-number">0{idx + 1}</span>
                        <h4 style={{ fontSize: 'var(--text-base)' }}>{phase.phase}</h4>
                      </div>
                      <Badge variant="neutral">{phase.focus}</Badge>
                    </div>
                    <ul
                      style={{
                        paddingLeft: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      {Array.isArray(phase.keyActions) &&
                        phase.keyActions.map((action, aidx) => (
                          <li key={aidx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                            {action}
                          </li>
                        ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Budget Advice & Practical Tips Grid */}
          <div className="dashboard-split">
            {/* Budget Advice */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3>Suggested Budget Allocation</h3>
              <p style={{ fontSize: 'var(--text-xs)' }}>
                Recommended percentage splits for {activeEvent.name}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {Array.isArray(aiPlan.budgetAllocationAdvice) &&
                  aiPlan.budgetAllocationAdvice.map((adv, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 'var(--space-3)',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 'var(--text-sm)'
                        }}
                      >
                        <strong style={{ color: 'var(--text-primary)' }}>{adv.category}</strong>
                        <Badge variant="plum">{adv.suggestedPct}%</Badge>
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {adv.rationale}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Practical Tips */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3>Practical Planner Tips</h3>
              <p style={{ fontSize: 'var(--text-xs)' }}>Expert guidelines for smooth execution</p>
              <ul
                style={{
                  paddingLeft: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)'
                }}
              >
                {Array.isArray(aiPlan.practicalTips) &&
                  aiPlan.practicalTips.map((tip, idx) => (
                    <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      {tip}
                    </li>
                  ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiPlannerPage;
