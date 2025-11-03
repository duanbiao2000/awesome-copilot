// Note 1: YAML and Frontmatter Parser
// This module handles two distinct but related parsing needs:
// 1. Pure YAML files (.collection.yml) for collection configuration
// 2. YAML frontmatter in markdown files (agents, prompts, chatmodes, instructions)
//
// It uses:
// - js-yaml: For parsing pure YAML files
// - vfile-matter: For extracting and parsing YAML frontmatter from markdown
//
// The module provides a consistent interface for both use cases while handling
// the different file formats and parsing requirements appropriately.

const fs = require("fs");
const yaml = require("js-yaml");
const { VFile } = require("vfile");
const { matter } = require("vfile-matter");
const { FileCache, safeAsyncFileOperation } = require("./utils-async");

// Create a global file cache instance
const fileCache = new FileCache();

// Note 2: Error Handling Wrapper
// This utility function provides consistent error handling for file operations.
// It follows the pattern:
// 1. Try the operation
// 2. Return the result if successful
// 3. Log the error and return a default value if failed
//
// This ensures that parsing errors don't crash the application and makes
// error handling consistent across all parsing functions.

function safeFileOperation(operation, filePath, defaultValue = null) {
  try {
    return operation();
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Parse a collection YAML file (.collection.yml)
 * Collections are pure YAML files without frontmatter delimiters
 * @param {string} filePath - Path to the collection file
 * @returns {object|null} Parsed collection object or null on error
 */
// Note 3: Collection YAML Parser
// Collections use pure YAML files (no frontmatter) to define:
// - Collection metadata (id, name, description)
// - Included items and their types
// - Display preferences
//
// The function uses js-yaml with JSON_SCHEMA for stricter parsing,
// which helps catch common YAML syntax errors early.

function parseCollectionYaml(filePath) {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      // Collections are pure YAML files, parse directly with js-yaml
      return yaml.load(content, { schema: yaml.JSON_SCHEMA });
    },
    filePath,
    null
  );
}

/**
 * Parse a collection YAML file (.collection.yml) - async version
 * Collections are pure YAML files without frontmatter delimiters
 * @param {string} filePath - Path to the collection file
 * @returns {object|null} Parsed collection object or null on error
 */
async function parseCollectionYamlAsync(filePath) {
  return await safeAsyncFileOperation(
    async () => {
      const content = await fileCache.readFileCached(filePath);
      // Collections are pure YAML files, parse directly with js-yaml
      return yaml.load(content, { schema: yaml.JSON_SCHEMA });
    },
    filePath,
    null
  );
}

/**
 * Parse frontmatter from a markdown file using vfile-matter
 * Works with any markdown file that has YAML frontmatter (agents, prompts, chatmodes, instructions)
 * @param {string} filePath - Path to the markdown file
 * @returns {object|null} Parsed frontmatter object or null on error
 */
// Note 4: Frontmatter Parser
// Most content files (agents, prompts, chatmodes, instructions) use markdown
// with YAML frontmatter for metadata. This function:
// 1. Reads the file content
// 2. Uses vfile-matter to extract frontmatter
// 3. Normalizes string fields (trimming whitespace, newlines)
//
// The normalization step is important because YAML multiline strings can
// accumulate trailing whitespace that affects string comparisons.

function parseFrontmatter(filePath) {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      const file = new VFile({ path: filePath, value: content });

      // Parse the frontmatter using vfile-matter
      matter(file);

      // The frontmatter is now available in file.data.matter
      const frontmatter = file.data.matter;

      // Normalize string fields that can accumulate trailing newlines/spaces
      if (frontmatter) {
        if (typeof frontmatter.name === "string") {
          frontmatter.name = frontmatter.name.replace(/[\r\n]+$/g, "").trim();
        }
        if (typeof frontmatter.title === "string") {
          frontmatter.title = frontmatter.title.replace(/[\r\n]+$/g, "").trim();
        }
        if (typeof frontmatter.description === "string") {
          // Remove only trailing whitespace/newlines; preserve internal formatting
          frontmatter.description = frontmatter.description.replace(
            /[\s\r\n]+$/g,
            ""
          );
        }
      }

      return frontmatter;
    },
    filePath,
    null
  );
}

/**
 * Parse frontmatter from a markdown file using vfile-matter - async version
 * Works with any markdown file that has YAML frontmatter (agents, prompts, chatmodes, instructions)
 * @param {string} filePath - Path to the markdown file
 * @returns {object|null} Parsed frontmatter object or null on error
 */
async function parseFrontmatterAsync(filePath) {
  return await safeAsyncFileOperation(
    async () => {
      const content = await fileCache.readFileCached(filePath);
      const file = new VFile({ path: filePath, value: content });

      // Parse the frontmatter using vfile-matter
      matter(file);

      // The frontmatter is now available in file.data.matter
      const frontmatter = file.data.matter;

      // Normalize string fields that can accumulate trailing newlines/spaces
      if (frontmatter) {
        if (typeof frontmatter.name === "string") {
          frontmatter.name = frontmatter.name.replace(/[\r\n]+$/g, "").trim();
        }
        if (typeof frontmatter.title === "string") {
          frontmatter.title = frontmatter.title.replace(/[\r\n]+$/g, "").trim();
        }
        if (typeof frontmatter.description === "string") {
          // Remove only trailing whitespace/newlines; preserve internal formatting
          frontmatter.description = frontmatter.description.replace(
            /[\s\r\n]+$/g,
            ""
          );
        }
      }

      return frontmatter;
    },
    filePath,
    null
  );
}

