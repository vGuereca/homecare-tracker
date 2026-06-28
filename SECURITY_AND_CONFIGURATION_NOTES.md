# Security and Configuration Notes

## Project Context

The Home Maintenance Tracker and Cost Prioritization Application is a WGU D424 capstone project. The application uses a React frontend, Java Spring Boot backend, and PostgreSQL database for the Docker runtime environment.

The application uses demonstration data only. It does not store payment information, protected health information, employer data, or personally sensitive production records.

## Security Measures Implemented

### Server-Side Validation

The backend uses Jakarta Bean Validation annotations to validate incoming task data before it is saved. Required fields such as task name, category, due date, estimated cost, urgency level, and status are validated by the backend.

### Structured Error Handling

The backend uses centralized exception handling to return predictable error responses for validation errors, missing resources, and unexpected failures. This improves reliability and makes frontend error handling more consistent.

### CORS Allowlist

Cross-Origin Resource Sharing is restricted to configured frontend origins. The allowed origins are controlled through application properties and environment variables instead of being hardcoded directly in the application logic.

### Database Configuration

The project supports H2 for local development and PostgreSQL for Docker runtime. PostgreSQL credentials are provided through environment variables in the container configuration. A `.env.example` file documents the expected variables without committing real secrets.

### Container Separation

The Docker Compose configuration separates the frontend, backend, and database into individual services. This supports maintainability, deployment readiness, and clearer operational boundaries.

### Data Scope

The application is intended for home maintenance task tracking using sample or user-entered demonstration data. It does not integrate with payment processors, contractor hiring platforms, real pricing APIs, or third-party identity providers.

## Current Authentication Scope

The application does not implement user login or role-based authorization in the current capstone scope. API endpoints are available to the frontend for demonstration purposes. If this application were extended for production use, the next security improvement would be adding user authentication, role-based authorization, password hashing, and token-based session management.

## CSRF Configuration

CSRF protection is disabled because the backend is designed as a stateless JSON API for the React frontend. If browser-cookie-based authentication were added later, CSRF protection should be revisited.

## Production Recommendations

Before production deployment, the following should be completed:

1. Add authentication and authorization.
2. Use managed secret storage for database credentials.
3. Restrict CORS to the deployed frontend domain only.
4. Disable H2 console access outside local development.
5. Add HTTPS through the hosting platform or reverse proxy.
6. Review database backup and recovery procedures.
7. Add request logging and monitoring.