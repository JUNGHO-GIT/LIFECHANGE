// gcloud.cjs

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const moment = require('moment-timezone');
const os = require('os');
const fs = require('fs');

const winOrLinux = os.platform() === 'win32' ? "win" : "linux";
console.log(`Activated OS is : ${winOrLinux}`);

// env 파일 및 index 파일 수정 ---------------------------------------------------------------------
const modifyEnvAndIndex = () => {
  try {
    const envFile = readFileSync('.env', 'utf8');
    const indexFile = readFileSync('index.ts', 'utf8');

    // 파일을 줄 단위로 나눔
    const linesEnv = envFile.split(/\r?\n/);
    const linesIndex = indexFile.split(/\r?\n/);

    const updatedEnv = linesEnv.map(line => {
      if (line.startsWith('CLIENT_URL=')) {
        return 'CLIENT_URL=https://www.junghomun.com/JPAGE';
      }
      // 다른 줄은 그대로 유지
      return line;
    });

    const updatedIndex = linesIndex.map(line => {
      if (line.startsWith(`// const db = process.env.DB_NAME`)) {
        return `const db = process.env.DB_NAME`;
      }
      if (line.startsWith(`const db = process.env.DB_TEST`)) {
        return `// const db = process.env.DB_TEST`;
      }
      // 다른 줄은 그대로 유지
      return line;
    });

    // 줄을 다시 합쳐서 저장
    const newEnvFile = updatedEnv.join(os.EOL);
    const newIndexFile = updatedIndex.join(os.EOL);

    writeFileSync('.env', newEnvFile);
    writeFileSync('index.ts', newIndexFile);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// changelog 수정 ----------------------------------------------------------------------------------
const modifyChangelog = () => {
  try {
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
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// git push ----------------------------------------------------------------------------------------
const gitPush = () => {
  try {
    const gitAdd = (
      'git add .'
    );
    const gitCommit = (
      winOrLinux === "win"
      ? 'git commit -m \"%date% %time:~0,8%\"'
      : 'git commit -m \"$(date +%Y-%m-%d) $(date +%H:%M:%S)\"'
    );
    const gitPush = (
      'git push origin master'
    );

    execSync(gitAdd, { stdio: 'inherit' });
    execSync(gitCommit, { stdio: 'inherit' });
    execSync(gitPush, { stdio: 'inherit' });
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// 원격 서버에서 스크립트 실행 ---------------------------------------------------------------------
const runRemoteScript = () => {
  try {
    const keyPath = (
      winOrLinux === "win"
      ? "C:\\Users\\jungh\\.ssh\\JKEY"
      : "~/ssh/JKEY"
    );

    const serviceId = (
      winOrLinux === "win"
      ? 'junghomun00'
      : 'junghomun1234'
    );

    const ipAddr = "34.23.233.23";
    const cmdCd = 'cd /var/www/junghomun.com/JPAGE/server';
    const cmdGitFetch = 'sudo git fetch --all';
    const cmdGitReset = 'sudo git reset --hard origin/master';
    const cmdRmClient = 'sudo rm -rf client';
    const cmdCh = 'sudo chmod -R 755 /var/www/junghomun.com/JPAGE/server';
    const cmdNpm = 'sudo npm install';
    const cmdRestart = 'sudo pm2 restart all';
    const cmdSave = 'sudo pm2 save';

    const winCommand = `powershell -Command "ssh -i ${keyPath} ${serviceId}@${ipAddr} \'${cmdCd} && ${cmdGitFetch} && ${cmdGitReset} && ${cmdRmClient} && ${cmdCh} && ${cmdNpm} && ${cmdRestart} && ${cmdSave}\'"
    `;
    const linuxCommand = `ssh -i ${keyPath} ${serviceId}@${ipAddr} \'${cmdCd} && ${cmdGitFetch} && ${cmdGitReset} && ${cmdRmClient} && ${cmdCh} && ${cmdNpm} && ${cmdRestart} && ${cmdSave}\'`;

    const sshCommand = winOrLinux === "win" ? winCommand : linuxCommand;

    execSync(sshCommand, { stdio: 'inherit' });
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// env 파일 및 index 파일 복원 --------------------------------------------------------------------
const restoreEnvAndIndex = () => {
  try {
    const envFile = readFileSync('.env', 'utf8');
    const indexFile = readFileSync('index.ts', 'utf8');

    // 파일을 줄 단위로 나눔
    const linesEnv = envFile.split(/\r?\n/);
    const linesIndex = indexFile.split(/\r?\n/);

    const updatedEnv = linesEnv.map(line => {
      if (line.startsWith('CLIENT_URL=')) {
        return 'CLIENT_URL=http://localhost:3000/JPAGE';
      }
      // 다른 줄은 그대로 유지
      return line;
    });

    const updatedIndex = linesIndex.map(line => {
      if (line.startsWith(`const db = process.env.DB_NAME`)) {
        return `// const db = process.env.DB_NAME`;
      }
      if (line.startsWith(`// const db = process.env.DB_TEST`)) {
        return `const db = process.env.DB_TEST`;
      }
      // 다른 줄은 그대로 유지
      return line;
    });

    // 줄을 다시 합쳐서 저장
    const newEnvFile = updatedEnv.join(os.EOL);
    const newIndexFile = updatedIndex.join(os.EOL);

    writeFileSync('.env', newEnvFile);
    writeFileSync('index.ts', newIndexFile);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// -------------------------------------------------------------------------------------------------
modifyEnvAndIndex();
modifyChangelog();
gitPush();
runRemoteScript();
restoreEnvAndIndex();
process.exit(0);