# AUDIT LOG（补录）

> 本文件根据当前对话历史补录，非 Git 提交自动生成日志。
> 补录时间：2026-04-14（Asia/Shanghai）

## 1. 记录范围与说明

- 范围：个人主页项目从初始化复刻到当前版本的主要需求变更、功能调整、问题修复。
- 依据：用户与助手的连续对话需求。
- 说明：部分步骤发生了“尝试 -> 回退 -> 再调整”，已在日志中标注。

## 2. 迭代审计记录（按对话顺序）

### [A-001] 初始复刻方案落地
- 目标：复刻参考站的信息架构与交互节奏，不复制受版权保护素材。
- 结果：建立纯静态结构 `index.html + assets/css/styles.css + assets/js/content.js + assets/js/main.js`。
- 架构：内容数据与样式/渲染逻辑分离，后续优先改 `content.js` 进行信息替换。

### [A-002] 双语内容对齐与纠错
- 目标：补全只改中文未改英文的字段并检查错误。
- 结果：完成中英文字段对齐，修正部分文案/数据不一致问题。

### [A-003] 删除三块模块
- 变更：删除 `Teaching`、`Students`、`Professional Activities` 三个 section。
- 结果：对应导航与页面结构同步精简。

### [A-004] 教育经历补充院校标签
- 变更：在教育经历中补充 `211`、`双一流` 等信息。
- 结果：教育时间线内容更新，双语结构保留。

### [A-005] 个人信息修订
- 变更：硕士研究主题改为“两方安全计算与高性能实现”；英文名固定为 `Long Dio`。
- 结果：相关字段更新并沿用。

### [A-006] 论文列表重建
- 变更：删除 Selected Publications 占位论文，新增 1 篇期刊条目。
- 条目：题目《一种王者荣耀拆塔速推流的可行性分析与实现》；Tecent Games 2025；关键词 Honor of Kings；作者 Long Dio。
- 结果：论文列表按新数据展示。

### [A-007] 字体策略调整
- 变更：中文默认宋体系；英文字体保持原样不改。
- 结果：实现“中文与英文字体分离策略”。

### [A-008] 主题切换上线
- 变更：新增浅色/深色主题切换。
- 后续调整：曾短暂扩展多套配色，最终回退为仅两套主题。
- 最终基线：浅色（当前浅色 + 极简灰）/ 深色（当前深色 + 学术蓝）。

### [A-009] 社交与联系方式重构
- 变更：`LinkedIn / X` 改为 `Bilibili / 抖音 / Zhihu`，后续再删除抖音。
- 变更：Contact 区 LinkedIn 改为 Bilibili。
- 链接：Bilibili = `https://space.bilibili.com/57490945`；Zhihu = `https://www.zhihu.com/people/ldio-79`。

### [A-010] 顶部进度条平滑性修复
- 问题：滚动进度条视觉不连续、接近瞬时跳变。
- 结果：优化更新机制，使进度变化更平滑连贯。

### [A-011] 点击颗粒特效上线与调参
- 变更：点击出现闪烁颗粒，随机方向与初速度，抛物线运动。
- 调整：触发时机改为“按下即触发，松开不触发”；提高速度；增强浅色主题可见度。

### [A-012] 导航入口精简
- 变更：删除右侧 `Publications` 独立入口按钮（保留页面 section 导航结构）。

### [A-013] 首屏沉浸式阅读流改造
- 变更：首屏固定展示 Hero，不提前露出 About 区；用户下滑后才进入后续 section。
- 交互：增加底部下箭头提示，并支持点击平滑滚动到 About。
- 调整：箭头增加上下轻动动画；去除点击后外圈蓝色焦点样式。

### [A-014] 语言默认与提示交互
- 变更：首次进入默认英文。
- 交互：语言切换按钮增加入场提示动画（缓慢闪烁/轻微缩放）引导中文用户。

### [A-015] Location 地址与地图接入（多轮）
- 地址：更新为“广州暨南大学番禺校区知识产权楼904”。
- 地图接入路线：Google -> AMap ->（登录遮挡问题）->“站内免登录 + 外链打开”讨论 -> 再调优。
- 精度与展示：多轮调整定位、初始范围、边缘裁切、遮挡杂项元素控制。

