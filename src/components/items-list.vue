<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<script setup lang="ts">
import { ellipsis, emit, on } from 'shuutils'
import { ref } from 'vue'
import type { Item } from '../services/items'
import { getUser } from '../utils/user'

const items = ref<Item[]>([])
const user = ref(getUser())

on('list-items', (list: Item[]) => {
  items.value = list
  emit('loading', false)
})
</script>

<template>
  <Transition>
    <sl-alert v-if="items.length > 0" variant="success" open class="mb-6">
      <sl-icon slot="icon" name="check2-circle"></sl-icon>
      <strong>Welcome {{ user.name }} !</strong><br />
      There is {{ items.length }} items remaining, check them out 👇
    </sl-alert>
  </Transition>

  <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <sl-card v-for="item, index in items" :key="item.id" :style="`animation-delay: ${200 * index}ms;`" class="app-item app-fade-in">
      <img slot="image" class="mx-auto mt-6 h-52 w-10/12 object-contain" :src="item.images[0] ?? '/no-visual.svg'" :alt="item.name + 'image'" />

      <strong class="mb-2 inline-block">{{ item.name }}</strong><br />
      <span v-if="item.notes.length > 0">{{ ellipsis(item.notes, 25) }}<br /></span>
      <small class="mt-3 inline-block">Status : {{ item.status }}</small>

      <div slot="footer" class="flex justify-between">
        <sl-button variant="neutral" outline pill>View details</sl-button>
        <sl-button variant="primary" pill>More Info</sl-button>
      </div>
    </sl-card>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.app-fade-in {
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-fill-mode: both;
}
</style>
