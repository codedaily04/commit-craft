import inquirer from 'inquirer'
import simpleGit from 'simple-git'
import { getStagedDiff } from '../git'
import { generateCommitMessage } from '../ai'

const git=simpleGit();

export async function commitCommand() {

  const isRepoexist=await git.checkIsRepo()
  if(!isRepoexist){
    console.log('Not a git repository, create one !!');
    process.exit(1);
  }

  let diff:string
  try {
    diff=await getStagedDiff()
  } catch (error) {
    console.error('Error getting staged diff',error);
    process.exit(1);
  }


  if (!diff) {
    console.log('No staged changes found. Run git add first.')
    return
  }

  let message:string
  try {
    process.stdout.write('Generating commit message...')
    message = await generateCommitMessage(diff)
    process.stdout.write(' done!\n')
  } catch (error) {
    console.error('Error generating commit message',error);
    process.exit(1);
  }

  while(true){
    console.log('\nSuggested commit message:')
    console.log(`\n  ${message}\n`)

    const { action } = await inquirer.prompt([
      {
        type: 'select',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Accept', 'Edit', 'Regenerate', 'Bail'],
      },
    ])

   if (action === 'Accept') {
  try{
    await git.commit(message)
    console.log('Committed!')
  }catch(error){
    console.error('Error committing',error);
    process.exit(1);
  }

  const { shouldPush } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldPush',
      message: 'Do you want to push now?',
      default: false,
    },
  ])

  if (shouldPush) {
   try{ process.stdout.write('Pushing...')
    await git.push()
    process.stdout.write(' done!\n')
    console.log('Pushed to remote!')}
  catch(error){
    console.error('Error pushing',error);
    process.exit(1);
  }
}
  break
}

    if (action === 'Edit') {
      const { edited } = await inquirer.prompt([
        {
          type: 'input',
          name: 'edited',
          message: 'Edit the message:',
          default: message,
        },
      ])
      message = edited
    }

    if (action === 'Regenerate') 
      try{
      process.stdout.write('Regenerating...')
      message = await generateCommitMessage(diff,true)
      process.stdout.write(' done!\n')
    }catch(error){
      console.error('Error generating commit message',error);
    }
    
    if(action==='Bail'){
        console.log('Abort commit')
        process.exit(0)
    }
  }
}