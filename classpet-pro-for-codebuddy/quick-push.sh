#!/bin/bash

# 快速推送脚本
echo "=== ClassPet Pro GitHub 推送 ==="
echo "远程仓库: https://github.com/fwei19921-dotcom/classpet-pro1.0.git"
echo "当前目录: /Users/yr/.openclaw/workspace/classpet-pro-for-codebuddy"
echo ""

echo "1. 检查远程仓库..."
git remote -v

echo ""
echo "2. 检查分支..."
git branch

echo ""
echo "3. 检查提交..."
git log --oneline -5

echo ""
echo "4. 准备推送..."
echo "GitHub Desktop 可能有问题，直接通过命令行推送。"

echo ""
echo "5. 执行推送..."
git push origin main

echo ""
echo "=== 如果推送成功 ==="
echo "GitHub Pages 配置："
echo "1. 访问 https://github.com/fwei19921-dotcom/classpet-pro1.0"
echo "2. Settings → Pages"
echo "3. Source: GitHub Actions"
echo "或 Source: Deploy from a branch"
echo "4. Branch: main"
echo "5. Folder: / (root)"
echo ""

echo "=== 访问链接 ==="
echo "部署后访问："
echo "https://fwei19921-dotcom.github.io/classpet-pro1.0/"
echo "https://fwei19921-dotcom.github.io/classpet-pro1.0/index.html"
echo "https://fwei19921-dotcom.github.io/classpet-pro1.0/admin.html"
echo "https://fwei19921-dotcom.github.io/classpet-pro1.0/mobile.html"
echo ""