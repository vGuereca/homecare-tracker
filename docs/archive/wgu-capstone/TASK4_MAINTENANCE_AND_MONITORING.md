# Task 4 Maintenance and Monitoring Guide

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Purpose

This guide explains how to maintain and monitor the deployed AWS Lightsail application.

## Deployment Location

Frontend URL:

http://3.18.100.20

Backend health endpoint:

http://3.18.100.20:8080/api/health

## Basic Health Checks

Frontend check:

Open http://3.18.100.20 in a browser.

Expected result:

- Page loads successfully
- Backend Status shows UP
- Dashboard summary loads
- Task list loads
- Report loads

Backend health check:

Open http://3.18.100.20:8080/api/health in a browser.

Expected result:

The response should show the application name and status UP.

## Server Monitoring Commands

Connect to the Lightsail instance with SSH and run:

docker command:
cd ~/d424-software-engineering-capstone
docker ps

Expected containers:

- home-maintenance-postgres
- home-maintenance-backend
- home-maintenance-frontend

## Application Logs

Backend logs:

docker command:
docker logs home-maintenance-backend --tail 100

Frontend logs:

docker command:
docker logs home-maintenance-frontend --tail 100

Database logs:

docker command:
docker logs home-maintenance-postgres --tail 100

## Restart Procedure

To restart the running application:

docker command:
cd ~/d424-software-engineering-capstone
docker compose restart

## Stop Procedure

To stop the running application:

docker command:
cd ~/d424-software-engineering-capstone
docker compose down

## Start Procedure

To start the application again:

docker command:
cd ~/d424-software-engineering-capstone
docker compose up -d

## Rebuild Procedure

To rebuild the app after code or Dockerfile changes:

docker command:
cd ~/d424-software-engineering-capstone
git pull origin working_branch
docker compose down
docker compose up --build -d

## Database Maintenance

The PostgreSQL database runs as a Docker container using a Docker volume named:

home_maintenance_postgres_data

The database port is not opened publicly through the Lightsail firewall. This keeps PostgreSQL internal to the server and Docker network.

## Security Maintenance Notes

Current security controls include:

- Server-side validation
- Centralized backend error handling
- Configured CORS allowed origins
- PostgreSQL not exposed publicly through the Lightsail firewall
- Environment variables stored in a server .env file instead of committed source code

Future security improvements could include:

- HTTPS
- Domain name
- Login and role-based authorization
- Managed database
- Automated backups
- Secret manager integration
- CI/CD pipeline
- Centralized log monitoring

## Update Procedure

To update the deployed application after pushing changes to GitLab:

docker command:
cd ~/d424-software-engineering-capstone
git pull origin working_branch
docker compose down
docker compose up --build -d

Then verify:

docker command:
docker ps
curl http://localhost:8080/api/health
curl -I http://localhost

## Troubleshooting

If the frontend does not load, check frontend logs.

If the backend does not respond, check backend logs.

If the database fails, check PostgreSQL logs.

If containers are stopped, run:

docker command:
docker ps -a
docker compose restart

## Conclusion

The application can be maintained through standard Docker Compose commands, Lightsail firewall settings, backend health checks, and container logs.
