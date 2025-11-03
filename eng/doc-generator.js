#!/usr/bin/env node

// Note 1: Document Generator Class
// This module encapsulates all the logic for generating documentation files.
// It follows the single responsibility principle by focusing only on document generation.
// The class is designed to be easily extensible for new content types.

const fs = require("fs");
const path = require("path");
const {
  parseCollectionYaml,
  extractMcpServerConfigs,
  parseFrontmatter,
} = require("./yaml-parser");
const {
  TEMPLATES,
  AKA_INSTALL_URLS,
  repoBaseUrl,
  vscodeInstallImage,
  vscodeInsidersInstallImage,
  ROOT_FOLDER,
  PROMPTS_DIR,
  CHATMODES_DIR,
  AGENTS_DIR,
  COLLECTIONS_DIR,
  INSTRUCTIONS_DIR,
  DOCS_DIR,
} = require("./constants");

// Cache of MCP registry server names (lower-cased) loaded from github-mcp-registry.json
let MCP_REGISTRY_MAP = null;

class DocGenerator {
  constructor() {
    // Initialize any required properties
  }

  /**
   * Loads and caches the set of MCP registry server display names (lowercased).
   *
   * @returns {Map<string, { name: string, displayName: string }>} A Map of lowercased server display names.
   */
  loadMcpRegistryNames() {
    // Return cached result if available
    if (MCP_REGISTRY_MAP) return MCP_REGISTRY_MAP;
    
    try {
      const registryPath = path.join(__dirname, "github-mcp-registry.json");
      if (!fs.existsSync(registryPath)) {
        MCP_REGISTRY_MAP = new Map();
        return MCP_REGISTRY_MAP;
      }
      const raw = fs.readFileSync(registryPath, "utf8");
      const json = JSON.parse(raw);
      const servers = json?.payload?.mcpRegistryRoute?.serversData?.servers || [];
      
      // Using Map for O(1) lookup performance
      MCP_REGISTRY_MAP = new Map();
      servers.forEach((s) => {
        const displayName = s.display_name.toLowerCase();
        MCP_REGISTRY_MAP.set(displayName, {
          name: s.name,
          displayName: displayName,
        });
      });
    } catch (e) {
      console.warn(`Failed to load MCP registry: ${e.message}`);
      MCP_REGISTRY_MAP = new Map();
    }
    return MCP_REGISTRY_MAP;
  }

