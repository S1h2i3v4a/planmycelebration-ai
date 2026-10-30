import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/Icon';
import { formatCurrency, calculateBudgetSummary } from '../utils/calculations';
import {
  DEFAULT_BUDGET_CATEGORIES,
  generateInitialBudgetCategories
} from '../utils/storage';

const CATEGORY_COLORS = {
  venue: '#4A2545',
  food: '#D96B52',
  decoration: '#B8860B',
  photography: '#284B7A',
  entertainment: '#1F5E3B',
  transport: '#7B4B94',
  misc: '#786F80'
};

export function BudgetPage({
  activeEvent,
  onUpdateEvent,
  onOpenCreateEventModal,
  onLoadSampleEvent
}) {
  const [validationAlert, setValidationAlert] = useState('');
  const [editingCap, setEditingCap] = useState(false);
  const [capDraft, setCapDraft] = useState('');

  if (!activeEvent) {
    return (
      <section aria-labelledby="budget-empty-heading">
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <Badge variant="plum">Budget Workspace</Badge>
            <h2 id="budget-empty-heading" style={{ marginTop: 'var(--space-2)' }}>
              Select or create an event to manage its budget
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
              Track total INR budget, planned category splits, actual vendor spend, and remaining
              buffer with automatic recalculation.
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

  const currency = activeEvent.currency || 'INR';
  const categories =
    Array.isArray(activeEvent.budgetCategories) &&
    activeEvent.budgetCategories.length > 0
      ? activeEvent.budgetCategories
      : DEFAULT_BUDGET_CATEGORIES;

  const summary = calculateBudgetSummary({
    ...activeEvent,
    budgetCategories: categories
  });

  const handleCategoryAmountChange = (catId, field, rawValue) => {
    if (rawValue === '') {
      setValidationAlert('');
      const updated = categories.map((cat) =>
        cat.id === catId ? { ...cat, [field]: 0 } : cat
      );
      onUpdateEvent({
        ...activeEvent,
        budgetCategories: updated,
        updatedAt: new Date().toISOString()
      });
      return;
    }

    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric) || numeric < 0) {
      setValidationAlert('Expense amounts cannot be negative or non-numeric.');
      return;
    }
    if (numeric > 1000000000) {
      setValidationAlert('Amount exceeds maximum supported cap (100 Crore).');
      return;
    }

    setValidationAlert('');
    const rounded = Math.round(numeric);
    const updated = categories.map((cat) =>
      cat.id === catId ? { ...cat, [field]: rounded } : cat
    );
    onUpdateEvent({
      ...activeEvent,
      budgetCategories: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleCategoryNoteChange = (catId, noteText) => {
    const updated = categories.map((cat) =>
      cat.id === catId ? { ...cat, notes: noteText } : cat
    );
    onUpdateEvent({
      ...activeEvent,
      budgetCategories: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleStartEditCap = () => {
    setCapDraft(String(activeEvent.totalBudget || 0));
    setEditingCap(true);
    setValidationAlert('');
  };

  const handleSaveCap = (e) => {
    e.preventDefault();
    const numeric = Number(capDraft);
    if (!Number.isFinite(numeric) || numeric < 1000) {
      setValidationAlert('Total budget cap must be at least 1,000.');
      return;
    }
    setValidationAlert('');
    setEditingCap(false);
    onUpdateEvent({
      ...activeEvent,
      totalBudget: Math.round(numeric),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAutoBalancePlanned = () => {
    const balanced = generateInitialBudgetCategories(
      activeEvent.totalBudget,
      activeEvent.priorities || []
    ).map((newCat) => {
      const existing = categories.find((c) => c.id === newCat.id);
      return {
        ...newCat,
        actual: existing ? existing.actual : 0,
        notes: existing?.notes || newCat.notes
      };
    });
    setValidationAlert('');
    onUpdateEvent({
      ...activeEvent,
      budgetCategories: balanced,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header & Total Cap Controls */}
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
            <Badge variant="neutral">Currency: {currency}</Badge>
          </div>
          <h2>Budget & Expense Allocation — {activeEvent.name}</h2>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Edit planned category allocations and actual expenses below. All totals recalculate
            automatically.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {editingCap ? (
            <form
              onSubmit={handleSaveCap}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <input
                type="number"
                min={1000}
                step={5000}
                className="form-input"
                style={{ width: '150px' }}
                value={capDraft}
                onChange={(e) => setCapDraft(e.target.value)}
                aria-label="New total budget cap"
              />
              <Button type="submit" variant="primary">
                Save Cap
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingCap(false)}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <Button variant="secondary" onClick={handleStartEditCap}>
                <Icon name="edit" size={15} />
                <span>Adjust Total Cap</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleAutoBalancePlanned}
                title="Re-distribute planned amounts proportionally within your total budget"
              >
                <Icon name="sparkles" size={15} />
                <span>Auto-Balance Planned Split</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Over-Budget Warning Banner */}
      {(summary.isOverPlanned || summary.isOverActual) && (
        <div className="budget-warning-banner" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 700 }}>
            <Icon name="info" size={18} />
            <span>Budget Cap Exceeded</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'inherit', marginTop: '4px' }}>
            {summary.isOverPlanned && (
              <span>
                Your <strong>Planned Total ({formatCurrency(summary.plannedTotal, currency)})</strong>{' '}
                exceeds your Total Budget ({formatCurrency(summary.totalBudget, currency)}) by{' '}
                <strong>{formatCurrency(Math.abs(summary.remainingPlanned), currency)}</strong>.{' '}
              </span>
            )}
            {summary.isOverActual && (
              <span>
                Your <strong>Actual Spend ({formatCurrency(summary.actualTotal, currency)})</strong>{' '}
                exceeds your Total Budget by{' '}
                <strong>{formatCurrency(Math.abs(summary.remainingActual), currency)}</strong>.
              </span>
            )}
          </p>
        </div>
      )}

      {/* Validation Alert */}
      {validationAlert && (
        <div className="budget-validation-alert" role="alert">
          {validationAlert}
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <section aria-label="Budget Summary Totals" className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span>Total Budget Cap</span>
            <Icon name="wallet" size={16} />
          </div>
          <div className="metric-value">
            {formatCurrency(summary.totalBudget, currency)}
          </div>
          <div className="metric-subtext">
            {activeEvent.guestCount
              ? `~${formatCurrency(
                  Math.round(summary.totalBudget / activeEvent.guestCount),
                  currency
                )} per guest`
              : 'Target celebration limit'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Planned Expenses</span>
            <Badge variant={summary.isOverPlanned ? 'coral' : 'plum'}>
              {summary.utilizationPercent}%
            </Badge>
          </div>
          <div className="metric-value">
            {formatCurrency(summary.plannedTotal, currency)}
          </div>
          <div className="metric-subtext">
            {summary.isOverPlanned
              ? `Over cap by ${formatCurrency(Math.abs(summary.remainingPlanned), currency)}`
              : `Unallocated buffer: ${formatCurrency(summary.remainingPlanned, currency)}`}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Actual Logged Spend</span>
            <Icon name="checklist" size={16} />
          </div>
          <div className="metric-value">
            {formatCurrency(summary.actualTotal, currency)}
          </div>
          <div className="metric-subtext">
            {summary.plannedTotal > 0
              ? `${Math.round((summary.actualTotal / summary.plannedTotal) * 100)}% of planned split spent`
              : 'Enter vendor payments below'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Remaining vs. Actual</span>
            <Icon name="wallet" size={16} />
          </div>
          <div
            className="metric-value"
            style={{
              color: summary.isOverActual
                ? 'var(--status-danger-text)'
                : 'var(--status-success-text)'
            }}
          >
            {formatCurrency(summary.remainingActual, currency)}
          </div>
          <div className="metric-subtext">
            {summary.isOverActual
              ? 'Actual spend exceeds total cap'
              : 'Available balance from total cap'}
          </div>
        </div>
      </section>

      {/* Visual Allocation Bar Comparison */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <h3>Visual Allocation Breakdown</h3>
            <p style={{ fontSize: 'var(--text-xs)' }}>
              Category share of your {formatCurrency(summary.totalBudget, currency)} budget cap
            </p>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Planned: {formatCurrency(summary.plannedTotal, currency)} • Remaining Buffer:{' '}
            {formatCurrency(Math.max(0, summary.remainingPlanned), currency)}
          </span>
        </div>

        {/* Stacked Multi-Segment Progress Bar */}
        <div className="stacked-budget-bar" aria-label="Category allocation visual chart">
          {categories.map((cat) => {
            const denominator = Math.max(summary.totalBudget, summary.plannedTotal, 1);
            const widthPct = Math.max(0, (Number(cat.planned) / denominator) * 100);
            if (widthPct <= 0) return null;
            return (
              <div
                key={cat.id}
                className="stacked-segment"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: CATEGORY_COLORS[cat.id] || 'var(--color-primary)'
                }}
                title={`${cat.label}: ${formatCurrency(cat.planned, currency)} (${Math.round(widthPct)}%)`}
              />
            );
          })}
        </div>

        {/* Legend Pills */}
        <div className="budget-legend-grid">
          {categories.map((cat) => {
            const pct =
              summary.totalBudget > 0
                ? Math.round((Number(cat.planned) / summary.totalBudget) * 100)
                : 0;
            return (
              <div key={cat.id} className="budget-legend-item">
                <span
                  className="legend-dot"
                  style={{
                    backgroundColor: CATEGORY_COLORS[cat.id] || 'var(--color-primary)'
                  }}
                />
                <span className="legend-name">{cat.label}</span>
                <strong className="legend-pct">{pct}%</strong>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Editable Category Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3>Category-wise Expense Ledger</h3>
          <p style={{ fontSize: 'var(--text-xs)' }}>
            Update Planned or Actual figures in {currency}. Negative amounts are blocked automatically.
          </p>
        </div>

        <div className="budget-table-wrapper">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Planned ({currency})</th>
                <th>Actual Spend ({currency})</th>
                <th>Variance (Planned − Actual)</th>
                <th>Expense Notes & Quotes</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const variance =
                  (Number(cat.planned) || 0) - (Number(cat.actual) || 0);
                const isCategoryOver = variance < 0;
                return (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor:
                              CATEGORY_COLORS[cat.id] || 'var(--color-primary)'
                          }}
                        />
                        <strong style={{ fontSize: 'var(--text-sm)' }}>
                          {cat.label}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        className="form-input budget-num-input"
                        value={cat.planned === 0 ? '' : cat.planned}
                        placeholder="0"
                        onChange={(e) =>
                          handleCategoryAmountChange(cat.id, 'planned', e.target.value)
                        }
                        aria-label={`Planned amount for ${cat.label}`}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={500}
                        className="form-input budget-num-input"
                        value={cat.actual === 0 ? '' : cat.actual}
                        placeholder="0"
                        onChange={(e) =>
                          handleCategoryAmountChange(cat.id, 'actual', e.target.value)
                        }
                        aria-label={`Actual amount spent for ${cat.label}`}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          color: isCategoryOver
                            ? 'var(--status-danger-text)'
                            : 'var(--text-secondary)'
                        }}
                      >
                        {isCategoryOver
                          ? `Over by ${formatCurrency(Math.abs(variance), currency)}`
                          : `${formatCurrency(variance, currency)} left`}
                      </span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        value={cat.notes || ''}
                        placeholder="Add advance paid, per-plate rate, or vendor note..."
                        onChange={(e) =>
                          handleCategoryNoteChange(cat.id, e.target.value)
                        }
                        aria-label={`Notes for ${cat.label}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="budget-table-footer">
                <td>
                  <strong>Total ({categories.length} Categories)</strong>
                </td>
                <td>
                  <strong>{formatCurrency(summary.plannedTotal, currency)}</strong>
                </td>
                <td>
                  <strong>{formatCurrency(summary.actualTotal, currency)}</strong>
                </td>
                <td>
                  <strong
                    style={{
                      color:
                        summary.plannedTotal - summary.actualTotal < 0
                          ? 'var(--status-danger-text)'
                          : 'var(--status-success-text)'
                    }}
                  >
                    {formatCurrency(
                      summary.plannedTotal - summary.actualTotal,
                      currency
                    )}
                  </strong>
                </td>
                <td>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Unallocated from Cap: {formatCurrency(summary.remainingPlanned, currency)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
