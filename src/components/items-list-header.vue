<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<script setup lang="ts">
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group'
import { useI18n } from 'petite-vue-i18n'
import { capitalize } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { ItemStatus, type Item } from '../utils/items'
import { log } from '../utils/logs'
import { Display, Filter } from '../utils/tabs'


const { t } = useI18n()
const counts = ref({ [Filter.Available]: 0, [Filter.ReservedByMe]: 0, [Filter.All]: 0 })
const filterTabs = ref<SlTabGroup>()
const displayTabs = ref<SlTabGroup>()

function listSort (itemA: Item, itemB: Item): number {
  log('sorting items')
  // sort by availability
  if ([Filter.ReservedByMe, Filter.Available].includes(state.filter)) return Number(itemB.isVisible) - Number(itemA.isVisible)
  // or by name by default
  return itemA.name > itemB.name ? 1 : -1 // eslint-disable-line @typescript-eslint/no-magic-numbers
}

function onFilter (): void {
  log('on filter :', state.filter)
  if (state.filter === Filter.Available) for (const item of state.items) item.isVisible = item.status === ItemStatus.Available
  else if (state.filter === Filter.ReservedByMe) for (const item of state.items) item.isVisible = item.status === ItemStatus.ReservedByMe
  else for (const item of state.items) item.isVisible = true
  // eslint-disable-next-line etc/no-assign-mutated-array
  state.items = state.items.sort(listSort)
  filterTabs.value?.show(state.filter)
}

function onDisplay (): void {
  log('on display :', state.display, displayTabs.value)
  displayTabs.value?.show(state.display)
}

function refreshCounts (): void {
  counts.value[Filter.Available] = state.items.filter(item => item.status === ItemStatus.Available).length
  counts.value[Filter.ReservedByMe] = state.items.filter(item => item.status === ItemStatus.ReservedByMe).length
  counts.value[Filter.All] = state.items.length
}

function onItems (): void {
  log('updating items list')
  refreshCounts()
  onFilter()
  onDisplay()
}

function labelFor (tab: Filter): string {
  if (tab === Filter.Available) return t('tab-available', { count: counts.value[Filter.Available] })
  if (tab === Filter.ReservedByMe) return t('tab-reserved-by-me', { count: counts.value[Filter.ReservedByMe] })
  return t('tab-all', { count: counts.value[Filter.All] })
}

function showAll (): void {
  state.filter = Filter.All
}
function showAvailable (): void {
  state.filter = Filter.Available
}
function showReservedByMe (): void {
  state.filter = Filter.ReservedByMe
}
function showList (): void {
  state.display = Display.List
}
function showCards (): void {
  state.display = Display.Cards
}

watch(() => state.items, onItems)
watch(() => state.filter, onFilter)
watch(() => state.display, onDisplay)
</script>

<template>
  <div v-if="state.user.email" class="app-items-list--header flex-row flex-wrap items-end justify-end sm:flex">
    <div class="flex items-center justify-end gap-3 sm:hidden">
      <p>{{ t('display') }}</p>
      <sl-dropdown>
        <sl-button slot="trigger" caret>
          <template v-if="state.filter === Filter.Available">{{ labelFor(Filter.Available) }}</template>
          <template v-else-if="state.filter === Filter.ReservedByMe">{{ labelFor(Filter.ReservedByMe) }}</template>
          <template v-else-if="state.filter === Filter.All">{{ labelFor(Filter.All) }}</template>
        </sl-button>
        <sl-menu>
          <sl-menu-item v-if="state.filter !== Filter.Available" @click="showAvailable">
            {{ labelFor(Filter.Available) }}
          </sl-menu-item>
          <sl-menu-item v-if="state.filter !== Filter.ReservedByMe" @click="showReservedByMe">
            {{ labelFor(Filter.ReservedByMe) }}
          </sl-menu-item>
          <sl-menu-item v-if="state.filter !== Filter.All" @click="showAll">
            {{ labelFor(Filter.All) }}
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    </div>
    <sl-tab-group ref="filterTabs" class="hidden grow sm:block">
      <sl-tab slot="nav" panel="available" @click="showAvailable">{{ capitalize(labelFor(Filter.Available)) }}</sl-tab>
      <sl-tab slot="nav" panel="reserved-by-me" @click="showReservedByMe">{{ capitalize(labelFor(Filter.ReservedByMe)) }}</sl-tab>
      <sl-tab slot="nav" panel="all" @click="showAll">{{ capitalize(labelFor(Filter.All)) }}</sl-tab>
    </sl-tab-group>
    <sl-tab-group ref="displayTabs" class="hidden sm:block">
      <sl-tab slot="nav" panel="list" @click="showList">
        {{ t('display-list') }}
        <sl-icon name="list" class="ml-3 mt-1"></sl-icon>
      </sl-tab>
      <sl-tab slot="nav" panel="cards" @click="showCards">
        {{ t('display-card') }}
        <sl-icon name="card-heading" class="ml-3 mt-1"></sl-icon>
      </sl-tab>
    </sl-tab-group>
  </div>
</template>
