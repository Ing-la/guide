# 下一步操作指南

## ✅ 已完成

- [x] 数据库表已创建（6 个带 `guide_` 前缀的表）
- [x] Storage bucket `guide` 已创建
- [x] 代码已推送到 GitHub
- [x] Vercel 已配置 Supabase 集成

---

## 🔐 下一步：配置 Storage RLS 策略

### 1. 在 Supabase Dashboard 中运行 Storage 策略

1. 打开 Supabase Dashboard → **SQL Editor**
2. 打开项目中的 `supabase/storage-policies.sql` 文件
3. 复制全部内容
4. 粘贴到 SQL Editor
5. 点击 **"Run"** 执行

**这会创建：**
- ✅ 管理员可以上传/查看/更新/删除所有文件
- ✅ 用户可以管理自己的文件（按用户 ID 文件夹隔离）

---

## 👤 创建管理员账号

### 方法一：在 Supabase Dashboard 中创建（推荐）

1. 进入 **Authentication** → **Users**
2. 点击 **"Add User"** → **"Create New User"**
3. 填写：
   - **Email**: `admin@guide.com`（或你的邮箱）
   - **Password**: 设置一个强密码
   - **Auto Confirm User**: ✅ 勾选（自动确认，无需邮箱验证）
4. 点击 **"Create User"**

5. **设置管理员角色：**
   - 进入 **Table Editor** → `guide_profiles` 表
   - 找到刚创建的用户（如果没有自动创建，手动创建一条记录）
   - 将 `role` 字段设置为 `admin`
   - 保存

### 方法二：通过注册页面创建

1. 访问部署后的网站：`https://guide-virid-seven.vercel.app/register`
2. 注册一个新账号
3. 在 Supabase Dashboard → **Table Editor** → `guide_profiles` 表中：
   - 找到刚注册的用户
   - 将 `role` 字段从 `user` 改为 `admin`
4. 重新登录，即可访问管理后台

---

## 🧪 测试部署

### 1. 检查网站是否正常

访问以下页面：

- ✅ `https://guide-virid-seven.vercel.app/` - 应重定向到登录页
- ✅ `https://guide-virid-seven.vercel.app/login` - 登录页面应正常显示
- ✅ `https://guide-virid-seven.vercel.app/register` - 注册页面应正常显示

### 2. 测试登录

1. 使用管理员账号登录
2. 应该能成功进入 `/dashboard`
3. 检查各个模块是否可以正常访问：
   - 仪表盘
   - 用户管理
   - 导游管理
   - 需求管理
   - 订单管理
   - 投诉查看

### 3. 测试功能

- ✅ 查看数据列表
- ✅ 搜索功能
- ✅ 查看详情
- ✅ 编辑数据
- ✅ 删除数据（谨慎测试）

---

## 📋 验证清单

### 数据库配置
- [x] 6 个表已创建（`guide_*`）
- [x] RLS 策略已配置
- [x] 触发器已创建
- [ ] Storage RLS 策略已配置
- [ ] 管理员账号已创建

### 部署状态
- [x] 代码已推送到 GitHub
- [x] Vercel 已部署
- [ ] 网站可以正常访问
- [ ] 登录功能正常
- [ ] 管理后台可以访问

### 功能测试
- [ ] 仪表盘数据可以加载
- [ ] 用户管理功能正常
- [ ] 导游管理功能正常
- [ ] 需求管理功能正常
- [ ] 订单管理功能正常
- [ ] 投诉查看功能正常

---

## 🎯 如果遇到问题

### 问题 1: 仍然出现 500 错误

**检查：**
1. Vercel 部署日志（Deployments → 查看日志）
2. 确认环境变量已正确配置
3. 确认数据库表已创建

### 问题 2: 无法登录

**检查：**
1. 确认用户已在 `guide_profiles` 表中
2. 确认用户的 `role` 是否为 `admin`
3. 检查浏览器控制台是否有错误

### 问题 3: 无法访问管理后台

**检查：**
1. 确认 RLS 策略已正确配置
2. 确认用户角色为 `admin`
3. 检查 Supabase Dashboard → Authentication → Policies

---

## 🎉 完成！

完成以上步骤后，你的管理后台就可以正常使用了！

**项目地址：** `https://guide-virid-seven.vercel.app`

**管理员登录：** 使用创建的管理员账号登录即可访问所有功能。
