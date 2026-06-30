# commit-craft-cli

AI-powered git commit messages, right from your terminal.

Stage your changes, run `commit-craft commit`, and get a [Conventional Commits](https://www.conventionalcommits.org/) message generated instantly. Accept it, edit it, regenerate it, or bail — all without leaving the terminal.

---

## Features

- **AI commit messages** — generates clean, meaningful commit messages from your staged diff
- **Multi-commit splitting** — splits a large staged diff into multiple logical commits automatically
- **PR description generator** — writes a PR title and description from your branch's commit history
- **Interactive prompt** — Accept, Edit, Regenerate, or Bail on every suggestion

---

## Installation

```bash
npm install -g @lukewarm/commit-craft
```

---

## Setup

Get a free API key from [Groq](https://console.groq.com) (takes 2 minutes, no billing required).

Then run:

```bash
commit-craft config --key your_groq_api_key
```

That's it. Your key is saved locally and used for all future commands.

---

## Usage

### Generate a commit message

```bash
git add .
commit-craft commit
```

Reads your staged diff, generates a Conventional Commits message, and shows you an interactive prompt:

```
Suggested commit message:

  feat: add user authentication

? What do you want to do? (Use arrow keys)
❯ Accept
  Edit
  Regenerate
  Bail
```

---

### Split staged changes into multiple commits

```bash
git add .
commit-craft split
```

Analyzes your staged diff and groups changes into logical commits automatically:

```
Found 3 logical commits:

  1. feat: add login endpoint
     - src/auth.ts
     - src/routes.ts
  2. fix: handle empty password validation
     - src/validators.ts
  3. chore: update dependencies
     - package.json

? Proceed with these commits? Yes
 feat: add login endpoint
 fix: handle empty password validation
 chore: update dependencies
```

---

### Generate a PR description

```bash
commit-craft pr
```

Reads all commits ahead of `main` and generates a PR title and description in markdown, ready to paste into GitHub.

If your base branch is not `main`:

```bash
commit-craft pr --base master
```

---

### Update your API key

```bash
commit-craft config --key your_new_api_key
```

---

## Conventional Commits format

All generated messages follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

| Prefix | When to use |
|--------|-------------|
| `feat` | new feature |
| `fix` | bug fix |
| `chore` | maintenance, dependencies |
| `docs` | documentation changes |
| `refactor` | code restructure, no behaviour change |
| `test` | adding or updating tests |
| `style` | formatting, no logic change |

---

## Powered by

- [Groq](https://groq.com) — fast, free LLM inference
- [Llama 3.3 70B](https://groq.com) — the model used for generation

---

## License

ISC