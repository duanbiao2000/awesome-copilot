const path = require("path");

const ROOT_FOLDER = path.join(__dirname, "..", "..");
const INSTRUCTIONS_DIR = path.join(ROOT_FOLDER, "instructions");
const PROMPTS_DIR = path.join(ROOT_FOLDER, "prompts");
const CHATMODES_DIR = path.join(ROOT_FOLDER, "chatmodes");
const AGENTS_DIR = path.join(ROOT_FOLDER, "agents");
const COLLECTIONS_DIR = path.join(ROOT_FOLDER, "collections");
const DOCS_DIR = path.join(ROOT_FOLDER, "docs");

module.exports = {
  ROOT_FOLDER,
  INSTRUCTIONS_DIR,
  PROMPTS_DIR,
  CHATMODES_DIR,
  AGENTS_DIR,
  COLLECTIONS_DIR,
  DOCS_DIR,
};