  /**
   * Extract title from a file
   * @param {string} filePath - Path to the file
   * @returns {string} Extracted title
   */
  extractTitle(filePath) {
    return require("./utils").safeFileOperation(
      () => {
        const content = fs.readFileSync(filePath, "utf8");
        const lines = content.split("\n");

        // Step 1: Try to get title from frontmatter using vfile-matter
        const frontmatter = parseFrontmatter(filePath);

        if (frontmatter) {
          // Check for title field
          if (frontmatter.title && typeof frontmatter.title === "string") {
            return frontmatter.title;
          }

          // Check for name field and convert to title case
          if (frontmatter.name && typeof frontmatter.name === "string") {
            return frontmatter.name
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
        }

        // Step 2: For prompt/chatmode/instructions files, look for heading after frontmatter
        if (
          filePath.includes(".prompt.md") ||
          filePath.includes(".chatmode.md") ||
          filePath.includes(".instructions.md")
        ) {
          // Look for first heading after frontmatter
          let inFrontmatter = false;
          let frontmatterEnded = false;
          let inCodeBlock = false;

          for (const line of lines) {
            if (line.trim() === "---") {
              if (!inFrontmatter) {
                inFrontmatter = true;
              } else if (inFrontmatter && !frontmatterEnded) {
                frontmatterEnded = true;
              }
              continue;
            }

            // Only look for headings after frontmatter ends
            if (frontmatterEnded || !inFrontmatter) {
              // Track code blocks to ignore headings inside them
              if (
                line.trim().startsWith("```") ||
                line.trim().startsWith("````")
              ) {
                inCodeBlock = !inCodeBlock;
                continue;
              }

              if (!inCodeBlock && line.startsWith("# ")) {
                return line.substring(2).trim();
              }
            }
          }

          // Step 3: Format filename for prompt/chatmode/instructions files if no heading found
          const basename = path.basename(
            filePath,
            filePath.includes(".prompt.md")
              ? ".prompt.md"
              : filePath.includes(".chatmode.md")
                ? ".chatmode.md"
                : ".instructions.md"
          );
          return basename
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }

        // Step 4: For other files, look for the first heading (but not in code blocks)
        let inCodeBlock = false;
        for (const line of lines) {
          if (line.trim().startsWith("```") || line.trim().startsWith("````")) {
            inCodeBlock = !inCodeBlock;
            continue;
          }

          if (!inCodeBlock && line.startsWith("# ")) {
            return line.substring(2).trim();
          }
        }

        // Step 5: Fallback to filename
        const basename = path.basename(filePath, path.extname(filePath));
        return basename
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      },
      filePath,
      path
        .basename(filePath, path.extname(filePath))
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );
  }

  /**
   * Extract description from a file
   * @param {string} filePath - Path to the file
   * @returns {string|null} Extracted description or null
   */
  extractDescription(filePath) {
    return require("./utils").safeFileOperation(
      () => {
        // Use vfile-matter to parse frontmatter for all file types
        const frontmatter = parseFrontmatter(filePath);

        if (frontmatter && frontmatter.description) {
          return frontmatter.description;
        }

        return null;
      },
      filePath,
      null
    );
  }

  /**
   * Generate badge links
   * @param {string} link - Link to the resource
   * @param {string} type - Type of resource
   * @returns {string} HTML for badges
   */
  makeBadges(link, type) {
    const aka = AKA_INSTALL_URLS[type] || AKA_INSTALL_URLS.instructions;

    const vscodeUrl = `${aka}?url=${encodeURIComponent(
      `vscode:chat-${type}/install?url=${repoBaseUrl}/${link}`
    )}`;
    const insidersUrl = `${aka}?url=${encodeURIComponent(
      `vscode-insiders:chat-${type}/install?url=${repoBaseUrl}/${link}`
    )}`;

    return `[![Install in VS Code](${vscodeInstallImage})](${vscodeUrl})<br />[![Install in VS Code Insiders](${vscodeInsidersInstallImage})](${insidersUrl})`;
  }

  /**
   * Generate the instructions section with a table of all instructions
   */
  generateInstructionsSection(instructionsDir = INSTRUCTIONS_DIR) {
    // Check if directory exists
    if (!fs.existsSync(instructionsDir)) {
      return "";
    }

    // Get all instruction files
    const instructionFiles = fs
      .readdirSync(instructionsDir)
      .filter((file) => file.endsWith(".instructions.md"));

    // Map instruction files to objects with title for sorting
    const instructionEntries = instructionFiles.map((file) => {
      const filePath = path.join(instructionsDir, file);
      const title = this.extractTitle(filePath);
      return { file, filePath, title };
    });

    // Sort by title alphabetically
    instructionEntries.sort((a, b) => a.title.localeCompare(b.title));

    console.log(`Found ${instructionEntries.length} instruction files`);

    // Return empty string if no files found
    if (instructionEntries.length === 0) {
      return "";
    }

    // Create table header
    let instructionsContent =
      "| Title | Description |\n| ----- | ----------- |\n";

    // Generate table rows for each instruction file
    for (const entry of instructionEntries) {
      const { file, filePath, title } = entry;
      const link = encodeURI(`instructions/${file}`);

      // Check if there's a description in the frontmatter
      const customDescription = this.extractDescription(filePath);

      // Create badges for installation links
      const badges = this.makeBadges(link, "instructions");

      if (customDescription && customDescription !== "null") {
        // Use the description from frontmatter
        instructionsContent += `| [${title}](../${link})<br />${badges} | ${customDescription} |\n`;
      } else {
        // Fallback to the default approach - use last word of title for description, removing trailing 's' if present
        const topic = title.split(" ").pop().replace(/s$/, "");
        instructionsContent += `| [${title}](../${link})<br />${badges} | ${topic} specific coding standards and best practices |\n`;
      }
    }

    return `${TEMPLATES.instructionsSection}\n${TEMPLATES.instructionsUsage}\n\n${instructionsContent}`;
  }

  /**
   * Generate the prompts section with a table of all prompts
   */
  generatePromptsSection(promptsDir = PROMPTS_DIR) {
    // Check if directory exists
    if (!fs.existsSync(promptsDir)) {
      return "";
    }

    // Get all prompt files
    const promptFiles = fs
      .readdirSync(promptsDir)
      .filter((file) => file.endsWith(".prompt.md"));

    // Map prompt files to objects with title for sorting
    const promptEntries = promptFiles.map((file) => {
      const filePath = path.join(promptsDir, file);
      const title = this.extractTitle(filePath);
      return { file, filePath, title };
    });

    // Sort by title alphabetically
    promptEntries.sort((a, b) => a.title.localeCompare(b.title));

    console.log(`Found ${promptEntries.length} prompt files`);

    // Return empty string if no files found
    if (promptEntries.length === 0) {
      return "";
    }

    // Create table header
    let promptsContent = "| Title | Description |\n| ----- | ----------- |\n";

    // Generate table rows for each prompt file
    for (const entry of promptEntries) {
      const { file, filePath, title } = entry;
      const link = encodeURI(`prompts/${file}`);

      // Check if there's a description in the frontmatter
      const customDescription = this.extractDescription(filePath);

      // Create badges for installation links
      const badges = this.makeBadges(link, "prompt");

      if (customDescription && customDescription !== "null") {
        promptsContent += `| [${title}](../${link})<br />${badges} | ${customDescription} |\n`;
      } else {
        promptsContent += `| [${title}](../${link})<br />${badges} | | |\n`;
      }
    }

    return `${TEMPLATES.promptsSection}\n${TEMPLATES.promptsUsage}\n\n${promptsContent}`;
  }

  /**
   * Generate MCP server links for an agent
   * @param {string[]} servers - Array of MCP server names
   * @returns {string} - Formatted MCP server links with badges
   */
  generateMcpServerLinks(servers) {
    if (!servers || servers.length === 0) {
      return "";
    }

    const badges = [
      {
        type: "vscode",
        url: "https://img.shields.io/badge/Install-VS_Code-0098FF?style=flat-square",
        badgeUrl: (serverName) =>
          `https://aka.ms/awesome-copilot/install/mcp-vscode?vscode:mcp/by-name/${serverName}/mcp-server`,
      },
      {
        type: "insiders",
        url: "https://img.shields.io/badge/Install-VS_Code_Insiders-24bfa5?style=flat-square",
        badgeUrl: (serverName) =>
          `https://aka.ms/awesome-copilot/install/mcp-vscode?vscode-insiders:mcp/by-name/${serverName}/mcp-server`,
      },
      {
        type: "visualstudio",
        url: "https://img.shields.io/badge/Install-Visual_Studio-C16FDE?style=flat-square",
        badgeUrl: (serverName) =>
          `https://aka.ms/awesome-copilot/install/mcp-visualstudio?vscode:mcp/by-name/${serverName}/mcp-server`,
      },
    ];

    const registryNames = this.loadMcpRegistryNames();

    return servers
      .map((entry) => {
        // Support either a string name or an object with config
        const serverObj = typeof entry === "string" ? { name: entry } : entry;
        const serverName = String(serverObj.name).trim();

        // Build config-only JSON (no name/type for stdio; just command+args+env)
        let configPayload = {};
        if (serverObj.type && serverObj.type.toLowerCase() === "http") {
          // HTTP: url + headers
          configPayload = {
            url: serverObj.url || "",
            headers: serverObj.headers || {},
          };
        } else {
          // Local/stdio: command + args + env
          configPayload = {
            command: serverObj.command || "",
            args: Array.isArray(serverObj.args)
              ? serverObj.args.map(encodeURIComponent)
              : [],
            env: serverObj.env || {},
          };
        }

        const encodedConfig = encodeURIComponent(JSON.stringify(configPayload));

        const installBadgeUrls = [
          `[![Install MCP](${badges[0].url})](https://aka.ms/awesome-copilot/install/mcp-vscode?name=${serverName}&config=${encodedConfig})`,
          `[![Install MCP](${badges[1].url})](https://aka.ms/awesome-copilot/install/mcp-vscodeinsiders?name=${serverName}&config=${encodedConfig})`,
          `[![Install MCP](${badges[2].url})](https://aka.ms/awesome-copilot/install/mcp-visualstudio/mcp-install?${encodedConfig})`,
        ].join("<br />");

        // Use Map's get method for O(1) lookup
        const registryEntry = registryNames.get(serverName.toLowerCase());
        const serverLabel = registryEntry
          ? `[${serverName}](${`https://github.com/mcp/${registryEntry.name}`})`
          : serverName;
        return `${serverLabel}<br />${installBadgeUrls}`;
      })
      .join("<br />");
  }

  /**
   * Generate the agents section with a table of all agents
   */
  generateAgentsSection(agentsDir = AGENTS_DIR) {
    return this.generateUnifiedModeSection({
      dir: agentsDir,
      extension: ".agent.md",
      linkPrefix: "agents",
      badgeType: "agent",
      includeMcpServers: true,
      sectionTemplate: TEMPLATES.agentsSection,
      usageTemplate: TEMPLATES.agentsUsage,
    });
  }

  /**
   * Generate the chat modes section with a table of all chat modes
   */
  generateChatModesSection(chatmodesDir = CHATMODES_DIR) {
    return this.generateUnifiedModeSection({
      dir: chatmodesDir,
      extension: ".chatmode.md",
      linkPrefix: "chatmodes",
      badgeType: "mode",
      includeMcpServers: false,
      sectionTemplate: TEMPLATES.chatmodesSection,
      usageTemplate: TEMPLATES.chatmodesUsage,
    });
  }

  /**
   * Unified generator for chat modes & agents
   * Handles common patterns for generating documentation tables while allowing
   * for content-specific customization (e.g., MCP server info for agents).
   *
   * @param {Object} cfg Configuration object
   * @param {string} cfg.dir - Directory to scan for content files
   * @param {string} cfg.extension - File type to process (.chatmode.md, .agent.md)
   * @param {string} cfg.linkPrefix - URL path prefix for content type
   * @param {string} cfg.badgeType - Type for install badge generation
   * @param {boolean} cfg.includeMcpServers - Add MCP server column (agents only)
   * @param {string} cfg.sectionTemplate - Markdown section header
   * @param {string} cfg.usageTemplate - Usage instructions template
   */
  generateUnifiedModeSection(cfg) {
    const {
      dir,
      extension,
      linkPrefix,
      badgeType,
      includeMcpServers,
      sectionTemplate,
      usageTemplate,
    } = cfg;

    if (!fs.existsSync(dir)) {
      console.log(`Directory missing for unified mode section: ${dir}`);
      return "";
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(extension));

    const entries = files.map((file) => {
      const filePath = path.join(dir, file);
      return { file, filePath, title: this.extractTitle(filePath) };
    });

    entries.sort((a, b) => a.title.localeCompare(b.title));
    console.log(
      `Unified mode generator: ${entries.length} files for extension ${extension}`
    );
    if (entries.length === 0) return "";

    let header = "| Title | Description |";
    if (includeMcpServers) header += " MCP Servers |";
    let separator = "| ----- | ----------- |";
    if (includeMcpServers) separator += " ----------- |";

    let content = `${header}\n${separator}\n`;

    for (const { file, filePath, title } of entries) {
      const link = encodeURI(`${linkPrefix}/${file}`);
      const description = this.extractDescription(filePath);
      const badges = this.makeBadges(link, badgeType);
      let mcpServerCell = "";
      if (includeMcpServers) {
        const servers = extractMcpServerConfigs(filePath);
        mcpServerCell = this.generateMcpServerLinks(servers);
      }

      if (includeMcpServers) {
        content += `| [${title}](../${link})<br />${badges} | ${description && description !== "null" ? description : ""
          } | ${mcpServerCell} |\n`;
      } else {
        content += `| [${title}](../${link})<br />${badges} | ${description && description !== "null" ? description : ""
          } |\n`;
      }
    }

    return `${sectionTemplate}\n${usageTemplate}\n\n${content}`;
  }

  /**
   * Generate the collections section with a table of all collections
   * Scans the collections directory for .collection.yml files and generates
   * a formatted table showing each collection's contents and metadata.
   */
  generateCollectionsSection(collectionsDir = COLLECTIONS_DIR) {
    // Check if collections directory exists, create it if it doesn't
    if (!fs.existsSync(collectionsDir)) {
      console.log("Collections directory does not exist, creating it...");
      fs.mkdirSync(collectionsDir, { recursive: true });
    }

    // Get all collection files
    const collectionFiles = fs
      .readdirSync(collectionsDir)
      .filter((file) => file.endsWith(".collection.yml"));

    // Map collection files to objects with name for sorting
    const collectionEntries = collectionFiles
      .map((file) => {
        const filePath = path.join(collectionsDir, file);
        const collection = parseCollectionYaml(filePath);

        if (!collection) {
          console.warn(`Failed to parse collection: ${file}`);
          return null;
        }

        const collectionId =
          collection.id || path.basename(file, ".collection.yml");
        const name = collection.name || collectionId;
        const isFeatured = collection.display?.featured === true;
        return { file, filePath, collection, collectionId, name, isFeatured };
      })
      .filter((entry) => entry !== null); // Remove failed parses

    // Separate featured and regular collections
    const featuredCollections = collectionEntries.filter(
      (entry) => entry.isFeatured
    );
    const regularCollections = collectionEntries.filter(
      (entry) => !entry.isFeatured
    );

    // Sort each group alphabetically by name
    featuredCollections.sort((a, b) => a.name.localeCompare(b.name));
    regularCollections.sort((a, b) => a.name.localeCompare(b.name));

    // Combine: featured first, then regular
    const sortedEntries = [...featuredCollections, ...regularCollections];

    console.log(
      `Found ${collectionEntries.length} collection files (${featuredCollections.length} featured)`
    );

    // If no collections, return empty string
    if (sortedEntries.length === 0) {
      return "";
    }

    // Create table header
    let collectionsContent =
      "| Name | Description | Items | Tags |\n| ---- | ----------- | ----- | ---- |\n";

    // Generate table rows for each collection file
    for (const entry of sortedEntries) {
      const { collection, collectionId, name, isFeatured } = entry;
      const description = collection.description || "No description";
      const itemCount = collection.items ? collection.items.length : 0;
      const tags = collection.tags ? collection.tags.join(", ") : "";

      const link = `../collections/${collectionId}.md`;
      const displayName = isFeatured ? `⭐ ${name}` : name;

      collectionsContent += `| [${displayName}](${link}) | ${description} | ${itemCount} items | ${tags} |\n`;
    }

    return `${TEMPLATES.collectionsSection}\n${TEMPLATES.collectionsUsage}\n\n${collectionsContent}`;
  }

  /**
   * Generate the featured collections section for the main README
   */
  generateFeaturedCollectionsSection(collectionsDir = COLLECTIONS_DIR) {
    // Check if collections directory exists
    if (!fs.existsSync(collectionsDir)) {
      return "";
    }

    // Get all collection files
    const collectionFiles = fs
      .readdirSync(collectionsDir)
      .filter((file) => file.endsWith(".collection.yml"));

    // Map collection files to objects with name for sorting, filter for featured
    const featuredCollections = collectionFiles
      .map((file) => {
        const filePath = path.join(collectionsDir, file);
        return require("./utils").safeFileOperation(
          () => {
            const collection = parseCollectionYaml(filePath);
            if (!collection) return null;

            // Only include collections with featured: true
            if (!collection.display?.featured) return null;

            const collectionId =
              collection.id || path.basename(file, ".collection.yml");
            const name = collection.name || collectionId;
            const description = collection.description || "No description";
            const tags = collection.tags ? collection.tags.join(", ") : "";
            const itemCount = collection.items ? collection.items.length : 0;

            return {
              file,
              collection,
              collectionId,
              name,
              description,
              tags,
              itemCount,
            };
          },
          filePath,
          null
        );
      })
      .filter((entry) => entry !== null); // Remove non-featured and failed parses

    // Sort by name alphabetically
    featuredCollections.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`Found ${featuredCollections.length} featured collection(s)`);

    // If no featured collections, return empty string
    if (featuredCollections.length === 0) {
      return "";
    }

    // Create table header
    let featuredContent =
      "| Name | Description | Items | Tags |\n| ---- | ----------- | ----- | ---- |\n";

    // Generate table rows for each featured collection
    for (const entry of featuredCollections) {
      const { collectionId, name, description, tags, itemCount } = entry;
      const readmeLink = `collections/${collectionId}.md`;

      featuredContent += `| [${name}](${readmeLink}) | ${description} | ${itemCount} items | ${tags} |\n`;
    }

    return `${TEMPLATES.featuredCollectionsSection}\n\n${featuredContent}`;
  }

