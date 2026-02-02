# 🚨 紧急修复：注册和登录问题

## 问题诊断

运行 `recreate-all-tables.sql` 后，可能出现以下问题：

1. ✅ 表结构已创建
2. ❌ RLS 策略可能阻止用户注册
3. ❌ 触发器可能未正确创建
4. ❌ 管理员账号被删除

## 🔧 立即修复步骤

### 步骤 1：运行快速修复 SQL

在 Supabase Dashboard → SQL Editor 中运行：

```sql
-- 复制 supabase/quick-fix-registration.sql 的全部内容并运行
```

这会：
- ✅ 确保用户可以插入自己的 profile
- ✅ 确保用户可以查看和更新自己的 profile
- ✅ 确保触发器正确创建
- ✅ 确保所有必要的函数存在

### 步骤 2：创建管理员账号

#### 方法 A：在 Supabase Dashboard 中创建（推荐）

1. 进入 **Authentication** → **Users**
2. 点击 **"Add User"** → **"Create New User"**
3. 填写：
   - **Email**: `admin@guide.com`（或你的邮箱）
   - **Password**: 设置一个强密码
   - **Auto Confirm User**: ✅ 勾选
4. 点击 **"Create User"**

5. **设置管理员角色：**
   - 进入 **Table Editor** → `guide_profiles` 表
   - 如果用户没有自动创建 profile，手动创建：
     ```sql
     INSERT INTO public.guide_profiles (id, email, nickname, role)
     VALUES (
       '用户ID',  -- 从 auth.users 表中复制
       'admin@guide.com',
       'Admin',
       'admin'
     );
     ```
   - 或者直接在 Table Editor 中找到用户，将 `role` 改为 `admin`

#### 方法 B：通过注册页面创建

1. 访问注册页面：`https://your-project.vercel.app/register`
2. 注册一个新账号
3. 在 Supabase Dashboard → **Table Editor** → `guide_profiles` 表中：
   - 找到刚注册的用户
   - 将 `role` 字段从 `user` 改为 `admin`
4. 重新登录

### 步骤 3：测试注册

1. 访问注册页面
2. 填写表单并注册
3. 检查：
   - ✅ 注册是否成功
   - ✅ 是否重定向到正确页面
   - ✅ Supabase Dashboard → `guide_profiles` 表中是否有新记录

### 步骤 4：测试登录

1. 使用刚注册的账号登录
2. 检查：
   - ✅ 登录是否成功
   - ✅ 是否重定向到正确页面（根据角色）

## 🔍 如果仍然有问题

### 检查 RLS 策略

在 Supabase Dashboard → **Authentication** → **Policies** 中检查：

1. `guide_profiles` 表应该有：
   - ✅ "Users can insert own profile" (INSERT)
   - ✅ "Guide users can view own profile" (SELECT)
   - ✅ "Guide users can update own profile" (UPDATE)
   - ✅ "Guide admins can view all profiles" (SELECT)
   - ✅ "Guide admins can update all profiles" (UPDATE)
   - ✅ "Guide admins can delete all profiles" (DELETE)

### 检查触发器

在 Supabase Dashboard → **Database** → **Triggers** 中检查：

1. `on_auth_user_created_guide` 应该存在
2. 触发时机：`AFTER INSERT` on `auth.users`
3. 函数：`handle_guide_new_user()`

### 检查函数

在 Supabase Dashboard → **Database** → **Functions** 中检查：

1. ✅ `handle_guide_new_user()` - 应该存在
2. ✅ `is_guide_admin()` - 应该存在
3. ✅ `sync_guide_profile_email()` - 应该存在（如果运行了 sync-email-trigger.sql）
4. ✅ `sync_guide_profile_email_on_insert()` - 应该存在

### 查看错误日志

1. 在 Supabase Dashboard → **Logs** → **Postgres Logs** 中查看错误
2. 在 Vercel Dashboard → **Logs** 中查看应用错误
3. 在浏览器控制台（F12）中查看前端错误

## 📝 常见错误和解决方案

### 错误 1：注册成功但 profile 未创建

**原因：** RLS 策略阻止插入或触发器未执行

**解决：**
1. 运行 `quick-fix-registration.sql`
2. 检查触发器是否存在
3. 检查 RLS 策略是否正确

### 错误 2：登录后无法访问 dashboard

**原因：** profile 不存在或 RLS 策略阻止查询

**解决：**
1. 检查 `guide_profiles` 表中是否有该用户的记录
2. 如果没有，手动创建：
   ```sql
   INSERT INTO public.guide_profiles (id, email, nickname, role)
   VALUES (
     '用户ID',
     '用户邮箱',
     '用户昵称',
     'user'
   );
   ```

### 错误 3：管理员无法查看所有用户

**原因：** `is_guide_admin()` 函数或 RLS 策略有问题

**解决：**
1. 运行 `quick-fix-registration.sql` 确保函数存在
2. 检查管理员用户的 `role` 是否为 `admin`

## ✅ 验证清单

运行修复后，验证：

- [ ] 可以注册新用户
- [ ] 注册后 `guide_profiles` 表中有新记录
- [ ] 可以登录
- [ ] 登录后重定向到正确页面
- [ ] 管理员可以访问管理后台
- [ ] 管理员可以查看所有用户
- [ ] 用户可以查看自己的 profile
