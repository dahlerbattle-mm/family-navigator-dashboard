# Use an official Node.js image as the base for building
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js production application
RUN npm run build

# Use a lighter Node.js image for running the app
FROM node:18-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app ./

# Expose the port for the application
EXPOSE 3000

# Run the Next.js app in production mode
CMD ["npm", "start"]
