#!/bin/bash

set -e

CYAN='\033[0;36m'

# Ensure that Docker is running...
if docker info -ne 0 >/dev/null 2>&1; then
  echo -e "${CYAN}Docker is not running."

  exit 1
fi

# Define the Docker Compose file
COMPOSE_FILE="docker-compose.yml"

# Stop and remove existing containers
docker-compose -f $COMPOSE_FILE down

# Rebuild and start containers
docker-compose -f $COMPOSE_FILE up nodejs-app --build -d

docker-compose exec nodejs-app npm run admin-seeder