# 完整修复方案

## 问题总结

1. ✅ **用户详情页面错误**：已修复 params 和权限检查
2. ✅ **注册后数据库没有数据**：已创建完整的数据库重建 SQL
3. ✅ **用户/导游登录后界面**：已创建专用界面（显示"待开发"）
4. ✅ **角色重定向**：已实现根据角色重定向到不同页面

## 修复内容

### 1. 创建用户和导游专用界面

- `src/app/dashboard/user/page.tsx` - 用户中心（显示"待开发"）
- `src/app/dashboard/guide/page.tsx` - 导游中心（显示"待开发"）

### 2. 根据角色重定向

- 更新了 `src/lib/auth/actions.ts`：
  - 注册后根据角色重定向
  - 登录后根据角色重定向

### 3. 更新 Dashboard Layout

- `src/app/dashboard/layout.tsx`：
  - 根据角色显示不同的导航菜单
  - 管理员：显示完整的管理功能
  - 导游/用户：只显示"我的中心"

### 4. 修复用户详情页面

- `src/app/dashboard/users/[id]/page.tsx`：
  - 添加管理员权限检查
  - 非管理员显示"访问受限"
  - 改进错误处理

### 5. 完整的数据库重建 SQL

- `supabase/recreate-all-tables.sql`：
  - 删除所有旧表
  - 重新创建所有表（包含 email 字段）
  - 创建所有触发器
  - 设置所有 RLS 策略

## 部署步骤

### 步骤 1：重建数据库（推荐）

**⚠️ 警告：这会删除所有现有数据！**

1. 在 Supabase Dashboard → SQL Editor 中
2. 运行 `supabase/recreate-all-tables.sql` 的全部内容
3. 这会：
   - 删除所有 `guide_*` 表
   - 重新创建包含 `email` 字段的表
   - 设置所有触发器和 RLS 策略

### 步骤 2：创建管理员账号

运行以下 SQL（替换邮箱和密码）：

```sql
-- 创建管理员用户（需要手动在 Supabase Auth 中创建，然后运行这个）
-- 或者使用 Supabase Dashboard → Authentication → Add User

-- 假设管理员 ID 是 'your-admin-uuid-here'
UPDATE public.guide_profiles 
SET role = 'admin' 
WHERE id = 'your-admin-uuid-here';
```

### 步骤 3：推送代码

```bash
git add .
git commit -m "Fix: Add user/guide dashboards, role-based redirects, and complete DB recreation"
git push
```

### 步骤 4：验证

1. **注册新用户**：
   - 选择角色（用户/导游）
   - 注册后应重定向到对应界面
   - 检查数据库是否有数据

2. **登录**：
   - 管理员 → `/dashboard`（管理后台）
   - 导游 → `/dashboard/guide`（导游中心）
   - 用户 → `/dashboard/user`（用户中心）

3. **用户详情页面**：
   - 管理员可以访问
   - 非管理员显示"访问受限"

## 如果不想删除数据

如果不想删除现有数据，可以只运行：

1. `supabase/add-email-column.sql` - 添加 email 字段
2. `supabase/sync-email-trigger.sql` - 创建邮箱同步触发器
3. `supabase/fix-all-issues.sql` - 修复 RLS 策略

但推荐使用完整的重建方案，因为：
- 确保所有表结构正确
- 确保所有触发器正确
- 确保所有 RLS 策略正确
- 避免遗留问题

## 注册问题排查

如果注册后数据库仍然没有数据，检查：

1. **RLS 策略**：确保 `Users can insert own profile` 策略存在
2. **触发器**：确保 `on_auth_user_created_guide` 触发器存在
3. **email 字段**：确保 `guide_profiles` 表有 `email` 字段
4. **错误日志**：查看 Supabase Dashboard → Logs

## 下一步

1. 运行数据库重建 SQL
2. 创建管理员账号
3. 测试注册和登录
4. 根据需求开发用户和导游的具体功能
