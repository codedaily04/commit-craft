import 'dotenv/config'
import inquirer from 'inquirer'
import simpleGit from 'simple-git'
import { getStagedDiff } from '../git'
import { generateSplitCommits } from '../ai'

const git = simpleGit()

export async function splitCommand() {
  const diff = await getStagedDiff()

  if (!diff) {
    console.log('No staged changes found. Run git add first.')
    return
  }

  process.stdout.write('Analyzing diff and splitting into commits...')
  const commits = await generateSplitCommits(diff)
  process.stdout.write(' done!\n')

  console.log(`\nFound ${commits.length} logical commits:\n`)
  commits.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.message}`)
    c.files.forEach(f => console.log(`     - ${f}`))
  })

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '\nProceed with these commits?',
      default: true,
    },
  ])

  if (!confirm) {
    console.log('Aborted.')
    return
  }

  // unstage everything first
  await git.reset(['HEAD'])

  for (const commit of commits) {
    await git.add(commit.files)
    await git.commit(commit.message)
    console.log(`✅ ${commit.message}`)
  }

  console.log('\nAll commits done!')
}