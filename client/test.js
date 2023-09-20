// import { exec } from 'child_process';
const exec = require('child_process')

const serverName = process.argv[2];

const cmd = `cd .. && git add . && git commit -m '${serverName}' && git push`;

exec.exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  console.log('end successfully')
});