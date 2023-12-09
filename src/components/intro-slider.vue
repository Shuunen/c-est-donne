<script setup lang="ts">
import { ref } from 'vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { state } from '../state'
import { $t } from '../utils/translate.utils'

const currentSlide = ref(0)

const steps = [
  {
    title: $t('step-1-title'),
    description: $t('step-1-description'),
    image: '/step-1-choose.svg',
  },
  {
    title: $t('step-2-title'),
    description: $t('step-2-description'),
    image: '/step-2-contact-me.svg',
  },
  {
    title: $t('step-3-title'),
    description: $t('step-3-description'),
    image: '/step-3-profits.svg',
  },
]
</script>

<template>
  <div class="app-intro mt-12 flex flex-col gap-8">
    <h1 class="text-center text-4xl">{{ $t('intro-title') }}</h1>
    <p class="text-center text-xl">{{ $t('intro-description') }}</p>
    <div class="app-intro-steps">
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
      <div v-for="step, index in steps" :key="`step-${index}`" class="app-intro-step flex flex-col gap-2" :class="{ active: currentSlide === index }"
        @click="() => currentSlide = index">
        <span class="app-intro-step--number">{{ index + 1 }}</span>
        <h2 class="app-intro-step--title">{{ step.title }}</h2>
        <p class="text-center text-lg text-primary">{{ step.description }}</p>
        <img :alt="`step ${index + 1}`" class="mb-4 mt-2 w-full sm:hidden" :src="step.image" />
      </div>
    </div>
    <carousel v-model="currentSlide" wrap-around>
      <slide v-for="step, index in steps" :key="`slide-${index}`">
        <img :alt="`slide ${index + 1}`" class="max-h-[30vh] min-h-[30rem] w-full" :src="step.image" />
      </slide>
      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
    <sl-alert v-if="!state.user.isConnected" open variant="primary">
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      <strong>{{ $t('intro-login') }}</strong><br />
      {{ $t('please-login') }}
    </sl-alert>
    <img v-if="state.user.isConnected" alt="blob" class="h-44" src="/blob-2.svg" />
    <div v-else class="mx-auto">
      <login-button />
    </div>
  </div>
</template>

<style scoped>
@import url("vue3-carousel/dist/carousel.css");

/* eslint-disable vue-scoped-css/require-selector-used-inside */
.carousel {
  --vc-nav-width: 4rem;
  --vc-nav-height: 4rem;
  --vc-nav-color: hsl(var(--color-primary) / 1);
  --vc-nav-color-hover: hsl(var(--color-accent) / 1);
  @apply mt-4 hidden sm:block;
}

.carousel__pagination {
  @apply gap-3 opacity-70 mt-6;
}

button.carousel__pagination-button {
  @apply rounded-full w-3 h-3 bg-primary;
}

button.carousel__pagination-button--active {
  @apply bg-accent;
}

.carousel__pagination-button::after {
  @apply content-none;
}

.app-intro-steps {
  @apply grid sm:grid-cols-3 mt-4 gap-4;
}

.app-intro-step {
  @apply relative sm:opacity-75 transition-colors cursor-pointer;
}

.app-intro-step.active {
  @apply opacity-100 text-accent;
}

.app-intro-step--title {
  @apply text-center text-2xl;
}

.app-intro-step.active .app-intro-step--title,
.app-intro-step.active .app-intro-step--number {
  @apply text-accent;
}

.app-intro-step--number {
  @apply text-6xl opacity-30 text-center font-bold;
}

.app-intro-step--title,
.app-intro-step--number {
  @apply text-accent sm:text-primary;
}
</style>
