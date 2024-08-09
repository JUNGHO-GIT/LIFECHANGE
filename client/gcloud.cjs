// gcloud.cjs

const { execSync } = require('child_process');

// -------------------------------------------------------------------------------------------------
// build project
const buildProject = () => {
  const command = 'npm run build';
  execSync(command, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
// delete build.tar.gz
const deleteBuildTar = () => {
  const command = 'del build.tar.gz';
  execSync(command, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
// compress build folder
const compressBuild = () => {
  const command = 'tar -zcvf build.tar.gz build';
  execSync(command, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
// upload to gcloud
const uploadToGCS = () => {
  const commandRm = 'gsutil rm gs://jungho-bucket/JPAGE/SERVER/build.tar.gz';
  const commandCp = 'gsutil cp build.tar.gz gs://jungho-bucket/JPAGE/SERVER/build.tar.gz';
  execSync(commandRm, { stdio: 'inherit' });
  execSync(commandCp, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
// run script on server
const runRemoteScript = () => {
  const command = 'powershell -Command "ssh -i C:\\Users\\jungh\\.ssh\\JKEY junghomun00@34.23.233.23 \'sudo sh /sh/client.sh\'"';
  execSync(command, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
buildProject();
deleteBuildTar();
compressBuild();
uploadToGCS();
deleteBuildTar();
runRemoteScript();