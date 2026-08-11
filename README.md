# 暖屋食光 · 用餐记录 (PWA)

单文件应用打包为 PWA，可"添加到主屏幕"离线使用。

## 目录
```
.
├── index.html            # 应用本体（含 manifest 链接 / SW 注册）
├── manifest.webmanifest  # PWA 配置（应用名/图标/主题色）
├── sw.js                 # Service Worker（离线缓存）
├── icons/                # 应用图标 (180/192/512)
└── .github/workflows/deploy.yml  # 自动部署到 GitHub Pages
```

## 部署到 GitHub Pages（自动）
1. 新建仓库并把本目录全部文件推送上去（分支 `main`）
2. 仓库 → Settings → Pages → Source 选 **GitHub Actions**（或直接推送，workflow 会自动部署）
3. 首次推送后约 1 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`

## 手机安装
- **Android Chrome**：打开网址 → 菜单 → 「添加到主屏幕」/「安装应用」
- **iPhone Safari**：打开网址 → 分享 → 「添加到主屏幕」

> PWA 安装要求 HTTPS。GitHub Pages 默认提供，无需自备证书。
