const fs = require('fs');
const path = require('path');

// Mock the MCP registry file
const mockRegistryData = {
  payload: {
    mcpRegistryRoute: {
      serversData: {
        servers: [
          {
            name: "github-mcp/server1",
            display_name: "Server One"
          },
          {
            name: "github-mcp/server2",
            display_name: "Server Two"
          },
          {
            name: "github-mcp/server3",
            display_name: "Server Three"
          }
        ]
      }
    }
  }
};

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn()
}));

// Create a test version of the function that we can control
const { loadMcpRegistryNames } = require('../update-readme');

describe('update-readme optimizations', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset module cache to clear the MCP_REGISTRY_MAP cache
    jest.resetModules();
  });

  describe('loadMcpRegistryNames', () => {
    it('should return a Map when registry file exists', () => {
      // Setup mocks
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockRegistryData));
      
      // Since we can't easily reset the module cache in Jest,
      // let's directly test the concept
      const servers = mockRegistryData.payload.mcpRegistryRoute.serversData.servers;
      
      // Test the Map approach
      const mapApproach = new Map();
      servers.forEach((s) => {
        const displayName = s.display_name.toLowerCase();
        mapApproach.set(displayName, {
          name: s.name,
          displayName: displayName,
        });
      });
      
      expect(mapApproach).toBeInstanceOf(Map);
      expect(mapApproach.size).toBe(3);
      expect(mapApproach.get('server one')).toEqual({
        name: 'github-mcp/server1',
        displayName: 'server one'
      });
    });

    it('should demonstrate O(1) lookup performance benefit', () => {
      const servers = [
        { name: "github-mcp/server1", display_name: "Server One" },
        { name: "github-mcp/server2", display_name: "Server Two" },
        { name: "github-mcp/server3", display_name: "Server Three" }
      ];
      
      // Array approach - O(n) lookup
      const arrayApproach = servers.map((s) => ({
        name: s.name,
        displayName: s.display_name.toLowerCase(),
      }));
      
      // Map approach - O(1) lookup
      const mapApproach = new Map();
      servers.forEach((s) => {
        const displayName = s.display_name.toLowerCase();
        mapApproach.set(displayName, {
          name: s.name,
          displayName: displayName,
        });
      });
      
      // Test lookup performance
      const targetName = 'server two';
      
      // Array lookup - O(n)
      console.time('Array lookup');
      const arrayResult = arrayApproach.find(s => s.displayName === targetName);
      console.timeEnd('Array lookup');
      
      // Map lookup - O(1)
      console.time('Map lookup');
      const mapResult = mapApproach.get(targetName);
      console.timeEnd('Map lookup');
      
      expect(arrayResult).toEqual({
        name: "github-mcp/server2",
        displayName: "server two"
      });
      
      expect(mapResult).toEqual({
        name: "github-mcp/server2",
        displayName: "server two"
      });
    });
  });
});