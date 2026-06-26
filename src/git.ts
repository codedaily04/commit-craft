import simpleGit from 'simple-git'

const git = simpleGit()

export async function getStagedDiff(): Promise<string> {
  const diff = await git.diff(['--staged'])
  return diff
}

export async function getCommitLog(base: string = 'main'): Promise<string> {
  const log = await git.log([`${base}..HEAD`])
  
  return log.all
    .map(commit => `${commit.hash.slice(0, 7)} ${commit.message}`)
    .join('\n')
}