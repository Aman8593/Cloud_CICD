
# Magdalene: Cloud based Super Car E-commerce Website

Magdalene is a AWS cloud based and React ecommerce platform. Built with React, modular and fully customizable.

## Architecture Diagram

![CloudAppFinal](https://github.com/Aman8593/Cloud_CICD/assets/104978692/cbcf7798-f56d-4956-af0a-50803ffe03ae)


## Deployment on EC2

To deploy this project on Elastic Compute Cloud follow the steps.

Note:  
Add an inbound traffic rule (Custom TCP) for allowing port 3000.


To install nodeJS run

```bash
  sudo su -
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
  . ~/.nvm/nvm.sh
  nvm install node
```
To confirm the installation run
```bash
  node -v
  npm -v
```

To update and install git run
```bash
  yum update -y
  yum install git -y
  git --version
```
Clone the repository:
```bash
  git clone https://github.com/Eamin05/CloudProject.git
  chmod +x /root/CloudProject/node_modules/.bin/nodemon
  cd CloudProject
  npm install
  npm start
```

The site will be visible once you copy and paste the "public_ip:3000".
## Deployment using CI / CD

Deploy this project using AWS services (CodeCommit, CodeBuild, CodeDeploy & CodePipeline).

Note:  
Create an Amazon S3 bucket to store the generated artifacts. For EC2 instance attach an IAM role to it with AmazonS3FullAccess & AWSCodeDeployFullAccess policies.

Steps:  

1] Create a repository in AWS CodeCommit and upload all the files of this project in that repository.

1. Create a Code Commit Repository
      
2. Copy the HTTPS URL from Clone URL
      
3. Configure AWS CLI and Download the Git Credentials from the IAM user   
```bash
aws configure
```

```bash
Fill the following details:
AWS Access Key ID [****]:
AWS Secret Access Key [****]:
Default region name [us-west-1]: us-west-2
Default output format [None]:(json,text)
```

4. Open Git bash
```bash
git clone <HTTPS URL of Code Commit Repo>
```
Give Username and Password of Git Credential
5. Check the Download folder or the Directory where you have cloned the URL You will see your folder is created.

6. Copy Paste your Application Code into that folder

7. Goto that folder directory
```bash
cd 'folder_name'
```

8. Check the git status
```bash
git status
```

9. Add alll files to staging area and push it to origin
```bash
git add .
git commit -m "First Commit"
git push origin master
```
10. Now open your Code Commit Repository you will see your files have been added.
      
      
  

2] For building the project using AWS CodeBuild follow the steps:

```bash
  Create Project -> Magdalene(Any project name will do) -> AWS CodeCommit (Source provider) ->
  Select repository, branch and commitID -> Use a buildspec file -> buildspec.yml -> Artifacts ->
  Amazon S3 (Type) -> Select a bucket and give name for the artifact folder -> Zip (Artifacts 
  packaging) -> Create build project
```
Contents of buildspec.yml file:
```bash
  # Do not change version. This is the version of aws buildspec, not the version of your buldspec file.
  version: 0.2

  phases:
    install:
      runtime-versions:
        nodejs: 20 
      commands:
        - chmod 777 node_modules/.bin/nodemon
        - npm install
        - echo "Installing npm successfull"
    build:
      commands:
        - npm run
        - echo "Compilation successfull"
    post_build:
      commands:
        - echo Build completed on `date`
  artifacts:
    files:
      - '**/*'
    discard-paths: yes
```
  3] For deployment of project using AWS CodeDeploy follow the steps:

```bash
  Create Application -> Magdalene(Any name will do) -> EC2/On-premises (Compute platform) ->
  Create deployment group -> Magdalene-DG (deployment group name) -> Attach role -> Amazon EC2 
  instances -> Install AWS CodeDeploy Agent = Never -> Disable load balancing -> Create
```

Note: For IAM role attach AmazonEC2FullAccess, AmazonS3FullAccess, & AWSCodeDeployRole policies to it. Also install CodeDeploy Agent on the EC2 instance with the following commands (make changes accoring to your region):


```bash
  install wget -y
  cd /home/ec2-user
  wget https://aws-codedeploy-ap-south-1.s3.ap-south-1.amazonaws.com/latest/install
  chmod +x ./install
  ./install auto
  systemctl start codedeploy-agent
  systemctl enable codedeploy-agent
  yum install -y httpd
  service httpd start
```

```bash
  Create deployment -> Copy and paste the Amazon S3 bucket where your artifacts is stored ->  Create
```

4] Using CodePipeline:
```bash
  Create pipeline -> Magdalene(Any name will do) -> Next -> 
  AWS CodeCommit (Source provider) -> Select repository & branch -> Next
  AWS CodeBuild (Build provider) -> Project name -> Next
  AWS CodeDeploy (Deploy provider) -> Select Application name & Deployment group -> Create
```
