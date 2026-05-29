# 雾中风景 — 个人数字花园 (single-author digital garden)

只读上线、本地撰写、文件即数据。无数据库、无登录。

## 架构

- 内容 = `content/` 下的 Markdown 文件 + `content/profile.json`，全部进 Git 仓库。
- `[[双链]]` 在构建时解析，自动生成左侧文件夹树、反向链接、知识图谱。
- 页面全部静态生成 (SSG)，线上是纯只读站点。
- 字体本地化：`@fontsource-variable/inter` + `@fontsource-variable/playfair-display`，构建/运行都不联网拉字体。

## 本地撰写 → 上线（GitHub + Vercel 协同）

1. 在 `content/notes/` 下新建/编辑 `.md`（可直接用 VSCode 或把该文件夹用 Obsidian 打开，双链语法完全兼容）。
2. 文件 frontmatter：
   ```
   ---
   title: 标题
   date: 2026-05-29
   tags: [llm, note]
   summary: 一句话摘要
   ---
   ```
3. 用 `[[标题]]` 或 `[[标题|别名]]` 链接到其它笔记（按标题 / 文件名 / 路径 slug 解析）。
4. `git add . && git commit -m "new note" && git push`
5. Vercel 监听到 push 后自动重新构建并发布。

## 路由

- `/` 学术主页（读 `content/profile.json`）
- `/notes` 笔记列表 ；`/notes/<folder>/<name>` 单篇（左：文件夹树，右：反向链接 + 出链）
- `/graph` 知识图谱（悬停聚焦，点击进入）

## 清除示例数据

```
npm run content:reset
```

只删除 frontmatter 里标了 `sample: true` 的示例笔记，删除前会备份到 `content/_backup_<时间>/`。你自己写的真实笔记不会被动。之后编辑 `content/profile.json` 填入真实信息即可。

## 常用命令

```
npm install
npm run dev        # 本地预览
npm run build      # 生产构建（验证）
npm start
```

---

## 新增功能（v1+v2 融合）

### 图片

- 标准 Markdown：`![说明](/assets/your-image.png)`，图片放 `public/assets/`。
- Obsidian 嵌入：`![[your-image.png]]` 或 `![[your-image.png|说明]]`，构建时自动解析为 `/assets/your-image.png`（把图片放进 `public/assets/` 即可，文件名一致）。

### 笔记评论（giscus，存进 GitHub Discussions，无后端）

1. 仓库设为 public，Settings → 开启 Discussions。
2. 安装 https://github.com/apps/giscus 到该仓库。
3. 打开 https://giscus.app ，填入仓库，拿到 `repo-id`、`category-id`。
4. 填进 `content/site.json` 的 `giscus` 字段（`repo` / `repoId` / `category` / `categoryId`）。

- `mapping: "pathname"` 表示每篇笔记按 URL 各自一个评论串。未配置时评论区显示设置提示，不报错。

### 知识图谱

- 滚轮缩放、拖空白平移、拖节点调整、点击进入笔记、悬停聚焦邻居。

### 首页

https://my-blog-public-three.vercel.app/

- 学术主页样式：个人介绍、研究方向、**论文发表（编辑 `content/profile.json` 的 `publications`）**、最近笔记。
- 右栏组件：**北京实时天气**（Open-Meteo，免 API key）、**日历**（高亮今天与有笔记的日期）、**花园概览**统计。

### 天气

- 默认北京（lat 39.9042 / lon 116.4074），数据来自 Open-Meteo，无需任何密钥。
- 改城市：编辑 `src/components/Weather.tsx` 里的经纬度。
