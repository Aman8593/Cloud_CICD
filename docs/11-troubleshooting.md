# Troubleshooting Guide

## Common Issues and Solutions

### 1. Application Startup Issues

#### Issue: "Cannot find module" errors

**Symptoms:**

```bash
Error: Cannot find module 'express'
Error: Cannot find module 'mongodb'
```

**Solutions:**

```bash
# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
npm --version   # Should be 8+

# Clear npm cache
npm cache clean --force
```

#### Issue: Port 3000 already in use

**Symptoms:**

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

```bash
# Find process using port 3000
lsof -i :3000
# Or on Windows
netstat -ano | findstr :3000

# Kill the process
kill -9 <PID>
# Or on Windows
taskkill /PID <PID> /F

# Use different port
PORT=3001 npm start
```

#### Issue: Environment variables not loading

**Symptoms:**

```bash
MongooseError: The `uri` parameter to `openUri()` must be a string
```

**Solutions:**

```bash
# Check .env file exists
ls -la .env

# Verify .env file format
cat .env
# Should contain: mongoURL=mongodb://...

# Check dotenv loading
console.log(process.env.mongoURL); // Add to app.js temporarily

# Restart application after .env changes
```

### 2. Database Connection Issues

#### Issue: MongoDB connection failed

**Symptoms:**

```bash
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
Connection failed
```

**Solutions:**

```bash
# Check MongoDB service status
# macOS with Homebrew
brew services list | grep mongodb
brew services start mongodb/brew/mongodb-community

# Ubuntu/Linux
sudo systemctl status mongod
sudo systemctl start mongod

# Windows
net start MongoDB

# Test connection manually
mongosh
# Or
mongo
```

#### Issue: MongoDB Atlas connection timeout

**Symptoms:**

```bash
MongooseError: connect ETIMEDOUT
```

**Solutions:**

```bash
# Check network connectivity
ping cluster0.xxxxx.mongodb.net

# Verify connection string format
mongodb+srv://username:password@cluster.mongodb.net/database

# Check IP whitelist in MongoDB Atlas
# Add 0.0.0.0/0 for testing (not recommended for production)

# Verify credentials
# Username and password should not contain special characters
```

#### Issue: Authentication failed

**Symptoms:**

```bash
MongooseError: Authentication failed
```

**Solutions:**

```bash
# Verify MongoDB credentials
# Check username and password in .env file
# Ensure user has proper permissions

# For local MongoDB, create user:
mongosh
use magdalene
db.createUser({
  user: "magdalene_user",
  pwd: "password123",
  roles: ["readWrite"]
})
```

### 3. Frontend Issues

#### Issue: Static files not loading

**Symptoms:**

- CSS styles not applied
- Images not displaying
- JavaScript files not loading

**Solutions:**

```javascript
// Check static file middleware in app.js
app.use(express.static("Magdalene-WebPages"));

// Verify file paths
console.log(__dirname); // Should show correct directory

// Check file permissions
ls -la Magdalene-WebPages/css/
chmod 644 Magdalene-WebPages/css/*.css

// Clear browser cache
// Ctrl+F5 or Cmd+Shift+R
```

#### Issue: Forms not submitting

**Symptoms:**

- Form submission returns 404
- No response from server

**Solutions:**

```javascript
// Check form action and method
<form action="/login" method="POST">

// Verify route exists in app.js
app.post('/login', (req, res) => {
  // Route handler
});

// Check body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Debug request body
console.log('Request body:', req.body);
```

#### Issue: Redirect loops

**Symptoms:**

- Browser shows "too many redirects" error
- Infinite redirect loops

**Solutions:**

```javascript
// Check redirect logic
if (loginSuccessful) {
  res.redirect("/buynow.html");
} else {
  res.send("Login failed");
}

// Avoid redirecting to same route
// Check for circular redirects

// Use absolute URLs for redirects
res.redirect("http://localhost:3000/buynow.html");
```

### 4. API Issues

#### Issue: 500 Internal Server Error

**Symptoms:**

```bash
POST /login 500 Internal Server Error
```

**Solutions:**

```javascript
// Add error logging
try {
  await Login.insertMany(logindata);
  res.redirect("/buynow.html");
} catch (error) {
  console.error("Login error:", error);
  console.error("Stack trace:", error.stack);
  res.status(500).send("Internal Server Error");
}

// Check database connection
mongoose.connection.readyState; // Should be 1 (connected)

// Validate data before saving
console.log("Login data:", logindata);
```

#### Issue: Validation errors

**Symptoms:**

```bash
ValidationError: Path `email` is required
```

**Solutions:**

```javascript
// Check form field names match schema
// Form: <input name="email">
// Schema: email: { type: String, required: true }

// Debug form data
console.log("Form data:", req.body);

// Check for typos in field names
// email vs Email (case sensitive)

// Validate enum values
console.log("Selected car:", req.body.selectcar);
// Must match enum values exactly
```

### 5. Deployment Issues

#### Issue: CodeDeploy deployment failed

**Symptoms:**

```bash
Deployment failed: ScriptFailed
```

**Solutions:**

```bash
# Check deployment logs
sudo tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log

# Verify script permissions
chmod +x server_start.sh
chmod +x server_stop.sh
chmod +x fix_privileges.sh

# Check script syntax
bash -n server_start.sh

# Test scripts manually
cd /home/ec2-user/server
./server_start.sh
```

