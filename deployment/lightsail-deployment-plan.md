# AWS Lightsail Deployment Plan

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Cloud Platform

AWS Lightsail

## Deployment Strategy

The application will be deployed to an AWS Lightsail Ubuntu instance.

The application already runs locally with Docker Compose. The Task 4 deployment strategy is to move the working Docker Compose configuration to a Lightsail virtual private server and run the same full-stack application in the cloud.

## Application Components

The deployed application will include:

1. React frontend container
2. Java Spring Boot backend container
3. PostgreSQL database container
4. Docker Compose orchestration

## Planned Cloud Architecture

User browser
→ AWS Lightsail public IP
→ Frontend container served by Nginx on port 80
→ Backend Spring Boot container on port 8080
→ PostgreSQL database container inside the Docker network

## Planned Public Access

Frontend:

http://<lightsail-public-ip>

Backend health endpoint:

http://<lightsail-public-ip>:8080/api/health

## Why Lightsail Is Appropriate

AWS Lightsail is appropriate for this capstone deployment because it provides a simple virtual private server environment where Docker and Docker Compose can run with minimal cloud infrastructure complexity.

This project does not require a complex multi-service production architecture for the capstone demonstration. The goal is to demonstrate that the completed software application can be deployed and executed on a cloud platform.

## Deployment Boundary

The following will not be done until later checkpoints:

- Creating the AWS Lightsail instance
- Installing Docker on Lightsail
- Cloning the GitLab repository on Lightsail
- Running the application in the cloud
- Recording the Panopto deployment video
- Final Task 4 submission packaging

## Deployment Readiness Requirements

Before creating cloud resources, the local application must be verified with:

- Backend tests passing
- Frontend production build passing
- Docker Compose running locally
- Frontend reachable locally
- Backend health endpoint reachable locally
- GitLab repository pushed and up to date
