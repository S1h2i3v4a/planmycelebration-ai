import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function AppShell({
  navItems,
  activePageId,
  onSelectPage,
  onOpenCreateEventModal,
  events = [],
  activeEvent = null,
  onSelectActiveEvent,
  children
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentNav =
    navItems.find((item) => item.id === activePageId) || navItems[0];

  const handleNavClick = (id) => {
    onSelectPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <a href="#main-workspace" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Left Sidebar Navigation */}
      <aside
        className={`app-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Primary Sidebar Navigation"
      >
        <div className="sidebar-brand">
          <a
            href="#overview"
            className="brand-identity"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('overview');
            }}
          >
            <span className="brand-mark">P</span>
            <span>
              <span className="brand-title">PlanMyCelebration</span>
              <span className="brand-subtitle">AI Event Workspace</span>
            </span>
          </a>
        </div>

        <nav className="sidebar-nav" aria-label="Workspace Sections">
          <div className="nav-section-label">Planning Workspace</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = item.id === activePageId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-item-btn ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="nav-item-left">
                      <Icon name={item.icon} size={18} />
                      <span>{item.label}</span>
                    </span>
                    {isActive && (
                      <span
                        className="nav-item-indicator"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-row">
            <span>Saved Events</span>
            <Badge variant="plum">{events.length}</Badge>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-sidebar-muted)' }}>
            Stored locally in browser
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name="menu" size={20} />
            </button>

            <div className="topbar-title-group">
              <span className="topbar-breadcrumb">
                PlanMyCelebration AI / {currentNav.label}
              </span>
              <h1 className="topbar-title">{currentNav.label}</h1>
            </div>
          </div>

          <div className="topbar-right">
            {events.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <label
                  htmlFor="topbar-event-switcher"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500 }}
                >
                  Active Event:
                </label>
                <select
                  id="topbar-event-switcher"
                  className="topbar-event-select"
                  value={activeEvent?.id || ''}
                  onChange={(e) => onSelectActiveEvent(e.target.value)}
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="workspace-pill" title="Current event selector">
                <Icon name="calendar" size={14} />
                <span>No active event selected</span>
              </div>
            )}

            <Button
              variant="primary"
              onClick={() => onOpenCreateEventModal()}
            >
              <Icon name="plus" size={16} />
              <span>Create Event</span>
            </Button>
          </div>
        </header>

        <main id="main-workspace" className="page-container" tabIndex="-1">
          {children}
        </main>
      </div>
    </div>
  );
}
