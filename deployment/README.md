# Task 4 Cloud Deployment Folder

This folder contains deployment planning and cloud deployment support files for the WGU D424 Task 4 submission.

The application being deployed is the Home Maintenance Tracker and Cost Prioritization Application.

## Deployment Target

The planned cloud platform is AWS Lightsail.

The application will be deployed as a Docker Compose full-stack application using:

- React frontend
- Java Spring Boot backend
- PostgreSQL database
- Docker
- Docker Compose
- AWS Lightsail Ubuntu instance

## Purpose of This Folder

This folder separates Task 4 cloud deployment materials from the main application source code.

The main application source code remains in:

- backend/
- frontend/
- docker-compose.yml

The Task 4 deployment materials are stored in:

- deployment/

## Important Boundary

This folder does not replace the application source code.

It supports cloud deployment by documenting the cloud deployment plan, environment variables, and production setup considerations.
