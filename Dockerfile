# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Install Prisma CLI globally
RUN npm install -g prisma

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]