# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build/Lint/Test Commands

- `npm run build`: Generates READMEs and other documentation from the files in `instructions/`, `prompts/`, `chatmodes/`, `agents/`, and `collections/`.
- `npm run validate:collections`: Validates the `.collection.yml` files in the `collections/` directory.
- There is no formal test command, but tests are written with Jest and can be found in the `eng/__tests__/` directory.

## Code Style

- **Indentation**: 2 spaces
- **Line Endings**: LF (except for Windows scripts)
- **Charset**: UTF-8
- **Trailing Whitespace**: Trimmed (except for Markdown files)
- **Final Newline**: Required

## Architecture

- The core of this project is a documentation generator.
- The main logic is in the `eng/` directory.
- The `DocGenerator` class in `eng/doc-generator.js` is responsible for reading files from the `instructions/`, `prompts/`, `chatmodes/`, `agents/`, and `collections/` directories, parsing them, and generating Markdown documentation.
- The project uses a concept called "collections" to group related prompts, instructions, chatmodes, and agents. These are defined in `.collection.yml` files.
- The `validate-collections.js` script is used to validate these collection files.

## Key Patterns

- **Frontmatter**: The project uses `vfile` and `vfile-matter` to parse frontmatter from Markdown files. This is used to store metadata like `title` and `description`.
- **Collections**: Collections are a key concept in this project. They are defined in `.collection.yml` files and are used to group related content.
- **MCP Servers**: Agents can be configured to use MCP servers. This is done in the frontmatter of the agent's `.agent.md` file.
