const path = require('path');
const { readdir } = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');

(async function mergeStyles() {
  try {
    const writeStream = createWriteStream(
      path.join(__dirname, 'project-dist/bundle.css'),
    );
    const styleFiles = await readdir(path.join(__dirname, 'styles'));
    for (const styleFile of styleFiles) {
      const pathToFile = path.join(__dirname, 'styles', styleFile);
      const fileName = path.basename(pathToFile);
      if (path.extname(pathToFile) === '.css') {
        const readStream = createReadStream(
          path.join(__dirname, 'styles', fileName),
        );
        readStream.on('data', (data) => {
          writeStream.write(data.toString() + '\n');
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
