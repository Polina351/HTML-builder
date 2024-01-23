const fs = require('fs');
const path = require('path');
const { readdir, copyFile } = require('fs/promises');

(async function copyDir() {
  await fs.promises.rm(path.join(__dirname, 'files-copy'), {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true,
  });
  const files = await readdir(path.join(__dirname, 'files'));

  for (const file of files) {
    const filePath = path.join(__dirname, 'files', file);
    await copyFile(filePath, path.join(__dirname, 'files-copy', file));
    console.log(file);
  }
})();
