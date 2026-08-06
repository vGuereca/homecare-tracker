# Task 4 Cloud Provider Justification

## Project

Home Maintenance Tracker and Cost Prioritization Application

## Selected Cloud Provider

AWS Lightsail

## Reason for Selection

AWS Lightsail was selected for this deployment because it provides a straightforward virtual private server environment that can run Docker and Docker Compose. This fits the existing architecture of the application because the project was already containerized during Task 3.

The application includes a React frontend, Java Spring Boot backend, and PostgreSQL database. These components can run together through Docker Compose on a single Lightsail Ubuntu instance.

## Why Lightsail Fits This Project

AWS Lightsail is appropriate for this capstone because the project does not require a complex enterprise cloud architecture. The goal of Task 4 is to demonstrate that the completed software application can be deployed and executed on a cloud platform.

Lightsail supports this goal by providing:

- A public IP address for browser access
- Ubuntu server hosting
- Support for Docker and Docker Compose
- Firewall control for required ports
- A simple deployment model suitable for a capstone demonstration

## Deployment Architecture

The deployed application uses the following architecture:

User browser
→ AWS Lightsail static public IP
→ React frontend container served by Nginx on port 80
→ Java Spring Boot backend container on port 8080
→ PostgreSQL database container inside the Docker network

## Benefits of This Approach

This deployment approach keeps the cloud architecture clear and maintainable. The same Docker Compose strategy used locally can be used on the cloud server, reducing configuration differences between local development and cloud deployment.

The project can be started, stopped, rebuilt, and inspected with standard Docker commands.

## Limitations

This deployment is appropriate for a school capstone demonstration, but it is not a full production enterprise deployment.

Future production improvements could include:

- Domain name and HTTPS certificate
- Managed database service
- Authentication and authorization
- Automated backups
- CI/CD deployment pipeline
- Centralized logging and monitoring
- Private network restrictions for backend services

## Conclusion

AWS Lightsail was selected because it provides the simplest practical AWS deployment path for this Dockerized full-stack application while still demonstrating cloud hosting, public access, server configuration, container orchestration, and application execution in a cloud environment.
