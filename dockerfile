# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm ci

# Copy the rest of the project files to the working directory
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose port 3000 for the app to be accessible
EXPOSE 3002

# Define the command to run the app
CMD [ "npm", "run", "dev" ]