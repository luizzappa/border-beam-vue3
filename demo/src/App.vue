<template>
  <a href="#main-content" class="skip-link">
    Skip to content
  </a>

  <main id="main-content" class="app">
    <header class="header">
      <nav aria-label="External links" class="top-bar-links">
        <a
          class="icon-btn"
          href="https://github.com/luizzappa/border-beam-vue3"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <GitHubIcon />
        </a>
        <a
          class="icon-btn"
          href="https://github.com/Jakubantalik/border-beam"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Original React project"
        >
          <XIcon />
        </a>
      </nav>
      <HeaderIcon />
      <h1 class="title">Border beam</h1>
      <p class="subtitle-sm">Animated border beam component</p>
    </header>

    <section class="examples-section" aria-label="Effect demonstrations">
      <div class="example-row-full">
        <BorderBeam size="md" color-variant="colorful" theme="dark" active>
          <MockChatInput />
        </BorderBeam>
      </div>
      <div class="example-row-split">
        <div class="example-cell">
          <BorderBeam size="sm" color-variant="colorful" theme="dark" active>
            <MockIconButton />
          </BorderBeam>
        </div>
        <div class="example-cell">
          <BorderBeam
            size="line"
            color-variant="colorful"
            theme="dark"
            active
            :duration="2.4"
            :border-radius="20"
          >
            <MockSearchBar />
          </BorderBeam>
        </div>
      </div>
    </section>

    <section class="section" aria-label="Installation">
      <h2 class="section-title">Installation</h2>
      <div class="code-block">
        <code>{{ installCmd }}</code>
        <CopyButton :text="installCmd" label="Copy install command" />
      </div>
    </section>

    <section class="section" aria-label="Usage">
      <h2 class="section-title section-title--muted">Usage</h2>
      <div class="code-block code-block--multi">
        <code>{{ usageCode }}</code>
        <CopyButton :text="usageCode" label="Copy usage example" />
      </div>
    </section>

    <section class="playground-section" aria-label="Interactive playground">
      <h2 class="section-title">Playground</h2>

      <div class="playground-controls">
        <div class="control-group" role="radiogroup" aria-label="Effect type">
          <span class="control-label">Type</span>
          <div class="control-options">
            <button
              v-for="{ value, label } in SIZE_OPTIONS"
              :key="value"
              class="tab-btn"
              role="radio"
              :aria-checked="playgroundSize === value"
              :data-active="playgroundSize === value ? 'true' : undefined"
              @click="setPlaygroundSize(value)"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <div class="control-group" role="radiogroup" aria-label="Color variant">
          <span class="control-label">Color</span>
          <div class="control-options">
            <button
              v-for="{ value, label } in COLOR_OPTIONS"
              :key="value"
              class="tab-btn"
              role="radio"
              :aria-checked="playgroundColorVariant === value"
              :data-active="playgroundColorVariant === value ? 'true' : undefined"
              @click="playgroundColorVariant = value"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label" :for="durationId">Duration</label>
          <div class="control-options">
            <input
              :id="durationId"
              type="number"
              class="duration-input"
              :value="playgroundDuration"
              min="0.5"
              max="10"
              step="0.1"
              aria-label="Animation duration in seconds"
              @input="setPlaygroundDuration"
            />
          </div>
        </div>

        <div class="control-group control-group--strength">
          <span class="control-label">Strength</span>
          <div class="strength-track">
            <div
              v-if="playgroundStrength > 0"
              class="strength-fill"
              :style="{ width: `${playgroundStrength}%` }"
            />
            <span class="strength-value">{{ playgroundStrength }}%</span>
            <input
              :id="strengthId"
              v-model.number="playgroundStrength"
              type="range"
              class="strength-input"
              min="0"
              max="100"
              step="1"
              aria-label="Effect strength"
            />
          </div>
        </div>
      </div>

      <div
        class="playground-preview"
        role="button"
        tabindex="0"
        :aria-pressed="playgroundActive"
        :aria-label="playgroundActive ? 'Pause animation' : 'Play animation'"
        @click="togglePlayground"
        @keydown="handlePreviewKeydown"
      >
        <BorderBeam
          :size="playgroundSize"
          :color-variant="playgroundColorVariant"
          theme="dark"
          :active="playgroundActive"
          :duration="playgroundDuration"
          :strength="playgroundStrength / 100"
        >
          <div :class="['card', playgroundSize === 'sm' ? 'card-sm' : 'card-md']">
            <p class="card-text">
              {{ playgroundSize === 'sm' ? '' : 'Build anything...' }}
            </p>
          </div>
        </BorderBeam>
      </div>

      <div class="code-block code-block--multi">
        <code>{{ playgroundCode }}</code>
        <CopyButton :text="playgroundCode" label="Copy playground code" />
      </div>
    </section>

    <footer class="footer">
      <span class="footer-muted">Vue 3 port by</span>
      <a class="footer-name" href="https://github.com/luizzappa/border-beam-vue3" target="_blank" rel="noopener noreferrer">Luiz Zappa</a>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue';
import { BorderBeam, type BorderBeamColorVariant, type BorderBeamSize } from 'border-beam-vue3';

const CopyIcon = defineComponent({
  name: 'CopyIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
    h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
  ]),
});

const CheckIcon = defineComponent({
  name: 'CheckIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    h('polyline', { points: '20 6 9 17 4 12' }),
  ]),
});

const GitHubIcon = defineComponent({
  name: 'GitHubIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '16',
    height: '16',
    viewBox: '0 0 16 16',
  }, [
    h('path', {
      d: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z',
    }),
  ]),
});

