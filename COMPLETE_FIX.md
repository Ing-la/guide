# 完整修复方案

## 问题总结

### 问题 1：登录失败 - "Email not confirmed"
**原因**：Supabase 默认需要邮箱确认才能登录

**解决方案**：
1. **在 Supabase Dashboard 中关闭邮箱确认**（推荐，最简单）
   - 进入 Supabase Dashboard
   - Authentication → Providers → Email
   - 取消勾选 "Enable email confirmations"
   - 保存

2. **或者手动确认现有用户的邮箱**：
   - Authentication → Users
   - 找到用户，点击编辑
   - 将 "Email Confirmed" 设置为 true

### 问题 2：用户详情页面服务器错误
**原因**：可能是 RLS 策略问题或查询错误

**已修复**：
- ✅ 改进了错误处理，显示更详细的错误信息
- ✅ 添加了错误代码和详情输出
- ✅ 改进了 `getUserById` 的错误处理

## 必须执行的步骤

### 步骤 1：关闭 Supabase 邮箱确认（必须）

1. 进入 Supabase Dashboard
2. 进入 **Authentication** → **Providers** → **Email**
3. 找到 **"Confirm email"** 或 **"Enable email confirmations"**
4. **取消勾选**
5. 保存设置

### 步骤 2：确认现有用户的邮箱（如果需要）

如果已经有注册的用户无法登录：

1. 进入 **Authentication** → **Users**
2. 找到无法登录的用户
3. 点击用户，进入编辑页面
4. 找到 **"Email Confirmed"** 字段
5. 设置为 **true**
6. 保存

### 步骤 3：检查 RLS 策略（如果用户详情页面仍然报错）

在 Supabase Dashboard → SQL Editor 中运行：

```sql
-- 检查 RLS 策略
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'guide_profiles';

-- 检查 is_guide_admin 函数
SELECT proname, pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'is_guide_admin';
```

如果策略不存在，运行 `recreate-all-tables.sql` 中的 RLS 策略部分。

## 验证

修复后验证：

1. **登录测试**：
   - 使用现有账号登录
   - 应该不再显示 "Email not confirmed" 错误
   - 应该能成功登录并重定向到对应页面

2. **用户详情页面测试**：
   - 管理员登录后
   - 进入用户管理
   - 点击"查看/编辑"
   - 应该能正常显示用户详情页面

3. **如果仍然有问题**：
   - 查看页面显示的具体错误信息
   - 查看浏览器控制台（F12）的错误
   - 查看 Vercel Logs 中的错误

## 代码修复

已修复的代码：
- ✅ `src/lib/actions/users.ts` - 改进了 `getUserById` 的错误处理
- ✅ `src/app/dashboard/users/[id]/page.tsx` - 改进了错误显示

## 重要提示

**邮箱确认设置是 Supabase 的全局设置**，关闭后：
- ✅ 新注册的用户可以直接登录（无需确认邮箱）
- ✅ 现有未确认的用户仍然无法登录（需要手动确认）

**如果不想关闭全局设置**，可以：
- 在注册时使用 Service Role Key 自动确认邮箱
- 或者手动在 Dashboard 中确认每个用户的邮箱
