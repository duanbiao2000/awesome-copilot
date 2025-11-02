/**
 * Educational Note: Template Method Pattern Implementation
 * 
 * The following three functions (generateInstructionsSection, generatePromptsSection, 
 * and generateChatModesSection) have been refactored to use a common template method pattern.
 * This reduces code duplication and makes the codebase more maintainable.
 * 
 * The template method pattern defines the skeleton of an algorithm in a base function,
 * letting subclasses (or in our case, specialized functions) override specific steps
 * without changing the algorithm's structure.
 */

/**
 * Educational Note: Configuration Object Pattern
 * 
 * We use a configuration object to define the specific behavior for each content type.
 * This approach is flexible and makes it easy to add new content types in the future.
 * Each configuration object contains:
 * - dir: The directory to scan
 * - extension: The file extension to filter for
 * - linkPrefix: The URL path prefix for links
 * - badgeType: The type of badge to generate
 * - descriptionFallback: A function to generate a fallback description if none is found
 * - sectionTemplate: The template for the section header
 * - usageTemplate: The template for the usage instructions
 */

// Configuration for instructions content
const INSTRUCTIONS_CONFIG = {
  dir: INSTRUCTIONS_DIR,
  extension: ".instructions.md",
  linkPrefix: "instructions",
  badgeType: "instructions",
  descriptionFallback: (title) => {
    // Extract the topic from the title (last word) and create a default description
    const topic = title.split(" ").pop().replace(/s$/, "");
    return `${topic} specific coding standards and best practices`;
  },
  sectionTemplate: TEMPLATES.instructionsSection,
  usageTemplate: TEMPLATES.instructionsUsage,
};

// Configuration for prompts content
const PROMPTS_CONFIG = {
  dir: PROMPTS_DIR,
  extension: ".prompt.md",
  linkPrefix: "prompts",
  badgeType: "prompt",
  descriptionFallback: () => "", // No default description for prompts
  sectionTemplate: TEMPLATES.promptsSection,
  usageTemplate: TEMPLATES.promptsUsage,
};

/**
 * Educational Note: Template Method Function
 * 
 * This function implements the template method pattern, defining the common algorithm
 * for generating content sections. The specific behavior is determined by the
 * configuration object passed as a parameter.
 * 
 * The algorithm steps are:
 * 1. Check if the directory exists
 * 2. Get all files with the specified extension
 * 3. Extract titles and create entry objects
 * 4. Sort entries by title
 * 5. Generate table content
 * 6. Return the formatted section
 * 
 * @param {Object} config - Configuration object defining the content type behavior
 * @returns {string} Formatted markdown section
 */
function generateContentSection(config) {
  // Destructure configuration object for easier access
  const {
    dir,
    extension,
    linkPrefix,
    badgeType,
    descriptionFallback,
    sectionTemplate,
    usageTemplate,
  } = config;

  // Step 1: Check if directory exists
  if (!fs.existsSync(dir)) {
    return "";
  }

  // Step 2: Get all files with the specified extension
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(extension));

  // Step 3: Extract titles and create entry objects
  const entries = files.map((file) => {
    const filePath = path.join(dir, file);
    const title = extractTitle(filePath);
    return { file, filePath, title };
  });

  // Step 4: Sort entries by title
  entries.sort((a, b) => a.title.localeCompare(b.title));
  console.log(`Found ${entries.length} ${extension.replace('.md', '')} files`);

  // Step 5: Return empty string if no files found
  if (entries.length === 0) {
    return "";
  }

  // Step 6: Generate table content
  // Create table header
  let content = "| Title | Description |
| ----- | ----------- |
";

  // Generate table rows for each file
  for (const { file, filePath, title } of entries) {
    const link = encodeURI(`${linkPrefix}/${file}`);

    // Check if there's a description in the frontmatter
    const customDescription = extractDescription(filePath);

    // Create badges for installation links
    const badges = makeBadges(link, badgeType);

    // Use custom description if available, otherwise use fallback
    const description = (customDescription && customDescription !== "null") 
      ? customDescription 
      : descriptionFallback(title);

    content += `| [${title}](../${link})<br />${badges} | ${description} |
`;
  }

  // Step 7: Return the formatted section
  return `${sectionTemplate}
${usageTemplate}

${content}`;
}

/**
 * Educational Note: Specialized Functions
 * 
 * These functions are now much simpler, as they just call the template method
 * function with the appropriate configuration. This is a classic example of the
 * template method pattern in action.
 */

/**
 * Generate the instructions section with a table of all instructions
 */
function generateInstructionsSection() {
  return generateContentSection(INSTRUCTIONS_CONFIG);
}

/**
 * Generate the prompts section with a table of all prompts
 */
function generatePromptsSection() {
  return generateContentSection(PROMPTS_CONFIG);
}

/**
 * Generate the chat modes section with a table of all chat modes
 */
function generateChatModesSection() {
  return generateUnifiedModeSection({
    dir: CHATMODES_DIR,
    extension: ".chatmode.md",
    linkPrefix: "chatmodes",
    badgeType: "mode",
    includeMcpServers: false,
    sectionTemplate: TEMPLATES.chatmodesSection,
    usageTemplate: TEMPLATES.chatmodesUsage,
  });
}
