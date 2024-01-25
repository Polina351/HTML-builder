const path = require('path');
const fs = require('fs');
const { readdir, mkdir, copyFile, writeFile } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

(function createDistDirectory() {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) throw err;
  });
})();

(async function copyDirectory() {
  try {
    const pathFrom = path.join(__dirname, 'assets');
    const pathTo = path.join(__dirname, 'project-dist', 'assets');

    const assets = await readdir(pathFrom, {
      withFileTypes: true,
    });
    for (const subAssets of assets) {
      const subAssetsFromPath = path.join(pathFrom, subAssets.name);
      const subAssetsToPath = path.join(pathTo, subAssets.name);

      await mkdir(subAssetsToPath, { recursive: true });

      const assetsFiles = await readdir(subAssetsFromPath, {
        withFileTypes: true,
      });
      for (const assetsFile of assetsFiles) {
        const pathFromFile = path.join(subAssetsFromPath, assetsFile.name);
        const pathToFile = path.join(subAssetsToPath, assetsFile.name);
        await copyFile(pathFromFile, pathToFile);
      }
    }
  } catch (err) {
    console.log(err);
  }
})();

(async function createHtmlFile() {
  try {
    const pathToIndexHtml = path.join(__dirname, 'project-dist', 'index.html'); //проверить пути
    const pathToComponents = path.join(__dirname, 'components');
    const pathToTemplates = path.join(__dirname, 'template.html');
    const readTemplateStream = fs.createReadStream(pathToTemplates, 'utf-8');

    readTemplateStream.on('data', async function (data) {
      const components = await readdir(pathToComponents, {
        withFileTypes: true,
      });
      for (const component of components) {
        const fileName = component.name;
        const filePath = path.join(pathToComponents, component.name);
        const fileExt = path.extname(filePath);
        if (fileExt === '.html') {
          const readComponentStream = fs.createReadStream(filePath, 'utf-8');
          readComponentStream.on('data', async function (component) {
            data = data.replaceAll(
              `{{${fileName.replace('.html', '')}}}`,
              component,
            );
            await writeFile(pathToIndexHtml, data, 'utf-8');
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
(async function createStylesFile() {
  try {
    const pathToStyles = path.join(__dirname, 'project-dist', 'style.css');
    const pathFromStyles = path.join(__dirname, 'styles');
    const writeStream = createWriteStream(path.join(pathToStyles));

    const styleFiles = await readdir(pathFromStyles, { withFileTypes: true });
    for (const styleFile of styleFiles) {
      const pathToFile = path.join(pathFromStyles, styleFile.name);
      const fileExt = path.extname(pathToFile);
      if (fileExt === '.css') {
        const readStream = createReadStream(pathToFile, 'utf-8');
        readStream.on('data', (data) => {
          writeStream.write(data + '\n');
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
