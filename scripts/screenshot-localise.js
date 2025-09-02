#!/usr/bin/env node

/**
 * 为Localise模板生成截图的专用脚本
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function screenshotLocalise() {
  console.log('🎯 Localise模板自动化截图工具');
  console.log('===========================\n');

  let browser;
  
  try {
    // 启动浏览器
    console.log('🚀 启动浏览器...');
    browser = await chromium.launch({
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // 设置视口
    await page.setViewportSize({
      width: 1200,
      height: 800
    });

    // 访问页面
    console.log('🌐 访问Localise页面: http://localhost:5173');
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 等待页面加载
    console.log('⏱️  等待页面加载完成...');
    await page.waitForTimeout(3000);

    // 自动滚动到底部
    console.log('📜 滚动页面加载所有内容...');
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
      __dirname, 
      '..', 
      'metadata', 
      'localise', 
      'screenshot.png'
    );

    await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
    await fs.writeFile(screenshotPath, screenshotBuffer);
    
    console.log(`✅ 截图已保存: ${screenshotPath}`);
    
    const stats = await fs.stat(screenshotPath);
    console.log(`📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);

    await browser.close();
    console.log('\n🎉 Localise截图完成！');

  } catch (error) {
    console.error('\n❌ 截图失败:', error.message);
    
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.log('\n💡 解决方案:');
      console.log('请确保开发服务器正在运行:');
      console.log('cd templates/landing/localise && npm run dev');
    }
    
    if (browser) {
      await browser.close();
    }
    
    process.exit(1);
  }
}

screenshotLocalise();
