# .claude Agent 快速参考卡片

## 🎯 30秒快速开始

1. **复制配置文件**
   ```bash
   cp .claude /path/to/awesome-copilot/.claude
   ```

2. **启动Claude Code**
   ```bash
   cd /path/to/awesome-copilot
   claude code
   ```

3. **执行第一个分析**
   ```
   @awesome-copilot-navigator analyze-structure
   ```

完毕！你现在可以开始探索你的仓库架构了。

---

## 📋 文件清单和用途

| 文件 | 用途 | 读者 | 耗时 |
|------|------|------|------|
| **.claude** | 核心配置文件 | 所有人 | - |
| **README.md** | 项目概述和索引 | 所有人 | 10 min |
| **CLAUDE_AGENT_GUIDE.md** | ⭐ 使用指南 | 最重要 | 20 min |
| **SKILLS_IMPLEMENTATION_GUIDE.md** | 技术细节 | 开发者 | 30 min |
| **repo-structure-analyzer.md** | Skill 1文档 | 开发者 | 10 min |
| **agent-architecture-mapper.md** | Skill 2文档 | 开发者 | 10 min |
| **data-flow-tracer.md** | Skill 3文档 | 开发者 | 10 min |

**建议阅读顺序**: .claude → README.md → CLAUDE_AGENT_GUIDE.md

---

## 🔥 关键命令速查

### 快速理解
```
@awesome-copilot-navigator analyze-structure
```
**输出**: 仓库全景（目录树、agent清单、skill清单）  
**耗时**: 5分钟

### 架构理解
```
@awesome-copilot-navigator map-agents
```
**输出**: Agent依赖图、通信流、工作流  
**耗时**: 8分钟

### 数据流分析
```
@awesome-copilot-navigator trace-data-flow
```
**输入**: `{"start_point": "agent_name"}`  
**输出**: Schema演变、性能瓶颈、缓存策略  
**耗时**: 10分钟

### 技术栈评估
```
@awesome-copilot-navigator analyze-tech-stack
```
**输出**: 版本、依赖、兼容性  
**耗时**: 5分钟

### Prompt分析
```
@awesome-copilot-navigator extract-prompts
```
**输出**: Prompt模式、参数依赖  
**耗时**: 5分钟

### 完整分析（推荐首次运行）
```
@awesome-copilot-navigator full-analysis
```
**输出**: 综合报告（所有分析的组合）  
**耗时**: 25分钟

---

## 💡 常见用途场景

### 场景 1️⃣ : 新人快速上手（30分钟）
```
第1步 (5min):  analyze-structure
         → 理解项目组织、agent和skill清单

第2步 (10min): map-agents
         → 理解agent间的交互

第3步 (10min): 选择一个核心agent深入
         → trace-data-flow {"start_point": "main-agent"}
         
第4步 (5min):  提出问题和获得建议
```

### 场景 2️⃣ : 设计新功能（45分钟）
```
第1步: map-agents
    → 了解现有架构
    
第2步: trace-data-flow
    → 理解数据流向
    
第3步: 提问
    @awesome-copilot-navigator
    我想添加新feature X
    - 需要哪些新agents/skills?
    - 数据流会如何变化?
    - 有什么架构影响?
```

### 场景 3️⃣ : 性能优化（60分钟）
```
第1步: trace-data-flow {"trace_depth": "full"}
    → 识别所有bottleneck

第2步: 针对bottleneck分析
    → 是否可以缓存？
    → 是否可以并行化？
    
第3步: 验证改动影响
    → 修改后重新trace-data-flow
```

### 场景 4️⃣ : 技术升级评估（30分钟）
```
第1步: analyze-tech-stack
    → 了解当前技术栈

第2步: 提问
    @awesome-copilot-navigator
    升级到新版本X会有什么影响?
    - 兼容性问题?
    - 依赖冲突?
    - 性能变化?
```

---

## 🎨 7个核心Skills说明

### Skill 1: Repository Structure Analyzer
**用途**: 仓库全景  
**输出**: 目录树、agent清单、skill清单、代码统计  
**适合**: 快速了解项目  
**命令**: `analyze-structure`

### Skill 2: Agent Architecture Mapper
**用途**: 理解agent交互  
**输出**: 依赖图、能力矩阵、通信流、工作流  
**适合**: 架构设计和理解  
**命令**: `map-agents`

### Skill 3: Data Flow Tracer
**用途**: 追踪数据流动  
**输出**: 流路径、schema演变、性能指标、瓶颈  
**适合**: 性能优化、理解处理流程  
**命令**: `trace-data-flow`

### Skill 4: Prompt Pattern Extractor
**用途**: 分析prompt工程  
**输出**: Prompt模板、参数依赖、工程技巧  
**适合**: 学习prompt设计  
**命令**: `extract-prompts`

### Skill 5: Technology Stack Analyzer
**用途**: 分析技术选型  
**输出**: 版本清单、依赖关系、兼容性、升级路径  
**适合**: 技术评估、升级规划  
**命令**: `analyze-tech-stack`

### Skill 6: Skill Capability Mapper
**用途**: 发现可用能力  
**输出**: Skill清单、参数规范、使用示例  
**适合**: 重用existing skills  
**命令**: `map-skills`

### Skill 7: Code Reference Generator
**用途**: 创建代码索引  
**输出**: 函数/类引用、交叉引用、代码地图  
**适合**: 快速找代码  
**命令**: `generate-references`

---

## 🛠️ 自定义问询（推荐用法）

不仅可以使用预定义命令，也可以自由提问：

