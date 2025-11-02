# Code Review: update-readme.js

Date: 2025-11-02

Summary:

- Reviewed `eng/update-readme.js`. The script generates category README files
  (prompts, instructions, chatmodes, agents, collections) and updates the
  repository `README.md` with featured collections. It also generates
  per-collection README files in the `collections` directory.

Actions taken:

1. Added educational comments at the top of `eng/update-readme.js` to explain:
   - the script's purpose and high-level behavior
   - the Node.js modules it uses (`fs`, `path`)
   - the parsing helpers imported from `eng/yaml-parser.js`
   - the configuration and templates imported from `eng/constants.js`

2. Preserved original requires and all runtime behavior. The comments are
   non-invasive and positioned to help future contributors understand the
   script quickly.

Notes / Rationale:

- I kept comments concise and used a small numbered-note style (Note 1..4)
  consistent with other educational comments added earlier in `eng/create-collection.js`.
- The goal is to increase discoverability for maintainers unfamiliar with the
  repository: where content directories live, how metadata is extracted, and
  where outputs are written.

Next steps (optional):

- Add similar header notes to other major scripts (`validate-collections.js`,
  `yaml-parser.js`) to make responsibilities explicit.
- Add a short contributor guide in `eng/README.md` that explains the
  intended invocation and example commands for generating docs locally.

Files changed:

- `eng/update-readme.js` (educational comments added)

If you want, I can continue and add inline NOTE comments in the middle of the
file for key helper functions (e.g., `generateUnifiedModeSection`,
`generateCollectionsSection`, `buildCategoryReadme`).

— automated code-review bot
