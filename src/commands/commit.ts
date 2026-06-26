import 'dotenv/config'
import inquirer from 'inquirer'
import simpleGit from 'simple-git'
import { getStagedDiff } from '../git'
import { generateCommitMessage } from '../ai'

const git=simpleGit();

export async function commitCommand() {
  const diff = await getStagedDiff()

  if (!diff) {
    console.log('No staged changes found. Run git add first.')
    return
  }

  process.stdout.write('Generating commit message...')
  let message = await generateCommitMessage(diff)
  process.stdout.write('\r')

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
  await git.commit(message)
  console.log('✅ Committed!')

  const { shouldPush } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldPush',
      message: 'Do you want to push now?',
      default: false,
    },
  ])

  if (shouldPush) {
    process.stdout.write('Pushing...')
    await git.push()
    process.stdout.write(' done!\n')
    console.log('✅ Pushed to remote!')
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

    if (action === 'Regenerate') {
      console.log('Regenerating...')
      message = await generateCommitMessage(diff)
    }
    
    if(action==='Bail'){
        console.log('Abort commit')
        process.exit(0)
    }
  }
}