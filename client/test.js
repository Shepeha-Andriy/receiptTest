// import { exec } from 'child_process';
const exec = require('child_process')

const commitName = process.argv[2];

const cmd = `npm run build && cd .. && git add . && git commit -m '${commitName}' && git push`;

exec.exec('npm run build ', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    console.error(`build error`);
    return;
  }

  console.log('buid success')
});

exec.exec('cd .. && git add .', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    console.error(`git add . fail`);
    return;
  }

  console.log('git add . successfully')
});

exec.exec(`git commit -m '${commitName}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    console.error(`git commit fail`);
    return;
  }

  console.log('git commit successfully')
});

exec.exec(`git push`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    console.error(`git push fail`);
    return;
  }

  console.log('git push successfully')
});

console.log('success')