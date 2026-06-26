#!/usr/bin/env node

import { Command } from 'commander'
import { commitCommand } from './commands/commit'
import { splitCommand } from './commands/split'
import { prCommand } from './commands/pr'

const program = new Command()

program
  .name('commit-craft')
  .description('AI-powered git commit messages')
  .version('0.1.0')

program
  .command('commit')
  .description('Generate a commit message from staged changes')
  .action(async () => {
    await commitCommand()
  })

program
  .command('split')
  .description('Split staged changes into multiple commits')
  .action(async () => {
    await splitCommand()
  })

program
  .command('pr')
  .description('Generate a PR description from commit history')
  .option('-b, --base <branch>', 'base branch to compare against', 'main')
  .action(async (options) => {
    await prCommand(options.base)
  })

program.parse()