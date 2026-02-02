# 部署指南 - Vercel + Supabase 集成

## 🚀 部署流程

### 第一步：推送代码到 GitHub

```bash
cd guide-admin
git init
git add .
git commit -m "Initial commit: Guide admin dashboard"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

**确认事项：**
- ✅ `.env.local` 不会被提交（已在 `.gitignore` 中）
- ✅ `node_modules` 不会被提交
- ✅ 所有源代码已提交

---

### 第二步：在 Vercel 中导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New Project"**
3. 选择你的 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目

---

### 第三步：在 Vercel 中创建 Supabase 集成

#### 方式一：通过 Vercel 集成（推荐）

1. 在 Vercel 项目设置中，找到 **"Integrations"** 或 **"Storage"**
2. 点击 **"Add Integration"**
3. 选择 **"Supabase"**
4. 选择 **"Create a new Supabase project"** 或连接现有项目
5. Vercel 会自动：
   - 创建 Supabase 项目
   - 配置环境变量（`NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
   - 设置重定向 URL

#### 方式二：手动创建 Supabase 项目

如果 Vercel 集成不可用，可以：

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目
3. 在 Vercel 项目设置中手动添加环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

### 第四步：设置 Supabase 数据库

#### 1. 运行数据库 Schema

1. 在 Supabase Dashboard 中，进入 **SQL Editor**
2. 点击 **"New Query"**
3. 复制 `supabase/schema.sql` 文件的全部内容
4. 粘贴到 SQL Editor
5. 点击 **"Run"** 执行

**这会创建：**
- ✅ 所有数据表（profiles, guides, demands, orders, complaints, guide_titles）
- ✅ 索引
- ✅ RLS 策略
- ✅ 触发器（自动创建 profile、更新时间戳）

#### 2. 验证表创建成功

在 Supabase Dashboard 的 **Table Editor** 中确认以下表已创建：
- `profiles`
- `guides`
- `demands`
- `orders`
- `complaints`
- `guide_titles`

---

### 第五步：配置 Supabase Auth 重定向 URL

1. 在 Supabase Dashboard 中，进入 **Authentication** → **URL Configuration**
2. 添加以下重定向 URL：
   - `https://your-project.vercel.app/**`（生产环境）
   - `http://localhost:3000/**`（本地开发，可选）

---

### 第六步：创建管理员账号

#### 方法一：通过注册页面

1. 访问部署后的网站：`https://your-project.vercel.app/register`
2. 注册一个新账号
3. 在 Supabase Dashboard 的 **Table Editor** 中：
   - 打开 `profiles` 表
   - 找到刚注册的用户
   - 将 `role` 字段从 `user` 改为 `admin`
4. 重新登录，即可访问管理后台

#### 方法二：直接在 Supabase 中创建（推荐）

1. 在 Supabase Dashboard 中，进入 **Authentication** → **Users**
2. 点击 **"Add User"** → **"Create New User"**
3. 填写邮箱和密码
4. 创建后，在 **Table Editor** 的 `profiles` 表中：
   - 找到该用户（如果没有自动创建，手动创建一条记录）
   - 设置 `role` 为 `admin`

---

### 第七步：验证部署

访问以下页面确认功能正常：

- ✅ `https://your-project.vercel.app/` - 首页重定向
- ✅ `https://your-project.vercel.app/login` - 登录页面
- ✅ `https://your-project.vercel.app/register` - 注册页面
- ✅ `https://your-project.vercel.app/dashboard` - 管理后台（需要登录）

---

## 🔧 常见问题

### 1. 环境变量未正确配置

**症状：** 页面显示 Supabase 连接错误

**解决：**
- 检查 Vercel 项目设置中的环境变量
- 确认 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已设置
- 重新部署项目

### 2. RLS 策略阻止访问

**症状：** 无法查看数据或操作被拒绝

**解决：**
- 确认已运行 `schema.sql` 中的所有 RLS 策略
- 在 Supabase Dashboard 的 **Authentication** → **Policies** 中检查策略
- 确认用户角色为 `admin`

### 3. 用户注册后无法访问管理后台

**症状：** 注册成功但无法访问 `/dashboard`

**解决：**
- 在 `profiles` 表中将用户的 `role` 设置为 `admin`
- 重新登录

### 4. 数据库表不存在

**症状：** 页面显示表不存在的错误

**解决：**
- 确认已运行 `schema.sql`
- 在 Supabase Dashboard 的 **Table Editor** 中检查表是否存在
- 如果表不存在，重新运行 SQL 脚本

---

## 📋 部署检查清单

### 代码准备
- [x] 代码已推送到 GitHub
- [x] `.gitignore` 已正确配置
- [x] 构建测试通过（`npm run build`）

### Vercel 配置
- [ ] 项目已导入到 Vercel
- [ ] Supabase 集成已配置（或环境变量已设置）
- [ ] 部署成功

### Supabase 配置
- [ ] Supabase 项目已创建
- [ ] 数据库 Schema 已运行（`schema.sql`）
- [ ] RLS 策略已配置
- [ ] Auth 重定向 URL 已设置
- [ ] 管理员账号已创建

### 功能验证
- [ ] 登录功能正常
- [ ] 注册功能正常
- [ ] 管理后台可以访问
- [ ] 数据可以正常加载
- [ ] CRUD 操作正常

---

## 🎉 完成！

部署完成后，你的管理后台就可以使用了！

**项目地址：** `https://your-project.vercel.app`

**下一步：**
- 添加测试数据
- 测试所有功能
- 根据需要调整 UI 和功能
