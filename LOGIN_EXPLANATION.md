# 登录逻辑说明

## 登录方式

**登录使用邮箱（email）和密码（password）进行认证。**

### 详细说明

1. **邮箱和密码存储位置**：
   - 邮箱和密码存储在 Supabase 的 `auth.users` 表中
   - `auth.users` 是 Supabase Auth 系统管理的表，密码经过加密存储

2. **用户资料存储位置**：
   - 用户的其他信息（昵称、手机号、角色等）存储在 `guide_profiles` 表中
   - `guide_profiles.id` 与 `auth.users.id` 关联（一对一关系）

3. **登录流程**：
   ```
   用户输入邮箱和密码
   ↓
   Supabase Auth 验证 auth.users 表中的邮箱和密码
   ↓
   验证成功后，获取 auth.users.id
   ↓
   使用 auth.users.id 查询 guide_profiles 表获取用户角色
   ↓
   根据角色重定向到对应页面
   ```

4. **重要**：
   - **不是**通过 `guide_profiles` 表中的字段登录
   - `guide_profiles` 表只存储用户资料，不存储密码
   - 登录认证完全由 Supabase Auth 系统处理

## 注册流程

1. 用户在注册页面填写邮箱、密码等信息
2. Supabase Auth 创建 `auth.users` 记录（存储邮箱和加密密码）
3. 触发器 `on_auth_user_created_guide` 自动创建 `guide_profiles` 记录
4. 或者代码中手动创建 `guide_profiles` 记录

## 修改密码

密码修改需要通过 Supabase Auth API：
- 用户可以通过 Supabase 提供的密码重置功能修改密码
- 密码始终存储在 `auth.users` 表中，不会存储在 `guide_profiles` 表中
