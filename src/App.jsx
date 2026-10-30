import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppShell } from './layouts/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { MyEventsPage } from './pages/MyEventsPage';
import { BudgetPage } from './pages/BudgetPage';
import { TimelineTasksPage } from './pages/TimelineTasksPage';
import { AiPlannerPage } from './pages/AiPlannerPage';
import { VendorsPage } from './pages/VendorsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';
import { EventWizardModal } from './components/EventWizardModal';
import { NAV_ITEMS } from './utils/navigation';
import {
  loadSavedEvents,
  saveEventsToStorage,
  loadActiveEventId,
  saveActiveEventId,
  createSampleCelebrationEvent,
  sanitizeEventRecord
} from './utils/storage';

export function App() {
  const [events, setEvents] = useState(() => loadSavedEvents().events);
  const [activeEventId, setActiveEventId] = useState(() => {
    const initialEvents = loadSavedEvents().events;
    return loadActiveEventId(initialEvents);
  });

  const [showWelcomeGuide, setShowWelcomeGuide] = useState(
    () => loadSavedEvents().events.length === 0
  );

  const [activePageId, setActivePageId] = useState('overview');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  useEffect(() => {
    saveActiveEventId(activeEventId);
  }, [activeEventId]);

  const activeEvent =
    events.find((ev) => ev.id === activeEventId) || events[0] || null;

  const activeNavItem =
    NAV_ITEMS.find((item) => item.id === activePageId) || NAV_ITEMS[0];

  const handleOpenCreateModal = (categoryTitle = '') => {
    setEditingEvent(null);
    setPreselectedCategory(categoryTitle);
    setWizardOpen(true);
  };

  const handleOpenEditModal = (eventToEdit) => {
    setPreselectedCategory('');
    setEditingEvent(eventToEdit);
    setWizardOpen(true);
  };

  const handleSaveEvent = (rawEventPayload, isEditing) => {
    const cleanEvent = sanitizeEventRecord(rawEventPayload);
    if (!cleanEvent) return;

    if (isEditing) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === cleanEvent.id ? cleanEvent : ev))
      );
      setActiveEventId(cleanEvent.id);
    } else {
      setEvents((prev) => [cleanEvent, ...prev]);
      setActiveEventId(cleanEvent.id);
      setShowWelcomeGuide(false);
      setActivePageId('overview');
    }
  };

  const handleUpdateActiveEvent = (updatedEventObj) => {
    const clean = sanitizeEventRecord(updatedEventObj);
    if (!clean) return;
    setEvents((prev) =>
      prev.map((ev) => (ev.id === clean.id ? clean : ev))
    );
  };

  const handleLoadSampleEvent = () => {
    const existingSample = events.find((ev) => ev.isSample);
    if (existingSample) {
      setActiveEventId(existingSample.id);
      setShowWelcomeGuide(false);
      setActivePageId('overview');
      return;
    }

    const sample = createSampleCelebrationEvent();
    const updated = [sample, ...events];
    setEvents(updated);
    setActiveEventId(sample.id);
    setShowWelcomeGuide(false);
    setActivePageId('overview');
  };

  const handleRemoveEvent = (eventId) => {
    const remaining = events.filter((ev) => ev.id !== eventId);
    setEvents(remaining);
    if (activeEventId === eventId) {
      setActiveEventId(remaining[0]?.id || null);
    }
  };

  const handleSelectPage = (pageId) => {
    setActivePageId(pageId);
    if (pageId === 'overview' && events.length > 0) {
      setShowWelcomeGuide(false);
    }
  };

  const renderActivePage = () => {
    if (activePageId === 'overview') {
      return showWelcomeGuide ? (
        <WelcomePage
          savedEventCount={events.length}
          onOpenCreateEventModal={() => handleOpenCreateModal('')}
          onSelectCategory={(catTitle) => handleOpenCreateModal(catTitle)}
          onLoadSampleEvent={handleLoadSampleEvent}
          onReturnToDashboard={() => setShowWelcomeGuide(false)}
        />
      ) : (
        <OverviewDashboard
          events={events}
          activeEvent={activeEvent}
          onSelectActiveEvent={(id) => setActiveEventId(id)}
          onOpenCreateEventModal={() => handleOpenCreateModal('')}
          onLoadSampleEvent={handleLoadSampleEvent}
          onRemoveEvent={handleRemoveEvent}
          onNavigate={(pageId) => setActivePageId(pageId)}
          onShowWelcomeGuide={() => setShowWelcomeGuide(true)}
        />
      );
    }

    if (activePageId === 'my-events') {
      return (
        <MyEventsPage
          events={events}
          activeEventId={activeEvent?.id || null}
          onSelectActiveEvent={(id) => setActiveEventId(id)}
          onOpenCreateEventModal={() => handleOpenCreateModal('')}
          onEditEvent={handleOpenEditModal}
          onDeleteEvent={handleRemoveEvent}
          onLoadSampleEvent={handleLoadSampleEvent}
          onNavigate={(pageId) => setActivePageId(pageId)}
        />
      );
    }

    if (activePageId === 'ai-planner') {
      return (
        <AiPlannerPage
          activeEvent={activeEvent}
          onUpdateEvent={handleUpdateActiveEvent}
          onOpenCreateEventModal={() => handleOpenCreateModal('')}
          onLoadSampleEvent={handleLoadSampleEvent}
        />
      );
    }

    if (activePageId === 'budget') {
      return (
        <BudgetPage
          activeEvent={activeEvent}
          onUpdateEvent={handleUpdateActiveEvent}
          onOpenCreateEventModal={() => handleOpenCreateModal('')}
          onLoadSampleEvent={handleLoadSampleEvent}
        />
      );
    }

    if (activePageId === 'timeline-tasks') {
      return (
        <TimelineTasksPage
          activeEvent={activeEvent}
          onUpdateEvent={handleUpdateActiveEvent}
          onOpenCreateEventModal={() => handleOpenCreateModal('')}
          onLoadSampleEvent={handleLoadSampleEvent}
        />
      );
    }

    if (activePageId === 'vendors') {
      return (
        <VendorsPage
          activeEvent={activeEvent}
          onUpdateEvent={handleUpdateActiveEvent}
          onOpenCreateEventModal={() => handleOpenCreateModal('')}
          onLoadSampleEvent={handleLoadSampleEvent}
        />
      );
    }

    if (activePageId === 'settings') {
      return <SettingsPage />;
    }

    return (
      <ModulePlaceholderPage
        navItem={activeNavItem}
        onReturnHome={() => setActivePageId('overview')}
        onOpenCreateEventModal={() => handleOpenCreateModal('')}
      />
    );
  };

  return (
    <ErrorBoundary>
      <AppShell
        navItems={NAV_ITEMS}
        activePageId={activePageId}
        onSelectPage={handleSelectPage}
        onOpenCreateEventModal={() => handleOpenCreateModal('')}
        events={events}
        activeEvent={activeEvent}
        onSelectActiveEvent={(id) => setActiveEventId(id)}
      >
        {renderActivePage()}
      </AppShell>

      <EventWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSaveEvent={handleSaveEvent}
        initialCategoryHint={preselectedCategory}
        editingEvent={editingEvent}
      />
    </ErrorBoundary>
  );
}

export default App;
