/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
let fs = require('fs'), path = require('path');
const basePath = '../examples/';

const getFile = (filename) => {

  const file = getBase(filename);
  const lines = file.split('\n');

  const filtered = lines.filter(line => {
    return !line.startsWith('import')
  });

  return filtered.join('\n');
}

const getBase = (filename) => fs.readFileSync(path.join(__dirname, filename), {encoding: 'utf-8'});

fs.readdir('../examples', (err, files) => {

  let res = getBase('storyHeader.txt');
  res += '\n';
  if (err) console.log(err)
  else {
    files.forEach(file => {
      if (file !== 'index.ts') {
        res += getFile(basePath + file + '/index.tsx');
        res += `\n${file}.storyName = 'Таблица ${file}';\n\n`;
      }
    });
  }

  fs.writeFile('Table.stories.tsx', res, (err) => {
    if (err) console.log(err);
    console.log('Successfully Written to File.');
  });

});
