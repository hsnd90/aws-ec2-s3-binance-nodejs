cd /home/ec2-user || exit
sudo dnf upgrade -y
yes y | sudo dnf install nodejs git
git clone https://github.com/hsnd90/aws-ec2-s3-binance-nodejs.git
sudo chown -R ec2-user:ec2-user /home/ec2-user/aws-ec2-s3-binance-nodejs
cd aws-ec2-s3-binance-nodejs || exit
npm install
NODE_ENV=prod node index.js
