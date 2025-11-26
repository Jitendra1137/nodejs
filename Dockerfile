# Use a stable Node.js image (not alpine - MongoDB drivers break on alpine)
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy all backend code
COPY . .

# Set environment for production
ENV NODE_ENV=production

# Expose backend port
EXPOSE 4000

# Start the Node.js backend
CMD ["node", "index.js"]
