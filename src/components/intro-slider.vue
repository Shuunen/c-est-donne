<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { ref } from 'vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import { state } from '../state'

const currentSlide = ref(0)
const { t } = useI18n()

const steps = [
  {
    title: t('step-1-title'),
    description: t('step-1-description'),
    image: '/step-1-choose.svg',
  },
  {
    title: t('step-2-title'),
    description: t('step-2-description'),
    image: '/step-2-contact-me.svg',
  },
  {
    title: t('step-3-title'),
    description: t('step-3-description'),
    image: '/step-3-profits.svg',
  },
]
</script>

<template>
  <div class="app-intro flex flex-col gap-8 mt-12">
    <h1 class="text-center text-4xl">{{ $t('intro-title') }}</h1>
    <p class="text-center text-xl">{{ $t('intro-description') }}</p>
    <div class="app-intro-steps">
      <div v-for="step, index in steps" :key="`step-${index}`" class="app-intro-step flex flex-col gap-2" :class="{ active: currentSlide === index }"
        @click="() => currentSlide = index">
        <span class="app-intro-step--number">{{ index + 1 }}</span>
        <h2 class="app-intro-step--title">{{ step.title }}</h2>
        <p class="text-primary text-center text-lg">{{ step.description }}</p>
        <img class="w-full mt-2 mb-4 sm:hidden" :src="step.image" />
      </div>
    </div>
    <carousel v-model="currentSlide" wrap-around>
      <slide v-for="step, index in steps" :key="`slide-${index}`">
        <img class="min-h-[30rem] max-h-[30vh] w-full" :src="step.image" />
      </slide>
      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
    <sl-alert v-if="!state.user.isConnected" variant="primary" open>
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      <strong>{{ t('intro-login') }}</strong><br />
      {{ t('please-login') }}
    </sl-alert>
    <img v-if="state.user.isConnected" class="h-44" src="/blob-2.svg" />
    <div v-else class="mx-auto">
      <login-button />
    </div>
  </div>
</template>

<style>
@import url("vue3-carousel/dist/carousel.css");

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
