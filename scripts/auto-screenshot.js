#!/usr/bin/env node

/**
 * 自动化页面模板截图脚本
 * 功能：启动指定模板的开发服务器，使用Playwright获取完整页面长截图并保存到metadata目录
 * 技术栈：Playwright + Node.js
 */

const { chromium } = require('playwright');
const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');

// 配置
const CONFIG = {
  port: 5173,
  baseUrl: 'http://localhost:5173',
  screenshotWidth: 1200,
  screenshotHeight: 800,
  screenshotQuality: 90,
  waitTime: 3000, // 页面加载等待时间(毫秒)
  scrollDelay: 100, // 滚动间隔(毫秒)
  templates: {
    'buymeacoffee': 'templates/landing/buymeacoffee',
    'pirsch': 'templates/landing/pirsch', 
    'superwhisper': 'templates/landing/superwhisper'
  }
};

class TemplateScreenshot {
  constructor() {
    this.browser = null;
    this.devServer = null;
    this.projectRoot = path.resolve(__dirname, '..');
  }

  /**
   * 显示使用帮助
   */
  showHelp() {
    console.log(`
🎯 模板自动化截图工具 (Playwright版)
=======================================

用法: node scripts/auto-screenshot.js [template-name] [options]

参数:
  template-name    模板名称 (buymeacoffee, pirsch, superwhisper, all)

选项:
  --port           开发服务器端口 (默认: ${CONFIG.port})
  --width          截图宽度 (默认: ${CONFIG.screenshotWidth}px)
  --height         截图高度 (默认: ${CONFIG.screenshotHeight}px)
  --quality        截图质量 (默认: ${CONFIG.screenshotQuality})
  --wait           页面加载等待时间 (默认: ${CONFIG.waitTime}ms)
  --help           显示此帮助信息

示例:
  node scripts/auto-screenshot.js superwhisper
  node scripts/auto-screenshot.js all
  node scripts/auto-screenshot.js buymeacoffee --width 1400 --quality 95

支持的模板:
${Object.keys(CONFIG.templates).map(name => `  • ${name}`).join('\n')}
    `);
  }

