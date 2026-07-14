# System Design Diagram

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Purpose

This design diagram shows the full-stack architecture of the application. It includes the React frontend, Spring Boot backend, REST API, PostgreSQL database, Docker Compose runtime, and documentation/testing artifacts.

## High-Level Architecture

```mermaid
flowchart TD
    User[User / Homeowner] --> Browser[Web Browser]

    Browser --> Frontend[React Frontend<br/>Vite Development / Nginx Docker Runtime]

    Frontend -->|HTTP REST Requests| Backend[Spring Boot Backend<br/>Java REST API]

    Backend --> Controller[MaintenanceTaskController]
    Controller --> Service[MaintenanceTaskService]
    Service --> Repository[MaintenanceTaskRepository]
    Repository --> Database[(PostgreSQL Database<br/>Docker Runtime)]

    Backend --> Validation[Jakarta Bean Validation]
    Backend --> ErrorHandling[Global Exception Handler]
    Backend --> Security[Spring Security + CORS Configuration]

    Service --> Search[Specification-based Search<br/>Keyword / Category / Status / Urgency]
    Service --> Dashboard[Dashboard Summary Calculations]
    Service --> Report[Maintenance Report Generation]

    DockerCompose[Docker Compose] --> FrontendContainer[Frontend Container<br/>Nginx]
    DockerCompose --> BackendContainer[Backend Container<br/>Spring Boot]
    DockerCompose --> DatabaseContainer[Database Container<br/>PostgreSQL]

    FrontendContainer --> BackendContainer
    BackendContainer --> DatabaseContainer

    Tests[JUnit + MockMvc Tests] --> Backend
    Docs[Project Documentation] --> User
```

## Docker Runtime Architecture

```mermaid
flowchart LR
    Browser[Browser<br/>localhost:3000] --> Nginx[Frontend Container<br/>React Build Served by Nginx]

    Nginx --> API[Backend Container<br/>Spring Boot API<br/>Port 8080]

    API --> DB[(PostgreSQL Container<br/>Port 5432<br/>Persistent Volume)]

    Volume[(Docker Volume<br/>home_maintenance_postgres_data)] --> DB
```

## Request Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React Frontend
    participant Backend as Spring Boot Backend
    participant Service as MaintenanceTaskService
    participant Repository as MaintenanceTaskRepository
    participant Database as PostgreSQL Database

    User->>Frontend: Submit maintenance task form
    Frontend->>Backend: POST /api/tasks
    Backend->>Service: createTask(request)
    Service->>Repository: save(task)
    Repository->>Database: Insert task record
    Database-->>Repository: Saved record
    Repository-->>Service: MaintenanceTask
    Service-->>Backend: MaintenanceTaskResponse
    Backend-->>Frontend: JSON response
    Frontend-->>User: Show success message and updated task list
```

## Backend Layer Responsibilities

| Layer | Responsibility |
|---|---|
| Controller | Receives REST API requests and returns responses |
| Service | Contains business logic for CRUD, search, dashboard, and reports |
| Repository | Handles database access through Spring Data JPA |
| Entity | Represents database task records |
| DTOs | Shape request and response data |
| Specification | Builds dynamic search/filter criteria |
| Report Classes | Generate structured report output |
| Exception Handler | Provides consistent error responses |
| Security Config | Controls CORS and basic API security settings |

## Frontend Responsibilities

The React frontend provides a user interface for:

- Viewing backend connection status
- Creating tasks
- Viewing task list
- Editing tasks
- Marking tasks complete
- Deleting tasks
- Searching and filtering tasks
- Viewing dashboard metrics
- Viewing maintenance task report

## Database Responsibilities

The PostgreSQL database stores maintenance task records, including:

- Task name
- Category
- Description
- Due date
- Estimated cost
- Urgency
- Status
- Notes
- Created date
- Updated date

## Deployment Design

The application is designed as three separate Docker services:

| Service | Container Purpose |
|---|---|
| frontend | Serves the compiled React application through Nginx |
| backend | Runs the Java Spring Boot REST API |
| postgres | Stores task records in PostgreSQL |

## Security and Configuration Design

The application uses:

- Server-side validation
- Centralized error handling
- Configurable CORS allowlist
- Environment variable support for database credentials
- Separate frontend/backend/database containers
- H2 for local development
- PostgreSQL for Docker runtime

## Scalability Notes

The application separates responsibilities into independent layers and services. The frontend, backend, and database can be maintained, tested, and deployed separately. The backend uses service and repository layers to keep business logic separate from API routing and database access.