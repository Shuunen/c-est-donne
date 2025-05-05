<script setup lang="ts">
import { ref } from 'vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { state } from '../state'
import { $t } from '../utils/translate.utils'

// eslint-disable-next-line no-useless-assignment
const currentSlide = ref(0)

// eslint-disable-next-line no-useless-assignment
const steps = [
  {
    description: $t('step-1-description'),
    image: '/step-1-choose.svg',
    title: $t('step-1-title'),
  },
  {
    description: $t('step-2-description'),
    image: '/step-2-contact-me.svg',
    title: $t('step-2-title'),
  },
  {
    description: $t('step-3-description'),
    image: '/step-3-profits.svg',
    title: $t('step-3-title'),
  },
]
</script>

<template>
  <div class="app-intro mt-12 flex flex-col gap-8">
    <h1 class="text-center text-4xl">{{ $t('intro-title') }}</h1>
    <p class="text-center text-xl">{{ $t('intro-description') }}</p>
    <div class="app-intro-steps">
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
      <div :class="{ active: currentSlide === index }" :key="`step-${index}`" @click="() => currentSlide = index"
        class="app-intro-step flex flex-col gap-2" v-for="step, index in steps">
        <span class="app-intro-step--number">{{ index + 1 }}</span>
        <h2 class="app-intro-step--title">{{ step.title }}</h2>
        <p class="text-center text-lg text-purple-100">{{ step.description }}</p>
        <img :alt="`step ${index + 1}`" :src="step.image" class="mb-4 mt-2 w-full sm:hidden">
      </div>
    </div>
    <carousel v-model="currentSlide" wrap-around>
      <slide :key="`slide-${index}`" v-for="step, index in steps">
        <img :alt="`slide ${index + 1}`" :src="step.image" class="max-h-[30vh] min-h-[30rem] w-full">
      </slide>
      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
    <sl-alert open v-if="!state.user.isConnected" variant="primary">
      <sl-icon name="info-circle" slot="icon" />
      <strong>{{ $t('intro-login') }}</strong><br>
      {{ $t('please-login') }}
    </sl-alert>
    <img alt="blob" class="h-44" src="/blob-2.svg" v-if="state.user.isConnected">
    <div class="mx-auto" v-else>
      <login-button />
    </div>
  </div>
</template>

<style scoped>
@import url("vue3-carousel/dist/carousel.css");
@reference "tailwindcss";

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
  @apply rounded-full w-3 h-3;
}

button.carousel__pagination-button--active {
  background-color: hsl(var(--color-accent));
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
  @apply opacity-100;
  color: hsl(var(--color-accent));
}

.app-intro-step--title {
  @apply text-center text-2xl;
}

.app-intro-step.active .app-intro-step--title,
.app-intro-step.active .app-intro-step--number {
  color: hsl(var(--color-accent));
}

.app-intro-step--number {
  @apply text-6xl opacity-30 text-center font-bold;
}

.app-intro-step--title,
.app-intro-step--number {
  color: hsl(var(--color-accent));
}
</style>
