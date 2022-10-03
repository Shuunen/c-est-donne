<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { ellipsis, emit, on } from 'shuutils'
import { ref } from 'vue'
import type { Item } from '../services/items'
import { getUser } from '../utils/user'

const { t } = useI18n()
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
      <strong>{{ t('welcome', {name: user.firstName}) }}</strong><br />
      {{ t('items-remaining', {number: items.length}) }}
    </sl-alert>
  </Transition>

  <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <sl-card v-for="item, index in items" :key="item.id" :style="`animation-delay: ${200 * index}ms;`" class="app-item app-fade-in">
      <img slot="image" class="mx-auto mt-6 h-52 w-10/12 object-contain" :src="item.images[0] ?? '/no-visual.svg'" :alt="item.name + 'image'" />

      <strong class="mb-2 inline-block">{{ item.name }}</strong><br />
      <span v-if="item.notes.length > 0">{{ ellipsis(item.notes, 25) }}<br /></span>
      <small class="mt-3 inline-block">{{ t('status', {status: t('status-'+item.status)}) }}</small>

      <div slot="footer" class="flex justify-between">
        <sl-button variant="neutral" outline pill>{{ t('view-details') }}</sl-button>
        <sl-button variant="primary" pill>{{ t('i-take-it') }}</sl-button>
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
