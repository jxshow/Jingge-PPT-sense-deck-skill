# 鲸格PPT
![鲸格 PPT · 17 种风格总览](examples/style-atlas/鲸格PPT-全部风格总览.png)

鲸格PPT 是一个用于生成高质量浏览器原生演示文稿的 Codex Skill。它以静态 HTML/CSS/JS 为主要产物，通过内容 IR、主题系统、完整 Deck 模板、单页布局、动画运行时、演讲者模式、可编辑模式、手势控制和导出辅助，帮助 AI 从一个主题、资料、文章、PPT 模板或业务需求出发，生成可演示、可修改、可部署的 PPT/Slides/Keynote 风格作品。

这个仓库是完整版 Skill，包含完整模板库和重素材示例，适合本地使用、二次开发、发布为开源 Skill，或作为轻量版/20MB 导入版的上游资源。

## 安装与使用

Skill 名称为 `jingge-ppt`，界面显示「鲸格 PPT」。仓库：[jxshow/Jingge-PPT-skill](https://github.com/jxshow/Jingge-PPT-skill)。

Windows PowerShell 安装示例：

```powershell
$skillsDir = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME "skills" } else { Join-Path $env:USERPROFILE ".codex\skills" }
New-Item -ItemType Directory -Force -Path $skillsDir | Out-Null
git clone https://github.com/jxshow/Jingge-PPT-skill.git (Join-Path $skillsDir "jingge-ppt")
```

已有旧安装时，先备份并移出 Skills 目录，再安装新版，避免重复识别。安装后可重新打开 Codex 或新建对话。

使用示例：

```text
$jingge-ppt 用黑金讲堂版做一份12页演讲，主题是……，受众是……。
```

可直接指定咨询简报、黑金讲堂、雷军版、乔布斯、典雅编辑等名称；全部17种风格见上方总览。

## 1–10 张图的图文排版

新增 10 种可复用的图片组合模板，涵盖一图一论点、双图夹心、三联叙事、四图矩阵、一主四辅、六图中心围合、一主六辅、八图两侧围合、九图画廊和十图双排。先按主次、对比、步骤或证据关系选结构，再按实际图片数量装配，配色继续服从用户要求和已有主题。

- [图文排版规则](references/image-composition.md)：标题与正文层级、边距、图间距、说明、照片裁切、截图保真，以及蜂巢/扇形/拼贴的选用边界。
- [版式预览](examples/image-composition/index.html)：下载或克隆仓库后，用浏览器打开该 HTML，可切换三种配色；预览中的方块是结构示意。
- `templates/single-page-layouts/photo-*.html` 与 `image-composition.css`：可直接装配的 1–10 图布局片段。
- `templates/content-ir/image-composition.example.json`：图片用途、数量、阅读顺序、文字区、slot、裁切焦点和说明的 IR 示例。

沿用当前的 `generate` / `user-supplied` / `upload-slots` 图片能力路由；有可用图片时替换规划占位，缺少可靠图片能力时交付写明主题和裁切意图的上传槽。

## 核心能力

- 从短主题或长资料生成结构完整的演示文稿。
- 使用 `content-ir.json` 作为内容、结构、资产和功能开关的中间表示。
- 先选模板、再填内容，避免从空白 CSS 重造 PPT。
- 支持商务汇报、技术分享、融资路演、市场研究、课程培训、小红书九宫格、短剧出海、产品发布、品牌叙事、电影质感、赛博朋克、纸片拼贴、北欧绘本等场景。
- 支持静态 HTML Deck、演讲者模式、键盘/触摸导航、可编辑模式、Canvas FX、可选手势翻页。
- 支持图文并茂工作流，包括电影级背景图、PNG/WebP 组件和小配图批量生成；SVG/CSS/Canvas 仅用于图表、图标、流程图和结构图等代码原生图形，缺少可靠图像能力时，摄影、插图、产品图与复杂位图区域必须保留为上传槽。
- 支持 HTML、PDF、Typst handout 等导出辅助。

## 适用场景

当用户提出以下需求时，适合使用鲸格PPT：

- 做一份 PPT、slides、演示稿、汇报材料、keynote 风格页面。
- 根据一个主题自动研究、梳理观点并生成成套演示。
- 把文章、会议记录、产品资料、行业报告或碎片笔记变成 PPT。
- 美化或重建已有 PPT/模板。
- 生成浏览器可运行的 HTML PPT。
- 需要电影质感、图文并茂、品牌感、故事感、绘本风、赛博朋克、纸片拼贴等强视觉风格。
- 需要演讲者备注、动画、导出、可编辑 HTML 或手势控制。

## 工作流总览

鲸格PPT 遵循“先理解、再选模板、最后生成”的流程：

1. 读取 `templates/index.json`。
2. 检测当前环境能力：文件写入、浏览器预览、图片生成、图片理解、透明图/抠图、导出能力等。
3. 根据用户输入生成或更新 `content-ir.json`。
4. 读取相关目录：
   - `templates/full-decks/deck-catalog.json`
   - `templates/themes/theme-catalog.json`
   - `templates/single-page-layouts/layout-catalog.json`
   - `templates/animations/animation-catalog.json`
5. 选择最接近的完整 Deck 模板。
6. 选择合适主题和单页布局。
7. 如需视觉资产，先生成或收集图片，再写 HTML。
8. 写出静态 Deck：`index.html`、`styles.css`、`deck.js`、`content-ir.json`。
9. 接入演讲者模式、编辑模式、动画生命周期、可选手势控制。
10. 通过本地 HTTP 服务预览并验证导航、响应式、控制台、素材路径和导出路径。

## 目录结构

```text
鲸格PPT/
  SKILL.md
  README.md
  docs/
    image-generation-guide.md
  templates/
    index.json
    content-ir/
      content-ir.example.json
    schemas/
      content-ir.schema.json
      template.schema.json
    themes/
      theme-catalog.json
      *.css
      *.asset-kit.json
    full-decks/
      deck-catalog.json
      _shared/
      pitch-deck/
      weekly-report/
      product-launch/
      technical-talk/
      xhs-9-card/
      courseware/
      executive-strategy/
      market-research/
      ai-industry-report/
      startup-roadshow/
      sales-proposal/
      training-workshop/
      demo-day/
      brand-story/
      ai-short-drama-overseas/
      nordic-childrens-picture-book/
      电影质感/
      碎纸片/
      赛博朋克/
    single-page-layouts/
      layout-catalog.json
      *.html
      layouts.css
    animations/
      animation-catalog.json
      ambient-particles.js
      canvas-fx-pack.js
      slide-transitions.css
    runtime/
      slide-lifecycle.js
      canvas-fx-runtime.js
      edit-mode.js
    features/
      gesture-controller.js
    exporters/
      html/
      pdf/
      typst/
```

## 主要目录说明

### `SKILL.md`

Skill 的核心执行说明。Codex 根据 frontmatter 的 `name` 和 `description` 判断何时触发，触发后读取正文中的工作流、模板选择规则、图片策略、验证要求和特殊风格约束。

### `templates/index.json`

模板库入口文件。它指向主题、完整 Deck、单页布局、动画、schema、runtime、features 和 exporters，是生成任何 Deck 前应优先读取的索引。

### `templates/content-ir/`

内容 IR 示例。鲸格PPT 不直接从原始文本跳到 HTML，而是先把主题、受众、风格、功能开关、素材计划、幻灯片角色、可见内容和演讲者备注写入 `content-ir.json`。

### `templates/schemas/`

IR 和模板元数据 schema。复杂任务建议使用 schema 校验，确保生成的内容结构可被 HTML、导出器和后续编辑流程复用。

### `templates/themes/`

主题 CSS 和主题目录。主题主要负责色彩、字体、排版节奏、卡片系统、背景语言和组件质感。

### `templates/full-decks/`

完整可运行 Deck 模板。用户需求匹配某个典型场景时，应优先复制最接近的完整 Deck，再替换内容，而不是从零搭结构。

### `templates/single-page-layouts/`

单页布局库。用于补齐完整 Deck 不覆盖的长尾页面，例如 agenda、timeline、KPI dashboard、architecture、quote、code、risk board 等。

### `templates/animations/`

CSS 动画与 Canvas FX。动画必须跟随 slide lifecycle，进入页面时启动，离开页面时停止，不能全局无休止运行。

### `templates/runtime/`

HTML Deck 的运行时辅助，包括 slide lifecycle、Canvas FX runtime、编辑模式。

### `templates/features/`

可选功能，例如手势控制。手势能力必须是可选项，不能成为基础导航的硬依赖。

### `templates/exporters/`

导出辅助说明，覆盖 HTML、PDF、Typst 等路径。

## 内置主题

完整版当前包含以下主题：

- `apple-bento-glass`：AI、产品策略、新品类、精品商业 Deck。
- `executive-clean`：董事会、战略汇报、投资人更新、周报。
- `semantic-dark`：技术分享、架构讲解、AI 系统、开发者演示。
- `xhs-editorial`：小红书图文、社交媒体 carousel、消费教育内容。
- `cyber-neon`：Demo Day、产品展示、RGB 硬件、赛博发布会。
- `warm-paper`：课程、讲义、故事、文化主题。
- `nordic-childrens-picture-book`：北欧儿童绘本风、怀旧幽默故事。
- `史诗级`：历史文化叙事、昭君出塞、国风电影感展示。
- `neon-noir-city`：赛博朋克城市、AI 未来生活、2098 叙事。
- `editorial-cinematic-paper`：暖象牙纸、近黑宋体、暗酒红强调、编辑部网格与低照度电影静帧；作为原有风格保留，明确指定或延续原稿时使用。

主题选择建议：

- 未指定视觉风格：按 `templates/style-routing.json` 选择五种高端基准模板；场景不明用 `premium-consulting`。
- AI / 产品 / 策略 / 新品类：`apple-bento-glass`
- 投资人 / 管理层 / 董事会：`executive-clean`
- 技术分享 / 架构图 / 系统解释：`semantic-dark`
- 小红书图文 / 社交传播：`xhs-editorial`
- 北欧童话 / 绘本 / 怀旧幽默：`nordic-childrens-picture-book`
- 纸片拼贴 / 创意技术流程：`碎纸片`
- 赛博朋克 / 未来城市 / 2098 生活方式：`neon-noir-city`
- 电影海报感 / 历史人物故事 / 国风叙事：`电影质感`

视觉优先级：用户明确指定且与内置主题相符时，使用对应内置主题；用户明确描述了其他视觉方向时，尊重该方向并改造最接近模板；修改已有演示时保留其选定风格；新建且没有视觉方向时按场景选择五种高端基准模板。详细规则见 `references/premium-baselines.md`。

完整风格名称与缩略图见 [17 种风格总览](examples/style-atlas/鲸格PPT-全部风格总览.png)。

## 五种高端基准风格

新增咨询简报、黑金讲堂、雷军版、乔布斯、典雅编辑。每种都有 8 页可编辑完整模板，分别承载报告、授课、发布、短讲与叙事。它们共同约束未指定风格时的设计质量；原有鲸格风格仍可明确选择。详见 [风格规则](references/premium-baselines.md) 与 [预览](examples/premium-baselines/index.html)。不收录视觉参考中的作者姓名、Logo、肖像、二维码和履历。

## 完整 Deck 模板

完整版包含 25 类主线 Deck，包括五种高端基准模板：

- `premium-consulting`：咨询简报。
- `premium-lecture`：黑金讲堂。
- `premium-product`：雷军版。
- `premium-minimal`：乔布斯。
- `premium-editorial`：典雅编辑。

- `pitch-deck`：融资路演、商业 pitch。
- `weekly-report`：周报、业务复盘、项目进展。
- `xhs-9-card`：小红书九宫格、社交 carousel。
- `product-launch`：新品发布、功能发布。
- `technical-talk`：技术分享、架构演讲。
- `courseware`：课程、培训、讲义。
- `executive-strategy`：管理层战略汇报。
- `market-research`：市场研究、行业分析。
- `ai-industry-report`：AI 行业报告、趋势研究。
- `startup-roadshow`：创业展示、Demo Day。
- `sales-proposal`：销售方案、客户提案。
- `training-workshop`：内部培训、工作坊。
- `demo-day`：产品 Demo、硬件发布、RGB 键盘展示。
- `brand-story`：品牌故事、品牌 campaign。
- `ai-short-drama-overseas`：AI 短剧出海、内容生产、市场策略。
- `nordic-childrens-picture-book`：北欧童话绘本风 PPT。
- `电影质感`：电影感、昭君出塞、历史文化叙事、MediaPipe 手势 Deck。
- `碎纸片`：纸片拼贴、paper craft lab、AI 游戏生产线。
- `赛博朋克`：赛博朋克、未来城市、2098 生活方式。
- `editorial-cinematic-report`：原有暖纸编辑部电影报告模板，含流程、系统图、影像分析、多视角资产、质量闭环与收束页。

## 单页布局

单页布局用于补充完整 Deck，包括：

- `cover-bento-glass`
- `agenda`
- `section-divider`
- `comparison-2col`
- `comparison-3col`
- `timeline`
- `kpi-dashboard`
- `quote`
- `code`
- `architecture`
- `qa`
- `thanks`
- `risk-board`
- `market-signal`
- `semantic-compare`
- `ai-production-loop`
- `roadmap-90-day`

`layout-catalog.json` 中还保留一些 planned 布局语义，后续可继续扩展。

## 动画与 Canvas FX

动画分两类：

- CSS animations：适合文字入场、卡片 stagger、柔和缩放、线条绘制、指标 count-up、渐变移动等。
- Canvas FX：适合 particles、matrix rain、fluid waves、network nodes、data stream、waveform 等程序化背景。

生命周期规则：

- Reveal.js Deck 监听 `Reveal.on("slidechanged", ...)`。
- 内置 runtime 派发和监听 `deck:slidechange`。
- Canvas FX 必须提供 `start()` 和 `stop()`。
- 动画只在当前 slide 激活时运行。

## 图片与视觉资产策略

鲸格PPT 对视觉资产采用分层策略：

1. `cinematic-images`：电影级背景、人物场景、文化叙事、品牌大片、情绪型 Deck。
2. `png-components`：商务、产品、策略、培训、科技类 Deck 中的透明 PNG/WebP 组件，例如玻璃盾牌、机器人、徽章、设备、数据卡片、纸片、霓虹招牌等。
3. `code-native-graphics`：本来就适合代码绘制的图表、图标、线框和结构图。
4. `upload-slots`：没有可靠图片生成与检查能力时，为摄影、插图、产品图和复杂位图保留空白上传位。
5. `hybrid`：少量主视觉图片 + SVG/CSS 图解 + PNG 组件混合。

重要原则：

- 用户要求图文并茂、插图、电影质感、绘本、产品视觉、品牌感、海报感时，若环境支持图片生成，应主动使用真实图片生成能力。
- SVG 不应冒充用户明确要求的插图或缺失照片。SVG 只适合真正的图标、图解、线框和结构框架。
- 所有生成或收集的素材应放到 Deck 输出目录，例如 `assets/backgrounds/`、`assets/spot/`、`assets/decor/`。
- Deck 中引用本地相对路径，不依赖临时目录、桌面、下载目录或远程热链。

## Spot Illustration Pipeline

对于图文并茂但不是每页都需要海报大图的 Deck，推荐批量生成小配图：

- 只有图片确实承担内容任务时才生成配图。五种高端基准不按页数强配图；其他图文风格可按需要规划小 PNG/WebP。
- 前三页试样先验证版式和信息结构，再判断是否需要配图。
- 小配图应对应观点、卡片、关键词、机制或用户声音。
- 非封面/章节页的小配图通常占 slide 宽度的 18%-32%。
- 统一艺术方向，避免把无关装饰散落到页面上。
- 在 `content-ir.json` 的 `assets.spotIllustrations` 中记录用途、路径、风格、放置位置和尺寸限制。

## 前三页视觉试样

视觉重的 Deck 应先锁定前三页：

1. 生成封面和后两页的图片 brief。
2. 生成或收集主视觉和 2-4 个小配图。
3. 放入真实布局中检查。
4. 确认文字可读、图片不过大、风格统一。
5. 在 `content-ir.json` 的 `assets.firstThreeSlideTrial` 中记录结果。
6. 通过后再扩展全 Deck。

## 可编辑 Deck 契约

生成的 Deck 默认应可编辑：

- 文本不要烘焙进 Canvas、SVG path 或图片。
- `content-ir.json` 是可编辑源头。
- 重要文本和重复内容块使用 `data-editable`、`data-field` 或清晰语义选择器。
- 布局区域使用 `data-layout`、`data-role` 或 CSS custom properties。
- 默认可接入 `templates/runtime/edit-mode.js`。
- `E` 切换编辑模式，`S` 切换演讲者模式。
- 导出 PDF/PNG 时尽量导出当前编辑状态，但不破坏原 HTML 和 IR。

## 演讲者模式

严肃演讲 Deck 应包含：

- 当前页标题。
- 下一页标题。
- 演讲者备注。
- 计时器。

备注放在 `<aside class="notes">`，不应出现在观众视图中。

## 手势控制

手势控制是可选能力，不是硬依赖：

- feature flag：`off`、`motion-lite`、`mediapipe-hand`
- 默认 `off`
- `G` 切换手势模式
- 只有用户开启时才请求摄像头权限
- 视频帧应在浏览器本地处理，不上传
- 键盘和触摸导航必须始终可用

`电影质感` 模板包含 MediaPipe 手势依赖：

```html
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
```

复制该模板时不要移除手势栈，但必须保留键盘导航作为 fallback。

## 输入模式

### 短主题模式

当用户只给一句主题，例如“做一份 AI短剧出海风起时 PPT”，不要把它当作足够内容。应先推断受众和场景，必要时搜索当前资料，提炼论点、市场信号、矛盾、机会、风险和推荐结构，再生成 `content-ir.json`。

### 源材料模式

当用户提供文章、笔记、资料、表格或文档时，以用户材料为主，只在事实具有时效性或不稳定时进行核验。

### 已有 PPT / 模板模式

当用户提供 `.pptx`、HTML Deck、品牌规范或截图时，应明确保留级别：

- 模板保留美化：保留母版、品牌、顺序和核心布局，只优化层级、间距、图标、图表、备注和素材。
- 模板生产：抽取布局、字体、颜色、组件语法和安全区，生成新页面。
- HTML-first rebuild：无法原生编辑 PPT 时，以 PPT 为视觉参考重建 HTML Deck。
- Native `.pptx` 输出：如果有可用 PPT 工具，直接编辑或生成 PPTX 并渲染检查。

## 输出结构

默认输出为静态文件夹：

```text
deck-name/
  index.html
  styles.css
  deck.js
  content-ir.json
  assets/
    backgrounds/
    spot/
    decor/
```

Deck 应能通过本地 HTTP 服务运行，也可部署到静态托管环境。除非用户要求，不需要 bundler。

## 使用教程

这一节说明在不同情况下怎样调用鲸格PPT、准备材料、选择模板、生成交付物和做最终检查。

### 1. 只有一个主题，想自动生成 PPT

适合行业趋势、产品战略、市场机会、课程选题、技术分享、AI 工具报告等主题型任务。

示例提示词：

```text
用鲸格PPT做一份《AI短剧出海风起时》的演示文稿，面向内容创业团队和投资人。请自动补齐结构，必要时搜索最新市场信息，输出浏览器可运行的 HTML PPT。
```

处理流程：

1. 把主题转成研究 brief。
2. 判断受众、演讲场景、页数、语气和需要回答的问题。
3. 对具有时效性的事实进行搜索或核验。
4. 生成 `content-ir.json`，明确 thesis、audience、slide roles、assets 和 feature flags。
5. 从 `templates/full-decks/` 选择最接近的模板。
6. 选择主题和必要单页布局。
7. 输出 HTML Deck，并通过本地 HTTP 服务验证。

常用模板：

- 行业趋势：`market-research`、`ai-industry-report`
- 战略判断：`executive-strategy`
- 产品叙事：`product-launch`
- 创业展示：`startup-roadshow`、`pitch-deck`

### 2. 把文章、资料或长文本变成 PPT

适合公众号文章、行业报告、会议纪要、访谈、课程材料、产品文档。

示例提示词：

```text
用鲸格PPT把这篇文章改成 12 页演示稿。保留核心观点，页面结论先行，每页不要堆长段落，复杂解释放 speaker notes。
```

处理流程：

1. 抽取原文的主题、主张、证据、案例和结论。
2. 删除重复内容，保留可演示的观点链。
3. 将内容映射到 slide roles，例如 `cover -> context -> insight -> mechanism -> case -> roadmap -> closing`。
4. 可见页面只保留标题、关键短句、数字、图示和必要标签。
5. 细节、转场话术和解释放进 `<aside class="notes">`。
6. 原文事实优先；只有当前事实或不稳定事实才额外核验。

推荐模板：

- 通用报告：`weekly-report`
- 行业分析：`market-research`
- 技术文章：`technical-talk`
- 课程内容：`courseware`
- 社交传播：`xhs-9-card`

### 3. 根据表格、数据或指标做汇报

适合周报、经营复盘、KPI dashboard、竞品对比、市场规模、风险追踪。

示例提示词：

```text
用鲸格PPT把这些数据做成一份经营周报，重点突出异常、趋势、风险和下周动作。需要 dashboard、风险页和行动计划页。
```

处理流程：

1. 识别指标口径、时间范围和业务上下文。
2. 明确本次汇报要回答的问题。
3. 用结论型标题表达发现，而不是只写“数据分析”。
4. 使用 `kpi-dashboard`、`market-signal`、`comparison-2col`、`risk-board`、`roadmap-90-day` 等布局。
5. 图表服务结论，避免把所有数据塞进页面。
6. 指标口径、异常解释和补充数据放 speaker notes。

### 4. 美化已有 PPT 或按模板重建

适合已有 PPT 层级混乱、视觉陈旧、想保留模板优化，或想重建成 HTML Deck。

示例提示词：

```text
用鲸格PPT美化这个 PPT。保留原来的品牌色、logo、页面顺序和核心布局，只优化层级、排版、图标、图表和演讲者备注。
```

也可以说：

```text
参考这个 PPT 的内容，用鲸格PPT重建成浏览器原生 HTML Deck。可以重新设计视觉风格，但不要改变核心观点。
```

处理流程：

1. 先确认 preservation level：
   - 保留模板，只优化细节。
   - 保留内容，重建视觉。
   - 保留品牌，允许重排结构。
   - 完全重做成新 Deck。
2. 如果可原生编辑 `.pptx`，优先编辑 PPTX 并渲染检查。
3. 如果不能原生编辑，就做 HTML-first rebuild。
4. 不要擅自修改 logo、品牌色、页序、法务页和核心结论。
5. 交付时说明是“原生 PPT 编辑”还是“HTML 重建版”。

### 5. 根据品牌规范、截图或模板生产新 Deck

适合企业模板、品牌发布、客户提案、统一视觉体系。

示例提示词：

```text
用鲸格PPT根据这个品牌规范做一份产品发布 Deck。保持品牌色、字体气质和组件风格，生成 HTML PPT。
```

处理流程：

1. 提取品牌色、字体、间距、圆角、卡片、按钮、图表和安全区。
2. 选择最接近的内置主题作为底座。
3. 必要时创建项目级主题 CSS。
4. 在 `content-ir.json` 中记录 theme、tone、visual rules 和 asset plan。
5. 生成后检查每页是否符合品牌语法。

### 6. 需要图文并茂或强视觉风格

适合电影质感、品牌故事、绘本风、产品视觉、文化叙事、海报感 Deck。

示例提示词：

```text
用鲸格PPT做一版电影质感 PPT。自动使用当前可用的图片生成能力，不要用 SVG 冒充插图。先做前三页视觉试样，确认风格后再扩展全稿。
```

处理流程：

1. 在 `content-ir.json` 中设置 `assets.imageGeneration.assetStrategy`：
   - `cinematic-images`
   - `png-components`
   - `code-native-graphics`
   - `upload-slots`
   - `hybrid`
2. 先写图片 brief，再生成或收集图片。
3. 图片保存到 Deck 输出目录：

```text
assets/
  backgrounds/
  spot/
  decor/
```

4. 封面和章节页可用主视觉；正文页优先用小场景、小道具、小组件配合观点。
5. 前三页试样必须检查文字可读、图片尺寸和风格一致性。
6. 如果没有可靠图片生成与检查能力，设置 `imageCapabilityMode: "upload-slots"`，输出 `image-prompts.json`，并留下标明比例和构图方向的空白上传位。

### 7. 商务汇报、战略报告或投资人材料

示例提示词：

```text
用鲸格PPT做一份面向管理层的战略汇报。风格克制、数据优先、结论先行。每页只讲一个判断，复杂解释放备注。需要封面、核心判断、市场背景、战略选项、路线图、风险和决策页。
```

推荐模板和主题：

- `executive-strategy`
- `pitch-deck`
- `sales-proposal`
- `weekly-report`
- `executive-clean`
- `apple-bento-glass`

注意事项：

- 少用装饰，多用结构和证据。
- 标题写结论，不写泛泛标签。
- 关键数字标注口径或来源。
- 风险页要有 mitigation，不只列问题。

### 8. 技术分享或架构演讲

示例提示词：

```text
用鲸格PPT做一份技术分享 Deck，主题是 AI Agent 工作流架构。需要 agenda、背景、架构图、关键流程、代码片段、benchmark、经验教训和 Q&A。
```

推荐模板和布局：

- `technical-talk`
- `semantic-dark`
- `agenda`
- `architecture`
- `code`
- `timeline`
- `qa`

注意事项：

- 图解优先于长段落。
- 架构图要有输入、处理、输出和边界。
- 代码页只展示关键片段，解释放备注。
- Canvas FX 只能做轻量背景，不要干扰阅读。

### 9. 小红书九宫格或社交传播图文

示例提示词：

```text
用鲸格PPT做一组小红书 9 卡图文，主题是新手如何用 AI 做 PPT。要有强 hook、痛点、方法、案例、清单和 CTA。风格 editorial，适合手机阅读。
```

推荐模板和主题：

- `xhs-9-card`
- `xhs-editorial`

注意事项：

- 第一页必须有 hook。
- 每页只讲一个点。
- 字号和留白适合手机浏览。
- CTA 页要明确下一步动作。

### 10. 课程、培训或工作坊

示例提示词：

```text
用鲸格PPT做一份 45 分钟培训课件，主题是提示词工程入门。需要学习目标、核心概念、例子、练习、总结和 Q&A。风格清晰，不要太营销。
```

推荐模板：

- `courseware`
- `training-workshop`
- `warm-paper`

注意事项：

- 每个章节给学习目标。
- 概念页之后安排例子或练习。
- 练习页给任务、时间和输出格式。
- 讲师提示放 speaker notes。

### 11. 使用特殊风格模板

当用户明确要求强风格，优先使用对应完整 Deck：

- 北欧儿童绘本风：`templates/full-decks/nordic-childrens-picture-book/`
- 电影质感：`templates/full-decks/电影质感/`
- 碎纸片：`templates/full-decks/碎纸片/`
- 赛博朋克：`templates/full-decks/赛博朋克/`

示例提示词：

```text
用鲸格PPT的赛博朋克模板做一份《2098 年人类生活方式》PPT。保留 neon-noir city 的透明组件、霓虹色和未来城市氛围，但内容要清晰，不要只做氛围图。
```

注意事项：

- 特殊风格模板通常带本地 `assets/`，复制时不要漏掉。
- 强视觉风格也要服务观点，不能只做装饰。
- 电影质感和赛博朋克模板体积较大，做 20MB 轻量包时通常走远程引用或按需下载。

### 12. 需要导出 PDF、图片或 Typst handout

示例提示词：

```text
用鲸格PPT生成 HTML Deck，并额外导出 PDF 讲义版本。HTML 保留动画，PDF 适合打印阅读。
```

处理流程：

1. HTML Deck 是主运行时，负责动画、导航、编辑和手势。
2. PDF/PNG 是静态导出物，要单独检查分页、字体、图片和图表。
3. Typst 适合 handout、讲义、打印页，不适合承载 HTML 动画和手势。
4. 导出前确认是否要纳入当前编辑状态。

### 13. 需要可编辑 HTML Deck

示例提示词：

```text
用鲸格PPT生成可编辑 HTML PPT。页面文字要能直接改，保留 content-ir.json，按 E 可以进入编辑模式。
```

处理流程：

1. 保留真实文本节点。
2. 给可编辑内容加 `data-editable` 或 `data-field`。
3. 接入 `templates/runtime/edit-mode.js`。
4. 重要布局参数使用 CSS variables。
5. 编辑状态可存入 `localStorage`，并提供 JSON 导出。

### 14. 需要手势翻页

示例提示词：

```text
用鲸格PPT生成一个支持手势翻页的演示。默认不要打开摄像头，用户按 G 后再启用手势，键盘翻页必须保留。
```

处理流程：

1. 在 `content-ir.json` 中设置 `features.gesture`。
2. 默认 `off`，除非用户明确要求。
3. 使用 `templates/features/gesture-controller.js`。
4. 摄像头权限只在用户按 `G` 或开启手势时请求。
5. 保留键盘和触摸 fallback。

### 15. 生成轻量版或平台导入版

适合目标平台限制上传 20MB，不能导入完整版。

示例提示词：

```text
根据鲸格PPT完整版生成一个 20MB 以内的轻量版 skill。保留 SKILL.md、schema、content IR、主题、布局、runtime、animations、exporters 和常用 deck；电影质感和赛博朋克走远程按需下载。
```

处理流程：

1. 保留核心文本和小组件。
2. 排除单独过大的 deck 目录。
3. 在 README 中写清哪些模板被排除。
4. 在 `references/remote-assets.md` 中配置 verified GitHub URL。
5. 压缩后检查 zip 根目录是否直接包含 `SKILL.md`。

## 常用提示词模板

### 通用生成

```text
用鲸格PPT做一份《主题》的 12 页演示文稿，面向【受众】，用于【场景】。请先生成 content-ir.json，再选择合适的 full deck、theme 和 single-page layouts，最后输出可运行的 HTML Deck。
```

### 资料转 PPT

```text
用鲸格PPT把以下资料整理成 PPT。要求结论先行，每页一个观点，保留关键数字和案例，复杂解释放 speaker notes。输出 index.html、styles.css、deck.js、content-ir.json。
```

### 图文并茂

```text
用鲸格PPT做图文并茂版本。先判断 imageCapabilityMode，再选择 cinematic-images、png-components、code-native-graphics、upload-slots 或 hybrid。有可靠图像能力时先做前三页视觉试样并把图片保存到 assets/；没有时完成文字与排版并留空白上传位，不要引用远程热链。
```

### PPT 美化

```text
用鲸格PPT美化这个 PPT。保留原模板、品牌色、logo、页序和核心布局，只优化排版层级、图表可读性、图标/图片、备注和导出质量。
```

### 技术分享

```text
用鲸格PPT做技术分享 Deck。需要 agenda、背景、架构图、流程图、代码页、benchmark、经验教训、Q&A。风格 semantic-dark，页面要适合投屏阅读。
```

### 小红书九宫格

```text
用鲸格PPT做小红书 9 卡图文。第一页强 hook，中间讲痛点、方法、案例、清单，最后 CTA。手机阅读优先，文字短，视觉统一。
```

### 电影质感

```text
用鲸格PPT做电影质感 Deck。优先使用 templates/full-decks/电影质感/，生成或收集统一风格的主视觉和小配图。不要用 SVG 冒充插图，先做前三页试样。
```

## 使用时的交付标准

无论是哪种场景，最终交付都应尽量包含：

```text
deck-name/
  index.html
  styles.css
  deck.js
  content-ir.json
  assets/
```

如果无法可靠生成并检查图片，应保留标注尺寸和构图意图的空白上传位，并可额外输出：

```text
image-prompts.json
```

如果需要导出，应按需增加：

```text
exports/
  deck.pdf
  slides/
  handout.typ
```

交付说明应简短写明：

- 使用的 full deck 模板。
- 使用的主题。
- 是否启用图片生成、演讲者模式、编辑模式、手势控制。
- 如何本地预览。
- 已完成哪些验证。

## 常见问题

### 为什么不能直接从空白 CSS 开始写？

鲸格PPT 的设计目标是复用稳定模板和组件。先选模板能保证页面节奏、交互、备注、动画和响应式基础一致，也能减少不必要的工程化。

### 为什么要先写 content-ir.json？

`content-ir.json` 是 Deck 的源头。它让内容结构、视觉资产、备注、功能开关和导出路径可追踪，也方便后续修改和二次渲染。

### 用户只给主题时能不能直接做？

可以，但应先补齐受众、场景、论点和结构。涉及当前市场、政策、产品、价格或平台规则时，需要搜索或核验，不应凭空编造具体事实。

### 没有图片生成能力怎么办？

把 `imageCapabilityMode` 设为 `upload-slots`。完成文字、信息结构、图表和格式排版；摄影、电影静帧、插图、产品图及复杂位图位置保持为空，并标注上传尺寸、比例和构图方向。不要用低质量生成图、SVG/CSS/Canvas 假照片或抽象几何冒充完成图片。可以输出 `image-prompts.json` 供用户到其他工具生成。代码绘制只保留给真正的图表、图标、流程图和结构框架。

### 什么时候使用完整 Deck，什么时候使用单页布局？

主线场景先用完整 Deck。只有当某一页需要特殊结构时，再从 `single-page-layouts/` 补页面。

### 什么时候需要本地 HTTP 服务？

只要 Deck 使用模块化 JS、Canvas FX、某些浏览器权限、图片路径或演讲者模式，都应通过本地 HTTP 服务预览，而不是只双击 `index.html`。

## 验证清单

交付前建议检查：

- `node --check deck.js`
- 通过本地 HTTP 服务打开，而不是只双击文件。
- 测试上一页/下一页导航。
- 测试 `S` 演讲者模式。
- 测试移动端或窄视口，确认文字不溢出。
- 控制台无错误。
- `content-ir.json` 中引用的图片真实存在。
- 图文 Deck 的 `assets/backgrounds/`、`assets/spot/` 或 `assets/decor/` 符合 IR 记录。
- 前三页视觉试样通过可读性、尺寸和风格一致性检查。
- 小配图不超过声明的 `maxSlideWidth`，除非是封面或章节页。
- SVG 只用于图表、图标、线框、模板框架或明确 fallback。
- 开启手势时，摄像头权限只在用户切换后请求。
- 如需 Typst/PDF，单独生成并检查导出结果。

## 特殊风格约束

### 北欧儿童绘本风

- 优先使用 `templates/full-decks/nordic-childrens-picture-book/`。
- 需要厚黑手绘线、薄荷绿、芥末黄、奶油纸、珊瑚、天蓝、淡紫等色彩。
- 不使用 3D 字、挤压字、厚重阴影或写实渐变。
- 文本与插图要分区，避免重叠。
- 有可靠图像能力时生成或使用手绘背景/小插图；没有时保留标明尺寸与主题的插图上传位，不用 CSS doodle 冒充成品插图。

### 电影质感

- 优先使用 `templates/full-decks/电影质感/`。
- 适合历史人物、国风文化、电影海报感、戏剧性故事。
- 需要统一镜头语言、光照、服化道、颗粒感和色彩温度。
- 封面/章节页可用 full-bleed 主视觉，正文页更适合小场景、道具、纹理、路线标记或象征物。
- `generate` 模式生成并检查本地静帧；`user-supplied` 模式使用用户图片；`upload-slots` 模式只完成文字与版式并留空白图片位，不制作低质量假电影图。

### 碎纸片

- 优先使用 `templates/full-decks/碎纸片/`。
- 适合纸片拼贴、paper craft lab、AI 游戏生产线、创意技术流程。
- 保留透明纸片资产、深色工程板、奶油纸卡、橙色高亮和模块化流程块。

### 赛博朋克

- 优先使用 `templates/full-decks/赛博朋克/`。
- 搭配 `templates/themes/neon-noir-city.css`。
- 适合未来城市、AI 未来生活、2098 叙事、霓虹 noir。
- 保留 `assets/components/` 和 `assets/template-frames/`。

## 完整版与 轻量版的关系

完整版包含全部模板和重素材，当前 `templates/full-decks/` 是体积主体。若目标平台限制导入 20MB，应从完整版派生轻量版：

- 保留 `SKILL.md`、schema、content IR、主题、单页布局、runtime、animations、features、exporters 和部分 Deck。
- 排除单独过大的重素材目录，例如 `电影质感`、`赛博朋克`。
- 在轻量版中通过 verified GitHub URL 或用户提供路径按需下载重素材。

完整版适合本地开发和作为上游；轻量版适合受上传限制的平台导入。



