/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
let fs = require('fs'), path = require('path');
const basePath = '../examples/';

const getFile = (filename) => {

  const file = getBase(filename);
  const lines = file.split('\n');

  const filtered = lines.filter(line => {
    return line.includes('*')
  });

  const sliced = filtered.slice(1, -1);

  const transformed = sliced.map((item, index) => index === 0 ? '###' + item.replace('*', '') + '\n' : item.replace('*', ''))

  return transformed.join('\n');
}

const getBase = (filename) => fs.readFileSync(path.join(__dirname, filename), {encoding: 'utf-8'});

fs.readdir('../examples', (err, files) => {

  let res = getBase('mdxHeader.txt');
  if (err) console.log(err)
  else {
    files.forEach(file => {
      if (file !== 'index.ts') {
        res += '\n\n';
        res += getFile(basePath + file + '/index.tsx');
      }
    });
  }

  fs.writeFile(`Table.stories.mdx`, res, (err) => {
    if (err) console.log(err);
    console.log(`Successfully Written to Table.stories.mdx`);
  });


});
