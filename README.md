# Starship AI · 星舰科技

深色科技风的中英双语企业官网，纯 HTML / CSS / JavaScript，无构建依赖、外部字体或 CDN。

## 文件
- `index.html`：页面结构、中英文正文、SEO 信息。
- `styles.css`：响应式视觉样式与无动画偏好适配。
- `app.js`：语言切换、轨道视觉、场景演示、项目简报下载。
- `favicon.svg`：原创品牌图标。
- `.nojekyll`：GitHub Pages 静态发布标记。

## 本地预览

在本目录运行 `python3 -m http.server 8080`，访问 http://localhost:8080 。
支持 `?lang=en` 或 `?lang=zh` 语言链接；用户选择会保存在浏览器本地。

## GitHub Pages

将本目录提交到目标 GitHub 仓库的 `main` 分支。在 Settings → Pages → Build and deployment 中，选择 Deploy from a branch，指定 main / (root) 并保存。无需安装依赖或构建。全部资源采用相对路径，支持仓库子路径部署。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 内容与功能边界

- 已确认资料：公司名称、AI 大模型与 Agent 开发服务、香港总部、新加坡及美国分支、普惠投资愿景。
- 网站细化的服务内容、合作流程为首版建议文案，可以按真实交付范围调整。
- 不虚构客户、团队履历、营收数据、办公地址、邮箱、金融牌照或业绩。
- 三组 Agent 流程是明确标记的预设概念演示，不连接模型、市场数据或交易服务。
- 商务邮箱：enquiry@starship.com.hk；邮件入口打开访客自己的邮件客户端。项目简报在浏览器本地下载，不自动提交或发送。
- 愿景不构成能力或投资收益保证。
- 无广告追踪、第三方分析或后端数据收集。语言偏好保存在 localStorage。

## 后续配置

后续可以增加预约链接或接入真实表单服务。正式域名为 `starship.com.hk`，通过 GitHub Pages 自定义域名和 HKDNR DNS Hosting 直接提供网站；浏览器地址栏保留公司域名。

## 版本

v1.0 · 2026-10-07：双语官网、原创轨道视觉、三场景概念演示、全球布局、本地需求简报、响应式布局与无障碍基础支持。
