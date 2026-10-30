/**
 * Single source of truth for INR currency formatting, budget totals,
 * and task progress calculations across Dashboard, Budget, and Timeline pages.
 */

export function formatCurrency(amount, currency = 'INR') {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) {
    return currency === 'INR' ? '₹0' : '0';
  }

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(numeric);
  } catch {
    return `₹${Math.round(numeric).toLocaleString('en-IN')}`;
  }
}

export function calculateBudgetSummary(event) {
  if (!event || typeof event !== 'object') {
    return {
      totalBudget: 0,
      plannedTotal: 0,
      actualTotal: 0,
      remainingPlanned: 0,
      remainingActual: 0,
      isOverPlanned: false,
      isOverActual: false,
      utilizationPercent: 0
    };
  }

  const totalBudget = Math.max(0, Number(event.totalBudget) || 0);
  const categories = Array.isArray(event.budgetCategories)
    ? event.budgetCategories
    : [];

  let plannedTotal = 0;
  let actualTotal = 0;

  for (const cat of categories) {
    const planned = Math.max(0, Number(cat?.planned) || 0);
    const actual = Math.max(0, Number(cat?.actual) || 0);
    plannedTotal += planned;
    actualTotal += actual;
  }

  const remainingPlanned = totalBudget - plannedTotal;
  const remainingActual = totalBudget - actualTotal;
  const isOverPlanned = totalBudget > 0 && plannedTotal > totalBudget;
  const isOverActual = totalBudget > 0 && actualTotal > totalBudget;
  const utilizationPercent =
    totalBudget > 0
      ? Math.min(100, Math.round((plannedTotal / totalBudget) * 100))
      : 0;

  return {
    totalBudget,
    plannedTotal,
    actualTotal,
    remainingPlanned,
    remainingActual,
    isOverPlanned,
    isOverActual,
    utilizationPercent
  };
}

export function calculateTaskSummary(event) {
  const tasks = Array.isArray(event?.tasks) ? event.tasks : [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => Boolean(t?.completed)).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercent
  };
}

export function getDaysUntilDate(dateString) {
  if (!dateString) return null;
  const cleanDate = String(dateString).split('T')[0];
  const parsed = new Date(`${cleanDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = parsed.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatReadableDate(dateString) {
  if (!dateString) return 'Date not set';
  const cleanDate = String(dateString).split('T')[0];
  const parsed = new Date(`${cleanDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return 'Invalid date';

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
