#!/bin/bash
set -e

# cd
cd /var/www/junghomun.com/JPAGE/server
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
  exit $status
fi

# git fetch
git fetch --all && git reset --hard origin/master
status=$?
if [ $status -eq 0 ]; then
  echo "fetch : success"
else
  echo "fetch : fail"
  exit $status
fi

# npm install
npm install
status=$?
if [ $status -eq 0 ]; then
  echo "npm install : success"
else
  echo "npm install : fail"
  exit $status
fi

# pm2 restart
pm2 restart all
pm2 save
status=$?
if [ $status -eq 0 ]; then
  echo "pm restart : success"
else
  echo "pm restart : fail"
  exit $status
fi
