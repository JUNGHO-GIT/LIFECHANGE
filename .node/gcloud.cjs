// server/gcloud.cjs

const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');
const { logger } = require(`./utils.cjs`);

// 인자 파싱 ------------------------------------------------------------------------------------
const TITLE = `gcloud.cjs`;
const winOrLinux = os.platform() === 'win32' ? `win` : `linux`;
const argv = process.argv.slice(2);
const args1 = argv.find(arg => [`--npm`, `--pnpm`, `--yarn`, `--bun`].includes(arg))?.replace(`--`, ``) || ``;
const args2 = argv.find(arg => [`--deploy`].includes(arg))?.replace(`--`, ``) || ``;

// 프로젝트 설정 -------------------------------------------------------------------------------
const CONFIG = {
	domain: `junghomun.com`,
	projectName: `LIFECHANGE`,
	serverIp: `104.196.212.101`,
	localPort: {
		client: 3000,
		server: 4001
	},
	gcs: {
		bucket: `jungho-bucket`,
		path: `LIFECHANGE/SERVER/build.tar.gz`
	},
	ssh: {
		win: {
			keyPath: `C:\\Users\\jungh\\.ssh\\JKEY`,
			serviceId: `junghomun00`
		},
		linux: {
			keyPath: `~/ssh/JKEY`,
			serviceId: `junghomun1234`
		}
	}
};

// git-push 명령어 실행 ---------------------------------------------------------------------------
const runGitPush = () => {
	logger(`info`, `git push 명령어 실행 시작`);
	const gitPushCmd = `bun .node/git.cjs --${args1} --push`;
	execSync(gitPushCmd, { stdio: 'inherit' });
	logger(`info`, `git push 명령어 실행 완료`);
}

// 원격 서버에서 스크립트 실행 ---------------------------------------------------------------------
const runRemoteScript = (winOrLinux=``) => {
	logger(`info`, `원격 서버 스크립트 실행 시작`);

	const keyPath = winOrLinux === `win` ? (
		CONFIG.ssh.win.keyPath
	) : (
		CONFIG.ssh.linux.keyPath
	);
	const serviceId = winOrLinux === `win` ? (
		CONFIG.ssh.win.serviceId
	) : (
		CONFIG.ssh.linux.serviceId
	);

	const ipAddr = CONFIG.serverIp;
	const serverPath = `/var/www/${CONFIG.domain}/${CONFIG.projectName}/server`;

	const cmdCd = `cd ${serverPath}`;
	const cmdGitFetch = `sudo git fetch --all`;
	const cmdGitReset = `sudo git reset --hard private/private/main`;
	const cmdRmClient = `sudo rm -rf client`;
	const cmdCh = `sudo chmod -R 755 ${serverPath}`;
	const cmdStop = `if pm2 describe ${CONFIG.projectName} >/dev/null 2>&1; then sudo pm2 stop ${CONFIG.projectName} && pm2 save; fi`;
	const cmdNpm = `sudo npm install`;
	const cmdStart = `sudo pm2 start ecosystem.config.cjs --env production && pm2 save`;
	const cmdSave = `sleep 5 && sudo pm2 save --force`;

	const sshCommand = winOrLinux === `win` ? (
		`powershell -Command "ssh -i ${keyPath} ${serviceId}@${ipAddr} '${cmdCd} && ${cmdGitFetch} && ${cmdGitReset} && ${cmdRmClient} && ${cmdCh} && ${cmdStop} && ${cmdNpm} && ${cmdStart} && ${cmdSave}'"`
	) : (
		`ssh -i ${keyPath} ${serviceId}@${ipAddr} '${cmdCd} && ${cmdGitFetch} && ${cmdGitReset} && ${cmdRmClient} && ${cmdCh} && ${cmdStop} && ${cmdNpm} && ${cmdStart} && ${cmdSave}'`
	);

	logger(`info`, `SSH 명령 실행 중...`);
	execSync(sshCommand, { stdio: 'inherit' });
	logger(`info`, `원격 서버 스크립트 실행 완료`);
};

// 실행 ---------------------------------------------------------------------------------------
(() => {
	logger(`info`, `스크립트 실행: ${TITLE}`);
	logger(`info`, `전달된 인자 1 : ${args1 || 'none'}`);
	logger(`info`, `전달된 인자 2 : ${args2 || 'none'}`);
	logger(`info`, `운영체제 : ${winOrLinux}`);

	try {
		runGitPush();
		runRemoteScript(winOrLinux);
		logger(`info`, `GCloud 배포 프로세스 완료`);
		process.exit(0);
	}
	catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		logger(`error`, `${TITLE} 스크립트 실행 실패: ${msg}`);
		process.exit(1);
	}
})();