// gcloud.cjs

const { execSync } = require('child_process');

// run script on server
const runRemoteScript = () => {
  const command = 'powershell -Command "ssh -i C:\\Users\\jungh\\.ssh\\JKEY junghomun00@34.23.233.23 \'sudo sh /server.sh\'"';
  execSync(command, { stdio: 'inherit' });
};

// execute all steps
runRemoteScript();