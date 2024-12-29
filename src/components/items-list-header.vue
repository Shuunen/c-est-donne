<script setup>
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group'
import { capitalize } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { Item, ItemStatus } from '../utils/items.utils'
import { log } from '../utils/logger.utils'
import { Display, Filter } from '../utils/tabs.utils'
import { $t } from '../utils/translate.utils'

const counts = ref({ [Filter.All]: 0, [Filter.Available]: 0, [Filter.ReservedByMe]: 0 })
const filterTabs = ref()
const displayTabs = ref()

/**
 * @param {Item} itemA the first item to compare
 * @param {Item} itemB the second item to compare
 * @returns {number} the sorting order
 */
function listSort (itemA, itemB) {
  log('sorting items')
  // sort by availability if filter is set
  if ([Filter.Available, Filter.ReservedByMe].includes(state.filter)) return Number(itemB.isVisible) - Number(itemA.isVisible)
  // else by name
  return itemA.name > itemB.name ? 1 : -1
}

function onFilter () {
  log('on filter :', state.filter)
  if (state.filter === Filter.Available) for (const item of state.items) item.isVisible = item.status === ItemStatus.Available
  else if (state.filter === Filter.ReservedByMe) for (const item of state.items) item.isVisible = item.status === ItemStatus.ReservedByMe
  else for (const item of state.items) item.isVisible = true
  state.items = state.items.sort(listSort)
  filterTabs.value?.show(state.filter)
}

function onDisplay () {
  log('on display :', state.display, displayTabs.value)
  displayTabs.value?.show(state.display)
}

function refreshCounts () {
  counts.value[Filter.Available] = state.items.filter(item => item.status === ItemStatus.Available).length
  counts.value[Filter.ReservedByMe] = state.items.filter(item => item.status === ItemStatus.ReservedByMe).length
  counts.value[Filter.All] = state.items.length
}

function onItems () {
  log('updating items list')
  refreshCounts()
  onFilter()
  onDisplay()
}

/**
 * @param {Filter} tab the tab to get the label for
 * @returns {string} the label for the tab
 */
function labelFor (tab) {
  if (tab === Filter.Available) return $t('tab-available', { count: counts.value[Filter.Available] })
  if (tab === Filter.ReservedByMe) return $t('tab-reserved-by-me', { count: counts.value[Filter.ReservedByMe] })
  return $t('tab-all', { count: counts.value[Filter.All] })
}

function showAll () {
  state.filter = Filter.All
}
function showAvailable () {
  state.filter = Filter.Available
}
function showReservedByMe () {
  state.filter = Filter.ReservedByMe
}
function showList () {
  state.display = Display.List
}
function showCards () {
  state.display = Display.Cards
}

watch(() => state.items, onItems)
watch(() => state.filter, onFilter)
watch(() => state.display, onDisplay)
</script>

<template>
  <div class="app-items-list--header flex-row flex-wrap items-end justify-end sm:flex" v-if="state.user.email">
    <div class="flex items-center justify-end gap-3 sm:hidden">
      <p>{{ $t('display') }}</p>
      <sl-dropdown>
        <sl-button caret slot="trigger">
          <template v-if="state.filter === Filter.Available">{{ labelFor(Filter.Available) }}</template>
          <template v-else-if="state.filter === Filter.ReservedByMe">{{ labelFor(Filter.ReservedByMe) }}</template>
          <template v-else-if="state.filter === Filter.All">{{ labelFor(Filter.All) }}</template>
        </sl-button>
        <sl-menu>
          <sl-menu-item @click="showAvailable" v-if="state.filter !== Filter.Available">
            {{ labelFor(Filter.Available) }}
          </sl-menu-item>
          <sl-menu-item @click="showReservedByMe" v-if="state.filter !== Filter.ReservedByMe">
            {{ labelFor(Filter.ReservedByMe) }}
          </sl-menu-item>
          <sl-menu-item @click="showAll" v-if="state.filter !== Filter.All">
            {{ labelFor(Filter.All) }}
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    </div>
    <sl-tab-group class="hidden grow sm:block" ref="filterTabs">
      <sl-tab @click="showAvailable" panel="available" slot="nav">{{ capitalize(labelFor(Filter.Available)) }}</sl-tab>
      <sl-tab @click="showReservedByMe" panel="reserved-by-me" slot="nav">{{ capitalize(labelFor(Filter.ReservedByMe)) }}</sl-tab>
      <sl-tab @click="showAll" panel="all" slot="nav">{{ capitalize(labelFor(Filter.All)) }}</sl-tab>
    </sl-tab-group>
    <sl-tab-group class="hidden sm:block" ref="displayTabs">
      <sl-tab @click="showList" panel="list" slot="nav">
        {{ $t('display-list') }}
        <sl-icon class="ml-3 mt-1" name="list" />
      </sl-tab>
      <sl-tab @click="showCards" panel="cards" slot="nav">
        {{ $t('display-card') }}
        <sl-icon class="ml-3 mt-1" name="card-heading" />
      </sl-tab>
    </sl-tab-group>
  </div>
  <div v-else />
</template>
