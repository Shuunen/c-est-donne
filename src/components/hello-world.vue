<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <h1 class="my-12 text-4xl">{{ msg }}</h1>
    <sl-input v-model="count" maxlength="255" clearable label="Value"></sl-input>
    <sl-button @click="count++">Increment</sl-button>
  </div>
</template>
