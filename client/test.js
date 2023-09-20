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
    // await execAsync('npm run build ', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error: ${error}`);
    //         console.error(`build error`);
    //         return;
    //     }
        
    //     console.log('buid success')
    // });
      
    const gitAddRes = await  execAsync('cd .. && git add .');
      console.log(gitAddRes)

    const gitCommitRes = await  execAsync(`git commit -m '${commitName}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`git commit fail`);
          return;
        }
      
        console.log('git commit successfully')
      });
      
    // await  execAsync(`git push`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`exec error: ${error}`);
    //       console.error(`git push fail`);
    //       return;
    //     }
      
    //     console.log('git push successfully')
    //   });
      
      console.log('success')
}

// start()
start().then(() => {
    console.log('All commands completed');
  }).catch((error) => {
    console.error(`Error: ${error}`);
  });
  
  
  
  
  
