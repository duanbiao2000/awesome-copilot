# GitHub Copilot 本地安装配置指南

> awesome-copilot 仓库自定义组件的完整安装和配置指南
> 生成日期: 2025-01-29

---

## 📋 目录

1. [前置要求](#前置要求)
2. [安装方式概览](#安装方式概览)
3. [Instructions 安装](#instructions-安装)
4. [Prompts 安装](#prompts-安装)
5. [Chat Modes 安装](#chat-modes-安装)
6. [Agents 安装](#agents-安装)
7. [Collections 使用](#collections-使用)
8. [验证安装](#验证安装)
9. [常见问题](#常见问题)

---

## 前置要求

### 必需软件

- **Visual Studio Code** (推荐最新版本)
- **GitHub Copilot** 扩展 (已安装并激活)
- **Git** (用于克隆仓库)

### 可选软件

- **GitHub Copilot CLI** (用于命令行操作)
- **Visual Studio Code Insiders** (预览版本)

---

## 安装方式概览

awesome-copilot 提供了四种类型的自定义组件，每种都有不同的安装方式：

| 组件类型 | 安装方式 | 适用场景 |
|----------|----------|----------|
| Instructions | 复制到 `.github/copilot-instructions.md` | 项目级全局指令 |
| Prompts | VS Code 一键安装 | 可重用的 Prompt 模板 |
| Chat Modes | VS Code 一键安装 | 特定场景的聊天模式 |
| Agents | 复制到仓库根目录 | 领域专家 AI Agent |
| Collections | 浏览并安装多个组件 | 按主题组织的内容集 |

---

## Instructions 安装

### 方式一：项目级全局指令 (推荐)

**适用场景**: 为整个项目设置全局 Copilot 行为

**步骤**:

1. **克隆仓库**

   ```bash
   git clone https://github.com/github/awesome-copilot.git
   cd awesome-copilot
   ```

2. **选择 Instructions**

   浏览 [`instructions/`](../instructions/) 目录，选择适合你项目的技术栈：

   - `csharp.instructions.md` - C#/.NET 开发
   - `java.instructions.md` - Java 开发
   - `python.instructions.md` - Python 开发
   - `typescript-5-es2022.instructions.md` - TypeScript 开发
   - `nextjs-tailwind.instructions.md` - Next.js + Tailwind
   - `vuejs3.instructions.md` - Vue.js 3
   - `nestjs.instructions.md` - NestJS
   - `azure-functions-typescript.instructions.md` - Azure Functions

3. **复制到项目**

   将选中的 `.instructions.md` 文件复制到你的项目根目录：

   ```
   your-project/
   ├── .github/
   │   └── copilot-instructions.md    ← 复制到这里
   ```

4. **验证安装**

   在 VS Code 中打开项目，Copilot 会自动读取并应用这些指令。

### 方式二：任务特定指令

**适用场景**: 为特定任务或文件夹设置指令

**步骤**:

1. **创建 `.github/instructions/` 文件夹**

   ```bash
   mkdir -p .github/instructions
   ```

2. **复制 Instructions 到该文件夹**

   将 `.instructions.md` 文件复制到 `.github/instructions/` 文件夹中：

   ```
   your-project/
   ├── .github/
   │   ├── copilot-instructions.md    ← 全局指令
   │   └── instructions/            ← 任务特定指令
   │       ├── database-task.instructions.md
   │       └── api-task.instructions.md
   ```

3. **使用方法**

   - Copilot 会根据当前打开的文件自动应用对应的指令
   - 当你打开 `database/` 文件夹中的文件时，Copilot 会使用 `database-task.instructions.md`

### 中文 Instructions

对于中文用户，可以使用 [`Mydoc/instructions/`](../Mydoc/instructions/) 目录中的中文指南：

- [`驯服 Copilot 指南.md`](../Mydoc/instructions/驯服%20Copilot%20指南.md) - Copilot 交互哲学
- [`GitHub Copilot 自定义指令文件指南.md`](../Mydoc/instructions/GitHub%20Copilot%20自定义指令文件指南.md) - 创建自定义指令指南
- [`Go语言开发指南.md`](../Mydoc/instructions/Go语言开发指南.md) - Go 开发
- [`Next.js + Tailwind 开发指南.md`](../Mydoc/instructions/Next.js%20+%20Tailwind%20开发指南.md) - Next.js + Tailwind
- [`TypeScript 5 + ES2022 开发指南.md`](../Mydoc/instructions/TypeScript%205%20+%20ES2022%20开发指南.md) - TypeScript 5 + ES2022

---

## Prompts 安装

### 方式一：VS Code 一键安装 (推荐)

**步骤**:

1. **在 VS Code 中打开 Prompt 文件**

   导航到 `awesome-copilot/prompts/` 目录，双击打开你感兴趣的 `.prompt.md` 文件。

2. **点击安装按钮**

   文件顶部会显示两个安装按钮：
   - `[![Install in VS Code](...)](...)`
   - `[![Install in VS Code Insiders](...)](...)`

   点击任一按钮即可安装。

3. **使用 Prompt**

   安装后，在 VS Code Chat 中使用：

   ```
   /prompt-name
   ```

   或从命令面板运行：

   ```
   Chat: Run Prompt
   ```

### 方式二：手动安装

**适用场景**: 自定义 Prompt 或离线使用

**步骤**:

1. **复制 Prompt 内容**

   打开 `.prompt.md` 文件，复制全部内容。

2. **打开 Prompt 集合**

   在 VS Code 中按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)，搜索 "Copilot Prompts"。

3. **添加新 Prompt**

   点击 "+" 按钮，粘贴 Prompt 内容，保存。

### 常用 Prompt 类别

| 类别 | 示例 Prompt | 用途 |
|------|-------------|------|
| 蓝图生成 | `architecture-blueprint-generator.prompt.md` | 生成架构蓝图 |
| 测试生成 | `csharp-xunit.prompt.md`, `java-junit.prompt.md` | 生成测试代码 |
| MCP 服务器 | `python-mcp-server-generator.prompt.md` | 生成 MCP 服务器 |
| 文档生成 | `create-readme.prompt.md` | 生成 README |
| 任务分解 | `breakdown-feature-implementation.prompt.md` | 分解功能任务 |

### 中文 Prompts

使用 [`Mydoc/prompts/`](../Mydoc/prompts/) 目录中的中文 Prompt 文档：

- [`README蓝图生成器.md`](../Mydoc/prompts/README蓝图生成器.md) - 生成项目 README
- [`技术栈蓝图生成器.md`](../Mydoc/prompts/技术栈蓝图生成器.md) - 生成技术栈蓝图
- [`功能需求文档(PRD)分解功能介绍.md`](../Mydoc/prompts/功能需求文档(PRD)分解功能介绍.md) - PRD 分解
- [`Python代码注释与教程生成.md`](../Mydoc/prompts/Python代码注释与教程生成.md) - Python 代码注释

---

## Chat Modes 安装

### 方式一：VS Code 一键安装 (推荐)

**步骤**:

1. **在 VS Code 中打开 Chat Mode 文件**

   导航到 `awesome-copilot/chatmodes/` 目录，双击打开你感兴趣的 `.chatmode.md` 文件。

2. **点击安装按钮**

   文件顶部会显示安装按钮，点击即可安装。

3. **切换 Chat Mode**

   安装后，在 VS Code Chat 界面中：
   - 点击聊天输入框旁边的模式选择器
   - 选择你安装的 Chat Mode

### 方式二：手动安装

**步骤**:

1. **复制 Chat Mode 内容**

   打开 `.chatmode.md` 文件，复制全部内容。

2. **打开 Chat Modes 集合**

   在 VS Code 中按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)，搜索 "Copilot Chat Modes"。

3. **添加新 Chat Mode**

   点击 "+" 按钮，粘贴 Chat Mode 内容，保存。

### 常用 Chat Modes

| 类别 | 示例 Chat Mode | 用途 |
|------|-----------------|------|
| .NET 专家 | `expert-dotnet-software-engineer.chatmode.md` | .NET 开发指导 |
| Azure 架构师 | `azure-principal-architect.chatmode.md` | Azure 架构设计 |
| Power BI 专家 | `power-bi-dax-expert.chatmode.md` | Power BI DAX 优化 |
| 测试专家 | `playwright-tester.chatmode.md` | Playwright 测试 |
| 规划专家 | `planner.chatmode.md` | 项目规划 |

### 中文 Chat Modes

使用 [`Mydoc/chatmodes/`](../Mydoc/chatmodes/) 目录中的中文 Chat Mode 文档：

- [`API 架构师.md`](../Mydoc/chatmodes/API%20架构师.md) - API 架构设计
- [`优秀CodeTour.md`](../Mydoc/chatmodes/优秀CodeTour.md) - Code Tour 指导
- [`辩证思考.md`](../Mydoc/chatmodes/辩证思考.md) - 辩证思维模式

---

## Agents 安装

### 安装步骤

**注意**: Agents 需要手动复制到项目目录，不支持一键安装。

1. **克隆仓库**

   ```bash
   git clone https://github.com/github/awesome-copilot.git
   cd awesome-copilot
   ```

2. **选择 Agent**

   浏览 [`agents/`](../agents/) 目录，选择适合你需求的 Agent：

   - `CSharpExpert.agent.md` - C#/.NET 专家
   - `terraform.agent.md` - Terraform 专家
   - `octopus-deploy-release-notes-mcp.agent.md` - Octopus 部署 (带 MCP)
   - `pagerduty-incident-responder.agent.md` - PagerDuty 事件响应

3. **复制 Agent 到项目**

   将选中的 `.agent.md` 文件复制到你的项目根目录：

   ```
   your-project/
   ├── .github/
   │   └── copilot-instructions.md    ← 全局指令
   └── CSharpExpert.agent.md              ← Agent 文件
   ```

4. **配置 MCP 服务器 (如需要)**

   如果 Agent 需要 MCP 服务器支持，需要额外配置（见下文 MCP 配置部分）。

### Agent 配置结构

每个 Agent 文件包含以下 Frontmatter：

```yaml
---
name: Agent 名称
description: Agent 描述
# MCP 服务器配置 (可选)
mcp-servers:
  server-name:
    type: 'stdio' | 'http'
    command: '...'
    args: [...]
    env:
      KEY: 'value'
---

# Agent 指令内容
You are an expert in [domain]...
```

### 带 MCP 支持的 Agent

以下 Agent 需要配置 MCP 服务器：

| Agent | MCP 服务器 | 配置要求 |
|--------|-----------|----------|
| `octopus-deploy-release-notes-mcp.agent.md` | Octopus Deploy | 需要 Octopus MCP 服务器 |
| 其他 Agent | 无 | 不需要额外配置 |

---

## Collections 使用

### 浏览 Collections

1. **查看 Collections 目录**

   导航到 `awesome-copilot/collections/` 目录，查看所有可用的 Collection。

2. **阅读 Collection README**

   每个 Collection 都有一个对应的 `.md` 文件，包含该集合的详细说明和所有项目列表。

3. **选择感兴趣的 Collection**

   根据你的技术栈或工作流选择合适的 Collection：

   - `csharp-dotnet-development` - C#/.NET 开发集合
   - `azure-cloud-development` - Azure 云开发集合
   - `python-mcp-development` - Python MCP 开发集合
   - `power-bi-development` - Power BI 开发集合
   - `frontend-web-dev` - 前端开发集合

### 安装 Collection 中的项目

1. **通过 VS Code 安装**

   在 Collection README 中，每个项目都有安装按钮：
   - `[![Install in VS Code](...)](...)`
   - `[![Install in VS Code Insiders](...)](...)`

   点击即可安装单个项目。

2. **批量安装**

   对于整个 Collection，可以：
   - 逐个安装所有项目
   - 或使用脚本批量安装（需要自定义）

### 特色 Collections

以下 Collections 标记为 ⭐ Featured，推荐优先查看：

| Collection | 特色 | 项目数 |
|-----------|------|--------|
| `awesome-copilot` | Meta prompts | 5 |
| `azure-cloud-development` | Azure 全栈 | 20+ |
| `power-bi-development` | Power BI 全栈 | 9 |

---

## 验证安装

### 验证 Instructions

1. **打开项目中的文件**

   在 VS Code 中打开项目中的任意文件。

2. **检查 Copilot 行为**

   观察代码建议是否符合 Instructions 中的约定：
   - 命名约定
   - 代码风格
   - 最佳实践

3. **测试特定场景**

   根据 Instructions 中的指导，测试特定场景：
   - 错误处理
   - 异步编程
   - 测试模式

### 验证 Prompts

1. **运行 Prompt**

   在 VS Code Chat 中输入：

   ```
   /prompt-name
   ```

2. **检查输出**

   验证 Prompt 是否按预期工作：
   - 输出格式
   - 代码质量
   - 完整性

### 验证 Chat Modes

1. **切换到 Chat Mode**

   在 VS Code Chat 中切换到你安装的 Chat Mode。

2. **测试功能**

   测试 Chat Mode 的功能：
   - 工具可用性
   - 专家建议质量
   - 响应相关性

### 验证 Agents

1. **检查 Agent 文件**

   确认 `.agent.md` 文件已复制到项目根目录。

2. **配置 MCP 服务器 (如需要)**

   如果 Agent 需要 MCP 服务器，确保已正确配置：
   - MCP 服务器已安装
   - 配置参数正确
   - 环境变量已设置

3. **测试 Agent 功能**

   在 VS Code Chat 中与 Agent 交互，验证其功能。

---

## MCP 服务器配置

### MCP 服务器类型

awesome-copilot 支持两种 MCP 服务器类型：

#### 1. 本地 (stdio) 类型

适用于本地运行的 MCP 服务器：

```yaml
mcp-servers:
  my-local-server:
    type: 'stdio'
    command: 'node'
    args: ['server.js', '--port', '3000']
    env:
      API_KEY: 'your-api-key'
      DEBUG: 'false'
```

#### 2. HTTP 类型

适用于远程 MCP 服务器：

```yaml
mcp-servers:
  my-remote-server:
    type: 'http'
    url: 'https://api.example.com/mcp'
    headers:
      Authorization: 'Bearer your-token'
      X-Custom-Header: 'value'
```

### 安装 MCP 服务器

1. **查找 MCP 服务器**

   访问 [GitHub MCP Registry](https://github.com/mcp/registry) 查找可用的 MCP 服务器。

2. **安装 MCP 服务器**

   在 VS Code 中：
   - 按 `Ctrl+Shift+P` 打开命令面板
   - 搜索 "MCP"
   - 选择 "MCP: Add Server"
   - 输入服务器配置

3. **验证 MCP 服务器**

   在 VS Code Chat 中测试 MCP 服务器的功能。

### awesome-copilot 中的 MCP 生成器

以下 Prompts 可以生成 MCP 服务器代码：

| Prompt | 生成的语言 | 用途 |
|--------|-------------|------|
| `python-mcp-server-generator.prompt.md` | Python | 生成 Python MCP 服务器 |
| `typescript-mcp-server-generator.prompt.md` | TypeScript | 生成 TypeScript MCP 服务器 |
| `go-mcp-server-generator.prompt.md` | Go | 生成 Go MCP 服务器 |
| `java-mcp-server-generator.prompt.md` | Java | 生成 Java MCP 服务器 |
| `rust-mcp-server-generator.prompt.md` | Rust | 生成 Rust MCP 服务器 |

---

## 常见问题

### Q1: 安装后没有生效？

**可能原因**:

- 文件位置不正确
- Copilot 扩展未激活
- VS Code 需要重启

**解决方法**:

1. 确认文件在正确的位置
2. 检查 Copilot 扩展是否已激活
3. 重启 VS Code

### Q2: 如何同时使用多个 Instructions？

**解决方法**:

- 使用项目级全局指令 (`.github/copilot-instructions.md`)
- 为特定任务创建 `.github/instructions/` 文件夹
- Copilot 会根据上下文自动应用相应的指令

### Q3: Prompt 和 Chat Mode 有什么区别？

**区别**:

- **Prompt**: 一次性执行的 Prompt 模板，适合特定任务
- **Chat Mode**: 持续的聊天模式，改变 Copilot 的行为和可用工具

**使用场景**:

- 使用 Prompt 进行一次性任务（如生成代码、创建文档）
- 使用 Chat Mode 进行持续会话（如架构设计、代码审查）

### Q4: Agent 和 Chat Mode 如何选择？

**选择指南**:

- **Agent**: 当需要领域专家指导时（如 .NET、Azure、Terraform）
- **Chat Mode**: 当需要特定工作流或工具集时（如测试、规划、调试）

### Q5: 如何更新已安装的内容？

**更新方法**:

1. **从仓库拉取最新版本**

   ```bash
   git pull origin main
   ```

2. **重新安装更新后的文件**
   - 对于 Instructions/Chat Modes/Prompts: 重新点击安装按钮
   - 对于 Agents: 重新复制 `.agent.md` 文件

### Q6: MCP 服务器连接失败？

**排查步骤**:

1. 检查 MCP 服务器是否正在运行
2. 验证 Agent 中的 MCP 配置是否正确
3. 检查网络连接
4. 查看 VS Code 输出面板的 MCP 相关错误日志

### Q7: 如何贡献自定义内容？

**贡献流程**:

1. Fork `awesome-copilot` 仓库
2. 创建新的 `.prompt.md` / `.instructions.md` / `.chatmode.md` / `.agent.md` 文件
3. 遵循 Frontmatter 模式添加元数据
4. 将文件添加到相应的 Collection
5. 提交 Pull Request

---

## 📚 参考资源

### 官方文档

- [GitHub Copilot 文档](https://docs.github.com/copilot)
- [awesome-copilot README](../README.md)
- [REPOSITORY_SUMMARY.md](../REPOSITORY_SUMMARY.md)

### 中文文档

- [`Mydoc/`](../Mydoc/) - 中文指南目录
- [`驯服 Copilot 指南`](../Mydoc/instructions/驯服%20Copilot%20指南.md) - Copilot 交互哲学

### 生成的文档

- [`docs/README.instructions.md`](../docs/README.instructions.md) - Instructions 目录
- [`docs/README.prompts.md`](../docs/README.prompts.md) - Prompts 目录
- [`docs/README.chatmodes.md`](../docs/README.chatmodes.md) - Chat Modes 目录
- [`docs/README.agents.md`](../docs/README.agents.md) - Agents 目录
- [`docs/README.collections.md`](../docs/README.collections.md) - Collections 目录

---

## 🎯 快速开始

### 推荐的首次安装顺序

1. **安装项目级 Instructions**
   - 选择适合你技术栈的 `.instructions.md`
   - 复制到 `.github/copilot-instructions.md`

2. **安装常用 Prompts**
   - 安装 `create-readme.prompt.md` - 生成项目文档
   - 安装 `architecture-blueprint-generator.prompt.md` - 生成架构蓝图

3. **安装专家 Chat Mode**
   - 根据你的技术栈选择对应的专家 Chat Mode
   - 如 `expert-dotnet-software-engineer.chatmode.md` 用于 .NET 开发

4. **探索 Collections**
   - 浏览 `collections/` 目录
   - 选择感兴趣的技术栈集合
   - 安装集合中的项目

### 30 分钟快速上手

```
0-5 min:   阅读 README 和 REPOSITORY_SUMMARY
5-10 min:  安装项目级 Instructions
10-15 min: 安装 2-3 个常用 Prompts
15-20 min: 安装专家 Chat Mode
20-25 min: 测试所有安装的功能
25-30 min: 浏览 Collections 并选择感兴趣的项目
```

---

**祝你使用愉快！** 🚀

如有问题，请参考 [GitHub Copilot 文档](https://docs.github.com/copilot) 或查看 [`Mydoc/`](../Mydoc/) 目录中的中文指南。
