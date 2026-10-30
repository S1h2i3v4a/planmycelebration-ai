/**
 * LocalStorage persistence utilities with defensive validation,
 * smart initial budget/task seeding, relative timeline schedule generation,
 * and sample event generation.
 */

const STORAGE_KEYS = {
  EVENTS: 'pmc_ai_v1_events',
  ACTIVE_EVENT_ID: 'pmc_ai_v1_active_event_id'
};

export const TASK_PHASES = [
  'Initial Planning',
  'Bookings',
  'Preparation',
  'Final Checks',
  'Event Day'
];

export const TASK_CATEGORIES = [
  'General',
  'Venue',
  'Food',
  'Decoration',
  'Photography',
  'Entertainment',
  'Transport'
];

export const DEFAULT_BUDGET_CATEGORIES = [
  { id: 'venue', label: 'Venue & Rentals', planned: 0, actual: 0, notes: '' },
  { id: 'food', label: 'Food & Catering', planned: 0, actual: 0, notes: '' },
  { id: 'decoration', label: 'Decoration & Floral', planned: 0, actual: 0, notes: '' },
  { id: 'photography', label: 'Photography & Video', planned: 0, actual: 0, notes: '' },
  { id: 'entertainment', label: 'Music & Entertainment', planned: 0, actual: 0, notes: '' },
  { id: 'transport', label: 'Transport & Hospitality', planned: 0, actual: 0, notes: '' },
  { id: 'misc', label: 'Miscellaneous & Buffer', planned: 0, actual: 0, notes: '' }
];

function computeRelativeDateString(targetDateStr, daysBefore) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = targetDateStr ? new Date(`${targetDateStr}T00:00:00`) : null;

  if (!target || Number.isNaN(target.getTime()) || target < today) {
    // Past-date safeguard: if event date is missing or in the past, anchor relative to today
    const fallback = new Date(today);
    fallback.setDate(today.getDate() + Math.max(0, 14 - Math.floor(daysBefore / 3)));
    return fallback.toISOString().split('T')[0];
  }

  const candidate = new Date(target);
  candidate.setDate(target.getDate() - daysBefore);
  // Never schedule a preparation task earlier than today
  const clamped = candidate < today ? today : candidate;
  return clamped.toISOString().split('T')[0];
}

export function generateInitialBudgetCategories(totalBudget = 0, priorities = []) {
  const budget = Math.max(0, Number(totalBudget) || 0);
  const baseWeights = {
    venue: 26,
    food: 30,
    decoration: 14,
    photography: 10,
    entertainment: 8,
    transport: 6,
    misc: 6
  };

  const priorityMap = {
    'Venue & Rentals': 'venue',
    'Food & Catering': 'food',
    'Decoration & Floral': 'decoration',
    'Photography & Video': 'photography',
    'Music & Entertainment': 'entertainment',
    'Transport & Hospitality': 'transport'
  };

  const adjustedWeights = { ...baseWeights };
  if (Array.isArray(priorities)) {
    priorities.forEach((p) => {
      const key = priorityMap[p];
      if (key && adjustedWeights[key]) {
        adjustedWeights[key] += 5;
      }
    });
  }

  const weightSum = Object.values(adjustedWeights).reduce((a, b) => a + b, 0);

  return DEFAULT_BUDGET_CATEGORIES.map((cat) => {
    const share = adjustedWeights[cat.id] / weightSum;
    const allocated = budget > 0 ? Math.round((budget * share) / 500) * 500 : 0;
    return {
      ...cat,
      planned: allocated,
      actual: 0,
      notes: priorities.includes(cat.label)
        ? 'High-priority category selected during setup'
        : ''
    };
  });
}

