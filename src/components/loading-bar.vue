<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { on } from 'shuutils'
import { ref } from 'vue'

const { t } = useI18n()
const loading = ref(false)

on('loading', (isLoading: boolean) => loading.value = isLoading)
</script>

<template>
  <Transition>
    <div v-if="loading" class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/70 pt-6">
      <p>{{ t('loading') }}</p>
      <sl-spinner style="font-size: 3rem; --indicator-color: deeppink; --track-color: pink;"></sl-spinner>
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
</style>
