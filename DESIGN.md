# Nomi Landing Page — Design System

## 1. Typography

### Font Families
| Role        | Family                          | Usage                                              |
|-------------|--------------------------------|----------------------------------------------------|
| Display     | Instrument Serif, serif        | Hero headings, testimonial quotes, feature titles  |
| Body        | Inter, sans-serif              | Nav links, buttons, subtitle, popup input, UI text |
| Mono        | JetBrains Mono, monospace      | Feature index numbers, testimonial attribution     |

### Font Sizes
| Element                  | Size   | Weight | Letter Spacing | Line Height | Font          |
|--------------------------|--------|--------|----------------|-------------|---------------|
| Hero heading             | 84px   | 400    | -0.03em        | 1           | Instrument Serif |
| Hero subtitle            | 13px   | 400    | 0.04em         | 1.5         | Inter         |
| Nav links                | 12px   | 400    | default        | default     | Inter         |
| Nav / CTA buttons        | 12px   | 500    | default        | default     | Inter         |
| Popup input              | 17px   | 400    | default        | 46px        | Inter         |
| Popup mode label (Note)  | 14px   | 500    | default        | default     | Inter         |
| Popup tag (#)            | 16px   | 600    | default        | default     | Inter         |
| Feature description      | 15px   | 400    | default        | 1.65        | Inter         |
| Testimonial quote        | 20px   | 400    | -0.01em        | 1.4         | Instrument Serif |
| Testimonial attribution  | 11px   | 400    | 0.04em         | default     | JetBrains Mono |

---

## 2. Colors

### Core Palette
| Name        | Value                    | CSS Var           | Usage                                          |
|-------------|--------------------------|-------------------|------------------------------------------------|
| Background  | #F3F2F1                  | `--bg-color`      | Page background                                |
| Main Text   | #2D2A26                  | `--text-main`     | Primary text, outlines, active testimonial card |
| Dim Text    | #7C746C                  | `--text-dim`      | Secondary text, subtitle, attribution           |
| Main Green  | #01FA92                  | `--primary`       | Primary buttons, shader, gradient wave hover    |
| UI White    | #FEFCF9                  | `--ui-white`      | Text on dark backgrounds                        |
| Dark Fill   | #271C11                  | —                 | Logo mark SVG fill                              |
| Icon Dark   | #141B34                  | —                 | Popup icon strokes                              |
| Active Mode | #4ADE80                  | —                 | Active mode tab button background               |

### Borders & Surfaces
| Element              | Value                                |
|----------------------|--------------------------------------|
| Popup card border    | 1px solid rgba(235, 232, 229, 0.5)  |
| Popup card bg        | rgba(255, 255, 255, 0.1) + blur(16px)|
| Navbar scrolled bg   | rgba(243, 242, 241, 0.5) + blur(12px)|
| "How it works" btn   | 1px solid var(--text-main), bg transparent |
| Testimonial inactive | 1px solid rgba(235, 232, 229, 0.5), bg rgba(255,255,255,0.6) + blur(12px) |
| Testimonial active   | bg #2D2A26, no border               |

---

## 3. Strokes & Icons

| Element                | Stroke Width | Stroke Cap | Stroke Join | Color   |
|------------------------|-------------|------------|-------------|---------|
| Popup icons (all)      | 1.2         | round      | round       | #141B34 |
| Send icon              | 1.2         | round      | round       | white   |
| Testimonial nav arrows | 1.2         | round      | round       | #FEFCF9 |
| Logo mark eyebrows     | 1.8432      | round      | —           | #271C11 |

---

## 4. Shapes & Radii

| Element                           | Border Radius |
|-----------------------------------|---------------|
| Text buttons (Try Demo, CTA)      | 32px (pill)     |
| Popup card                        | 32px          |
| Note mode pill                    | 16px          |
| Icon buttons (submit, history, #) | 50% (circle)  |
| Testimonial cards                 | 0 (no rounding) |
| Testimonial nav buttons           | 0 (no rounding) |
| Testimonial avatar                | 50% (circle)  |

---

## 5. Button Sizes

| Button               | Padding    | Size   | Background   | Text Color | Border                    |
|----------------------|-----------|--------|-------------|------------|---------------------------|
| Try Demo (nav)       | 6px 12px  | auto   | var(--text-main) | #FEFCF9    | none                      |
| Join Waitlist        | 6px 12px  | auto   | var(--text-main) | #FEFCF9    | none                      |
| How it works         | 6px 12px  | auto   | transparent | #2D2A26    | 1px solid var(--text-main)|
| Submit (popup)       | —         | 36x36  | #1C1917     | white      | none                      |
| History / # (popup)  | —         | 36x36  | rgba(255,255,255,0.1) | — | none               |
| Testimonial arrows   | —         | 36x36  | #01FA92     | #2D2A26    | none                      |

---

## 6. Spacing

| Area                          | Value    |
|-------------------------------|----------|
| Hero top padding              | 96px     |
| Above popup (hero → popup)    | 64px     |
| Below popup (popup → overview)| 64px     |
| Nav padding                   | 16px 28px|
| Nav link gap                  | 32px     |
| CTA button gap                | 8px      |
| Section gap (features, etc.)  | 64px     |
| Popup internal gap            | 10px     |
| Mode tab gap                  | 6px      |

---

## 7. Animations

| Effect                | Trigger    | Details                                          |
|-----------------------|-----------|--------------------------------------------------|
| Hero text entrance    | Page load | translateX(-30px→0) + blur(8px→0), staggered 250ms |
| Gradient wave text    | Hover     | Green gradient sweep, speed 1.5, repeat loop     |
| Shining placeholder   | Always    | Linear gradient shimmer, 2s infinite loop         |
| Logo corner morph     | Mouse move| Corner radius lerp, 0.11 ease factor              |
| Testimonial cards     | Click/nav | 500ms ease-in-out position transition              |

---

## 8. Testimonials Section

- **Card style**: No rounded corners (borderRadius 0), sharp edges
- **Active card**: bg #01FA92 (main green), text #2D2A26, shadow 0 20px 50px rgba(45,42,38,0.15)
- **Inactive card**: glass effect (rgba white bg + blur), light border, no rounding
- **Quote font**: Instrument Serif, 20px
- **Attribution font**: JetBrains Mono, 11px
- **Avatar**: 48x48 circle
- **Nav buttons**: 36x36 square, bg #01FA92, ChevronLeft/Right at size 16, strokeWidth 1.2, dark text

---

## 9. Design Principles

1. **Warm off-white base** — #F3F2F1 background, glass/frosted surfaces
2. **Serif + sans-serif contrast** — Instrument Serif for display, Inter for body/UI
3. **Pill buttons** — CTA and nav buttons use 32px border-radius (pill shape)
4. **Main color #01FA92** — Testimonial section uses brand green for active card and nav buttons
5. **Sharp testimonials** — Comment section cards and buttons have 0 border-radius
5. **Thin strokes** — 1.2px icon weight throughout, consistent round caps
6. **Restrained palette** — Near-black text, warm gray secondary, green only for primary actions
7. **Glass surfaces** — Semi-transparent backgrounds with backdrop blur
8. **Generous spacing** — 64px+ between major sections
