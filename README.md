# 导游管理后台

基于 Next.js 14 + Supabase + Vercel 构建的网页端管理后台系统。

## 功能特性

- ✅ 用户认证（注册/登录）
- ✅ 用户管理（查看/编辑/删除/搜索）
- ✅ 导游管理（查看/编辑/删除/搜索）
- ✅ 需求管理（查看/编辑/删除/搜索/状态管理）
- ✅ 订单管理（查看/编辑/删除/搜索/状态管理）
- ✅ 投诉查看（订单投诉/聊天投诉）
- ✅ 仪表盘统计

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **后端**: Next.js Server Actions + Supabase
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 设置 Supabase 数据库

在 Supabase Dashboard 的 SQL Editor 中运行 `supabase/schema.sql` 文件中的 SQL 脚本，创建所需的表和策略。

### 4. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
guide-admin/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── (auth)/            # 认证相关页面
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── dashboard/          # 管理后台页面
│   │       ├── users/         # 用户管理
│   │       ├── guides/        # 导游管理
│   │       ├── demands/       # 需求管理
│   │       ├── orders/        # 订单管理
│   │       └── complaints/    # 投诉查看
│   ├── lib/
│   │   ├── supabase/          # Supabase 客户端配置
│   │   ├── actions/           # Server Actions
│   │   └── auth/              # 认证相关
│   └── types/                 # TypeScript 类型定义
├── supabase/
│   └── schema.sql             # 数据库 Schema
└── public/                    # 静态资源
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（从 Supabase Dashboard 复制）
4. 部署完成！

## 注意事项

- 确保 Supabase 项目的 RLS 策略已正确配置
- 首次注册的用户默认角色为 'user'，需要在数据库中手动设置为 'admin' 才能访问管理后台
- 头像上传功能暂未实现，可在后续版本中添加

## 许可证

MIT
