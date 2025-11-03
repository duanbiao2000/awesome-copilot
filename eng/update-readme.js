#!/usr/bin/env node

// Note 1: Script purpose
// This script generates README and category documentation files for the repository.
// It now acts as an entry point that delegates to the DocGenerator class.

const DocGenerator = require('./doc-generator');

// Main execution
(async () => {
  const generator = new DocGenerator();
  await generator.generateAllDocs();
})();