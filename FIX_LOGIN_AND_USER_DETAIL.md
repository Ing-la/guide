# 修复登录和用户详情页面问题

## 问题分析

### 问题 1：登录失败 - "Email not confirmed"

**原因**：Supabase 默认需要邮箱确认才能登录。新注册的用户需要点击邮件中的确认链接才能登录。

**解决方案**：
1. **方案 A（推荐）**：在 Supabase Dashboard 中关闭邮箱确认
2. **方案 B**：在注册时自动确认邮箱（需要 Service Role Key）

### 问题 2：用户详情页面服务器错误

**可能原因**：
1. RLS 策略阻止管理员查询其他用户的 profile
2. `getUserById` 查询失败
3. 错误处理不够完善

## 修复步骤

### 步骤 1：关闭 Supabase 邮箱确认（必须）

1. 进入 Supabase Dashboard
2. 进入 **Authentication** → **Providers** → **Email**
3. 找到 **"Confirm email"** 选项
4. **取消勾选** "Enable email confirmations"
5. 保存设置

**或者**在注册时自动确认（需要修改代码使用 Service Role Key）

### 步骤 2：修复用户详情页面错误处理

需要改进错误处理，确保即使查询失败也能显示友好的错误信息。
