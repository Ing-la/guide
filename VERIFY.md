# 配置验证指南

## 🔍 如何验证配置是否成功

### 方法一：运行验证 SQL（推荐）

1. 打开 Supabase Dashboard → **SQL Editor**
2. 打开项目中的 `supabase/verify-setup.sql` 文件
3. 复制全部内容
4. 粘贴到 SQL Editor
5. 点击 **"Run"** 执行

**查看结果：**
- ✅ `✓` 表示配置正确
- ❌ `✗` 表示需要修复

---

### 方法二：手动检查

#### 1. 检查数据库表

在 Supabase Dashboard → **Table Editor** 中确认以下表存在：

- [ ] `guide_profiles`
- [ ] `guide_guides`
- [ ] `guide_demands`
- [ ] `guide_orders`
- [ ] `guide_complaints`
- [ ] `guide_titles`

**检查方法：**
- 左侧表列表中应该能看到这 6 个表
- 每个表都应该有数据列

---

#### 2. 检查 RLS 策略

在 Supabase Dashboard → **Authentication** → **Policies** 中：

**对于每个 `guide_*` 表，应该有以下策略：**

**guide_profiles 表：**
- [ ] "Guide admins can view all profiles"
- [ ] "Guide admins can update all profiles"
- [ ] "Guide admins can delete all profiles"
- [ ] "Guide users can view own profile"
- [ ] "Guide users can update own profile"

**guide_guides 表：**
- [ ] "Guide admins can manage guides"

**guide_demands 表：**
- [ ] "Guide admins can manage demands"

**guide_orders 表：**
- [ ] "Guide admins can manage orders"

**guide_complaints 表：**
- [ ] "Guide admins can manage complaints"

**guide_titles 表：**
- [ ] "Guide admins can manage guide_titles"

---

#### 3. 检查 Storage 策略

在 Supabase Dashboard → **Storage** → **Policies** 中：

**对于 `guide` bucket，应该有以下策略：**

- [ ] "Guide admins can upload files"
- [ ] "Guide admins can view files"
- [ ] "Guide admins can update files"
- [ ] "Guide admins can delete files"
- [ ] "Users can view own files"
- [ ] "Users can upload own files"
- [ ] "Users can update own files"
- [ ] "Users can delete own files"

**检查方法：**
1. 进入 Storage → Policies
2. 选择 `guide` bucket
3. 查看策略列表

---

#### 4. 检查管理员账号

在 Supabase Dashboard → **Table Editor** → `guide_profiles` 表中：

- [ ] 至少有一个用户的 `role` 字段为 `admin`
- [ ] 该用户有对应的 `id`（UUID 格式）

**检查方法：**
1. 打开 `guide_profiles` 表
2. 查看 `role` 列
3. 确认至少有一行的 `role` 值为 `admin`

---

#### 5. 检查触发器

在 Supabase Dashboard → **Database** → **Triggers** 中：

应该能看到以下触发器：

- [ ] `update_guide_profiles_updated_at`
- [ ] `update_guide_guides_updated_at`
- [ ] `update_guide_demands_updated_at`
- [ ] `update_guide_orders_updated_at`
- [ ] `update_guide_titles_updated_at`
- [ ] `on_auth_user_created_guide`

---

## ✅ 完整验证清单

### 数据库配置
- [ ] 6 个表已创建（`guide_*` 前缀）
- [ ] 11 个索引已创建
- [ ] 6 个触发器已创建
- [ ] 11 个 RLS 策略已创建

### Storage 配置
- [ ] `guide` bucket 已创建
- [ ] 8 个 Storage RLS 策略已创建

### 用户配置
- [ ] 至少一个管理员账号已创建
- [ ] 管理员账号的 `role` 为 `admin`

---

## 🧪 功能测试

完成配置后，测试以下功能：

### 1. 网站访问测试

访问：`https://guide-virid-seven.vercel.app/login`

- [ ] 页面可以正常加载
- [ ] 没有 500 错误
- [ ] 登录表单正常显示

### 2. 登录测试

使用管理员账号登录：

- [ ] 可以成功登录
- [ ] 登录后重定向到 `/dashboard`
- [ ] 没有权限错误

### 3. 管理后台测试

登录后检查：

- [ ] 仪表盘可以访问
- [ ] 用户管理可以访问
- [ ] 导游管理可以访问
- [ ] 需求管理可以访问
- [ ] 订单管理可以访问
- [ ] 投诉查看可以访问

### 4. 数据操作测试

- [ ] 可以查看数据列表
- [ ] 可以搜索数据
- [ ] 可以查看详情
- [ ] 可以编辑数据
- [ ] 可以删除数据（谨慎测试）

---

## 🐛 常见问题排查

### 问题 1: 验证 SQL 显示某些配置缺失

**解决：**
1. 检查是否运行了完整的 `schema.sql`
2. 检查是否运行了 `storage-policies.sql`
3. 重新运行缺失的 SQL 脚本

### 问题 2: 管理员账号无法登录

**检查：**
1. 确认用户在 `guide_profiles` 表中
2. 确认 `role` 字段为 `admin`
3. 检查密码是否正确
4. 检查 Supabase Auth 中用户是否已确认

### 问题 3: 可以登录但无法访问管理后台

**检查：**
1. 确认 RLS 策略已正确配置
2. 确认策略名称包含 "Guide admins"
3. 检查浏览器控制台是否有错误

### 问题 4: Storage 无法上传文件

**检查：**
1. 确认 Storage 策略已创建
2. 确认策略针对 `guide` bucket
3. 确认用户角色为 `admin`

---

## 📊 快速验证命令

如果你想快速检查，可以在 SQL Editor 中运行以下单个查询：

### 检查表数量
```sql
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'guide_%';
```
**预期结果：** 应该返回 `6`

### 检查管理员数量
```sql
SELECT COUNT(*) as admin_count 
FROM public.guide_profiles 
WHERE role = 'admin';
```
**预期结果：** 应该返回至少 `1`

### 检查 Storage 策略数量
```sql
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND policyname LIKE '%guide%';
```
**预期结果：** 应该返回 `8`

---

运行验证 SQL 后，告诉我结果，我可以帮你分析是否有遗漏的配置！
