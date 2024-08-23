#!/bin/bash
set -e

# cd
cd /var/www
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
  exit $status
fi

# mkdir
mkdir project
status=$?
if [ $status -eq 0 ]; then
  echo "mkdir : success"
else
  echo "mkdir : fail"
  exit $status
fi

# cd
cd project
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
  exit $status
fi

# git clone
git clone https://JUNGHO-GIT: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@github.com/JUNGHO-GIT/JPAGE.git
status=$?
if [ $status -eq 0 ]; then
  echo "git clone : success"
else
  echo "git clone : fail"
  exit $status
fi

# cd
cd JPAGE
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
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