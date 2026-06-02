# border-beam-vue3

> This project is a Vue 3 port of the original React library [Jakubantalik/border-beam](https://github.com/Jakubantalik/border-beam).

Animated border beam effect for Vue 3. A lightweight component that adds a traveling glow animation around any element -- cards, buttons, inputs, or search bars.

## Install

```bash
npm install border-beam-vue3
```

## Quick start

```vue
<template>
  <BorderBeam>
    <div class="card">
      Your content here
    </div>
  </BorderBeam>
</template>

<script setup lang="ts">
import { BorderBeam } from 'border-beam-vue3';
</script>

<style>
.card {
  padding: 32px;
  border-radius: 16px;
  background: #1d1d1d;
}
</style>
```

The component wraps your content and overlays the animated beam effect. It auto-detects the `border-radius` of the first child element.

## Sizes

Three built-in size presets control the glow intensity and animation style:

```vue
<!-- Full border glow (default) -->
<BorderBeam size="md">
  <Card />
</BorderBeam>

<!-- Compact glow for small elements -->
<BorderBeam size="sm">
  <IconButton />
</BorderBeam>

<!-- Bottom-only traveling glow -->
<BorderBeam size="line">
  <SearchBar />
</BorderBeam>
```

## Color variants

Four color palettes are available:

```vue
<BorderBeam color-variant="colorful" />
<BorderBeam color-variant="mono" />
<BorderBeam color-variant="ocean" />
<BorderBeam color-variant="sunset" />
```

All variants except `mono` animate through a hue-shift cycle.

## Theme

Adapts beam colors for dark or light backgrounds:

```vue
<BorderBeam theme="dark" />
<BorderBeam theme="light" />
<BorderBeam theme="auto" />
```

## Strength

Control the overall intensity of the effect without affecting the wrapped content:

```vue
<BorderBeam :strength="0.7">
  <Card />
</BorderBeam>
```

`strength` accepts a value from `0` (invisible) to `1` (full intensity, default).

## Play / pause

Toggle the animation on and off with smooth fade transitions:

```vue
<template>
  <BorderBeam :active="active" @deactivate="() => console.log('faded out')">
    <Card />
  </BorderBeam>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref(true);
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| default slot | `VNode[]` | — | Content to wrap |
| `size` | `'sm' \| 'md' \| 'line'` | `'md'` | Size/type preset |
| `colorVariant` | `'colorful' \| 'mono' \| 'ocean' \| 'sunset'` | `'colorful'` | Color palette |
| `theme` | `'dark' \| 'light' \| 'auto'` | `'dark'` | Background adaptation |
| `strength` | `number` | `1` | Effect opacity (0–1), only affects the beam layers |
| `duration` | `number` | `1.96` / `2.4` | Animation cycle duration in seconds |
| `active` | `boolean` | `true` | Whether the animation is playing |
| `borderRadius` | `number` | auto-detected | Custom border radius in px |
| `brightness` | `number` | `1.3` | Glow brightness multiplier |
| `saturation` | `number` | `1.2` | Glow saturation multiplier |
| `hueRange` | `number` | `30` | Hue rotation range in degrees |
| `staticColors` | `boolean` | `false` | Disable hue-shift animation |
| `class` | `string \| object \| array` | — | Additional class on the wrapper |
| `style` | `StyleValue` | — | Additional inline styles on the wrapper |
| `@activate` | event | — | Emitted when fade-in completes |
| `@deactivate` | event | — | Emitted when fade-out completes |
| `@animationend` | `AnimationEvent` | — | Emitted for wrapper animation end events |

All standard attributes passed to the component are forwarded to the wrapper.

## How it works

`BorderBeam` renders a wrapper `<div>` with:

- **`::after`** — the beam stroke (conic gradient masked to the border)
- **`::before`** — inner glow layer
- **`[data-beam-bloom]`** — outer bloom/glow child div

All effect layers are absolutely positioned and use `pointer-events: none`, so they never interfere with your content. Animations use CSS `@property` for smooth GPU-accelerated transitions.

## Project structure

```
border-beam-vue3/
├── src/
│   ├── index.ts          # Public exports
│   ├── BorderBeam.vue     # Vue component
│   ├── types.ts           # TypeScript type definitions
│   └── styles.ts          # CSS generation engine
├── demo/                  # Vite + Vue demo site
├── dist/                  # Built output (ESM + CJS + types)
├── package.json
├── LICENSE
└── README.md
```

## Requirements

- Vue 3+
- Modern browser with CSS `@property` support (Chrome 85+, Safari 15.4+, Firefox 128+)

## Accessibility

The effect layers are purely decorative and use `pointer-events: none`. They do not affect keyboard navigation or screen readers. The component respects `prefers-reduced-motion` when implemented by the consumer.

## License

[MIT](./LICENSE)
