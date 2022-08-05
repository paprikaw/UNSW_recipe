#!/bin/bash

# Declare some variable for the script
VERSION=v16.15.1 # Required version of yarn
DISTRO=linux-x64 # Distribution of our lubuntu
currentver="$(node --version | egrep -o '[0-9]*\.[0-9]*\.[0-9]')" # Generate the current version of node
requiredver="16.10.0" # Our required minimum version for running our frontend code

# If the current system already have correct version of nodes, script ends
if [ "$(printf '%s\n' "$requiredver" "$currentver" | sort -V | head -n1)" = "$requiredver" ]; then 
       echo "You have the right version of node, no need to install again"
       exit 0
fi


sudo mkdir -p /usr/local/lib/nodejs # create installation folder for nodejs
sudo cd /usr/local/lib/nodejs
sudo wget https://nodejs.org/dist/v16.15.1/node-v16.15.1-linux-x64.tar.xz . # Get the NodeJs package
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs # Decompression the package and paste to correnct position
rm -f node-$VERSION-$DISTRO.tar.xz 

# Set up environment variable in .bashrc
echo '#Nodejs' >> ~/.bashrc
echo "VERSION=$VERSION" >> ~/.bashrc
echo "DISTRO=$DISTRO" >> ~/.bashrc
echo "export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH" >> ~/.bashrc

# Set up environment variable in .profile
echo '#Nodejs' >> ~/.profile
echo "VERSION=$VERSION" >> ~/.profile
echo "DISTRO=$DISTRO" >> ~/.profile
echo "export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH" >> ~/.profile

# execute .profile and enable yarn
. ~/.profile
sudo -E env "PATH=$PATH" corepack enable
echo 'done, please restart the shell' # You will need to restart shell after installation completed