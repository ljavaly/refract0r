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

## API Endpoints

- `GET /` - Server status
- `GET /health` - Health check
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Create new video

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
- `npm run build` - Build frontend for production
- `npm run start` - Start backend in production mode

### Frontend
- `npm run dev` - Start development server (port 4001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon (port 3001)
- `npm start` - Start production server

## Benefits of This Structure

### ✅ **Advantages:**
- **Monorepo Management**: Single repository for frontend, backend, and shared code
- **Unified Scripts**: Run both services with one command (`npm run dev`)
- **Shared Code**: Common utilities, types, and configurations
- **Dependency Management**: Each package has its own dependencies
- **Scalability**: Easy to add more packages (mobile app, admin panel, etc.)
- **Type Safety**: Shared type definitions (when using TypeScript)
- **Consistent Tooling**: ESLint, Prettier, etc. can be shared

### ⚠️ **Considerations:**
- **Complexity**: Slightly more complex setup than separate repos
- **Learning Curve**: Team needs to understand workspace concepts
- **Build Process**: Need to manage builds for multiple packages

### 🔄 **When to Use This vs. Separate Repos:**

**Use This Structure When:**
- Small to medium team (1-10 developers)
- Frontend and backend are tightly coupled
- You want to share code between frontend and backend
- You plan to add more services (mobile app, admin panel)

**Use Separate Repos When:**
- Large team with different responsibilities
- Frontend and backend are developed independently
- Different deployment cycles
- Different technology stacks
