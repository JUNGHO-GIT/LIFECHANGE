#!/bin/bash
set -e

# cd
cd ~/Work/JPAGE/client
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
  exit $status
fi

# build
npm run build
status=$?
if [ $status -eq 0 ]; then
  echo "build : success"
else
  echo "build : fail"
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

# tar
tar -zcvf build.tar.gz build
status=$?
if [ $status -eq 0 ]; then
  echo "tar : success"
else
  echo "tar : fail"
  exit $status
fi

# gsutil cp
gsutil cp build.tar.gz gs://jungho-bucket/JPAGE/SERVER/build.tar.gz
status=$?
if [ $status -eq 0 ]; then
  echo "gsutil cp : success"
else
  echo "gsutil cp : fail"
  exit $status
fi

# enter cloud
ssh -i ~/ssh/jungho123 jungho123@34.23.233.23 "sudo sh /client.sh"
status=$?
if [ $status -eq 0 ]; then
  echo "gsutil : success"
else
  echo "gsutil : fail"
  exit $status
fi