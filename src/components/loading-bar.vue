<script setup lang="ts">
import { on } from 'shuutils'
import { ref } from 'vue'

const loading = ref(false)

on('loading', (isLoading: boolean) => loading.value = isLoading)
</script>

<template>
  <Transition>
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
