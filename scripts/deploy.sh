#!/bin/bash

set -e

echo "🟡 Deploying application..."
cd ./src

echo "🟡 Update code base"
git pull origin main

echo "🟡 Install dependency based on lock file"
npm install

echo "🚀 Application deployed!"