# Skill: Repository Structure Analyzer

## Purpose
Maps and analyzes the directory structure of the awesome-copilot repository, identifying all agents, skills, prompts, and scripts in a structured, navigable format.

## Input Parameters
- `root_path`: Repository root directory
- `include_hidden`: Whether to include hidden files (default: false)
- `max_depth`: Maximum directory depth to analyze (default: unlimited)
- `filter_patterns`: File patterns to focus on (default: all)

## Output Format

### 1. Directory Tree with Annotations
```
awesome-copilot/
├── agents/                          [Contains all agent definitions]
│   ├── {agent-name}/
│   │   ├── config.json             [Agent configuration and capabilities]
│   │   ├── instructions.md         [Agent-specific instructions]
│   │   ├── prompts/                [Agent-specific prompt templates]
│   │   └── implementation/         [Core agent logic]
├── skills/                         [Reusable skill implementations]
│   ├── {skill-name}/
│   │   ├── definition.json         [Skill metadata and interface]
│   │   ├── implementation.py|ts|js [Actual skill implementation]
│   │   └── examples/               [Usage examples]
├── prompts/                        [Global prompt templates]
│   ├── system-prompts/
│   ├── user-prompts/
│   └── few-shot-examples/
├── instructions/                   [Global instruction sets]
├── scripts/                        [Automation and utility scripts]
├── config/                         [Configuration files]
└── docs/                          [Documentation]
```

### 2. Agent Inventory
| Agent Name | Purpose | Type | Status | Config File | Skills Used |
|----------|---------|------|--------|-------------|-------------|
| {name} | {purpose} | orchestrator/worker/specialized | active/deprecated | {path} | {skill1, skill2} |

### 3. Skill Inventory
| Skill ID | Name | Category | Implementation | Reusable | Used By |
|----------|------|----------|-----------------|----------|---------|
| {id} | {name} | processing/analysis/integration | {lang} | yes/no | {agents} |

### 4. Prompt Template Catalog
| Template Name | Agent/Context | Purpose | Parameters | Complexity |
|--------------|---------------|---------|-----------|-----------|
| {name} | {context} | {purpose} | {params} | simple/moderate/complex |

### 5. Script Registry
| Script Name | Purpose | Language | Entry Point | Dependencies |
|------------|---------|----------|------------|--------------|
| {name} | {purpose} | {lang} | {main} | {deps} |

## Implementation Checklist

### Phase 1: File System Scanning
- [ ] Recursively traverse directory structure
- [ ] Identify key directories (agents/, skills/, prompts/, etc.)
- [ ] Count files by type and extension
- [ ] Build directory hierarchy tree

### Phase 2: Configuration Parsing
- [ ] Parse agent configuration files
- [ ] Extract skill definitions
- [ ] Identify prompt templates
- [ ] Parse script manifests

### Phase 3: Cross-Reference Building
- [ ] Map agent -> skills dependencies
- [ ] Map prompts -> agents/skills usage
- [ ] Build import/require dependency graph
- [ ] Identify circular dependencies

### Phase 4: Analysis and Reporting
- [ ] Generate structured inventory tables
- [ ] Create visual architecture diagrams
- [ ] Identify unused/orphaned files
- [ ] Detect missing documentation
- [ ] Flag deprecated patterns

## Key Metrics to Extract

### Repository Statistics
- Total number of agents
- Total number of skills
- Total number of prompt templates
- Lines of code by language
- Documentation coverage %

### Agent Statistics Per Agent
- Skills required
- Prompt templates used
- Dependencies (internal and external)
- Estimated complexity (based on LOC, config size)

### Skill Statistics Per Skill
- Reusability index (usage count / total agents)
- Coupling metrics (dependencies)
- Implementation complexity

## Example Output

### Directory Analysis
```
Repository Size: 847 files, ~250KB of code
Languages: Python (45%), JavaScript (35%), YAML (15%), Markdown (5%)
Main Components: 8 Agents, 24 Skills, 67 Prompt Templates, 12 Scripts
```

### Architecture Overview
```
┌─────────────────────────────────────────┐
│    Orchestration Layer (Agents)         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Agent-A  │  │ Agent-B  │  │Agent-C │ │
│  └────┬─────┘  └────┬─────┘  └───┬────┘ │
└───────┼─────────────┼────────────┼──────┘
        │             │            │
┌───────▼─────────────▼────────────▼──────┐
│      Skills & Processing Layer          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │Skill-A   │  │Skill-B   │  │Skill-C │ │
│  └──────────┘  └──────────┘  └────────┘ │
└──────────────────────────────────────────┘
```

## Integration Points

### With Agent-Architecture-Mapper
- Provides structural foundation for dependency analysis
- Identifies configuration files for detailed parsing

### With Prompt-Pattern-Extractor
- Locates all prompt files
- Provides context for prompt organization analysis

### With Tech-Stack-Analyzer
- Identifies package files and dependencies
- Provides language distribution data

## Success Criteria
- [ ] Accurate representation of all agents/skills/prompts
- [ ] Cross-reference accuracy (no broken links)
- [ ] Visual clarity (easy to scan and navigate)
- [ ] Completeness (no orphaned or hidden components)
- [ ] Maintainability (can be updated as repo evolves)

## Related Skills
- agent-architecture-mapper
- prompt-pattern-extractor
- tech-stack-analyzer
- code-reference-generator
