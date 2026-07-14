# Task 3 Final Submission Package

## Project Name

Home Maintenance Tracker and Cost Prioritization Application

## Student

Victor Guereca

## Program

WGU Software Engineering

## Task

D424 Software Engineering Capstone - Task 3 Development and Testing

## Repository Information

GitLab Repository URL:

```text
https://gitlab.com/wgu-gitlab-environment/student-repos/vguere1/d424-software-engineering-capstone/-/blob/working_branch/docs/SCREENSHOT_EVIDENCE.MD?ref_type=heads


Application Summary

The Home Maintenance Tracker and Cost Prioritization Application is a full-stack web 
application that helps a user manage home maintenance tasks, prioritize urgent work, 
estimate costs, and review dashboard and report summaries.

The application includes a React frontend, Java Spring Boot backend, PostgreSQL database
for Docker runtime, H2 for local development, REST API endpoints, automated backend tests,
Docker Compose containerization, and supporting documentation.

Technology Stack
Layer	                    Technology
Frontend	                React with Vite
Backend	                    Java Spring Boot
Database	                H2 for local development, PostgreSQL for Docker runtime
API Style	                REST
Testing	                    JUnit, MockMvc, manual browser testing
Containerization	        Docker and Docker Compose
Runtime Frontend Server	    Nginx
Version Control	            GitLab

Main Repository Locations
Item	                                    Location
Backend source code	                backend/src/main/java/com/victorguereca/homemaintenance/
Backend tests	                    backend/src/test/java/com/victorguereca/homemaintenance/
Frontend source code	            frontend/src/
Docker Compose file	                docker-compose.yml
Backend Dockerfile	                backend/Dockerfile
Frontend Dockerfile	                frontend/Dockerfile
Frontend Nginx config	            frontend/nginx.conf
Documentation package	            docs/
Screenshot evidence	                docs/evidence/
Evidence index	                    docs/EVIDENCE_INDEX.md
Security notes	                    SECURITY_AND_CONFIGURATION_NOTES.md
Environment variable example	    .env.example


Functional Features Completed
Feature	                            Status	                                Evidence Location
Create maintenance task	            Complete	Frontend form, backend POST /api/tasks, screenshot evidence
View maintenance task list	        Complete	Frontend table, backend GET /api/tasks, screenshot evidence
Edit maintenance task	            Complete	Frontend edit form, backend PUT /api/tasks/{id}, screenshot evidence
Mark task completed	                Complete	Frontend complete button, backend PATCH /api/tasks/{id}/complete, screenshot evidence
Delete maintenance task	            Complete	Frontend delete button, backend DELETE /api/tasks/{id}, screenshot evidence
Search tasks	                    Complete	Frontend search form, backend GET /api/tasks/search, screenshot evidence
Filter tasks	                    Complete	Category, status, and urgency filters
Sort task records	                Complete	Sort dropdown and backend sorting logic
Dashboard metrics	                Complete	Frontend dashboard, backend GET /api/tasks/dashboard
Maintenance task report	            Complete	Frontend report table, backend GET /api/tasks/report
Dockerized runtime	                Complete	Docker Compose, backend Dockerfile, frontend Dockerfile
PostgreSQL persistence	            Complete	PostgreSQL Docker volume
Documentation package	            Complete	docs/
Screenshot evidence package	        Complete	docs/evidence/

Backend API Endpoints
Method	    Endpoint	            Purpose
GET	        /api/health	                Confirms backend status
GET	        /api/tasks	                Returns all maintenance tasks
GET	        /api/tasks/search	        Searches, filters, and sorts tasks
GET	        /api/tasks/dashboard	    Returns dashboard summary metrics
GET	        /api/tasks/report	        Returns formal maintenance task report
GET	        /api/tasks/{id}	            Returns one task by ID
POST	    /api/tasks	                Creates a maintenance task
PUT	        /api/tasks/{id}	            Updates a maintenance task
PATCH	    /api/tasks/{id}/complete	Marks a task completed
DELETE	    /api/tasks/{id}	            Deletes a maintenance task


Database Functionality          Evidence
The application stores maintenance task records in a database.

Database Operation	Evidence
Add record	            Task creation form and POST /api/tasks
Read records	        Task list and GET /api/tasks
Modify record	        Edit form and PUT /api/tasks/{id}
Update task status	    Complete button and PATCH /api/tasks/{id}/complete
Delete record	        Delete button and DELETE /api/tasks/{id}
Persist data	        PostgreSQL Docker volume persistence test