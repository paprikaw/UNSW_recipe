#!/bin/bash
VERSION=v16.15.1
DISTRO=linux-x64
currentver="$(node --version | egrep -o '[0-9]*\.[0-9]*\.[0-9]')"
requiredver="16.10.0"

if [ "$(printf '%s\n' "$requiredver" "$currentver" | sort -V | head -n1)" = "$requiredver" ]; then 
       echo "all set"
       exit 0
fi

sudo mkdir -p /usr/local/lib/nodejs
cd /usr/local/lib/nodejs
wget https://nodejs.org/dist/$VERSION/node-$VERSION.pkg .
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
echo "export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH" >> ~/.profile
