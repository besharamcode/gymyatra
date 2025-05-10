# Deployment Guide

## Prerequisites
- Node.js 14.x or higher
- MongoDB instance (local or Atlas)
- PM2 (for production process management)
- Nginx (optional, for reverse proxy)

## Deployment Options

### 1. Traditional VPS Deployment

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
npm install -g pm2

# Install MongoDB
sudo apt install -y mongodb
```

#### Step 2: Application Setup
```bash
# Clone repository
git clone <repository-url>
cd GymTracker/server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

#### Step 3: Build and Start
```bash
# Start with PM2
pm2 start server.js --name "gymtracker"

# Enable PM2 startup
pm2 startup
pm2 save
```

### 2. Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/gymtracker
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

#### Step 3: Deploy with Docker
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create gymtracker-app

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
```

#### AWS Elastic Beanstalk
1. Create Elastic Beanstalk application
2. Configure environment variables
3. Deploy using AWS CLI or console

## Environment Configuration

### Required Environment Variables
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gymtracker
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

### Optional Environment Variables
```env
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## Production Best Practices

### Security
1. Use HTTPS
2. Set secure headers
3. Enable CORS properly
4. Use environment variables
5. Implement rate limiting

### Performance
1. Enable compression
2. Use PM2 cluster mode
3. Configure MongoDB indexes
4. Implement caching
5. Use CDN for static files

### Monitoring
1. Set up PM2 monitoring
2. Configure error logging
3. Set up health checks
4. Monitor MongoDB performance
5. Set up alerts

## Backup and Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/gymtracker" --out=/backup

# Restore
mongorestore --uri="mongodb://localhost:27017/gymtracker" /backup/gymtracker
```

### Application Backup
1. Regular code backups
2. Environment configuration backup
3. SSL certificates backup
4. Database dumps
5. Log files backup

## Scaling

### Vertical Scaling
1. Increase server resources
2. Optimize MongoDB configuration
3. Use PM2 cluster mode
4. Implement caching

### Horizontal Scaling
1. Load balancing
2. Database replication
3. Session management
4. Cache distribution

## Maintenance

### Regular Tasks
1. Update dependencies
2. Monitor logs
3. Check security updates
4. Backup verification
5. Performance monitoring

### Emergency Procedures
1. Server restart
2. Database recovery
3. Rollback procedures
4. Emergency contacts
5. Incident response plan 