<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { capitalize } from 'shuutils'
import { computed } from 'vue'
import { state } from '../state'
import { updateItemStatus } from '../utils/api'
import { ItemStatus, type Item } from '../utils/items'
import { Display } from '../utils/tabs'

const { t } = useI18n()
const showCards = computed(() => state.display === Display.Cards)

function toggleStatus (item: Item): void {
  const updatedStatus = item.status === ItemStatus.Available ? ItemStatus.Reserved : ItemStatus.Available
  void updateItemStatus(item.id, updatedStatus)
}
</script>

<template>
  <div class="grid gap-6">
    <items-list-header />
    <div class="grid gap-6" :class="{ 'sm:grid-cols-2 md:grid-cols-3': showCards }">
      <div v-for="item, index in state.items" :key="item.id" :style="`animation-delay: ${200 * index}ms;`"
        class="app-item app-fade-in border border-neutral-300 dark:border-neutral-700 flex bg-white dark:bg-neutral-800 rounded shadow-md overflow-hidden"
        :class="{ hidden: !item.isVisible, 'flex-col': showCards }">
        <img class=" bg-white object-contain shrink-0 dark:brightness-75 dark:saturate-[1.2]" :src="item.images[0] ?? '/no-visual.svg'"
          :class="{ 'h-64 p-6': showCards, 'min-h-[3rem] max-h-56 w-1/3 p-4': !showCards }" :alt="`${item.name}image`" />
        <div class="flex flex-col grow" :class="{ 'w-2/3': !showCards }">
          <div class="app-item-body p-4 flex flex-col grow gap-2 ">
            <strong :class="{ 'text-xl mt-2': !showCards }" class="ellipsis">{{ item.name }}</strong>
            <p :class="{ ellipsis: showCards }">{{ capitalize(item.notes) || t('item-no-notes') }}</p>
            <p class="text-neutral-500">{{ t('item-added-on', {
                time: item.createdTime.toLocaleDateString(state.locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })
              })
            }}</p>
          </div>
          <div class="app-item-footer p-4 border-t dark:border-t-2 border-neutral-200 dark:border-neutral-700 flex gap-3 justify-between mt-auto">
            <div class="app-item-status flex items-center gap-2">
              <div v-if="item.status === ItemStatus.Available" class="text-green-700 dark:text-green-500">
                {{ t('status-available') }}
                <sl-icon name="bag-plus"></sl-icon>
              </div>
              <div v-else-if="item.status === ItemStatus.ReservedByMe" class="text-green-700 dark:text-green-500">
                {{ t('status-reserved-by-me') }}
                <sl-icon name="bag-check"></sl-icon>
              </div>
              <div v-else-if="item.status === ItemStatus.Reserved" class="text-orange-700 dark:text-orange-400">
                {{ t('status-reserved') }}
                <sl-icon name="bag-x"></sl-icon>
              </div>
              <div v-else-if="item.status === ItemStatus.Gone" class="text-accent">
                {{ t('status-gone') }}
                <sl-icon name="bag"></sl-icon>
              </div>
            </div>
            <sl-button v-if="item.canBeToggle" :outline="item.status === ItemStatus.ReservedByMe" variant="primary" pill @click="() => toggleStatus(item)">
              {{ item.status === ItemStatus.ReservedByMe ? t('i-wont-take-it') : t('i-take-it') }}
            </sl-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img v-if="state.user.isConnected" class="h-44" src="/blob-1.svg" />
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
