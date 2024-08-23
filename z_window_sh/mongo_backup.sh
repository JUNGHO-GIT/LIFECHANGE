#!/bin/bash

# MongoDB 백업
TIMESTAMP=$(date +%F-%H-%M)
BACKUP_DIR="/backup"
BACKUP_PATH="${BACKUP_DIR}/mongo_backup_${TIMESTAMP}"

# MongoDB 사용자 정보
MONGO_USER="eric4757"
MONGO_PASSWORD="M7m7m7m7m7!"
MONGO_HOST="34.23.233.23:27017"
MONGO_AUTH_DB="LIFECHANGE"

# MongoDB 백업 수행
mongodump --host $MONGO_HOST --username $MONGO_USER --password $MONGO_PASSWORD --authenticationDatabase $MONGO_AUTH_DB --out $BACKUP_PATH

# 백업 파일 업로드
gsutil cp -r $BACKUP_PATH gs://jungho-bucket/JPAGE/DB/mongo_backup_${TIMESTAMP}

echo "Backup and upload completed at ${TIMESTAMP}"
