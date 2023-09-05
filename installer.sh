#!/bin/bash

# Define the Docker Compose file
COMPOSE_FILE="docker-compose.yml"

# Stop and remove existing containers
docker-compose -f $COMPOSE_FILE down

# Rebuild and start containers
docker-compose -f $COMPOSE_FILE up --build -d