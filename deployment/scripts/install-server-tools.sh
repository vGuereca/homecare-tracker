#!/bin/bash

set -e

echo "Updating Ubuntu packages..."
sudo apt-get update
sudo apt-get upgrade -y

echo "Installing required packages..."
sudo apt-get install -y ca-certificates curl gnupg git

echo "Adding Docker GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "Adding Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "Installing Docker Engine and Docker Compose plugin..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "Starting and enabling Docker..."
sudo systemctl enable docker
sudo systemctl start docker

echo "Adding ubuntu user to docker group..."
sudo usermod -aG docker ubuntu

echo "Docker installation complete."
echo "Log out and back in, or run: newgrp docker"
docker --version || true
docker compose version || true
git --version || true
