const fs = require('fs');
const path = require('path');

// const base = './sortFile';
const base = './src';
const resultDir = './result';

// Создаем итоговую папку
if (!fs.existsSync(`./${resultDir}`)) {
    fs.mkdirSync(`./${resultDir}`);
}

const readDir = (base, level) => {
  const files = fs.readdirSync(base);

  files.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);

    if (state.isDirectory()) {
      console.log(' '.repeat(level) + 'DIR: ' + item);
      readDir(localBase, level + 1);
    } else {

        //нашли файл
        //Получаем первую букву файла
        let dirName = item[0].toLowerCase();

        // Получаем папку
        let resultBase = path.join(resultDir, dirName);
        if (!fs.existsSync(`./${resultBase}`)) {
            fs.mkdirSync(`./${resultBase}`);
        }

        //Копируем туда файл
        let resultFile = path.join(resultBase, item);

        fs.link(localBase, resultFile, err => {
            if (err) {
              console.error(err.message);
              return;
            }
        });

      //console.log(' '.repeat(level) + 'File: ' + item);
    }
  })
}

readDir(base, 0);