### [A-016] 地图方案切换到百度并持续裁切优化
- 变更：切换百度地图嵌入；扩大初始范围后再按视觉需求收紧。
- 调整：桌面端/移动端 `map-embed-crop` 参数多轮校准，隐藏边缘杂项 UI。
- 问题：出现过乱码/偏移/弹层等体验问题，期间有回退与再调参。

### [A-017] 页面白屏与资源异常排查
- 现象：页面空白、`Content unavailable. Resource was not cached`、控制台报错。
- 关键错误：`mapState is not defined`（已修复）。
- 结果：恢复正常渲染，并通过脚本语法检查。

### [A-018] 自动跳转到 Location 的缺陷修复（进行中后收敛）
- 现象：切换语言时页面被拉到地图附近。
- 修复方向：
  - 首屏滚动守卫与 hash 清理；
  - 切换时保存/恢复滚动位置；
  - 为语言切换与地址切换增加重渲染期滚动锁；
  - 地图 iframe 加载后再次回正滚动；
  - 焦点恢复使用 `preventScroll` 兜底。
- 当前状态：已提交修复版本并更新脚本版本参数，待用户前端强刷复测。

### [A-019] 本轮基础排错与稳定性修复
- 目标：对当前代码做一次通用 BUG 巡检并修复可确认问题。
- 修复：
  - 修复 Publications 统计标签中文界面仍显示英文的问题（`Refereed/Manuscripts` 分支文案写错）。
  - 修复地图交互模式下 Leaflet 首次加载失败后无法重试的问题（为脚本增加 `data-state` 状态并在失败/陈旧脚本场景下重建）。
  - 修复地址默认语言与站点默认语言不一致的问题（初始化时统一使用 `i18n.defaultLang`）。
- 影响文件：`assets/js/main.js`。
- 验证：通过 `node --check assets/js/main.js` 与 `node --check assets/js/content.js` 语法检查。
- 环境备注：`pnpm` 在当前环境不可用，`pnpm lint`/`pnpm build` 无法执行。

### [A-020] 地址默认语言策略修正
- 背景：用户明确要求地址默认语言固定为英文。
- 调整：将 `locationLang` 初始化从“跟随站点默认语言”改回固定 `en`。
- 影响文件：`assets/js/main.js`。
- 结果：页面初次渲染时地址默认展示英文，站点主语言切换逻辑保持不变。

### [A-021] 语言切换时地图区瞬时闪动修复
- 现象：当地址语言为中文时，点击页面语言切换会短暂跳到地图附近再回原位，造成闪动。
- 原因：语言切换触发 `renderAll()`，`renderLocation()` 会重建地图 iframe；中文地址对应地图源重载时出现一次滚动抢占，原有滚动锁随后再拉回原位。
- 修复：
  - 在 `renderLocation()` 中复用同 `src` 的现有 `.map-embed-crop` 节点，避免不必要的 iframe 重建与重载。
  - 为地图 `load` 监听增加一次性绑定标记，避免重复绑定。
  - 更新 `index.html` 的 `main.js` 版本参数以规避浏览器缓存。
- 影响文件：`assets/js/main.js`、`index.html`。
- 验证：脚本语法检查通过，待浏览器交互复测确认观感。

### [A-022] 地图闪动二次收敛（原地增量更新）
- 背景：`A-021` 后仍存在“瞬时跳到地图再回位”的体感。
- 调整：
  - 将 `renderLocation()` 改为“同源地图场景原地增量更新”，仅更新标题/副标题、地址文本、按钮文案与地图辅助属性，不再重置 `refs.location.innerHTML`。
  - 抽离并复用地址切换绑定与地图 `load` 守卫绑定函数，避免重复监听。
  - 更新脚本版本参数为 `v=20260414c`，确保前端加载最新脚本。
- 影响文件：`assets/js/main.js`、`index.html`。
- 预期效果：页面语言切换时，若地图 `src` 未变化，不发生 iframe 重建，从根源消除该跳闪。

### [A-023] 语言切换后短时不可滚动与回拉修复
- 现象：地址中文状态下点击页面语言切换后，约 1 秒以上无法正常滚动，尝试滚动会被拉回原位置。
- 原因：
  - 语言切换启用了较长滚动锁（`lockDuration: 3200`）；
  - 停止滚动锁的用户交互监听使用了 `once: true`，首次触发后不再生效。
