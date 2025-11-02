// Note 1: YAML and Frontmatter Parser
// This module handles two distinct but related parsing needs:
// 1. Pure YAML files (.collection.yml) for collection configuration
// 2. YAML frontmatter in markdown files (agents, prompts, chatmodes, instructions)
//
// Educational Note: Module Design Pattern
// This module follows the Single Responsibility Principle, with each function
// having a clear, focused purpose. It also demonstrates the Facade pattern,
// providing a simplified interface to complex parsing operations.
//
// It uses:
// - js-yaml: For parsing pure YAML files
// - vfile-matter: For extracting and parsing YAML frontmatter from markdown
//
// The module provides a consistent interface for both use cases while handling
// different file formats and parsing requirements appropriately.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { VFile } = require("vfile");
const { matter } = require("vfile-matter");

// Note 2: Error Handling Wrapper
// Educational Note: Higher-Order Function Pattern
// This utility function demonstrates the higher-order function pattern, where a function
// takes another function as an argument and returns a new function with enhanced behavior.
// This is a form of decoration, adding error handling without modifying the original function.
//
// It follows a consistent error handling pattern:
// 1. Try to execute the operation
// 2. Return the result if successful
// 3. Log the error and return a default value if failed
//
// This ensures that parsing errors don't crash the application and makes
// error handling consistent across all parsing functions.

/**
 * Educational Note: Safe File Operation Wrapper
 * 
 * This function implements the decorator pattern to add error handling to file operations.
 * It's a higher-order function that takes an operation function and returns a new function
 * with consistent error handling.
 * 
 * @param {Function} operation - The operation to wrap with error handling
 * @param {string} filePath - Path to the file being processed
 * @param {*} defaultValue - Default value to return on error
 * @returns {*} Result of the operation or default value on error
 */
