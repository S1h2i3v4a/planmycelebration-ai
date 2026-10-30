import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { InputField, SelectField, TextareaField } from './ui/Input';
import { Icon } from './Icon';
import { formatCurrency, formatReadableDate } from '../utils/calculations';
import {
  generateInitialBudgetCategories,
  generateInitialTasks
} from '../utils/storage';

const EVENT_TYPES = [
  'Wedding',
  'Birthday',
  'Anniversary',
  'College Event',
  'Community Event',
  'Other'
];

const SETTING_OPTIONS = [
  { value: 'Indoor', label: 'Indoor (Banquet Hall / Auditorium)' },
  { value: 'Outdoor', label: 'Outdoor (Lawn / Courtyard / Open Air)' },
  { value: 'Flexible', label: 'Flexible / Hybrid (Indoor + Outdoor)' }
];

const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹ — Indian Rupee)' },
  { value: 'USD', label: 'USD ($ — US Dollar)' },
  { value: 'EUR', label: 'EUR (€ — Euro)' }
];

const PRIORITY_OPTIONS = [
  'Food & Catering',
  'Venue & Rentals',
  'Decoration & Floral',
  'Photography & Video',
  'Music & Entertainment',
  'Transport & Hospitality'
];

const WIZARD_STEPS = [
  { number: 1, label: 'Event Basics' },
  { number: 2, label: 'Attendance & Style' },
  { number: 3, label: 'Budget & Priorities' },
  { number: 4, label: 'Review & Save' }
];

function mapCategoryHintToType(categoryHint = '') {
  const lower = categoryHint.toLowerCase();
  if (lower.includes('wedding')) return 'Wedding';
  if (lower.includes('birthday')) return 'Birthday';
  if (lower.includes('anniversary')) return 'Anniversary';
  if (lower.includes('college')) return 'College Event';
  if (lower.includes('community')) return 'Community Event';
  return 'Wedding';
}

function getDefaultDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
}

