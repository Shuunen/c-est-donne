<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { capitalize, ellipsis } from 'shuutils'
import { state } from '../state'
import { ItemStatus } from '../utils/item'

const { t } = useI18n()
</script>

<template>
  <div class="grid gap-6">
    <items-list-header />
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <sl-card v-for="item, index in state.items" :key="item.id" :style="`animation-delay: ${200 * index}ms;`" class="app-item app-fade-in"
        :class="{ hidden: !item.visible }">
        <img slot="image" class="h-64 bg-white object-contain p-6 dark:brightness-75 dark:saturate-[1.2]" :src="item.images[0] ?? '/no-visual.svg'"
          :alt="item.name + 'image'" />

        <strong class="mb-2 inline-block">{{ item.name }}</strong><br />
        <span>{{ capitalize(ellipsis(item.notes, 25)) }}<br /></span>

        <div v-if="item.status === ItemStatus.available" class="app-item-status text-green-700 dark:text-green-500">
          {{ t('status-available') }}
          <sl-icon name="bag-plus"></sl-icon>
        </div>
        <div v-else-if="item.status === ItemStatus.reservedByMe" class="app-item-status text-green-700 dark:text-green-500">
          {{ t('status-reserved-by-me') }}
          <sl-icon name="bag-check"></sl-icon>
        </div>
        <div v-else-if="item.status === ItemStatus.reserved" class="app-item-status text-orange-700 dark:text-orange-400">
          {{ t('status-reserved') }}
          <sl-icon name="bag-x"></sl-icon>
        </div>
        <div v-else-if="item.status === ItemStatus.gone" class="app-item-status text-accent">
          {{ t('status-gone') }}
          <sl-icon name="bag"></sl-icon>
        </div>

        <div slot="footer" class="flex justify-between">
          <sl-button variant="neutral" outline pill @click="state.viewItem = item">{{ t('view-details') }}</sl-button>
          <sl-button v-if="item.canBeToggle" :outline="item.status === ItemStatus.reservedByMe" variant="primary" pill @click="item.toggleStatus()">
            {{ item.status === ItemStatus.reservedByMe ? t('i-wont-take-it') : t('i-take-it') }}
          </sl-button>
        </div>
      </sl-card>
    </div>
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

.app-item-status {
  @apply mt-3 flex items-center gap-2;
}

.app-item::part(footer) {
  @apply border-t-2;
}
</style>
