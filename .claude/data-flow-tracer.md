# Skill: Data Flow Tracer

## Purpose
Traces and documents how data flows through agents, skills, and processing pipelines. Maps data transformations, identifies bottlenecks, and visualizes data dependencies and format conversions.

## Input Parameters
- `start_point`: Agent or skill to trace from
- `trace_depth`: Maximum trace depth (default: full)
- `include_transformations`: Whether to trace data transformations (default: true)
- `follow_async_flows`: Whether to trace async/event-driven flows (default: true)
- `data_format_focus`: Specific data format to focus on (default: all)

## Output Format

### 1. Data Flow Overview
```
Data Lifecycle:
Input ─▶ Validation ─▶ Processing ─▶ Transformation ─▶ Output
         │             │               │                │
      Schema          Cache           Conversion      Schema
      Check          Points           Points          Check
```

### 2. Complete Data Flow Trace
```
Trace Path: {start_agent} → {intermediate_agents} → {end_agent}

Step 1: {agent_name}
├── Input Data
│   ├── Field: {field_name}
│   │   ├── Type: {type}
│   │   ├── Source: {source}
│   │   ├── Validation: {validation_rule}
│   │   └── Size: {expected_size}
│   └── ...
├── Processing
│   ├── Operation: {operation}
│   ├── Dependencies: {skill1, skill2}
│   ├── Latency: {expected_latency}
│   └── Error Cases: {error_scenarios}
├── Output Data
│   ├── Field: {field_name}
│   │   ├── Type: {type}
│   │   ├── Derivation: {how_derived}
│   │   ├── Validation: {validation_rule}
│   │   └── Size: {expected_size}
│   └── ...
└── State Changes: {state_changes}

Step 2: {next_agent}
├── ...
```

### 3. Data Format Conversion Map
```
Conversion Chains:
Input Format ──{converter}──▶ Intermediate Format ──{converter}──▶ Output Format

JSON ──(json_to_protobuf)──▶ Protocol Buffer ──(pb_to_msgpack)──▶ MessagePack
 │
 └─ Schema: {input_schema}
 └─ Size: {typical_size}
 └─ Conversion Rules: {rules}
```

### 4. Data Dependency Graph
```
Data Dependency DAG:

input_field_1 ─┐
                ├─▶ intermediate_field_1 ─┐
input_field_2 ─┘                          │
                                          ├─▶ output_field_1
input_field_3 ─┐                          │
                ├─▶ intermediate_field_2 ─┘
input_field_4 ─┘
```

### 5. Data Schema Evolution Through Pipeline
```
Stage 1 (Input): {agent_name}
{
  "user_id": string,
  "request": {
    "query": string,
    "filters": array
  }
}
       │ [processed by Agent-A with Skill-X]
       ▼
Stage 2 (Processing): {agent_name}
{
  "user_id": string,
  "request": {...},
  "parsed_query": {...},
  "metadata": {...}
}
       │ [transformed by Agent-B with Skill-Y]
       ▼
Stage 3 (Output): {agent_name}
{
  "request_id": string,
  "user_id": string,
  "results": array,
  "statistics": {...}
}
```

### 6. Data Volume and Performance Metrics
```
Data Flow Metrics:

Path: Agent-A → Agent-B → Agent-C

Stage 1 Input:
├── Average Size: {size_mb}
├── Peak Size: {peak_size_mb}
├── Frequency: {events_per_second}
└── Throughput: {mb_per_second}

Stage 1→2 Transfer:
├── Protocol: {protocol}
├── Latency: {avg_latency}
├── Loss Rate: {percentage}
└── Error Rate: {percentage}

Bottleneck Analysis:
├── Slowest Stage: {stage_name}
├── Reason: {reason}
└── Suggested Optimization: {optimization}
```

### 7. Caching and Memory Strategy
```
Caching Points:

Agent-A
├── Cache Key: {key_generation_logic}
├── TTL: {time_to_live}
├── Size Limit: {max_size}
├── Eviction: {strategy} (LRU/FIFO/etc)
└── Hit Rate Expectation: {percentage}

Data in Memory:
├── Field {name}: {size_bytes}
├── Field {name}: {size_bytes}
└── Total: {total_bytes}
```

### 8. Error Propagation and Recovery
```
Error Flow Tracing:

Normal Path: Input ─▶ Processing ─▶ Output
                           │
                        Error
                           │
                      ┌─────▼──────┐
                      │ Fallback-1 │
                      └─────┬──────┘
                            │
                      ┌─────▼──────┐
                      │ Fallback-2 │
                      └────────────┘

Error Handling Chain:
1. {error_type} in {agent_name}
   ├── Detection: {detection_logic}
   ├── Recovery Action: {action}
   ├── Fallback Data: {fallback_source}
   └── Retry Strategy: {strategy}
```

## Implementation Checklist

### Phase 1: Data Source Identification
- [ ] Identify all data entry points (user input, external APIs, databases)
- [ ] Extract input schemas and validation rules
- [ ] Document data sources and their characteristics
- [ ] Analyze initial data size and volume expectations

### Phase 2: Flow Path Mapping
- [ ] Trace data through agent processing chains
- [ ] Identify conditional branches based on data content
- [ ] Map parallel processing paths
- [ ] Document data joins and merges
- [ ] Identify data filtering/pruning points

