# Development Setup Guide

## Prerequisites

### System Requirements

- **Node.js**: Version 16+ (LTS recommended)
- **npm**: Version 8+ (comes with Node.js)
- **MongoDB**: Local installation or Atlas account
- **Git**: Version control system
- **Code Editor**: VS Code recommended

### Recommended Tools

- **Postman**: API testing
- **MongoDB Compass**: Database GUI
- **Nodemon**: Development server (included in dependencies)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd magdalene
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Database Configuration
mongoURL=mongodb://localhost:27017/magdalene
# Or for MongoDB Atlas:
# mongoURL=mongodb+srv://username:password@cluster.mongodb.net/magdalene

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 4. Database Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Create database (optional - will be created automatically)
mongosh
use magdalene
```

#### Option B: MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `.env` file with Atlas connection string

## Project Structure

```
magdalene/
├── Magdalene-WebPages/          # Frontend assets
│   ├── css/                     # Stylesheets
│   ├── js/                      # JavaScript files
│   ├── img/                     # Images
│   ├── lib/                     # Third-party libraries
│   ├── index.html               # Main page
│   ├── login.html               # Login page
│   ├── buynow.html              # Purchase page
│   ├── booking.html             # Booking page
│   └── get_a_quote.html         # Quote request page
├── docs/                        # Documentation
├── node_modules/                # Dependencies
├── app.js                       # Main application file
├── mongodb.js                   # Database configuration
├── package.json                 # Project configuration
├── .env                         # Environment variables
└── README.md                    # Project overview
```

## Development Workflow

### 1. Start Development Server

```bash
npm start
# This runs: nodemon app.js
```

The application will be available at `http://localhost:3000`

### 2. File Watching

Nodemon automatically restarts the server when files change. Watch for:

- `app.js` changes
- `mongodb.js` changes
- Any JavaScript files in the project

### 3. Frontend Development

Static files are served from the `Magdalene-WebPages` directory:

- HTML files: Direct access (e.g., `/index.html`)
- CSS files: `/css/` directory
- JavaScript files: `/js/` directory
- Images: `/img/` directory

## Development Commands

### Package.json Scripts

```json
{
  "scripts": {
    "start": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Useful Development Commands

```bash
# Start development server
npm start

# Install new dependency
npm install package-name

# Install development dependency
npm install --save-dev package-name

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## Database Development

### 1. Database Connection Testing

```javascript
// Test database connection
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.mongoURL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));
```

### 2. Sample Data Creation

```javascript
// Create test data for development
const { Login, BuyNow, Booking, GetAQuote } = require("./mongodb");

async function createSampleData() {
  // Sample login
  await Login.create({
    email: "test@example.com",
    pass: "password123",
  });

  // Sample purchase
  await BuyNow.create({
    name: "John Doe",
    email: "john@example.com",
    country: "United States",
    selectcar: "supra",
    phone: "+1234567890",
    state: "California",
    address: "123 Main St",
  });
}
```

### 3. Database Queries for Testing

```javascript
// Find all users
const users = await Login.find({});

// Find purchases by email
const purchases = await BuyNow.find({ email: "john@example.com" });

// Find bookings by date
const bookings = await Booking.find({ date: "2024-12-25" });
```

## Frontend Development

### 1. Static File Structure

```
Magdalene-WebPages/
├── css/
│   ├── bootstrap.min.css        # Bootstrap framework
│   └── style.css                # Custom styles
├── js/
│   ├── main.js                  # Main JavaScript
│   └── script.js                # Additional scripts
├── img/                         # Image assets
├── lib/                         # Third-party libraries
└── *.html                       # HTML pages
```

### 2. Adding New Pages

1. Create HTML file in `Magdalene-WebPages/`
2. Add route in `app.js` if needed
3. Update navigation links
4. Test responsive design

### 3. Styling Guidelines

- Use Bootstrap classes for responsive design
- Custom CSS in `style.css`
- Follow existing naming conventions
- Test across different screen sizes

## API Development

### 1. Adding New Endpoints

```javascript
// Example: Add new endpoint
app.post("/new-endpoint", async (req, res) => {
  try {
    const data = req.body;
    // Process data
    res.json({ success: true, message: "Data processed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### 2. Testing API Endpoints

```bash
# Test with curl
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=password123"

# Test with Postman
# Create new request
# Set method to POST
# Add form data or JSON body
# Send request and verify response
```

## Debugging

### 1. Server-Side Debugging

```javascript
// Add console.log statements
console.log("Request body:", req.body);
console.log("Database query result:", result);

// Use debugger
debugger; // Add breakpoint

// Error handling
try {
  // Code that might fail
} catch (error) {
  console.error("Error details:", error);
  console.error("Stack trace:", error.stack);
}
```

### 2. Client-Side Debugging

```javascript
// Browser console debugging
console.log("Form data:", formData);
console.error("Validation error:", error);

// Network tab inspection
// Check request/response in browser dev tools
```

### 3. Database Debugging

```bash
# MongoDB shell
mongosh
use magdalene
db.logins.find({})
db.buynows.countDocuments()
```

## Code Quality

### 1. Linting (Recommended)

```bash
# Install ESLint
npm install --save-dev eslint

# Initialize ESLint
npx eslint --init

# Run linting
npx eslint app.js
```

### 2. Code Formatting (Recommended)

```bash
# Install Prettier
npm install --save-dev prettier

# Format code
npx prettier --write app.js
```

### 3. Git Hooks (Optional)

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
```

## Testing

### 1. Manual Testing Checklist

- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Error handling works
- [ ] Responsive design functions

### 2. Automated Testing (Future Enhancement)

```bash
# Install testing framework
npm install --save-dev jest supertest

# Create test files
mkdir tests
touch tests/app.test.js
```

## Performance Optimization

### 1. Development Performance

- Use nodemon for auto-restart
- Enable browser caching for static files
- Optimize database queries
- Monitor memory usage

### 2. Profiling

```javascript
// Add timing logs
console.time("database-query");
const result = await Model.find({});
console.timeEnd("database-query");
```

## Common Development Issues

### 1. Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### 2. Database Connection Issues

- Check MongoDB service status
- Verify connection string
- Check network connectivity
- Validate credentials

### 3. Module Not Found Errors

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### 4. File Permission Issues

```bash
# Fix file permissions
chmod +x script.sh
chmod 755 directory/
```
