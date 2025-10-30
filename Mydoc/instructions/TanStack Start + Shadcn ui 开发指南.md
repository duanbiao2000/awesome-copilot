# TanStack Start + Shadcn/ui 开发指南

## 核心技术栈
- **TypeScript**：严格模式下的类型安全开发
- **TanStack Start**：基于文件的路由和服务器端渲染(SSR)
- **Shadcn/ui**：基于 Tailwind CSS 的可访问 UI 组件库
- **Tailwind CSS**：实用优先的样式框架
- **Zod**：运行时数据验证
- **TanStack Query**：客户端状态管理和数据获取

## 代码规范

### 类型安全
- 永远不使用 `any` 类型，始终使用适当的 TypeScript 类型
- 优先使用函数组件而非类组件
- 所有外部数据必须通过 Zod 模式进行验证

### 组件模式
使用函数组件配合 TypeScript 接口定义：

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn(buttonVariants({ variant }))}>
      {children}
    </button>
  );
}
```

## 数据获取策略

### Route Loaders
用于初始页面数据和 SSR 需求：

```typescript
export const Route = createFileRoute('/users')({
  loader: async () => {
    const users = await fetchUsers()
    return { users: userListSchema.parse(users) }
  },
  component: UserList,
})
```

### React Query
用于频繁更新的数据和客户端变更：

```typescript
const { data: stats } = useQuery({
  queryKey: ['user-stats', userId],
  queryFn: () => fetchUserStats(userId),
  refetchInterval: 30000,
});
```

## Zod 验证模式

在 `src/lib/schemas.ts` 中定义验证模式：

```typescript
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user']).default('user'),
})

export type User = z.infer<typeof userSchema>

// 安全解析
const result = userSchema.safeParse(data)
if (!result.success) {
  console.error('Validation failed:', result.error.format())
  return null
}
```

## 路由结构

在 `src/routes/` 中使用基于文件的路由，始终包含错误和加载边界：

```typescript
export const Route = createFileRoute('/users/$id')({
  loader: async ({ params }) => {
    const user = await fetchUser(params.id);
    return { user: userSchema.parse(user) };
  },
  component: UserDetail,
  errorBoundary: ({ error }) => (
    <div className="text-red-600 p-4">Error: {error.message}</div>
  ),
  pendingBoundary: () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});
```

## UI 组件使用

优先使用 Shadcn/ui 组件：

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>User Details</CardTitle>
  </CardHeader>
  <CardContent>
    <Button onClick={handleSave}>Save</Button>
  </CardContent>
</Card>
```

## 可访问性实践

优先使用语义化 HTML，仅在必要时添加 ARIA：

```typescript
// ✅ 好的实践：语义化 HTML 配合最小 ARIA
<button onClick={toggleMenu}>
  <MenuIcon aria-hidden="true" />
  <span className="sr-only">Toggle Menu</span>
</button>

// ✅ 好的实践：动态状态时使用 ARIA
<button
  aria-expanded={isOpen}
  aria-controls="menu"
  onClick={toggleMenu}
>
  Menu
</button>
```

## 文件组织结构

```
src/
├── components/ui/    # Shadcn/ui 组件
├── lib/schemas.ts    # Zod 验证模式
├── routes/          # 基于文件的路由
└── routes/api/      # 服务端路由 (.ts)
```

## 导入规范

统一使用 `@/` 别名进行内部导入：

```typescript
// ✅ 推荐
import { Button } from '@/components/ui/button'
import { userSchema } from '@/lib/schemas'

// ❌ 不推荐
import { Button } from '../components/ui/button'
```

## 组件添加

需要时通过 CLI 安装 Shadcn 组件：

```bash
npx shadcn@latest add button card input dialog
```
