# Use an official Node.js runtime as the base image.
# We're using a specific version (18-alpine) for better security and a smaller image size.
FROM node:18-alpine

# Set the working directory inside the container.
# All subsequent commands will run from this directory.
WORKDIR /app

# Copy the root package.json and package-lock.json first.
# These files define the entire monorepo's dependency tree.
COPY package.json ./
COPY package-lock.json ./

# Copy the backend-specific package.json file.
# This ensures Docker is aware of the specific dependencies for the backend package.
COPY packages/backend/package.json ./packages/backend/

# Install the dependencies.
# We use `npm ci` for clean, consistent installs based on package-lock.json.
# This is better than `npm install` for production builds.
# The `--workspace=backend` flag tells npm to only install dependencies for the 'backend' package.
# The --omit=dev flag tells npm to skip devDependencies
RUN npm ci --workspace=backend --omit=dev

# Copy the rest of the backend source code.
# We copy the entire packages/backend directory.
COPY packages/backend ./packages/backend/

# This ensures that the Node.js application listens on port 8080.
ENV PORT=8080

# The `express` default is port 3000, but Cloud Run defaults to 8080.
# It's best practice to explicitly set it to 8080 in a Cloud Run context.
EXPOSE 8080

# Define the command to run the application.
CMD [ "npm", "start", "--workspace=backend" ]