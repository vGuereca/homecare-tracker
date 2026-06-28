# Testing Summary

## Testing Strategy

Testing included backend automated tests, manual full-stack browser tests, Docker runtime tests, and build verification.

## Automated Backend Tests

The backend uses JUnit and MockMvc to test REST API behavior.

Run backend tests:

```bash
cd backend
./mvnw clean test