#!/bin/bash

# GitHub 推送命令脚本
# ClassPet Pro v1.2.0 - 手机端完成版

echo "=== 推送 ClassPet Pro 到 GitHub ==="
echo "远程仓库: https://github.com/fwei19921-dotcom/classpet-pro1.0.git"
echo ""

# 1. 设置远程仓库（已配置）
echo "1. 检查远程仓库配置:"
git remote -v
echo ""

# 2. 推送代码到 GitHub
echo "2. 推送代码:"
echo "执行: git push -u origin main"
echo "如果遇到问题，可能需要:"
echo "   a) 输入 GitHub 用户名和密码"
echo "   b) 使用 SSH 方式连接"
echo ""

# 3. 推送标签
echo "3. 推送版本标签:"
echo "执行: git push origin v1.2.0"
echo ""

# 4. GitHub Pages 设置提示
echo "4. 启用 GitHub Pages:"
echo "   - 访问 https://github.com/fwei19921-dotcom/classpet-pro1.0"
echo "   - 点击 Settings"
echo "   - 找到 Pages"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "   - Save"
echo ""

echo "=== 项目信息 ==="
echo "版本: v1.2.0 - 手机端完成版"
echo "提交记录:"
git log --oneline
echo ""

echo "=== 访问链接 ==="
echo "本地测试:"
echo "  - 大屏端: http://localhost:8080/index.html"
echo "  - 管理端: http://localhost:8080/admin.html"
echo "  - 手机端: http://localhost:8080/mobile.html"
echo ""
echo "GitHub Pages (部署后):"
echo "  - 大屏端: https://fwei19921-dotcom.github.io/classpet-pro1.0/index.html"
echo "  - 管理端: https://fwei19921-dotcom.github.io/classpet-pro1.0/admin.html"
echo "  - 手机端: https://fwei19921-dotcom.github.io/classpet-pro1.0/mobile.html"
echo ""

echo "=== 文件清单 ==="
ls -la | grep -E "\.html|\.md|\.js$|\.css$"
echo ""

echo "=== 注意事项 ==="
echo "1. GitHub Pages 部署后可能需要几分钟生效"
echo "2. 如有权限问题，可能需要输入 GitHub 凭据"
echo "3. 建议开启 GitHub Pages 前检查仓库是否公开"

echo "=== 执行命令 ==="
echo "请在终端执行以下命令:"
echo ""
echo "git push -u origin main"
echo ""