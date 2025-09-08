# Clickthulu Monorepo

A React + Express monorepo for Clickthulu

## Project Structure

```
clickthulu/
├── frontend/          # React application (Vite + React 19)
├── backend/           # Express.js API server
├── shared/            # Shared interfaces, utilities, etc.
├── package.json       # Root package.json with workspace configuration
└── README.md          # This file
```

## Quick Start

### Prerequisites
- Node.js
- npm

### Installation
```bash
# Install all dependencies for both frontend and backend
npm run install:all
```

### Development
```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them individually:
npm run dev:frontend    # Starts React dev server (usually http://localhost:5173)
npm run dev:backend     # Starts Express server with nodemon
```

### Production

```bash
# Build the frontend
npm run build

# Start the backend
npm run start
```

## Available Scripts

### Root Level Commands
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend development server
- `npm run dev:backend` - Start only the backend development server
- `npm run build` - Build the frontend for production
- `npm run start` - Start the backend in production mode
- `npm run start:frontend` - Start the frontend preview server
- `npm run lint` - Run linting on the frontend
- `npm run clean` - Clean workspace dependencies (if clean scripts are available)
- `npm run install:all` - Install all dependencies

### Workspace-Specific Commands
```bash
# Frontend commands
npm run dev --workspace=frontend
npm run build --workspace=frontend
npm run lint --workspace=frontend
npm run preview --workspace=frontend

# Backend commands
npm run start --workspace=backend
npm run dev --workspace=backend
```