#### Issue: EC2 instance not accessible

**Symptoms:**

- Cannot SSH to instance
- Application not responding

**Solutions:**

```bash
# Check security groups
# Ensure ports 22 (SSH), 80 (HTTP), 3000 (App) are open

# Verify instance status
aws ec2 describe-instances --instance-ids i-1234567890abcdef0

# Check system logs
# AWS Console → EC2 → Instance → Actions → Instance Settings → Get System Log

# Connect via Session Manager (if configured)
aws ssm start-session --target i-1234567890abcdef0
```

#### Issue: Build failures in CodeBuild

**Symptoms:**

```bash
Build failed: npm install failed
```

**Solutions:**

```bash
# Check buildspec.yml syntax
# Validate YAML format

# Verify Node.js version
runtime-versions:
  nodejs: 20  # Use supported version

# Check build logs
aws codebuild batch-get-builds --ids build-id

# Test build locally
docker run -it amazonlinux:2
yum install -y nodejs npm
npm install
```

### 6. Performance Issues

#### Issue: Slow page loading

**Symptoms:**

- Pages take > 5 seconds to load
- High server response times

**Solutions:**

```javascript
// Add performance logging
console.time("database-query");
const result = await Model.find({});
console.timeEnd("database-query");

// Check database indexes
db.collection.getIndexes();

// Monitor memory usage
console.log("Memory usage:", process.memoryUsage());

// Optimize database queries
// Use projection to limit fields
const users = await User.find({}, "name email");
```

#### Issue: High memory usage

**Symptoms:**

```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solutions:**

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 app.js

# Check for memory leaks
# Use Node.js profiling tools
node --inspect app.js

# Monitor with PM2
pm2 monit

# Optimize code
# Close database connections
# Remove unused variables
```

### 7. Security Issues

#### Issue: CORS errors

**Symptoms:**

```bash
Access to fetch at 'http://localhost:3000/api' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solutions:**

```javascript
// Install and configure CORS
npm install cors

const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Or allow all origins (development only)
app.use(cors());
```

#### Issue: Authentication not working

**Symptoms:**

- Users can't log in
- Session not maintained

**Solutions:**

```javascript
// Check login validation logic
async function validateLogin(logindata) {
  const user = await Login.findOne({
    email: logindata.email,
    pass: logindata.pass,
  });
  return user !== null;
}

// Debug authentication
console.log("Login attempt:", logindata);
console.log("User found:", user);

// Implement proper session management
// Consider using express-session or JWT
```

## Debugging Tools and Techniques

### 1. Logging

```javascript
// Add comprehensive logging
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Use throughout application
logger.info("User login attempt", { email: req.body.email });
logger.error("Database error", { error: error.message });
```

### 2. Database Debugging

```bash
# MongoDB shell debugging
mongosh
use magdalene

# Check collections
show collections

# Count documents
db.logins.countDocuments()
db.buynows.countDocuments()

# Find recent entries
db.logins.find().sort({_id: -1}).limit(5)

# Check indexes
db.logins.getIndexes()
```

### 3. Network Debugging

```bash
# Check port availability
netstat -tulpn | grep 3000

# Test API endpoints
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@test.com&password=test123"

# Check DNS resolution
nslookup your-domain.com
dig your-domain.com
```

### 4. System Monitoring

```bash
# Check system resources
top
htop
free -h
df -h

# Monitor logs in real-time
tail -f /var/log/syslog
journalctl -f

# Check process status
ps aux | grep node
pgrep -f node
```

## Emergency Procedures

### 1. Application Down

```bash
# Quick restart
pm2 restart magdalene
# Or
sudo systemctl restart your-app-service

# Check logs immediately
pm2 logs magdalene
tail -f /var/log/your-app.log

# Rollback if needed
git checkout previous-working-commit
npm install
npm start
```

### 2. Database Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check disk space
df -h

# Backup database before fixes
mongodump --db magdalene --out backup/
```

### 3. Security Incident

```bash
# Immediate actions:
1. Isolate affected systems
2. Change all passwords
3. Review access logs
4. Contact security team
5. Document incident

# Log analysis
grep "failed login" /var/log/auth.log
grep "suspicious" /var/log/your-app.log
```

## Getting Help

### 1. Internal Resources

- **Development Team**: dev-team@company.com
- **DevOps Team**: devops@company.com
- **Database Admin**: dba@company.com

### 2. External Resources

- **Node.js Documentation**: https://nodejs.org/docs/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express.js Guide**: https://expressjs.com/
- **AWS Documentation**: https://docs.aws.amazon.com/

### 3. Community Support

- **Stack Overflow**: Tag questions with relevant technologies
- **GitHub Issues**: Check project repositories
- **Discord/Slack**: Developer communities
- **Reddit**: r/node, r/mongodb, r/webdev

### 4. Professional Support

- **MongoDB Atlas Support**: For database issues
- **AWS Support**: For infrastructure problems
- **Third-party Consultants**: For complex issues

## Prevention Strategies

### 1. Monitoring Setup

```javascript
// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

### 2. Automated Testing

```javascript
// Basic smoke tests
const request = require("supertest");
const app = require("../app");

describe("Smoke Tests", () => {
  test("Server should start", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });
});
```

### 3. Regular Maintenance

- **Weekly**: Check logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Full system health check and optimization
- **Annually**: Architecture review and major updates
