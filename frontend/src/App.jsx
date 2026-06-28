import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
    fetchHealthStatus();
    fetchTasks();
    fetchDashboardSummary();
    fetchMaintenanceReport();
  }, []);

  async function fetchHealthStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);

      if (!response.ok) {
        throw new Error('Backend health check request failed.');
      }

      const data = await response.json();
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

      const response = await fetch(`${API_BASE_URL}/api/tasks`);

      if (!response.ok) {
        throw new Error('Task list request failed.');
      }

      const data = await response.json();
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

      const response = await fetch(`${API_BASE_URL}/api/tasks/dashboard`);

      if (!response.ok) {
        throw new Error('Dashboard request failed.');
      }

      const data = await response.json();
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

      const response = await fetch(`${API_BASE_URL}/api/tasks/report`);

      if (!response.ok) {
        throw new Error('Report request failed.');
      }

      const data = await response.json();
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

  function buildSearchUrl() {
    const searchParams = new URLSearchParams();

    Object.entries(searchForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value.trim() !== '') {
        searchParams.append(key, value);
      }
    });

    return `${API_BASE_URL}/api/tasks/search?${searchParams.toString()}`;
  }

  async function handleSearchTasks(event) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    try {
      setLoadingTasks(true);

      const response = await fetch(buildSearchUrl());

      if (!response.ok) {
        throw new Error('Search request failed.');
      }

      const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildTaskRequestBody())
      });

      if (!response.ok) {
        throw new Error('Create task request failed.');
      }

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
      const response = await fetch(`${API_BASE_URL}/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildTaskRequestBody())
      });

      if (!response.ok) {
        throw new Error('Update task request failed.');
      }

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
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/complete`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Complete task request failed.');
      }

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
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Delete task request failed.');
      }

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

  return (
      <main className="app-container">
        <section className="page-header">
          <p className="eyebrow">WGU D424 Capstone</p>
          <h1>Home Maintenance Tracker</h1>
          <p className="hero-description">
            Track home maintenance tasks, prioritize urgent repairs, estimate costs,
            and review dashboard summaries from one full-stack application.
          </p>
        </section>

        <section className="status-panel card">
          <h2>Backend Connection</h2>

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
          <h2>Dashboard Summary</h2>

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
            <h2>Maintenance Task List</h2>
            <button type="button" className="secondary-button" onClick={refreshAllTaskData}>
              Refresh
            </button>
          </div>

          {loadingTasks && <p>Loading tasks...</p>}

          {!loadingTasks && tasks.length === 0 && (
              <p>No maintenance tasks match the current list or search criteria.</p>
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
                        <td>{task.urgencyLevel}</td>
                        <td>{task.status}</td>
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
              <p>No report rows are available.</p>
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
  );
}

export default App;