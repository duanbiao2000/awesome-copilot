const fs = require("fs").promises;

/**
 * Safe async file operation wrapper
 */
async function safeAsyncFileOperation(operation, filePath, defaultValue = null) {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Utility: write file only if content changed (async version)
 */
async function writeFileIfChangedAsync(filePath, content) {
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
   */
  async readFileCached(filePath, useCache = true) {
    if (!useCache) {
      return await fs.readFile(filePath, "utf8");
    }

    try {
      const stats = await fs.stat(filePath);
      const cached = this.cache.get(filePath);
      
      if (cached && cached.mtime.getTime() === stats.mtime.getTime()) {
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
   */
  invalidate(filePath) {
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