export function generateInitialTasks(eventType = 'Other', eventDate = '') {
  const stamp = Date.now();
  return [
    {
      id: `task_${stamp}_1`,
      title: `Finalize guest list and invitation count for ${eventType}`,
      phase: 'Initial Planning',
      priority: 'High',
      category: 'General',
      dueDate: computeRelativeDateString(eventDate, 35),
      completed: false
    },
    {
      id: `task_${stamp}_2`,
      title: 'Shortlist and confirm primary venue & date availability',
      phase: 'Bookings',
      priority: 'High',
      category: 'Venue',
      dueDate: computeRelativeDateString(eventDate, 28),
      completed: false
    },
    {
      id: `task_${stamp}_3`,
      title: 'Finalize catering menu, tasting session, and dietary counters',
      phase: 'Bookings',
      priority: 'High',
      category: 'Food',
      dueDate: computeRelativeDateString(eventDate, 21),
      completed: false
    },
    {
      id: `task_${stamp}_4`,
      title: 'Approve theme decor moodboard, floral layout, and lighting',
      phase: 'Preparation',
      priority: 'Medium',
      category: 'Decoration',
      dueDate: computeRelativeDateString(eventDate, 14),
      completed: false
    },
    {
      id: `task_${stamp}_5`,
      title: 'Share run-of-show timeline with photography and entertainment teams',
      phase: 'Final Checks',
      priority: 'Medium',
      category: 'Photography',
      dueDate: computeRelativeDateString(eventDate, 5),
      completed: false
    },
    {
      id: `task_${stamp}_6`,
      title: 'Supervise venue setup, welcome desk, and vendor settlement',
      phase: 'Event Day',
      priority: 'High',
      category: 'General',
      dueDate: computeRelativeDateString(eventDate, 0),
      completed: false
    }
  ];
}

export function generatePhaseScheduleTasks(event) {
  const eventType = event?.type || 'Celebration';
  const eventDate = event?.date || '';
  const stamp = Date.now();

  return [
    {
      id: `sched_${stamp}_1`,
      title: `Lock master budget cap and priority split for ${eventType}`,
      phase: 'Initial Planning',
      priority: 'High',
      category: 'General',
      dueDate: computeRelativeDateString(eventDate, 40),
      completed: false
    },
    {
      id: `sched_${stamp}_2`,
      title: 'Compile guest RSVP sheet and outstation accommodation list',
      phase: 'Initial Planning',
      priority: 'Medium',
      category: 'Transport',
      dueDate: computeRelativeDateString(eventDate, 32),
      completed: false
    },
    {
      id: `sched_${stamp}_3`,
      title: 'Sign venue contract and verify power backup / permissions',
      phase: 'Bookings',
      priority: 'High',
      category: 'Venue',
      dueDate: computeRelativeDateString(eventDate, 25),
      completed: false
    },
    {
      id: `sched_${stamp}_4`,
      title: 'Book caterer and confirm per-plate pricing & service staff count',
      phase: 'Bookings',
      priority: 'High',
      category: 'Food',
      dueDate: computeRelativeDateString(eventDate, 20),
      completed: false
    },
    {
      id: `sched_${stamp}_5`,
      title: 'Confirm photographer, videographer, and sound/DJ setup',
      phase: 'Bookings',
      priority: 'Medium',
      category: 'Photography',
      dueDate: computeRelativeDateString(eventDate, 18),
      completed: false
    },
    {
      id: `sched_${stamp}_6`,
      title: 'Send digital & printed invitations and track RSVP confirmations',
      phase: 'Preparation',
      priority: 'High',
      category: 'General',
      dueDate: computeRelativeDateString(eventDate, 12),
      completed: false
    },
    {
      id: `sched_${stamp}_7`,
      title: 'Finalize stage backdrop, seating layout, and entrance signage',
      phase: 'Preparation',
      priority: 'Medium',
      category: 'Decoration',
      dueDate: computeRelativeDateString(eventDate, 8),
      completed: false
    },
    {
      id: `sched_${stamp}_8`,
      title: 'Reconfirm final guest headcount with catering & venue manager',
      phase: 'Final Checks',
      priority: 'High',
      category: 'Food',
      dueDate: computeRelativeDateString(eventDate, 3),
      completed: false
    },
    {
      id: `sched_${stamp}_9`,
      title: 'Prepare vendor balance payment envelopes / UPI checklist',
      phase: 'Final Checks',
      priority: 'Medium',
      category: 'General',
      dueDate: computeRelativeDateString(eventDate, 1),
      completed: false
    },
    {
      id: `sched_${stamp}_10`,
      title: 'Complete walkthrough 3 hours prior to guest arrival',
      phase: 'Event Day',
      priority: 'High',
      category: 'Venue',
      dueDate: computeRelativeDateString(eventDate, 0),
      completed: false
    }
  ];
}

