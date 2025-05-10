# GymTracker Server Documentation

## Overview
The GymTracker server is a Node.js/Express.js backend application that provides APIs for managing gyms, trainers, members, and their interactions. It uses MongoDB as the database and implements JWT-based authentication.

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure
```
server/
├── controllers/         # Route controllers
├── middleware/         # Custom middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── config/            # Configuration files
├── utils/             # Utility functions
└── server.js          # Entry point
```

## API Architecture

### Authentication System
The application implements a multi-role authentication system with the following roles:
- GymRate (Admin)
- Gym
- GymTrainer
- User (Member)

### Models

#### GymRate
- Manages multiple gyms
- Handles gym registration and management
- Access to gym statistics and analytics

#### Gym
- Manages branches and trainers
- Handles member management
- Subscription management
- Branch operations

#### GymTrainer
- Manages assigned members
- Handles workout and diet plans
- Schedule management
- Progress tracking
- Review system

#### GymBranch
- Manages trainers and members
- Facility management
- Operating hours
- Capacity tracking

### API Endpoints

#### GymRate Routes
- POST `/api/gymrate/register` - Register new GymRate
- POST `/api/gymrate/login` - Login GymRate
- GET `/api/gymrate/profile` - Get GymRate profile
- PUT `/api/gymrate/profile` - Update GymRate profile
- GET `/api/gymrate/gyms` - Get all gyms
- POST `/api/gymrate/gyms` - Create new gym
- GET `/api/gymrate/gyms/stats` - Get gym statistics

#### Gym Routes
- GET `/api/gym/profile` - Get gym profile
- PUT `/api/gym/profile` - Update gym profile
- GET `/api/gym/branches` - Get all branches
- POST `/api/gym/branches` - Create new branch
- GET `/api/gym/branches/stats` - Get branch statistics
- GET `/api/gym/trainers` - Get all trainers
- GET `/api/gym/members` - Get all members

#### GymTrainer Routes
- POST `/api/trainer/register` - Register new trainer
- POST `/api/trainer/login` - Login trainer
- GET `/api/trainer/profile` - Get trainer profile
- PUT `/api/trainer/profile` - Update trainer profile
- GET `/api/trainer/users` - Get assigned users
- POST `/api/trainer/user/:id/plan` - Assign plan to user
- PUT `/api/trainer/user/:id/progress` - Update user progress

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

3. Start the server:
```bash
npm start
```

## Security Features
- Password hashing using bcryptjs
- JWT-based authentication
- Role-based access control
- Protected routes
- Input validation
- Error handling middleware

## Areas for Improvement

### 1. Security Enhancements
- Implement rate limiting
- Add request validation using Joi or express-validator
- Implement CORS configuration
- Add helmet.js for security headers
- Implement API key authentication for third-party integrations

### 2. Performance Optimization
- Implement caching using Redis
- Add database indexing for frequently queried fields
- Implement pagination for list endpoints
- Add compression middleware
- Implement request queuing for heavy operations

### 3. Code Quality
- Add TypeScript for better type safety
- Implement unit tests using Jest
- Add integration tests
- Implement API documentation using Swagger/OpenAPI
- Add logging system using Winston or Morgan

### 4. Features to Add
- File upload system for profile pictures and documents
- Email notification system
- Real-time notifications using WebSocket
- Payment integration
- Analytics dashboard
- Backup system
- Audit logging

### 5. Monitoring and Maintenance
- Add health check endpoints
- Implement error tracking (e.g., Sentry)
- Add performance monitoring
- Implement automated backups
- Add database migration system

### 6. Documentation
- Add API documentation
- Add deployment documentation
- Add contribution guidelines
- Add troubleshooting guide
- Add architecture diagrams

## Best Practices Implemented
- ES Modules for better code organization
- Async/await for better error handling
- Middleware for authentication and authorization
- Proper error handling and validation
- Clean code structure and separation of concerns

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. 