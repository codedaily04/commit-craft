import simpleGit from 'simple-git'

const git = simpleGit()

export async function getStagedDiff(): Promise<string> {
  const diff = await git.diff(['--staged'])
  return diff
}