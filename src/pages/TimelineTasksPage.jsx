import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { InputField, SelectField } from '../components/ui/Input';
import { Icon } from '../components/Icon';
import {
  calculateTaskSummary,
  formatReadableDate,
  getDaysUntilDate
} from '../utils/calculations';
import {
  TASK_PHASES,
  TASK_CATEGORIES,
  generatePhaseScheduleTasks
} from '../utils/storage';

const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

export function TimelineTasksPage({
  activeEvent,
  onUpdateEvent,
  onOpenCreateEventModal,
  onLoadSampleEvent
}) {
  const [statusFilter, setStatusFilter] = useState('All'); // All | Pending | Completed
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Add / Edit Task Modal State
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    phase: 'Initial Planning',
    priority: 'Medium',
    category: 'General',
    dueDate: ''
  });
  const [taskError, setTaskError] = useState('');

  if (!activeEvent) {
    return (
      <section aria-labelledby="tasks-empty-heading">
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <Badge variant="plum">Timeline & Tasks</Badge>
            <h2 id="tasks-empty-heading" style={{ marginTop: 'var(--space-2)' }}>
              Select or create an event to manage its preparation timeline
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
              Organize tasks across Initial Planning, Bookings, Preparation, Final Checks, and
              Event Day.
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

  const tasks = Array.isArray(activeEvent.tasks) ? activeEvent.tasks : [];
  const taskStats = calculateTaskSummary(activeEvent);
  const daysUntilEvent = getDaysUntilDate(activeEvent.date);
  const isPastEvent = daysUntilEvent !== null && daysUntilEvent < 0;

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === 'Pending' && t.completed) return false;
      if (statusFilter === 'Completed' && !t.completed) return false;
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, categoryFilter]);

  const handleToggleTask = (taskId) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateEvent({
      ...activeEvent,
      tasks: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    onUpdateEvent({
      ...activeEvent,
      tasks: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleOpenAddModal = (defaultPhase = 'Initial Planning') => {
    setEditingTask(null);
    setTaskError('');
    setTaskForm({
      title: '',
      phase: TASK_PHASES.includes(defaultPhase) ? defaultPhase : 'Initial Planning',
      priority: 'Medium',
      category: 'General',
      dueDate: activeEvent.date || new Date().toISOString().split('T')[0]
    });
    setTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setTaskError('');
    setTaskForm({
      title: task.title || '',
      phase: TASK_PHASES.includes(task.phase) ? task.phase : 'Initial Planning',
      priority: PRIORITY_LEVELS.includes(task.priority) ? task.priority : 'Medium',
      category: task.category || 'General',
      dueDate: task.dueDate || ''
    });
    setTaskModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const trimmed = taskForm.title.trim();
    if (!trimmed || trimmed.length < 3) {
      setTaskError('Please enter a task title (at least 3 characters).');
      return;
    }

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: trimmed,
              phase: taskForm.phase,
              priority: taskForm.priority,
              category: taskForm.category,
              dueDate: taskForm.dueDate
            }
          : t
      );
      onUpdateEvent({
        ...activeEvent,
        tasks: updated,
        updatedAt: new Date().toISOString()
      });
    } else {
      const newTask = {
        id: `task_${Date.now()}`,
        title: trimmed,
        phase: taskForm.phase,
        priority: taskForm.priority,
        category: taskForm.category,
        dueDate: taskForm.dueDate,
        completed: false
      };
      onUpdateEvent({
        ...activeEvent,
        tasks: [...tasks, newTask],
        updatedAt: new Date().toISOString()
      });
    }
    setTaskModalOpen(false);
  };

  const handleGenerateSmartSchedule = () => {
    const generated = generatePhaseScheduleTasks(activeEvent);
    // Avoid duplicating identical titles if already present
    const existingTitles = new Set(tasks.map((t) => t.title.toLowerCase()));
    const merged = [
      ...tasks,
      ...generated.filter((g) => !existingTitles.has(g.title.toLowerCase()))
    ];
    onUpdateEvent({
      ...activeEvent,
      tasks: merged,
      updatedAt: new Date().toISOString()
    });
  };

  const getPriorityBadgeVariant = (priority) => {
    if (priority === 'High') return 'coral';
    if (priority === 'Medium') return 'plum';
    return 'neutral';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header & Progress Overview */}
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
            <Badge variant="neutral">Target Date: {formatReadableDate(activeEvent.date)}</Badge>
            {isPastEvent && (
              <Badge variant="gold">Past Event Date — Schedule Anchored Safely</Badge>
            )}
          </div>
          <h2>Timeline & Task Checklist — {activeEvent.name}</h2>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Track preparation milestones across 5 phases from initial planning to event day.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={handleGenerateSmartSchedule}>
            <Icon name="sparkles" size={16} />
            <span>Add Recommended Schedule Tasks</span>
          </Button>
          <Button variant="primary" onClick={() => handleOpenAddModal('Initial Planning')}>
            <Icon name="plus" size={16} />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Progress Bar & Filter Controls Card */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <strong style={{ fontSize: 'var(--text-base)' }}>
              Overall Checklist Progress: {taskStats.completionPercent}%
            </strong>
            <p style={{ fontSize: 'var(--text-xs)' }}>
              {taskStats.completedTasks} completed • {taskStats.pendingTasks} pending ({taskStats.totalTasks} total)
            </p>
          </div>
          <Badge variant={taskStats.completionPercent === 100 ? 'plum' : 'coral'}>
            {taskStats.completedTasks} / {taskStats.totalTasks} Done
          </Badge>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={taskStats.completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${taskStats.completionPercent}%` }}
          />
        </div>

        {/* Filter Bar */}
        <div className="tasks-filter-row">
          <div
            className="status-Segmented-group"
            role="group"
            aria-label="Filter tasks by completion status"
          >
            {['All', 'Pending', 'Completed'].map((status) => (
              <button
                key={status}
                type="button"
                className={`segmented-btn ${statusFilter === status ? 'is-active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status} (
                {status === 'All'
                  ? taskStats.totalTasks
                  : status === 'Pending'
                  ? taskStats.pendingTasks
                  : taskStats.completedTasks}
                )
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <label
              htmlFor="task-cat-filter"
              style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              Category:
            </label>
            <select
              id="task-cat-filter"
              className="form-select"
              style={{ width: 'auto', minWidth: '150px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 5 Preparation Phases */}
      {tasks.length === 0 ? (
        <Card variant="subtle" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <h3>No tasks in this checklist yet</h3>
          <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px', marginBottom: 'var(--space-4)' }}>
            Generate a practical 5-phase preparation schedule relative to your event date or add custom tasks manually.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
            <Button variant="primary" onClick={handleGenerateSmartSchedule}>
              <Icon name="sparkles" size={16} />
              <span>Generate 5-Phase Schedule</span>
            </Button>
            <Button variant="secondary" onClick={() => handleOpenAddModal('Initial Planning')}>
              <Icon name="plus" size={16} />
              <span>Add Custom Task</span>
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {TASK_PHASES.map((phaseName, index) => {
            const phaseAllTasks = tasks.filter((t) => t.phase === phaseName);
            const phaseVisibleTasks = filteredTasks.filter((t) => t.phase === phaseName);
            const phaseDoneCount = phaseAllTasks.filter((t) => t.completed).length;

            return (
              <Card key={phaseName} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="phase-header-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span className="step-number">0{index + 1}</span>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)' }}>{phaseName}</h3>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {phaseDoneCount} of {phaseAllTasks.length} completed in this phase
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => handleOpenAddModal(phaseName)}
                  >
                    <Icon name="plus" size={15} />
                    <span>Add to {phaseName}</span>
                  </Button>
                </div>

                {phaseVisibleTasks.length === 0 ? (
                  <div className="phase-empty-note">
                    {phaseAllTasks.length === 0
                      ? `No tasks scheduled in ${phaseName} yet.`
                      : `No ${statusFilter.toLowerCase()} tasks match the current filter in ${phaseName}.`}
                  </div>
                ) : (
                  <div className="task-items-stack">
                    {phaseVisibleTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`task-row-item ${task.completed ? 'is-completed' : ''}`}
                      >
                        <label className="task-checkbox-label">
                          <input
                            type="checkbox"
                            checked={Boolean(task.completed)}
                            onChange={() => handleToggleTask(task.id)}
                            className="task-checkbox-input"
                          />
                          <span className="task-title-text">{task.title}</span>
                        </label>

                        <div className="task-meta-actions">
                          <Badge variant={getPriorityBadgeVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="neutral">{task.category}</Badge>
                          {task.dueDate && (
                            <span className="task-due-pill">
                              Due: {formatReadableDate(task.dueDate)}
                            </span>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Button
                              variant="ghost"
                              onClick={() => handleOpenEditModal(task)}
                              aria-label={`Edit task ${task.title}`}
                              style={{ padding: '0.3rem 0.5rem' }}
                            >
                              <Icon name="edit" size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteTask(task.id)}
                              aria-label={`Delete task ${task.title}`}
                              style={{ padding: '0.3rem 0.5rem', color: 'var(--status-danger-text)' }}
                            >
                              <Icon name="trash" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={editingTask ? 'Edit Preparation Task' : 'Add Preparation Task'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveTask}>
              <Icon name="check" size={15} />
              <span>{editingTask ? 'Save Task Changes' : 'Add Task to Checklist'}</span>
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveTask} className="wizard-form-grid">
          <InputField
            id="task-title-input"
            label="Task Title"
            required
            placeholder="e.g., Confirm generator backup with lighting vendor"
            value={taskForm.title}
            onChange={(e) => {
              setTaskForm((prev) => ({ ...prev, title: e.target.value }));
              if (taskError) setTaskError('');
            }}
            error={taskError}
          />

          <div className="form-row-2">
            <SelectField
              id="task-phase-select"
              label="Preparation Phase"
              value={taskForm.phase}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, phase: e.target.value }))
              }
              options={TASK_PHASES}
            />

            <SelectField
              id="task-category-select"
              label="Category"
              value={taskForm.category}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, category: e.target.value }))
              }
              options={TASK_CATEGORIES}
            />
          </div>

          <div className="form-row-2">
            <SelectField
              id="task-priority-select"
              label="Priority"
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, priority: e.target.value }))
              }
              options={PRIORITY_LEVELS}
            />

            <InputField
              id="task-due-date"
              label="Target Due Date (Optional)"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