const XIcon = defineComponent({
  name: 'XIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '15',
    height: '16',
    viewBox: '0 0 1200 1227',
  }, [
    h('path', {
      d: 'M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z',
    }),
  ]),
});

const AtSignIcon = defineComponent({
  name: 'AtSignIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    opacity: '0.5',
  }, [
    h('circle', { cx: '12', cy: '12', r: '4' }),
    h('path', { d: 'M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94' }),
  ]),
});

const ChevronDownIcon = defineComponent({
  name: 'ChevronDownIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    opacity: '0.5',
    style: { transform: 'rotate(90deg)' },
  }, [
    h('polyline', { points: '9 18 15 12 9 6' }),
  ]),
});

const ArrowUpIcon = defineComponent({
  name: 'ArrowUpIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    opacity: '0.5',
  }, [
    h('line', { x1: '12', y1: '19', x2: '12', y2: '5' }),
    h('polyline', { points: '5 12 12 5 19 12' }),
  ]),
});

const SearchIcon = defineComponent({
  name: 'SearchIcon',
  setup: () => () => h('svg', {
    'aria-hidden': 'true',
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    h('circle', { cx: '11', cy: '11', r: '8' }),
    h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
  ]),
});

const HeaderIcon = defineComponent({
  name: 'HeaderIcon',
  setup: () => () => h('div', { class: 'header-icon', 'aria-hidden': 'true' }, [
    h('img', {
      class: 'header-icon-img',
      src: `${import.meta.env.BASE_URL}icon-web.png`,
      alt: '',
      width: '207',
      height: '138',
    }),
  ]),
});

const MockChatInput = defineComponent({
  name: 'MockChatInput',
  setup: () => () => h('div', {
    class: 'mock-chat',
    role: 'img',
    'aria-label': 'Chat input UI example with border beam effect',
  }, [
    h('div', { class: 'mock-chat-inner' }, [
      h('div', { class: 'pill' }, [h(AtSignIcon)]),
      h('div', { class: 'placeholder' }, 'Build anything...'),
      h('div', { class: 'bottom-row' }, [
        h('div', { class: 'tag' }, ['Agent', h(ChevronDownIcon)]),
        h('div', { class: 'tag' }, ['Auto', h(ChevronDownIcon)]),
        h('div', { class: 'send-btn' }, [h(ArrowUpIcon)]),
      ]),
    ]),
  ]),
});

const MockIconButton = defineComponent({
  name: 'MockIconButton',
  setup: () => () => h('div', {
    class: 'mock-icon-btn',
    role: 'img',
    'aria-label': 'Icon button UI example with border beam effect',
  }, [
    h('div', { class: 'mock-icon-btn-square' }),
  ]),
});

const MockSearchBar = defineComponent({
  name: 'MockSearchBar',
  setup: () => () => h('div', {
    class: 'mock-search',
    role: 'img',
    'aria-label': 'Search bar UI example with border beam effect',
  }, [
    h('div', { class: 'mock-search-inner' }, [
      h(SearchIcon),
      h('span', 'Search'),
    ]),
  ]),
});

const CopyButton = defineComponent({
  name: 'CopyButton',
  props: {
    text: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const copied = ref(false);

    function handleCopy() {
      navigator.clipboard.writeText(props.text).then(() => {
        copied.value = true;
        window.setTimeout(() => {
          copied.value = false;
        }, 2000);
      });
    }

    return () => h('button', {
      class: 'copy-btn',
      'aria-label': copied.value ? 'Copied' : props.label,
      onClick: handleCopy,
    }, [
      h('div', { class: 'copy-btn-icon' }, [
        copied.value ? h(CheckIcon) : h(CopyIcon),
      ]),
    ]);
  },
});

const SIZE_OPTIONS: { value: BorderBeamSize; label: string }[] = [
  { value: 'md', label: 'Large' },
  { value: 'sm', label: 'Small' },
  { value: 'line', label: 'Line' },
];

const COLOR_OPTIONS: { value: BorderBeamColorVariant; label: string }[] = [
  { value: 'colorful', label: 'Colorful' },
  { value: 'mono', label: 'Mono' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'sunset', label: 'Sunset' },
];

const playgroundActive = ref(true);
const playgroundSize = ref<BorderBeamSize>('md');
const playgroundColorVariant = ref<BorderBeamColorVariant>('colorful');
const playgroundDuration = ref(1.96);
const playgroundStrength = ref(70);
const durationId = 'duration-input';
const strengthId = 'strength-input';

const installCmd = 'npm install border-beam-vue3';
const usageCode = `import { BorderBeam } from 'border-beam-vue3';

<BorderBeam>
  <YourCard>Content</YourCard>
</BorderBeam>`;

const playgroundCode = computed(() => {
  const strengthProp = playgroundStrength.value < 100
    ? ` :strength="${playgroundStrength.value / 100}"`
    : '';

  return `<BorderBeam size="${playgroundSize.value}" color-variant="${playgroundColorVariant.value}" :duration="${playgroundDuration.value}"${strengthProp}>
  <Card>Content</Card>
</BorderBeam>`;
});

function setPlaygroundSize(size: BorderBeamSize) {
  playgroundSize.value = size;
  playgroundDuration.value = size === 'line' ? 2.4 : 1.96;
}

function setPlaygroundDuration(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value);
  playgroundDuration.value = Number.isNaN(value) ? 1 : value;
}

function togglePlayground() {
  playgroundActive.value = !playgroundActive.value;
}

function handlePreviewKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    togglePlayground();
  }
}
</script>
