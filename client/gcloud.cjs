// gcloud.cjs

const { execSync } = require('child_process');
const os = require('os');

const winOrLinux = os.platform() === 'win32' ? "win" : "linux";
console.log(`Client gcloud.cjs is activate. Activated os is : "${winOrLinux}"`);

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
  const command = 'gcloud storage cp build.tar.gz gs://jungho-bucket/JPAGE/SERVER/build.tar.gz';
  execSync(command, { stdio: 'inherit' });
};

// 기존 build.tar.gz 삭제 --------------------------------------------------------------------------
const deleteBuildTar = () => {
  const del = winOrLinux === "win" ? "del" : "rm -rf";
  const command = `${del} build.tar.gz`
  execSync(command, { stdio: 'inherit' });
};

// 원격 서버에서 스크립트 실행 ---------------------------------------------------------------------
const runRemoteScript = () => {
  const keyPath = winOrLinux === "win" ? "C:\\Users\\jungh\\.ssh\\JKEY" : "~/ssh/JKEY";
  const serviceId = winOrLinux === "win" ? 'junghomun00' : 'junghomun1234';
  const ipAddr = "34.23.233.23";
  const cmdCd = 'cd /var/www/junghomun.com/JPAGE/client';
  const cmdGs = 'sudo gcloud storage cp gs://jungho-bucket/JPAGE/SERVER/build.tar.gz .';
  const cmdTar = 'sudo tar -zvxf build.tar.gz --strip-components=1';
  const cmdRm = 'sudo rm build.tar.gz';
  const cmdRestart = 'sudo systemctl restart nginx';

  const sshCommand = `
    ssh -i ${keyPath} ${serviceId}@${ipAddr} \'${cmdCd} && ${cmdGs} && ${cmdTar} && ${cmdRm} && ${cmdRestart}\'
  `;

  const activateCommand
    = winOrLinux === "win" ? `powershell -Command "${sshCommand}"` : `${sshCommand}`;

  execSync(activateCommand, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
buildProject();
compressBuild();
uploadToGCS();
deleteBuildTar();
runRemoteScript();