export function sanitizeEventRecord(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string' || !raw.name) {
    return null;
  }

  return {
    id: String(raw.id),
    name: String(raw.name).trim(),
    type: String(raw.type || 'Other'),
    date: String(raw.date || ''),
    location: String(raw.location || ''),
    guestCount: Math.max(1, Number(raw.guestCount) || 50),
    theme: String(raw.theme || 'Warm Contemporary'),
    settingPreference: String(raw.settingPreference || 'Indoor'),
    dietaryNotes: String(raw.dietaryNotes || ''),
    currency: String(raw.currency || 'INR'),
    totalBudget: Math.max(0, Number(raw.totalBudget) || 0),
    priorities: Array.isArray(raw.priorities) ? raw.priorities.map(String) : [],
    isSample: Boolean(raw.isSample),
    budgetCategories: Array.isArray(raw.budgetCategories)
      ? raw.budgetCategories.map((cat) => ({
          id: String(cat.id || 'misc'),
          label: String(cat.label || 'Category'),
          planned: Math.max(0, Number(cat.planned) || 0),
          actual: Math.max(0, Number(cat.actual) || 0),
          notes: String(cat.notes || '')
        }))
      : DEFAULT_BUDGET_CATEGORIES.map((c) => ({ ...c })),
    tasks: Array.isArray(raw.tasks)
      ? raw.tasks
          .filter((t) => t && t.id && t.title)
          .map((t) => ({
            id: String(t.id),
            title: String(t.title).trim(),
            phase: TASK_PHASES.includes(t.phase) ? t.phase : 'Initial Planning',
            priority: ['High', 'Medium', 'Low'].includes(t.priority) ? t.priority : 'Medium',
            category: String(t.category || 'General'),
            dueDate: String(t.dueDate || ''),
            completed: Boolean(t.completed)
          }))
      : [],
    vendors: Array.isArray(raw.vendors) ? raw.vendors : [],
    aiPlan: raw.aiPlan && typeof raw.aiPlan === 'object' ? raw.aiPlan : null,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
}

export function loadSavedEvents() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) return { events: [], hadStorageError: false };

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { events: [], hadStorageError: true };
    }

    const validEvents = parsed.map(sanitizeEventRecord).filter(Boolean);
    return {
      events: validEvents,
      hadStorageError: validEvents.length !== parsed.length
    };
  } catch {
    return { events: [], hadStorageError: true };
  }
}

export function saveEventsToStorage(events) {
  try {
    const sanitized = Array.isArray(events)
      ? events.map(sanitizeEventRecord).filter(Boolean)
      : [];
    window.localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(sanitized));
    return true;
  } catch {
    return false;
  }
}

export function loadActiveEventId(events = []) {
  try {
    const storedId = window.localStorage.getItem(STORAGE_KEYS.ACTIVE_EVENT_ID);
    if (storedId && events.some((ev) => ev.id === storedId)) {
      return storedId;
    }
    return events[0]?.id || null;
  } catch {
    return events[0]?.id || null;
  }
}

export function saveActiveEventId(eventId) {
  try {
    if (!eventId) {
      window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_EVENT_ID);
    } else {
      window.localStorage.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, String(eventId));
    }
  } catch {
    // Ignore storage quota / privacy mode errors gracefully
  }
}

