#install Nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

npm install -g pm2
pm2 update

#!/usr/bin/env bash
sudo rm -rf /home/ec2-user/server