function safeFileOperation(operation, filePath, defaultValue = null) {
  try {
    return operation();
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

// Note 3: Path Validation
// Educational Note: Security First Approach
// Path validation is crucial for preventing directory traversal attacks.
// This function ensures that file operations are limited to allowed directories,
// following the principle of least privilege.
//
// It resolves both the file path and an allowed base path, then checks
// if the file path is within the allowed directory.

/**
 * Educational Note: Path Validation for Security
 * 
 * This function validates that a file path is within an allowed directory,
 * preventing directory traversal attacks.
 * 
 * @param {string} filePath - The file path to validate
 * @param {string} [allowedDir] - The allowed base directory (defaults to parent of this script)
 * @returns {boolean} True if the path is valid and within allowed directory
 */
function validatePath(filePath, allowedDir = path.resolve(__dirname, "..")) {
  try {
    const resolvedPath = path.resolve(filePath);
    return resolvedPath.startsWith(allowedDir);
  } catch (error) {
    console.error(`Path validation error: ${error.message}`);
    return false;
  }
}

/**
 * Parse a collection YAML file (.collection.yml)
 * Collections are pure YAML files without frontmatter delimiters
 * @param {string} filePath - Path to collection file
 * @returns {object|null} Parsed collection object or null on error
 */
// Note 4: Collection YAML Parser
// Educational Note: Schema-Based Validation
// Collections use pure YAML files (no frontmatter) to define:
// - Collection metadata (id, name, description)
// - Included items and their types
// - Display preferences
//
// The function uses js-yaml with JSON_SCHEMA for stricter parsing,
// which helps catch common YAML syntax errors early.
//
// It also demonstrates the fail-fast principle by validating the path
// before attempting to read the file.

function parseCollectionYaml(filePath) {
  // Educational Note: Early Validation
  // Validate the path before attempting to read the file
  if (!validatePath(filePath)) {
    console.error(`Invalid path for collection file: ${filePath}`);
    return null;
  }

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
 * Parse frontmatter from a markdown file using vfile-matter
 * Works with any markdown file that has YAML frontmatter (agents, prompts, chatmodes, instructions)
 * @param {string} filePath - Path to markdown file
 * @returns {object|null} Parsed frontmatter object or null on error
 */
// Note 5: Frontmatter Parser
// Educational Note: Data Normalization Pattern
// Most content files (agents, prompts, chatmodes, instructions) use markdown
// with YAML frontmatter for metadata. This function:
// 1. Validates the path before reading
// 2. Reads the file content
// 3. Uses vfile-matter to extract frontmatter
// 4. Normalizes string fields (trimming whitespace, newlines)
//
// The normalization step is important because YAML multiline strings can
// accumulate trailing whitespace that affects string comparisons.
//
// This function demonstrates the pipeline pattern, where data flows through
// a series of transformations.

function parseFrontmatter(filePath) {
  // Educational Note: Early Validation
  // Validate the path before attempting to read the file
  if (!validatePath(filePath)) {
    console.error(`Invalid path for markdown file: ${filePath}`);
    return null;
  }

  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      const file = new VFile({ path: filePath, value: content });

      // Parse frontmatter using vfile-matter
      matter(file);

      // The frontmatter is now available in file.data.matter
      const frontmatter = file.data.matter;

      // Educational Note: Defensive Programming
      // Always check if frontmatter exists before trying to access its properties
      if (frontmatter) {
        // Educational Note: String Normalization
        // Normalize string fields that can accumulate trailing newlines/spaces
        // This ensures consistent string comparisons across the application

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
 * Educational Note: Type Definitions for Better Documentation
 * 
 * @typedef {Object} AgentMetadata
 * @property {string|null} name - Agent name
 * @property {string|null} description - Agent description
 * @property {Array} tools - Array of tool configurations
 * @property {Object} mcpServers - MCP server configurations
 */

/**
 * Extract agent metadata including MCP server information
 * @param {string} filePath - Path to agent file
 * @returns {AgentMetadata|null} Agent metadata object with name, description, tools, and mcp-servers
 */
// Note 6: Agent Metadata Extractor
// Educational Note: Data Transformation Pattern
// Agents have special metadata requirements for MCP server integration.
// This function extracts and validates:
// - Basic metadata (name, description)
// - Tool configurations
// - MCP server settings
//
// The extracted metadata is used by the validator to ensure agents
// are properly configured for their target MCP servers.
//
// This function demonstrates the adapter pattern, converting raw frontmatter
// into a standardized format that the rest of the application can use reliably.

function extractAgentMetadata(filePath) {
  // Educational Note: Optional Chaining for Cleaner Code
  // Using optional chaining (?.) to safely access nested properties
  const frontmatter = parseFrontmatter(filePath);

  if (!frontmatter) {
    return null;
  }

  // Educational Note: Explicit Type Checking
  // Explicitly check and convert types to ensure consistency
  return {
    name: typeof frontmatter.name === "string" ? frontmatter.name : null,
    description:
      typeof frontmatter.description === "string"
        ? frontmatter.description
        : null,
    tools: Array.isArray(frontmatter.tools) ? frontmatter.tools : [],
    mcpServers: typeof frontmatter["mcp-servers"] === "object" && frontmatter["mcp-servers"] !== null
      ? frontmatter["mcp-servers"]
      : {},
  };
}

/**
 * Extract MCP server names from an agent file
 * @param {string} filePath - Path to agent file
 * @returns {string[]} Array of MCP server names
 */
// Note 7: MCP Server Names Extractor
// Educational Note: Function Composition
// This function demonstrates function composition by using extractAgentMetadata
// as a building block. It extracts just the server names, which is
// a common operation in the codebase.
//
// This follows the DRY (Don't Repeat Yourself) principle by reusing
// the existing metadata extraction logic.

function extractMcpServers(filePath) {
  // Educational Note: Optional Chaining and Nullish Coalescing
  // Using optional chaining (?.) and nullish coalescing (??) for cleaner code
  const metadata = extractAgentMetadata(filePath);

  if (!metadata?.mcpServers) {
    return [];
  }

  return Object.keys(metadata.mcpServers);
}

/**
 * Educational Note: Type Definitions for Better Documentation
 * 
 * @typedef {Object} McpServerConfig
 * @property {string} name - Server name
 * @property {string} [type] - Server type (stdio/http)
 * @property {string} [command] - Command for stdio servers
 * @property {string[]} [args] - Command arguments
 * @property {string} [url] - URL for http servers
 * @property {Object} [headers] - HTTP headers
 */

/**
 * Extract full MCP server configs from an agent file
 * @param {string} filePath - Path to agent file
 * @returns {McpServerConfig[]} Array of MCP server configuration objects
 */
// Note 8: MCP Server Configuration Extractor
// Educational Note: Data Transformation and Validation
// This function extracts and validates MCP server configurations from agent files.
// It demonstrates several important patterns:
//
// 1. Immutability: Creates copies of configuration objects to avoid mutation
// 2. Type Safety: Explicitly checks types before using values
// 3. Default Values: Provides undefined for missing fields rather than null
// 4. Array Mapping: Transforms object entries into a standardized array format
//
// This ensures that the rest of the application can rely on a consistent
// format for MCP server configurations.

function extractMcpServerConfigs(filePath) {
  const metadata = extractAgentMetadata(filePath);

  // Educational Note: Early Return and Guard Clauses
  // Use early returns to avoid nested if-else statements
  if (!metadata?.mcpServers) return [];

  return Object.entries(metadata.mcpServers).map(([name, cfg]) => {
    // Educational Note: Object Spread for Immutability
    // Use object spread to create a copy of the configuration
    // This prevents accidental mutation of the original data
    const copy = { ...cfg };

    // Educational Note: Explicit Type Conversion
    // Explicitly convert and validate each field
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

// Educational Note: Module Export Pattern
// This module exports a clean, well-documented API that hides the
// implementation details while providing useful functionality to the rest
// of the application.

module.exports = {
  parseCollectionYaml,
  parseFrontmatter,
  extractAgentMetadata,
  extractMcpServers,
  extractMcpServerConfigs,
  safeFileOperation,
  validatePath,
};
