const dotenv = require('dotenv');
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const os = require('os');

// env 파일 수정하기
const modifyEnv = () => {
  const envFile = readFileSync('.env', 'utf8');
  const envConfig = dotenv.parse(envFile);

  // envConfig 수정
  envConfig.CLIENT_URL = "https://www.junghomun.com";
  envConfig.GOOGLE_CALLBACK_URL = "https://www.junghomun.com/api/google/callback";

  // env 파일 쓰기
  const newEnvFile = Object.keys(envConfig).reduce((acc, key) => {
    return `${acc}${key}=${envConfig[key]}${os.EOL}`;
  }, '');

  writeFileSync('.env', newEnvFile);
};


// git push
const gitPush = () => {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "update"', { stdio: 'inherit' });
  execSync('git push origin master', { stdio: 'inherit' });
};

// run script on server
const runRemoteScript = () => {
  const command = 'powershell -Command "ssh -i C:\\Users\\jungh\\.ssh\\JKEY junghomun00@34.23.233.23 \'sudo sh /server.sh\'"';
  execSync(command, { stdio: 'inherit' });
};

// env 파일 복구하기
const restoreEnv = () => {
  const envFile = readFileSync('.env', 'utf8');
  const envConfig = dotenv.parse(envFile);

  // envConfig 수정
  envConfig.CLIENT_URL = "http://localhost:3000";
  envConfig.GOOGLE_CALLBACK_URL = "http://localhost:4000/api/google/callback";

  // env 파일 쓰기
  const newEnvFile = Object.keys(envConfig).reduce((acc, key) => {
    return `${acc}${key}=${envConfig[key]}${os.EOL}`;
  }, '');

  writeFileSync('.env', newEnvFile);
};

// execute all steps
modifyEnv();
gitPush();
runRemoteScript();
restoreEnv();
