#!/bin/bash
cd /var/www/brazil-trip
git pull
npm install
npm run build
pm2 restart brazil-trip
