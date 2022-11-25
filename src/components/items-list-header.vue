<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { on } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { ItemStatus, type Item } from '../utils/items'
import { error, log } from '../utils/logs'
import { Tab, type Display, type Filter } from '../utils/tabs'

const { t } = useI18n()
const counts = ref({ [Tab.Available]: 0, [Tab.ReservedByMe]: 0, [Tab.All]: 0 })
const filter = ref<Filter>(Tab.Available)

function listSort (itemA: Item, itemB: Item): number {
  log('sorting items')
  // sort by availability
  if ([Tab.ReservedByMe, Tab.Available].includes(filter.value)) return Number(itemB.isVisible) - Number(itemA.isVisible)
  // or by name by default
  return itemA.name > itemB.name ? 1 : -1 // eslint-disable-line @typescript-eslint/no-magic-numbers
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function showTab (name: Tab): void {
  log('showing tab', name)
  if ([Tab.Available, Tab.ReservedByMe, Tab.All].includes(name)) {
    filter.value = name as Filter // eslint-disable-line @typescript-eslint/consistent-type-assertions
    if (name === Tab.Available) for (const item of state.items) item.isVisible = item.status === ItemStatus.Available
    else if (name === Tab.ReservedByMe) for (const item of state.items) item.isVisible = item.status === ItemStatus.ReservedByMe
    else if (name === Tab.All) for (const item of state.items) item.isVisible = true
    else throw new Error('unhandled case')
    // eslint-disable-next-line etc/no-assign-mutated-array
    state.items = state.items.sort(listSort)
  } else if ([Tab.List, Tab.Cards].includes(name))
    state.display = name as Display // eslint-disable-line @typescript-eslint/consistent-type-assertions
  else error('an-error-occurred', `un-handled tab name "${name}"`)
}

function refreshCounts (): void {
  counts.value[Tab.Available] = state.items.filter(item => item.status === ItemStatus.Available).length
  counts.value[Tab.ReservedByMe] = state.items.filter(item => item.status === ItemStatus.ReservedByMe).length
  counts.value[Tab.All] = state.items.length
}

function onItems (): void {
  log('updating items list')
  refreshCounts()
  showTab(filter.value)
}

on('sl-tab-show', ({ name }: { name: Tab }): void => { showTab(name) })

watch(() => state.items, onItems)
</script>

<template>
  <div v-if="state.user.email" class="app-items-list--header hidden sm:flex flex-row flex-wrap justify-end items-end">
    <sl-tab-group class="grow">
      <sl-tab slot="nav" panel="available">{{ t('tab-available', { count: counts[Tab.Available] }) }}</sl-tab>
      <sl-tab slot="nav" panel="reserved-by-me">{{ t('tab-reserved-by-me', { count: counts[Tab.ReservedByMe] }) }}</sl-tab>
      <sl-tab slot="nav" panel="all">{{ t('tab-all', { count: counts[Tab.All] }) }}</sl-tab>
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
