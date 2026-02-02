# 问题修复说明

## 🐛 已修复的问题

### 1. RLS 策略递归问题 ✅

**问题：** `infinite recursion detected in policy for relation "guide_profiles"`

**原因：** RLS 策略在检查管理员权限时，又查询 `guide_profiles` 表，造成无限递归。

**解决方案：**
- 创建 `is_guide_admin()` 函数，使用 `SECURITY DEFINER` 避免递归
- 更新所有 RLS 策略使用该函数

**操作：** 在 Supabase Dashboard → SQL Editor 中运行 `supabase/fix-rls-recursion.sql`

---

### 2. 注册后登录无反应 ✅

**问题：** 注册成功但登录后没有反应，数据库可以看到数据。

**原因：** 
- 触发器可能没有正确创建 `guide_profiles` 记录
- 注册时没有确保 profile 被创建

**解决方案：**
- 在 `signUp` 函数中，注册成功后立即创建 `guide_profiles` 记录
- 在 `signIn` 函数中，如果 profile 不存在则自动创建
- 在 `dashboard/layout.tsx` 中，如果 profile 不存在则自动创建

---

### 3. 登录错误没有提示 ✅

**问题：** 使用未注册账号登录时没有反应，应该提示错误。

**解决方案：**
- 登录页面已经支持错误显示（通过 `searchParams.error`）
- `signIn` 函数会在错误时重定向到登录页并显示错误信息

---

### 4. 注册字段简化 ✅

**问题：** 注册时只填写邮箱和密码，其他字段可选。

**解决方案：**
- 手机号和昵称改为可选字段
- 如果没有填写昵称，自动使用邮箱前缀
- 注册成功后自动创建 profile

---

### 5. 页面错误处理 ✅

**问题：** 某些页面出现错误时直接崩溃，显示 "Application error"。

**解决方案：**
- 在所有数据加载函数中添加 try-catch
- 错误时显示友好的错误提示
- 不再直接抛出错误导致页面崩溃

---

## 📋 修复的文件

### SQL 文件
- `supabase/fix-rls-recursion.sql` - 修复 RLS 递归问题

### 代码文件
- `src/lib/auth/actions.ts` - 改进注册和登录逻辑
- `src/app/dashboard/layout.tsx` - 自动创建缺失的 profile
- `src/app/dashboard/page.tsx` - 添加错误处理
- `src/app/dashboard/users/page.tsx` - 添加错误处理
- `src/app/dashboard/complaints/page.tsx` - 改进错误显示

---

## 🚀 操作步骤

### 1. 修复 RLS 策略（重要！）

在 Supabase Dashboard → SQL Editor 中运行 `supabase/fix-rls-recursion.sql`

这会：
- 删除旧的递归策略
- 创建 `is_guide_admin()` 函数
- 创建新的非递归策略

### 2. 提交代码

```bash
git add .
git commit -m "Fix: RLS recursion, registration logic, and error handling"
git push origin main
```

### 3. 等待 Vercel 重新部署

Vercel 会自动检测到新的提交并重新部署。

### 4. 测试

- ✅ 测试注册（只填邮箱和密码）
- ✅ 测试登录（包括错误账号）
- ✅ 测试管理后台各个页面
- ✅ 确认不再出现递归错误

---

## ✅ 验证清单

### RLS 策略
- [ ] 运行 `fix-rls-recursion.sql`
- [ ] 确认不再出现递归错误

### 注册功能
- [ ] 只填写邮箱和密码可以注册
- [ ] 注册成功后可以登录
- [ ] `guide_profiles` 表中自动创建记录

### 登录功能
- [ ] 错误账号登录时显示错误提示
- [ ] 正确账号登录后可以访问管理后台

### 管理后台
- [ ] 仪表盘可以正常访问
- [ ] 用户管理可以正常访问
- [ ] 导游管理可以正常访问
- [ ] 需求管理可以正常访问
- [ ] 订单管理可以正常访问
- [ ] 投诉查看可以正常访问

---

## 🔍 如果仍有问题

### 问题 1: 仍然出现递归错误

**解决：**
1. 确认已运行 `fix-rls-recursion.sql`
2. 检查是否所有策略都已更新
3. 在 SQL Editor 中运行验证查询：

```sql
SELECT policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename LIKE 'guide_%' 
  AND policyname LIKE 'Guide%';
```

### 问题 2: 注册后仍然无法登录

**检查：**
1. 确认 `guide_profiles` 表中有记录
2. 检查浏览器控制台是否有错误
3. 检查 Vercel 部署日志

### 问题 3: 页面仍然显示 Application error

**检查：**
1. 确认代码已推送并部署
2. 检查 Vercel 部署日志
3. 确认 RLS 策略已修复
