# User Guide

## Application Name

Home Maintenance Tracker and Cost Prioritization Application

## Purpose

The Home Maintenance Tracker and Cost Prioritization Application helps a user organize home maintenance work in one place. The application allows the user to create maintenance tasks, estimate costs, assign urgency levels, track status, search and filter tasks, view dashboard summaries, and review a generated maintenance report.

This application is intended for home maintenance planning and demonstration use. Example tasks include replacing a furnace filter, cleaning gutters, inspecting plumbing, testing smoke detectors, or scheduling HVAC service.

## Opening the Application

### Local Development Frontend

When running the frontend locally with Vite, open:

```text
http://localhost:5173
```

### Dockerized Application

When running the full application with Docker Compose, open:

```text
http://localhost:3000
```

## Main Page Overview

The application is organized into six main sections:

1. Backend Connection
2. Dashboard Summary
3. Add or Edit Maintenance Task
4. Search and Filter Tasks
5. Maintenance Task List
6. Maintenance Task Report

Each section supports a specific part of the home maintenance workflow.

## Backend Connection Section

The Backend Connection section confirms whether the React frontend can communicate with the Spring Boot backend.

Expected display:

```text
Backend Status: UP
Application: Home Maintenance Tracker
```

If the backend connection is not working, the application displays an error message telling the user to make sure the backend is running on port 8080.

## Dashboard Summary Section

The Dashboard Summary section provides a quick overview of maintenance task status and cost.

The dashboard includes:

| Metric              | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| Open / Active Tasks | Shows the number of tasks that are open or in progress         |
| Completed Tasks     | Shows the number of tasks marked as completed                  |
| Overdue Tasks       | Shows incomplete tasks with a due date before the current date |
| Estimated Open Cost | Shows the total estimated cost of open or in-progress tasks    |

The dashboard updates after task creation, editing, completion, deletion, or refresh.

## Add Maintenance Task

The Add Maintenance Task form allows the user to create a new home maintenance task.

### Required Fields

The following fields are required:

```text
Task Name
Category
Due Date
Estimated Cost
Urgency
Status
```

### Optional Fields

The following fields are optional:

```text
Description
Notes
```

### Creating a New Task

To create a task:

1. Go to the Add Maintenance Task section.
2. Enter a task name.
3. Enter a category.
4. Enter a description if needed.
5. Select a future due date.
6. Enter an estimated cost.
7. Select an urgency level.
8. Select a task status.
9. Add notes if needed.
10. Click Create Task.

After the task is created, the application displays a success message:

```text
Maintenance task created successfully.
```

The new task appears in the Maintenance Task List.

### Example Task

```text
Task Name: Replace furnace filter
Category: HVAC
Description: Replace the furnace filter for better airflow.
Due Date: Future date
Estimated Cost: 25.00
Urgency: Medium
Status: Open
Notes: Use the correct filter size.
```

## Edit Maintenance Task

The Edit feature allows the user to update an existing maintenance task.

To edit a task:

1. Find the task in the Maintenance Task List.
2. Click Edit.
3. The form changes from Add Maintenance Task to Edit Maintenance Task.
4. The selected task values load into the form.
5. Change the desired fields.
6. Click Update Task.

After the task is updated, the application displays:

```text
Maintenance task updated successfully.
```

The task table refreshes and shows the updated information.

### Canceling an Edit

If the user starts editing a task but does not want to save changes, click Cancel Edit. This clears the form and returns it to create mode.

## Mark Task Completed

The Complete action allows the user to quickly mark a task as finished.

To complete a task:

1. Find the task in the Maintenance Task List.
2. Click Complete.
3. The task status changes to COMPLETED.
4. The Complete button becomes disabled for that task.

After completion, the application displays:

```text
Maintenance task marked as completed.
```

The dashboard summary updates to reflect the completed task.

## Delete Maintenance Task

The Delete action removes a maintenance task from the database.

To delete a task:

