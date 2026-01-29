# .claude Skills实现指南

## 目录
1. [Architecture Overview](#architecture-overview)
2. [Skill Implementation Details](#skill-implementation-details)
3. [Data Structures](#data-structures)
4. [Code Examples](#code-examples)
5. [Integration Patterns](#integration-patterns)

## Architecture Overview

### 系统架构

```
┌─────────────────────────────────────────────────────────┐
│              Claude Code Environment                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ .claude Configuration                             │  │
│  │ - Agent Definition                                │  │
│  │ - Skills Registry                                 │  │
│  │ - Commands Mapping                                │  │
│  │ - Context Configuration                           │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Skill Execution Layer                             │  │
│  │ ┌─────────────────┐  ┌─────────────────┐          │  │
│  │ │Repo Structure   │  │Agent Architecture
         │  │  │ Analyzer      │  │ Mapper           │  │  │
│  │ └─────────────────┘  └─────────────────┘          │  │
│  │ ┌─────────────────┐  ┌─────────────────┐          │  │
│  │ │Prompt Extractor │  │Data Flow Tracer │          │  │
│  │ └─────────────────┘  └─────────────────┘          │  │
│  │ ┌─────────────────┐  ┌─────────────────┐          │  │
│  │ │Tech Stack       │  │Skill Mapper     │          │  │
│  │ │Analyzer         │  │                 │          │  │
│  │ └─────────────────┘  └─────────────────┘          │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Processing & Analysis Pipeline                    │  │
│  │ - File System Scanning                            │  │
│  │ - Configuration Parsing                           │  │
│  │ - Dependency Analysis                             │  │
│  │ - Cross-Reference Building                        │  │
│  │ - Visualization Generation                        │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Output Generation                                 │  │
│  │ - Markdown Reports                                │  │
│  │ - Mermaid Diagrams                                │  │
│  │ - Code References                                 │  │
│  │ - Cross-Reference Maps                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Skill Implementation Details

### 1. Repository Structure Analyzer

#### 核心算法

```python
# Pseudo-code
def analyze_repository_structure(root_path, filters):
    # Phase 1: Traverse
    file_tree = traverse_directory(root_path, filters)
    
    # Phase 2: Parse
    agents = parse_agent_configs(file_tree)
    skills = parse_skill_definitions(file_tree)
    prompts = extract_prompt_templates(file_tree)
    scripts = parse_script_manifests(file_tree)
    
    # Phase 3: Aggregate
    inventory = {
        'agents': categorize_agents(agents),
        'skills': categorize_skills(skills),
        'prompts': categorize_prompts(prompts),
        'scripts': categorize_scripts(scripts),
        'statistics': calculate_statistics(file_tree)
    }
    
    # Phase 4: Generate Output
    return format_output(inventory)
```

#### 关键数据结构

```python
@dataclass
class AgentInfo:
    name: str
    path: str
    role: str  # orchestrator, worker, specialized
    type: str
    config_file: str
    skills_required: List[str]
    capabilities: List[str]
    status: str  # active, beta, deprecated
    lines_of_code: int

@dataclass
class SkillInfo:
    skill_id: str
    name: str
    path: str
    category: str
    implementation_language: str
    reusable: bool
    used_by: List[str]  # agent names
    parameters: Dict[str, Any]
    output_type: str

@dataclass
class PromptTemplate:
    name: str
    path: str
    agent_context: str
    purpose: str
    parameters: List[str]
    complexity: str  # simple, moderate, complex
    version: str
```

#### 输出生成

```python
def generate_structured_output(inventory):
    output = {
        'summary': {
            'total_agents': len(inventory['agents']),
            'total_skills': len(inventory['skills']),
            'total_prompts': len(inventory['prompts']),
            'total_scripts': len(inventory['scripts']),
            'languages': count_languages(inventory),
            'total_loc': sum_lines_of_code(inventory)
        },
        'detailed_structure': {
            'directory_tree': format_tree(inventory),
            'agent_inventory': format_agent_table(inventory),
            'skill_inventory': format_skill_table(inventory),
            'prompt_catalog': format_prompt_table(inventory),
            'script_registry': format_script_table(inventory)
        },
        'metrics': {
            'repository_statistics': calculate_repo_stats(inventory),
            'agent_statistics': calculate_agent_stats(inventory),
            'skill_statistics': calculate_skill_stats(inventory)
        }
    }
    return format_markdown_output(output)
```

### 2. Agent Architecture Mapper

#### 依赖图构建

```python
class DependencyGraph:
    def __init__(self):
        self.agents = {}
        self.edges = defaultdict(list)
        self.skills_map = {}
    
    def build_graph(self, agent_configs):
        # 1. Add nodes
        for agent in agent_configs:
            self.agents[agent.name] = agent
        
        # 2. Add edges
        for agent in agent_configs:
            for dependency in agent.dependencies:
                if dependency in self.agents:
                    self.edges[agent.name].append(dependency)
                else:
                    self.skills_map[agent.name].append(dependency)
        
        # 3. Detect cycles
        return self.detect_cycles()
    
    def detect_cycles(self):
        visited = set()
        rec_stack = set()
        cycles = []
        
        for node in self.agents:
            if node not in visited:
                self._visit(node, visited, rec_stack, cycles)
        
        return cycles
    
    def _visit(self, node, visited, rec_stack, cycles):
        visited.add(node)
        rec_stack.add(node)
        
        for neighbor in self.edges.get(node, []):
            if neighbor not in visited:
                self._visit(neighbor, visited, rec_stack, cycles)
            elif neighbor in rec_stack:
                cycles.append(self._trace_cycle(node, neighbor))
        
        rec_stack.remove(node)
```

#### 通信模式分析

```python
def analyze_communication_patterns(agent_configs):
    patterns = {
        'request_response': [],
        'publish_subscribe': [],
        'direct_call': [],
        'async_event': []
    }
    
    for agent in agent_configs:
        for skill in agent.skills_required:
            comm_type = detect_communication_type(agent, skill)
            patterns[comm_type].append({
                'source': agent.name,
                'target': skill.name,
                'protocol': extract_protocol(agent, skill),
                'data_format': extract_data_format(agent, skill),
                'latency_requirement': extract_latency(agent)
            })
    
    return generate_communication_spec(patterns)
```

### 3. Data Flow Tracer

#### 流追踪算法

```python
class DataFlowTracer:
    def __init__(self, agent_graph, skill_map):
        self.agent_graph = agent_graph
        self.skill_map = skill_map
        self.flow_paths = []
    
    def trace_flow(self, start_agent, end_agent=None):
        # BFS to find all paths from start to end
        paths = self._find_paths(
            start_agent, 
            end_agent or '*'  # '*' means trace to all endpoints
        )
        
        flow_analysis = []
        for path in paths:
            flow_info = self._analyze_path(path)
            flow_analysis.append(flow_info)
        
        return flow_analysis
    
    def _analyze_path(self, path):
        """
        For each step in the path, extract:
        - Input schema and validation
        - Processing operations
        - Output schema and transformations
        - Performance characteristics
        - Error handling
        """
        analysis = {
            'path': path,
            'stages': [],
            'total_latency': 0,
            'bottlenecks': [],
            'memory_footprint': 0,
            'transformation_count': 0
        }
        
        for i, (agent, skill) in enumerate(path):
            stage_info = self._extract_stage_info(agent, skill)
            analysis['stages'].append(stage_info)
            analysis['total_latency'] += stage_info['latency']
            analysis['memory_footprint'] += stage_info['memory']
            
            if stage_info.get('is_bottleneck'):
                analysis['bottlenecks'].append(i)
        
        return analysis
    
    def _extract_stage_info(self, agent, skill):
        return {
            'agent': agent.name,
            'skill': skill.name,
            'input_schema': extract_input_schema(agent, skill),
            'output_schema': extract_output_schema(agent, skill),
            'transformations': extract_transformations(agent, skill),
            'latency': estimate_latency(agent, skill),
            'memory': estimate_memory(agent, skill),
            'error_handling': extract_error_handling(agent, skill),
            'caching_strategy': extract_caching_strategy(agent, skill),
            'is_bottleneck': False  # Will be set in post-analysis
        }
```

#### Schema追踪

```python
def trace_schema_evolution(flow_path):
    """
    Track how data schema changes through the flow
    """
    schema_evolution = []
    
    for i, (agent, skill) in enumerate(flow_path):
        input_schema = get_input_schema(agent, skill)
        output_schema = get_output_schema(agent, skill)
        
        transformations = extract_field_mappings(
            input_schema, 
            output_schema
        )
        
        schema_evolution.append({
            'stage': i,
            'agent': agent.name,
            'input_schema': input_schema,
            'output_schema': output_schema,
            'transformations': transformations,
            'new_fields': find_new_fields(input_schema, output_schema),
            'removed_fields': find_removed_fields(input_schema, output_schema),
            'modified_fields': find_modified_fields(input_schema, output_schema)
        })
    
    return schema_evolution
```

### 4. Prompt Pattern Extractor

#### Prompt解析

```python
def extract_prompt_patterns(prompt_files):
    patterns = {
        'system_prompts': {},
        'user_prompts': {},
        'few_shot_examples': {},
        'instruction_sets': {}
    }
    
    for prompt_file in prompt_files:
        content = read_file(prompt_file)
        
        # Identify prompt type
        prompt_type = identify_prompt_type(content)
        
        # Extract structure
        extracted = {
            'file_path': prompt_file,
            'type': prompt_type,
            'parameters': extract_parameters(content),
            'role': extract_roles(content),
            'examples': extract_examples(content),
            'instructions': extract_instructions(content),
            'complexity': calculate_complexity(content),
            'version': extract_version(content)
        }
        
        patterns[prompt_type][prompt_file] = extracted
    
    return patterns
```

#### 参数依赖分析

```python
def analyze_prompt_dependencies(prompt_patterns):
    """
    Find which agents/skills use which prompts
    and how parameters flow
    """
    dependencies = defaultdict(list)
    parameter_map = defaultdict(lambda: defaultdict(set))
    
    for prompt_type, prompts in prompt_patterns.items():
        for prompt_path, prompt_info in prompts.items():
            # Find which agents use this prompt
            using_agents = find_prompt_usage(prompt_path)
            
            for agent in using_agents:
                dependencies[prompt_path].append(agent.name)
                
                # Map parameter flows
                for param in prompt_info['parameters']:
                    source = find_parameter_source(agent, param)
                    parameter_map[prompt_path][param].add(source)
    
    return {
        'dependencies': dependencies,
        'parameter_flows': parameter_map
    }
```

### 5. Technology Stack Analyzer

#### 依赖提取

```python
def extract_tech_stack(repo_root):
    tech_stack = {
        'languages': {},
        'frameworks': {},
        'libraries': {},
        'external_services': {},
        'databases': {},
        'infrastructure': {}
    }
    
    # Python dependencies
    if os.path.exists(f'{repo_root}/requirements.txt'):
        tech_stack['libraries'].update(
            parse_requirements(f'{repo_root}/requirements.txt')
        )
    
    # JavaScript dependencies
    if os.path.exists(f'{repo_root}/package.json'):
        tech_stack['libraries'].update(
            parse_package_json(f'{repo_root}/package.json')
        )
    
    # Configuration files
    for config_file in find_config_files(repo_root):
        config_type = identify_config_type(config_file)
        tech_stack[config_type].update(
            parse_config_file(config_file)
        )
    
    # Source code analysis
    for source_file in find_source_files(repo_root):
        imports = extract_imports(source_file)
        tech_stack['libraries'].update(imports)
    
    return tech_stack
```

#### 兼容性分析

```python
def analyze_compatibility(tech_stack):
    compatibility_matrix = []
    
    for library, version in tech_stack['libraries'].items():
        conflicts = find_version_conflicts(library, version)
        dependencies = find_transitive_dependencies(library, version)
        
        compatibility_matrix.append({
            'library': library,
            'version': version,
            'conflicts': conflicts,
            'dependencies': dependencies,
            'security_status': check_security_status(library, version),
            'maintenance_status': check_maintenance_status(library, version)
        })
    
    return compatibility_matrix
```

## Data Structures

### Unified Data Model

```python
@dataclass
class RepositoryContext:
    root_path: str
    agents: Dict[str, AgentInfo]
    skills: Dict[str, SkillInfo]
    prompts: Dict[str, PromptTemplate]
    scripts: Dict[str, ScriptInfo]
    tech_stack: TechStackInfo
    dependency_graph: DependencyGraph
    data_flows: List[DataFlow]
    
    def get_agent(self, name: str) -> AgentInfo:
        return self.agents.get(name)
    
    def get_agent_skills(self, agent_name: str) -> List[SkillInfo]:
        agent = self.get_agent(agent_name)
        return [self.skills[s] for s in agent.skills_required]
    
    def get_agent_prompts(self, agent_name: str) -> List[PromptTemplate]:
        # Find prompts used by this agent
        return [p for p in self.prompts.values() 
                if p.agent_context == agent_name]
    
    def get_skill_usage(self, skill_id: str) -> List[str]:
        # Return all agents using this skill
        return self.skills[skill_id].used_by
    
    def trace_data_flow(self, start_agent: str) -> List[DataFlow]:
        # Trace data from start agent to all endpoints
        return self.data_flows  # Pre-computed
```

## Code Examples

### Example 1: Analyzing an Agent

```python
def analyze_specific_agent(context, agent_name):
    agent = context.get_agent(agent_name)
    
    if not agent:
        return {"error": f"Agent {agent_name} not found"}
    
    analysis = {
        'agent_info': agent,
        'skills': context.get_agent_skills(agent_name),
        'prompts': context.get_agent_prompts(agent_name),
        'dependencies': context.dependency_graph.edges.get(agent_name, []),
        'dependents': [
            a for a, deps in context.dependency_graph.edges.items()
            if agent_name in deps
        ],
        'data_flows': [
            f for f in context.data_flows 
            if agent_name in f['path']
        ]
    }
    
    return analysis
```

### Example 2: Finding Bottlenecks

```python
def identify_bottlenecks(context):
    bottlenecks = []
    
    for flow_id, flow in enumerate(context.data_flows):
        # Calculate stage latencies
        stage_latencies = [
            (i, stage['latency']) 
            for i, stage in enumerate(flow['stages'])
        ]
        
        # Find slowest stage
        slowest_idx, slowest_latency = max(
            stage_latencies, 
            key=lambda x: x[1]
        )
        
        # Check if it's a bottleneck (> 50% of total)
        total_latency = sum(l for _, l in stage_latencies)
        if slowest_latency > total_latency * 0.5:
            bottlenecks.append({
                'flow_id': flow_id,
                'bottleneck_stage': slowest_idx,
                'stage_info': flow['stages'][slowest_idx],
                'percentage': (slowest_latency / total_latency) * 100,
                'suggested_optimization': generate_suggestion(
                    flow['stages'][slowest_idx]
                )
            })
    
    return bottlenecks
```

## Integration Patterns

### 与现有代码库的集成

```python
# In Claude Code context
def execute_full_analysis():
    # 1. Load repository
    context = RepositoryContext.from_path('.')
    
    # 2. Run all analyzers
    structure = RepositoryStructureAnalyzer(context).analyze()
    agents = AgentArchitectureMapper(context).map()
    flows = DataFlowTracer(context).trace()
    prompts = PromptPatternExtractor(context).extract()
    tech = TechStackAnalyzer(context).analyze()
    
    # 3. Generate comprehensive report
    report = {
        'structure': structure,
        'architecture': agents,
        'data_flows': flows,
        'prompts': prompts,
        'tech_stack': tech,
        'recommendations': generate_recommendations(
            structure, agents, flows, tech
        )
    }
    
    # 4. Output
    return format_markdown_report(report)
```

---

这些文档提供了完整的实现蓝图。根据你的具体需求，可以选择实现部分或全部skills。
