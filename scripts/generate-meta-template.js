/**
 * Meta.json模板生成工具
 * 自动使用当前日期作为created和updated时间
 */

const fs = require('fs');
const path = require('path');

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateMetaTemplate(templateName, config = {}) {
  const currentDate = getCurrentDate();
  
  const defaultMeta = {
    name: config.name || `${templateName} Template`,
    description: config.description || `Modern ${templateName} template built with React 19 + TypeScript + TailwindCSS`,
    category: config.category || "Landing Page",
    tags: config.tags || ["react", "typescript", "tailwindcss", "vite", "landing-page"],
    author: "Vontext Templates",
    version: "1.0.0",
    created: currentDate,
    updated: currentDate,
    demo_url: config.demo_url || `https://vontext-${templateName}.vercel.app`,
    source_url: config.source_url || `https://github.com/vontext/templates/tree/main/templates/landing/${templateName}`,
    download_url: config.download_url || `https://github.com/vontext/templates/releases/download/v1.0.0/vontext-${templateName}.zip`,
    preview_image: "screenshot.png",
    tech_stack: {
      frontend: "React 19",
      styling: "TailwindCSS v4",
      typescript: true,
      build_tool: "Vite",
      icons: "Lucide React"
    },
    features: config.features || [
      "响应式设计",
      "现代化UI",
      "TypeScript支持",
      "组件化架构",
      "生产就绪"
    ],
    design_inspiration: config.design_inspiration || {
      source: "Custom Design",
      url: "#",
      style: "Modern & Clean"
    },
    colors: config.colors || {
      primary: "Blue",
      secondary: "Gray",
      accent: "Purple",
      neutral: "White"
    },
    sections: config.sections || [
      {
        name: "Header",
        description: "导航栏和品牌标识"
      },
      {
        name: "Hero",
        description: "主要标题和行动召唤"
      },
      {
        name: "Content",
        description: "主要内容区域"
      },
      {
        name: "Footer",
        description: "页脚信息和链接"
      }
    ],
    customization: config.customization || {
      colors: "支持主题色彩定制",
      fonts: "现代化字体方案",
      content: "完全可自定义内容",
      layout: "响应式布局系统"
    }
  };

  return defaultMeta;
}

function createMetaFile(templateName, outputPath, config = {}) {
  const meta = generateMetaTemplate(templateName, config);
  const metaJson = JSON.stringify(meta, null, 2);
  
  // 确保输出目录存在
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, metaJson, 'utf8');
  
  console.log(`✅ Meta.json created for ${templateName}`);
  console.log(`📅 Creation date: ${meta.created}`);
  console.log(`📍 Output path: ${outputPath}`);
  console.log(`📊 File size: ${(metaJson.length / 1024).toFixed(2)}KB`);
  
  return meta;
}

// 如果直接运行脚本
if (require.main === module) {
  const templateName = process.argv[2];
  if (!templateName) {
    console.error('❌ Error: Please provide a template name');
    console.log('💡 Usage: node generate-meta-template.js <template-name>');
    console.log('📝 Example: node generate-meta-template.js my-awesome-template');
    process.exit(1);
  }
  
  const outputPath = path.join(__dirname, '..', 'metadata', templateName, 'meta.json');
  
  try {
    createMetaFile(templateName, outputPath);
  } catch (error) {
    console.error('❌ Error creating meta.json:', error.message);
    process.exit(1);
  }
}

module.exports = {
  generateMetaTemplate,
  createMetaFile,
  getCurrentDate
};
