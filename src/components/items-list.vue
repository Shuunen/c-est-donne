<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { capitalize, ellipsis, emit, on } from 'shuutils'
import { ref } from 'vue'
import { Item, ItemStatus } from '../models/item'
import { Display, Filter, Tabs } from '../models/tabs'
import { error, log } from '../utils/logs'

const { t } = useI18n()
const items = ref<Item[]>([])
const display = ref<Display>(Tabs.list)
const filter = ref<Filter>(Tabs.available)
const counts = ref({ [Tabs.available]: 0, [Tabs.reservedByMe]: 0, [Tabs.all]: 0 })

const showTab = (name: Tabs): void => {
  log('showing tab', name)
  if ([Tabs.available, Tabs.reservedByMe, Tabs.all].includes(name)) {
    filter.value = name as Filter
    if (name === Tabs.available) items.value.forEach(item => item.visible = item.status === ItemStatus.available)
    else if (name === Tabs.reservedByMe) items.value.forEach(item => item.visible = item.status === ItemStatus.reservedByMe)
    else if (name === Tabs.all) items.value.forEach(item => item.visible = true)
    items.value = items.value.sort(listSort)
  } else if ([Tabs.list, Tabs.cards].includes(name))
    display.value = name as Display
  else error('an-error-occurred', `un-handled tab name "${name}"`)
}

const listSort = (a: Item, b: Item): number => {
  log('sorting items')
  // sort by availability
  if ([Tabs.reservedByMe, Tabs.available].includes(filter.value)) return Number(b.visible) - Number(a.visible)
  // or by name by default
  return a.name > b.name ? 1 : -1
}

const refreshCounts = (): void => {
  counts.value[Tabs.available] = items.value.filter(item => item.status === ItemStatus.available).length
  counts.value[Tabs.reservedByMe] = items.value.filter(item => item.status === ItemStatus.reservedByMe).length
  counts.value[Tabs.all] = items.value.length
}

const onListItems = (list: Item[]): void => {
  log('updating items list')
  items.value = list
  refreshCounts()
  showTab(filter.value)
}

on('sl-tab-show', ({ name }: { name: Tabs }): void => showTab(name))
on('list-items', onListItems)
</script>

<template>
  <div class="grid gap-6">
    <div class="app-items-list--header flex flex-row items-end">
      <sl-tab-group class="grow">
        <sl-tab slot="nav" panel="available">{{ t('tab-available', { count: counts[Tabs.available] }) }}</sl-tab>
        <sl-tab slot="nav" panel="reserved-by-me">{{ t('tab-reserved-by-me', { count: counts[Tabs.reservedByMe] }) }}</sl-tab>
        <sl-tab slot="nav" panel="all">{{ t('tab-all', { count: counts[Tabs.all] }) }}</sl-tab>
      </sl-tab-group>
      <sl-tab-group>
        <sl-tab slot="nav" panel="list">
          {{ t('display-list') }}
          <sl-icon name="list" class="ml-3 mt-1"></sl-icon>
        </sl-tab>
        <sl-tab slot="nav" panel="cards">
          {{ t('display-card') }}
          <sl-icon name="card-heading" class="ml-3 mt-1"></sl-icon>
        </sl-tab>
      </sl-tab-group>
    </div>
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <sl-card v-for="item, index in items" :key="item.id" :style="`animation-delay: ${200 * index}ms;`" class="app-item app-fade-in"
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
          <sl-button variant="neutral" outline pill @click="emit('item-details', item)">{{ t('view-details') }}</sl-button>
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
