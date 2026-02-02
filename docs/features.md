# 功能详细说明文档

本文档详细介绍导游管理后台系统的所有已实现功能。

## 📋 目录

- [认证系统](#认证系统)
- [管理员功能](#管理员功能)
- [用户功能](#用户功能)
- [导游功能](#导游功能)
- [数据库结构](#数据库结构)
- [权限控制](#权限控制)

---

## 🔐 认证系统

### 注册功能

**路径**: `/register`

**功能**:
- 邮箱注册
- 密码设置（最少 6 位）
- 手机号（可选）
- 昵称（可选）
- **角色选择**：用户或导游（管理员角色需由现有管理员设置）

**流程**:
1. 用户填写注册表单
2. 系统创建 `auth.users` 记录
3. 触发器自动创建 `guide_profiles` 记录
4. 根据选择的角色重定向到对应页面

**技术实现**:
- 使用 Supabase Auth 进行用户注册
- 数据库触发器自动创建用户资料
- Server Action 处理注册逻辑

### 登录功能

**路径**: `/login`

**功能**:
- 邮箱密码登录
- 错误提示显示
- 自动根据角色重定向

**重定向逻辑**:
- 管理员 → `/dashboard`（仪表盘）
- 导游 → `/dashboard/guide`（导游中心）
- 用户 → `/dashboard/user`（用户中心）

---

## 👨‍💼 管理员功能

管理员可以访问所有功能，拥有完整的系统管理权限。

### 仪表盘 (`/dashboard`)

**功能**:
- 显示系统统计数据
  - 用户总数
  - 导游总数
  - 需求总数
  - 订单总数
- 卡片式展示，支持响应式布局

### 用户管理 (`/dashboard/users`)

**功能**:
- ✅ 用户列表查看
- ✅ 用户搜索（按昵称、邮箱、手机号）
- ✅ 用户信息展示
  - 昵称
  - 邮箱
  - 手机号
  - 角色（用户/导游/管理员）
  - 创建时间

**注意**: 已移除查看/编辑功能，仅支持列表查看。

### 导游管理 (`/dashboard/guides`)

**功能**:
- ✅ 导游列表查看
- ✅ 导游搜索（按姓名、手机号、头衔）
- ✅ 导游信息编辑
  - 姓名
  - 手机号
  - 头衔
  - 状态（活跃/非活跃）
- ✅ 导游删除
- ✅ 导游详情查看

### 需求管理 (`/dashboard/demands`)

**功能**:
- ✅ 需求列表查看（所有用户的需求）
- ✅ 需求搜索（按城市、描述）
- ✅ 需求状态筛选（待匹配/已匹配/已完成/已取消）
- ✅ 需求信息展示
  - 城市
  - 景点
  - 预算
  - 状态
  - 创建时间

**注意**: 已移除查看/编辑功能，仅支持列表查看。

### 订单管理 (`/dashboard/orders`)

**功能**:
- ✅ 订单列表查看
- ✅ 订单搜索
- ✅ 订单状态筛选
- ✅ 订单信息编辑
  - 状态（待支付/已支付/已完成/已取消）
  - 金额
- ✅ 订单删除
- ✅ 订单详情查看

### 投诉查看 (`/dashboard/complaints`)

**功能**:
- ✅ 查看所有投诉
- ✅ 投诉信息展示
  - 类型（订单投诉/聊天投诉）
  - 内容
  - 状态（待处理/已处理）
  - 创建时间

---

## 👤 用户功能

用户角色可以创建和管理自己的需求和投诉。

### 用户中心 (`/dashboard/user`)

**功能**:
- 显示用户中心欢迎页面
- 导航到需求管理和投诉管理

### 需求管理 (`/dashboard/user/demands`)

**功能**:
- ✅ **创建需求**
  - 城市（必填）
  - 景点（可选，多个用逗号分隔）
  - 预算（可选，数字）
  - 计划时间（可选，日期时间选择器）
  - 描述（可选，文本域）
- ✅ **查看自己的需求列表**
  - 显示所有自己创建的需求
  - 显示需求状态（待匹配/已匹配/已完成/已取消）
  - 显示创建时间

**数据验证**:
- 城市为必填项
- 预算必须是正数
- 计划时间不能早于今天

### 投诉管理 (`/dashboard/user/complaints`)

**功能**:
- ✅ **创建投诉**
  - 选择导游（下拉选择，显示所有活跃导游）
  - 投诉内容（必填，至少 10 个字符）
- ✅ **查看自己的投诉列表**
  - 显示所有自己创建的投诉
  - 显示被投诉的导游名称
  - 显示投诉状态（待处理/已处理）
  - 显示创建时间

---

## 🧳 导游功能

导游角色可以浏览需求和查看投诉。

### 导游中心 (`/dashboard/guide`)

**功能**:
- 显示导游中心欢迎页面
- 导航到需求浏览和投诉查看

### 需求浏览 (`/dashboard/guide/demands`)

**功能**:
- ✅ **浏览所有需求**（只读）
  - 显示所有用户发布的需求
  - 显示发布者昵称
  - 显示需求详情（城市、景点、预算、计划时间、描述）
  - 显示创建时间

**注意**: 导游只能查看，不能创建或修改需求。

### 投诉查看 (`/dashboard/guide/complaints`)

**功能**:
- ✅ **查看投诉自己的投诉**（只读）
  - 显示所有针对该导游的投诉
  - 显示投诉用户昵称
  - 显示投诉内容
  - 显示投诉状态（待处理/已处理）
  - 显示创建时间

**注意**: 导游只能查看投诉自己的投诉，不能查看其他导游的投诉。

---

## 🗄️ 数据库结构

### 表结构

#### `guide_profiles` - 用户资料表
- `id` (UUID, PK) - 用户 ID，关联 `auth.users`
- `email` (TEXT) - 邮箱
- `phone` (TEXT) - 手机号
- `nickname` (TEXT) - 昵称
- `avatar_url` (TEXT) - 头像 URL
- `role` (TEXT) - 角色：'admin' | 'user' | 'guide'
- `created_at` (TIMESTAMP) - 创建时间
- `updated_at` (TIMESTAMP) - 更新时间

#### `guide_guides` - 导游详细信息表
- `id` (UUID, PK) - 导游 ID
- `user_id` (UUID, FK) - 关联 `guide_profiles.id`
- `name` (TEXT) - 导游姓名
- `phone` (TEXT) - 手机号
- `avatar_url` (TEXT) - 头像 URL
- `title` (TEXT) - 头衔
- `rating` (NUMERIC) - 评分
- `status` (TEXT) - 状态：'active' | 'inactive'
- `created_at` (TIMESTAMP) - 创建时间
- `updated_at` (TIMESTAMP) - 更新时间

#### `guide_demands` - 需求表
- `id` (UUID, PK) - 需求 ID
- `user_id` (UUID, FK) - 发布者，关联 `guide_profiles.id`
- `city` (TEXT) - 城市
- `attractions` (TEXT[]) - 景点数组
- `budget` (NUMERIC) - 预算
- `plan_time` (TIMESTAMP) - 计划时间
- `description` (TEXT) - 描述
- `status` (TEXT) - 状态：'pending' | 'matched' | 'completed' | 'cancelled'
- `created_at` (TIMESTAMP) - 创建时间
- `updated_at` (TIMESTAMP) - 更新时间

#### `guide_orders` - 订单表
- `id` (UUID, PK) - 订单 ID
- `demand_id` (UUID, FK) - 关联需求
- `user_id` (UUID, FK) - 客户
- `guide_id` (UUID, FK) - 导游
- `status` (TEXT) - 状态：'pending' | 'paid' | 'completed' | 'cancelled'
- `amount` (NUMERIC) - 金额
- `created_at` (TIMESTAMP) - 创建时间
- `updated_at` (TIMESTAMP) - 更新时间

#### `guide_complaints` - 投诉表
- `id` (UUID, PK) - 投诉 ID
- `user_id` (UUID, FK) - 投诉用户，关联 `guide_profiles.id`
- `guide_id` (UUID, FK) - 被投诉的导游，关联 `guide_profiles.id`
- `order_id` (UUID, FK) - 关联订单（可选）
- `type` (TEXT) - 类型：'order' | 'chat'（可选）
- `content` (TEXT) - 投诉内容
- `status` (TEXT) - 状态：'pending' | 'resolved'
- `created_at` (TIMESTAMP) - 创建时间

#### `guide_titles` - 导游头衔表
- `id` (UUID, PK) - 头衔 ID
- `name` (TEXT) - 头衔名称
- `level` (INTEGER) - 等级
- `requirements` (TEXT) - 晋级要求
- `created_at` (TIMESTAMP) - 创建时间
- `updated_at` (TIMESTAMP) - 更新时间

### 数据隔离

所有应用相关的表都使用 `guide_` 前缀，确保：
- 数据隔离（与其他项目共享 Supabase 实例时）
- 清晰的命名空间
- 便于管理和维护

---

## 🔒 权限控制

### Row Level Security (RLS) 策略

系统使用 Supabase 的 RLS 功能实现细粒度的权限控制。

#### 需求表 (`guide_demands`)

**用户权限**:
- ✅ 可以创建需求（`auth.uid() = user_id`）
- ✅ 可以查看自己的需求（`auth.uid() = user_id`）

**导游权限**:
- ✅ 可以查看所有需求（`role = 'guide'`）

**管理员权限**:
- ✅ 可以管理所有需求（`role = 'admin'`）

#### 投诉表 (`guide_complaints`)

**用户权限**:
- ✅ 可以创建投诉（`auth.uid() = user_id`）
- ✅ 可以查看自己的投诉（`auth.uid() = user_id`）

**导游权限**:
- ✅ 可以查看投诉自己的投诉（`guide_id = auth.uid()`）

**管理员权限**:
- ✅ 可以查看所有投诉（`role = 'admin'`）

#### 用户资料表 (`guide_profiles`)

**用户权限**:
- ✅ 可以查看自己的资料（`auth.uid() = id`）
- ✅ 可以更新自己的资料（`auth.uid() = id`）
- ✅ 可以查看所有导游的资料（用于投诉表单选择）

**管理员权限**:
- ✅ 可以管理所有用户资料（`role = 'admin'`）

---

## 🛠️ 技术实现细节

### Server Actions

所有数据操作通过 Next.js Server Actions 实现：

- `src/lib/auth/actions.ts` - 认证相关（注册、登录、登出）
- `src/lib/actions/users.ts` - 用户管理
- `src/lib/actions/guides.ts` - 导游管理
- `src/lib/actions/demands.ts` - 需求管理
- `src/lib/actions/orders.ts` - 订单管理
- `src/lib/actions/complaints.ts` - 投诉管理

### 路由保护

使用 Next.js Middleware (`src/middleware.ts`) 实现：
- 未登录用户重定向到登录页
- 已登录用户访问登录/注册页时重定向到对应角色页面

### 数据获取

- 使用 Server Components 直接获取数据
- 使用 `Suspense` 实现加载状态
- 错误处理通过 try-catch 和错误页面实现

---

## 📝 使用说明

### 创建管理员账号

1. 注册一个新账号（选择"用户"角色）
2. 登录 Supabase Dashboard
3. 进入 Table Editor → `guide_profiles`
4. 找到该用户记录，将 `role` 字段修改为 `'admin'`
5. 重新登录即可访问管理后台

### 创建导游账号

1. 注册时选择"导游"角色
2. 系统自动创建 `guide_profiles` 记录（role='guide'）
3. 登录后进入导游中心

### 创建需求

1. 以用户身份登录
2. 进入"需求管理"
3. 填写需求表单（城市为必填）
4. 提交后需求会出现在列表中

### 创建投诉

1. 以用户身份登录
2. 进入"投诉管理"
3. 选择要投诉的导游
4. 填写投诉内容（至少 10 个字符）
5. 提交后投诉会出现在列表中

---

## 🔧 故障排除

### 需求创建失败

**错误**: `new row violates row-level security policy`

**解决方案**:
1. 确保在 Supabase Dashboard 中运行了 `supabase/schema.sql`
2. 检查 RLS 策略是否正确创建
3. 确保用户存在于 `guide_profiles` 表中

### 投诉表单中看不到导游

**解决方案**:
1. 确保有用户注册时选择了"导游"角色
2. 运行 `supabase/schema.sql` 中的 RLS 策略
3. 检查 `guide_profiles` 表中是否有 `role='guide'` 的记录

### 登录后重定向错误

**解决方案**:
1. 检查 `guide_profiles` 表中的 `role` 字段是否正确设置
2. 确保用户记录存在
3. 清除浏览器缓存后重试

---

## 📚 相关文档

- [数据库 Schema](./../supabase/schema.sql)
- [设计文档](./../docs/plans/2026-02-03-user-guide-features-design.md)
- [Supabase 官方文档](https://supabase.com/docs)
- [Next.js 官方文档](https://nextjs.org/docs)

---

## 🎯 未来计划

### 计划实现的功能

- [ ] 需求状态变更（用户确认导游接单）
- [ ] 订单功能（需求匹配后生成订单）
- [ ] 投诉回复功能
- [ ] 需求详情页面
- [ ] 投诉详情页面
- [ ] 数据导出功能
- [ ] 更丰富的统计图表

### 优化计划

- [ ] 添加图片上传功能
- [ ] 优化移动端体验
- [ ] 添加数据验证和错误提示
- [ ] 性能优化（缓存、分页等）

---

**最后更新**: 2026-02-03