  /**
   * Generate individual collection README file
   * Creates a detailed markdown document explaining the collection's
   * contents and how to use them.
   */
  generateCollectionReadme(collection, collectionId) {
    if (!collection || !collection.items) {
      return `# ${collectionId}\n\nCollection not found or invalid.`;
    }

    const name = collection.name || collectionId;
    const description = collection.description || "No description provided.";
    const tags = collection.tags ? collection.tags.join(", ") : "None";

    let content = `# ${name}

${description}

`;

    if (collection.tags && collection.tags.length > 0) {
      content += `**Tags:** ${tags}\n\n`;
    }

    content += `## Items in this Collection\n\n`;

    // Check if collection has any agents to determine table structure (future: chatmodes may migrate)
    const hasAgents = collection.items.some((item) => item.kind === "agent");

    // Generate appropriate table header
    if (hasAgents) {
      content += `| Title | Type | Description | MCP Servers |\n| ----- | ---- | ----------- | ----------- |\n`;
    } else {
      content += `| Title | Type | Description |\n| ----- | ---- | ----------- |\n`;
    }

    let collectionUsageHeader = "## Collection Usage\n\n";
    let collectionUsageContent = [];

    // Sort items based on display.ordering setting
    const items = [...collection.items];
    if (collection.display?.ordering === "alpha") {
      items.sort((a, b) => {
        const titleA = this.extractTitle(path.join(ROOT_FOLDER, a.path));
        const titleB = this.extractTitle(path.join(ROOT_FOLDER, b.path));
        return titleA.localeCompare(titleB);
      });
    }

    for (const item of items) {
      const filePath = path.join(ROOT_FOLDER, item.path);
      const title = this.extractTitle(filePath);
      const description = this.extractDescription(filePath) || "No description";

      const typeDisplay =
        item.kind === "chat-mode"
          ? "Chat Mode"
          : item.kind === "instruction"
            ? "Instruction"
            : item.kind === "agent"
              ? "Agent"
              : "Prompt";
      const link = `../${item.path}`;

      // Create install badges for each item
      const badges = this.makeBadges(
        item.path,
        item.kind === "instruction"
          ? "instructions"
          : item.kind === "chat-mode"
            ? "mode"
            : item.kind === "agent"
              ? "agent"
              : "prompt"
      );

      const usageDescription = item.usage
        ? `${description} [see usage](#${title
          .replace(/\s+/g, "-")
          .toLowerCase()})`
        : description;

      // Generate MCP server column if collection has agents
      content += this.buildCollectionRow({
        hasAgents,
        title,
        link,
        badges,
        typeDisplay,
        usageDescription,
        filePath,
        kind: item.kind,
      });
      // Generate Usage section for each collection
      if (item.usage && item.usage.trim()) {
        collectionUsageContent.push(
          `### ${title}

${item.usage.trim()}

---

`
        );
      }
    }

    // Append the usage section if any items had usage defined
    if (collectionUsageContent.length > 0) {
      content += `\n${collectionUsageHeader}${collectionUsageContent.join("")}`;
    } else if (collection.display?.show_badge) {
      content += "\n---\n";
    }

    // Optional badge note at the end if show_badge is true
    if (collection.display?.show_badge) {
      content += `*This collection includes ${items.length} curated items for **${name}**.*`;
    }

    return content;
  }

