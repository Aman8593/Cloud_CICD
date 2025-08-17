# System Architecture

## High-Level Architecture

The Magdalene application follows a traditional 3-tier architecture pattern:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Application  │    │      Data       │
│      Layer      │◄──►│      Layer      │◄──►│      Layer      │
│                 │    │                 │    │                 │
│  Frontend HTML  │    │   Express.js    │    │    MongoDB      │
│  CSS/JavaScript │    │   Node.js API   │    │   Collections   │
│   Bootstrap UI  │    │   Route Handlers│    │   User Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend Components

- **Static Web Pages**: HTML templates served directly
- **Interactive Forms**: User input collection
- **Responsive Design**: Bootstrap-based responsive layouts
- **Client-side Scripts**: Form validation and UI interactions

### Backend Components

- **Express Server**: Main application server (Port 3000)
- **Route Handlers**: API endpoints for different functionalities
- **Middleware**: Request processing and static file serving
- **Database Layer**: MongoDB connection and data models

### Database Architecture

- **MongoDB Atlas/Local**: Document-based NoSQL database
- **Collections**:
  - `logins`: User authentication data
  - `buynows`: Car purchase requests
  - `bookings`: Service appointment bookings
  - `getaquotes`: Quote requests

## Request Flow

### User Registration/Login Flow

```
User Form → Express Route → Validation → MongoDB → Response
    ↓
/register or /login → validateLogin() → Database Query → Redirect/Error
```

### Car Purchase Flow

```
Buy Now Form → /buynow Route → Data Validation → MongoDB Insert → Success Page
```

### Service Booking Flow

```
Booking Form → /booking Route → Schema Validation → Database Save → Confirmation
```

### Quote Request Flow

```
Quote Form → /getaquote Route → Data Processing → MongoDB Save → Custom Response Page
```

## File Structure Architecture

### Static File Serving

```javascript
app.use(express.static("Magdalene-WebPages"));
app.use("/css", express.static(__dirname + "Magdalene-WebPages/css"));
app.use("/img", express.static(__dirname + "Magdalene-WebPages/img"));
app.use("/lib", express.static(__dirname + "Magdalene-WebPages/lib"));
```

### Template Engine Setup

```javascript
app.set("view engine", "hbs");
app.set("views", tempelatePath);
```

## Security Architecture

### Data Validation

- **Mongoose Schema Validation**: Server-side data validation
- **Enum Constraints**: Predefined values for dropdowns
- **Required Field Validation**: Mandatory field enforcement

### Error Handling

- **Try-Catch Blocks**: Graceful error handling
- **HTTP Status Codes**: Proper error response codes
- **User-Friendly Messages**: Clear error communication

## Scalability Considerations

### Current Limitations

- Single server instance
- Direct database connections
- No caching layer
- Limited error logging

### Scalability Patterns Used

- **Modular Route Handlers**: Separated concerns
- **Database Abstraction**: Mongoose ODM
- **Environment Configuration**: dotenv for different environments
- **Process Management**: PM2 for production

## Deployment Architecture

### AWS Infrastructure

```
Internet → Load Balancer → EC2 Instance → Node.js App → MongoDB
                                    ↓
                              CodeDeploy Agent
                                    ↓
                              Automated Deployment
```

### CI/CD Pipeline

```
Git Push → CodeBuild → Artifact Creation → CodeDeploy → EC2 Deployment
```

## Performance Considerations

### Optimizations Implemented

- **Static File Caching**: Express static middleware
- **Database Indexing**: MongoDB automatic indexing
- **Async Operations**: Non-blocking database operations

### Monitoring Points

- **Server Response Times**: Express route performance
- **Database Query Performance**: MongoDB operation timing
- **Error Rates**: Application error tracking
- **Resource Usage**: Server CPU and memory utilization
