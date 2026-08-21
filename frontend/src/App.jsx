import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { apiRequest } from './services/apiClient';
import { getCurrentUser, logoutUser } from './services/authService';

const initialTaskForm = {
  taskName: '',
  category: '',
  description: '',
  dueDate: '',
  estimatedCost: '',
  urgencyLevel: 'MEDIUM',
  status: 'OPEN',
  notes: ''
};

const initialSearchForm = {
  keyword: '',
  category: '',
  status: '',
  urgencyLevel: '',
  sortBy: 'dueDate'
};

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [authView, setAuthView] = useState('login');


  const [tasks, setTasks] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);


  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [searchForm, setSearchForm] = useState(initialSearchForm);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activePanel, setActivePanel] = useState('tasks');


  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [submittingTask, setSubmittingTask] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    fetchTasks();
    fetchDashboardSummary();
  }, [currentUser]);

  function handleAuthSuccess(authResponse) {
    setCurrentUser({
      userId: authResponse.userId,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      email: authResponse.email,
      role: authResponse.role
    });

    setErrorMessage('');
    setSuccessMessage('Signed in successfully.');
  }

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
    setAuthView('login');


    setTasks([]);
    setDashboardSummary(null);

    setTaskForm(initialTaskForm);
    setSearchForm(initialSearchForm);
    setEditingTaskId(null);
    setActivePanel('tasks');

    setErrorMessage('');
    setSuccessMessage('');
  }


  async function fetchTasks() {
    try {
      setLoadingTasks(true);
      const data = await apiRequest('/api/tasks');
      setTasks(data);
    } catch (error) {
      setErrorMessage('Unable to load maintenance tasks from the backend.');
    } finally {
      setLoadingTasks(false);
    }
  }

  async function fetchDashboardSummary() {
    try {
      setLoadingDashboard(true);
      const data = await apiRequest('/api/tasks/dashboard');
      setDashboardSummary(data);
    } catch (error) {
      setErrorMessage('Unable to load dashboard summary from the backend.');
    } finally {
      setLoadingDashboard(false);
    }
  }



  async function refreshAllTaskData() {
    await fetchTasks();
    await fetchDashboardSummary();
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setTaskForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  function handleSearchInputChange(event) {
    const { name, value } = event.target;

    setSearchForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  function buildTaskRequestBody() {
    return {
      ...taskForm,
      estimatedCost: Number(taskForm.estimatedCost)
    };
  }

  function buildSearchPath() {
    const searchParams = new URLSearchParams();

    Object.entries(searchForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value.trim() !== '') {
        searchParams.append(key, value);
      }
    });

    return `/api/tasks/search?${searchParams.toString()}`;
  }

  async function handleSearchTasks(event) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    try {
      setLoadingTasks(true);
      const data = await apiRequest(buildSearchPath());
      setTasks(data);
      setSuccessMessage('Task search completed successfully.');
    } catch (error) {
      setErrorMessage('Unable to search maintenance tasks.');
    } finally {
      setLoadingTasks(false);
    }
  }

  async function handleClearSearch() {
    setSearchForm(initialSearchForm);
    setActivePanel('tasks');
    setErrorMessage('');
    setSuccessMessage('');
    await fetchTasks();
  }

  async function handleSubmitTask(event) {
    event.preventDefault();

    if (editingTaskId) {
      await handleUpdateTask();
    } else {
      await handleCreateTask();
    }
  }

  async function handleCreateTask() {
    setErrorMessage('');
    setSuccessMessage('');
    setSubmittingTask(true);

    try {
      await apiRequest('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(buildTaskRequestBody())
      });

      resetForm();
      setActivePanel('tasks');
      setSuccessMessage('Maintenance task created successfully.');
      await refreshAllTaskData();
    } catch (error) {
      setErrorMessage(
          'Unable to create maintenance task. Check that all required fields are valid.'
      );
    } finally {
      setSubmittingTask(false);
    }
  }

  async function handleUpdateTask() {
    setErrorMessage('');
    setSuccessMessage('');
    setSubmittingTask(true);

    try {
      await apiRequest(`/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        body: JSON.stringify(buildTaskRequestBody())
      });

      resetForm();
      setActivePanel('tasks');
      setSuccessMessage('Maintenance task updated successfully.');
      await refreshAllTaskData();
    } catch (error) {
      setErrorMessage(
          'Unable to update maintenance task. Check that all required fields are valid.'
      );
    } finally {
      setSubmittingTask(false);
    }
  }

  async function handleCompleteTask(taskId) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiRequest(`/api/tasks/${taskId}/complete`, {
        method: 'PATCH'
      });

      setSuccessMessage('Maintenance task marked as completed.');
      await refreshAllTaskData();
    } catch (error) {
      setErrorMessage('Unable to mark maintenance task as completed.');
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
        'Are you sure you want to delete this maintenance task?'
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiRequest(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (editingTaskId === taskId) {
        resetForm();
      }

      setSuccessMessage('Maintenance task deleted successfully.');
      await refreshAllTaskData();
    } catch (error) {
      setErrorMessage('Unable to delete maintenance task.');
    }
  }

  function handleEditTask(task) {
    setEditingTaskId(task.id);
    setTaskForm({
      taskName: task.taskName || '',
      category: task.category || '',
      description: task.description || '',
      dueDate: task.dueDate || '',
      estimatedCost: task.estimatedCost?.toString() || '',
      urgencyLevel: task.urgencyLevel || 'MEDIUM',
      status: task.status || 'OPEN',
      notes: task.notes || ''
    });

    setActivePanel('add');

    setErrorMessage('');
    setSuccessMessage('Editing selected maintenance task.');
  }

  function resetForm() {
    setTaskForm(initialTaskForm);
    setEditingTaskId(null);
  }

  function formatCurrency(value) {
    return `$${Number(value || 0).toFixed(2)}`;
  }

  function formatTaskDate(dateValue) {
    if (!dateValue) {
      return 'No due date';
    }

    const date = new Date(`${dateValue}T00:00:00`);

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  function isTaskOverdue(task) {
    if (!task.dueDate || task.status === 'COMPLETED') {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${task.dueDate}T00:00:00`);

    return dueDate < today;
  }

  function openAddTaskPanel() {
    resetForm();
    setActivePanel('add');
    setErrorMessage('');
    setSuccessMessage('');
  }

  function openFilterPanel() {
    setActivePanel('filter');
    setErrorMessage('');
    setSuccessMessage('');
  }

  function closeActivePanel() {
    resetForm();
    setActivePanel('tasks');
    setErrorMessage('');
    setSuccessMessage('');
  }

  if (!currentUser) {
    return authView === 'login' ? (
        <LoginPage
            onLogin={handleAuthSuccess}
            onSwitchToRegister={() => setAuthView('register')}
        />
    ) : (
        <RegisterPage
            onRegister={handleAuthSuccess}
            onSwitchToLogin={() => setAuthView('login')}
        />
    );
  }

  return (
      <div className="app-shell">
        <header className="top-nav">
          <div className="brand-block">
            <span className="brand-mark">HC</span>
            <div>
              <p className="brand-label">HomeCare Tracker</p>
              <p className="brand-subtitle">Maintenance planning dashboard</p>
            </div>
          </div>

          <div className="nav-user-area">
            <div className="user-summary">
              <span className="label">Signed in</span>
              <strong>{currentUser.firstName} {currentUser.lastName}</strong>
              <span>{currentUser.email}</span>
            </div>

            <button type="button" className="secondary-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <main className="app-container">
          <section className="page-header warm-hero">
            <div>
              <p className="eyebrow">HomeCare Tracker</p>
              <h1>Keep up with the work your home needs.</h1>
              <p className="hero-description">
                Plan repairs, track maintenance tasks, estimate costs, and stay ahead of small issues before they become expensive problems.
              </p>

              <div className="hero-highlights">
                <span>DIY planning</span>
                <span>Repair notes</span>
                <span>Cost tracking</span>
                <span>Priority reminders</span>
              </div>
            </div>

            <div className="hero-callout warm-callout">
              <span className="label">Today’s focus</span>
              <strong>Start with what matters most.</strong>
              <p>Review overdue, high-priority, and upcoming maintenance work first.</p>
            </div>
          </section>


          {errorMessage && <div className="alert error-message">{errorMessage}</div>}
          {successMessage && <div className="alert success-message">{successMessage}</div>}

          <section className="card dashboard-section">
            <div className="section-header refined-section-header">
              <div>
                <p className="section-kicker">Overview</p>
                <h2>Maintenance Dashboard</h2>
                <p className="section-description">
                  A focused view of current maintenance work, completion progress, overdue items, and open estimated cost.
                </p>
              </div>
            </div>

            {loadingDashboard && <p>Loading dashboard summary...</p>}

            {!loadingDashboard && dashboardSummary && (
                <div className="dashboard-grid refined-dashboard-grid">
                  <div className="metric-card refined-metric-card">
                    <span className="metric-label">Open Tasks</span>
                    <strong>{dashboardSummary.openTasks}</strong>
                    <p>Active maintenance items that still need attention.</p>
                  </div>

                  <div className="metric-card refined-metric-card">
                    <span className="metric-label">Completed</span>
                    <strong>{dashboardSummary.completedTasks}</strong>
                    <p>Tasks marked complete in this workspace.</p>
                  </div>

                  <div className="metric-card refined-metric-card">
                    <span className="metric-label">Overdue</span>
                    <strong>{dashboardSummary.overdueTasks}</strong>
                    <p>Past-due items that should be reviewed first.</p>
                  </div>

                  <div className="metric-card refined-metric-card cost-card">
                    <span className="metric-label">Open Cost</span>
                    <strong>
                      ${Number(dashboardSummary.totalEstimatedOpenCost).toFixed(2)}
                    </strong>
                    <p>Estimated cost remaining across open work.</p>
                  </div>
                </div>
            )}
          </section>


          <section className="card task-list-card">
            <div className="section-header refined-section-header task-list-header">
              <div>
                <p className="section-kicker">Task list</p>
                <h2>Maintenance Tasks</h2>
                <p className="section-description">
                  Review what needs attention, then add, filter, edit, complete, or remove tasks from one focused workspace.
                </p>
              </div>

              <div className="task-list-actions">
                <button type="button" className="secondary-button" onClick={openAddTaskPanel}>
                  Add Task
                </button>

                <button type="button" className="secondary-button" onClick={openFilterPanel}>
                  Filter
                </button>

                <button type="button" className="secondary-button" onClick={refreshAllTaskData}>
                  Refresh
                </button>
              </div>
            </div>

            {activePanel === 'filter' && (
                <div className="inline-panel filter-panel">
                  <div className="inline-panel-header panel-header-soft">
                    <div className="panel-title-group">
                      <span className="panel-icon">⌕</span>

                      <div>
                        <p className="section-kicker">Filter tasks</p>
                        <h3>Find the right maintenance work</h3>
                        <p>
                          Narrow your list by keyword, category, status, urgency, or sort order.
                        </p>
                      </div>
                    </div>

                    <button type="button" className="secondary-button small-button" onClick={closeActivePanel}>
                      Close
                    </button>
                  </div>

                  <form className="task-form refined-task-form compact-filter-form" onSubmit={handleSearchTasks}>
                    <div className="form-row">
                      <label>
                        Keyword
                        <input
                            type="text"
                            name="keyword"
                            value={searchForm.keyword}
                            onChange={handleSearchInputChange}
                            placeholder="Search name, category, description, or notes"
                        />
                      </label>

                      <label>
                        Category
                        <input
                            type="text"
                            name="category"
                            value={searchForm.category}
                            onChange={handleSearchInputChange}
                            placeholder="Example: HVAC"
                        />
                      </label>
                    </div>

                    <div className="form-row">
                      <label>
                        Status
                        <select
                            name="status"
                            value={searchForm.status}
                            onChange={handleSearchInputChange}
                        >
                          <option value="">Any Status</option>
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </label>

                      <label>
                        Urgency
                        <select
                            name="urgencyLevel"
                            value={searchForm.urgencyLevel}
                            onChange={handleSearchInputChange}
                        >
                          <option value="">Any Urgency</option>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </label>
                    </div>

                    <label>
                      Sort By
                      <select
                          name="sortBy"
                          value={searchForm.sortBy}
                          onChange={handleSearchInputChange}
                      >
                        <option value="dueDate">Due Date</option>
                        <option value="taskName">Task Name</option>
                        <option value="category">Category</option>
                        <option value="estimatedCost">Estimated Cost</option>
                        <option value="urgencyLevel">Urgency</option>
                        <option value="status">Status</option>
                      </select>
                    </label>

                    <div className="filter-action-bar">
                      <button type="submit">Apply Filters</button>
                      <button type="button" className="secondary-button" onClick={handleClearSearch}>
                        Clear Filters
                      </button>
                    </div>
                  </form>
                </div>
            )}

            {activePanel === 'add' && (
                <div className="inline-panel task-editor-inline-panel">
                  <div className="inline-panel-header panel-header-soft">
                    <div className="panel-title-group">
                      <span className="panel-icon">{editingTaskId ? '✎' : '+'}</span>

                      <div>
                        <p className="section-kicker">{editingTaskId ? 'Update task' : 'New task'}</p>
                        <h3>{editingTaskId ? 'Edit Maintenance Task' : 'Add Maintenance Task'}</h3>
                        <p>
                          {editingTaskId
                              ? 'Update the details, timing, priority, or notes for this maintenance item.'
                              : 'Add a repair, inspection, seasonal reminder, or DIY project to your home maintenance list.'}
                        </p>
                      </div>
                    </div>

                    <button type="button" className="secondary-button small-button" onClick={closeActivePanel}>
                      Close
                    </button>
                  </div>

                  {editingTaskId && (
                      <div className="panel-status-strip">
                        <span className="edit-mode-pill">Editing selected task</span>
                        <span>Save changes or cancel to return to the task list.</span>
                      </div>
                  )}

                  <form className="task-form refined-task-form" onSubmit={handleSubmitTask}>
                    <div className="form-section">
                      <div className="form-section-heading">
                        <span>01</span>
                        <div>
                          <h3>Task details</h3>
                          <p>Name the maintenance item and assign it to a category.</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <label>
                          Task Name <span className="required-marker">Required</span>
                          <input
                              type="text"
                              name="taskName"
                              value={taskForm.taskName}
                              onChange={handleInputChange}
                              placeholder="Replace HVAC filter"
                              required
                          />
                        </label>

                        <label>
                          Category <span className="required-marker">Required</span>
                          <input
                              type="text"
                              name="category"
                              value={taskForm.category}
                              onChange={handleInputChange}
                              placeholder="HVAC, Plumbing, Electrical"
                              required
                          />
                        </label>
                      </div>

                      <label>
                        Description
                        <textarea
                            name="description"
                            value={taskForm.description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Add context about what needs to be inspected, repaired, or replaced."
                        />
                      </label>
                    </div>

                    <div className="form-section">
                      <div className="form-section-heading">
                        <span>02</span>
                        <div>
                          <h3>Schedule and priority</h3>
                          <p>Set timing, estimated cost, urgency, and current status.</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <label>
                          Due Date <span className="required-marker">Required</span>
                          <input
                              type="date"
                              name="dueDate"
                              value={taskForm.dueDate}
                              onChange={handleInputChange}
                              required
                          />
                        </label>

                        <label>
                          Estimated Cost <span className="required-marker">Required</span>
                          <input
                              type="number"
                              name="estimatedCost"
                              value={taskForm.estimatedCost}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              placeholder="150.00"
                              required
                          />
                        </label>
                      </div>

                      <div className="form-row">
                        <label>
                          Urgency
                          <select
                              name="urgencyLevel"
                              value={taskForm.urgencyLevel}
                              onChange={handleInputChange}
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                          </select>
                        </label>

                        <label>
                          Status
                          <select
                              name="status"
                              value={taskForm.status}
                              onChange={handleInputChange}
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="form-section-heading">
                        <span>03</span>
                        <div>
                          <h3>Notes</h3>
                          <p>Add optional details for future reference.</p>
                        </div>
                      </div>

                      <label>
                        Notes
                        <textarea
                            name="notes"
                            value={taskForm.notes}
                            onChange={handleInputChange}
                            rows="2"
                            placeholder="Add warranty details, parts needed, contractor notes, or inspection reminders."
                        />
                      </label>
                    </div>

                    <div className="form-action-bar panel-action-bar">
                      <div>
                        <strong>{editingTaskId ? 'Ready to save changes?' : 'Ready to add this task?'}</strong>
                        <span>
      {editingTaskId
          ? 'Your updates will return you to the task list.'
          : 'The new task will appear in your maintenance task list.'}
    </span>
                      </div>

                      <div className="panel-action-buttons">
                        <button type="button" className="secondary-button" onClick={closeActivePanel}>
                          Cancel
                        </button>

                        <button type="submit" disabled={submittingTask}>
                          {submittingTask
                              ? 'Saving Task...'
                              : editingTaskId
                                  ? 'Update Task'
                                  : 'Create Task'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
            )}

            {loadingTasks && <p>Loading tasks...</p>}

            {!loadingTasks && tasks.length === 0 && (
                <div className="empty-state task-empty-state">
                  <div>
                    <span className="empty-state-icon">✓</span>
                  </div>

                  <div>
                    <strong>No maintenance tasks yet.</strong>
                    <p>
                      Start by adding a repair, inspection, seasonal task, or DIY project you want to keep track of.
                    </p>

                    <div className="empty-state-suggestions">
                      <span>HVAC filter</span>
                      <span>Water heater flush</span>
                      <span>Smoke detector batteries</span>
                      <span>Roof inspection</span>
                    </div>

                    <button type="button" onClick={openAddTaskPanel}>
                      Add Your First Task
                    </button>
                  </div>
                </div>
            )}

            {!loadingTasks && tasks.length > 0 && (
                <div className="table-wrapper">
                  <table>
                    <thead>
                    <tr>
                      <th>Task Name</th>
                      <th>Category</th>
                      <th>Due Date</th>
                      <th>Estimated Cost</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => {
                      const overdue = isTaskOverdue(task);

                      return (
                          <tr key={task.id} className={overdue ? 'overdue-row' : ''}>
                            <td>
                              <div className="task-name-cell">
                                <strong>{task.taskName}</strong>

                                {task.description && (
                                    <span>{task.description}</span>
                                )}

                                {overdue && (
                                    <span className="overdue-note">Overdue</span>
                                )}
                              </div>
                            </td>

                            <td>
                              <span className="category-pill">{task.category}</span>
                            </td>

                            <td>
                              <div className="date-cell">
                                <strong>{formatTaskDate(task.dueDate)}</strong>
                                <span>Due date</span>
                              </div>
                            </td>

                            <td>
                              <div className="cost-cell">
                                <strong>{formatCurrency(task.estimatedCost)}</strong>
                                <span>Estimated</span>
                              </div>
                            </td>

                            <td>
          <span className={`badge urgency-${task.urgencyLevel.toLowerCase()}`}>
            {task.urgencyLevel}
          </span>
                            </td>

                            <td>
          <span className={`badge status-${task.status.toLowerCase().replace('_', '-')}`}>
            {task.status.replace('_', ' ')}
          </span>
                            </td>

                            <td>
                              <div className="table-actions">
                                <button
                                    type="button"
                                    className="small-button"
                                    onClick={() => handleEditTask(task)}
                                >
                                  Edit
                                </button>

                                <button
                                    type="button"
                                    className="small-button success-button"
                                    onClick={() => handleCompleteTask(task.id)}
                                    disabled={task.status === 'COMPLETED'}
                                >
                                  Complete
                                </button>

                                <button
                                    type="button"
                                    className="small-button danger-button"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
            )}
          </section>

        </main>
      </div>
  );
}

export default App;