// gcloud.cjs

const { execSync } = require('child_process');

// 프로젝트 빌드 -----------------------------------------------------------------------------------
const buildProject = () => {
  const commandBuild = 'npm run build';
  execSync(commandBuild, { stdio: 'inherit' });
};

// build 폴더 압축 ---------------------------------------------------------------------------------
const compressBuild = () => {
  const command = 'tar -zcvf build.tar.gz build';
  execSync(command, { stdio: 'inherit' });
};

// gcloud에 업로드 ---------------------------------------------------------------------------------
const uploadToGCS = () => {
  const command = 'gsutil cp build.tar.gz gs://jungho-bucket/JPAGE/SERVER/build.tar.gz';
  execSync(command, { stdio: 'inherit' });
};

// 기존 build.tar.gz 삭제 --------------------------------------------------------------------------
const deleteBuildTar = () => {
  const command = 'del build.tar.gz';
  execSync(command, { stdio: 'inherit' });
};

// 원격 서버에서 스크립트 실행 ---------------------------------------------------------------------
const runRemoteScript = () => {
  const privateKeyPath = 'C:\\Users\\jungh\\.ssh\\JKEY';
  const serverAddr = 'junghomun00@34.23.233.23';
  const cmdCd = 'cd /var/www/junghomun.com/JPAGE/client';
  const cmdGs = 'sudo gsutil cp gs://jungho-bucket/JPAGE/SERVER/build.tar.gz .';
  const cmdTar = 'sudo tar -zvxf build.tar.gz --strip-components=1';
  const cmdRm = 'sudo rm build.tar.gz';
  const cmdRestart = 'sudo systemctl restart nginx';

  const sshCommand =
    `powershell -Command "ssh -i ${privateKeyPath} ${serverAddr} \'${cmdCd} && ${cmdGs} && ${cmdTar} && ${cmdRm} && ${cmdRestart}\'"`;

  execSync(sshCommand, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
buildProject();
compressBuild();
uploadToGCS();
deleteBuildTar();
runRemoteScript();