/**
 * Extract agent metadata including MCP server information
 * @param {string} filePath - Path to the agent file
 * @returns {object|null} Agent metadata object with name, description, tools, and mcp-servers
 */
// Note 5: Agent Metadata Extractor
// Agents have special metadata requirements for MCP server integration.
// This function extracts and validates:
// - Basic metadata (name, description)
// - Tool configurations
// - MCP server settings
//
// The extracted metadata is used by the validator to ensure agents
// are properly configured for their target MCP servers.

function extractAgentMetadata(filePath) {
  const frontmatter = parseFrontmatter(filePath);

  if (!frontmatter) {
    return null;
  }

  return {
    name: typeof frontmatter.name === "string" ? frontmatter.name : null,
    description:
      typeof frontmatter.description === "string"
        ? frontmatter.description
        : null,
    tools: frontmatter.tools || [],
    mcpServers: frontmatter["mcp-servers"] || {},
  };
}

/**
 * Extract agent metadata including MCP server information - async version
 * @param {string} filePath - Path to the agent file
 * @returns {object|null} Agent metadata object with name, description, tools, and mcp-servers
 */
async function extractAgentMetadataAsync(filePath) {
  const frontmatter = await parseFrontmatterAsync(filePath);

  if (!frontmatter) {
    return null;
  }

  return {
    name: typeof frontmatter.name === "string" ? frontmatter.name : null,
    description:
      typeof frontmatter.description === "string"
        ? frontmatter.description
        : null,
    tools: frontmatter.tools || [],
    mcpServers: frontmatter["mcp-servers"] || {},
  };
}

/**
 * Extract MCP server names from an agent file
 * @param {string} filePath - Path to the agent file
 * @returns {string[]} Array of MCP server names
 */
function extractMcpServers(filePath) {
  const metadata = extractAgentMetadata(filePath);

  if (!metadata || !metadata.mcpServers) {
    return [];
  }

  return Object.keys(metadata.mcpServers);
}

/**
 * Extract MCP server names from an agent file - async version
 * @param {string} filePath - Path to the agent file
 * @returns {string[]} Array of MCP server names
 */
async function extractMcpServersAsync(filePath) {
  const metadata = await extractAgentMetadataAsync(filePath);

  if (!metadata || !metadata.mcpServers) {
    return [];
  }

  return Object.keys(metadata.mcpServers);
}

/**
 * Extract full MCP server configs from an agent file
 * @param {string} filePath - Path to the agent file
 * @returns {Array<{name:string,type?:string,command?:string,args?:string[],url?:string,headers?:object}>}
 */
function extractMcpServerConfigs(filePath) {
  const metadata = extractAgentMetadata(filePath);
  if (!metadata || !metadata.mcpServers) return [];
  return Object.entries(metadata.mcpServers).map(([name, cfg]) => {
    // Ensure we don't mutate original cfg
    const copy = { ...cfg };
    return {
      name,
      type: typeof copy.type === "string" ? copy.type : undefined,
      command: typeof copy.command === "string" ? copy.command : undefined,
      args: Array.isArray(copy.args) ? copy.args : undefined,
      url: typeof copy.url === "string" ? copy.url : undefined,
      headers:
        typeof copy.headers === "object" && copy.headers !== null
          ? copy.headers
          : undefined,
    };
  });
}

/**
 * Extract full MCP server configs from an agent file - async version
 * @param {string} filePath - Path to the agent file
 * @returns {Array<{name:string,type?:string,command?:string,args?:string[],url?:string,headers?:object}>}
 */
async function extractMcpServerConfigsAsync(filePath) {
  const metadata = await extractAgentMetadataAsync(filePath);
  if (!metadata || !metadata.mcpServers) return [];
  return Object.entries(metadata.mcpServers).map(([name, cfg]) => {
    // Ensure we don't mutate original cfg
    const copy = { ...cfg };
    return {
      name,
      type: typeof copy.type === "string" ? copy.type : undefined,
      command: typeof copy.command === "string" ? copy.command : undefined,
      args: Array.isArray(copy.args) ? copy.args : undefined,
      url: typeof copy.url === "string" ? copy.url : undefined,
      headers:
        typeof copy.headers === "object" && copy.headers !== null
          ? copy.headers
          : undefined,
    };
  });
}

module.exports = {
  parseCollectionYaml,
  parseCollectionYamlAsync,
  parseFrontmatter,
  parseFrontmatterAsync,
  extractAgentMetadata,
  extractAgentMetadataAsync,
  extractMcpServers,
  extractMcpServersAsync,
  extractMcpServerConfigs,
  extractMcpServerConfigsAsync,
  safeFileOperation,
  fileCache
};