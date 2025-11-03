const fs = require("fs");

/**
 * Safe file operation wrapper
 * @param {Function} operation - 要执行的操作函数
 * @param {string} filePath - 文件路径
 * @param {*} defaultValue - 默认返回值
 * @returns {*} 操作结果或默认值
 * 
 * 增强类型验证：
 * 1. 验证operation是否为函数
 * 2. 验证filePath是否为字符串
 */
function safeFileOperation(operation, filePath, defaultValue = null) {
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
    return operation();
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Utility: write file only if content changed
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * 
 * 增强类型验证：
 * 1. 验证filePath是否为字符串
 * 2. 验证content是否为字符串
 */
function writeFileIfChanged(filePath, content) {
  // 类型验证
  if (typeof filePath !== 'string') {
    console.error(`Invalid filePath: expected string, got ${typeof filePath}`);
    return;
  }
  
  if (typeof content !== 'string') {
    console.error(`Invalid content: expected string, got ${typeof content}`);
    return;
  }

  const exists = fs.existsSync(filePath);
  if (exists) {
    const original = fs.readFileSync(filePath, "utf8");
    if (original === content) {
      console.log(
        `${filePath} is already up to date. No changes needed.`
      );
      return;
    }
  }
  fs.writeFileSync(filePath, content);
  console.log(
    `${filePath} ${exists ? "updated" : "created"} successfully!`
  );
}

module.exports = {
  safeFileOperation,
  writeFileIfChanged
};