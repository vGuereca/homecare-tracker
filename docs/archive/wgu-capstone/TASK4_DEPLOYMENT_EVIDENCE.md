# Task 4 Deployment Evidence

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Cloud Platform

AWS Lightsail

## Deployed URLs

Frontend:

http://3.18.100.20

Backend health endpoint:

http://3.18.100.20:8080/api/health

## Evidence Folder

Task 4 evidence screenshots are stored in:

docs/task4-evidence/

## Evidence Captured

The evidence folder includes screenshots showing:

1. AWS Lightsail instance running
2. Static IP attached
3. Firewall ports configured
4. Docker containers running on Lightsail
5. Server health checks
6. Public frontend loading from the cloud IP
7. Public backend health endpoint
8. Cloud task creation
9. Cloud task list after creation
10. Cloud task editing
11. Cloud task completion
12. Cloud task deletion
13. Dashboard summary
14. Maintenance report

## Required Cloud Evidence

The deployment evidence demonstrates that:

- The application was deployed to AWS Lightsail
- The Lightsail instance was running
- The static IP was attached
- The frontend was publicly accessible
- The backend was publicly accessible for health verification
- Docker containers were running on the cloud server
- PostgreSQL was running as part of the Docker Compose deployment
- The cloud frontend communicated with the cloud backend
- The deployed application supported create, read, update, complete, and delete behavior
- The deployed report and dashboard functionality worked in the cloud environment

## Docker Evidence

The deployment was verified with the docker ps command.

Expected containers:

- home-maintenance-postgres
- home-maintenance-backend
- home-maintenance-frontend

## Backend Evidence

The backend was verified with:

curl http://localhost:8080/api/health

And through the public endpoint:

http://3.18.100.20:8080/api/health

Expected response:

Application: Home Maintenance Tracker
Status: UP

## Frontend Evidence

The frontend was verified through the public IP:

http://3.18.100.20

The deployed frontend showed:

- Backend Status: UP
- Dashboard Summary
- Task list
- Task form
- Search/filter/sort controls
- Maintenance Report

## Conclusion

The evidence confirms that the completed full-stack application was successfully deployed to AWS Lightsail and verified through public cloud access, backend health checks, Docker container inspection, and cloud CRUD testing.
