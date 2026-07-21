# Task 4 Change Summary

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Purpose

This document summarizes the cloud deployment changes made for Task 4.

## Summary of Task 4 Work

Task 4 focused on deploying the completed capstone application to a cloud platform.

The application was deployed to AWS Lightsail using Docker Compose.

## Main Changes

### 1. Deployment Folder Added

A deployment folder was added to separate cloud deployment planning files from the main application source code.

Files added:

- deployment/README.md
- deployment/lightsail-deployment-plan.md
- deployment/production-env-example.md

### 2. Lightsail Cloud Server Created

An AWS Lightsail Ubuntu instance was created for the cloud deployment.

The instance was configured with:

- Ubuntu 24.04 LTS
- Static public IP address
- Firewall ports for SSH, frontend access, and backend health/API testing

### 3. Server Tools Installed

The Lightsail server was configured with:

- Git
- Docker Engine
- Docker Compose plugin

### 4. Repository Cloned to Lightsail

The GitLab repository was cloned to the Lightsail server.

The deployed branch was:

working_branch

### 5. Environment Configuration Added on Server

A .env file was created on the Lightsail server.

The file stores deployment-specific configuration and is not committed to GitLab.

Configuration includes:

- PostgreSQL database name
- PostgreSQL user
- PostgreSQL password
- Backend CORS allowed origins
- Frontend API base URL

### 6. Docker Configuration Updated for Cloud Frontend API URL

The frontend Docker build was updated so the React/Vite application can receive the cloud backend URL during the production build.

Updated files:

- frontend/Dockerfile
- docker-compose.yml

This change allowed the deployed frontend to call the Lightsail backend API instead of using localhost.

### 7. Application Built and Started on Lightsail

The full-stack app was started with Docker Compose.

The deployment runs:

- PostgreSQL database container
- Spring Boot backend container
- React/Nginx frontend container

### 8. Cloud Functionality Verified

The cloud deployment was verified by testing:

- Public frontend access
- Backend health endpoint
- Docker container status
- Create task
- View task list
- Edit task
- Complete task
- Delete task
- Dashboard
- Maintenance report

### 9. Cloud Evidence Captured

Screenshots were saved in:

docs/task4-evidence/

## Files Added or Updated for Task 4

Added:

- deployment/README.md
- deployment/lightsail-deployment-plan.md
- deployment/production-env-example.md
- docs/task4-evidence/
- docs/TASK4_CLOUD_PROVIDER_JUSTIFICATION.md
- docs/TASK4_CLOUD_DEPLOYMENT_GUIDE.md
- docs/TASK4_MAINTENANCE_AND_MONITORING.md
- docs/TASK4_DEPLOYMENT_EVIDENCE.md
- docs/TASK4_CHANGE_SUMMARY.md

Updated:

- frontend/Dockerfile
- docker-compose.yml

## Conclusion

Task 4 converted the completed local Dockerized application into a working AWS Lightsail cloud deployment. The application is publicly accessible, the backend API is reachable, Docker containers are running on the cloud server, and application functionality has been verified through the deployed frontend.
