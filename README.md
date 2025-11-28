# ZCoder - Coding Community Platform

A full-stack coding community platform for sharing solutions, discussing problems, and collaborating in real-time.

## Features

- **Personalized Profiles** - Create unique coding profiles with skills, projects, and social links
- **Blog Posts** - Share coding solutions with tags, upvotes, comments, and favorites
- **Interactive Rooms** - Real-time collaborative chat rooms for coding discussions
- **Event Calendar** - Visual calendar view of upcoming coding contests
- **Real-time Updates** - Live comments, votes, and notifications via WebSockets
- **Community** - Browse and connect with other developers

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS + DaisyUI
- Socket.io Client
- Clerk (Authentication)
- React Router

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (WebSockets)
- Express Validator

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd zencode-final
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   MONGO_DB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BACKEND_URL=http://localhost:5000
   ```

5. **Run the application**

   **Backend** (from `backend` directory):
   ```bash
   npm run dev
   ```

   **Frontend** (from `frontend` directory):
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Deployment

### Important: WebSocket Support
Vercel does NOT support WebSockets. Use a hybrid deployment:

- **Frontend** → Deploy to Vercel
- **Backend** → Deploy to Railway/Render/Fly.io (supports WebSockets)

### Quick Deploy

1. **Backend (Railway)**
   - Go to [railway.app](https://railway.app)
   - Deploy from GitHub
   - Set environment variables: `MONGO_DB_URI`, `FRONTEND_URL`
   - Copy the Railway URL

2. **Frontend (Vercel)**
   - Install Vercel CLI: `npm i -g vercel`
   - From `frontend` directory: `vercel`
   - Set environment variables: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_BACKEND_URL` (use Railway URL)
   - Deploy: `vercel --prod`

3. **Update Backend CORS**
   - In Railway, set `FRONTEND_URL` to your Vercel URL

## Authentication

This app uses [Clerk](https://clerk.com) for authentication:
- Sign-up/Sign-in handled by Clerk
- OTP emails sent automatically by Clerk
- Configure OTP settings in [Clerk Dashboard](https://dashboard.clerk.com)

## Project Structure

```
zencode-final/
├── backend/
│   ├── controllers/    # Route handlers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── socket/         # WebSocket handlers
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom hooks
│   │   └── contexts/   # React contexts
│   └── public/         # Static assets
└── README.md
```

## API Endpoints

- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/blogposts` - Get all blog posts
- `POST /api/blogposts` - Create blog post
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- WebSocket events for real-time updates



