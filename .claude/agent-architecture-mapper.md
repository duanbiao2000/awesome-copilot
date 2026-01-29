# Skill: Agent Architecture Mapper

## Purpose
Analyzes agent definitions and configurations to understand agent roles, responsibilities, dependencies, and inter-agent communication patterns. Creates comprehensive architecture maps showing how agents interact and orchestrate.

## Input Parameters
- `agent_config_paths`: Paths to agent configuration files
- `include_dependencies`: Whether to trace external dependencies (default: true)
- `communication_protocol`: Focus on specific communication patterns (default: all)
- `depth_limit`: Maximum dependency chain depth to trace (default: 5)

## Output Format

### 1. Agent Inventory with Role Mapping
```
Agent Name: {agent_name}
├── Role: orchestrator | worker | specialized
├── Responsibility: {primary_responsibility}
├── Type: {type_classification}
├── Input Interface: {input_schema}
├── Output Interface: {output_schema}
├── Dependencies
│   ├── Skills Required: [{skill1}, {skill2}, ...]
│   ├── Internal Agents: [{agent_a}, {agent_b}, ...]
│   └── External Services: [{service1}, {service2}, ...]
├── Configuration File: {path_with_line_numbers}
├── Instructions: {summary}
└── Status: active | beta | deprecated
```

### 2. Agent Interaction Diagram
```
Agent Dependency Graph:
┌────────────┐      ┌────────────┐      ┌────────────┐
│ Agent-A    │─────▶│ Agent-B    │─────▶│ Agent-C    │
│ (Orchestr) │      │ (Worker)   │      │ (Worker)   │
└────────────┘      └────────────┘      └────────────┘
     │                                         │
     └─────────────────┬──────────────────────┘
                       ▼
                 ┌────────────┐
                 │ Skill-Pool │
                 └────────────┘
```

### 3. Agent Capability Matrix
| Agent | Skill-A | Skill-B | Skill-C | Orchestrate | Process | Transform |
|-------|---------|---------|---------|-------------|---------|-----------|
| A-1   | ✓       | ✓       |         | ✓           |         |           |
| A-2   |         | ✓       | ✓       |             | ✓       | ✓         |
| A-3   | ✓       |         | ✓       |             | ✓       |           |

### 4. Communication Flow Specification
For each agent pair interaction:
```
Source Agent: {agent_a}
Target Agent: {agent_b}
├── Communication Type: request-response | publish-subscribe | direct-call
├── Protocol: HTTP | gRPC | message-queue | function-call
├── Data Format: JSON | Protocol Buffer | MessagePack
├── Frequency: sync | async | batch
├── Error Handling: {strategy}
└── Latency Requirements: {requirements}
```

### 5. Workflow Orchestration Patterns

#### Sequential Pattern
```
Agent-A ─▶ Agent-B ─▶ Agent-C
 (input)  (process)  (output)
```

#### Parallel Pattern
```
    ┌─▶ Agent-B ─┐
Agent-A ┤          ├─▶ Agent-D
    └─▶ Agent-C ─┘
```

#### Conditional Pattern
```
Agent-A ──┬─▶ Agent-B (if condition)
          └─▶ Agent-C (else)
```

### 6. Agent State & Context Management
```
Agent: {agent_name}
├── State Model: stateless | stateful | event-driven
├── Context Requirements: {list_of_required_contexts}
├── Session Management: {session_strategy}
├── Memory/Cache: {memory_specs}
└── Persistence: {persistence_mechanism}
```

### 7. Agent Interface Contracts
```
Agent: {agent_name}

Input Schema:
{
  "type": "object",
  "required": ["field1", "field2"],
  "properties": {
    "field1": {"type": "string", "description": "..."},
    "field2": {"type": "array", ...}
  }
}

Output Schema:
{
  "type": "object",
  "properties": {
    "result": {"type": "...", "description": "..."},
    "status": {"enum": ["success", "error", "partial"]},
    "metadata": {"type": "object"}
  }
}

Error Handling:
- {error_code}: {error_description} -> {recovery_strategy}
```

## Implementation Checklist

