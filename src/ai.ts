import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

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

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  return response.text!.trim()
}