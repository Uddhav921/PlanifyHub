# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally (optional)
RUN npm install -g nodemon

# Copy all project files
COPY . .

# Expose port
EXPOSE 3000

# Start app in dev mode with nodemon
CMD ["npm", "run", "dev"]
