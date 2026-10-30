import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/Icon';
import {
  formatCurrency,
  calculateBudgetSummary,
  calculateTaskSummary,
  formatReadableDate,
  getDaysUntilDate
} from '../utils/calculations';

const FILTER_CATEGORIES = [
  'All',
  'Wedding',
  'Birthday',
  'Anniversary',
  'College Event',
  'Community Event',
  'Other'
];

export function MyEventsPage({
  events = [],
  activeEventId,
  onSelectActiveEvent,
  onOpenCreateEventModal,
  onEditEvent,
  onDeleteEvent,
  onLoadSampleEvent,
  onNavigate
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [eventPendingDelete, setEventPendingDelete] = useState(null);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesType =
        selectedType === 'All' || ev.type === selectedType;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        ev.name.toLowerCase().includes(query) ||
        (ev.location && ev.location.toLowerCase().includes(query)) ||
        (ev.theme && ev.theme.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [events, searchQuery, selectedType]);

  const handleOpenWorkspace = (eventId) => {
    onSelectActiveEvent(eventId);
    onNavigate('overview');
  };

  if (events.length === 0) {
    return (
      <section aria-labelledby="my-events-empty-heading">
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>
            <Badge variant="plum">My Events</Badge>
            <h2 id="my-events-empty-heading" style={{ marginTop: 'var(--space-2)' }}>
              No saved celebrations yet
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
              Create your first celebration using the 4-step wizard or load our sample wedding
              workspace to inspect how events are organized.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Button variant="primary" onClick={() => onOpenCreateEventModal()}>
              <Icon name="plus" size={16} />
              <span>Create First Event</span>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Action & Filter Bar */}
      <Card style={{ padding: 'var(--space-5)' }}>
        <div className="events-filter-bar">
          <div className="search-input-wrapper">
            <Icon name="search" size={16} className="search-input-icon" />
            <input
              type="search"
              className="form-input search-input-with-icon"
              placeholder="Search events by name, city, or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search saved events"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              flexWrap: 'wrap'
            }}
          >
            <label
              htmlFor="filter-event-type"
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              Category:
            </label>
            <select
              id="filter-event-type"
              className="form-select"
              style={{ width: 'auto', minWidth: '160px' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {FILTER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <Button variant="primary" onClick={() => onOpenCreateEventModal()}>
              <Icon name="plus" size={16} />
              <span>New Event</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Filtered Event Cards Grid */}
      {filteredEvents.length === 0 ? (
        <Card variant="subtle" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <h3>No events match your current filter</h3>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              marginTop: 'var(--space-1)',
              marginBottom: 'var(--space-4)'
            }}
          >
            Try clearing your search query or switching the category filter back to "All Categories".
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="events-cards-grid">
          {filteredEvents.map((ev) => {
            const isCurrent = ev.id === activeEventId;
            const budget = calculateBudgetSummary(ev);
            const taskStats = calculateTaskSummary(ev);
            const daysAway = getDaysUntilDate(ev.date);

            return (
              <Card
                key={ev.id}
                className={`event-manage-card ${isCurrent ? 'is-active-event' : ''}`}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Badge variant="plum">{ev.type}</Badge>
                      {ev.isSample && <Badge variant="gold">Sample</Badge>}
                      {isCurrent && <Badge variant="coral">Active Workspace</Badge>}
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                        fontWeight: 500
                      }}
                    >
                      {daysAway !== null && daysAway >= 0
                        ? `In ${daysAway}d`
                        : formatReadableDate(ev.date)}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)' }}>{ev.name}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: '2px' }}>
                      {formatReadableDate(ev.date)}
                      {ev.location ? ` • ${ev.location}` : ''} • {ev.guestCount} Guests
                    </p>
                  </div>

                  <div className="event-card-stats">
                    <div>
                      <span className="stat-mini-label">Total Budget</span>
                      <strong className="stat-mini-value">
                        {formatCurrency(budget.totalBudget, ev.currency)}
                      </strong>
                    </div>
                    <div>
                      <span className="stat-mini-label">Planned Split</span>
                      <strong className="stat-mini-value">
                        {formatCurrency(budget.plannedTotal, ev.currency)}
                      </strong>
                    </div>
                    <div>
                      <span className="stat-mini-label">Setting</span>
                      <strong className="stat-mini-value">{ev.settingPreference}</strong>
                    </div>
                  </div>

                  {/* Completion Progress */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'var(--text-xs)'
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        Task Readiness
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {taskStats.completedTasks}/{taskStats.totalTasks} ({taskStats.completionPercent}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${taskStats.completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="event-card-actions">
                  <Button
                    variant={isCurrent ? 'secondary' : 'primary'}
                    onClick={() => handleOpenWorkspace(ev.id)}
                  >
                    <span>{isCurrent ? 'Open Dashboard' : 'Switch & Open'}</span>
                  </Button>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => onEditEvent(ev)}
                      aria-label={`Edit ${ev.name}`}
                      title="Edit event details"
                    >
                      <Icon name="edit" size={15} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setEventPendingDelete(ev)}
                      aria-label={`Delete ${ev.name}`}
                      title="Delete event"
                      style={{ color: 'var(--status-danger-text)' }}
                    >
                      <Icon name="trash" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Destructive Action Confirmation Modal */}
      <Modal
        isOpen={Boolean(eventPendingDelete)}
        onClose={() => setEventPendingDelete(null)}
        title="Confirm Event Deletion"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEventPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (eventPendingDelete) {
                  onDeleteEvent(eventPendingDelete.id);
                  setEventPendingDelete(null);
                }
              }}
            >
              <Icon name="trash" size={15} />
              <span>Yes, Delete Event</span>
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)' }}>
          Are you sure you want to permanently delete{' '}
          <strong>{eventPendingDelete?.name}</strong>? This will remove its budget
          allocations, task checklist, and vendor shortlist from your browser storage.
        </p>
      </Modal>
    </div>
  );
}
