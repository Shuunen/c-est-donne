<script setup>
import { debounce } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { $t } from '../utils/translate.utils'

const loading = ref(false)
const delay = 400

function showLoading () { loading.value = true }
function hideLoadingSync () { loading.value = false }
const hideLoading = debounce(hideLoadingSync, delay)

/**
 * @param {boolean} isLoading whether the app is loading
 */
function onLoading (isLoading) {
  if (isLoading) showLoading()
  else void hideLoading()
}

watch(() => state.isLoading, (isLoading) => { onLoading(isLoading) })
</script>

<template>
  <Transition>
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/70 pt-6" v-if="loading">
      <p class="text-xl text-white">{{ $t('loading') }}</p>
      <sl-spinner />
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
