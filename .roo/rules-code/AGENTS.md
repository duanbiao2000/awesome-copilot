# Project Coding Rules (Non-Obvious Only)

- **File Naming is CRITICAL**: Content files MUST use specific suffixes:
  - Prompts: `[name].prompt.md`
  - Instructions: `[name].instructions.md`
  - Chat Modes: `[name].chatmode.md`
  - Agents: `[name].agent.md`
  - Collections: `[name].collection.yml`
- **Collection IDs**: The `id` field in `.collection.yml` files must be `kebab-case` (lowercase, numbers, hyphens only).
- **JavaScript Naming**:
  - Filenames: `kebab-case.js`
  - Variables & Functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- When adding new content (prompts, instructions, etc.), be sure to also add it to a relevant `.collection.yml` file.
- When creating a new agent, be sure to configure its `mcp-servers` in the frontmatter.
- All documentation is generated from the source files. Do not edit the READMEs in `docs/` directly.
