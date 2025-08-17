# Deployment Guide

## Overview

The Magdalene application is designed for deployment on AWS infrastructure using automated CI/CD pipelines with CodeBuild and CodeDeploy.

## Prerequisites

### System Requirements

- **Operating System**: Linux (Amazon Linux 2)
- **Node.js**: Version 20 (LTS)
- **MongoDB**: Atlas or self-hosted instance
- **AWS Account**: With appropriate permissions

### Required AWS Services

- **EC2**: Virtual server hosting
- **CodeBuild**: Build automation
- **CodeDeploy**: Deployment automation
- **IAM**: Identity and access management
- **S3**: Artifact storage (optional)

## Environment Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
mongoURL=mongodb+srv://username:password@cluster.mongodb.net/magdalene

# Application Configuration
NODE_ENV=production
PORT=3000

# AWS Configuration (if needed)
AWS_REGION=us-east-1
```

### 2. EC2 Instance Setup

#### Instance Configuration

- **Instance Type**: t2.micro (minimum) or t3.small (recommended)
- **AMI**: Amazon Linux 2
- **Security Groups**:
  - HTTP (80)
  - HTTPS (443)
  - SSH (22)
  - Custom TCP (3000)

#### User Data Script

```bash
#!/bin/bash
yum update -y
yum install -y ruby wget

# Install CodeDeploy agent
cd /home/ec2-user
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
./install auto

# Create application directory
mkdir -p /home/ec2-user/server
chown ec2-user:ec2-user /home/ec2-user/server
```

## Deployment Configuration Files

### 1. AppSpec Configuration (`appspec.yml`)

```yaml
version: 0.0
os: linux

files:
  - source: /
    destination: /home/ec2-user/server

permissions:
  - object: /
    pattern: "**"
    owner: ec2-user
    group: ec2-user

hooks:
  BeforeInstall:
    - location: server_clear.sh
      timeout: 300
      runas: ec2-user
  AfterInstall:
    - location: fix_privileges.sh
      timeout: 300
      runas: ec2-user
  ApplicationStart:
    - location: server_start.sh
      timeout: 200
      runas: ec2-user
  ApplicationStop:
    - location: server_stop.sh
      timeout: 20
      runas: ec2-user
```

### 2. Build Configuration (`buildspec.yml`)

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - chmod 777 node_modules/.bin/nodemon
      - npm install
      - echo "Installing npm successful"
  build:
    commands:
      - npm run
      - echo "Compilation successful"
  post_build:
    commands:
      - echo Build completed on `date`
artifacts:
  files:
    - "**/*"
  discard-paths: yes
```

## Deployment Scripts

### 1. Server Clear Script (`server_clear.sh`)

```bash
#!/usr/bin/env bash

# Install Node.js using NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

# Install PM2 for process management
npm install -g pm2
pm2 update

# Remove existing server directory
sudo rm -rf /home/ec2-user/server
```

### 2. Fix Privileges Script (`fix_privileges.sh`)

```bash
#!/usr/bin/env bash
chmod +x /home/ec2-user/server/app.js
chmod +x /home/ec2-user/server/server_start.sh
chmod +x /home/ec2-user/server/server_stop.sh
```

### 3. Server Start Script (`server_start.sh`)

```bash
#!/usr/bin/env bash
cd /home/ec2-user/server
chmod +x /home/ec2-user/server/node_modules/.bin/nodemon
sudo npm run
```

### 4. Server Stop Script (`server_stop.sh`)

```bash
#!/bin/bash
# Add process termination commands if needed
# sudo pkill -f 'node'
```

## CI/CD Pipeline Setup

### 1. CodeBuild Project Configuration

- **Source**: GitHub/CodeCommit repository
- **Environment**: Amazon Linux 2
- **Runtime**: Node.js 20
- **Build Specification**: Use buildspec.yml
- **Artifacts**: Store in S3 or use directly

### 2. CodeDeploy Application Setup

- **Platform**: EC2/On-premises
- **Deployment Group**: Target EC2 instances
- **Service Role**: CodeDeploy service role
- **Deployment Configuration**: CodeDeployDefault.EC2OneAtATime

### 3. IAM Roles and Policies

#### CodeBuild Service Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "*"
    }
  ]
}
```

#### CodeDeploy Service Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:*", "autoscaling:*", "elasticloadbalancing:*"],
      "Resource": "*"
    }
  ]
}
```

#### EC2 Instance Profile

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": "*"
    }
  ]
}
```

## Manual Deployment Steps

### 1. Prepare the Server

```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

# Install PM2
npm install -g pm2
```

### 2. Deploy Application

```bash
# Clone repository
git clone your-repository-url
cd magdalene

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start application
npm start
# Or use PM2 for production
pm2 start app.js --name magdalene
pm2 save
pm2 startup
```

## Production Considerations

### 1. Process Management

```bash
# Use PM2 for production
pm2 start app.js --name magdalene
pm2 monit
pm2 logs magdalene
```

### 2. Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL Certificate

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Logging

### 1. Application Logs

```bash
# PM2 logs
pm2 logs magdalene

# System logs
sudo tail -f /var/log/messages
```

### 2. Health Checks

```bash
# Check application status
curl http://localhost:3000
pm2 status
```

## Troubleshooting

### Common Issues

1. **Port 3000 not accessible**: Check security groups
2. **Node.js not found**: Verify NVM installation
3. **Permission denied**: Check file permissions
4. **Database connection failed**: Verify MongoDB URL

### Debug Commands

```bash
# Check process status
ps aux | grep node

# Check port usage
netstat -tulpn | grep 3000

# Check logs
journalctl -u your-service-name
```
