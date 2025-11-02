---
# Educational Note: Agent Fixture
# 
# This is an agent file with MCP server configurations,
# used for testing extractAgentMetadata, extractMcpServers,
# and extractMcpServerConfigs functions.
# 
# The frontmatter includes:
# - Basic agent metadata (name, description)
# - Tool configurations
# - Multiple MCP server configurations (stdio and http)

name: Test Agent
description: An agent for testing
tools:
  - name: test-tool
    description: A test tool
    parameters:
      - name: input
        type: string
        required: true
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
      Content-Type: application/json
---

# Educational Note: Agent Content
# 
# The content of an agent file typically includes:
# 1. Description of the agent's purpose
# 2. Usage instructions
# 3. Examples of how to use the agent

## Purpose

This is a test agent used for unit testing of the yaml-parser module.

## Usage

To use this agent:

1. Install the required MCP servers
2. Configure the servers with the provided settings
3. Connect the agent to your development environment

## Examples

```javascript
const agentConfig = {
  name: "Test Agent",
  servers: {
    "test-server": {
      type: "stdio",
      command: "test-command",
      args: ["--option1", "--option2"]
    },
    "http-server": {
      type: "http",
      url: "https://example.com/api",
      headers: {
        "Authorization": "Bearer token",
        "Content-Type": "application/json"
      }
    }
  }
};
```
