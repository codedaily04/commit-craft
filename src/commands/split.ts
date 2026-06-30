import inquirer from 'inquirer'
import simpleGit from 'simple-git'
import { getStagedDiff } from '../git'
import { generateSplitCommits } from '../ai'

const git = simpleGit()

export async function splitCommand() {

  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    console.error('Not a git repository. Run git init first.')
    process.exit(1)
  }

  let diff : string

  try {
    diff=await getStagedDiff();
  } catch (error) {
    console.error('Failed to get staged diff',error)
    process.exit(1)
  }

  if(!diff){
    console.log('No staged changes');
    process.exit(0);
  }

  let commits: {message:string,files:string[]}[]
  try {
    process.stdout.write('Analyzing diff and splitting into commits...')
    commits = await generateSplitCommits(diff)
    process.stdout.write(' done!\n')
  } catch (error) {
    console.error('Failed to generate commits',error)
    process.exit(1)
  }

  if (commits.length === 0) {
    console.log('AI returned no commits. Try again.')
    process.exit(1)
  }
//validating the files if it exist in the system or not
  const stagedFiles = await git.diff(['--staged', '--name-only'])
  const stagedFileList = stagedFiles.trim().split('\n')

  for (const commit of commits) {
    const invalidFiles = commit.files.filter(f => !stagedFileList.includes(f))
    if (invalidFiles.length > 0) {
      console.error(`AI returned files that are not staged: ${invalidFiles.join(', ')}`)
      console.error('Try running commit-craft split again.')
      process.exit(1)
    }
  }


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
  try {
    await git.reset(['HEAD'])
  } catch (err) {
    console.error(' Failed to unstage changes:', err)
    process.exit(1)
  }

  // commit each group
  for (const commit of commits) {
    try {
      await git.add(commit.files)
      await git.commit(commit.message)
      console.log(`${commit.message}`)
    } catch (err) {
      console.error(`\n Failed on commit: "${commit.message}"`)
      console.error('Your changes may be partially committed. Run git status to check.')
      process.exit(1)
    }
  }

  console.log('\nAll commits done!')
}