  /**
   * Build a single markdown table row for a collection item.
   * Handles the complexity of different content types and their specific
   * documentation needs, especially MCP server configuration for agents.
   */
  buildCollectionRow({
    hasAgents,
    title,
    link,
    badges,
    typeDisplay,
    usageDescription,
    filePath,
    kind,
  }) {
    if (hasAgents) {
      // Only agents currently have MCP servers; future migration may extend to chat modes.
      const mcpServers =
        kind === "agent" ? extractMcpServerConfigs(filePath) : [];
      const mcpServerCell =
        mcpServers.length > 0 ? this.generateMcpServerLinks(mcpServers) : "";
      return `| [${title}](${link})<br />${badges} | ${typeDisplay} | ${usageDescription} | ${mcpServerCell} |\n`;
    }
    return `| [${title}](${link})<br />${badges} | ${typeDisplay} | ${usageDescription} |\n`;
  }

  /**
   * Utility: write file only if content changed
   */
  writeFileIfChanged(filePath, content) {
    const exists = fs.existsSync(filePath);
    if (exists) {
      const original = fs.readFileSync(filePath, "utf8");
      if (original === content) {
        console.log(
          `${path.basename(filePath)} is already up to date. No changes needed.`
        );
        return;
      }
    }
    fs.writeFileSync(filePath, content);
    console.log(
      `${path.basename(filePath)} ${exists ? "updated" : "created"} successfully!`
    );
  }