- 修复：
  - 将 `wheel/touchstart/keydown` 的交互监听改为持续生效，确保后续每次交互都可立即解除滚动锁。
  - 将语言切换与地址切换的滚动锁时长从 `3200ms` 下调为 `1200ms`。
  - 更新脚本版本参数为 `v=20260414d`。
- 影响文件：`assets/js/main.js`、`index.html`。
- 预期效果：语言切换后不会再出现明显“滚不动 + 拉回”的体验。

### [A-024] Publications 类型调整与论文 PDF 产出
- 目标：将首页 Selected Publications 两条记录统一为手稿，并为《基于三烟位的莲华古城转点策略》提供可点击 PDF 链接。
- 调整：
  - 两条 publication 的 `type` 统一改为 `manuscript`。
  - 第一条 publication 的链接由占位 DOI 改为站内 PDF 链接：`assets/files/lotus-triple-smoke-manuscript.pdf`。
  - 新增英文 PDF 文档（学术写作风格、娱乐向策略内容）：`assets/files/lotus-triple-smoke-manuscript.pdf`。
  - 更新 `content.js` 版本参数为 `v=20260414h` 以规避缓存。
- 影响文件：`assets/js/content.js`、`assets/files/lotus-triple-smoke-manuscript.pdf`、`index.html`。

### [A-025] 论文格式升级（Asiacrypt/LNCS 风格）与中英双版本
- 目标：将《基于三烟位的莲华古城转点策略》升级为更规范的学术排版，并提供中英文两个 PDF 版本。
- 调整：
  - 新增 LNCS 风格英文 LaTeX 源文件并编译：`assets/files/lotus-triple-smoke-asiacrypt-en.tex` -> `assets/files/lotus-triple-smoke-asiacrypt-en.pdf`。
  - 新增 LNCS 风格中文 LaTeX 源文件并编译：`assets/files/lotus-triple-smoke-asiacrypt-zh.tex` -> `assets/files/lotus-triple-smoke-asiacrypt-zh.pdf`。
  - 更新第一篇 publication 链接为 `PDF (EN)` 与 `PDF (中文)` 两个入口。
  - 更新 `content.js` 版本参数为 `v=20260414i` 以规避缓存。
- 编译命令：
  - `pdflatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/lotus-triple-smoke-asiacrypt-en.tex`
  - `xelatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/lotus-triple-smoke-asiacrypt-zh.tex`
- 影响文件：`assets/js/content.js`、`assets/files/lotus-triple-smoke-asiacrypt-en.tex`、`assets/files/lotus-triple-smoke-asiacrypt-zh.tex`、`assets/files/lotus-triple-smoke-asiacrypt-en.pdf`、`assets/files/lotus-triple-smoke-asiacrypt-zh.pdf`、`index.html`。

### [A-026] 论文内容二次修订（中英同步）
- 目标：按用户反馈完善中英文论文内容质量与可读性。
- 调整：
  - 中文作者名由“李继明”改为“李基铭”，并同步修正中文参考文献作者名。
  - 删除摘要中“写作格式参考密码学会议论文风格”对应表述（中英文）。
  - 扩展 `HOLD/PIVOT/CUT/FREEZE` 四个口令的详细触发条件与动作策略，新增口令语义表格（中英文）。
  - 补全“算法化决策视角 / Algorithmic View”章节：增加评分函数、决策逻辑说明与完整算法流程（中英文）。
  - 新增两幅策略图（状态迁移图、分层落烟时序图）并在实验章节引用（中英文）。
  - 重新编译中英文 PDF 为 4 页版本。
  - 为 PDF 链接增加版本参数 `v=20260414k`，并将 `content.js` 版本参数更新为 `v=20260414j`。
- 编译命令：
  - `pdflatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/lotus-triple-smoke-asiacrypt-en.tex`
  - `xelatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/lotus-triple-smoke-asiacrypt-zh.tex`
- 影响文件：`assets/files/lotus-triple-smoke-asiacrypt-en.tex`、`assets/files/lotus-triple-smoke-asiacrypt-zh.tex`、`assets/files/lotus-triple-smoke-asiacrypt-en.pdf`、`assets/files/lotus-triple-smoke-asiacrypt-zh.pdf`、`assets/js/content.js`、`index.html`。

### [A-027] 术语笔误更正（莲花 -> 莲华）
- 背景：用户确认“莲花古城”为笔误，统一修正为“莲华古城”。
- 调整：
  - 更新首页 publication 中文标题用词。
  - 更新中文论文源文件中的标题、关键词、正文、算法标题与结论表述。
  - 更新审计日志中对应条目的标题描述。
