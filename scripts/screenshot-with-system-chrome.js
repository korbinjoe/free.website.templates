#!/usr/bin/env node

/**
 * 使用系统Chrome的自动化截图脚本
 * 解决Playwright Chromium下载问题的替代方案
 */

const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// 配置
const CONFIG = {
  port: 5173,
  baseUrl: 'http://localhost:5173',
  screenshotWidth: 1200,
  screenshotHeight: 800,
  screenshotQuality: 90,
  waitTime: 3000,
};

class SystemChromeScreenshot {
  constructor() {
    this.browser = null;
    this.devServer = null;
    this.projectRoot = path.resolve(__dirname, '..');
  }

  /**
   * 查找系统Chrome路径
   */
  findSystemChrome() {
    const possiblePaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
      '/Applications/Chromium.app/Contents/MacOS/Chromium', // macOS Chromium
      '/usr/bin/google-chrome-stable', // Linux
      '/usr/bin/google-chrome', // Linux
      '/usr/bin/chromium-browser', // Linux
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
    ];

    for (const chromePath of possiblePaths) {
      try {
        require('fs').accessSync(chromePath);
        return chromePath;
      } catch (error) {
        // 继续尝试下一个路径
      }
    }

    return null;
  }

  /**
   * 启动浏览器（使用系统Chrome）
   */
  async launchBrowser() {
    const chromePath = this.findSystemChrome();
    
    if (chromePath) {
      console.log(`🌟 使用系统Chrome: ${chromePath}`);
      return await chromium.launch({
        headless: true,
        executablePath: chromePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security'
        ]
      });
    } else {
      console.log('🎯 使用Playwright内置Chromium');
      return await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security'
        ]
      });
    }
  }

  /**
   * 检查开发服务器是否运行
   */
  async checkDevServer() {
    return new Promise((resolve) => {
      const http = require('http');
      const req = http.get(CONFIG.baseUrl, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * 获取SuperWhisper截图
   */
  async takeSuperwisperScreenshot() {
    console.log('📸 开始SuperWhisper长截图');
    
    // 检查开发服务器
    console.log('🔍 检查开发服务器状态...');
    const isServerRunning = await this.checkDevServer();
    if (!isServerRunning) {
      console.log('⚠️  服务器检查失败，但继续尝试截图...');
      console.log('💡 如果截图失败，请确保开发服务器运行: cd templates/landing/superwhisper && npm run dev');
    } else {
      console.log('✅ 开发服务器运行正常');
    }

    // 启动浏览器
    this.browser = await this.launchBrowser();
    const page = await this.browser.newPage();
    
    // 设置视口
    await page.setViewportSize({
      width: CONFIG.screenshotWidth,
      height: CONFIG.screenshotHeight
    });

    try {
      console.log(`🌐 访问SuperWhisper页面: ${CONFIG.baseUrl}`);
      await page.goto(CONFIG.baseUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // 等待页面加载
      await page.waitForTimeout(CONFIG.waitTime);
      console.log('⏱️  等待页面加载完成');

      // 自动滚动到底部
      console.log('📜 滚动页面加载所有内容');
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 200;
          const timer = setInterval(() => {
            const scrollHeight = document.documentElement.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight){
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      // 回到顶部
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);

      // 获取完整页面截图
      console.log('📷 生成完整页面长截图...');
      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        type: 'png',
        animations: 'disabled'
      });

      // 保存截图
      const screenshotPath = path.join(
        this.projectRoot, 
        'metadata', 
        'superwhisper', 
        'screenshot.png'
      );

      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      await fs.writeFile(screenshotPath, screenshotBuffer);
      
      console.log(`✅ 截图已保存: ${screenshotPath}`);
      
      const stats = await fs.stat(screenshotPath);
      console.log(`📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);

      return screenshotPath;

    } catch (error) {
      console.error(`❌ 截图失败:`, error.message);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// 运行截图
async function main() {
  console.log('🎯 SuperWhisper自动化长截图工具');
  console.log('============================\n');
  
  const screenshot = new SystemChromeScreenshot();
  
  try {
    await screenshot.takeSuperwisperScreenshot();
    console.log('\n🎉 截图完成！');
  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    
    if (error.message.includes('开发服务器未运行')) {
      console.log('\n💡 解决方案:');
      console.log('cd templates/landing/superwhisper && npm run dev');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SystemChromeScreenshot;
