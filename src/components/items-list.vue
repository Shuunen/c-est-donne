<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { capitalize, ellipsis, emit, on } from 'shuutils'
import { ref } from 'vue'
import { Item, ItemStatus } from '../models/item'
import { getUser, User } from '../utils/user'

const { t } = useI18n()
const items = ref<Item[]>([])
const user = ref(getUser())
const loading = ref(false)

on('loading', (state: boolean) => loading.value = state)

on('list-items', (list: Item[]) => {
  items.value = list
  emit('loading', false)
})

on('user', (data: User) => user.value = data)
</script>

<template>
  <sl-alert v-if="loading" variant="primary" open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ t('welcome') }}</strong><br />
    {{ t('loading') }}
  </sl-alert>
  <sl-alert v-else-if="!user.isConnected" variant="primary" open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ t('welcome') }}</strong><br />
    {{ t('please-login') }}
  </sl-alert>
  <sl-alert v-else-if="!user.hasAccess" variant="warning" open>
    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
    <strong>{{ t('welcome', {name: user.firstName}) }}</strong><br />
    {{ t('no-access') }}
  </sl-alert>
  <sl-alert v-else-if="items.length > 0" variant="primary" open class="mb-6">
    <sl-icon slot="icon" name="check2-circle"></sl-icon>
    <strong>{{ t('welcome', {name: user.firstName}) }}</strong><br />
    {{ t('items-remaining', {number: items.length}) }}
  </sl-alert>
  <sl-alert v-else-if="items.length === 0" variant="primary" open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ t('welcome', {name: user.firstName}) }}</strong><br />
    {{ t('no-items-remaining') }}
  </sl-alert>

  <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <sl-card v-for="item, index in items" :key="item.id" :style="`animation-delay: ${200 * index}ms;`" class="app-item app-fade-in">
      <img slot="image" class="mx-auto mt-6 h-52 w-10/12 object-contain" :src="item.images[0] ?? '/no-visual.svg'" :alt="item.name + 'image'" />

      <strong class="mb-2 inline-block">{{ item.name }}</strong><br />
      <span>{{ capitalize(ellipsis(item.notes, 25)) }}<br /></span>

      <div v-if="item.status === ItemStatus.available" class="app-item-status text-green-700">
        {{ t('status-available') }}
        <sl-icon name="bag-plus"></sl-icon>
      </div>
      <div v-else-if="item.status === ItemStatus.reservedByMe" class="app-item-status text-green-700">
        {{ t('status-reserved-by-me') }}
        <sl-icon name="bag-check"></sl-icon>
      </div>
      <div v-else-if="item.status === ItemStatus.reserved" class="app-item-status text-orange-700">
        {{ t('status-reserved') }}
        <sl-icon name="bag-x"></sl-icon>
      </div>
      <div v-else-if="item.status === ItemStatus.gone" class="app-item-status text-accent">
        {{ t('status-gone') }}
        <sl-icon name="bag"></sl-icon>
      </div>

      <div slot="footer" class="flex justify-between">
        <sl-button variant="neutral" outline pill>{{ t('view-details') }}</sl-button>
        <sl-button v-if="[ItemStatus.reservedByMe, ItemStatus.available].includes(item.status)" variant="primary" pill>
          {{ item.status === ItemStatus.reservedByMe ? t('i-wont-take-it') : t('i-take-it') }}
        </sl-button>
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

.app-item-status {
  @apply mt-3 flex items-center gap-2;
}

.app-item::part(footer) {
  @apply border-t-2;
}
</style>
