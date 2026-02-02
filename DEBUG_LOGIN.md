# 登录问题调试指南

## 当前状态

✅ `role` 字段存在且正确设置
- 用户1: role = "user"
- 用户2: role = "admin" (min1@guide.com)

## 可能的问题

### 1. 登录后重定向问题

**症状**：登录后无法访问用户界面

**检查**：
1. 登录时是否显示错误信息？
2. 登录后重定向到哪个页面？
3. 浏览器控制台（F12）是否有错误？

**修复**：
- 已修复首页重定向逻辑，会根据角色重定向到对应页面
- 中间件会先重定向到 `/dashboard`，然后由 layout 根据角色显示对应内容

### 2. RLS 策略问题

**症状**：登录后查询 profile 失败

**检查**：
在 Supabase Dashboard → SQL Editor 中运行：
```sql
-- 检查当前用户的 profile 是否可以查询
SELECT * FROM public.guide_profiles 
WHERE id = auth.uid();
```

**修复**：
确保运行了 `recreate-all-tables.sql` 中的所有 RLS 策略

### 3. 中间件重定向循环

**症状**：页面不断重定向

**检查**：
- 查看浏览器 Network 标签，看是否有重定向循环
- 检查 Vercel Logs 中的错误

**修复**：
- 中间件已修复，不会造成循环

## 调试步骤

### 步骤 1：检查登录流程

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 尝试登录
4. 查看：
   - 登录请求是否成功（状态码 200）
   - 重定向到哪个页面
   - 是否有错误请求

### 步骤 2：检查错误信息

1. **登录页面**：查看 URL 中是否有 `?error=...` 参数
2. **浏览器控制台**：查看 Console 标签中的错误
3. **Vercel Logs**：查看服务器端错误

### 步骤 3：测试不同角色

1. **测试管理员登录**：
   - 使用 `min1@guide.com` 登录
   - 应该重定向到 `/dashboard`（管理后台）

2. **测试普通用户登录**：
   - 使用 role = "user" 的用户登录
   - 应该重定向到 `/dashboard/user`（用户中心）

### 步骤 4：检查数据库

在 Supabase Dashboard → SQL Editor 中运行：
```sql
-- 查看所有用户的 role
SELECT id, email, nickname, role, created_at 
FROM public.guide_profiles 
ORDER BY created_at DESC;
```

## 常见错误和解决方案

### 错误 1：登录后显示 "Application error"

**原因**：Layout 中查询 profile 失败

**解决**：
- 检查 RLS 策略是否正确
- 查看 Vercel Logs 中的具体错误

### 错误 2：登录后重定向到错误页面

**原因**：role 查询失败或为 NULL

**解决**：
- 确保 `guide_profiles` 表中的 `role` 字段不为 NULL
- 运行 `fix-existing-users-role.sql` 修复

### 错误 3：无法访问用户界面

**原因**：RLS 策略阻止访问

**解决**：
- 确保 "Guide users can view own profile" 策略存在
- 确保用户已登录（auth.uid() 不为 NULL）

## 需要的信息

如果仍然无法登录，请提供：

1. **登录时显示的错误信息**（如果有）
2. **浏览器控制台的错误**（F12 → Console）
3. **登录后重定向到的 URL**
4. **Vercel Logs 中的错误**（如果有）

这些信息可以帮助我准确定位问题。
