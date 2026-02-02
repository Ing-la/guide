# 部署指南

本文档详细介绍如何部署导游管理后台系统到 Vercel。

## 📋 前置要求

- GitHub 账号
- Vercel 账号（免费版即可）
- Supabase 账号（免费版即可）

## 🚀 部署步骤

### 1. 准备 Supabase 项目

#### 1.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 创建新项目（或使用现有项目）
3. 记录项目 URL 和 API Keys

#### 1.2 配置数据库

1. 进入 Supabase Dashboard → SQL Editor
2. 运行 `supabase/schema.sql` 创建所有表和策略
3. 运行 `supabase/storage-policies.sql`（如果需要文件上传功能）

#### 1.3 配置认证设置

1. 进入 Authentication → Settings
2. **重要**: 取消勾选 "Enable email confirmations"（开发环境）
3. 配置 Email 提供商设置

#### 1.4 创建管理员账号

1. 注册一个新账号（通过应用注册页面）
2. 进入 Table Editor → `guide_profiles`
3. 找到该用户，将 `role` 字段设置为 `'admin'`

### 2. 准备 GitHub 仓库

#### 2.1 推送代码到 GitHub

```bash
cd guide-admin
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. 部署到 Vercel

#### 3.1 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 选择 GitHub 仓库
4. 点击 "Import"

#### 3.2 配置项目设置

**Framework Preset**: Next.js（自动检测）

**Root Directory**: `guide-admin`（如果项目在子目录中）

**Build Command**: `npm run build`（默认）

**Output Directory**: `.next`（默认）

#### 3.3 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**或者**，如果使用 Vercel 的 Supabase 集成：

```
VERCEL_SUPABASE_URL=your_supabase_project_url
VERCEL_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**获取环境变量**:
- 进入 Supabase Dashboard → Settings → API
- 复制 "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
- 复制 "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 3.4 部署

1. 点击 "Deploy"
2. 等待部署完成（通常 1-2 分钟）
3. 访问部署的 URL

### 4. 验证部署

#### 4.1 检查部署状态

- 访问 Vercel Dashboard 查看部署日志
- 确保构建成功，没有错误

#### 4.2 测试功能

1. **注册功能**: 访问 `/register`，注册一个新账号
2. **登录功能**: 访问 `/login`，使用注册的账号登录
3. **权限验证**: 确认不同角色重定向到正确页面
4. **数据操作**: 测试创建需求、创建投诉等功能

## 🔧 常见问题

### 问题 1: 构建失败

**可能原因**:
- TypeScript 类型错误
- 环境变量未配置
- 依赖安装失败

**解决方案**:
1. 检查 Vercel 构建日志
2. 确保所有环境变量已配置
3. 运行 `npm run build` 本地测试

### 问题 2: 运行时错误（500）

**可能原因**:
- Supabase 连接失败
- RLS 策略未正确配置
- 环境变量错误

**解决方案**:
1. 检查 Supabase Dashboard 中的 RLS 策略
2. 验证环境变量是否正确
3. 查看 Vercel 函数日志

### 问题 3: 登录后无法访问

**可能原因**:
- 用户不在 `guide_profiles` 表中
- RLS 策略阻止访问

**解决方案**:
1. 检查 `guide_profiles` 表是否有用户记录
2. 验证 RLS 策略是否正确
3. 检查用户角色设置

## 📝 环境变量说明

### 必需的环境变量

| 变量名 | 说明 | 获取位置 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Supabase Dashboard → Settings → API |

### Vercel 集成（可选）

如果使用 Vercel 的 Supabase 集成，可以使用：

| 变量名 | 说明 |
|--------|------|
| `VERCEL_SUPABASE_URL` | Supabase 项目 URL |
| `VERCEL_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |

代码会自动检测并使用这些变量（见 `src/lib/supabase/config.ts`）。

## 🔄 更新部署

### 自动部署

每次推送到 GitHub 的 `main` 分支，Vercel 会自动重新部署。

### 手动部署

1. 在 Vercel Dashboard 中点击 "Redeploy"
2. 选择要重新部署的版本

## 📊 监控和日志

### Vercel 日志

- 访问 Vercel Dashboard → 项目 → Logs
- 查看实时日志和错误信息

### Supabase 日志

- 访问 Supabase Dashboard → Logs
- 查看数据库查询和错误

## 🔒 安全建议

1. **不要提交敏感信息**: 确保 `.env.local` 在 `.gitignore` 中
2. **使用环境变量**: 所有敏感配置使用环境变量
3. **定期更新依赖**: 运行 `npm audit` 检查安全漏洞
4. **配置 RLS 策略**: 确保数据库 RLS 策略正确配置

## 📚 相关资源

- [Vercel 部署文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

**最后更新**: 2026-02-03
