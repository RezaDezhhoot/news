# Use an official Node.js runtime as the base image
FROM node:14

# Copy the rest of the application code
COPY . /app

# Set the working directory in the container
WORKDIR /app

# Install app dependencies
RUN npm install

RUN npm install -g nodemon

RUN npm rebuild sharp

# Expose the port your app runs on
EXPOSE 3000

# Start the Node.js application
