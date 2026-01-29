# .claude Agent Configuration - 使用指南

## 概述

这个`.claude`配置文件为你的awesome-copilot仓库创建了一个专门的Navigator Agent，具备以下核心能力：

1. **仓库结构分析** - 快速理解项目组织方式
2. **Agent架构映射** - 理解Agent间的交互和依赖
3. **数据流追踪** - 跟踪数据在系统中的流动
4. **技术栈分析** - 识别使用的技术和框架
5. **Prompt模式提取** - 理解提示工程实践
6. **代码引用生成** - 创建可搜索的代码索引

## 快速开始

### 1. 初始化Agent

```bash
# 放置.claude文件到仓库根目录
cp .claude /path/to/awesome-copilot/.claude

# 在Claude Code中激活
cd /path/to/awesome-copilot
claude code
```

### 2. 执行关键命令

#### 获取仓库全景
```
You: @claude-copilot analyze-structure
```
这将生成：
- 完整的目录树（附注释）
- Agent清单
- Skill清单
- Prompt模板目录
- 脚本注册表

**预期耗时**: 2-5分钟
**输出**: Markdown文档（800-2000行）

#### 理解Agent架构
```
You: @claude-copilot map-agents
```
这将提供：
- 详细的Agent依赖图
- Agent能力矩阵
- 通信流规范
- 工作流编排模式
- 状态管理策略

**预期耗时**: 3-8分钟
**输出**: 包含Mermaid图表的Markdown（1000-2500行）

#### 追踪数据流
```
You: @claude-copilot trace-data-flow
```
输入示例：
```
{
  "start_point": "main-orchestrator-agent",
  "trace_depth": "full",
  "include_transformations": true
}
```

这将展示：
- 完整的数据生命周期
- 格式转换链
- 数据依赖DAG
- Schema演变
- 性能瓶颈
- 缓存策略

**预期耗时**: 3-10分钟
**输出**: 详细流程图（1000-3000行）

#### 技术栈分析
```
You: @claude-copilot analyze-tech-stack
```

这将识别：
- 所有编程语言及其占比
- 框架和库的版本
- 外部服务集成
- 实现模式
- 兼容性问题

**预期耗时**: 2-5分钟

#### 完整分析
```
You: @claude-copilot full-analysis
```

执行所有analysis skills并生成综合报告。

**预期耗时**: 15-30分钟
**输出**: 完整的架构文档（5000-10000行）

## 高级用法

### A. 按需定制分析

```
You: 分析仓库中的orchestration-agents目录
     - 有哪些orchestrator agents？
     - 它们的responsibility是什么？
     - 它们之间如何通信？
```

Agent将：
1. 扫描目标目录
2. 提取agent配置
3. 分析依赖关系
4. 生成交互图表
5. 提供架构建议

### B. 深度探索特定Agent

```
You: 深入分析main-orchestrator agent：
     1. 它依赖哪些skills？
     2. 这些skills是什么？
     3. 数据如何在这些skills间流动？
     4. 可能的性能瓶颈在哪里？
```

Agent将：
- 定位agent配置文件
- 提取skill依赖
- 映射skill实现
- 追踪数据转换
- 识别优化机会

### C. 比较Agent模式

```
You: 比较有哪些不同的agent orchestration patterns？
     - 哪些使用sequential flow？
     - 哪些使用parallel processing？
     - 哪些使用conditional routing？
```

Agent将：
- 识别所有orchestration模式
- 分类并对比
- 展示使用场景
- 评估优缺点
- 提供建议

### D. 技术债识别

```
You: 识别这个仓库中的技术债：
     - 有deprecated agents吗？
     - 有未使用的skills吗？
     - 有circular dependencies吗？
     - 有重复的实现吗？
```

Agent将：
- 扫描整个仓库
- 识别问题模式
- 量化影响
- 优先排序
- 建议修复方案

## 配置文件说明

### context部分
```json
"context": {
  "repository_root": ".",
  "analysis_scope": [
    "agents/**",      // 所有agent定义
    "skills/**",      // 所有skill实现
    "prompts/**",     // prompt模板
    "instructions/**",// 指令集
    "scripts/**",     // 脚本
    "config/**",      // 配置文件
    "*.md",          // 文档
    "*.json",        // JSON配置
    "*.yaml"         // YAML配置
  ],
  "focus_areas": [
    "agent-orchestration-patterns",  // Agent编排
    "skill-integration-mechanisms",   // Skill集成
    "prompt-engineering-techniques",  // Prompt工程
    "data-flow-architecture",         // 数据流
    "technology-stack-composition"    // 技术栈
  ]
}
```

