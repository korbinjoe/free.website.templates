# Meta.json 自动生成文档

## 📋 概述

本文档说明如何使用自动化脚本为新的页面模板生成标准的 `meta.json` 文件，确保所有模板的元数据格式一致，并使用实际的创建日期。

## 🚀 快速使用

### 基础用法
```bash
node scripts/generate-meta-template.js <template-name>
```

### 示例
```bash
node scripts/generate-meta-template.js my-awesome-landing
```

这将在 `metadata/my-awesome-landing/meta.json` 创建一个完整的元数据文件。

## 📊 生成的Meta.json结构

```json
{
  "name": "Template Name",
  "description": "模板描述",
  "category": "分类",
  "tags": ["标签数组"],
  "author": "Vontext Templates",
  "version": "1.0.0",
  "created": "2025-09-04",      // 自动使用当前日期
  "updated": "2025-09-04",      // 自动使用当前日期
  "demo_url": "演示地址",
  "source_url": "源码地址", 
  "download_url": "下载地址",
  "preview_image": "screenshot.png",
  "tech_stack": {
    "frontend": "React 19",
    "styling": "TailwindCSS v4",
    "typescript": true,
    "build_tool": "Vite",
    "icons": "Lucide React"
  },
  "features": ["功能列表"],
  "design_inspiration": {
    "source": "设计来源",
    "url": "参考链接", 
    "style": "设计风格"
  },
  "colors": {
    "primary": "主色",
    "secondary": "辅色",
    "accent": "强调色",
    "neutral": "中性色"
  },
  "sections": [
    {
      "name": "Header",
      "description": "组件描述"
    }
  ],
  "customization": {
    "colors": "色彩定制说明",
    "fonts": "字体方案",
    "content": "内容定制", 
    "layout": "布局系统"
  }
}
```

## ⚙️ 自定义配置

可以通过配置对象自定义生成的元数据：

```javascript
const { createMetaFile } = require('./scripts/generate-meta-template.js');

const config = {
  name: "自定义模板名称",
  description: "详细描述",
  category: "SaaS",
  tags: ["saas", "dashboard", "analytics"],
  features: [
    "高级分析",
    "实时数据",
    "响应式设计"
  ],
  design_inspiration: {
    "source": "Dribbble Design",
    "url": "https://dribbble.com/example",
    "style": "Modern Dashboard"
  },
  colors: {
    "primary": "Blue",
    "secondary": "Green", 
    "accent": "Orange",
    "neutral": "Gray"
  }
};

createMetaFile('template-name', 'output/path/meta.json', config);
```

## 🎯 新模板创建流程

1. **创建模板项目**
   ```bash
   cd templates/landing
   npm create vite@latest my-template -- --template react-ts --yes
   ```

2. **生成Meta.json**
   ```bash
   node scripts/generate-meta-template.js my-template
   ```

3. **编辑Meta.json内容** (可选)
   根据实际模板特点修改生成的 `metadata/my-template/meta.json`

4. **添加截图**
   ```bash
   # 生成截图后放置到
   metadata/my-template/screenshot.png
   ```

## 📅 日期管理逻辑

### 自动日期生成
- **created**: 始终使用脚本运行时的当前日期 (YYYY-MM-DD格式)
- **updated**: 初始与created相同，后续手动更新

### 日期格式标准
- ✅ **推荐格式**: `2025-09-04` (YYYY-MM-DD)
- ❌ **避免格式**: `2024-12-19T12:00:00Z` (ISO 8601，过于复杂)

### 更新现有模板日期
```javascript
// 一次性更新所有模板到实际创建日期
const updates = {
  'pirsch': '2025-08-25',
  'buymeacoffee': '2025-09-02', 
  'superwhisper': '2025-09-02',
  'localise': '2025-09-02',
  'figma-plugins': '2025-09-03',
  'jinko-blog': '2025-09-04'
};
```

## 🔧 脚本功能特性

### ✅ 已实现功能
- 自动使用当前日期
- 标准化的JSON结构  
- 目录自动创建
- 配置项自定义
- 错误处理和验证
- 文件大小统计

### 🎯 使用场景
- 新模板创建
- 批量元数据生成
- 标准化现有模板
- CI/CD自动化流程

## 📈 最佳实践

### 命名规范
- 模板名称: `kebab-case` (如: `my-awesome-template`)
- 文件路径: `metadata/<template-name>/meta.json`
- 截图文件: `metadata/<template-name>/screenshot.png`

### 必填字段
- `name`: 用户友好的模板名称
- `description`: 详细的功能描述 
- `tags`: 便于搜索的标签
- `features`: 核心功能特性列表

### 可选但推荐
- `design_inspiration`: 设计参考来源
- `sections`: 模板组件结构说明
- `customization`: 定制化选项说明

## 🚀 未来扩展

- 自动从package.json读取技术栈
- 集成截图自动生成
- 支持多语言元数据
- 模板依赖关系管理

---

✨ **通过使用这个自动化脚本，确保所有新模板都有准确的创建日期和标准化的元数据结构！**
