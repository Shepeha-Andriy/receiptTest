// import { exec } from 'child_process';
const exec = require('child_process')

const serverName = process.argv[2];
let nameOfRestartServer;
let processName;
let folderName;

switch (serverName) {
  default:
    console.log('server name does not exist');

    // process.exit(1);
}

const cmd = `npm run build && cd .. && git add . && git commit -m '${serverName}' && git push`;

exec.exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log('server restarted');
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});