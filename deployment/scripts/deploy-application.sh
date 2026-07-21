#!/bin/bash

set -e

PROJECT_DIR="$HOME/d424-software-engineering-capstone"
BRANCH_NAME="working_branch"

echo "Starting deployment for Home Maintenance Tracker..."

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Project directory not found: $PROJECT_DIR"
  echo "Clone the GitLab repository before running this script."
  exit 1
fi

cd "$PROJECT_DIR"

echo "Checking out deployment branch..."
git fetch origin
git checkout "$BRANCH_NAME"
git pull origin "$BRANCH_NAME"

if [ ! -f ".env" ]; then
  echo "Missing .env file."
  echo "Create a server-only .env file before deploying."
  echo "See deployment/production-env-example.md for required variables."
  exit 1
fi

echo "Stopping existing containers..."
docker compose down

echo "Building and starting application containers..."
docker compose up --build -d

echo "Deployment complete."
docker ps
