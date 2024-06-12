# Stage 1: Base stage with Node.js Alpine image
FROM node:20-alpine AS base

# Stage 2: Builder stage starts from the base image
FROM base AS builder

# Install libc6-compat for compatibility and globally install specific pnpm version
RUN apk add --no-cache libc6-compat && \
  npm install -g pnpm@9.1.1

# Set the working directory for subsequent instructions
WORKDIR /builder

# Copy package.json and pnpm-lock.yaml to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies as per lock file without making updates
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application and prune development dependencies
RUN pnpm run build
RUN pnpm prune --prod

# Stage 3: Runner stage starts from the base image again
FROM base AS runner

# Set the working directory in the container
WORKDIR /runner

# Create a non-root group and user for running the application securely
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bossrod

# Copy installed node_modules and built artifacts from the builder stage
# Change ownership to the non-root user and group created above
COPY --from=builder --chown=bossrod:nodejs /builder/node_modules /runner/node_modules
COPY --from=builder --chown=bossrod:nodejs /builder/dist /runner/dist
COPY --from=builder --chown=bossrod:nodejs /builder/package.json /runner/package.json

# Switch to non-root user for security
USER bossrod

# Inform Docker that the container is listening on port 3000 at runtime
EXPOSE 3000

# Define the command to run the app
CMD ["node", "/runner/dist/app.js"]
