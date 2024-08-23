#!/bin/bash
set -e

# cd
cd /var/www/JPAGE/client
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
  exit $status
fi

# rm
rm -rf build.tar.gz
status=$?
if [ $status -eq 0 ]; then
  echo "rm build : success"
else
  echo "rm build : fail"
  exit $status
fi

# wget
wget https://storage.googleapis.com/jungho-bucket/JPAGE/SERVER/build.tar.gz
status=$?
if [ $status -eq 0 ]; then
  echo "wget : success"
else
  echo "wget : fail"
  exit $status
fi

# tar
tar -zxvf build.tar.gz
status=$?
if [ $status -eq 0 ]; then
  echo "tar -zxvf : success"
else
  echo "tar -zxvf : fail"
  exit $status
fi

# rm
rm -rf build.tar.gz
status=$?
if [ $status -eq 0 ]; then
  echo "rm : success"
else
  echo "rm : fail"
  exit $status
fi

# httpd restart
sudo systemctl restart nginx
status=$?
if [ $status -eq 0 ]; then
  echo "nginx restart : success"
else
  echo "nginx restart : fail"
  exit $status
fi