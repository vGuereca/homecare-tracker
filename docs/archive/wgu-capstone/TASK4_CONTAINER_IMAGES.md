# Task 4 Container Images

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Purpose

This document describes how container images were implemented for the Task 4 cloud deployment.

## Container Image Overview

The application is deployed with Docker Compose and uses three containers:

1. React frontend container
2. Java Spring Boot backend container
3. PostgreSQL database container

Docker Compose coordinates these containers so the full-stack application can run together on the AWS Lightsail Ubuntu server.

## Frontend Container Image

The frontend container image is defined in:

frontend/Dockerfile

The frontend image uses a multi-stage Docker build.

The first stage uses a Node image to install dependencies and build the React/Vite application.

The second stage uses an Nginx image to serve the production frontend build.

The frontend Dockerfile performs these actions:

- Uses node:22-alpine as the build stage
- Sets the working directory to /app
- Accepts the VITE_API_BASE_URL build argument
- Installs frontend dependencies with npm install
- Builds the Vite production files with npm run build
- Uses nginx:alpine as the runtime image
- Copies the built frontend files into the Nginx web directory
- Exposes port 80

The frontend container is configured so the deployed React application calls the cloud backend API at:

http://3.18.100.20:8080

This is done by passing VITE_API_BASE_URL into the frontend Docker build through Docker Compose.

## Backend Container Image

The backend container image is defined in:

backend/Dockerfile

The backend image also uses a multi-stage Docker build.

The first stage uses a Java JDK image to build the Spring Boot application with Maven.

The second stage uses a Java JRE image to run the packaged Spring Boot JAR file.

The backend Dockerfile performs these actions:

- Uses eclipse-temurin:17-jdk as the build stage
- Copies the Maven wrapper, Maven configuration, and pom.xml
- Downloads Maven dependencies
- Copies the backend source code
- Builds the application JAR file
- Uses eclipse-temurin:17-jre as the runtime image
- Copies the built JAR file into the runtime container
- Exposes port 8080
- Starts the application with java -jar app.jar
- Runs the container profile so the backend connects to the PostgreSQL container

The backend container provides the REST API used by the frontend.

The backend health endpoint is:

http://3.18.100.20:8080/api/health

## PostgreSQL Container Image

The PostgreSQL database uses the official postgres:16 image.

This image is declared directly in docker-compose.yml.

The PostgreSQL container stores maintenance task records for the application.

The database uses environment variables for:

- Database name
- Database username
- Database password

The PostgreSQL container uses a Docker volume named:

home_maintenance_postgres_data

This volume keeps database data separate from the container lifecycle.

PostgreSQL port 5432 is not opened in the AWS Lightsail firewall. This keeps the database from being publicly accessible from the internet.

## Docker Compose Implementation

Docker Compose is defined in:

docker-compose.yml

Docker Compose implements the full-stack deployment by defining these services:

- postgres
- backend
- frontend

The postgres service starts the database container.

The backend service builds the Spring Boot backend image from backend/Dockerfile and connects to the postgres service.

The frontend service builds the React/Nginx frontend image from frontend/Dockerfile and exposes the public frontend on port 80.

## Frontend API Build Argument

The frontend Docker image needs the deployed backend API URL during the Vite production build.

Docker Compose passes this value into the frontend build:

VITE_API_BASE_URL=http://3.18.100.20:8080

This prevents the deployed frontend from trying to call localhost:8080 from the user's browser.

## Cloud Deployment Result

The implemented container images allow the full-stack application to run on AWS Lightsail with:

- React frontend served publicly on port 80
- Spring Boot backend available on port 8080
- PostgreSQL database running inside the Docker Compose network
- Docker Compose managing container startup and networking

## Conclusion

Container images were implemented with Dockerfiles for the frontend and backend, the official PostgreSQL image for the database, and Docker Compose to build, configure, network, and run all containers together on the AWS Lightsail cloud server.
