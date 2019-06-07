const fs = require('fs');
const path = require('path');

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
      readDir(localBase, level + 1);
    } else {

      //Нашли файл
      //Получаем первую букву файла
      let dirName = item[0].toLowerCase();

      // Получаем папку
      let resultBase = path.join(resultDir, dirName);
      if (!fs.existsSync(`./${resultBase}`)) {
        fs.mkdirSync(`./${resultBase}`);
      }

      //Копируем туда файл
      let resultFile = path.join(resultBase, item);
      try {
        fs.linkSync(localBase, resultFile);
      } catch (err) {
        console.log('Error copy file!');
      }

      //Удаляем исходный файл
      try {
        fs.unlinkSync(localBase);
      } catch (err) {
        console.log('Error delete file!');
      }
    }
  });

  //Удалить папку
  fs.rmdir(base, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Delete done!');
  });
};

readDir(base, 0);
