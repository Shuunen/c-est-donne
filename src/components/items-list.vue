<script setup lang="ts">
import { capitalize } from 'shuutils'
import { computed } from 'vue'
import { state } from '../state'
import { updateItemStatus } from '../utils/api.utils'
import { type Item, ItemStatus } from '../utils/items.utils'
import { Display } from '../utils/tabs.utils'
import { $t } from '../utils/translate.utils'

// eslint-disable-next-line no-useless-assignment
const showCards = computed(() => state.display === Display.Cards)

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
function toggleStatus (item: Item) {
  const updatedStatus = item.status === ItemStatus.Available ? ItemStatus.Reserved : ItemStatus.Available
  void updateItemStatus(item.id, updatedStatus)
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
function addedOnTime (item: Item) {
  return item.createdTime.toLocaleDateString(state.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="grid gap-6">
    <items-list-header />
    <div :class="{ 'sm:grid-cols-2 md:grid-cols-3': showCards }" class="grid gap-6">
      <div :class="{ hidden: !item.isVisible, 'flex-col': showCards }" :key="item.id" :style="`animation-delay: ${200 * index}ms;`"
        class="app-item app-fade-in flex overflow-hidden rounded border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        v-for="item, index in state.items">
        <img :alt="`${item.name} image`" :class="{ 'h-64 p-6': showCards, 'max-h-56 min-h-12 w-1/3 p-4': !showCards }"
          :src="item.images[0] ?? '/no-visual.svg'" class=" shrink-0 bg-white object-contain dark:brightness-75 dark:saturate-[1.2]">
        <div :class="{ 'w-2/3': !showCards }" class="flex grow flex-col">
          <div class="app-item-body flex grow flex-col gap-2 p-4 ">
            <strong :class="{ 'mt-2 text-xl': !showCards }" class="ellipsis">{{ item.name }}</strong>
            <p :class="{ ellipsis: showCards }">{{ capitalize(item.notes) || $t('item-no-notes') }}</p>
            <p class="text-neutral-500">{{ $t('item-added-on', { time: addedOnTime(item) }) }}</p>
          </div>
          <div class="app-item-footer mt-auto flex justify-between gap-3 border-t border-neutral-200 p-4 dark:border-t-2 dark:border-neutral-700">
            <div class="app-item-status flex items-center gap-2">
              <div class="text-green-700 dark:text-green-500" v-if="item.status === ItemStatus.Available">
                {{ $t('status-available') }}
                <sl-icon name="bag-plus" />
              </div>
              <div class="text-green-700 dark:text-green-500" v-else-if="item.status === ItemStatus.ReservedByMe">
                {{ $t('status-reserved-by-me') }}
                <sl-icon name="bag-check" />
              </div>
              <div class="text-orange-700 dark:text-orange-400" v-else-if="item.status === ItemStatus.Reserved">
                {{ $t('status-reserved') }}
                <sl-icon name="bag-x" />
              </div>
              <div class="text-accent" v-else-if="item.status === ItemStatus.Gone">
                {{ $t('status-gone') }}
                <sl-icon name="bag" />
              </div>
            </div>
            <sl-button :outline="item.status === ItemStatus.ReservedByMe" @click="() => toggleStatus(item)" pill v-if="item.canBeToggle"
              variant="primary">
              {{ item.status === ItemStatus.ReservedByMe ? $t('i-wont-take-it') : $t('i-take-it') }}
            </sl-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img alt="blob" aria-hidden="true" class="h-44" src="/blob-1.svg" v-if="state.user.isConnected">
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
