// logTime.cjs

const { exec } = require('child_process');

const commandMap = {
  'start-react': 'react-scripts start',
  'start-craco': 'cross-env GENERATE_SOURCEMAP=false craco start',
  'build-react': 'react-scripts build',
  'build-craco': 'cross-env GENERATE_SOURCEMAP=false craco build'
};

// 'start-react', 'start-craco', 'build-react', 'build-craco'
const commandKey = process.argv[2];
const command = commandMap[commandKey];

if (!command) {
  console.error('Invalid command');
  process.exit(1);
}

const start = Date.now();
const child = exec(command);

child.stdout.on('data', (data) => {
  console.log(data);

  // 감지하는 메시지를 수정할 수 있습니다
  if (commandKey.startsWith('start') && data.includes('Starting the development server')) {
    const end = Date.now();
    const time = (end - start) / 1000;
    console.log(`Command '${commandKey}' started in ${time} seconds`);
  }
});

child?.stderr.on('data', (data) => {
  console.error(data);
});

child.on('close', (code) => {
  if (!commandKey.startsWith('start')) {
    const end = Date.now();
    const time = (end - start) / 1000;
    console.log(`Command '${commandKey}' completed in ${time} seconds`);
  }
  process.exit(code);
});
