# GymTrack Backend API

This is the backend API for GymTrack, a comprehensive gym management system built with Node.js, Express, and MongoDB.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- ES Modules syntax

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Configuration

Create a `.env` file in the root of the server directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Development

To start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

This will start the server with nodemon for hot reloading.

### Production

To start the server in production mode:

```bash
npm start
# or
pnpm start
# or
yarn start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user (protected)

### User Routes

- `GET /api/user/my-plan` - Get user's workout plan (protected)
- `POST /api/user/progress` - Submit progress (protected)
- `GET /api/user/progress-history` - Get progress history (protected)
- `PUT /api/user/profile` - Update profile (protected)

### Admin Routes

- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/users/:id` - Get user by ID (admin)
- `GET /api/admin/users/:userId/progress` - Get user progress (admin)
- `POST /api/admin/exercises` - Create exercise (admin)
- `GET /api/admin/exercises` - Get all exercises (admin)
- `POST /api/admin/diet-plans` - Create diet plan (admin)
- `GET /api/admin/diet-plans` - Get all diet plans (admin)
- `POST /api/admin/plans` - Create workout plan (admin)

## Project Structure

- `server.js` - Entry point
- `controllers/` - Route controllers
- `models/` - Mongoose models
- `routes/` - API routes
- `middlewares/` - Custom middleware functions 