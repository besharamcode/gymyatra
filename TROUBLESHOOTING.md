# Troubleshooting Guide

## Common Issues and Solutions

### 1. Server Connection Issues

#### MongoDB Connection Error
```
MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

Solutions:
1. Check if MongoDB is running:
```bash
sudo systemctl status mongodb
```

2. Start MongoDB if stopped:
```bash
sudo systemctl start mongodb
```

3. Check MongoDB logs:
```bash
sudo tail -f /var/log/mongodb/mongodb.log
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

Solutions:
1. Find process using port:
```bash
sudo lsof -i :5000
```

2. Kill the process:
```bash
sudo kill -9 <PID>
```

3. Change port in .env file:
```env
PORT=5001
```

### 2. Authentication Issues

#### JWT Token Invalid
```
Error: invalid token
```

Solutions:
1. Check JWT_SECRET in .env
2. Ensure token is not expired
3. Verify token format
4. Check token in request header

#### Login Failures
```
Error: Invalid email or password
```

Solutions:
1. Verify credentials
2. Check password hashing
3. Verify user exists
4. Check database connection

### 3. Database Issues

#### Mongoose Validation Errors
```
ValidationError: User validation failed
```

Solutions:
1. Check required fields
2. Verify data types
3. Check unique constraints
4. Validate input data

#### Database Performance
```
Slow query performance
```

Solutions:
1. Add indexes
2. Optimize queries
3. Check connection pool
4. Monitor database size

### 4. API Issues

#### CORS Errors
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

Solutions:
1. Configure CORS middleware
2. Check allowed origins
3. Verify request headers
4. Update CORS settings

#### Rate Limiting
```
Too many requests, please try again later
```

Solutions:
1. Adjust rate limit settings
2. Implement caching
3. Check client requests
4. Monitor API usage

### 5. File Upload Issues

#### File Size Limits
```
Error: File too large
```

Solutions:
1. Adjust file size limits
2. Compress files
3. Use streaming
4. Implement chunked uploads

#### File Type Validation
```
Error: Invalid file type
```

Solutions:
1. Check allowed file types
2. Verify file extensions
3. Implement proper validation
4. Update MIME type handling

### 6. Performance Issues

#### High Memory Usage
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

Solutions:
1. Increase Node.js memory limit
2. Optimize code
3. Implement garbage collection
4. Monitor memory usage

#### Slow Response Times
```
Response time > 1000ms
```

Solutions:
1. Implement caching
2. Optimize database queries
3. Use compression
4. Add load balancing

### 7. Deployment Issues

#### PM2 Issues
```
PM2 process not starting
```

Solutions:
1. Check PM2 logs:
```bash
pm2 logs
```

2. Restart PM2:
```bash
pm2 restart all
```

3. Check process status:
```bash
pm2 status
```

#### Docker Issues
```
Container not starting
```

Solutions:
1. Check Docker logs:
```bash
docker logs <container-id>
```

2. Verify Dockerfile
3. Check docker-compose.yml
4. Verify environment variables

### 8. Security Issues

#### SSL/TLS Issues
```
SSL certificate invalid
```

Solutions:
1. Check certificate validity
2. Update certificates
3. Verify domain
4. Check SSL configuration

#### Security Headers
```
Missing security headers
```

Solutions:
1. Implement helmet.js
2. Configure security headers
3. Update CORS settings
4. Enable HTTPS

## Debugging Tools

### 1. Logging
```javascript
// Add debug logging
console.log('Debug:', { variable });
```

### 2. MongoDB Debug
```javascript
mongoose.set('debug', true);
```

### 3. Node.js Debug
```bash
node --inspect server.js
```

### 4. PM2 Debug
```bash
pm2 logs --lines 100
```

## Monitoring

### 1. Health Checks
```bash
curl http://localhost:5000/health
```

### 2. Performance Monitoring
```bash
pm2 monit
```

### 3. Database Monitoring
```bash
mongosh --eval "db.serverStatus()"
```

## Emergency Procedures

### 1. Server Restart
```bash
# Graceful restart
pm2 restart all

# Force restart
pm2 restart all --force
```

### 2. Database Recovery
```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/gymtracker" /backup/gymtracker
```

### 3. Rollback
```bash
# Git rollback
git reset --hard HEAD~1
```

## Getting Help

1. Check error logs
2. Search GitHub issues
3. Check documentation
4. Contact support

## Prevention

1. Regular backups
2. Monitoring setup
3. Security updates
4. Performance testing
5. Code review process 