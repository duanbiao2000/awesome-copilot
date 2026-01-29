# awesome-copilot Navigator Agent Configuration

一个完整的Claude Code Agent配置系统，用于快速理解、导航和分析复杂的多agent仓库。

## 📋 概览

本配置为awesome-copilot仓库创建了一个专门的**Navigator Agent**，配备7个强大的分析skills，能够从多个维度深入理解你的代码库：

- **仓库结构分析** - 完整的项目组织和inventory
- **Agent架构映射** - 理解agent间的交互和依赖
- **数据流追踪** - 追踪数据如何在系统中流动
- **Prompt模式提取** - 理解prompt工程实践
- **技术栈分析** - 识别技术选型和兼容性
- **Skill能力映射** - 发现可用的reusable能力
- **代码引用生成** - 创建可搜索的代码索引

## 📦 文件结构

```
.
├── .claude                          # Main Agent Configuration (JSON)
├── CLAUDE_AGENT_GUIDE.md           # 使用指南和快速开始
├── SKILLS_IMPLEMENTATION_GUIDE.md  # 技术实现细节
├── skills/
│   ├── repo-structure-analyzer.md        # Skill 1: 仓库结构分析
│   ├── agent-architecture-mapper.md      # Skill 2: Agent架构映射
│   ├── data-flow-tracer.md              # Skill 3: 数据流追踪
│   └── (其他skills文档)
└── README.md                       # 本文件
```

## 🚀 快速开始

### 1. 部署配置

```bash
# 将.claude文件复制到你的awesome-copilot仓库根目录
cp .claude /path/to/awesome-copilot/.claude
```

### 2. 在Claude Code中激活

```bash
cd /path/to/awesome-copilot
claude code
```

### 3. 执行你的第一个分析

```
You: @awesome-copilot-navigator analyze-structure
```

这将生成仓库的完整结构分析。

## 🎯 核心使用场景

### 场景1: 新团队成员快速上手
```
@awesome-copilot-navigator analyze-structure
关注: 目录组织、agent清单、skill清单
耗时: 5分钟
```

### 场景2: 理解系统架构
```
@awesome-copilot-navigator map-agents
关注: agent依赖图、通信流、工作流编排
耗时: 8分钟
```

### 场景3: 追踪数据流动
```
@awesome-copilot-navigator trace-data-flow
输入参数: {"start_point": "main-orchestrator", "trace_depth": "full"}
关注: schema演变、性能瓶颈、缓存策略
耗时: 10分钟
```

### 场景4: 技术栈评估
```
@awesome-copilot-navigator analyze-tech-stack
关注: 版本、依赖、兼容性、升级路径
耗时: 5分钟
```

### 场景5: 完整系统分析
```
@awesome-copilot-navigator full-analysis
综合所有skills的分析结果
耗时: 25分钟
输出: 完整的架构文档（5000-10000行）
```

## 📊 .claude配置说明

### 结构

```json
{
  "version": "1.0",
  "name": "awesome-copilot-navigator",
  "description": "...",
  
  "instructions": [...],        // Agent的核心指令集
  
  "skills": [                   // 7个分析技能
    { "id": "repo-structure-analyzer", ... },
    { "id": "agent-architecture-mapper", ... },
    { "id": "data-flow-tracer", ... },
    // ... 更多skills
  ],
  
  "context": {                  // 分析范围和焦点
    "repository_root": ".",
    "analysis_scope": [...],
    "focus_areas": [...]
  },
  
  "commands": {                 // 预定义命令
    "analyze-structure": {...},
    "map-agents": {...},
    // ... 更多命令
  },
  
  "output_format": {...},       // 输出格式配置
  "advanced_options": {...}     // 高级选项
}
```

### 关键参数解释

| 参数 | 说明 | 示例 |
|------|------|------|
| `analysis_scope` | 分析的目录和文件类型 | `agents/**`, `skills/**` |
| `focus_areas` | 重点分析领域 | `agent-orchestration-patterns` |
| `commands` | 预定义的分析命令 | `analyze-structure`, `map-agents` |
| `output_format` | 输出格式 | `markdown`, `mermaid` |

## 💡 高级用法

### A. 自定义分析

根据你的具体需求定制`.claude`配置：

```json
// 添加自定义command
"commands": {
  "analyze-core-agents": {
    "description": "仅分析core agents",
    "action": "invoke_skill:agent-architecture-mapper",
    "filter": "core"
  }
}
```

