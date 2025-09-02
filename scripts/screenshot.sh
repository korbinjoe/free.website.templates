#!/bin/bash

# 自动化截图脚本包装器
# 简化的命令行界面

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🎯 模板自动化截图工具 (Playwright版)${NC}"
echo -e "${BLUE}====================${NC}"
echo

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 需要安装 Node.js${NC}"
    echo "请访问 https://nodejs.org 下载安装"
    exit 1
fi

# 检查并安装依赖
if [ ! -d "$PROJECT_ROOT/node_modules" ] || [ ! -d "$PROJECT_ROOT/node_modules/playwright" ]; then
    echo -e "${YELLOW}📦 安装依赖中...${NC}"
    cd "$PROJECT_ROOT"
    npm install
    
    # 安装Playwright浏览器
    echo -e "${YELLOW}📦 安装Playwright浏览器...${NC}"
    npx playwright install chromium
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
    echo
fi

# 显示帮助
if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo -e "${YELLOW}用法:${NC}"
    echo "  $0 <template-name> [options]"
    echo
    echo -e "${YELLOW}模板名称:${NC}"
    echo "  superwhisper     SuperWhisper AI模板"
    echo "  buymeacoffee     Buy Me a Coffee模板"  
    echo "  pirsch           Pirsch Analytics模板"
    echo "  all              所有模板"
    echo
    echo -e "${YELLOW}选项:${NC}"
    echo "  --width <num>    截图宽度 (默认: 1200px)"
    echo "  --height <num>   截图高度 (默认: 800px)" 
    echo "  --quality <num>  截图质量 (默认: 90)"
    echo "  --wait <num>     等待时间 (默认: 3000ms)"
    echo
    echo -e "${YELLOW}示例:${NC}"
    echo "  $0 superwhisper"
    echo "  $0 all"
    echo "  $0 buymeacoffee --width 1400 --quality 95"
    exit 0
fi

# 验证模板名称
TEMPLATE_NAME="$1"
VALID_TEMPLATES=("superwhisper" "buymeacoffee" "pirsch" "all")

if [[ ! " ${VALID_TEMPLATES[@]} " =~ " ${TEMPLATE_NAME} " ]]; then
    echo -e "${RED}❌ 未知模板: $TEMPLATE_NAME${NC}"
    echo -e "${YELLOW}支持的模板: ${VALID_TEMPLATES[*]}${NC}"
    exit 1
fi

# 检查端口是否被占用
PORT=5173
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  端口 $PORT 已被占用，正在尝试终止进程...${NC}"
    
    # 尝试优雅终止
    PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t)
    if [ ! -z "$PID" ]; then
        kill $PID 2>/dev/null || true
        sleep 2
        
        # 如果还在运行，强制终止
        if kill -0 $PID 2>/dev/null; then
            kill -9 $PID 2>/dev/null || true
        fi
    fi
    
    sleep 1
fi

echo -e "${GREEN}🚀 开始截图模板: $TEMPLATE_NAME${NC}"
echo

# 执行截图脚本
cd "$PROJECT_ROOT"
node scripts/auto-screenshot.js "$@"

echo
echo -e "${GREEN}🎉 截图完成！${NC}"

# 显示结果
if [ "$TEMPLATE_NAME" = "all" ]; then
    echo -e "${BLUE}📸 生成的截图:${NC}"
    for template in superwhisper buymeacoffee pirsch; do
        screenshot_file="metadata/$template/screenshot.png"
        if [ -f "$screenshot_file" ]; then
            size=$(du -h "$screenshot_file" | cut -f1)
            echo -e "  ✅ $template: $screenshot_file ($size)"
        else
            echo -e "  ❌ $template: 截图失败"
        fi
    done
else
    screenshot_file="metadata/$TEMPLATE_NAME/screenshot.png"
    if [ -f "$screenshot_file" ]; then
        size=$(du -h "$screenshot_file" | cut -f1)
        echo -e "${BLUE}📸 截图保存到:${NC} $screenshot_file ($size)"
    else
        echo -e "${RED}❌ 截图失败${NC}"
        exit 1
    fi
fi

echo
echo -e "${YELLOW}💡 提示: 你现在可以在 README.md 中看到更新的预览图${NC}"
