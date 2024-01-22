const path = require('path');
const { readdir, stat } = require('fs/promises');

(async function readFiles() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const fileName = path.basename(filePath);
        const extName = path.extname(filePath);
        const fileSize = await stat(filePath);
        console.log(
          `${fileName.replace(extName, '')}-${extName.replace('.', '')}-${
            fileSize.size
          }байт`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
