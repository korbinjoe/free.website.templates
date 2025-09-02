#!/usr/bin/env node

/**
 * 测试Playwright截图功能
 */

const { chromium } = require('playwright');

async function testScreenshot() {
  console.log('🧪 测试Playwright截图功能');
  
  try {
    // 测试是否可以启动浏览器
    console.log('📦 启动Chromium...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // 访问一个简单页面
    console.log('🌐 访问测试页面...');
    await page.goto('data:text/html,<h1>Playwright Test</h1><p>Screenshot working!</p>');
    
    // 截图测试
    console.log('📸 测试截图...');
    const screenshot = await page.screenshot({ 
      fullPage: true,
      type: 'png'
    });
    
    console.log(`✅ 截图成功! 大小: ${screenshot.length} 字节`);
    
    await browser.close();
    console.log('🎉 Playwright功能正常!');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n💡 请确保已安装Chromium: npx playwright install chromium');
  }
}

testScreenshot();
