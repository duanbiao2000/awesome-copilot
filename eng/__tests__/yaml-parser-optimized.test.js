/**
 * Educational Note: Test Suite for yaml-parser.js
 * 
 * This test suite uses Jest to test the functionality of the yaml-parser module.
 * It demonstrates several testing patterns:
 * 1. Unit testing of individual functions
 * 2. Mocking file system operations
 * 3. Testing both success and error scenarios
 * 4. Using fixtures for consistent test data
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const {
  parseCollectionYaml,
  parseFrontmatter,
  extractAgentMetadata,
  extractMcpServers,
  extractMcpServerConfigs,
  safeFileOperation,
  validatePath,
} = require('../yaml-parser-optimized');

// Educational Note: Test Fixtures
// Fixtures provide consistent test data across multiple tests
// They ensure tests are repeatable and independent of actual file system

const fixturesDir = path.join(__dirname, 'fixtures');
const validCollectionFixture = path.join(fixturesDir, 'valid-collection.yml');
const invalidCollectionFixture = path.join(fixturesDir, 'invalid-collection.yml');
const validMarkdownFixture = path.join(fixturesDir, 'valid-markdown.md');
const agentFixture = path.join(fixturesDir, 'sample-agent.md');

// Educational Note: Test Setup
// Before running tests, ensure fixtures directory exists
// This is a common pattern in test suites to prepare test environment

beforeAll(() => {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  // Create a valid collection fixture
  fs.writeFileSync(validCollectionFixture, yaml.dump({
    id: 'test-collection',
    name: 'Test Collection',
    description: 'A test collection for unit testing',
    items: [
      { type: 'prompt', path: 'test.prompt.md' },
      { type: 'instruction', path: 'test.instructions.md' }
    ]
  }));

  // Create an invalid collection fixture
  fs.writeFileSync(invalidCollectionFixture, 'invalid: yaml: content: [');

  // Create a valid markdown fixture with frontmatter
  fs.writeFileSync(validMarkdownFixture, `---
name: Test Markdown
title: A Test Markdown File
description: This is a test file with frontmatter
---

# Test Content

This is the content of the test markdown file.
`);

  // Create an agent fixture with MCP server configuration
  fs.writeFileSync(agentFixture, `---
name: Test Agent
description: An agent for testing
tools:
  - name: test-tool
    description: A test tool
mcp-servers:
  test-server:
    type: stdio
    command: test-command
    args:
      - --option1
      - --option2
  http-server:
    type: http
    url: https://example.com/api
    headers:
      Authorization: Bearer token
---
`);
});

// Educational Note: Test Cleanup
// After running tests, clean up fixtures
// This ensures tests don't leave artifacts on the file system

afterAll(() => {
  if (fs.existsSync(fixturesDir)) {
    fs.rmSync(fixturesDir, { recursive: true, force: true });
  }
});

describe('yaml-parser-optimized', () => {
  describe('safeFileOperation', () => {
    test('should return operation result when successful', () => {
      const result = safeFileOperation(() => 'success', 'test-file');
      expect(result).toBe('success');
    });

    test('should return default value when operation throws', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = safeFileOperation(() => {
        throw new Error('Test error');
      }, 'test-file', 'default');

      expect(result).toBe('default');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error processing file test-file: Test error')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('validatePath', () => {
    test('should validate paths within allowed directory', () => {
      const allowedDir = path.resolve(__dirname, '..');
      const validPath = path.join(allowedDir, 'test-file.txt');

      expect(validatePath(validPath, allowedDir)).toBe(true);
    });

    test('should reject paths outside allowed directory', () => {
      const allowedDir = path.resolve(__dirname, '..');
      const invalidPath = path.resolve(__dirname, '..', '..', 'outside-file.txt');

      expect(validatePath(invalidPath, allowedDir)).toBe(false);
    });

    test('should handle invalid paths gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(validatePath(null)).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('parseCollectionYaml', () => {
    test('should parse valid YAML collection file', () => {
      const result = parseCollectionYaml(validCollectionFixture);

      expect(result).toBeDefined();
      expect(result.id).toBe('test-collection');
      expect(result.name).toBe('Test Collection');
      expect(result.items).toHaveLength(2);
    });

    test('should return null for invalid YAML', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = parseCollectionYaml(invalidCollectionFixture);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('should return null for invalid path', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = parseCollectionYaml('/nonexistent/file.yml');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('parseFrontmatter', () => {
    test('should parse frontmatter from valid markdown file', () => {
      const result = parseFrontmatter(validMarkdownFixture);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Markdown');
      expect(result.title).toBe('A Test Markdown File');
      expect(result.description).toBe('This is a test file with frontmatter');
    });

    test('should normalize string fields', () => {
      // Create a file with trailing whitespace
      const testFile = path.join(fixturesDir, 'whitespace-test.md');
      fs.writeFileSync(testFile, `---
name: Test Name   
title: Test Title   
description: Test Description   
---

# Content
`);

      const result = parseFrontmatter(testFile);

      expect(result.name).toBe('Test Name');
      expect(result.title).toBe('Test Title');
      expect(result.description).toBe('Test Description');
    });

    test('should return null for invalid path', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = parseFrontmatter('/nonexistent/file.md');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('extractAgentMetadata', () => {
    test('should extract metadata from agent file', () => {
      const result = extractAgentMetadata(agentFixture);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Agent');
      expect(result.description).toBe('An agent for testing');
      expect(result.tools).toHaveLength(1);
      expect(result.mcpServers).toBeDefined();
      expect(Object.keys(result.mcpServers)).toHaveLength(2);
    });

    test('should handle missing fields gracefully', () => {
      // Create a file with minimal frontmatter
      const testFile = path.join(fixturesDir, 'minimal-agent.md');
      fs.writeFileSync(testFile, `---
name: Minimal Agent
---
`);

      const result = extractAgentMetadata(testFile);

      expect(result.name).toBe('Minimal Agent');
      expect(result.description).toBeNull();
      expect(result.tools).toEqual([]);
      expect(result.mcpServers).toEqual({});
    });

    test('should return null for invalid path', () => {
      const result = extractAgentMetadata('/nonexistent/agent.md');
      expect(result).toBeNull();
    });
  });

  describe('extractMcpServers', () => {
    test('should extract server names from agent file', () => {
      const result = extractMcpServers(agentFixture);

      expect(result).toEqual(['test-server', 'http-server']);
    });

    test('should return empty array for agent with no servers', () => {
      // Create a file with no MCP servers
      const testFile = path.join(fixturesDir, 'no-servers-agent.md');
      fs.writeFileSync(testFile, `---
name: No Servers Agent
---
`);

      const result = extractMcpServers(testFile);
      expect(result).toEqual([]);
    });

    test('should return empty array for invalid path', () => {
      const result = extractMcpServers('/nonexistent/agent.md');
      expect(result).toEqual([]);
    });
  });

  describe('extractMcpServerConfigs', () => {
    test('should extract server configs from agent file', () => {
      const result = extractMcpServerConfigs(agentFixture);

      expect(result).toHaveLength(2);

      // Check stdio server config
      const stdioServer = result.find(s => s.name === 'test-server');
      expect(stdioServer.type).toBe('stdio');
      expect(stdioServer.command).toBe('test-command');
      expect(stdioServer.args).toEqual(['--option1', '--option2']);
      expect(stdioServer.url).toBeUndefined();
      expect(stdioServer.headers).toBeUndefined();

      // Check http server config
      const httpServer = result.find(s => s.name === 'http-server');
      expect(httpServer.type).toBe('http');
      expect(httpServer.url).toBe('https://example.com/api');
      expect(httpServer.headers).toEqual({ Authorization: 'Bearer token' });
      expect(httpServer.command).toBeUndefined();
      expect(httpServer.args).toBeUndefined();
    });

    test('should return empty array for agent with no servers', () => {
      // Create a file with no MCP servers
      const testFile = path.join(fixturesDir, 'no-servers-agent.md');
      fs.writeFileSync(testFile, `---
name: No Servers Agent
---
`);

      const result = extractMcpServerConfigs(testFile);
      expect(result).toEqual([]);
    });

    test('should return empty array for invalid path', () => {
      const result = extractMcpServerConfigs('/nonexistent/agent.md');
      expect(result).toEqual([]);
    });
  });
});
