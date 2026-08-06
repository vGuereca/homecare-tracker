# Change and Revision Summary

## Project Development Summary

The Home Maintenance Tracker and Cost Prioritization Application was developed incrementally using checkpoint-based development. Each checkpoint added a specific feature or supporting configuration, followed by testing and Git commits.

## Major Development Checkpoints

| Checkpoint | Summary |
|---|---|
| Checkpoint 1 | Backend project initialized |
| Checkpoint 2 | Health endpoint and test added |
| Checkpoint 3 | Maintenance task entity and database dependencies added |
| Checkpoint 4 | Service layer and task creation test added |
| Checkpoint 5 | CRUD API, validation, and error handling added |
| Checkpoint 6A | Backend search, filtering, sorting, and tests added |
| Checkpoint 6B | Dashboard summary endpoint and test added |
| Checkpoint 6C | Maintenance task report endpoint and test added |
| Checkpoint 7 | React frontend and backend health connection added |
| Checkpoint 8 | Frontend task creation and task list added |
| Checkpoint 9 | Frontend edit, complete, and delete actions added |
| Checkpoint 10 | Frontend dashboard, search, filters, sorting, and report display added |
| Checkpoint 11 | Docker PostgreSQL profile and Compose setup added |
| Checkpoint 12 | Full application Dockerization added |
| Checkpoint 13 | Security/configuration cleanup and notes added |
| Checkpoint 14 | Final documentation package added |

## Notable Revisions

### JPA Default Constructor Fix

During backend API testing, Hibernate produced an error stating that the `MaintenanceTask` entity did not have a default constructor. A protected no-argument constructor was added to the entity so Hibernate could instantiate task records when reading from the database.

### Search Test Data Fix

A search test expected two matching records but returned three because default description and notes fields contained the same search keyword. The test helper was updated to generate task-specific descriptions and notes.

### CORS Configuration Fix

The React frontend initially loaded but could not connect to the Spring Boot API because the backend did not allow requests from the frontend origin. CORS configuration was added and later made configurable through application properties.

### Database Runtime Configuration

The backend initially used H2 for local development. PostgreSQL support was added through Docker Compose, first using a host-run backend profile and later using a full container profile.

### Docker Container Hostname Fix

The backend container uses the Docker Compose service name `postgres` in the JDBC URL because `localhost` inside a container refers to the backend container itself, not the database container.

### Security Configuration Cleanup

CORS origins and database credentials were moved toward environment-based configuration. A `.env.example` file was added to document expected environment variables without committing local secrets.

## Final Result

The final application includes a working React frontend, Spring Boot backend, PostgreSQL Docker database, automated backend tests, manual full-stack tests, Docker Compose runtime, and supporting documentation.