### B. 扩展分析范围

```json
// 修改analysis_scope来包含更多文件
"analysis_scope": [
  "agents/**/*.json",
  "agents/**/*.yaml",
  "agents/**/*.md",
  "skills/core/**",
  "docs/architecture/**"
]
```

### C. 组合分析

在同一查询中组合多个skills：

```
@awesome-copilot-navigator
我想理解这个仓库的：
1. 整体架构
2. 数据在系统中如何流动
3. 使用的技术栈
可以生成一份综合分析吗？
```

## 📈 输出示例

### 仓库结构分析输出

```
Repository Size: 847 files, ~250KB of code
Languages: Python (45%), JavaScript (35%), YAML (15%), Markdown (5%)
Main Components: 8 Agents, 24 Skills, 67 Prompt Templates, 12 Scripts

Agent Inventory:
| Agent Name | Purpose | Type | Status | Skills |
|----------|---------|------|--------|--------|
| MainOrchestrator | 中央协调 | orchestrator | active | orchestration, validation |
| ProcessorA | 数据处理 | worker | active | nlp_parser, intent_detector |
| ...

Skill Inventory:
| Skill ID | Name | Category | Reusable | Used By |
|----------|------|----------|----------|---------|
| sk-001 | SchemaValidator | processing | yes | MainOrchestrator, ProcessorA |
| ...
```

### Agent架构分析输出

```
Agent Dependency Graph:
┌────────────────────┐
│ MainOrchestrator   │ (Role: Coordinator)
│ Skills: 5          │
│ Dependents: 3      │
└─────────┬──────────┘
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
┌──────┐┌──────┐┌──────┐
│SkillA││SkillB││SkillC│
└──────┘└──────┘└──────┘

Communication Patterns:
- Request-Response: 12 pairs
- Async Events: 5 patterns
- Pub-Sub: 3 channels
```

### 数据流追踪输出

```
Data Flow: MainOrchestrator → ProcessorA → ProcessorB → OutputFormatter

Stage 1 Input:
├── Average Size: 2KB
├── Format: JSON
└── Schema: {user_id, query, filters}

Schema Evolution:
Input JSON → Parsed Query → Processed Results → Formatted Output

Performance:
├── E2E Latency: 700ms
├── Bottleneck: ProcessorA (300ms)
└── Recommendation: Add caching for common queries
```

## 🔧 配置调整

### 修改分析深度

```json
{
  "advanced_options": {
    "enable_interactive_mode": true,
    "generate_visual_maps": true,
    "create_cross_reference_indexes": true
  }
}
```

### 调整输出格式

```json
{
  "output_format": {
    "default": "markdown",
    "diagrams": "mermaid",
    "code_references": "with_line_numbers",
    "structure_visualization": "tree_with_annotations"
  }
}
```

### 添加新的分析维度

```json
{
  "skills": [
    {
      "id": "custom-analysis",
      "name": "Custom Analysis",
      "description": "你的自定义分析",
      "capabilities": ["capability1", "capability2"]
    }
  ]
}
```

## 📚 相关文档

### 必读文档

1. **CLAUDE_AGENT_GUIDE.md** ⭐
   - 完整的使用指南
   - 各个command的详细说明
   - 最佳实践和tips
   - Q&A常见问题

2. **SKILLS_IMPLEMENTATION_GUIDE.md** 🔧
   - 技术实现细节
   - 数据结构定义
   - 代码示例
   - 集成模式

### Skill具体文档

3. **repo-structure-analyzer.md**
   - 仓库结构分析的完整规范

4. **agent-architecture-mapper.md**
   - Agent架构分析的完整规范

5. **data-flow-tracer.md**
   - 数据流追踪的完整规范

## 🎨 架构设计特点

### 1. 模块化设计
每个skill独立运作，可以单独调用或组合使用。

### 2. 层次化分析
- 第一层: 结构和库存
- 第二层: 架构和关系
- 第三层: 数据流和性能
- 第四层: 技术栈和建议

### 3. 交叉验证
多个skills相互引用和验证，确保分析准确性。

### 4. 可视化优先
使用Mermaid图表、ASCII艺术、表格等多种格式，提高可读性。

### 5. 可扩展性
轻松添加新的skills和commands来扩展功能。

