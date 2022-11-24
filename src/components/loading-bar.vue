<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { debounce } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'

const { t } = useI18n()
const loading = ref(false)

const showLoading = (): void => { loading.value = true }
const hideLoadingSync = (): void => { loading.value = false }
const hideLoading = debounce(hideLoadingSync, 400)

watch(() => state.loading, (isLoading: boolean) => isLoading ? showLoading() : hideLoading())
</script>

<template>
  <Transition>
    <div v-if="loading" class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/70 pt-6">
      <p class="text-xl text-white">{{ t('loading') }}</p>
      <sl-spinner></sl-spinner>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

sl-spinner {
  font-size: 4rem;
  --indicator-color: hsl(var(--color-accent));
  --track-width: 4px;
  --track-color: hsl(var(--color-accent));
}
</style>
