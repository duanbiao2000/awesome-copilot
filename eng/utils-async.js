const fs = require("fs").promises;

/**
 * 安全的异步文件操作包装器
 * 提供统一的错误处理机制，避免因文件操作异常导致程序崩溃
 */
async function safeAsyncFileOperation(operation, filePath, defaultValue = null) {
  try {
    return await operation();
  } catch (error) {
    console.error(`处理文件时出错 ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

/**
 * 异步写入文件工具函数（仅在内容改变时写入）
 * 通过比较文件内容避免不必要的磁盘写入操作
 */
async function writeFileIfChangedAsync(filePath, content) {
  try {
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    if (exists) {
      const original = await fs.readFile(filePath, "utf8");
      if (original === content) {
        console.log(
          `${filePath} 已是最新版本，无需更改。`
        );
        return;
      }
    }
    await fs.writeFile(filePath, content);
    console.log(
      `${filePath} ${exists ? "已更新" : "已创建"} 成功！`
    );
  } catch (error) {
    console.error(`写入文件时出错 ${filePath}: ${error.message}`);
  }
}

/**
 * 带缓存的异步文件读取类
 * 实现基于文件修改时间戳的缓存机制，减少重复读取开销
 */
class FileCache {
  constructor() {
    // 使用 Map 存储文件内容和修改时间
    this.cache = new Map();
    // 使用 Map 存储缓存统计信息
    this.stats = new Map();
  }

  /**
   * 带缓存的文件读取方法
   * @param {string} filePath - 文件路径
   * @param {boolean} useCache - 是否使用缓存（默认为 true）
   * @returns {Promise<string>} 文件内容
   * 
   * 缓存机制说明：
   * 1. 检查文件是否已在缓存中
   * 2. 比较文件修改时间戳确认缓存是否有效
   * 3. 如果缓存有效则直接返回缓存内容
   * 4. 如果缓存无效或不存在则重新读取文件并更新缓存
   */
  async readFileCached(filePath, useCache = true) {
    if (!useCache) {
      return await fs.readFile(filePath, "utf8");
    }

    try {
      // 获取文件状态信息，包括修改时间
      const stats = await fs.stat(filePath);
      const cached = this.cache.get(filePath);
      
      // 检查缓存是否存在且文件未被修改（通过比较修改时间戳）
      if (cached && cached.mtime.getTime() === stats.mtime.getTime()) {
        // 增加缓存命中统计
        this.stats.set(filePath, {
          reads: (this.stats.get(filePath)?.reads || 0) + 1,
          hits: (this.stats.get(filePath)?.hits || 0) + 1
        });
        // 返回缓存内容
        return cached.content;
      }
      
      // 读取文件内容
      const content = await fs.readFile(filePath, "utf8");
      // 更新缓存（存储内容和修改时间）
      this.cache.set(filePath, {
        content,
        mtime: stats.mtime
      });
      
      // 更新统计信息
      this.stats.set(filePath, {
        reads: (this.stats.get(filePath)?.reads || 0) + 1,
        hits: (this.stats.get(filePath)?.hits || 0) + (cached ? 1 : 0)
      });
      
      return content;
    } catch (error) {
      // 文件读取出错时，从缓存中移除该文件
      this.cache.delete(filePath);
      throw error;
    }
  }

  /**
   * 清除指定文件的缓存
   * @param {string} filePath - 文件路径
   */
  invalidate(filePath) {
    this.cache.delete(filePath);
    this.stats.delete(filePath);
  }

  /**
   * 清除所有缓存
   */
  clear() {
    this.cache.clear();
    this.stats.clear();
  }

  /**
   * 获取缓存统计信息
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