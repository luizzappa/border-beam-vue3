<template>
  <div
    v-bind="wrapperAttrs"
    ref="rootRef"
    :data-beam="id"
    :data-active="isActive && !isFading ? '' : undefined"
    :data-fading="isFading ? '' : undefined"
    :style="mergedStyle"
    @animationend="handleAnimationEnd"
  >
    <slot />
    <div data-beam-bloom />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
  type StyleValue,
} from 'vue';
import type { BorderBeamProps, BorderBeamTheme } from './types';
import { sizePresets, sizeThemePresets, generateBeamCSS } from './styles';

defineOptions({
  name: 'BorderBeam',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BorderBeamProps>(), {
  size: 'md',
  colorVariant: 'colorful',
  theme: 'dark',
  staticColors: false,
  active: true,
  brightness: 1.3,
  hueRange: 30,
  strength: 1,
});

const emit = defineEmits<{
  activate: [];
  deactivate: [];
  animationend: [event: AnimationEvent];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();
const id = `bb-${instance?.uid ?? Math.random().toString(36).slice(2)}`;

const rootRef = ref<HTMLDivElement | null>(null);
const systemTheme = ref<'dark' | 'light'>('dark');
const isActive = ref(props.active);
const isFading = ref(false);
const detectedRadius = ref<number | null>(null);

let mediaQuery: MediaQueryList | null = null;
let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null;
let mutationObserver: MutationObserver | null = null;
let styleElement: HTMLStyleElement | null = null;

function resolveTheme(theme: BorderBeamTheme, currentSystemTheme: 'dark' | 'light'): 'dark' | 'light' {
  return theme === 'auto' ? currentSystemTheme : theme;
}

function detectBorderRadius() {
  if (props.borderRadius != null) return;

  const child = rootRef.value?.firstElementChild as HTMLElement | null;
  if (!child) return;

  const computedStyle = getComputedStyle(child);
  const rawRadius = parseFloat(computedStyle.borderTopLeftRadius);
  if (!Number.isNaN(rawRadius) && rawRadius > 0) {
    detectedRadius.value = rawRadius;
  }
}

onMounted(() => {
  styleElement = document.createElement('style');
  styleElement.setAttribute('data-border-beam-style', id);
  styleElement.textContent = cssStyles.value;
  document.head.appendChild(styleElement);

  if (typeof window !== 'undefined') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light';
    mediaQueryHandler = event => {
      systemTheme.value = event.matches ? 'dark' : 'light';
    };
    mediaQuery.addEventListener('change', mediaQueryHandler);
  }

  nextTick(detectBorderRadius);

  if (rootRef.value) {
    mutationObserver = new MutationObserver(detectBorderRadius);
    mutationObserver.observe(rootRef.value, { childList: true, subtree: false });
  }
});

onBeforeUnmount(() => {
  if (mediaQuery && mediaQueryHandler) {
    mediaQuery.removeEventListener('change', mediaQueryHandler);
  }

  mutationObserver?.disconnect();
  styleElement?.remove();
  styleElement = null;
});

watch(
  () => props.borderRadius,
  () => {
    if (props.borderRadius != null) {
      detectedRadius.value = null;
      return;
    }

    nextTick(detectBorderRadius);
  }
);

watch(
  () => props.active,
  active => {
    if (active && !isActive.value && !isFading.value) {
      isActive.value = true;
    } else if (!active && isActive.value && !isFading.value) {
      isFading.value = true;
    }
  }
);

const resolvedTheme = computed(() => resolveTheme(props.theme, systemTheme.value));
const themeConfig = computed(() => sizeThemePresets[props.size][resolvedTheme.value]);
const sizeConfig = computed(() => sizePresets[props.size]);

const finalBorderRadius = computed(() => props.borderRadius ?? detectedRadius.value ?? sizeConfig.value.borderRadius);
const finalDuration = computed(() => props.duration ?? (props.size === 'line' ? 2.4 : 1.96));
const finalSaturation = computed(() => props.saturation ?? themeConfig.value.saturation);
const finalHueRange = computed(() => props.size === 'line' ? Math.min(props.hueRange, 13) : props.hueRange);
const finalStaticColors = computed(() => (props.colorVariant === 'mono' ? true : props.staticColors));

const cssStyles = computed(() =>
  generateBeamCSS({
    id,
    borderRadius: finalBorderRadius.value,
    borderWidth: sizeConfig.value.borderWidth,
    duration: finalDuration.value,
    strokeOpacity: themeConfig.value.strokeOpacity,
    innerOpacity: themeConfig.value.innerOpacity,
    bloomOpacity: themeConfig.value.bloomOpacity,
    innerShadow: themeConfig.value.innerShadow,
    size: props.size,
    colorVariant: props.colorVariant,
    staticColors: finalStaticColors.value,
    brightness: props.brightness,
    saturation: finalSaturation.value,
    hueRange: finalHueRange.value,
    theme: resolvedTheme.value,
  })
);

watch(cssStyles, styles => {
  if (styleElement) {
    styleElement.textContent = styles;
  }
});

const wrapperAttrs = computed(() => {
  const {
    style: _style,
    onAnimationend: _onAnimationend,
    onAnimationEnd: _onAnimationEnd,
    ...rest
  } = attrs as Record<string, unknown>;

  return rest;
});

const mergedStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  {
    '--beam-strength': Math.max(0, Math.min(1, props.strength)),
  },
]);

function handleAnimationEnd(event: AnimationEvent) {
  const animationName = event.animationName;

  if (animationName.includes('fade-out')) {
    isActive.value = false;
    isFading.value = false;
    emit('deactivate');
  } else if (animationName.includes('fade-in')) {
    emit('activate');
  }

  emit('animationend', event);
}
</script>