### Phase 1: Configuration Parsing
- [ ] Parse all agent configuration files (JSON, YAML, etc.)
- [ ] Extract agent metadata (name, role, type, version)
- [ ] Identify skill requirements and parameters
- [ ] Parse input/output specifications

### Phase 2: Dependency Analysis
- [ ] Build agent dependency graph
- [ ] Identify skill dependencies for each agent
- [ ] Trace external service integrations
- [ ] Detect circular dependencies (flag as issues)
- [ ] Calculate dependency depth metrics

### Phase 3: Communication Pattern Analysis
- [ ] Identify communication protocols used
- [ ] Extract message/request-response formats
- [ ] Analyze async vs sync patterns
- [ ] Document event types and triggers
- [ ] Map publish-subscribe relationships

### Phase 4: Workflow Orchestration Mapping
- [ ] Identify orchestration patterns (sequential, parallel, conditional)
- [ ] Trace execution flow paths
- [ ] Map branching logic and conditions
- [ ] Document error handling flows
- [ ] Identify potential bottlenecks

### Phase 5: Visualization & Documentation
- [ ] Generate dependency graphs (Mermaid/GraphViz)
- [ ] Create capability matrices
- [ ] Build interaction diagrams
- [ ] Document state transitions
- [ ] Generate sequence diagrams for key flows

## Key Metrics to Extract

### For Each Agent
- **Dependency Count**: Number of skills and agents required
- **Coupling Index**: Strength of coupling with other agents (low/medium/high)
- **Complexity Score**: Based on configuration size, rule count, state management
- **Reachability**: How many other agents can reach this agent
- **Impact**: How many agents depend on this agent

### For Agent System
- **Total Agents**: Count and categorization
- **Orchestration Depth**: Maximum depth of orchestration chains
- **Critical Agents**: Agents with highest impact on others
- **Communication Overhead**: Message frequency and volume
- **Bottleneck Agents**: Agents handling most requests

## Analysis Templates

### Agent Risk Assessment
```
Agent: {agent_name}
├── Single Point of Failure: yes/no
├── Circular Dependency Risk: {assessment}
├── Scalability Concerns: {list}
├── Performance Bottlenecks: {list}
└── Recommended Improvements: {suggestions}
```

### Agent Composition Pattern
```
Pattern: {pattern_name}
├── Participating Agents: {list}
├── Orchestration Logic: {description}
├── Error Scenarios: {scenarios}
├── Recovery Paths: {paths}
└── Performance Characteristics: {characteristics}
```

## Integration Points

### With Repository Structure Analyzer
- Uses agent configuration file locations
- Validates agent existence and structure

### With Prompt Pattern Extractor
- Maps prompts to agent responsibilities
- Correlates instruction sets to agents

### With Skill Capability Mapper
- Validates skill availability
- Cross-references skill parameters

### With Data Flow Tracer
- Traces data transformations through agent chains
- Identifies data format conversions

## Success Criteria
- [ ] All agents identified and categorized
- [ ] All dependencies accurately mapped
- [ ] Communication patterns clearly documented
- [ ] Workflow orchestration logic transparent
- [ ] State management strategy visible
- [ ] Error handling paths documented
- [ ] Scalability assessment provided
- [ ] Visual diagrams accurate and clear

## Related Skills
- repo-structure-analyzer
- skill-capability-mapper
- prompt-pattern-extractor
- data-flow-tracer
- code-reference-generator

## Example Output: Agent Orchestration Map

```
┌─────────────────────────────────────────────────────────┐
│               Orchestration Layer                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Main-Orchestrator (Agent-A)                      │   │
│  │ - Role: Central Coordinator                      │   │
│  │ - Skills: orchestration, validation              │   │
│  │ - Status: Critical (5 dependent agents)          │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌────────┐   ┌────────┐   ┌────────┐
   │Agent-B │   │Agent-C │   │Agent-D │
   │Process │   │Process │   │Process │
   └────────┘   └────────┘   └────────┘
        │             │             │
        └─────────────┼─────────────┘
                      ▼
            ┌──────────────────┐
            │ Shared Skill Pool│
            │ Skills: 1-24     │
            └──────────────────┘
```
