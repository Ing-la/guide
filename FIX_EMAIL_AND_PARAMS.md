# 修复邮箱显示和 params 问题

## 问题总结

1. **UUID undefined 错误**：Next.js 16 中 `params` 是 Promise，需要 `await`
2. **邮箱显示错误**：用户列表显示的是 UUID 而不是邮箱
3. **邮箱存储逻辑混乱**：`guide_profiles` 表没有 `email` 字段，邮箱存储在 `auth.users` 中

## 修复内容

### 1. 数据库迁移

运行以下 SQL 脚本（按顺序）：

#### 步骤 1：添加 email 字段
```sql
-- 文件：supabase/add-email-column.sql
ALTER TABLE public.guide_profiles ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE public.guide_profiles gp
SET email = au.email
FROM auth.users au
WHERE gp.id = au.id AND gp.email IS NULL;

CREATE INDEX IF NOT EXISTS idx_guide_profiles_email ON public.guide_profiles(email);
```

#### 步骤 2：创建邮箱同步触发器
```sql
-- 文件：supabase/sync-email-trigger.sql
-- 自动同步 auth.users.email 到 guide_profiles.email
```

### 2. 代码修复

#### 修复了所有详情页面的 params 问题：
- `src/app/dashboard/users/[id]/page.tsx`
- `src/app/dashboard/guides/[id]/page.tsx`
- `src/app/dashboard/demands/[id]/page.tsx`
- `src/app/dashboard/orders/[id]/page.tsx`

#### 更新了类型定义：
- `src/types/database.ts` - 添加了 `email` 字段到 `Profile` 类型

#### 更新了用户数据获取：
- `src/lib/actions/users.ts` - 确保返回包含 email
- `src/lib/auth/actions.ts` - 注册和登录时保存 email
- `src/app/dashboard/layout.tsx` - 创建 profile 时包含 email

#### 修复了用户列表显示：
- `src/app/dashboard/users/page.tsx` - 显示正确的邮箱而不是 UUID

#### 添加了用户详情页邮箱显示：
- `src/app/dashboard/users/[id]/page.tsx` - 显示邮箱字段

## 部署步骤

1. **在 Supabase SQL Editor 中运行**：
   - `supabase/add-email-column.sql`
   - `supabase/sync-email-trigger.sql`

2. **推送代码到 GitHub**：
   ```bash
   git add .
   git commit -m "Fix: Add email column and fix Next.js 16 params issue"
   git push
   ```

3. **Vercel 会自动重新部署**

## 关于邮箱和昵称的逻辑说明

### 当前设计：
- **邮箱**：存储在 `auth.users.email` 和 `guide_profiles.email`（同步）
- **昵称**：存储在 `guide_profiles.nickname`
- **注册时**：如果没有提供昵称，使用 `email.split('@')[0]` 作为默认昵称
- **数据库触发器**：当 `auth.users.email` 更新时，自动同步到 `guide_profiles.email`

### 为什么这样设计：
1. **邮箱是登录凭证**：Supabase Auth 使用邮箱进行认证
2. **昵称是用户资料**：用户可以自定义显示名称
3. **数据同步**：通过触发器确保两个表的邮箱一致
4. **向后兼容**：如果 `guide_profiles.email` 为空，会回退显示 UUID（临时方案）

## 验证

部署后验证：
1. 用户列表页面应显示正确的邮箱
2. 用户详情页面应显示邮箱字段
3. 点击"查看/编辑"不应再出现 UUID undefined 错误
4. 新注册的用户应自动包含邮箱
