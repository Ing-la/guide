# 快速部署指南 - Vercel + Supabase 集成

## 🎯 你的部署计划

1. ✅ 推送代码到 GitHub
2. ✅ Vercel 接管仓库
3. ✅ 在 Vercel 中创建 Supabase（自动配置环境变量）
4. ✅ 配置数据库 Schema 和 RLS 策略

---

## 📝 详细步骤

### 1. 推送代码到 GitHub

```bash
cd guide-admin
git init
git add .
git commit -m "Initial commit: Guide admin dashboard"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

**确认：**
- ✅ `.env.local` 不会被提交（已在 `.gitignore` 中）
- ✅ 所有源代码已提交

---

### 2. Vercel 接管项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New Project"**
3. 选择你的 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目

---

### 3. 在 Vercel 中创建 Supabase 集成 ⭐

这是关键步骤！Vercel 会自动配置环境变量。

#### 方法一：通过 Vercel 集成（推荐）

1. 在 Vercel 项目设置页面，找到 **"Integrations"** 标签
2. 搜索 **"Supabase"**
3. 点击 **"Add Integration"**
4. 选择 **"Create a new Supabase project"**
5. 填写项目名称和数据库密码
6. Vercel 会自动：
   - ✅ 创建 Supabase 项目
   - ✅ 配置 `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ 配置 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ 设置重定向 URL

#### 方法二：如果集成不可用

1. 手动在 [Supabase Dashboard](https://supabase.com/dashboard) 创建项目
2. 在 Vercel 项目设置 → **Environment Variables** 中手动添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### 4. 配置数据库 Schema 和 RLS 策略 🔐

**重要：** 这一步必须在 Supabase Dashboard 中手动完成。

1. **打开 Supabase Dashboard**
   - 如果通过 Vercel 集成创建，在 Vercel 项目设置中会有 Supabase 项目的链接
   - 或者访问 [Supabase Dashboard](https://supabase.com/dashboard) 找到你的项目

2. **运行 SQL Schema**
   - 进入 **SQL Editor**
   - 点击 **"New Query"**
   - 打开项目中的 `supabase/schema.sql` 文件
   - 复制全部内容（209 行）
   - 粘贴到 SQL Editor
   - 点击 **"Run"** 执行

3. **验证表创建成功**
   - 进入 **Table Editor**
   - 确认以下表已创建：
     - ✅ `profiles`
     - ✅ `guides`
     - ✅ `demands`
     - ✅ `orders`
     - ✅ `complaints`
     - ✅ `guide_titles`

4. **验证 RLS 策略**
   - 进入 **Authentication** → **Policies**
   - 确认每个表都有相应的策略
   - 或者运行以下 SQL 查询检查：
     ```sql
     SELECT tablename, policyname 
     FROM pg_policies 
     WHERE schemaname = 'public';
     ```

---

### 5. 配置 Auth 重定向 URL

1. 在 Supabase Dashboard 中，进入 **Authentication** → **URL Configuration**
2. 在 **Redirect URLs** 中添加：
   ```
   https://your-project.vercel.app/**
   ```
3. 保存

---

### 6. 创建管理员账号 👤

#### 推荐方法：直接在 Supabase 中创建

1. 在 Supabase Dashboard 中，进入 **Authentication** → **Users**
2. 点击 **"Add User"** → **"Create New User"**
3. 填写：
   - Email: `admin@example.com`（或你的邮箱）
   - Password: 设置一个强密码
   - Auto Confirm User: ✅ 勾选（自动确认，无需邮箱验证）
4. 点击 **"Create User"**

5. **设置管理员角色**
   - 进入 **Table Editor** → `profiles` 表
   - 找到刚创建的用户（如果没有自动创建 profile，手动创建一条记录）
   - 将 `role` 字段设置为 `admin`
   - 保存

6. **测试登录**
   - 访问 `https://your-project.vercel.app/login`
   - 使用刚创建的邮箱和密码登录
   - 应该能成功进入管理后台

---

### 7. 验证部署 ✅

访问以下页面确认功能正常：

- ✅ `https://your-project.vercel.app/` - 首页（应重定向到登录页）
- ✅ `https://your-project.vercel.app/login` - 登录页面
- ✅ `https://your-project.vercel.app/register` - 注册页面
- ✅ `https://your-project.vercel.app/dashboard` - 管理后台（需要登录）

---

## 🎉 完成！

部署完成后，你的管理后台就可以使用了！

---

## 📋 快速检查清单

### 代码准备
- [x] 代码已推送到 GitHub
- [x] `.gitignore` 已正确配置
- [x] 构建测试通过

### Vercel 配置
- [ ] 项目已导入到 Vercel
- [ ] Supabase 集成已配置（或环境变量已设置）
- [ ] 首次部署成功

### Supabase 配置
- [ ] Supabase 项目已创建
- [ ] 数据库 Schema 已运行（`supabase/schema.sql`）
- [ ] RLS 策略已配置
- [ ] Auth 重定向 URL 已设置
- [ ] 管理员账号已创建并设置 role 为 `admin`

### 功能验证
- [ ] 登录功能正常
- [ ] 注册功能正常
- [ ] 管理后台可以访问
- [ ] 仪表盘数据可以加载
- [ ] 各模块 CRUD 操作正常

---

## ⚠️ 常见问题

### Q: Vercel 集成中找不到 Supabase？
**A:** 确保你使用的是 Vercel 账户（不是团队账户的受限版本）。如果不可用，可以手动创建 Supabase 项目并配置环境变量。

### Q: 运行 SQL 后表没有创建？
**A:** 检查 SQL Editor 的错误信息。确保：
- 复制了完整的 SQL（包括所有 CREATE TABLE 和 CREATE POLICY 语句）
- 没有语法错误
- 有足够的权限

### Q: 登录后无法访问管理后台？
**A:** 检查：
1. 用户的 `role` 是否为 `admin`（在 `profiles` 表中）
2. RLS 策略是否正确配置
3. 浏览器控制台是否有错误信息

### Q: 环境变量在哪里查看？
**A:** 
- Vercel: 项目设置 → Environment Variables
- Supabase: 项目设置 → API Settings

---

**需要帮助？** 查看 `DEPLOYMENT.md` 获取更详细的说明。