- 影响文件：`assets/js/content.js`、`assets/files/lotus-triple-smoke-asiacrypt-zh.tex`、`AUDIT_LOG.md`。

### [A-028] 第二篇论文按同规格重写（Asiacrypt/LNCS，中英双版）
- 目标：将《一种王者荣耀拆塔速推流的可行性分析与实现》按与第一篇一致的规范重写并提供中英文双 PDF。
- 调整：
  - 新增英文论文源：`assets/files/hok-fast-push-asiacrypt-en.tex`（LNCS 结构、图表、口令语义表、完整算法章节）。
  - 新增中文论文源：`assets/files/hok-fast-push-asiacrypt-zh.tex`（LNCS 结构、图表、口令语义表、完整算法章节）。
  - 编译生成：`assets/files/hok-fast-push-asiacrypt-en.pdf`、`assets/files/hok-fast-push-asiacrypt-zh.pdf`（均为 4 页）。
  - 将第二篇 publication 链接从占位 DOI 改为 `PDF (EN)` 与 `PDF (中文)`。
  - 为第二篇 PDF 链接增加版本参数 `v=20260414a`，并将 `content.js` 版本更新为 `v=20260414m`。
- 编译命令：
  - `pdflatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/hok-fast-push-asiacrypt-en.tex`
  - `xelatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/hok-fast-push-asiacrypt-zh.tex`
- 影响文件：`assets/files/hok-fast-push-asiacrypt-en.tex`、`assets/files/hok-fast-push-asiacrypt-zh.tex`、`assets/files/hok-fast-push-asiacrypt-en.pdf`、`assets/files/hok-fast-push-asiacrypt-zh.pdf`、`assets/js/content.js`、`index.html`、`AUDIT_LOG.md`。

### [A-029] 第二篇论文差异化重构与缓存更新
- 背景：用户反馈第二篇与第一篇“风格与结构过于相似”，要求“同规范，不仿写”。
- 调整：
  - 将第二篇英文论文重构为“事件驱动调度 + 节奏积分账本 + 分路有限状态机”框架，替换原有章节逻辑与命令体系。
  - 将第二篇中文论文同步重构为同一新框架，保持中英文内容对应但不复用第一篇叙事。
  - 口令体系改为 `STACK/DRAG/MELT/SCREEN/RESET`，并重写触发条件、动作语义、算法流程与图示。
  - 重新编译第二篇中英文 PDF。
  - 更新第二篇 PDF 链接版本参数为 `v=20260414b`，并将 `content.js` 版本更新为 `v=20260414n`，规避浏览器旧缓存。
- 编译命令：
  - `pdflatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/hok-fast-push-asiacrypt-en.tex`
  - `xelatex -interaction=nonstopmode -halt-on-error -output-directory=assets/files assets/files/hok-fast-push-asiacrypt-zh.tex`
- 影响文件：`assets/files/hok-fast-push-asiacrypt-en.tex`、`assets/files/hok-fast-push-asiacrypt-zh.tex`、`assets/files/hok-fast-push-asiacrypt-en.pdf`、`assets/files/hok-fast-push-asiacrypt-zh.pdf`、`assets/js/content.js`、`index.html`、`AUDIT_LOG.md`。

### [A-030] 教育经历新增学校校徽展示
- 目标：在教育经历中的“暨南大学”和“西南大学”条目增加对应校徽展示。
- 调整：
  - 在教育数据项新增 `emblem` 和 `emblemAlt` 字段，分别绑定两所学校的本地徽章资源。
  - 扩展 `renderEducation()`，在时间线标题前渲染校徽图片并保留无图兼容。
  - 新增校徽样式（含移动端尺寸与深色主题边框适配）。
  - 新增两张站内 SVG 徽章资源：`jnu-emblem.svg`、`swu-emblem.svg`（均为项目内原创示意素材）。
  - 更新图片版权说明 `assets/images/CREDITS.md`。
  - 更新 `index.html` 中 `styles.css`、`content.js`、`main.js` 的版本参数至 `v=20260415a`，规避缓存导致的旧界面。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/content.js`、`assets/js/main.js`、`assets/css/styles.css`、`assets/images/jnu-emblem.svg`、`assets/images/swu-emblem.svg`、`assets/images/CREDITS.md`、`index.html`、`AUDIT_LOG.md`。

### [A-031] 校徽可见性增强与缓存二次刷新
- 背景：用户反馈“未看到校徽”。
- 调整：
  - 将教育区校徽图片从懒加载改为即时加载（`loading="eager"`）。
  - 放大校徽尺寸并增强边框/阴影，提高视觉识别度。
  - 将 `styles.css`、`content.js`、`main.js` 版本参数统一升级为 `v=20260415b`，进一步规避旧缓存。
- 验证命令：
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/main.js`、`assets/css/styles.css`、`index.html`、`AUDIT_LOG.md`。

