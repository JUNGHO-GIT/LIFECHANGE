const fs = require('fs');

(function watchFileAndDisplay() {
  const filePath = 'index.ts';
  let debounceTimeout;

  fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const updatedContent = fs.readFileSync(filePath, 'utf8');
        console.clear();

        const separator = '='.repeat(process.stdout.columns);
        const title = ` ${filePath} Updated `;
        const paddedTitle = title.padStart((separator.length + title.length) / 2, '=').padEnd(separator.length, '=');

        console.log(separator);
        console.log(paddedTitle);
        console.log(separator);
        console.log(updatedContent);
      }, 100);
    }
  });

  console.log(`Watching ${filePath} for changes...`);
})();
