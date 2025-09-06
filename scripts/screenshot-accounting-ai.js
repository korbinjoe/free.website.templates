const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  templateName: 'accounting-ai',
  baseUrl: 'http://localhost:5173',
  outputDir: 'metadata/accounting-ai',
  screenshotFileName: 'screenshot.png',
  projectRoot: path.resolve(__dirname, '..'),
  templatePath: 'templates/landing/accounting-ai',
  systemChromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
};

class AccountingAIScreenshot {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async checkServer() {
    try {
      const response = await fetch(CONFIG.baseUrl);
      if (response.ok) {
        console.log('✅ 开发服务器正在运行');
        return true;
      }
    } catch (error) {
      console.log('❌ 开发服务器未运行，请先启动服务');
      return false;
    }
    return false;
  }

  async initBrowser() {
    console.log('🚀 启动浏览器...');
    
    this.browser = await chromium.launch({
      headless: true,
      executablePath: CONFIG.systemChromePath,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images=false',
        '--window-size=1920,1080'
      ]
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1
    });

    this.page = await this.context.newPage();
  }

  async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if(totalHeight >= scrollHeight - window.innerHeight){
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  async takeAccountingAIScreenshot() {
    const serverRunning = await this.checkServer();
    if (!serverRunning) {
      console.log('❌ 请先启动Accounting AI模板的开发服务器');
      console.log('💡 运行命令: cd templates/landing/accounting-ai && npm run dev');
      return false;
    }

    console.log('📸 开始截图流程...');
    
    try {
      await this.initBrowser();
      
      console.log(`📍 访问页面: ${CONFIG.baseUrl}`);
      await this.page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
      
      // 等待页面加载完成
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(3000);
      
      // 自动滚动页面
      console.log('📜 自动滚动页面...');
      await this.autoScroll(this.page);
      
      // 等待一下让内容稳定
      await this.page.waitForTimeout(2000);
      
      // 滚回顶部
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.page.waitForTimeout(1000);
      
      // 截图
      console.log('📷 正在生成全页面截图...');
      const screenshotBuffer = await this.page.screenshot({
        fullPage: true,
        type: 'png',
        animations: 'disabled'
      });
      
      // 确保输出目录存在
      const outputPath = path.join(CONFIG.projectRoot, CONFIG.outputDir);
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
      
      // 保存截图
      const screenshotPath = path.join(outputPath, CONFIG.screenshotFileName);
      fs.writeFileSync(screenshotPath, screenshotBuffer);
      
      console.log('✅ 截图保存成功!');
      console.log(`📁 文件路径: ${screenshotPath}`);
      console.log(`📏 文件大小: ${(screenshotBuffer.length / 1024 / 1024).toFixed(2)} MB`);
      
      return true;
      
    } catch (error) {
      console.error('❌ 截图失败:', error.message);
      return false;
    } finally {
      if (this.browser) {
        await this.browser.close();
        console.log('🔚 浏览器已关闭');
      }
    }
  }

  async run() {
    console.log('🎯 Accounting AI模板长截图生成器');
    console.log(`📂 模板路径: ${CONFIG.templatePath}`);
    console.log(`🌐 访问地址: ${CONFIG.baseUrl}`);
    console.log(`💾 输出路径: ${CONFIG.outputDir}/${CONFIG.screenshotFileName}`);
    console.log('─'.repeat(50));
    
    const success = await this.takeAccountingAIScreenshot();
    
    if (success) {
      console.log('');
      console.log('🎉 Accounting AI模板长截图生成完成!');
      console.log('📋 总结:');
      console.log(`   ✅ 模板: ${CONFIG.templateName}`);
      console.log(`   ✅ 截图: ${CONFIG.outputDir}/${CONFIG.screenshotFileName}`);
    } else {
      console.log('');
      console.log('💥 截图生成失败，请检查错误信息');
      process.exit(1);
    }
  }
}

// 运行脚本
const screenshotTool = new AccountingAIScreenshot();
screenshotTool.run().catch(console.error);
