// const exec = require('child_process')

// const commitName = process.argv[2];

// const cmd = `npm run build && cd .. && git add . && git commit -m '${commitName}' && git push`;

// exec.exec(cmd, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//     }

//     console.log('success')
// });

const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

const commitName = process.argv[2];

const start = async () => {
    const build = await execAsync('npm run build ');
    if (typeof build === 'string') {
        console.log(build)
    } else {
        console.log('build success')
    }
      
    const gitAddRes = await  execAsync('cd .. && git add .');
    if (typeof gitAddRes === 'string') {
        console.log(gitAddRes)
    } else {
        console.log('git add . success')
    }

    const gitCommitRes = await  execAsync(`git commit -m '${commitName}`);
    if (typeof gitCommitRes === 'string') {
        console.log(gitCommitRes)
    } else {
        console.log('git commit success')
    }
      
    const gitPushRes = await  execAsync(`git push`);
    if (typeof gitPushRes === 'string') {
        console.log(gitPushRes)
    } else {
        console.log('git push success')
    }
}

start().then(() => {
    console.log('All commands completed');
  }).catch((error) => {
    console.error(`Error: ${error}`);
  });
  
  
  
  
  