export function createSampleCelebrationEvent() {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 45);
  const isoDate = futureDate.toISOString().split('T')[0];

  return sanitizeEventRecord({
    id: `sample_evt_${Date.now()}`,
    name: 'Aarav & Meera Sangeet & Reception (Sample)',
    type: 'Wedding',
    date: isoDate,
    location: 'Prayagraj, UP',
    guestCount: 250,
    theme: 'Royal Plum & Marigold Courtyard',
    settingPreference: 'Outdoor',
    dietaryNotes: 'Pure vegetarian multi-cuisine buffet with Jain counter',
    currency: 'INR',
    totalBudget: 850000,
    priorities: ['Food & Catering', 'Venue & Rentals', 'Decoration & Floral'],
    isSample: true,
    budgetCategories: [
      { id: 'venue', label: 'Venue & Rentals', planned: 240000, actual: 225000, notes: 'Banquet hall + lawn booking advance paid' },
      { id: 'food', label: 'Food & Catering', planned: 280000, actual: 100000, notes: '250 guests @ ₹1,120/plate estimate' },
      { id: 'decoration', label: 'Decoration & Floral', planned: 120000, actual: 40000, notes: 'Stage backdrop, marigold & warm lighting' },
      { id: 'photography', label: 'Photography & Video', planned: 85000, actual: 25000, notes: 'Candid + traditional coverage' },
      { id: 'entertainment', label: 'Music & Entertainment', planned: 55000, actual: 0, notes: 'DJ console, sound & dhol team' },
      { id: 'transport', label: 'Transport & Hospitality', planned: 35000, actual: 0, notes: 'Guest pickup & room welcome baskets' },
      { id: 'misc', label: 'Miscellaneous & Buffer', planned: 35000, actual: 12000, notes: 'Invitations & emergency buffer' }
    ],
    tasks: [
      {
        id: 'sample_task_1',
        title: 'Finalize guest list count and family seating groups',
        phase: 'Initial Planning',
        priority: 'High',
        category: 'General',
        dueDate: computeRelativeDateString(isoDate, 35),
        completed: true
      },
      {
        id: 'sample_task_2',
        title: 'Confirm banquet hall & lawn agreement in writing',
        phase: 'Bookings',
        priority: 'High',
        category: 'Venue',
        dueDate: computeRelativeDateString(isoDate, 28),
        completed: true
      },
      {
        id: 'sample_task_3',
        title: 'Schedule menu tasting and confirm Jain counter items',
        phase: 'Bookings',
        priority: 'High',
        category: 'Food',
        dueDate: computeRelativeDateString(isoDate, 18),
        completed: false
      },
      {
        id: 'sample_task_4',
        title: 'Approve floral stage moodboard and lighting layout',
        phase: 'Preparation',
        priority: 'Medium',
        category: 'Decoration',
        dueDate: computeRelativeDateString(isoDate, 10),
        completed: false
      },
      {
        id: 'sample_task_5',
        title: 'Share timeline sheet with photography team',
        phase: 'Final Checks',
        priority: 'Medium',
        category: 'Photography',
        dueDate: computeRelativeDateString(isoDate, 3),
        completed: false
      },
      {
        id: 'sample_task_6',
        title: 'Oversee stage soundcheck and welcome desk setup',
        phase: 'Event Day',
        priority: 'High',
        category: 'Entertainment',
        dueDate: isoDate,
        completed: false
      }
    ],
    vendors: [
      {
        id: 'sample_v_1',
        name: 'Royal Orchid Banquets & Lawn',
        category: 'Venue & Rentals',
        quotedPrice: 225000,
        contactPerson: 'Mr. Arvind Gupta',
        phone: '+91 98390 12345',
        notes: 'Includes 100% generator backup, bridal suite, and basic ambient lighting.'
      },
      {
        id: 'sample_v_2',
        name: 'Annapurna Gourmet Caterers',
        category: 'Food & Catering',
        quotedPrice: 280000,
        contactPerson: 'Chef Suresh Rao',
        phone: '+91 98391 54321',
        notes: '250 plates @ ₹1,120. Live chaat counter, 4 desserts, and Jain menu counter included.'
      }
    ]
  });
}
