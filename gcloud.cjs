const dotenv = require('dotenv');
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const moment = require('moment-timezone');
const os = require('os');
const fs = require('fs');

// -------------------------------------------------------------------------------------------------
// env 파일 수정하기
const modifyEnv = () => {
  const envFile = readFileSync('.env', 'utf8');
  const envConfig = dotenv.parse(envFile);

  // envConfig 수정s
  envConfig.CLIENT_URL = "https://www.junghomun.com";
  envConfig.GOOGLE_CALLBACK_URL = "https://www.junghomun.com/api/google/callback";

  // env 파일 쓰기
  const newEnvFile = Object.keys(envConfig).reduce((acc, key) => {
    return `${acc}${key}=${envConfig[key]}${os.EOL}`;
  }, '');

  writeFileSync('.env', newEnvFile);
};

// -------------------------------------------------------------------------------------------------
// modify changelog
const modifyChangelog = () => {

  const currentDate = moment().tz("Asia/Seoul").format('YYYY-MM-DD');
  const currentTime = moment().tz("Asia/Seoul").format('HH:mm:ss');

  const changelog = fs.readFileSync('changelog.md', 'utf8');
  const versionPattern = /\d+\.\d+\.\d+/g;
  const matches = [...changelog.matchAll(versionPattern)];
  const lastMatch = matches[matches.length - 1];
  const versionArray = lastMatch[0].match(/\d+/g) || [];

  if (matches.length === 0) {
    throw new Error('버전 형식을 찾을 수 없습니다.');
  }

  if (versionArray.length < 3) {
    throw new Error('버전 형식이 잘못되었습니다. 세 자리 숫자가 필요합니다.');
  }

  // 세 번째 숫자에 +1
  versionArray[2] = (parseFloat(versionArray[2]) + 1).toString();

  const newVersion = `\\[ ${versionArray.join('.')} \\]`;
  const newDateTime = `- ${currentDate} (${currentTime})`;
  const newEntry = `\n## ${newVersion}\n\t${newDateTime}\n\n`;

  const updatedChangelog = changelog + newEntry;

  fs.writeFileSync('changelog.md', updatedChangelog, 'utf8');
};

// -------------------------------------------------------------------------------------------------
// git push
const gitPush = () => {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "update"', { stdio: 'inherit' });
  execSync('git push origin master', { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
// run script on server
const runRemoteScript = () => {
  const command = 'powershell -Command "ssh -i C:\\Users\\jungh\\.ssh\\JKEY junghomun00@34.23.233.23 \'sudo sh /sh/server.sh\'"';
  execSync(command, { stdio: 'inherit' });
};

// -------------------------------------------------------------------------------------------------
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

// -------------------------------------------------------------------------------------------------
modifyEnv();
modifyChangelog();
gitPush();
runRemoteScript();
restoreEnv();