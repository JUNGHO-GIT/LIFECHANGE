// gcloud.cjs

const { execSync } = require('child_process');

// update env file
const updateEnvFile = (url) => {
  const date = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const command = `powershell -Command "(Get-Content .env) -replace '^(REACT_APP_URL = .*)', ('# Updated on ${date}' + [System.Environment]::NewLine + 'REACT_APP_URL = ${url}') | Set-Content .env"`;
  execSync(command, { stdio: 'inherit' });
};

// build project
const buildProject = () => {
  const command = 'react-scripts build';
  execSync(command, { stdio: 'inherit' });
};

// delete build.tar.gz
const deleteBuildTar = () => {
  const command = 'del build.tar.gz';
  execSync(command, { stdio: 'inherit' });
};

// compress build folder
const compressBuild = () => {
  const command = 'tar -zcvf build.tar.gz build';
  execSync(command, { stdio: 'inherit' });
};

// upload to gcloud
const uploadToGCS = () => {
  const commandRm = 'gsutil rm gs://jungho-bucket/JPAGE/SERVER/build.tar.gz';
  const commandCp = 'gsutil cp build.tar.gz gs://jungho-bucket/JPAGE/SERVER/build.tar.gz';
  execSync(commandRm, { stdio: 'inherit' });
  execSync(commandCp, { stdio: 'inherit' });
};

// run script on server
const runRemoteScript = () => {
  const command = 'powershell -Command "ssh -i C:\\Users\\jungh\\.ssh\\JKEY junghomun00@34.23.233.23 \'sudo sh /client.sh\'"';
  execSync(command, { stdio: 'inherit' });
};

// execute all steps
updateEnvFile('https://www.junghomun.com');
buildProject();
deleteBuildTar();
compressBuild();
uploadToGCS();
updateEnvFile('http://localhost:4000');
deleteBuildTar();
runRemoteScript();