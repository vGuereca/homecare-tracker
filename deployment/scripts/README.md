# Deployment Scripts

## Purpose

This folder contains scripts used to support the AWS Lightsail deployment for Task 4.

These scripts document and automate the main deployment actions used for the Home Maintenance Tracker and Cost Prioritization Application.

## Scripts

### install-server-tools.sh

Installs required server tools on Ubuntu, including:

- Git
- Docker Engine
- Docker Compose plugin
- Required package dependencies

This script is intended for a new AWS Lightsail Ubuntu instance.

### deploy-application.sh

Deploys the application from the GitLab repository on the Lightsail server.

The script:

- Moves to the project directory
- Checks out working_branch
- Pulls the latest code from GitLab
- Confirms that a server-only .env file exists
- Stops existing containers
- Rebuilds and starts the app with Docker Compose
- Displays running containers

### check-deployment.sh

Checks whether the cloud deployment is running.

The script verifies:

- Docker containers are running
- Backend health endpoint responds
- Frontend responds on port 80

## Security Note

These scripts do not include real secrets.

The actual .env file is created directly on the Lightsail server and is not committed to GitLab.

## Usage

On the Lightsail server, make the scripts executable:

chmod +x deployment/scripts/*.sh

Run the deployment script:

./deployment/scripts/deploy-application.sh

Run the check script:

./deployment/scripts/check-deployment.sh
