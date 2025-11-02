# GitHub Copilot Instructions for Awesome Copilot Repository

## Project Overview

This repository is a curated collection of GitHub Copilot customizations organized into several key components:

- Agents (`/agents/*.agent.md`)
- Prompts (`/prompts/*.prompt.md`)
- Instructions (`/instructions/*.instructions.md`)
- Chat Modes (`/chatmodes/*.chatmode.md`)
- Collections (`/collections/*.md`)

## Development Workflow

- Run `npm ci` to install dependencies
- Use `npm run validate-collections` to verify collection manifests
- Use `npm run generate-readme` to update the README.md file

## Collection Management

- Collections are defined in `/collections/*.md`
- Use `eng/create-collection.js` to create new collection templates
- Each collection should focus on a specific theme/workflow

## Code Review Guidelines

### README updates

- [ ] The new file should be added to the `README.md`.

## Prompt file guide

**Only apply to files that end in `.prompt.md`**

- [ ] The prompt has markdown front matter.
- [ ] The prompt has a `mode` field specified of either `agent` or `ask`.
- [ ] The prompt has a `description` field.
- [ ] The `description` field is not empty.
- [ ] The `description` field value is wrapped in single quotes.
- [ ] The file name is lower case, with words separated by hyphens.
- [ ] Encourage the use of `tools`, but it's not required.
- [ ] Strongly encourage the use of `model` to specify the model that the prompt is optimised for.

## Instruction file guide

**Only apply to files that end in `.instructions.md`**

- [ ] The instruction has markdown front matter.
- [ ] The instruction has a `description` field.
- [ ] The `description` field is not empty.
- [ ] The `description` field value is wrapped in single quotes.
- [ ] The file name is lower case, with words separated by hyphens.
- [ ] The instruction has an `applyTo` field that specifies the file or files to which the instructions apply. If they wish to specify multiple file paths they should formated like `'**.js, **.ts'`.

## Chat Mode file guide

**Only apply to files that end in `.chatmode.md`**

- [ ] The chat mode has markdown front matter.
- [ ] The chat mode has a `description` field.
- [ ] The `description` field is not empty.
- [ ] The `description` field value is wrapped in single quotes.
- [ ] The file name is lower case, with words separated by hyphens.
- [ ] Encourage the use of `tools`, but it's not required.
- [ ] Strongly encourage the use of `model` to specify the model that the chat mode is optimised for.
