import Groq from 'groq-sdk'
import 'dotenv/config'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function generateCommitMessage(diff: string): Promise<string> {
  const prompt = `
You are an expert developer. Based on the git diff below, write a commit message 
following the Conventional Commits format.

Rules:
- Format: <type>: <short description>
- Types: feat, fix, chore, docs, refactor, test, style
- First line max 72 characters
- Be specific and clear
- Only return the commit message, nothing else

Git diff:
${diff}
`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No content returned from Groq API')
  }

  return content.trim()
}


//Making the Split-message feature for commit-craft 
export async function generateSplitCommits(diff: string): Promise<{ message: string, files: string[] }[]> {
  const prompt = `
You are an expert developer. Analyze the git diff below and split it into logical commits.

Rules:
- Group related changes together into one commit
- Each commit must follow Conventional Commits format: <type>: <short description>
- Types: feat, fix, chore, docs, refactor, test, style
- Return ONLY a JSON array, no explanation, no markdown, no backticks
- Each item must have "message" (string) and "files" (array of file paths)

Example output:
[
  { "message": "feat: add login endpoint", "files": ["src/auth.ts", "src/routes.ts"] },
  { "message": "chore: update dependencies", "files": ["package.json"] }
]

Git diff:
${diff}
`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No content returned from Groq API')
  }

  try {
    return JSON.parse(content.trim())
  } catch {
    throw new Error('AI returned invalid JSON. Try again.')
  }
}

// making the PR description generator 
export async function generatePRDescription(commitLog: string): Promise<string> {
  const prompt = `
You are an expert developer. Based on the commit log below, write a Pull Request 
title and description in markdown.

Rules:
- First line is the PR title (short, clear, max 72 characters)
- Then a blank line
- Then a markdown body with these sections:
  ## What changed
  ## Why
  ## How to test
- Be concise and professional
- Only return the markdown, nothing else

Commit log:
${commitLog}
`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No content returned from Groq API')
  }

  return content.trim()
}