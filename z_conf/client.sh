#!/bin/bash
set -e

# cd
cd /var/www/html
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
  echo "rm : success"
else
  echo "rm : fail"
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
  echo "tar : success"
else
  echo "tar : fail"
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
sudo systemctl restart httpd
status=$?
if [ $status -eq 0 ]; then
  echo "httpd restart : success"
else
  echo "httpd restart : fail"
  exit $status
fi