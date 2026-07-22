Task 4 Revision Response

Project:
Home Maintenance Tracker and Cost Prioritization Application

Student:
Victor Guereca

Course:
D424 Software Engineering Capstone

Deployed Application:
http://3.18.100.20

Backend Health Endpoint:
http://3.18.100.20:8080/api/health

GitLab Repository:
https://gitlab.com/wgu-gitlab-environment/student-repos/vguere1/d424-software-engineering-capstone/-/tree/working_branch

Panopto Video:
https://wgu.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=04d43013-d436-4895-810c-b48e005c9648

Question 1: Why did you choose AWS Lightsail?
AWS Lightsail was selected because it aligned with the architecture and deployment
needs of the Home Maintenance Tracker and Cost Prioritization Application. The application
was already built as a Dockerized full-stack web application with a React frontend, Java Spring Boot backend,
and PostgreSQL database. Lightsail provides a straightforward Ubuntu server environment where Docker Engine and Docker Compose
can be installed and used to run all three application components together.

Lightsail was also appropriate because the project did not require a complex enterprise cloud architecture.
The goal of Task 4 was to deploy the completed application to a cloud service provider and demonstrate that it
functions correctly through public access. Lightsail provided the necessary features for that goal, including a
public static IP address, SSH access, firewall configuration, and support for running containerized services.

AWS Lightsail was chosen over more complex AWS services because it reduced unnecessary infrastructure complexity
while still demonstrating cloud deployment. Services such as ECS, EKS, or a multi-service AWS architecture would
have added additional configuration that was not required for the scope of this capstone. Lightsail allowed the
project to remain understandable, maintainable, and aligned with the Docker Compose setup already created during
development.


Question 2: How did you implement container images?
Container images were implemented using Dockerfiles and Docker Compose. The application uses three containers:
a React frontend container, a Java Spring Boot backend container, and a PostgreSQL database container.

The frontend container image is built from frontend/Dockerfile. It uses a multi-stage Docker build.
The first stage uses a Node image to install dependencies and build the React/Vite production files. 
The second stage uses an Nginx image to serve the built frontend files on port 80. The frontend build receives
the VITE_API_BASE_URL value so the deployed frontend can call the backend API at the Lightsail public IP address.

The backend container image is built from backend/Dockerfile. It also uses a multi-stage Docker build. 
The first stage uses a Java JDK image to build the Spring Boot application with Maven. The second stage 
uses a Java runtime image to run the packaged Spring Boot JAR file. The backend container exposes port 8080 
and provides the REST API used by the frontend.

The PostgreSQL database uses the official postgres:16 image defined in docker-compose.yml. Docker Compose 
defines the frontend, backend, and database services, manages their startup order, and provides networking 
between the containers. The database data is stored in a Docker volume so the data is not lost when containers
are restarted. PostgreSQL port 5432 was not opened publicly in the Lightsail firewall, so the database remains 
internal to the server and Docker network.

This container implementation allowed the full-stack application to run consistently on the AWS Lightsail 
Ubuntu server using Docker Compose.

Sources

Sources

Amazon Web Services. (n.d.). Understanding firewall and port mappings in Amazon Lightsail. AWS Documentation. https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-firewall-and-port-mappings-in-amazon-lightsail.html

Amazon Web Services. (n.d.). Static IP addresses in Amazon Lightsail. AWS Documentation. https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-static-ip-addresses-in-amazon-lightsail.html

Docker. (n.d.). Install Docker Engine on Ubuntu. Docker Documentation. https://docs.docker.com/engine/install/ubuntu/

Docker. (n.d.). Multi-stage builds. Docker Documentation. https://docs.docker.com/build/building/multi-stage/

Docker. (n.d.). Compose file reference: Services. Docker Documentation. https://docs.docker.com/reference/compose-file/services/