# 修复说明 - Vercel + Supabase 集成

## ✅ 已修复的问题

### 1. 环境变量名称不匹配

**问题：**
- Vercel Supabase 集成创建的环境变量是：`NEXT_PUBLIC_guide_SUPABASE_URL` 和 `NEXT_PUBLIC_guide_SUPABASE_ANON_KEY`
- 代码中使用的是：`NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**解决方案：**
- 创建了 `src/lib/supabase/config.ts` 统一管理环境变量
- 支持两种命名方式（优先使用带前缀的，兼容标准命名）
- 更新了所有 Supabase 客户端文件

### 2. 数据隔离

**问题：**
- 复用了另一个项目的 Supabase 数据库
- 需要隔离不同项目的数据

**解决方案：**
- 所有表名添加 `guide_` 前缀：
  - `profiles` → `guide_profiles`
  - `guides` → `guide_guides`
  - `demands` → `guide_demands`
  - `orders` → `guide_orders`
  - `complaints` → `guide_complaints`
  - `guide_titles` → `guide_titles`（保持不变）
- 更新了所有代码中的表名引用
- 更新了 RLS 策略名称（添加 `Guide` 前缀）
- 更新了触发器名称（避免冲突）

### 3. Storage 隔离

**注意：** Storage 隔离需要在 Supabase Dashboard 中手动配置：

1. 进入 Supabase Dashboard → Storage
2. 创建新的 bucket，命名为 `guide-avatars`（或使用项目前缀）
3. 更新代码中的 Storage bucket 名称（如果实现了头像上传功能）

---

## 📋 更新的文件

### 新增文件
- `src/lib/supabase/config.ts` - 环境变量配置

### 修改的文件
- `src/lib/supabase/server.ts` - 使用新的配置
- `src/lib/supabase/client.ts` - 使用新的配置
- `src/middleware.ts` - 使用新的配置
- `src/lib/auth/actions.ts` - 添加项目标识
- `src/lib/actions/users.ts` - 更新表名
- `src/lib/actions/guides.ts` - 更新表名
- `src/lib/actions/demands.ts` - 更新表名
- `src/lib/actions/orders.ts` - 更新表名
- `src/app/dashboard/page.tsx` - 更新表名
- `src/app/dashboard/layout.tsx` - 更新表名
- `src/app/dashboard/complaints/page.tsx` - 更新表名
- `supabase/schema.sql` - 完全重写，使用表名前缀

---

## 🚀 下一步操作

### 1. 运行新的 SQL Schema

在 Supabase Dashboard 的 SQL Editor 中运行更新后的 `supabase/schema.sql`。

**重要：** 这会创建带 `guide_` 前缀的新表，不会影响其他项目的表。

### 2. 提交并推送代码

```bash
git add .
git commit -m "Fix: Add data isolation with table prefixes and fix env var names"
git push origin main
```

### 3. 重新部署

Vercel 会自动检测到新的提交并重新部署。

### 4. 验证

部署后访问：
- `https://your-project.vercel.app/login`
- 应该不再出现 `MIDDLEWARE_INVOCATION_FAILED` 错误

---

## ⚠️ 注意事项

1. **数据库迁移：** 如果之前已经运行过旧的 schema.sql，需要：
   - 删除旧表（如果存在且没有重要数据）
   - 或者保留旧表，只使用新表

2. **用户数据：** 注册新用户时，会在 `guide_profiles` 表中创建记录

3. **Storage：** 如果需要头像上传功能，记得创建独立的 Storage bucket

4. **环境变量：** Vercel 中的环境变量名称是正确的，代码现在会自动适配

---

## 🔍 故障排除

### 如果仍然出现 500 错误：

1. **检查环境变量：**
   - 确认 Vercel 中有 `NEXT_PUBLIC_guide_SUPABASE_URL` 和 `NEXT_PUBLIC_guide_SUPABASE_ANON_KEY`
   - 或者添加标准的 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **检查数据库表：**
   - 确认已运行新的 schema.sql
   - 确认表名是 `guide_*` 格式

3. **检查 Vercel 部署日志：**
   - 在 Vercel Dashboard → Deployments → 查看日志
   - 查找具体的错误信息

---

## ✅ 验证清单

- [x] 环境变量配置已修复
- [x] 所有表名已更新为带前缀
- [x] 所有代码引用已更新
- [x] RLS 策略已更新
- [x] 触发器已更新（避免冲突）
- [ ] SQL Schema 已在 Supabase 中运行
- [ ] 代码已推送到 GitHub
- [ ] Vercel 已重新部署
- [ ] 网站可以正常访问
