# Task 4 Cloud Deployment Guide

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Cloud Platform

AWS Lightsail

## Deployed Application URL

Frontend:

http://3.18.100.20

Backend health endpoint:

http://3.18.100.20:8080/api/health

## Deployment Overview

The application was deployed to an AWS Lightsail Ubuntu server using Docker Compose.

The deployment includes:

- React frontend container
- Java Spring Boot backend container
- PostgreSQL database container
- Docker Compose orchestration
- Lightsail firewall configuration
- Static public IP address

## Server Configuration

The Lightsail instance was configured with:

- Ubuntu 24.04 LTS
- Git
- Docker Engine
- Docker Compose plugin
- Static IP address
- Firewall rules for ports 22, 80, and 8080

## Required Firewall Ports

| Purpose | Port | Protocol |
|---|---:|---|
| SSH access | 22 | TCP |
| Frontend web application | 80 | TCP |
| Backend API health/demo access | 8080 | TCP |

PostgreSQL port 5432 was not opened publicly. The PostgreSQL container is used internally by the Docker Compose network.

## Deployment Steps Used

1. Created an AWS Lightsail Ubuntu instance named home-maintenance-task4.
2. Attached a static IP address to the instance.
3. Installed Git, Docker Engine, and the Docker Compose plugin.
4. Cloned the GitLab repository onto the Lightsail server.
5. Checked out the working_branch branch.
6. Created a server-only .env file for production configuration.
7. Built and started the application with Docker Compose.
8. Verified the backend health endpoint.
9. Verified the frontend from the public IP address.
10. Tested cloud CRUD functionality through the deployed frontend.

## Deployment Commands Used

Change to the project folder:

docker command:
cd ~/d424-software-engineering-capstone

Start the application:

docker command:
docker compose up --build -d

Check running containers:

docker command:
docker ps

Check backend health:

docker command:
curl http://localhost:8080/api/health

Check frontend response:

docker command:
curl -I http://localhost

## Running Containers

The deployment runs these containers:

- home-maintenance-postgres
- home-maintenance-backend
- home-maintenance-frontend

## Restart Commands

To restart the application on Lightsail:

docker command:
cd ~/d424-software-engineering-capstone
docker compose restart

## Rebuild Commands

To rebuild the application on Lightsail:

docker command:
cd ~/d424-software-engineering-capstone
docker compose down
docker compose up --build -d

## Log Commands

Backend logs:

docker command:
docker logs home-maintenance-backend --tail 100

Frontend logs:

docker command:
docker logs home-maintenance-frontend --tail 100

PostgreSQL logs:

docker command:
docker logs home-maintenance-postgres --tail 100

## Deployment Result

The deployment successfully runs the full-stack Home Maintenance Tracker application on AWS Lightsail with a public frontend URL, accessible backend health endpoint, and functioning cloud database persistence through PostgreSQL.
