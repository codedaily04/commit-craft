import fs from 'fs'
import os from 'os'
import path from 'path'

const CONFIG_DIR = path.join(os.homedir(), '.commit-craft')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')

export function saveConfig(key: string, value: string) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }

  const existing = loadAllConfig()
  const updated = { ...existing, [key]: value }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2))
}

export function loadAllConfig(): Record<string, string> {
  if (!fs.existsSync(CONFIG_FILE)) return {}
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
}

export function getConfig(key: string): string | undefined {
  return loadAllConfig()[key]
}