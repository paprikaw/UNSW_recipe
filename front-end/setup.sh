#!/bin/bash
VERSION=v16.15.1
DISTRO=linux-x64
currentver="$(node --version | egrep -o '[0-9]*\.[0-9]*\.[0-9]')"
requiredver="16.10.0"

if [ "$(printf '%s\n' "$requiredver" "$currentver" | sort -V | head -n1)" = "$requiredver" ]; then 
       echo "You have the right version of node, no need to install again"
       exit 0
fi

sudo mkdir -p /usr/local/lib/nodejs
sudo cd /usr/local/lib/nodejs
sudo wget https://nodejs.org/dist/v16.15.1/node-v16.15.1-linux-x64.tar.xz .
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
rm -f node-$VERSION-$DISTRO.tar.xz

echo '#Nodejs' >> ~/.bashrc
echo "VERSION=$VERSION" >> ~/.bashrc
echo "DISTRO=$DISTRO" >> ~/.bashrc
echo "export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH" >> ~/.bashrc

echo '#Nodejs' >> ~/.profile
echo "VERSION=$VERSION" >> ~/.profile
echo "DISTRO=$DISTRO" >> ~/.profile
echo "export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH" >> ~/.profile

. ~/.profile
sudo -E env "PATH=$PATH" corepack enable
echo 'done, please restart the shell'
