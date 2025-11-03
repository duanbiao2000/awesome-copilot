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

// 创建全局文件缓存实例，用于异步函数中的文件内容缓存
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
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
function parseCollectionYaml(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
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
 * 异步解析集合YAML文件 (.collection.yml)
 * 使用文件缓存机制提高重复读取性能
 * @param {string} filePath - 集合文件路径
 * @returns {Promise<object|null>} 解析后的集合对象，出错时返回null
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
async function parseCollectionYamlAsync(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return null;
  }
  
  return await safeAsyncFileOperation(
    async () => {
      // 使用带缓存的文件读取，避免重复读取相同文件
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
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
function parseFrontmatter(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return null;
  }
  
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
 * 异步解析Markdown文件中的frontmatter
 * 使用文件缓存机制提高重复读取性能
 * @param {string} filePath - Markdown文件路径
 * @returns {Promise<object|null>} 解析后的frontmatter对象，出错时返回null
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
async function parseFrontmatterAsync(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return null;
  }
  
  return await safeAsyncFileOperation(
    async () => {
      // 使用带缓存的文件读取，避免重复读取相同文件
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
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
function extractAgentMetadata(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return null;
  }
  
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
 * 异步提取代理元数据（包括MCP服务器信息）
 * @param {string} filePath - 代理文件路径
 * @returns {Promise<object|null>} 代理元数据对象，出错时返回null
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
async function extractAgentMetadataAsync(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return null;
  }
  
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
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
function extractMcpServers(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return [];
  }
  
  const metadata = extractAgentMetadata(filePath);

  if (!metadata || !metadata.mcpServers) {
    return [];
  }

  return Object.keys(metadata.mcpServers);
}

/**
 * 异步从代理文件中提取MCP服务器名称
 * @param {string} filePath - 代理文件路径
 * @returns {Promise<string[]>} MCP服务器名称数组
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
async function extractMcpServersAsync(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return [];
  }
  
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
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
function extractMcpServerConfigs(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return [];
  }
  
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
 * 异步从代理文件中提取完整的MCP服务器配置
 * @param {string} filePath - 代理文件路径
 * @returns {Promise<Array<{name:string,type?:string,command?:string,args?:string[],url?:string,headers?:object}>>}
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 */
async function extractMcpServerConfigsAsync(filePath) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return [];
  }
  
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