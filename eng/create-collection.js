#!/usr/bin/env node

// Note 1: Shebang line that enables this script to be run directly from the command line on Unix-like systems
// Note 2: The script uses Node.js standard libraries for file operations and user interaction

const fs = require("fs");         // Note 3: File System module for reading/writing files
const path = require("path");     // Note 4: Path module for cross-platform file path handling
const readline = require("readline"); // Note 5: Readline module for interactive command line input
const { COLLECTIONS_DIR } = require("./constants"); // Note 6: Importing collection directory path from constants

// Note 7: Create readline interface for handling user input/output
const rl = readline.createInterface({
  input: process.stdin,    // Note 8: Read from standard input (keyboard)
  output: process.stdout,  // Note 9: Write to standard output (console)
});

/**
 * Note 10: Helper function to create Promise-based user prompts
 * This function wraps the callback-based readline.question in a Promise
 * to enable use with async/await for cleaner code flow
 *
 * @param {string} question - Text to display as the prompt
 * @returns {Promise<string>} Promise that resolves with user's input
 */
function prompt(question) {
  // 将readline的回调接口包装成Promise接口
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

/**
 * 解析命令行参数的函数
 * 用于处理传入的命令行参数，提取出id和tags信息
 * @returns {Object} 包含id和tags属性的对象
 */
// Note 11: Function to parse command line arguments for collection ID and tags
function parseArgs() {
  // Note 12: process.argv contains all command line arguments
  // First two elements are: [node executable path, script path]
  const args = process.argv.slice(2);  // Get just the user-provided arguments

  // Note 13: Initialize return object with undefined values
  // This allows us to track whether arguments were provided
  const out = { id: undefined, tags: undefined };

  // Note 14: Parse command line options in both long and short formats
  // Supports: --id value, -i value, --id=value, and positional arguments
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--id" || a === "-i") {  // Note 15: Handle space-separated options
      out.id = args[i + 1];
      i++;  // Skip the next argument since we consumed it
    } else if (a.startsWith("--id=")) { // Note 16: Handle equals-style options
      out.id = a.split("=")[1];
    } else if (a === "--tags" || a === "-t") {
      out.tags = args[i + 1];
      i++;
    } else if (a.startsWith("--tags=")) {
      out.tags = a.split("=")[1];
    } else if (!a.startsWith("-") && !out.id) {
      // first positional -> id
      out.id = a;
    } else if (!a.startsWith("-") && out.id && !out.tags) {
      // second positional -> tags
      out.tags = a;
    }
  }

  // normalize tags to string (comma separated) or undefined
  if (Array.isArray(out.tags)) {
    out.tags = out.tags.join(",");
  }

  return out;
}

// Note 17: Main function to create a new collection template
// Uses async/await for clean handling of user prompts
async function createCollectionTemplate() {
  try {
    // Note 18: Display welcome message with emoji for better UX
    console.log("🎯 Collection Creator");
    console.log("This tool will help you create a new collection manifest.\n");

    // Note 19: Support both CLI arguments and interactive input
    // This hybrid approach improves usability for both scripts and human users
    const parsed = parseArgs();

    // Note 20: Get collection ID from CLI args or prompt user
    let collectionId = parsed.id;
    if (!collectionId) {
      // Note 21: Use await with our Promise-based prompt function
      collectionId = await prompt("Collection ID (lowercase, hyphens only): ");
    }

    // Validate collection ID format
    if (!collectionId) {
      console.error("❌ Collection ID is required");
      process.exit(1);
    }

    if (!/^[a-z0-9-]+$/.test(collectionId)) {
      console.error(
        "❌ Collection ID must contain only lowercase letters, numbers, and hyphens"
      );
      process.exit(1);
    }

    const filePath = path.join(
      COLLECTIONS_DIR,
      `${collectionId}.collection.yml`
    );

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(
        `⚠️  Collection ${collectionId} already exists at ${filePath}`
      );
      console.log("💡 Please edit that file instead or choose a different ID.");
      process.exit(1);
    }

    // Ensure collections directory exists
    if (!fs.existsSync(COLLECTIONS_DIR)) {
      fs.mkdirSync(COLLECTIONS_DIR, { recursive: true });
    }

    // Get collection name
    const defaultName = collectionId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    let collectionName = await prompt(
      `Collection name (default: ${defaultName}): `
    );
    if (!collectionName.trim()) {
      collectionName = defaultName;
    }

    // Get description
    const defaultDescription = `A collection of related prompts, instructions, and chat modes for ${collectionName.toLowerCase()}.`;
    let description = await prompt(
      `Description (default: ${defaultDescription}): `
    );
    if (!description.trim()) {
      description = defaultDescription;
    }

    // Get tags (from CLI or prompt)
    let tags = [];
    let tagInput = parsed.tags;
    if (!tagInput) {
      21122121
      tagInput = await prompt(
        "Tags (comma-separated, or press Enter for defaults): "
      );
    }

    if (tagInput && tagInput.toString().trim()) {
      tags = tagInput
        .toString()
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    } else {
      // Generate some default tags from the collection ID
      tags = collectionId.split("-").slice(0, 3);
    }
    // Note 22: Generate YAML template for the collection
    // Uses template literals for clean string interpolation
    const template = `# Note 23: Collection manifest in YAML format
# Fields:
# - id: Unique identifier for the collection
# - name: Display name
# - description: Brief explanation of collection purpose
# - tags: Keywords for categorization and search
id: ${collectionId}
name: ${collectionName}
description: ${description}
tags: [${tags.join(", ")}]
items:
  # Add your collection items here
  # Example:
  # - path: prompts/example.prompt.md
  #   kind: prompt
  # - path: instructions/example.instructions.md
  #   kind: instruction
  # - path: chatmodes/example.chatmode.md
  #   kind: chat-mode
    # - path: agents/example.agent.md
    #   kind: agent
    #   usage: |
    #     This agent requires the example MCP server to be installed.
    #     Configure any required environment variables (e.g., EXAMPLE_API_KEY).
display:
  ordering: alpha # or "manual" to preserve the order above
  show_badge: false # set to true to show collection badge on items
`;

    fs.writeFileSync(filePath, template);
    console.log(`✅ Created collection template: ${filePath}`);
    console.log("\n📝 Next steps:");
    console.log("1. Edit the collection manifest to add your items");
    console.log("2. Update the name, description, and tags as needed");
    console.log("3. Run 'npm run validate:collections' to validate");
    console.log("4. Run 'npm start' to generate documentation");
    console.log("\n📄 Collection template contents:");
    console.log(template);
  } catch (error) {
    console.error(`❌ Error creating collection template: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the interactive creation process
createCollectionTemplate();
