# Use an official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the context
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the `package` directory
COPY . .

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
