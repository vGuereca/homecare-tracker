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

  const [healthStatus, setHealthStatus] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [maintenanceReport, setMaintenanceReport] = useState(null);

  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [searchForm, setSearchForm] = useState(initialSearchForm);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [loadingHealth, setLoadingHealth] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingReport, setLoadingReport] = useState(true);
  const [submittingTask, setSubmittingTask] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    fetchHealthStatus();
    fetchTasks();
    fetchDashboardSummary();
    fetchMaintenanceReport();
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

    setHealthStatus(null);
    setTasks([]);
    setDashboardSummary(null);
    setMaintenanceReport(null);
    setTaskForm(initialTaskForm);
    setSearchForm(initialSearchForm);
    setEditingTaskId(null);

    setErrorMessage('');
    setSuccessMessage('');
  }

  async function fetchHealthStatus() {
    try {
      setLoadingHealth(true);
      const data = await apiRequest('/api/health');
      setHealthStatus(data);
    } catch (error) {
      setErrorMessage(
          'Unable to connect to the backend. Make sure the Spring Boot server is running on port 8080.'
      );
    } finally {
      setLoadingHealth(false);
    }
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

  async function fetchMaintenanceReport() {
    try {
      setLoadingReport(true);
      const data = await apiRequest('/api/tasks/report');
      setMaintenanceReport(data);
    } catch (error) {
      setErrorMessage('Unable to load maintenance report from the backend.');
    } finally {
      setLoadingReport(false);
    }
  }

  async function refreshAllTaskData() {
    await fetchTasks();
    await fetchDashboardSummary();
    await fetchMaintenanceReport();
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

    setErrorMessage('');
    setSuccessMessage('Editing selected maintenance task.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setTaskForm(initialTaskForm);
    setEditingTaskId(null);
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
          <section className="page-header">
            <div>
              <p className="eyebrow">Portfolio Project</p>
              <h1>Home maintenance, organized by priority.</h1>
              <p className="hero-description">
                Track recurring work, estimated costs, due dates, urgency, and completion status from one secure dashboard.
              </p>
            </div>

            <div className="hero-callout">
              <span className="label">Authenticated workspace</span>
              <strong>User-specific tasks</strong>
              <p>Only your maintenance tasks are shown after login.</p>
            </div>
          </section>

          <section className="status-panel card">
            <div className="section-header">
              <h2>Backend Connection</h2>
              <button type="button" className="secondary-button" onClick={fetchHealthStatus}>
                Check Status
              </button>
            </div>

            {loadingHealth && <p>Checking backend connection...</p>}

            {!loadingHealth && healthStatus && (
                <div className="status-grid">
                  <div>
                    <span className="label">Backend Status</span>
                    <strong>{healthStatus.status}</strong>
                  </div>
                  <div>
                    <span className="label">Application</span>
                    <strong>{healthStatus.application}</strong>
                  </div>
                </div>
            )}
          </section>

          {errorMessage && <div className="alert error-message">{errorMessage}</div>}
          {successMessage && <div className="alert success-message">{successMessage}</div>}

          <section className="card">
            <div className="section-header">
              <div>
                <h2>Dashboard Summary</h2>
                <p className="section-description">
                  A quick snapshot of active, completed, overdue, and estimated open-cost maintenance work.
                </p>
              </div>
            </div>

            {loadingDashboard && <p>Loading dashboard summary...</p>}

            {!loadingDashboard && dashboardSummary && (
                <div className="dashboard-grid">
                  <div className="metric-card">
                    <span className="label">Open / Active Tasks</span>
                    <strong>{dashboardSummary.openTasks}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="label">Completed Tasks</span>
                    <strong>{dashboardSummary.completedTasks}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="label">Overdue Tasks</span>
                    <strong>{dashboardSummary.overdueTasks}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="label">Estimated Open Cost</span>
                    <strong>
                      ${Number(dashboardSummary.totalEstimatedOpenCost).toFixed(2)}
                    </strong>
                  </div>
                </div>
            )}
          </section>

          <section className="card">
            <h2>{editingTaskId ? 'Edit Maintenance Task' : 'Add Maintenance Task'}</h2>

            <form className="task-form" onSubmit={handleSubmitTask}>
              <div className="form-row">
                <label>
                  Task Name
                  <input
                      type="text"
                      name="taskName"
                      value={taskForm.taskName}
                      onChange={handleInputChange}
                      required
                  />
                </label>

                <label>
                  Category
                  <input
                      type="text"
                      name="category"
                      value={taskForm.category}
                      onChange={handleInputChange}
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
                />
              </label>

              <div className="form-row">
                <label>
                  Due Date
                  <input
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleInputChange}
                      required
                  />
                </label>

                <label>
                  Estimated Cost
                  <input
                      type="number"
                      name="estimatedCost"
                      value={taskForm.estimatedCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
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

              <label>
                Notes
                <textarea
                    name="notes"
                    value={taskForm.notes}
                    onChange={handleInputChange}
                    rows="2"
                />
              </label>

              <div className="button-row">
                <button type="submit" disabled={submittingTask}>
                  {submittingTask
                      ? 'Saving Task...'
                      : editingTaskId
                          ? 'Update Task'
                          : 'Create Task'}
                </button>

                {editingTaskId && (
                    <button type="button" className="secondary-button" onClick={resetForm}>
                      Cancel Edit
                    </button>
                )}
              </div>
            </form>
          </section>

          <section className="card">
            <h2>Search and Filter Tasks</h2>
            <p className="section-description">
              Narrow the task list by keyword, category, status, urgency, or sort order.
            </p>

            <form className="task-form" onSubmit={handleSearchTasks}>
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

              <div className="button-row">
                <button type="submit">Search Tasks</button>
                <button type="button" className="secondary-button" onClick={handleClearSearch}>
                  Clear Search
                </button>
              </div>
            </form>
          </section>

          <section className="card">
            <div className="section-header">
              <div>
                <h2>Maintenance Task List</h2>
                <p className="section-description">
                  Tasks shown here belong to the currently signed-in user.
                </p>
              </div>

              <button type="button" className="secondary-button" onClick={refreshAllTaskData}>
                Refresh
              </button>
            </div>

            {loadingTasks && <p>Loading tasks...</p>}

            {!loadingTasks && tasks.length === 0 && (
                <div className="empty-state">
                  <strong>No maintenance tasks yet.</strong>
                  <p>Create your first task using the form above.</p>
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
                    {tasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.taskName}</td>
                          <td>{task.category}</td>
                          <td>{task.dueDate}</td>
                          <td>${Number(task.estimatedCost).toFixed(2)}</td>
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
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </section>

          <section className="card">
            <div className="section-header">
              <div>
                <h2>Maintenance Task Report</h2>
                {maintenanceReport && (
                    <p className="report-meta">
                      {maintenanceReport.title} | Generated: {maintenanceReport.generatedAt}
                    </p>
                )}
              </div>

              <button type="button" className="secondary-button" onClick={fetchMaintenanceReport}>
                Refresh Report
              </button>
            </div>

            {loadingReport && <p>Loading maintenance report...</p>}

            {!loadingReport && maintenanceReport && maintenanceReport.rows.length === 0 && (
                <div className="empty-state">
                  <strong>No report rows are available.</strong>
                  <p>Create maintenance tasks to populate this report.</p>
                </div>
            )}

            {!loadingReport && maintenanceReport && maintenanceReport.rows.length > 0 && (
                <div className="table-wrapper">
                  <table>
                    <thead>
                    <tr>
                      {maintenanceReport.columns.map((column) => (
                          <th key={column}>{column}</th>
                      ))}
                    </tr>
                    </thead>
                    <tbody>
                    {maintenanceReport.rows.map((row, rowIndex) => (
                        <tr key={`${row['Task Name']}-${rowIndex}`}>
                          {maintenanceReport.columns.map((column) => (
                              <td key={`${column}-${rowIndex}`}>{row[column]}</td>
                          ))}
                        </tr>
                    ))}
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