### [A-032] 学校校徽切换为官网官方来源
- 背景：用户明确要求使用官方校徽，而非占位示意图。
- 调整：
  - 从暨南大学官网页面下载官方标识图，生成 `jnu-emblem-official.png`，并裁切出校徽主体 `jnu-emblem-official-crop.png`。
  - 从西南大学官网页面下载官方视觉识别图，生成 `swu-emblem-official.png`，并裁切出校徽主体 `swu-emblem-official-crop.png`。
  - 教育模块中的两所学校 `emblem` 引用切换为上述官方裁切版图片，并更新 `emblemAlt` 文案。
  - 在 `assets/images/CREDITS.md` 增加来源 URL、裁切说明与权利提示。
  - 更新 `content.js` 版本参数为 `v=20260415c`，避免缓存导致仍显示旧占位图。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/content.js`、`assets/images/jnu-emblem-official.png`、`assets/images/jnu-emblem-official-crop.png`、`assets/images/swu-emblem-official.png`、`assets/images/swu-emblem-official-crop.png`、`assets/images/CREDITS.md`、`index.html`、`AUDIT_LOG.md`。

### [A-033] 深色模式下校徽颜色保持不变
- 背景：用户反馈开启深色模式后校徽出现“变色”观感。
- 原因：深色主题为 `.school-emblem` 额外设置了深色背景，导致透明区域与浅色模式显示效果不一致。
- 调整：
  - 将深色主题下 `.school-emblem` 的背景改为白色、边框与浅色主题一致。
  - 为 `.school-emblem` 显式设置 `filter: none !important`，避免主题滤镜影响。
  - 更新 `styles.css` 版本参数为 `v=20260415c`，规避缓存。
- 影响文件：`assets/css/styles.css`、`index.html`、`AUDIT_LOG.md`。

### [A-034] 125% 缩放下西南大学校徽发糊修复
- 背景：用户反馈页面缩放到 125% 时西南大学校徽变糊，110% 与 150% 相对正常。
- 原因：位图在特定缩放倍率下触发浏览器重采样，叠加 `rem` 小数尺寸导致渲染落点不稳定，出现模糊观感。
- 调整：
  - 将 `.school-emblem` 从 `rem` 改为固定像素尺寸（桌面 `40px`、移动端 `36px`），减少缩放过程中的尺寸抖动。
  - 将 `object-fit` 调整为 `contain`，避免裁切重采样造成边缘发虚。
  - 为校徽增加 `image-rendering` 提示与 `translateZ(0)` / `backface-visibility`，降低特定缩放倍率下的模糊概率。
  - 更新 `styles.css` 版本参数为 `v=20260415d`，规避缓存。
- 影响文件：`assets/css/styles.css`、`index.html`、`AUDIT_LOG.md`。

### [A-035] 学校校徽改为 SVG 矢量资源
- 背景：用户反馈位图校徽在特定浏览器缩放倍率（如 125%）出现发糊，要求改为矢量图。
- 调整：
  - 暨南大学：从官网获取官方 `logo2.svg`，并生成仅保留校徽主体的 `jnu-emblem-official-mark.svg`。
  - 西南大学：从官网附件下载官方 `校徽.ai`（PDF 兼容矢量），导出为 `swu-emblem-official.svg`。
  - 教育模块 `emblem` 引用切换为上述两个 SVG 矢量文件。
  - 移除 `.school-emblem` 中针对位图的渲染 hack（`image-rendering`、`translateZ(0)`、`backface-visibility`）。
  - 更新 `styles.css` 与 `content.js` 版本参数为 `v=20260415e`，规避缓存。
  - 在 `assets/images/CREDITS.md` 补充新增矢量文件来源与导出说明。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/content.js`、`assets/css/styles.css`、`assets/images/jnu-emblem-official.svg`、`assets/images/jnu-emblem-official-mark.svg`、`assets/images/swu-emblem-official.zip`、`assets/images/swu-emblem-official-zip/校徽/校徽.ai`、`assets/images/swu-emblem-official.svg`、`assets/images/CREDITS.md`、`index.html`、`AUDIT_LOG.md`。

