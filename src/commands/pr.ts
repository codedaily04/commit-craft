import { getCommitLog } from '../git'
import { generatePRDescription } from '../ai'

export async function prCommand(base: string = 'main') {
  let log : string

  try{
    log = await getCommitLog(base);
  }
  catch(error){
    console.error('Failed to get commits');
    process.exit(1);
  }

  if(!log){
    console.log(`No commits found ahead of ${base}. Make some commits first.`)
    return
  }
  console.log('Commits found:\n')
  console.log(log)


  let description:string
  try {
  process.stdout.write('\nGenerating PR description...')
  description = await generatePRDescription(log)
  process.stdout.write(' done!\n')
}
  catch(error){
    console.error('No commits were found');
    process.exit(1);
  }
  

  console.log('\n' + '─'.repeat(50))
  console.log(description)
  console.log('─'.repeat(50))
  console.log('\n Copy the above into your GitHub PR!')
}