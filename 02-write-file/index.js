const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello! Please enter text!\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    output.write(data);
  }
});
process.on('exit', () => stdout.write('Good bye!'));
process.on('SIGINT', () => process.exit());
