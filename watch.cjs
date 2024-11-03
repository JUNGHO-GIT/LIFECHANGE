const fs = require('fs');

// 파일을 실시간으로 감시하고 변경사항을 출력하는 함수
const watchFileAndDisplay = (filePath) => {
  fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      const updatedContent = fs.readFileSync(filePath, 'utf8');
      console.clear(); // 이전 내용을 지워서 깔끔하게 출력
      console.log(`\n\n===== ${filePath} Updated =====`);
      console.log(updatedContent);
    }
  });
  console.log(`Watching ${filePath} for changes...`);
};

// 감시할 파일 경로
watchFileAndDisplay('.env');
watchFileAndDisplay('index.ts');
