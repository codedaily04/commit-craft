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