<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { on } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { ItemStatus, type Item } from '../utils/item'
import { error, log } from '../utils/logs'
import { Tabs, type Display, type Filter } from '../utils/tabs'

const { t } = useI18n()
const counts = ref({ [Tabs.available]: 0, [Tabs.reservedByMe]: 0, [Tabs.all]: 0 })
const filter = ref<Filter>(Tabs.available)

const showTab = (name: Tabs): void => {
  log('showing tab', name)
  if ([Tabs.available, Tabs.reservedByMe, Tabs.all].includes(name)) {
    filter.value = name as Filter
    if (name === Tabs.available) state.items.forEach(item => item.visible = item.status === ItemStatus.available)
    else if (name === Tabs.reservedByMe) state.items.forEach(item => item.visible = item.status === ItemStatus.reservedByMe)
    else if (name === Tabs.all) state.items.forEach(item => item.visible = true)
    state.items = state.items.sort(listSort)
  } else if ([Tabs.list, Tabs.cards].includes(name))
    state.display = name as Display
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
  counts.value[Tabs.available] = state.items.filter(item => item.status === ItemStatus.available).length
  counts.value[Tabs.reservedByMe] = state.items.filter(item => item.status === ItemStatus.reservedByMe).length
  counts.value[Tabs.all] = state.items.length
}

const onItems = (): void => {
  log('updating items list')
  refreshCounts()
  showTab(filter.value)
}

on('sl-tab-show', ({ name }: { name: Tabs }): void => showTab(name))

watch(() => state.items, onItems)
</script>

<template>
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
</template>