## ⚙️ 高级选项

### 启用交互式模式
```
@awesome-copilot-navigator --interactive
```
允许在分析过程中交互式地向下钻取细节。

### 生成视觉映射
```
@awesome-copilot-navigator --generate-diagrams
```
生成详细的Mermaid/GraphViz图表。

### 创建交叉引用索引
```
@awesome-copilot-navigator --create-indexes
```
生成可搜索的代码索引和交叉引用。

## 🔍 故障排查

### 问题: 某些agent没有被识别

**解决**: 检查agent的配置文件是否符合预期格式
```
@awesome-copilot-navigator
列出仓库中找不到的agent配置文件
```

### 问题: 数据流追踪不完整

**解决**: 验证agent间的通信接口定义
```
@awesome-copilot-navigator
检查 MainOrchestrator 和 ProcessorA 之间的数据契约
```

### 问题: 输出过于冗长

**解决**: 调整分析范围和选项
```json
{
  "advanced_options": {
    "max_detail_level": 2,  // 降低详情程度
    "skip_examples": true    // 跳过示例
  }
}
```

## 📝 最佳实践

### 1. 渐进式学习
```
Day 1: analyze-structure      (建立全景)
Day 2: map-agents             (理解架构)
Day 3: trace-data-flow        (掌握数据流)
Day 4: extract-prompts        (学习prompt)
Day 5: 深化理解 & 找问题
```

### 2. 定期更新分析
```bash
# 创建自动化脚本定期运行分析
cron: 0 0 * * 1  # 每周一运行
claude code @awesome-copilot-navigator full-analysis > ARCHITECTURE_$(date +%Y%m%d).md
```

### 3. 基于问题的分析
始终带着具体问题去分析：
- "如何添加新agent？"
- "这个skill的性能瓶颈在哪？"
- "有哪些可以复用的patterns？"

### 4. 文档维护
将分析结果保存为项目文档：
```
awesome-copilot/
├── docs/
│   ├── ARCHITECTURE.md         # 主架构文档
│   ├── AGENT_GUIDE.md          # Agent开发指南
│   ├── DATA_FLOW.md            # 数据流文档
│   └── PROMPTS.md              # Prompt设计指南
```

## 🤝 扩展和贡献

### 添加新的Skill

1. 创建skill定义文件
2. 添加到`.claude`的skills数组
3. 实现处理逻辑
4. 测试和文档化

示例:
```json
{
  "id": "new-skill",
  "name": "New Analysis Skill",
  "description": "Description of what it does",
  "capabilities": ["capability1", "capability2"]
}
```

### 自定义命令

```json
{
  "commands": {
    "my-custom-analysis": {
      "description": "My custom analysis",
      "action": "invoke_skill:repo-structure-analyzer",
      "options": {
        "custom_filter": "value"
      }
    }
  }
}
```

## 📊 性能指标

| 分析类型 | 预期耗时 | 输出大小 | 适用场景 |
|---------|---------|---------|---------|
| analyze-structure | 2-5 min | 800-2000 lines | 快速了解 |
| map-agents | 3-8 min | 1000-2500 lines | 架构设计 |
| trace-data-flow | 3-10 min | 1000-3000 lines | 性能优化 |
| extract-prompts | 2-5 min | 500-1500 lines | Prompt工程 |
| analyze-tech-stack | 2-5 min | 300-1000 lines | 技术评估 |
| full-analysis | 15-30 min | 5000-10000 lines | 完整理解 |

## 🎓 学习资源

- [Claude Code 官方文档](https://docs.claude.com)
- [Prompt工程最佳实践](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Agent设计模式](https://docs.claude.com/en/docs/build-with-claude/agents)

## ⚖️ License

这个配置和文档遵循与awesome-copilot相同的许可证。

## 📞 支持

如有问题或建议：

1. 查看 CLAUDE_AGENT_GUIDE.md 中的FAQ
2. 查看 SKILLS_IMPLEMENTATION_GUIDE.md 中的技术细节
3. 根据需要定制 .claude 配置
4. 向项目反馈改进建议

---

**版本**: 1.0  
**创建日期**: 2025-01-29  
**兼容版本**: Claude Opus 4.5+, Claude Sonnet 4.5+, Claude Code

🚀 **立即开始**: 将`.claude`复制到你的仓库并执行第一个分析！