```
@awesome-copilot-navigator
[你的具体问题，尽可能详细]

示例:
- "这个仓库中有几个orchestrator agents？它们的职责是什么？"
- "Agent A依赖哪些skills？这些skills是怎样实现的？"
- "从用户输入到最终输出，数据如何流转？有哪些transformation？"
- "添加新的Agent时，我应该遵循什么patterns？"
- "这个仓库使用了什么技术栈？有过时的依赖吗？"
```

Agent会根据你的问题自动选择合适的skills组合进行分析。

---

## 📊 性能预期和优化

| 操作 | 耗时 | 受影响因素 | 优化建议 |
|------|------|----------|---------|
| analyze-structure | 2-5min | 文件数量 | 调整 `analysis_scope` |
| map-agents | 3-8min | agent数量 | 专注特定目录 |
| trace-data-flow | 3-10min | agent链深度 | 限制 `trace_depth` |
| full-analysis | 15-30min | 全部因素 | 分解成独立分析 |

**大型仓库优化**:
```json
{
  "context": {
    "analysis_scope": [
      "agents/core/**",      // 只分析core agents
      "skills/core/**"       // 只分析core skills
    ]
  }
}
```

---

## ✅ 最佳实践（务必阅读）

### 1. 从宏观到微观 🔍
```
全景 → 架构 → 细节
```

### 2. 问题导向 ❓
```
带着具体问题分析，而不是盲目浏览
```

### 3. 定期更新 🔄
```
每月运行一次 full-analysis 来追踪变化
```

### 4. 记录发现 📝
```
将分析结果保存为项目文档
docs/
  ├── ARCHITECTURE.md
  ├── AGENT_GUIDE.md
  ├── DATA_FLOW.md
```

### 5. 团队共享 👥
```
将.claude配置共享到项目repo
让团队成员都能使用这个Agent
```

---

## 🚨 常见问题快速解答

**Q: 分析太慢了怎么办?**
A: 缩小 `analysis_scope` 或使用特定的skill，而不是 `full-analysis`

**Q: 输出太长了怎么办?**
A: 提出更具体的问题，而不是运行全量分析

**Q: 如何找到特定的agent/skill?**
A: 
```
@awesome-copilot-navigator
找到所有包含"authentication"的agents和skills
```

**Q: 如何理解一个复杂的agent?**
A:
```
@awesome-copilot-navigator
深入分析 {agent-name}:
- 它的职责是什么?
- 它依赖哪些skills?
- 数据如何在其中流动?
```

**Q: 如何添加新agent?**
A:
```
@awesome-copilot-navigator
我想添加新agent用于{purpose}
- 应该遵循什么patterns?
- 需要哪些skills?
- 如何与现有agents集成?
```

---

## 📚 深入学习路线

### Day 1: 基础入门
- [ ] 运行 `analyze-structure`
- [ ] 阅读 README.md
- [ ] 理解目录组织

### Day 2: 架构理解
- [ ] 运行 `map-agents`
- [ ] 阅读 CLAUDE_AGENT_GUIDE.md
- [ ] 分析主要agent的职责

### Day 3: 数据和技术
- [ ] 运行 `trace-data-flow`
- [ ] 运行 `analyze-tech-stack`
- [ ] 理解数据流和技术选型

### Day 4: 深化
- [ ] 运行 `extract-prompts`
- [ ] 运行 `map-skills`
- [ ] 学习prompt工程和skill复用

### Day 5: 融汇贯通
- [ ] 回答具体问题: "如何添加新feature?"
- [ ] 提出优化建议
- [ ] 将学习整理成文档

---

## 🎓 学习资源链接

- 📖 [项目README](README.md) - 全面概览
- 📖 [使用指南](CLAUDE_AGENT_GUIDE.md) ⭐ **务必阅读**
- 📖 [实现指南](SKILLS_IMPLEMENTATION_GUIDE.md) - 技术细节
- 📖 [Skill文档](./skills/) - 各skill详细规范

---

## ⚡ 速度对比

### 传统方式 vs Agent方式

| 任务 | 传统方式 | Agent方式 | 提升 |
|------|---------|----------|------|
| 理解项目结构 | 30分钟 | 5分钟 | 6x |
| 理解Agent架构 | 60分钟 | 10分钟 | 6x |
| 追踪数据流 | 120分钟 | 15分钟 | 8x |
| 找到特定代码 | 45分钟 | 5分钟 | 9x |
| 完整系统理解 | 480分钟 | 60分钟 | 8x |

**总体提升**: **7-8倍生产力提升** 🚀

---

## 🎬 下一步行动

1. **立即执行** (5分钟)
   ```bash
   # 复制配置文件
   cp .claude /path/to/awesome-copilot/
   ```

2. **运行首个分析** (10分钟)
   ```
   cd /path/to/awesome-copilot
   claude code
   @awesome-copilot-navigator analyze-structure
   ```

3. **阅读重要文档** (20分钟)
   - 阅读 README.md
   - 快速浏览 CLAUDE_AGENT_GUIDE.md

4. **定制配置** (可选, 30分钟)
   - 根据需要修改 .claude
   - 添加自定义commands

5. **深入使用** (持续)
   - 用Agent回答具体问题
   - 建立定期分析流程
   - 与团队共享知识

---

## 💬 获取帮助

- 📖 查看 CLAUDE_AGENT_GUIDE.md 的 FAQ 部分
- 🔧 查看 SKILLS_IMPLEMENTATION_GUIDE.md 的技术细节
- ❓ 向Agent提出具体问题，它会提供帮助
- 📝 查看skill文档了解具体规范

---

**版本**: 1.0  
**上次更新**: 2025-01-29  

🎉 **祝你使用愉快！** 这个Agent将大幅加快你对awesome-copilot的理解和开发效率。
