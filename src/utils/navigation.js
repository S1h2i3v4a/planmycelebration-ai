export const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'home',
    moduleNumber: 2,
    status: 'active-welcome',
    description: 'Workspace overview, welcome guide, and quick actions.'
  },
  {
    id: 'my-events',
    label: 'My Events',
    icon: 'calendar',
    moduleNumber: 3,
    status: 'live',
    description: 'View, search, edit, and manage all saved celebration workspaces.'
  },
  {
    id: 'ai-planner',
    label: 'AI Event Planner',
    icon: 'sparkles',
    moduleNumber: 5,
    status: 'live',
    description: 'Turn your event requirements and budget into structured concepts, themes, and preparation phases.'
  },
  {
    id: 'budget',
    label: 'Budget',
    icon: 'wallet',
    moduleNumber: 4,
    status: 'live',
    description: 'Track total budget, category allocations, actual expenses, and remaining balance in INR.'
  },
  {
    id: 'timeline-tasks',
    label: 'Timeline & Tasks',
    icon: 'checklist',
    moduleNumber: 4,
    status: 'live',
    description: 'Organize milestone schedules and checklists from initial planning through event day.'
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: 'store',
    moduleNumber: 6,
    status: 'live',
    description: 'Compare shortlisted venues, caterers, decorators, and photographers with structured checklists.'
  },
  {
    id: 'settings',
    label: 'Settings / About',
    icon: 'settings',
    moduleNumber: 6,
    status: 'live',
    description: 'Manage local browser storage, inspect AI/Demo mode status, and review privacy disclosures.'
  }
];

export const EVENT_CATEGORIES_PREVIEW = [
  {
    id: 'wedding',
    title: 'Wedding & Reception',
    badge: 'Multi-Phase Celebration',
    typicalScope: 'Venue booking, catering menus, decor styling, photography, and guest hospitality.',
    sampleAllocation: 'Venue & Catering (~55%), Decor (~18%), Photography (~12%), Logistics & Buffer (~15%)'
  },
  {
    id: 'birthday',
    title: 'Milestone Birthday & Anniversary',
    badge: 'Intimate or Large Gathering',
    typicalScope: 'Theme concept, custom cake & dining, entertainment, invitations, and return gifts.',
    sampleAllocation: 'Food & Cake (~45%), Venue & Decor (~30%), Entertainment & Photo (~15%), Misc (~10%)'
  },
  {
    id: 'community',
    title: 'College Fest & Community Event',
    badge: 'Public or Campus Event',
    typicalScope: 'Stage & AV setup, permissions, volunteer coordination, guest speakers, and refreshments.',
    sampleAllocation: 'Stage & Sound (~35%), Refreshments (~30%), Marketing & Passes (~20%), Contingency (~15%)'
  }
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Add event details',
    description:
      'Enter your celebration type, target date, city, guest count, indoor/outdoor preference, and total INR budget.'
  },
  {
    step: '02',
    title: 'Generate a structured plan',
    description:
      'Use the AI Event Planner (or offline sample mode) to propose practical themes, preparation phases, and budget splits.'
  },
  {
    step: '03',
    title: 'Organize budget, tasks & vendors',
    description:
      'Track planned vs. actual expenses, tick off phase-wise tasks, and maintain your own vendor comparison shortlist.'
  }
];
