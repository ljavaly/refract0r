# Refract0r

A modern video streaming platform built with React, Vite, and Express.js.

## Project Structure

```
refract0r/
├── packages/
│   ├── frontend/        # React + Vite application
│   │   ├── src/        # React components and assets
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── tailwind.config.js
│   ├── backend/        # Express.js server
│   │   ├── routes/     # API routes
│   │   ├── server.js   # Main server file
│   │   ├── env.example # Environment variables template
│   │   └── package.json
│   └── shared/         # Shared utilities, types, and configs
│       ├── types.js    # Shared type definitions
│       ├── utils.js    # Shared utility functions
│       ├── config.js   # Shared configuration
│       └── package.json
├── package.json        # Root workspace configuration
└── README.md
```

## Getting Started

### Quick Start (Recommended)

1. Install all dependencies:

   ```bash
   npm run install:all
   ```

2. Start both frontend and backend in development mode:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:4001`

### Individual Services

#### Frontend (React + Vite)

1. Install frontend dependencies:

   ```bash
   npm install --workspace=frontend
   ```

2. Start the frontend development server:

   ```bash
   npm run dev:frontend
   ```

3. Open your browser and navigate to `http://localhost:4001`

#### Backend (Express.js Server)

1. Install backend dependencies:

   ```bash
   npm install --workspace=backend
   ```

2. Set up environment variables (optional):

   ```bash
   cd packages/backend
   cp env.example .env
   # Edit .env file with your configuration
   ```

3. Start the backend server:

   ```bash
   npm run dev:backend
   ```

4. The server will be running on `http://localhost:3001`

## Development

### Frontend Features

- React 19 with Vite for fast development
- Tailwind CSS for styling
- Component-based architecture
- Responsive design

### Backend Features

- Express.js server
- CORS enabled for frontend communication
- Modular route structure
- Error handling middleware
- Environment variable support

## Available Scripts

### Root (Workspace)

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend development server
- `npm run dev:backend` - Start only backend development server
- `npm run install:all` - Install dependencies for all workspaces
- `npm run build:backend` - Build amd64-compatible Docker image of backend service, tagged for upload to Google Cloud Artifact Registry
- `npm run build:frontend` - Build frontend using Vite
- `npm run build:all` - Build frontend and backend for production
- `npm run push:frontend` - Upload frontend assets to Google Cloud Storage bucket, applying latest frontend build to production
- `npm run push:backend` - Push backend docker image to Google Cloud Artifact Registry, applying latest backend build to production
- `npm run push:all` - Push latest frontend and backend builds to production

### Frontend

- `npm run dev` - Start development server (port 4001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start development server with nodemon (port 3001)
- `npm start` - Start production server
