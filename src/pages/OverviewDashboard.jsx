import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/Icon';
import {
  formatCurrency,
  calculateBudgetSummary,
  calculateTaskSummary,
  getDaysUntilDate,
  formatReadableDate,
  getTimeGreeting
} from '../utils/calculations';

export function OverviewDashboard({
  events,
  activeEvent,
  onSelectActiveEvent,
  onOpenCreateEventModal,
  onLoadSampleEvent,
  onRemoveEvent,
  onNavigate,
  onShowWelcomeGuide
}) {
  const greeting = getTimeGreeting();

  // First-time user / Empty state when 0 events are stored
  if (!events || events.length === 0) {
    return (
      <section
        aria-labelledby="dashboard-empty-heading"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
      >
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}
          >
            <div>
              <Badge variant="plum">Overview Dashboard</Badge>
              <h2 id="dashboard-empty-heading" style={{ marginTop: 'var(--space-2)' }}>
                {greeting}! Ready to plan your celebration?
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                You currently have <strong>0 saved events</strong> in this browser. Start from
                scratch or load a realistic sample celebration to explore the dashboard, budget
                breakdown, and task progress.
              </p>
            </div>
            <Button variant="ghost" onClick={onShowWelcomeGuide}>
              View Welcome Guide
            </Button>
          </div>

          <div
            className="empty-workspace-card"
            style={{ alignItems: 'flex-start' }}
          >
            <div>
              <Badge variant="neutral">Empty Workspace</Badge>
              <h3 style={{ marginTop: 'var(--space-2)' }}>
                Create an event or try a labeled sample workspace
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                We never display fabricated metrics or fake bookings. Once you create an event or
                load the sample wedding reception below, your actual budget figures and pending
                tasks will appear here.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <Button variant="primary" onClick={() => onOpenCreateEventModal()}>
                <Icon name="plus" size={16} />
                <span>Create New Event</span>
              </Button>
              <Button variant="secondary" onClick={onLoadSampleEvent}>
                <Icon name="sparkles" size={16} />
                <span>Load Sample Event (Wedding Reception)</span>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  // Active Event Calculations
  const current = activeEvent || events[0];
  const budget = calculateBudgetSummary(current);
  const taskStats = calculateTaskSummary(current);
  const daysAway = getDaysUntilDate(current.date);

  // Upcoming event across all saved events
  const sortedByDate = [...events].sort((a, b) =>
    (a.date || '9999-99-99').localeCompare(b.date || '9999-99-99')
  );
  const nextEvent = sortedByDate[0];
  const nextEventDays = getDaysUntilDate(nextEvent?.date);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Personalized Greeting Banner */}
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
              marginBottom: 'var(--space-1)'
            }}
          >
            <Badge variant="plum">{current.type}</Badge>
            {current.isSample && (
              <Badge variant="gold">Sample Event Data</Badge>
            )}
          </div>
          <h2>{greeting} — {current.name}</h2>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            {current.location ? `${current.location} • ` : ''}
            {formatReadableDate(current.date)} • {current.guestCount} Estimated Guests
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <Button variant="secondary" onClick={onShowWelcomeGuide}>
            Product Guide
          </Button>
          {current.isSample && (
            <Button
              variant="ghost"
              onClick={() => onRemoveEvent(current.id)}
              title="Remove sample event and return to clean workspace"
            >
              Clear Sample Event
            </Button>
          )}
        </div>
      </div>

      {/* 4 Summary Metric Cards (Computed strictly from saved data) */}
      <section aria-label="Key Event Metrics" className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span>Saved Events</span>
            <Icon name="calendar" size={16} />
          </div>
          <div className="metric-value">{events.length}</div>
          <div className="metric-subtext">
            {events.filter((e) => e.isSample).length > 0
              ? 'Includes 1 sample celebration'
              : 'All user-created workspaces'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Upcoming Event Date</span>
            <Icon name="calendar" size={16} />
          </div>
          <div className="metric-value">
            {formatReadableDate(current.date)}
          </div>
          <div className="metric-subtext">
            {daysAway === null
              ? 'No date specified'
              : daysAway > 0
              ? `In ${daysAway} day${daysAway === 1 ? '' : 's'}`
              : daysAway === 0
              ? 'Happening today!'
              : `${Math.abs(daysAway)} day${Math.abs(daysAway) === 1 ? '' : 's'} ago`}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Planned Budget</span>
            <Icon name="wallet" size={16} />
          </div>
          <div className="metric-value">
            {formatCurrency(budget.plannedTotal, current.currency)}
          </div>
          <div className="metric-subtext">
            of {formatCurrency(budget.totalBudget, current.currency)} total cap
            {budget.isOverPlanned ? ' (Over budget)' : ''}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Pending Tasks</span>
            <Icon name="checklist" size={16} />
          </div>
          <div className="metric-value">{taskStats.pendingTasks}</div>
          <div className="metric-subtext">
            {taskStats.completedTasks} of {taskStats.totalTasks} tasks completed (
            {taskStats.completionPercent}%)
          </div>
        </div>
      </section>

      {/* Main Split: Active Event Progress + Quick Actions & Event List */}
      <div className="dashboard-split">
        {/* Left Column: Preparation Progress & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3>Preparation & Budget Progress</h3>
                <p style={{ fontSize: 'var(--text-xs)' }}>
                  Live status for <strong>{current.name}</strong>
                </p>
              </div>
              <Badge variant={taskStats.completionPercent === 100 ? 'plum' : 'coral'}>
                {taskStats.completionPercent}% Ready
              </Badge>
            </div>

            {/* Task Completion Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span style={{ fontWeight: 600 }}>Checklist Completion</span>
                <span>
                  {taskStats.completedTasks} / {taskStats.totalTasks} completed
                </span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={taskStats.completionPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task checklist completion percentage"
              >
                <div
                  className="progress-fill"
                  style={{ width: `${taskStats.completionPercent}%` }}
                />
              </div>
            </div>

            {/* Budget Allocation Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span style={{ fontWeight: 600 }}>Planned Budget Allocation</span>
                <span>
                  {formatCurrency(budget.plannedTotal, current.currency)} /{' '}
                  {formatCurrency(budget.totalBudget, current.currency)}
                </span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={budget.utilizationPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Planned budget allocation percentage"
              >
                <div
                  className={`progress-fill ${
                    budget.isOverPlanned ? 'is-danger' : 'is-accent'
                  }`}
                  style={{ width: `${budget.utilizationPercent}%` }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)'
                }}
              >
                <span>
                  Actual logged: {formatCurrency(budget.actualTotal, current.currency)}
                </span>
                <span>
                  {budget.isOverPlanned
                    ? `Exceeds cap by ${formatCurrency(
                        Math.abs(budget.remainingPlanned),
                        current.currency
                      )}`
                    : `Unallocated buffer: ${formatCurrency(
                        budget.remainingPlanned,
                        current.currency
                      )}`}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-3)'
                }}
              >
                Quick Actions
              </div>
              <div className="quick-actions-grid">
                <button
                  type="button"
                  className="quick-action-tile"
                  onClick={() => onOpenCreateEventModal()}
                >
                  <Icon name="plus" size={18} />
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    Create Event
                  </strong>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Start a new celebration plan
                  </span>
                </button>

                <button
                  type="button"
                  className="quick-action-tile"
                  onClick={() => onNavigate('ai-planner')}
                >
                  <Icon name="sparkles" size={18} />
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    Generate AI Plan
                  </strong>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Get tailored themes & phases
                  </span>
                </button>

                <button
                  type="button"
                  className="quick-action-tile"
                  onClick={() => onNavigate('budget')}
                >
                  <Icon name="wallet" size={18} />
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    View Budget
                  </strong>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Manage INR allocations
                  </span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Recent & Upcoming Saved Events */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>Recent & Upcoming Events</h3>
              <p style={{ fontSize: 'var(--text-xs)' }}>
                Switch active workspace or view upcoming dates
              </p>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('my-events')}>
              All Events
            </Button>
          </div>

          <div className="event-list-stack">
            {sortedByDate.map((ev) => {
              const evTasks = calculateTaskSummary(ev);
              const isSelected = ev.id === current.id;
              return (
                <div
                  key={ev.id}
                  className={`event-row-card ${isSelected ? 'is-selected' : ''}`}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <strong
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {ev.name}
                      </strong>
                      {ev.isSample && <Badge variant="gold">Sample</Badge>}
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {ev.type} • {formatReadableDate(ev.date)} •{' '}
                      {formatCurrency(ev.totalBudget, ev.currency)}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Progress: {evTasks.completionPercent}% ({evTasks.completedTasks}/
                      {evTasks.totalTasks} tasks)
                    </span>
                  </div>

                  <div>
                    {isSelected ? (
                      <Badge variant="plum">Active</Badge>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => onSelectActiveEvent(ev.id)}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {nextEvent && (
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)'
              }}
            >
              <strong>Next Milestone Date:</strong> {nextEvent.name} on{' '}
              {formatReadableDate(nextEvent.date)}
              {nextEventDays !== null && nextEventDays >= 0
                ? ` (${nextEventDays} days remaining)`
                : ''}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
