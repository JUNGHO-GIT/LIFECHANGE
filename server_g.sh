#!/bin/bash
set -e

# cd
cd ~/Work/JPAGE
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
  exit $status
fi

# env 파일 수정하기
if [ -f ".env" ]; then
  cp .env .env.bak

  sed -i 's|^CLIENT_URL=.*|CLIENT_URL=https://www.junghomun.com|' .env
  sed -i 's|^GOOGLE_CALLBACK_URL=.*|GOOGLE_CALLBACK_URL=https://www.junghomun.com/api/google/callback|' .env

  echo ".env modification : success"
else
  echo ".env modification : .env file not found"
  exit 1
fi

# git push
git add .
git commit -m "update"
git push origin master
status=$?
if [ $status -eq 0 ]; then
  echo "git push : success"
else
  echo "git push : fail"
  exit $status
fi

# run script on server
ssh -i ~/.ssh/JKEY junghomun00@34.23.233.23 'sudo sh /server.sh'
status=$?
if [ $status -eq 0 ]; then
  echo "Remote script execution : success"
else
  echo "Remote script execution : fail"
  exit $status
fi

# env 파일 복구하기
if [ -f ".env.bak" ]; then
  mv .env.bak .env
  echo ".env restore : success"
else
  echo ".env restore : backup file not found"
  exit 1
fi