### [A-036] 教育经历校徽移至右下角并放大
- 背景：用户要求将两所学校校徽从标题左侧移动到教育卡片右下角，并适当放大以提升清晰度。
- 调整：
  - `renderEducation()` 中校徽渲染位置从 `.timeline-school` 标题行前移至 `timeline-item` 末尾。
  - `timeline-item` 增加底部留白，避免右下角校徽遮挡正文列表。
  - `.school-emblem` 改为绝对定位到卡片右下角，并将尺寸从 `40px` 提升到 `58px`（移动端 `52px`）。
  - 更新 `index.html` 中 `styles.css` 与 `main.js` 版本参数为 `v=20260415f`，规避缓存。
- 验证命令：
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/main.js`、`assets/css/styles.css`、`index.html`、`AUDIT_LOG.md`。

### [A-037] 教育经历校徽位置与尺寸回退
- 背景：用户要求撤销上一版“右下角放大”布局，恢复原展示方式。
- 调整：
  - `renderEducation()` 将校徽渲染位置恢复到学校标题左侧（`.timeline-school` 内）。
  - `.timeline-item` 底部留白恢复为原值，移除为右下角校徽预留的额外空间。
  - `.school-emblem` 恢复原尺寸（桌面 `40px`、移动端 `36px`），并取消右下角绝对定位。
  - 更新 `index.html` 中 `styles.css` 与 `main.js` 版本参数为 `v=20260415g`，规避缓存。
- 验证命令：
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/main.js`、`assets/css/styles.css`、`index.html`、`AUDIT_LOG.md`。

### [A-038] 教育经历校徽资源切换为官方 crop 位图
- 背景：用户要求将教育模块校徽图分别切换为 `swu-emblem-official-crop.png` 与 `jnu-emblem-official-crop.png`。
- 调整：
  - 将暨南大学 `emblem` 路径由 `jnu-emblem-official-mark.svg` 改为 `jnu-emblem-official-crop.png`。
  - 将西南大学 `emblem` 路径由 `swu-emblem-official.svg` 改为 `swu-emblem-official-crop.png`。
  - 更新 `index.html` 中 `content.js` 版本参数为 `v=20260415h`，规避缓存。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/content.js`、`index.html`、`AUDIT_LOG.md`。

### [A-039] 教育经历学校名改为官方字标（含深色模式适配）
- 背景：用户要求将校徽旁的“暨南大学 / 西南大学”改为官方字体样式，并在深色模式下同步视觉颜色。
- 调整：
  - 新增两张中文校名字标图片：`jnu-wordmark-official-zh.png`、`swu-wordmark-official-zh.png`（透明底）。
  - 教育数据新增 `wordmarkZh`、`wordmarkClass`、`wordmarkAlt` 字段，用于按学校绑定字标资源。
  - `renderEducation()` 增加中文模式专用渲染：标题改为“官方字标图片 + `·211`”；英文模式仍保持原文本标题。
  - 新增字标样式（尺寸、对齐、移动端缩放）与深色模式滤镜规则，使深色主题下字标颜色自动变亮。
  - 记录新增图片来源与派生说明到 `assets/images/CREDITS.md`。
  - 更新 `index.html` 中 `styles.css`、`content.js`、`main.js` 版本参数为 `v=20260415i`，规避缓存。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/content.js`、`assets/js/main.js`、`assets/css/styles.css`、`assets/images/jnu-wordmark-official-zh.png`、`assets/images/swu-wordmark-official-zh.png`、`assets/images/swu-logo0603.png`、`assets/images/CREDITS.md`、`index.html`、`AUDIT_LOG.md`。

### [A-040] 字标显示缺陷修复（SWU 边缘截断 + JNU 深色不可见）
- 背景：用户反馈“西南大学字标边缘未完整显示，深色模式下暨南大学字标不可见”。
- 原因：
  - `jnu-wordmark-official-zh.png` 先前导出为实底图，深色模式滤镜后出现整块浅色底，字形对比丢失。
  - `swu-wordmark-official-zh.png` 先前裁切右侧留量不足，导致右缘笔画在部分场景观感接近被截断。
