# CI/CD Pipeline Documentation

## Overview

The Magdalene project uses AWS CodeBuild and CodeDeploy for automated continuous integration and deployment. The pipeline automatically builds, tests, and deploys the application to EC2 instances.

## Pipeline Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Source    │    │    Build    │    │   Deploy    │    │   Monitor   │
│             │    │             │    │             │    │             │
│ Git Repository │──►│ CodeBuild   │──►│ CodeDeploy  │──►│ CloudWatch  │
│ (GitHub/    │    │ - npm install│    │ - EC2       │    │ - Logs      │
│  CodeCommit)│    │ - npm run   │    │ - Auto      │    │ - Metrics   │
│             │    │ - Artifacts │    │   Scaling   │    │ - Alarms    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Build Configuration

### BuildSpec File (`buildspec.yml`)

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

### Build Phases Explained

#### 1. Install Phase

- **Runtime**: Node.js version 20 (LTS)
- **Dependencies**: Install npm packages
- **Permissions**: Set executable permissions for nodemon
- **Validation**: Confirm successful installation

#### 2. Build Phase

- **Execution**: Run npm scripts
- **Compilation**: Process application files
- **Validation**: Confirm successful build

#### 3. Post-Build Phase

- **Logging**: Record build completion time
- **Cleanup**: Prepare artifacts for deployment
- **Notification**: Build status reporting

## Deployment Configuration

### AppSpec File (`appspec.yml`)

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

### Deployment Hooks

#### 1. BeforeInstall Hook (`server_clear.sh`)

```bash
#!/usr/bin/env bash

# Install Node.js using NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

# Install PM2 for process management
npm install -g pm2
pm2 update

# Clean up previous deployment
sudo rm -rf /home/ec2-user/server
```

**Purpose**: Environment preparation and cleanup

- Install Node.js runtime
- Set up process manager (PM2)
- Remove previous application version

#### 2. AfterInstall Hook (`fix_privileges.sh`)

```bash
#!/usr/bin/env bash
chmod +x /home/ec2-user/server/app.js
chmod +x /home/ec2-user/server/server_start.sh
chmod +x /home/ec2-user/server/server_stop.sh
```

**Purpose**: Set correct file permissions

- Make application files executable
- Ensure deployment scripts can run

#### 3. ApplicationStart Hook (`server_start.sh`)

```bash
#!/usr/bin/env bash
cd /home/ec2-user/server
chmod +x /home/ec2-user/server/node_modules/.bin/nodemon
sudo npm run
```

**Purpose**: Start the application

- Navigate to application directory
- Set nodemon permissions
- Start the Node.js application

#### 4. ApplicationStop Hook (`server_stop.sh`)

```bash
#!/bin/bash
# Placeholder for application stop commands
# sudo pkill -f 'node'
```

**Purpose**: Gracefully stop the application

- Currently minimal implementation
- Can be extended for proper process termination

## AWS Services Configuration

### 1. CodeBuild Project Setup

#### Project Configuration

```json
{
  "name": "magdalene-build",
  "source": {
    "type": "GITHUB",
    "location": "https://github.com/your-repo/magdalene.git",
    "buildspec": "buildspec.yml"
  },
  "environment": {
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/amazonlinux2-x86_64-standard:5.0",
    "computeType": "BUILD_GENERAL1_SMALL"
  },
  "serviceRole": "arn:aws:iam::account:role/CodeBuildServiceRole",
  "artifacts": {
    "type": "S3",
    "location": "magdalene-artifacts-bucket"
  }
}
```

#### Environment Variables

```bash
NODE_ENV=production
mongoURL=mongodb+srv://user:pass@cluster.mongodb.net/magdalene
```

### 2. CodeDeploy Application Setup

#### Application Configuration

```json
{
  "applicationName": "magdalene-app",
  "deploymentGroupName": "magdalene-deployment-group",
  "serviceRoleArn": "arn:aws:iam::account:role/CodeDeployServiceRole",
  "ec2TagFilters": [
    {
      "Type": "KEY_AND_VALUE",
      "Key": "Environment",
      "Value": "Production"
    }
  ],
  "deploymentConfigName": "CodeDeployDefault.EC2OneAtATime"
}
```

#### Deployment Strategies

- **OneAtATime**: Deploy to one instance at a time
- **HalfAtATime**: Deploy to half of instances simultaneously
- **AllAtOnce**: Deploy to all instances simultaneously