1. Find the task in the Maintenance Task List.
2. Click Delete.
3. A browser confirmation message appears.
4. Confirm the deletion.
5. The task is removed from the table.

After deletion, the application displays:

```text
Maintenance task deleted successfully.
```

The dashboard, task list, and report refresh after deletion.

## Search and Filter Tasks

The Search and Filter Tasks section helps users narrow the task list.

The user can search or filter by:

```text
Keyword
Category
Status
Urgency
Sort By
```

### Keyword Search

The keyword search checks task fields such as:

```text
Task Name
Category
Description
Notes
```

Example:

```text
Keyword: filter
```

This returns tasks that contain the word "filter."

### Category Filter

The category filter limits results to a specific category.

Example:

```text
Category: HVAC
```

This returns only tasks in the HVAC category.

### Status Filter

The status filter allows the user to view tasks by progress.

Available statuses:

```text
OPEN
IN_PROGRESS
COMPLETED
```

### Urgency Filter

The urgency filter allows the user to view tasks by priority.

Available urgency levels:

```text
LOW
MEDIUM
HIGH
```

### Sort Options

The user can sort task results by:

```text
Due Date
Task Name
Category
Estimated Cost
Urgency
Status
```

### Clearing Search

Click Clear Search to reset all search and filter fields and reload the full task list.

## Maintenance Task List

The Maintenance Task List displays saved task records from the database.

The table includes:

| Column         | Description                        |
| -------------- | ---------------------------------- |
| Task Name      | Name of the maintenance task       |
| Category       | Maintenance category               |
| Due Date       | Date the task should be completed  |
| Estimated Cost | Estimated cost of the task         |
| Urgency        | Priority level                     |
| Status         | Current task status                |
| Actions        | Edit, Complete, and Delete buttons |

This table updates after task creation, editing, completion, deletion, searching, or refreshing.

## Maintenance Task Report

The Maintenance Task Report section displays a structured report generated from saved database records.

The report includes:

```text
Report title
Generated timestamp
Multiple columns
Multiple task rows
```

Report columns include:

```text
Task Name
Category
Due Date
Estimated Cost
Urgency
Status
```

The report is useful for reviewing maintenance work in a summarized table format.

## Validation and Error Messages

The application validates required task data before saving records.

If required fields are missing or invalid, the application displays an error message.

Example:

```text
Unable to create maintenance task. Check that all required fields are valid.
```

The backend also validates task data before saving it to the database.

## Recommended Workflow

A typical user workflow is:

1. Open the application.
2. Confirm Backend Status is UP.
3. Review the dashboard summary.
4. Create a new maintenance task.
5. Review the task in the task list.
6. Edit the task if details change.
7. Use search or filters to find specific tasks.
8. Mark completed tasks as completed.
9. Review the maintenance report.
10. Delete tasks that are no longer needed.

## Example Use Cases

### HVAC Maintenance

```text
Task Name: Replace furnace filter
Category: HVAC
Urgency: Medium
Status: Open
```

### Exterior Maintenance

```text
Task Name: Clean gutters
Category: Exterior
Urgency: High
Status: Open
```

### Safety Maintenance

```text
Task Name: Test smoke detectors
Category: Safety
Urgency: High
Status: In Progress
```

### Plumbing Maintenance

```text
Task Name: Inspect sink drain
Category: Plumbing
Urgency: Medium
Status: Open
```

## Troubleshooting for Users

### The page does not load

Confirm the frontend is running.

For local development:

```text
http://localhost:5173
```

For Docker:

```text
http://localhost:3000
```

### Backend status does not show UP

Confirm the backend is running at:

```text
http://localhost:8080/api/health
```

### A task will not save

Confirm all required fields are filled out. The due date should not be in the past, and estimated cost should not be negative.

### Search results look incomplete

Click Clear Search to reset filters and reload the full task list.

## User Guide Conclusion

The Home Maintenance Tracker and Cost Prioritization Application provides a full task management workflow for home maintenance. Users can create, view, update, complete, delete, search, filter, sort, and report on maintenance tasks from a single web interface.
