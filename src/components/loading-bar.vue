<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { debounce } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'

const { t } = useI18n()
const loading = ref(false)
const delay = 400

function showLoading (): void { loading.value = true }
function hideLoadingSync (): void { loading.value = false }
const hideLoading = debounce(hideLoadingSync, delay)

function onLoading (isLoading: boolean): void {
  if (isLoading) showLoading()
  else void hideLoading()
}

watch(() => state.isLoading, (isLoading: boolean) => { onLoading(isLoading) })
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