## IAM Roles and Policies

### 1. CodeBuild Service Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:GetObjectVersion", "s3:PutObject"],
      "Resource": "arn:aws:s3:::magdalene-artifacts-bucket/*"
    }
  ]
}
```

### 2. CodeDeploy Service Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateTags",
        "ec2:DescribeInstances",
        "autoscaling:*",
        "elasticloadbalancing:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. EC2 Instance Profile

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::magdalene-artifacts-bucket",
        "arn:aws:s3:::magdalene-artifacts-bucket/*"
      ]
    }
  ]
}
```

## Pipeline Triggers

### 1. Automatic Triggers

- **Git Push**: Trigger build on push to main branch
- **Pull Request**: Trigger build on PR creation
- **Scheduled**: Daily/weekly builds for maintenance

### 2. Manual Triggers

- **AWS Console**: Manual build/deployment initiation
- **CLI Commands**: AWS CLI triggered deployments
- **API Calls**: Programmatic pipeline execution

## Monitoring and Logging

### 1. CloudWatch Integration

```yaml
# CloudWatch Logs configuration
logs:
  - group: /aws/codebuild/magdalene-build
    stream: build-logs
  - group: /aws/codedeploy/magdalene-app
    stream: deployment-logs
```

### 2. Build Metrics

- **Build Duration**: Time taken for each build
- **Success Rate**: Percentage of successful builds
- **Failure Analysis**: Common failure patterns
- **Resource Usage**: CPU and memory consumption

### 3. Deployment Metrics

- **Deployment Duration**: Time for complete deployment
- **Success Rate**: Deployment success percentage
- **Rollback Frequency**: Number of rollbacks required
- **Instance Health**: Post-deployment health checks

## Error Handling and Rollback

### 1. Build Failures

```bash
# Common build failure scenarios
- Dependency installation failures
- Compilation errors
- Test failures (when implemented)
- Timeout issues
```

### 2. Deployment Failures

```bash
# Common deployment failure scenarios
- EC2 instance unavailability
- Permission issues
- Application startup failures
- Health check failures
```

### 3. Rollback Strategy

```yaml
# Automatic rollback configuration
autoRollbackConfiguration:
  enabled: true
  events:
    - DEPLOYMENT_FAILURE
    - DEPLOYMENT_STOP_ON_ALARM
    - DEPLOYMENT_STOP_ON_INSTANCE_FAILURE
```

## Pipeline Optimization

### 1. Build Optimization

- **Caching**: npm cache for faster builds
- **Parallel Processing**: Concurrent build steps
- **Artifact Optimization**: Smaller deployment packages
- **Build Environment**: Optimized container images

### 2. Deployment Optimization

- **Blue-Green Deployment**: Zero-downtime deployments
- **Health Checks**: Automated application health verification
- **Load Balancer Integration**: Traffic management during deployment
- **Database Migration**: Automated schema updates

## Security Best Practices

### 1. Secrets Management

- **AWS Secrets Manager**: Database credentials
- **Parameter Store**: Configuration values
- **Environment Variables**: Runtime configuration
- **IAM Roles**: Least privilege access

### 2. Code Security

- **Dependency Scanning**: Vulnerability detection
- **Static Code Analysis**: Security issue identification
- **Container Scanning**: Image vulnerability assessment
- **Access Controls**: Repository and pipeline permissions

## Troubleshooting

### 1. Common Build Issues

```bash
# Debug build failures
aws codebuild batch-get-builds --ids build-id
aws logs get-log-events --log-group-name /aws/codebuild/magdalene-build
```

### 2. Common Deployment Issues

```bash
# Debug deployment failures
aws deploy get-deployment --deployment-id deployment-id
aws deploy get-deployment-instance --deployment-id deployment-id --instance-id instance-id
```

### 3. Instance Debugging

```bash
# Check CodeDeploy agent status
sudo service codedeploy-agent status

# View deployment logs
sudo tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log
```

## Future Enhancements

### 1. Testing Integration

- **Unit Tests**: Automated test execution
- **Integration Tests**: API endpoint testing
- **Performance Tests**: Load testing integration
- **Security Tests**: Automated security scanning

### 2. Advanced Deployment

- **Multi-Environment**: Dev/Staging/Production pipelines
- **Feature Flags**: Gradual feature rollouts
- **Canary Deployments**: Risk-reduced deployments
- **Infrastructure as Code**: Terraform/CloudFormation integration