### Phase 3: Transformation Analysis
- [ ] Identify all data transformation operations
- [ ] Extract transformation logic and rules
- [ ] Document format conversions
- [ ] Analyze field derivations
- [ ] Map schema evolution through pipeline

### Phase 4: Performance Analysis
- [ ] Estimate data sizes at each stage
- [ ] Calculate expected latencies
- [ ] Identify potential bottlenecks
- [ ] Analyze caching opportunities
- [ ] Project throughput and resource requirements

### Phase 5: Error and Edge Case Analysis
- [ ] Identify error scenarios and their impact
- [ ] Trace error propagation paths
- [ ] Document error recovery mechanisms
- [ ] Analyze edge cases (empty data, null values, etc.)
- [ ] Map fallback strategies

### Phase 6: Visualization and Documentation
- [ ] Create flow diagrams (Mermaid/GraphViz)
- [ ] Generate schema evolution charts
- [ ] Build performance analysis reports
- [ ] Document caching strategies
- [ ] Create troubleshooting guides

## Key Metrics to Extract

### Data Flow Statistics
- **Total Data Volume**: Amount of data flowing through system
- **Peak Load**: Maximum concurrent data items
- **Transformation Count**: Number of transformation steps
- **Format Conversions**: Number of format changes
- **Error Rate**: Percentage of data requiring error handling

### Performance Characteristics
- **End-to-End Latency**: Time from input to output
- **Stage Latencies**: Individual stage processing times
- **Throughput**: Data items processed per unit time
- **Bottleneck Index**: Ratio of slowest to fastest stage
- **Memory Footprint**: Peak memory usage during processing

### Data Quality
- **Validation Pass Rate**: Percentage passing validation
- **Data Loss**: Percentage of data lost in transformations
- **Schema Compliance**: Percentage matching expected schema
- **Transformation Success Rate**: Percentage of successful transformations

## Data Flow Patterns

### Stream Processing Pattern
```
Continuous Input Stream
         │
         ▼
    ┌────────────┐
    │ Windowing  │
    └────────────┘
         │
         ▼
    ┌────────────┐
    │ Aggregation│
    └────────────┘
         │
         ▼
   Output Stream
```

### Batch Processing Pattern
```
Data Accumulation ─▶ Trigger ─▶ Batch Processing ─▶ Output
     (buffer)       (threshold)   (transform)     (persist)
```

### Event-Driven Pattern
```
Event Source ─▶ Event Routing ─▶ Handler Selection ─▶ Processing
                    │
                    ├─▶ Handler-A
                    │
                    ├─▶ Handler-B
                    │
                    └─▶ Handler-C
```

## Integration Points

### With Agent Architecture Mapper
- Uses agent input/output specifications
- References data flow between agents
- Validates data contract compatibility

### With Skill Capability Mapper
- Maps skill input/output transformations
- Traces data through skill chain
- Identifies transformation bottlenecks

### With Prompt Pattern Extractor
- Traces prompt data construction
- Maps prompt parameter sources
- Analyzes prompt data dependencies

### With Code Reference Generator
- Links to actual transformation code
- References data handling functions
- Maps to test data and examples

## Success Criteria
- [ ] All data entry points identified
- [ ] Complete flow paths traced
- [ ] All transformations documented
- [ ] Schema evolution clearly shown
- [ ] Performance characteristics calculated
- [ ] Bottlenecks identified
- [ ] Caching opportunities found
- [ ] Error handling paths mapped
- [ ] Visual diagrams clear and accurate

## Related Skills
- agent-architecture-mapper
- skill-capability-mapper
- prompt-pattern-extractor
- code-reference-generator

## Example Output: Complete Data Flow Analysis

```
REQUEST LIFECYCLE

┌─────────────────────────────────────────────────────────┐
│ Client Request                                          │
│ Size: ~2KB (JSON)                                       │
│ Schema: {user_id, query, filters, options}              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Agent-A: Input Validator     │
        │ Skill: schema_validator      │
        │ Latency: ~50ms               │
        │ Output: {original + metadata}│
        └──────────────────┬───────────┘
                           │
                           ▼
        ┌──────────────────────────────┐
        │ Agent-B: Query Parser        │
        │ Skills: nlp_parser, intent   │
        │ Latency: ~200ms              │
        │ Output: {parsed query, intent}
        └──────────────────┬───────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │Agent-C: Search   │      │Agent-D: Filter   │
    │Latency: ~300ms   │      │Latency: ~150ms   │
    │Output: {results} │      │Output: {filtered}│
    └────────┬─────────┘      └────────┬─────────┘
             │                         │
             └────────────┬────────────┘
                          ▼
         ┌────────────────────────────┐
         │Agent-E: Result Aggregation │
         │Latency: ~100ms             │
         │Output: {final_results}     │
         └──────────────┬─────────────┘
                        │
                        ▼
         ┌────────────────────────────┐
         │ Response (~50KB, JSON)     │
         │ Total E2E Latency: ~700ms  │
         └────────────────────────────┘

Bottleneck: Agent-C (Search) - 300ms
Optimization: Add caching layer for common queries
```
