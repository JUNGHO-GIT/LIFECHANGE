#!/bin/bash

# MongoDB 백업
mongo_backup() {
  PROJECT_NAME=$1
  MONGO_AUTH_DB=$2

  MONGO_USER="eric4757"
  MONGO_PASSWORD="M7m7m7m7m7m7!"
  MONGO_HOST="104.196.212.101:27017"

  TIMESTAMP=$(date +%F-%H-%M)
  BUCKET_NAME="jungho-bucket"
  BACKUP_DIR="/backup/${PROJECT_NAME}"
  BACKUP_PATH="${BACKUP_DIR}/${PROJECT_NAME}_mongo_backup_${TIMESTAMP}"

  # 백업 디렉토리 생성
  mkdir -p $BACKUP_DIR

  # MongoDB 백업 수행
  mongodump --host $MONGO_HOST --username $MONGO_USER --password $MONGO_PASSWORD --authenticationDatabase $MONGO_AUTH_DB --out $BACKUP_PATH

  # 백업 파일 업로드
  gsutil cp -r $BACKUP_PATH gs://$BUCKET_NAME/${PROJECT_NAME}/BACKUP/${PROJECT_NAME}_mongo_backup_${TIMESTAMP}

  echo "${PROJECT_NAME} Backup and upload completed at ${TIMESTAMP}"
}

# JPAGE 백업
mongo_backup "JPAGE" "LIFECHANGE"

# PAJUKAESONG 백업
mongo_backup "PAJUKAESONG" "PAJUKAESONG"