- 调整：
  - 重新生成 `jnu-wordmark-official-zh.png`：改为透明底字形（保留 alpha 边缘），去除实底问题。
  - 重新生成 `swu-wordmark-official-zh.png`：扩大裁切范围并增加右侧留边，保证字形完整显示。
  - 深色模式字标滤镜从 `invert(0.9)` 提升为 `invert(1)`，增强深色主题可读性。
  - 两所学校 `wordmarkZh` 路径追加 `?v=20260415k` 缓存参数。
  - 更新 `index.html` 中 `styles.css`、`content.js`、`main.js` 版本参数为 `v=20260415k`。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/images/jnu-wordmark-official-zh.png`、`assets/images/swu-wordmark-official-zh.png`、`assets/js/content.js`、`assets/css/styles.css`、`index.html`、`AUDIT_LOG.md`。

### [A-041] 字标留边与 `· 211` 样式回退微调
- 背景：用户继续反馈西南大学字标边缘仍偏紧，且希望 `· 211` 样式恢复到此前显示风格；同时要求保持 SWU 尺寸不变，仅放大 JNU。
- 调整：
  - 重新扩展 `swu-wordmark-official-zh.png` 透明留边（右侧额外加宽，并补充上下边距），避免边缘观感被裁切。
  - `.school-wordmark-jnu` 高度提升到与 `.school-wordmark-swu` 一致（桌面 `1.34rem`、移动端 `1.16rem`），仅放大暨南大学字标。
  - `.school-tier` 样式回退为继承标题：恢复 `· 211` 的字体/字号/颜色与标题一致，不再使用额外 serif 与单独字号。
  - 两所学校字标路径缓存参数更新为 `?v=20260415l`，并将 `index.html` 资源版本同步到 `v=20260415l`。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/images/swu-wordmark-official-zh.png`、`assets/css/styles.css`、`assets/js/content.js`、`index.html`、`AUDIT_LOG.md`。

### [A-042] SWU 字标留边方向修正（去右扩，增左与上下）
- 背景：用户指出上一版 SWU 字标“右侧留边过宽”，要求改为“左侧与上下两侧增加留边，右侧回退”。
- 调整：
  - 以 `swu-logo0603.png` 为源重新生成 `swu-wordmark-official-zh.png`，采用新的留边分配：左侧显著增加、上下增加、右侧缩小。
  - 更新两校 `wordmarkZh` 缓存参数为 `?v=20260415m`，并同步 `index.html` 资源版本为 `v=20260415m`。
- 验证命令：
  - `node --check assets/js/content.js`
  - `node --check assets/js/main.js`
- 影响文件：`assets/images/swu-wordmark-official-zh.png`、`assets/js/content.js`、`index.html`、`AUDIT_LOG.md`。

### [A-043] 移动端中文地址强制使用 Google 地图（桌面保持原逻辑）
- 背景：用户要求在移动端切换到“中文地址”时，地图仍显示 Google；桌面端不变。
- 调整：
  - 在 `main.js` 新增 `shouldUseGoogleMapOnMobileZh()` 判断（`max-width: 768px` 且 `locationLang === 'zh'`）。
  - 在 `resolveLocationMapEmbedUrl()` 中增加移动端覆盖分支：满足条件时优先返回 `mapEmbedUrl.en`（Google embed URL）。
  - 桌面端与其它场景继续沿用原先按语言选择地图 URL 的逻辑。
  - 更新 `index.html` 中 `main.js` 版本参数为 `v=20260415n`，规避缓存。
- 验证命令：
  - `node --check assets/js/main.js`
- 影响文件：`assets/js/main.js`、`index.html`、`AUDIT_LOG.md`。

## 3. 当前基线（截至本次补录）

- 技术形态：纯静态页面（无构建依赖）。
- 内容入口：`assets/js/content.js`。
- 渲染与交互：`assets/js/main.js`。
- 样式主文件：`assets/css/styles.css`。
- 重点能力：双语、浅/深主题、首屏引导、滚动进度、点击颗粒、地图嵌入与裁切。

## 4. 后续审计建议

- 建议后续每次需求变更追加一条 `A-xxx` 记录，避免再次“整段补录”。
- 若后续启用 Git，建议将本文件升级为 `CHANGELOG.md + commit hash` 关联模式。
