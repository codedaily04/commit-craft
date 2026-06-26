import 'dotenv/config'
import { getStagedDiff } from '../git'
import { generateCommitMessage } from '../ai'

export async function commitCommand() {
  const diff = await getStagedDiff()

  if (!diff) {
    console.log('No staged changes found. Run git add first.')
    return
  }

  console.log('Generating commit message...')
  const message = await generateCommitMessage(diff)

  console.log('\nSuggested commit message:')
  console.log(`\n  ${message}\n`)
}