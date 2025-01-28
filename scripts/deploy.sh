#!/bin/bash

# Check if running with sudo
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Pull latest changes
git pull origin main

# Build and start containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check container status
docker-compose ps

# Show logs
docker-compose logs -f 