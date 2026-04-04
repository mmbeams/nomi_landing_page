# Flowith.io Design System Reference

> 复刻自 [flowith.io/home](https://flowith.io/home/)（2026-02 Wayback Machine 快照）
> 本文档作为 Nomi 项目前端 UI 的 Design System 参考，用于保持视觉语言一致。

---

## 1. Typography

### 字体家族

| 用途 | 字体 | 备注 |
|------|------|------|
| **主字体** | `ABC Oracle, sans-serif` | Dinamo Typefaces 出品，几何无衬线，现代感强 |
| **回退** | `system-ui, -apple-system, sans-serif` | 系统字体栈 |

> ABC Oracle 是一款兼具 humanist 温度和 geometric 精确感的字体，适合科技产品。如无法获取授权，可用 **Inter** 或 **Satoshi** 作为开源替代。

### 字号体系（响应式）

| Token | Mobile | Desktop | 用途 |
|-------|--------|---------|------|
| `hero` | 32px | 58px | 页面主标题（仅一处） |
| `hero-md` | 42px | 58px | sm 断点过渡 |
| `section-title` | 18px | 20px | Feature 区块标题 |
| `body-lg` | 16px | 20px | Hero 副标题、Feature 描述 |
| `body` | 14px | 16px | Feature 标签（如 "Canvas"） |
| `body-sm` | 14px | 14px | CTA 链接文字 |
| `caption` | 13px | 13px | 品牌栏说明、次要信息 |
| `tweet-text` | 15px | 15px | 推文卡片正文 |

### 行高

| 字号 | line-height |
|------|-------------|
| 58px (hero) | `letter-spacing: -2.9px` (紧凑大字) |
| 20px | 28px (1.4) |
| 16px | 24px (1.5) |
| 15px | 20px (1.33) |
| 14px | 22px (1.57) |
| 13px | 20px (1.54) |

### 字重

| 权重 | 用途 |
|------|------|
| `400` (Regular) | 正文、描述文字 |
| `500` (Medium) | 小标题文字（ticker 卡片内） |
| `700` (Bold) | 推文作者名 |

### Letter Spacing（字间距）

| 值 | 用途 |
|----|------|
| `-2.9px` | Hero 大标题（58px 时） |
| `-0.4px` | Section 标题 & Body Large |
| `-0.28px` | CTA 链接文字（14px） |
| `-0.02em` | Caption 小字 |

---

## 2. Color Palette

### 核心色板

```
背景色
├── #FFFFFF        — 主背景（纯白）
├── #F6F7F8        — Feature 卡片背景（极浅灰）
├── #E7EAED        — Ticker 文字卡片背景
└── #000000        — 主 CTA 按钮背景

文字色
├── #000000 / text-black   — 主标题
├── #050505                — Hero 副标题、CTA 链接
├── #0F1419                — 推文正文、作者名（接近纯黑）
├── #5A6272                — Feature 描述文字（蓝灰）
├── #536471                — 推文次要信息（灰蓝）
├── #808080                — Caption / 品牌栏文字（中灰）
└── #FFFFFF                — CTA 按钮文字（白色）

强调色
├── #1D9BF0        — Twitter/X 蓝（推文验证图标、hover 边框）
├── #22C55E        — Live 状态绿点
└── #681DA8        — 访问过的链接（紫色，几乎不可见）

边框色
├── #CFD9DE        — 推文卡片默认边框
└── #EFF3F4        — 推文卡片内分隔线
```

### 渐变

| 名称 | 值 | 用途 |
|------|-----|------|
| **Warm Earth** | `137.99deg, #F1DD94 → #E3E9DD 75% → #D5E3DE 100%` | Canvas Feature 区块背景 |
| **Cool Steel** | `191deg, #EBEDF5 → #A3A4AA 38% → #242528 100%` | FlowithOS Feature 区块背景 |
| **Blue Depth** | `to bottom, #D1D7F0 → #445BB8` | Agent Neo 按钮/装饰 |
| **Fade Edge** | `to right/left, white → transparent` | 品牌滚动条两侧渐隐 |

---

## 3. Spacing & Layout

### 页面容器

```
最大宽度: 1300px
水平 padding: 24px (desktop) / 16px (mobile)
居中对齐: items-center
```

### 间距系统

| Token | 值 | 用途 |
|-------|-----|------|
| `section-gap` | 90px (desktop) / 40px (mobile) | Feature 区块之间 |
| `section-py` | 67px (desktop) / 40px (mobile) | Section 垂直 padding |
| `hero-pt` | 112px (desktop) / 80px (mobile) | Hero 顶部留白 |
| `card-gap` | 40px (desktop) / 24px (mobile) | 卡片内图文间距 |
| `card-padding` | 20px (desktop) / 16px (mobile) | Feature 卡片内 padding |
| `text-group-gap` | 10px | 标签 + 标题 组间距 |
| `heading-body-gap` | 20px (desktop) / 16px (mobile) | 标题区域与正文区域间距 |
| `brand-gap` | 60px | 品牌 logo 之间间距 |
| `tweet-grid-gap` | 16px | 推文卡片网格间距 |
| `cta-gap` | 12px | CTA 按钮组内间距 |

### 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `radius-pill` | 100px | CTA 按钮（全圆角药丸形） |
| `radius-card` | 3px | Feature 卡片（极微圆角，几乎直角） |
| `radius-tweet` | 16px | 推文卡片 |
| `radius-ticker` | 12px | Ticker 内容卡片 |
| `radius-avatar` | full (50%) | 头像 |

---

## 4. Content Section Layout（图文排版规范）

### 4.1 Hero Section

```
┌─────────────────────────────────────────┐
│              [Nav Bar]                   │
│                                          │
│         think. create. execute.          │  ← 58px, 逐字母动画入场
│              flow in one                 │
│                                          │
│  An agentic AI workspace that connects   │  ← 20px, max-w-608px
│  your knowledge, creation, and execution │
│  in a single flow.                       │
│                                          │
│         [■ Start Flowing]                │  ← 黑色药丸按钮
│                                          │
│     ┌───────────────────────────┐        │
│     │    Product Screenshot     │        │  ← 宽比 4096:2161, 圆角 3px
│     └───────────────────────────┘        │
└──────────────────────────────────────────┘
```

- 标题逐字母动画：`opacity: 0 → 1`, `blur(10px) → blur(0)`, `translateX(-10px → 0)`, 每字母延迟 `0.05s`, 总时长 `0.6s ease-out`
- 副标题居中, `max-width: 608px`
- CTA 按钮: `h-40px, px-16px, rounded-full, bg-black, text-white`

### 4.2 Brand Scroll Bar

```
┌──────────────────────────────────────────┐
│  "Backed by leading brands..."           │  ← 13px, #808080
│                                          │
│ ◁fade  [Stripe][OpenAI][NVIDIA]... fade▷ │  ← 无限水平滚动
└──────────────────────────────────────────┘
```

- Logo 高度: 21px, 灰度滤镜 → hover 恢复彩色
- 滚动动画: `scrollBrands 20s linear infinite`, hover 暂停
- 两侧白色渐变遮罩 (`w-32`)

### 4.3 Feature Cards（核心图文排版）

**通用结构** — 每个 Feature 区块为 **左右两栏布局**（lg 断点切换为上下）：

```
┌──────────────────────────────────────────────────────────────┐
│  bg: #F6F7F8, rounded: 3px, padding: 20px                   │
│                                                               │
│  ┌─────────────────────┐  ┌──────────────────────────────┐   │
│  │  TEXT COLUMN         │  │  MEDIA COLUMN                │   │
│  │  max-w: 550px        │  │  w: 762px                    │   │
│  │  flex-1              │  │  aspect: 762/625             │   │
│  │                      │  │  rounded: 3px                │   │
│  │  [Label]  14-16px    │  │                              │   │
│  │   #5a6272            │  │  ┌────────────────────────┐  │   │
│  │                      │  │  │                        │  │   │
│  │  Title    18-20px    │  │  │   Screenshot / Video   │  │   │
│  │   text-black         │  │  │   or Carousel          │  │   │
│  │   tracking: -0.4px   │  │  │                        │  │   │
│  │                      │  │  └────────────────────────┘  │   │
│  │  Description 16-20px │  │                              │   │
│  │   #5a6272            │  │                              │   │
│  │                      │  │                              │   │
│  │  [Link →] 14px       │  │                              │   │
│  │   #050505 underline  │  │                              │   │
│  └─────────────────────┘  └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**交替布局**：偶数 Feature 卡片图文左右互换（`order-1/order-2` 切换）。

#### Feature 1: Canvas
- 文字左 / 图片右
- Label: "Canvas" → Title: "Visualize your thinking"
- 图片: 产品截图, `object-cover`

#### Feature 2: FlowithOS
- 图片左 / 文字右 (**交替**)
- Label: "FlowithOS" → Title: "Plan. Evolve. Execute."
- 媒体: 嵌入视频 (`<video>` 或 `<iframe>`), 背景用 Cool Steel 渐变
- 额外: 下载按钮组（Mac / Windows）

#### Feature 3: Agent Neo
- 文字左 / 图片右
- Label: "Agent Neo" → Title: "Redefine Creation with Flowith AI"
- 媒体: **Ticker Carousel**（三行水平无限滚动，混合图片/视频/文字卡片）
  - 行 1: `scroll-left 40s`
  - 行 2: `scroll-right 35s`（反方向）
  - 行 3: `scroll-left-slow 50s`
  - 卡片高度: 160px, 圆角 12-13px

#### Feature 4: Knowledge Garden
- 图片左 / 文字右 (**交替**)
- Label: "Knowledge Garden" + 绿色 Live 圆点
- Title: "Manage and use knowledge with AI"
- 媒体: 产品截图 + 叠加渐变装饰

### 4.4 Testimonials Section

```
┌────────────────────────────────────────────┐
│  "Loved by Creators, Worldwide"            │  ← Section 标题
│  "Join our growing community of 1 million" │
│                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐          │  ← 3列网格
│  │ Tweet  │ │ Tweet  │ │ Tweet  │          │
│  │ Card   │ │ Card   │ │ Card   │          │
│  └────────┘ └────────┘ └────────┘          │
└────────────────────────────────────────────┘
```

**Tweet Card 结构**:
```
┌──────────────────────────────────────┐
│  [Avatar 40x40]  AuthorName ✓        │  ← 15px bold
│                  @handle             │  ← 15px #536471
│                            [X logo]  │
│                                      │
│  Tweet content text here...          │  ← 15px #0f1419
│                                      │
│  ─────────────────────────────────   │  ← border-t #eff3f4
│  💬 4  🔁 0  ❤️ 20  📊 8K            │  ← 互动数据
│  4:10 AM · Jun 11, 2025              │  ← 15px #536471
└──────────────────────────────────────┘

样式:
- bg: white
- border: 1px solid #CFD9DE
- hover:border: #1D9BF0 (Twitter蓝)
- rounded: 16px
- padding: 16px
- 网格: 1col → 2col (md) → 3col (lg), gap: 16px
```

---

## 5. Navigation

### Desktop Nav

```
┌─────────────────────────────────────────────────┐
│  [Logo]   Features▾  Pricing  Resources▾        │
│                     Community▾  Career           │
│                                                   │
│                     [Sign in] [Sign up]           │
│                     [■ Start Flowing]             │
└─────────────────────────────────────────────────┘
```

- Dropdown 菜单项: `dropdown-title` + `dropdown-description`（标题+描述双行）
- 下拉项带图标: `with-icon` 变体

### Mobile Nav
- 全屏抽屉式
- 手风琴折叠式子菜单 (`mobile-accordion-content`)
- 底部固定: Sign in / Sign up / Start Flowing 按钮

---

## 6. Micro-Interactions & Animations

### Hero 字母入场动画
```css
@keyframes revealHeroLetter {
  0% {
    opacity: 0;
    filter: blur(10px);
    transform: translate(-10px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translate(0);
  }
}
/* 每字母延迟 0.05s, 总时长 0.6s ease-out */
animation: revealHeroLetter 0.6s ease-out forwards;
animation-delay: calc(var(--letter-index) * 0.05s);
```

### Ticker Carousel（Agent Neo 区块）
```css
@keyframes scroll-left {
  0%   { transform: translate(0); }
  100% { transform: translate(-50%); }
}
@keyframes scroll-right {
  0%   { transform: translate(-50%); }
  100% { transform: translate(0); }
}
/* 三行速度不同，方向交替 */
.ticker-left      { animation: scroll-left  40s linear infinite; }
.ticker-right     { animation: scroll-right 35s linear infinite; }
.ticker-left-slow { animation: scroll-left  50s linear infinite; }
```

### 品牌滚动
```css
@keyframes scrollBrands {
  0%   { transform: translate(0); }
  100% { transform: translate(calc(-25% - 20px)); }
}
/* 20s linear infinite, hover暂停 */
.brands-scroll-container:hover .brands-track {
  animation-play-state: paused;
}
```

### 通用 Hover / Transition
| 元素 | 效果 |
|------|------|
| CTA 按钮 | `bg-black → bg-neutral-800`, `transition-colors` |
| 品牌 Logo | `grayscale(100%) opacity(0.6)` → `grayscale(0%) opacity(1)`, `0.3s ease` |
| Tweet 卡片 | `border-color → #1D9BF0`, `transition-colors` |
| CTA 链接 | `text-[#050505] → text-black`, `transition-colors` |
| Live 状态 | `hover:opacity-80`, `transition-opacity` |

---

## 7. Responsive Breakpoints

| 断点 | 宽度 | 变化 |
|------|------|------|
| 默认 (mobile) | < 640px | 单栏布局, 小字号 |
| `sm` | ≥ 640px | 增大 padding, 字号提升 |
| `md` | ≥ 768px | 推文网格 2 列 |
| `lg` | ≥ 1024px | Feature 卡片左右布局, 推文 3 列, 大字号 |

### Mobile 适配要点
- Feature 卡片: 图文垂直堆叠, 图片在下 (`order-2`)
- Hero: 32px → 42px → 58px 三级递进
- Section padding: 40px → 67px
- 卡片内 padding: 16px → 20px

---

## 8. Component Inventory

| 组件 | 描述 | 关键样式 |
|------|------|----------|
| **PillButton** | 药丸形主 CTA | `h-40, px-16, rounded-full, bg-black` |
| **FeatureCard** | 图文两栏卡片 | `bg-#F6F7F8, p-20, rounded-3, gap-40` |
| **TweetCard** | 推文展示卡 | `bg-white, border-#CFD9DE, rounded-16, p-16` |
| **TickerCarousel** | 无限滚动展示 | 三行不同速度/方向 |
| **BrandScroll** | Logo 滚动条 | 灰度 + hover 彩色, 两侧渐隐 |
| **SectionLabel** | Feature 标签 | `14-16px, #5A6272` |
| **NavDropdown** | 导航下拉菜单 | 标题 + 描述双行, 可带图标 |
| **LiveBadge** | 绿点状态指示 | `w-10, h-10, rounded-full, bg-#22C55E` |

---

## 9. Design Principles（设计原则总结）

1. **极简白底** — 纯白背景 + `#F6F7F8` 浅灰卡片，几乎无装饰
2. **微圆角** — 主体卡片 `3px` 极微圆角，不是圆润风格，强调精确
3. **紧凑字距** — 大标题负 letter-spacing，小文字也收紧，营造高密度感
4. **交替图文** — Feature 区块严格左右交替，打破单调
5. **运动感** — 多层 ticker 滚动 + 品牌滚动 + 字母入场动画，页面有生命力
6. **克制用色** — 几乎全灰度，仅 Twitter 蓝和 Live 绿作为功能色
7. **大留白** — Section 间距 67-90px，呼吸感充足
8. **响应式优先** — 三级断点平滑过渡，mobile-first 设计
