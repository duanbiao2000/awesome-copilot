const fs = require("fs");

/**
 * Safe file operation wrapper
 */
function safeFileOperation(operation, filePath, defaultValue = null) {
  try {
    return operation();
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Utility: write file only if content changed
 */
function writeFileIfChanged(filePath, content) {
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