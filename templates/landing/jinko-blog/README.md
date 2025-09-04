# 🎭 Jinko Blog Template

一个现代化的个人博客模板，基于 [Jinko主题演示](https://www.3forty.media/jinko/demo/) 设计，采用 React 19 + TypeScript + TailwindCSS 技术栈构建。

## ✨ 特性

### 🎨 设计特点
- **个性化品牌** - 重复logo设计 + 幽默标语
- **内容驱动** - 博客文章卡片式布局
- **社区互动** - 社交媒体链接 + Patron支持
- **数据展示** - 浏览量、评论数、阅读时间
- **分类系统** - Lifestyle、Beauty、Travel等

### 📱 核心功能
- ✅ **响应式设计** - 完美适配移动端和桌面端
- ✅ **博客文章展示** - 特色文章 + 常规文章网格布局
- ✅ **侧边栏内容** - 热门文章、编辑推荐、精选内容
- ✅ **搜索功能** - 文章和分类搜索
- ✅ **分页导航** - 优雅的文章分页
- ✅ **社交分享** - 多平台分享支持
- ✅ **个人展示** - 个人简介和统计数据

### 🛠️ 技术栈
- **Framework**: React 19 + TypeScript
- **样式**: TailwindCSS v4
- **图标**: Lucide React
- **构建**: Vite
- **字体**: Inter + Playfair Display

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run dev
```
访问 http://localhost:5173 查看效果

### 生产构建
```bash
npm run build
```

### 预览构建
```bash
npm run preview
```

## 📁 项目结构

```
jinko-blog/
├── src/
│   ├── components/          # 组件目录
│   │   ├── Header.tsx      # 顶部导航和搜索
│   │   ├── Hero.tsx        # 个人介绍区域
│   │   ├── PostCard.tsx    # 博客文章卡片
│   │   ├── Sidebar.tsx     # 侧边栏内容
│   │   ├── Pagination.tsx  # 分页导航
│   │   └── Footer.tsx      # 页脚
│   ├── data/
│   │   └── mockData.ts     # 模拟数据
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 样式文件
├── public/                 # 静态资源
├── package.json           # 项目配置
└── README.md              # 项目文档
```

## 🎨 主要组件

### Header 导航栏
- 响应式导航菜单
- 搜索功能
- 社交媒体链接
- "Become a Patron" 按钮

### Hero 个人展示
- 个人简介和头像
- 社交媒体链接
- 博客统计数据
- 幽默标语展示

### PostCard 文章卡片
- 特色图片展示
- 作者信息
- 文章元数据（时间、阅读量、评论）
- 分类标签
- 社交分享按钮

### Sidebar 侧边栏
- 热门文章 (Trending)
- 最多浏览 (Most viewed)  
- 编辑推荐 (Editors Picks)
- 精选文章 (Featured articles)
- 邮件订阅表单

## 🎭 个性化定制

### 修改个人信息
编辑 `src/data/mockData.ts` 文件：
- 作者信息
- 博客文章数据
- 社交媒体链接
- 分类设置

### 自定义样式
编辑 `tailwind.config.js` 和 `src/index.css`：
- 主题颜色
- 字体配置
- 动画效果
- 自定义组件样式

### 更换内容
- 替换 `public/` 目录中的图片
- 修改幽默标语和个人简介
- 调整博客分类和标签

## 📊 数据结构

### 文章数据 (Post)
```typescript
interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  views: number;
  comments: number;
  category: string;
  image: string;
  tags: string[];
}
```

### 作者信息 (Author)
```typescript
interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
}
```

## 🌈 设计亮点

### 视觉设计
- **渐变品牌色** - 粉红到橙色的温暖渐变
- **卡片式布局** - 现代化的内容展示
- **微交互** - 悬停效果和平滑过渡
- **优雅字体** - Inter + Playfair Display 组合

### 用户体验
- **首屏优化** - 重要内容优先展示
- **加载反馈** - 优雅的状态提示
- **导航体验** - 清晰的信息架构
- **社交互动** - 便捷的分享功能

## 📱 响应式支持

- **移动端**: 320px - 767px
- **平板**: 768px - 1023px  
- **桌面端**: 1024px+

## 🔧 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 📄 许可证

MIT License - 可自由使用和修改

## 🙏 致谢

设计灵感来源于 [3forty.media](https://www.3forty.media/jinko/demo/) 的 Jinko 主题

---

🎊 **现在就开始打造你的个人博客吧！**