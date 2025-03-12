# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine

# Install Sharp's runtime dependencies and FFmpeg
RUN apk add --no-cache vips-dev ffmpeg

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built application from builder stage
COPY --from=builder --chown=appuser:appgroup /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