  /**
   * 解析命令行参数
   */
  parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.length === 0) {
      this.showHelp();
      process.exit(0);
    }

    const templateName = args[0];
    const options = {};

    // 解析选项
    for (let i = 1; i < args.length; i += 2) {
      const flag = args[i];
      const value = args[i + 1];
      
      switch (flag) {
        case '--port':
          options.port = parseInt(value);
          break;
        case '--width':
          options.screenshotWidth = parseInt(value);
          break;
        case '--height':
          options.screenshotHeight = parseInt(value);
          break;
        case '--quality':
          options.screenshotQuality = parseInt(value);
          break;
        case '--wait':
          options.waitTime = parseInt(value);
          break;
      }
    }

    return { templateName, options };
  }

  /**
   * 启动开发服务器
   */
  async startDevServer(templatePath) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 启动开发服务器: ${templatePath}`);
      
      const fullPath = path.join(this.projectRoot, templatePath);
      
      // 检查路径是否存在
      fs.access(fullPath).catch(() => {
        reject(new Error(`模板路径不存在: ${fullPath}`));
        return;
      });

      this.devServer = spawn('npm', ['run', 'dev'], {
        cwd: fullPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PORT: CONFIG.port }
      });

      let output = '';
      
      this.devServer.stdout.on('data', (data) => {
        output += data.toString();
        console.log(`📋 ${data.toString().trim()}`);
        
        // 检测服务器是否已启动
        if (output.includes('Local:') || output.includes('localhost')) {
          setTimeout(resolve, 2000); // 等待服务器完全启动
        }
      });

      this.devServer.stderr.on('data', (data) => {
        console.log(`⚠️  ${data.toString().trim()}`);
      });

      this.devServer.on('error', (error) => {
        reject(new Error(`启动开发服务器失败: ${error.message}`));
      });

      // 超时处理
      setTimeout(() => {
        if (!output.includes('Local:') && !output.includes('localhost')) {
          reject(new Error('开发服务器启动超时'));
        }
      }, 30000);
    });
  }

  /**
   * 停止开发服务器
   */
  stopDevServer() {
    if (this.devServer) {
      console.log('🛑 关闭开发服务器');
      this.devServer.kill('SIGTERM');
      
      // 强制终止（备用）
      setTimeout(() => {
        if (this.devServer && !this.devServer.killed) {
          this.devServer.kill('SIGKILL');
        }
      }, 5000);
    }
  }

  /**
   * 获取页面完整截图
   */
  async takeFullPageScreenshot(templateName) {
    console.log(`📸 开始截图: ${templateName}`);
    
    // 启动浏览器
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });

    const page = await this.browser.newPage();
    
    // 设置视口
    await page.setViewportSize({
      width: CONFIG.screenshotWidth,
      height: CONFIG.screenshotHeight
    });

    try {
      // 访问页面
      console.log(`🌐 访问页面: ${CONFIG.baseUrl}`);
      await page.goto(CONFIG.baseUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // 等待页面完全加载
      await page.waitForTimeout(CONFIG.waitTime);

      // 自动滚动到页面底部以触发懒加载
      await this.autoScroll(page);

      // 回到顶部
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);

      // 获取完整页面截图 (Playwright 自动处理长截图)
      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        quality: CONFIG.screenshotQuality,
        type: 'png',
        animations: 'disabled' // 禁用动画以获得一致的截图
      });

      // 保存截图
      const screenshotPath = path.join(
        this.projectRoot, 
        'metadata', 
        templateName, 
        'screenshot.png'
      );

      // 确保目录存在
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      
      await fs.writeFile(screenshotPath, screenshotBuffer);
      
      console.log(`✅ 截图已保存: ${screenshotPath}`);
      
      // 获取图片尺寸信息
      const stats = await fs.stat(screenshotPath);
      console.log(`📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);

      return screenshotPath;

    } catch (error) {
      console.error(`❌ 截图失败:`, error.message);
      throw error;
    }
  }

  /**
   * 自动滚动页面 (Playwright优化版本)
   */
  async autoScroll(page) {
    console.log('📜 自动滚动页面以加载所有内容');
    
    // Playwright 提供了更好的滚动处理
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 200;
        const scrollDelay = 100;
        
        const timer = setInterval(() => {
          const scrollHeight = document.documentElement.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, scrollDelay);
      });
    });

    // 额外等待以确保所有懒加载内容都加载完成
    await page.waitForTimeout(1000);
  }

  /**
   * 清理资源
   */
  async cleanup() {
    console.log('🧹 清理资源');
    
    if (this.browser) {
      await this.browser.close();
    }
    
    this.stopDevServer();
  }

  /**
   * 截图单个模板
   */
  async screenshotTemplate(templateName) {
    if (!CONFIG.templates[templateName]) {
      throw new Error(`未知模板: ${templateName}`);
    }

    const templatePath = CONFIG.templates[templateName];
    
    try {
      // 启动开发服务器
      await this.startDevServer(templatePath);
      
      // 等待服务器稳定
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 截图
      await this.takeFullPageScreenshot(templateName);
      
    } catch (error) {
      console.error(`❌ 处理模板 ${templateName} 时出错:`, error.message);
      throw error;
    }
  }

  /**
   * 截图所有模板
   */
  async screenshotAll() {
    console.log('🎯 开始截图所有模板');
    
    const templateNames = Object.keys(CONFIG.templates);
    let successCount = 0;
    
    for (const templateName of templateNames) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📋 处理模板: ${templateName} (${successCount + 1}/${templateNames.length})`);
      console.log(`${'='.repeat(50)}`);
      
      try {
        await this.screenshotTemplate(templateName);
        successCount++;
        console.log(`✅ ${templateName} 截图完成`);
      } catch (error) {
        console.error(`❌ ${templateName} 截图失败:`, error.message);
      }
      
      // 清理并等待
      await this.cleanup();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`\n🎉 截图完成! 成功: ${successCount}/${templateNames.length}`);
  }

  /**
   * 主执行方法
   */
  async run() {
    const { templateName, options } = this.parseArgs();
    
    // 应用选项
    Object.assign(CONFIG, options);
    
    console.log('🎯 模板自动化截图工具');
    console.log('===================\n');
    
    try {
      if (templateName === 'all') {
        await this.screenshotAll();
      } else {
        await this.screenshotTemplate(templateName);
      }
    } catch (error) {
      console.error('❌ 执行失败:', error.message);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
    
    console.log('\n🎊 任务完成!');
  }
}

// 处理程序退出
process.on('SIGINT', async () => {
  console.log('\n⚠️  收到中断信号，正在清理...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  收到终止信号，正在清理...');
  process.exit(0);
});

// 运行脚本
if (require.main === module) {
  const screenshot = new TemplateScreenshot();
  screenshot.run();
}

module.exports = TemplateScreenshot;
