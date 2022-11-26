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

function listSort (itemA: Item, itemB: Item): number {
  log('sorting items')
  // sort by availability
  if ([Tab.ReservedByMe, Tab.Available].includes(state.filter)) return Number(itemB.isVisible) - Number(itemA.isVisible)
  // or by name by default
  return itemA.name > itemB.name ? 1 : -1 // eslint-disable-line @typescript-eslint/no-magic-numbers
}

function onFilter (): void {
  log('on filter :', state.filter)
  if (state.filter === Tab.Available) for (const item of state.items) item.isVisible = item.status === ItemStatus.Available
  else if (state.filter === Tab.ReservedByMe) for (const item of state.items) item.isVisible = item.status === ItemStatus.ReservedByMe
  else for (const item of state.items) item.isVisible = true
  // eslint-disable-next-line etc/no-assign-mutated-array
  state.items = state.items.sort(listSort)
}

function onDisplay (): void {
  log('on display :', state.display)
}

function onTab (tab: Tab): void {
  log('on tab :', tab)
  if ([Tab.Available, Tab.ReservedByMe, Tab.All].includes(tab)) state.filter = tab as Filter // eslint-disable-line @typescript-eslint/consistent-type-assertions
  else if ([Tab.List, Tab.Cards].includes(tab)) state.display = tab as Display // eslint-disable-line @typescript-eslint/consistent-type-assertions
  else error('an-error-occurred', `un-handled tab name "${state.filter}"`)
}

function refreshCounts (): void {
  counts.value[Tab.Available] = state.items.filter(item => item.status === ItemStatus.Available).length
  counts.value[Tab.ReservedByMe] = state.items.filter(item => item.status === ItemStatus.ReservedByMe).length
  counts.value[Tab.All] = state.items.length
}

function onItems (): void {
  log('updating items list')
  refreshCounts()
  onFilter()
}

function labelFor (tab: Tab): string {
  if (tab === Tab.Available) return t('tab-available', { count: counts.value[Tab.Available] })
  if (tab === Tab.ReservedByMe) return t('tab-reserved-by-me', { count: counts.value[Tab.ReservedByMe] })
  if (tab === Tab.All) return t('tab-all', { count: counts.value[Tab.All] })
  if (tab === Tab.List) return t('display-list')
  return t('display-card')
}

on('sl-tab-show', ({ name }: { name: Tab }): void => { onTab(name) })

watch(() => state.items, onItems)
watch(() => state.filter, onFilter)
watch(() => state.display, onDisplay)
</script>

<template>
  <div v-if="state.user.email" class="app-items-list--header sm:flex flex-row flex-wrap justify-end items-end">
    <sl-dropdown class="sm:hidden ml-auto">
      <sl-button slot="trigger" caret>
        <template v-if="state.filter === Tab.Available">{{ labelFor(Tab.Available) }}</template>
        <template v-else-if="state.filter === Tab.ReservedByMe">{{ labelFor(Tab.ReservedByMe) }}</template>
        <template v-else-if="state.filter === Tab.All">{{ labelFor(Tab.All) }}</template>
      </sl-button>
      <sl-menu>
        <sl-menu-item v-if="state.filter !== Tab.Available" @click="state.filter = Tab.Available">
          {{ labelFor(Tab.Available) }}
        </sl-menu-item>
        <sl-menu-item v-if="state.filter !== Tab.ReservedByMe" @click="state.filter = Tab.ReservedByMe">
          {{ labelFor(Tab.ReservedByMe) }}
        </sl-menu-item>
        <sl-menu-item v-if="state.filter !== Tab.All" @click="state.filter = Tab.All">
          {{ labelFor(Tab.All) }}
        </sl-menu-item>
      </sl-menu>
    </sl-dropdown>
    <sl-tab-group class="grow hidden sm:block">
      <sl-tab slot="nav" panel="available">{{ labelFor(Tab.Available) }}</sl-tab>
      <sl-tab slot="nav" panel="reserved-by-me">{{ labelFor(Tab.ReservedByMe) }}</sl-tab>
      <sl-tab slot="nav" panel="all">{{ labelFor(Tab.All) }}</sl-tab>
    </sl-tab-group>
    <sl-tab-group class="hidden sm:block">
      <sl-tab slot="nav" panel="list">
        {{ labelFor(Tab.List) }}
        <sl-icon name="list" class="ml-3 mt-1"></sl-icon>
      </sl-tab>
      <sl-tab slot="nav" panel="cards">
        {{ labelFor(Tab.Cards) }}
        <sl-icon name="card-heading" class="ml-3 mt-1"></sl-icon>
      </sl-tab>
    </sl-tab-group>
  </div>
</template>