export function EventWizardModal({
  isOpen,
  onClose,
  onSaveEvent,
  initialCategoryHint = '',
  editingEvent = null
}) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    type: 'Wedding',
    date: getDefaultDateString(),
    location: '',
    guestCount: 150,
    theme: '',
    settingPreference: 'Indoor',
    dietaryNotes: '',
    totalBudget: 350000,
    currency: 'INR',
    priorities: ['Food & Catering', 'Venue & Rentals']
  });

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setErrors({});

    if (editingEvent) {
      setFormData({
        name: editingEvent.name || '',
        type: EVENT_TYPES.includes(editingEvent.type)
          ? editingEvent.type
          : 'Other',
        date: editingEvent.date || getDefaultDateString(),
        location: editingEvent.location || '',
        guestCount: Number(editingEvent.guestCount) || 100,
        theme: editingEvent.theme || '',
        settingPreference: editingEvent.settingPreference || 'Indoor',
        dietaryNotes: editingEvent.dietaryNotes || '',
        totalBudget: Number(editingEvent.totalBudget) || 100000,
        currency: editingEvent.currency || 'INR',
        priorities: Array.isArray(editingEvent.priorities)
          ? editingEvent.priorities
          : []
      });
    } else {
      const inferredType = initialCategoryHint
        ? mapCategoryHintToType(initialCategoryHint)
        : 'Wedding';

      setFormData({
        name: initialCategoryHint ? `${inferredType} Celebration` : '',
        type: inferredType,
        date: getDefaultDateString(),
        location: '',
        guestCount: inferredType === 'Birthday' ? 60 : 150,
        theme: '',
        settingPreference: 'Indoor',
        dietaryNotes: '',
        totalBudget: inferredType === 'Birthday' ? 75000 : 450000,
        currency: 'INR',
        priorities: ['Food & Catering', 'Decoration & Floral']
      });
    }
  }, [isOpen, editingEvent, initialCategoryHint]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const togglePriority = (priorityLabel) => {
    setFormData((prev) => {
      const exists = prev.priorities.includes(priorityLabel);
      const nextPriorities = exists
        ? prev.priorities.filter((p) => p !== priorityLabel)
        : [...prev.priorities, priorityLabel];
      return { ...prev, priorities: nextPriorities };
    });
    if (errors.priorities) {
      setErrors((prev) => ({ ...prev, priorities: undefined }));
    }
  };

  const validateStep = (targetStep) => {
    const nextErrors = {};

    if (targetStep === 1) {
      const trimmedName = formData.name.trim();
      if (!trimmedName || trimmedName.length < 3) {
        nextErrors.name = 'Please enter an event name (at least 3 characters).';
      } else if (trimmedName.length > 90) {
        nextErrors.name = 'Event name must be under 90 characters.';
      }

      if (!EVENT_TYPES.includes(formData.type)) {
        nextErrors.type = 'Please select a valid event type.';
      }

      if (!formData.date) {
        nextErrors.date = 'Please select an event date.';
      } else {
        const parsed = new Date(`${formData.date}T00:00:00`);
        if (Number.isNaN(parsed.getTime())) {
          nextErrors.date = 'Please enter a valid calendar date.';
        }
      }
    }

    if (targetStep === 2) {
      const guests = Number(formData.guestCount);
      if (!Number.isFinite(guests) || guests < 1 || guests > 50000) {
        nextErrors.guestCount =
          'Estimated guest count must be between 1 and 50,000.';
      }
      if (!formData.theme.trim()) {
        nextErrors.theme =
          'Please enter a preferred theme or style (e.g., Warm Traditional, Minimalist Floral).';
      }
    }

    if (targetStep === 3) {
      const budget = Number(formData.totalBudget);
      if (!Number.isFinite(budget) || budget < 1000 || budget > 1000000000) {
        nextErrors.totalBudget =
          'Please enter a realistic total budget (minimum 1,000).';
      }
      if (!formData.priorities || formData.priorities.length === 0) {
        nextErrors.priorities =
          'Select at least one priority area to guide budget allocation.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleConfirmSave = () => {
    // Validate all steps before final save
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const numericBudget = Math.round(Number(formData.totalBudget));
    const numericGuests = Math.round(Number(formData.guestCount));

    const payload = {
      ...(editingEvent || {}),
      id: editingEvent?.id || `evt_${Date.now()}`,
      name: formData.name.trim(),
      type: formData.type,
      date: formData.date,
      location: formData.location.trim(),
      guestCount: numericGuests,
      theme: formData.theme.trim(),
      settingPreference: formData.settingPreference,
      dietaryNotes: formData.dietaryNotes.trim(),
      totalBudget: numericBudget,
      currency: formData.currency,
      priorities: formData.priorities,
      isSample: false,
      budgetCategories: editingEvent?.budgetCategories?.length
        ? editingEvent.budgetCategories
        : generateInitialBudgetCategories(numericBudget, formData.priorities),
      tasks: editingEvent?.tasks?.length
        ? editingEvent.tasks
        : generateInitialTasks(formData.type, formData.date),
      vendors: editingEvent?.vendors || [],
      aiPlan: editingEvent?.aiPlan || null,
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveEvent(payload, Boolean(editingEvent));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        editingEvent
          ? `Edit Event — ${editingEvent.name}`
          : 'Create New Celebration Event'
      }
      footer={
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)'
          }}
        >
          <div>
            {step > 1 ? (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Step {step} of 4
            </span>
            {step < 4 ? (
              <Button variant="primary" onClick={handleContinue}>
                <span>Continue</span>
                <Icon name="arrow-right" size={15} />
              </Button>
            ) : (
              <Button variant="accent" onClick={handleConfirmSave}>
                <Icon name="check" size={16} />
                <span>
                  {editingEvent ? 'Save Changes' : 'Create Event Workspace'}
                </span>
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Visible 4-Step Progress Indicator */}
      <nav aria-label="Event Creation Steps" className="wizard-stepper">
        {WIZARD_STEPS.map((item) => {
          const isCurrent = item.number === step;
          const isCompleted = item.number < step;
          return (
            <button
              key={item.number}
              type="button"
              className={`wizard-step-pill ${
                isCurrent ? 'is-current' : isCompleted ? 'is-completed' : ''
              }`}
              onClick={() => {
                if (item.number < step) {
                  setStep(item.number);
                }
              }}
              disabled={item.number > step}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="wizard-step-badge">
                {isCompleted ? '✓' : item.number}
              </span>
              <span className="wizard-step-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* STEP 1: EVENT BASICS */}
      {step === 1 && (
        <div className="wizard-form-grid">
          <InputField
            id="evt-name"
            label="Event Name"
            required
            placeholder="e.g., Rohan & Priya Wedding Reception, TechFest 2027"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={errors.name}
            hint="Give your celebration a clear, recognizable title."
          />

          <div className="form-row-2">
            <SelectField
              id="evt-type"
              label="Event Type"
              required
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              options={EVENT_TYPES}
              error={errors.type}
            />

            <InputField
              id="evt-date"
              label="Event Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              error={errors.date}
            />
          </div>

          <InputField
            id="evt-location"
            label="City or Venue Area (Optional)"
            placeholder="e.g., Civil Lines, Prayagraj or Noida Sector 62"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            hint="Helps tailor logistics, weather considerations, and vendor planning."
          />
        </div>
      )}

      {/* STEP 2: ATTENDANCE & PREFERENCES */}
      {step === 2 && (
        <div className="wizard-form-grid">
          <div className="form-row-2">
            <InputField
              id="evt-guests"
              label="Estimated Guest Count"
              type="number"
              min={1}
              max={50000}
              required
              value={formData.guestCount}
              onChange={(e) => updateField('guestCount', e.target.value)}
              error={errors.guestCount}
              hint="Used to estimate catering and venue capacity."
            />

            <SelectField
              id="evt-setting"
              label="Indoor / Outdoor Preference"
              required
              value={formData.settingPreference}
              onChange={(e) => updateField('settingPreference', e.target.value)}
              options={SETTING_OPTIONS}
            />
          </div>

          <InputField
            id="evt-theme"
            label="Preferred Theme or Style"
            required
            placeholder="e.g., Royal Plum & Gold, Warm Pastel Garden, Retro Campus Night"
            value={formData.theme}
            onChange={(e) => updateField('theme', e.target.value)}
            error={errors.theme}
            hint="Describe the atmosphere, colors, or cultural aesthetic you prefer."
          />

          <TextareaField
            id="evt-dietary"
            label="Dietary or Accessibility Considerations (Optional)"
            placeholder="e.g., Pure vegetarian buffet, Jain food counter, wheelchair ramp access for elders"
            value={formData.dietaryNotes}
            onChange={(e) => updateField('dietaryNotes', e.target.value)}
            rows={3}
          />
        </div>
      )}

      {/* STEP 3: BUDGET & PRIORITIES */}
      {step === 3 && (
        <div className="wizard-form-grid">
          <div className="form-row-2">
            <InputField
              id="evt-budget"
              label="Total Target Budget"
              type="number"
              min={1000}
              step={5000}
              required
              value={formData.totalBudget}
              onChange={(e) => updateField('totalBudget', e.target.value)}
              error={errors.totalBudget}
              hint={`Formatted: ${formatCurrency(
                formData.totalBudget,
                formData.currency
              )}`}
            />

            <SelectField
              id="evt-currency"
              label="Currency"
              value={formData.currency}
              onChange={(e) => updateField('currency', e.target.value)}
              options={CURRENCY_OPTIONS}
            />
          </div>

          <div className="form-field">
            <span className="form-label">
              Top Spending Priorities <span className="required-star">*</span>
            </span>
            <span className="form-hint">
              Select the categories that matter most to you. We will weight your initial
              budget allocation toward these areas.
            </span>
            <div className="priority-chips-grid">
              {PRIORITY_OPTIONS.map((priority) => {
                const isSelected = formData.priorities.includes(priority);
                return (
                  <button
                    key={priority}
                    type="button"
                    className={`priority-chip ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => togglePriority(priority)}
                    aria-pressed={isSelected}
                  >
                    <span>{priority}</span>
                    {isSelected && <Icon name="check" size={14} />}
                  </button>
                );
              })}
            </div>
            {errors.priorities && (
              <span className="form-error" role="alert">
                {errors.priorities}
              </span>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CONFIRM */}
      {step === 4 && (
        <div className="wizard-form-grid">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-2)'
            }}
          >
            <div>
              <Badge variant="plum">Step 4 — Final Review</Badge>
              <p style={{ fontSize: 'var(--text-xs)', marginTop: '4px' }}>
                Verify your event details below. Click any section’s Edit link to adjust
                before saving.
              </p>
            </div>
          </div>

          <div className="review-summary-box">
            <div className="review-section-header">
              <strong>1. Event Basics</strong>
              <button
                type="button"
                className="review-edit-link"
                onClick={() => setStep(1)}
              >
                Edit Step 1
              </button>
            </div>
            <div className="review-grid-2">
              <div>
                <span className="review-label">Name:</span>{' '}
                <strong>{formData.name}</strong>
              </div>
              <div>
                <span className="review-label">Category:</span>{' '}
                <strong>{formData.type}</strong>
              </div>
              <div>
                <span className="review-label">Date:</span>{' '}
                <strong>{formatReadableDate(formData.date)}</strong>
              </div>
              <div>
                <span className="review-label">Location:</span>{' '}
                <strong>{formData.location || 'Not specified'}</strong>
              </div>
            </div>
          </div>

          <div className="review-summary-box">
            <div className="review-section-header">
              <strong>2. Attendance & Preferences</strong>
              <button
                type="button"
                className="review-edit-link"
                onClick={() => setStep(2)}
              >
                Edit Step 2
              </button>
            </div>
            <div className="review-grid-2">
              <div>
                <span className="review-label">Guests:</span>{' '}
                <strong>{formData.guestCount} people</strong>
              </div>
              <div>
                <span className="review-label">Setting:</span>{' '}
                <strong>{formData.settingPreference}</strong>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span className="review-label">Theme / Style:</span>{' '}
                <strong>{formData.theme}</strong>
              </div>
              {formData.dietaryNotes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span className="review-label">Dietary / Accessibility:</span>{' '}
                  <span>{formData.dietaryNotes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="review-summary-box">
            <div className="review-section-header">
              <strong>3. Budget & Priorities</strong>
              <button
                type="button"
                className="review-edit-link"
                onClick={() => setStep(3)}
              >
                Edit Step 3
              </button>
            </div>
            <div className="review-grid-2">
              <div>
                <span className="review-label">Total Budget:</span>{' '}
                <strong style={{ color: 'var(--color-primary)' }}>
                  {formatCurrency(formData.totalBudget, formData.currency)}
                </strong>
              </div>
              <div>
                <span className="review-label">Currency:</span>{' '}
                <strong>{formData.currency}</strong>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span className="review-label">Selected Priorities:</span>{' '}
                <span>{formData.priorities.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
