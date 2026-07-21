#!/bin/bash

set -e

echo "Checking Docker containers..."
docker ps

echo ""
echo "Checking backend health endpoint..."
curl http://localhost:8080/api/health

echo ""
echo ""
echo "Checking frontend HTTP response..."
curl -I http://localhost

echo ""
echo "Deployment check complete."
echo "Expected containers:"
echo "- home-maintenance-postgres"
echo "- home-maintenance-backend"
echo "- home-maintenance-frontend"
echo ""
echo "Expected public URLs:"
echo "- http://3.18.100.20"
echo "- http://3.18.100.20:8080/api/health"
