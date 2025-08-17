# Project Overview

## About Magdalene

Magdalene is a modern sports car website that provides a comprehensive platform for car enthusiasts to explore, purchase, and service high-performance vehicles. The application combines an attractive frontend with a robust backend to deliver a seamless user experience.

## Project Goals

- **Primary Goal**: Create an engaging online platform for sports car sales and services
- **Secondary Goals**:
  - Provide easy booking system for car services
  - Enable quote requests for custom services
  - Maintain customer data securely
  - Deliver responsive user experience across devices

## Key Stakeholders

- **End Users**: Car enthusiasts and potential buyers
- **Service Customers**: Existing car owners seeking maintenance
- **Business Owners**: Sales and service management
- **Developers**: Technical team maintaining the platform

## Technology Stack

### Frontend

- **HTML5**: Semantic markup and structure
- **CSS3**: Styling with Bootstrap framework
- **JavaScript**: Interactive functionality
- **Bootstrap**: Responsive design framework
- **Font Awesome**: Icon library

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **Handlebars (HBS)**: Template engine
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Development Tools

- **Nodemon**: Development server with auto-restart
- **dotenv**: Environment variable management
- **Git**: Version control

### Deployment & DevOps

- **AWS CodeDeploy**: Automated deployment
- **AWS CodeBuild**: Build automation
- **EC2**: Cloud hosting
- **PM2**: Process management

## Project Structure

```
Magdalene/
├── Magdalene-WebPages/     # Frontend assets and pages
├── docs/                   # Project documentation
├── node_modules/          # Dependencies
├── app.js                 # Main application server
├── mongodb.js             # Database configuration
├── package.json           # Project dependencies
├── buildspec.yml          # AWS CodeBuild configuration
├── appspec.yml            # AWS CodeDeploy configuration
└── server_*.sh            # Deployment scripts
```

## Current Status

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: Current
- **Environment**: AWS Cloud Infrastructure
