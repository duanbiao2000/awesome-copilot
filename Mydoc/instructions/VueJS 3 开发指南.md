# VueJS 3 开发指南

## 核心技术简介

VueJS 3 是一个用于构建用户界面的渐进式 JavaScript 框架，采用 Composition API 作为默认开发模式。结合 TypeScript 可提供强大的类型安全支持，通过单文件组件（SFC）和 `<script setup>` 语法实现更简洁的组件开发体验。

## 核心开发规范

### 架构设计

- 默认使用 Composition API（`setup` 函数和可组合函数）而非 Options API
- 按功能或领域组织组件和可组合函数以提高可扩展性
- 分离 UI 组件（展示型）和逻辑组件（容器型）
- 将可复用逻辑提取到 `composables/` 目录中的可组合函数
- 按领域结构化 Pinia store 模块，明确定义 actions、state 和 getters

### TypeScript 集成

- 在 `tsconfig.json` 中启用 `strict` 模式以获得最大类型安全
- 使用 `<script setup lang="ts">` 配合 `defineProps` 和 `defineEmits`
- 利用 `PropType<T>` 进行类型化 props 和默认值设置
- 为复杂 prop 和状态结构使用接口或类型别名
- 为事件处理器、refs 和 `useRoute`/`useRouter` hooks 定义类型

### 组件设计

- 遵循单一职责原则设计组件
- 组件名使用 PascalCase，文件名使用 kebab-case
- 保持组件小巧专注
- 使用 `<script setup>` 语法提高简洁性和性能
- 优先使用 TypeScript 验证 props，仅在必要时使用运行时检查
- 使用插槽和作用域插槽实现灵活组合

## 状态管理与性能优化

### 状态管理

- 使用 Pinia 管理全局状态：通过 `defineStore` 定义 stores
- 简单本地状态使用 `ref` 和 `reactive` 在 `setup` 中管理
- 使用 `computed` 处理派生状态
- 复杂结构保持状态规范化
- Pinia stores 中的 actions 处理异步逻辑

### 性能优化

- 使用动态导入和 `defineAsyncComponent` 懒加载组件
- 使用 `<Suspense>` 处理异步组件加载回退
- 对静态或不常变化元素应用 `v-once` 和 `v-memo`
- 避免不必要的 watcher，优先使用 `computed`
- 利用 Vite 的优化特性进行代码树摇

## 数据获取与错误处理

### 数据获取

- 使用 `useFetch`（Nuxt）或 Vue Query 等库进行数据获取
- 明确处理加载、错误和成功状态
- 组件卸载或参数变更时取消过期请求
- 实现失败时的乐观更新和回滚
- 缓存响应并使用后台重新验证

### 错误处理

- 使用全局错误处理器（`app.config.errorHandler`）处理未捕获错误
- 在 `try/catch` 中包装风险逻辑，提供用户友好消息
- 组件中使用 `errorCaptured` hook 设置本地错误边界
- 优雅显示回退 UI 或错误提示
- 将错误记录到外部服务（Sentry、LogRocket）

## 路由与测试

### 路由管理

- 使用 Vue Router 4 配合 `createRouter` 和 `createWebHistory`
- 实现嵌套路由和路由级代码分割
- 使用导航守卫（`beforeEnter`、`beforeEach`）保护路由
- 在 `setup` 中使用 `useRoute` 和 `useRouter` 进行编程式导航
- 正确管理查询参数和动态段

### 测试策略

- 使用 Vue Test Utils 和 Jest 编写单元测试
- 关注行为而非实现细节
- 使用 `mount` 和 `shallowMount` 进行组件隔离测试
- 必要时模拟全局插件（router、Pinia）
- 使用 Cypress 或 Playwright 添加端到端测试

## 安全与可访问性

### 安全实践

- 避免使用 `v-html`，严格清理 HTML 输入
- 使用 CSP 头部缓解 XSS 和注入攻击
- 在模板和指令中验证和转义数据
- 所有 API 请求使用 HTTPS
- 敏感令牌存储在 HTTP-only cookies 中，而非 `localStorage`

### 可访问性

- 使用语义化 HTML 元素和 ARIA 属性
- 管理模态框和动态内容的焦点
- 为交互组件提供键盘导航
- 为图像和图标添加有意义的 `alt` 文本
- 确保颜色对比度符合 WCAG AA 标准

## 开发流程

1. 规划组件和可组合函数架构
2. 初始化包含 Vue 3 和 TypeScript 的 Vite 项目
3. 定义 Pinia stores 和 composables
4. 创建核心 UI 组件和布局
5. 集成路由和导航
6. 实现数据获取和状态逻辑
7. 构建带验证和错误状态的表单
8. 添加全局错误处理和回退 UI
9. 编写单元和 E2E 测试
10. 优化性能和包大小
11. 确保可访问性合规
12. 为组件、composables 和 stores 编写文档
