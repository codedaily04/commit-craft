import 'dotenv/config'
import { getCommitLog } from '../git'
import { generatePRDescription } from '../ai'

export async function prCommand(base: string = 'main') {
  const log = await getCommitLog(base)

  if (!log) {
    console.log('No commits found ahead of main. Make some commits first.')
    return
  }

  console.log('Commits found:\n')
  console.log(log)

  process.stdout.write('\nGenerating PR description...')
  const description = await generatePRDescription(log)
  process.stdout.write(' done!\n')

  console.log('\n' + '─'.repeat(50))
  console.log(description)
  console.log('─'.repeat(50))
  console.log('\n Copy the above into your GitHub PR!')
}