### commands部分
每个command对应一个specific analysis：

- **analyze-structure**: 快速了解项目布局
- **map-agents**: 理解agent架构
- **extract-prompts**: 学习prompt设计
- **analyze-tech-stack**: 识别技术选型
- **trace-data-flow**: 理解数据流动
- **map-skills**: 发现可用能力
- **generate-references**: 创建代码索引
- **full-analysis**: 综合分析

## 输出优化建议

### 对于架构师/技术负责人
```
You: @claude-copilot map-agents --format=diagram
```
重点关注：
- Agent依赖图
- 通信模式
- 扩展性考虑
- 性能特征

### 对于新团队成员
```
You: @claude-copilot analyze-structure --include-examples=true
```
重点关注：
- 目录组织
- Agent职责
- Skill清单
- 使用示例

### 对于性能优化
```
You: @claude-copilot trace-data-flow --focus=bottlenecks
```
重点关注：
- 数据大小
- 处理延迟
- 瓶颈位置
- 优化建议

### 对于技术升级
```
You: @claude-copilot analyze-tech-stack --include=dependencies,versions
```
重点关注：
- 技术版本
- 依赖关系
- 兼容性
- 升级路径

## 与Claude Code的集成

这个Agent配置可以与Claude Code seamlessly集成：

```bash
# 在Claude Code中直接调用
claude code @awesome-copilot-navigator "分析agents目录的所有orchest agents"

# 或在交互模式中
claude code
> @awesome-copilot-navigator full-analysis
```

## 最佳实践

### 1. 信息架构化
- 先执行`analyze-structure`获取全景
- 再执行特定domain的analysis
- 最后追踪具体的data flow

### 2. 渐进式学习
```
Day 1: analyze-structure (全景)
Day 2: map-agents (架构)
Day 3: trace-data-flow (数据流)
Day 4: extract-prompts (prompt工程)
Day 5: full-analysis (深化理解)
```

### 3. 问题导向的分析
始终带着问题去分析：
- "如何添加新agent？"
- "这个skill被哪些agents使用？"
- "如何优化这个data flow？"
- "有哪些可重用的patterns？"

### 4. 文档维护
定期执行analysis并保存输出：
```bash
# 生成架构文档
claude code @awesome-copilot-navigator analyze-structure > ARCHITECTURE.md

# 定期更新（如月度）
# 可自动化此过程
```

## 扩展配置

### 添加新的Skill

如果需要新增分析能力，修改`.claude`的`skills`部分：

```json
{
  "id": "custom-skill-id",
  "name": "Custom Skill Name",
  "description": "What this skill does",
  "capabilities": [
    "Capability 1",
    "Capability 2"
  ]
}
```

### 自定义分析范围

修改`context.analysis_scope`：

```json
"analysis_scope": [
  "agents/**/*.json",      // 只分析JSON配置
  "skills/core/**",        // 只分析core skills
  "docs/**/*.md"           // 包含更多文档
]
```

### 添加自定义命令

```json
"commands": {
  "analyze-core-skills": {
    "description": "Analyze only core skills",
    "action": "invoke_skill:skill-capability-mapper",
    "filter": "core"
  }
}
```

## 常见问题

### Q: 如何快速熟悉这个仓库？
A: 执行这个sequence：
1. `analyze-structure` (5分钟)
2. `map-agents` (5分钟)
3. `trace-data-flow` for main orchestrator (5分钟)
4. 根据兴趣deep-dive特定areas

### Q: 如何找到特定skill的使用地方？
A: 使用自定义查询：
```
@claude-copilot 
Find all agents using the "authentication-skill" 
and show how they use it
```

### Q: 如何理解prompt设计的意图？
A:
```
@claude-copilot extract-prompts --focus=system-prompts
Then: 分析这些prompts与agent responsibility的关系
```

### Q: 如何评估添加新agent的影响？
A:
```
@claude-copilot
新增agent需要与Agent-A, Agent-B集成
- 会有什么dependencies?
- 数据流会如何变化?
- 可能的风险是什么?
```

## 下一步

1. **将.claude放到仓库根目录**
2. **在Claude Code中激活**
3. **执行first analysis来验证配置**
4. **根据需要定制分析参数**
5. **建立分析的定期更新流程**

这个Agent框架将成为你快速理解和改进awesome-copilot仓库的强大工具。

---

**Version**: 1.0
**Created**: 2025-01-29
**Compatible with**: Claude Code, Claude Opus 4.5, Claude Sonnet 4.5
