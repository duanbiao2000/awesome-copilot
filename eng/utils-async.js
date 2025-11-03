const fs = require("fs").promises;

/**
 * Safe async file operation wrapper
 * @param {Function} operation - 要执行的操作函数
 * @param {string} filePath - 文件路径
 * @param {*} defaultValue - 默认返回值
 * @returns {Promise<*>} 操作结果或默认值的Promise
 * 
 * 增强类型验证：
 * 1. 验证operation是否为函数
 * 2. 验证filePath是否为字符串
 */
async function safeAsyncFileOperation(operation, filePath, defaultValue = null) {
  // 类型验证
  if (typeof operation !== 'function') {
    console.error(`Invalid operation: expected function, got ${typeof operation}`);
    return defaultValue;
  }
  
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return defaultValue;
  }

  try {
    return await operation();
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Utility: write file only if content changed (async version)
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @returns {Promise<void>}
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 * 2. 验证content是否为字符串
 */
async function writeFileIfChangedAsync(filePath, content) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return;
  }
  
  if (typeof content !== 'string') {
    console.error(`Invalid content: expected string, got ${typeof content}`);
    return;
  }

  try {
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    if (exists) {
      const original = await fs.readFile(filePath, "utf8");
      if (original === content) {
        console.log(
          `${filePath} is already up to date. No changes needed.`
        );
        return;
      }
    }
    await fs.writeFile(filePath, content);
    console.log(
      `${filePath} ${exists ? "updated" : "created"} successfully!`
    );
  } catch (error) {
    console.error(`Error writing file ${filePath}: ${error.message}`);
  }
}

/**
 * Async version of readFile with caching
 */
class FileCache {
  constructor() {
    this.cache = new Map();
    this.stats = new Map();
  }

  /**
   * Read file content with caching
   * @param {string} filePath - 文件路径
   * @param {boolean} useCache - 是否使用缓存（默认为 true）
   * @returns {Promise<string>} 文件内容
   * 
   * 增强类型验证：
   * 1. 验证filePath是否为字符串
   * 2. 验证useCache是否为布尔值
   */
  async readFileCached(filePath, useCache = true) {
    // 类型验证
    if (typeof filePath !== 'string') {
      throw new Error(`Invalid filePath: expected string, got ${typeof filePath}`);
    }
    
    if (typeof useCache !== 'boolean') {
      throw new Error(`Invalid useCache: expected boolean, got ${typeof useCache}`);
    }

    if (!useCache) {
      return await fs.readFile(filePath, "utf8");
    }

    try {
      const stats = await fs.stat(filePath);
      const cached = this.cache.get(filePath);
      
      if (cached && cached.mtime.getTime() === stats.mtime.getTime()) {
        // 增加缓存命中统计
        this.stats.set(filePath, {
          reads: (this.stats.get(filePath)?.reads || 0) + 1,
          hits: (this.stats.get(filePath)?.hits || 0) + 1
        });
        return cached.content;
      }
      
      const content = await fs.readFile(filePath, "utf8");
      this.cache.set(filePath, {
        content,
        mtime: stats.mtime
      });
      
      this.stats.set(filePath, {
        reads: (this.stats.get(filePath)?.reads || 0) + 1,
        hits: (this.stats.get(filePath)?.hits || 0) + (cached ? 1 : 0)
      });
      
      return content;
    } catch (error) {
      // Remove from cache if file can't be read
      this.cache.delete(filePath);
      throw error;
    }
  }

  /**
   * Clear cache for a specific file
   * @param {string} filePath - 文件路径
   * 
   * 增强类型验证：
   * 1. 验证filePath是否为字符串
   */
  invalidate(filePath) {
    // 类型验证
    if (typeof filePath !== 'string') {
      console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
      return;
    }
    
    this.cache.delete(filePath);
    this.stats.delete(filePath);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.stats.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} 包含每个文件读取次数、命中次数和命中率的对象
   */
  getStats() {
    const stats = {};
    for (const [filePath, stat] of this.stats) {
      stats[filePath] = {
        reads: stat.reads,
        hits: stat.hits,
        hitRate: stat.reads > 0 ? (stat.hits / stat.reads) * 100 : 0
      };
    }
    return stats;
  }
}

module.exports = {
  safeAsyncFileOperation,
  writeFileIfChangedAsync,
  FileCache
};