  /**
   * Build per-category README content using existing generators, upgrading headings to H1
   */
  buildCategoryReadme(sectionBuilder, dirPath, headerLine, usageLine) {
    const section = sectionBuilder(dirPath);
    if (section && section.trim()) {
      // Upgrade the first markdown heading level from ## to # for standalone README files
      return section.replace(/^##\s/m, "# ");
    }
    // Fallback content when no entries are found
    return `${headerLine}

${usageLine}

_No entries found yet._`;
  }

  /**
   * Main execution method
   */
  async generateAllDocs() {
    try {
      console.log("Generating category README files...");

      // Compose headers for standalone files by converting section headers to H1
      const instructionsHeader = TEMPLATES.instructionsSection.replace(
        /^##\s/m,
        "# "
      );
      const promptsHeader = TEMPLATES.promptsSection.replace(/^##\s/m, "# ");
      const chatmodesHeader = TEMPLATES.chatmodesSection.replace(/^##\s/m, "# ");
      const agentsHeader = TEMPLATES.agentsSection.replace(/^##\s/m, "# ");
      const collectionsHeader = TEMPLATES.collectionsSection.replace(
        /^##\s/m,
        "# "
      );

      const instructionsReadme = this.buildCategoryReadme(
        this.generateInstructionsSection.bind(this),
        INSTRUCTIONS_DIR,
        instructionsHeader,
        TEMPLATES.instructionsUsage
      );
      const promptsReadme = this.buildCategoryReadme(
        this.generatePromptsSection.bind(this),
        PROMPTS_DIR,
        promptsHeader,
        TEMPLATES.promptsUsage
      );
      const chatmodesReadme = this.buildCategoryReadme(
        this.generateChatModesSection.bind(this),
        CHATMODES_DIR,
        chatmodesHeader,
        TEMPLATES.chatmodesUsage
      );

      // Generate agents README
      const agentsReadme = this.buildCategoryReadme(
        this.generateAgentsSection.bind(this),
        AGENTS_DIR,
        agentsHeader,
        TEMPLATES.agentsUsage
      );

      // Generate collections README
      const collectionsReadme = this.buildCategoryReadme(
        this.generateCollectionsSection.bind(this),
        COLLECTIONS_DIR,
        collectionsHeader,
        TEMPLATES.collectionsUsage
      );

      // Ensure docs directory exists for category outputs
      if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
      }

      // Write category outputs into docs folder
      this.writeFileIfChanged(
        path.join(DOCS_DIR, "README.instructions.md"),
        instructionsReadme
      );
      this.writeFileIfChanged(path.join(DOCS_DIR, "README.prompts.md"), promptsReadme);
      this.writeFileIfChanged(
        path.join(DOCS_DIR, "README.chatmodes.md"),
        chatmodesReadme
      );
      this.writeFileIfChanged(path.join(DOCS_DIR, "README.agents.md"), agentsReadme);
      this.writeFileIfChanged(
        path.join(DOCS_DIR, "README.collections.md"),
        collectionsReadme
      );

      // Generate individual collection README files
      if (fs.existsSync(COLLECTIONS_DIR)) {
        console.log("Generating individual collection README files...");

        const collectionFiles = fs
          .readdirSync(COLLECTIONS_DIR)
          .filter((file) => file.endsWith(".collection.yml"));

        for (const file of collectionFiles) {
          const filePath = path.join(COLLECTIONS_DIR, file);
          const collection = parseCollectionYaml(filePath);

          if (collection) {
            const collectionId =
              collection.id || path.basename(file, ".collection.yml");
            const readmeContent = this.generateCollectionReadme(
              collection,
              collectionId
            );
            const readmeFile = path.join(COLLECTIONS_DIR, `${collectionId}.md`);
            this.writeFileIfChanged(readmeFile, readmeContent);
          }
        }
      }

      // Generate featured collections section and update main README.md
      console.log("Updating main README.md with featured collections...");
      const featuredSection = this.generateFeaturedCollectionsSection(COLLECTIONS_DIR);

      if (featuredSection) {
        const mainReadmePath = path.join(ROOT_FOLDER, "README.md");

        if (fs.existsSync(mainReadmePath)) {
          let readmeContent = fs.readFileSync(mainReadmePath, "utf8");

          // Define markers to identify where to insert the featured collections
          const startMarker = "## 🌟 Featured Collections";
          const endMarker = "## MCP Server";

          // Check if the section already exists
          const startIndex = readmeContent.indexOf(startMarker);

          if (startIndex !== -1) {
            // Section exists, replace it
            const endIndex = readmeContent.indexOf(endMarker, startIndex);
            if (endIndex !== -1) {
              // Replace the existing section
              const beforeSection = readmeContent.substring(0, startIndex);
              const afterSection = readmeContent.substring(endIndex);
              readmeContent =
                beforeSection + featuredSection + "\n\n" + afterSection;
            }
          } else {
            // Section doesn't exist, insert it before "## MCP Server"
            const mcpIndex = readmeContent.indexOf(endMarker);
            if (mcpIndex !== -1) {
              const beforeMcp = readmeContent.substring(0, mcpIndex);
              const afterMcp = readmeContent.substring(mcpIndex);
              readmeContent = beforeMcp + featuredSection + "\n\n" + afterMcp;
            }
          }

          this.writeFileIfChanged(mainReadmePath, readmeContent);
          console.log("Main README.md updated with featured collections");
        } else {
          console.warn("README.md not found, skipping featured collections update");
        }
      } else {
        console.log("No featured collections found to add to README.md");
      }
    } catch (error) {
      console.error(`Error generating category README files: ${error.message}`);
      process.exit(1);
    }
  }
}

module.exports = DocGenerator;