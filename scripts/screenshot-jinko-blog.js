const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  templateName: 'jinko-blog',
  baseUrl: 'http://localhost:5173',
  outputDir: 'metadata/jinko-blog',
  screenshotFileName: 'screenshot.png',
  projectRoot: path.resolve(__dirname, '..'),
  templatePath: 'templates/landing/jinko-blog',
  systemChromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
};

class JinkoBlogScreenshotTool {
  constructor() {
    console.log('\n🎭 Jinko Blog模板自动化截图工具');
    console.log('=============================\n');
  }

  async checkServerStatus() {
    try {
      const response = await fetch(CONFIG.baseUrl);
      return response.ok;
    } catch (error) {
      console.log('⚠️  服务器检查失败，但继续尝试截图...');
      return false;
    }
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

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  async takeJinkoBlogScreenshot() {
    console.log('🚀 启动浏览器...');
    
    const browser = await chromium.launch({
      executablePath: CONFIG.systemChromePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();

    try {
      console.log(`🌐 访问Jinko Blog页面: ${CONFIG.baseUrl}`);
      await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
      
      console.log('⏱️  等待页面加载完成...');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('📜 滚动页面加载所有内容...');
      await this.autoScroll(page);
      await page.waitForTimeout(1000);

      // 滚回顶部
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);

      console.log('📷 生成完整页面长截图...');
      
      const screenshotBuffer = await page.screenshot({
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

      // 获取文件大小
      const stats = fs.statSync(screenshotPath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);

      console.log(`✅ 截图已保存: ${screenshotPath}`);
      console.log(`📊 文件大小: ${fileSizeKB} KB`);

    } catch (error) {
      console.error('❌ 截图失败:', error.message);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async run() {
    try {
      const serverRunning = await this.checkServerStatus();
      if (serverRunning) {
        console.log('✅ 开发服务器运行正常');
      } else {
        console.log('⚠️  请确保开发服务器在 http://localhost:5173 运行');
        console.log('💡 提示: 在模板目录运行 npm run dev');
      }

      await this.takeJinkoBlogScreenshot();
      console.log('\n🎉 Jinko Blog截图完成！');

    } catch (error) {
      console.error('\n❌ 执行失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行截图工具
const tool = new JinkoBlogScreenshotTool();
tool.run();
