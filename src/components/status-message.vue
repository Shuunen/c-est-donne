<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { on } from 'shuutils'
import { ref } from 'vue'
import type { Item } from '../models/item'
import { getUser, User } from '../utils/user'

const { t } = useI18n()
const items = ref<Item[]>([])
const user = ref(getUser())
const loading = ref(false)

on('loading', (state: boolean) => loading.value = state)
on('list-items', (list: Item[]) => items.value = list)
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
  <sl-alert v-else-if="items.length > 0" variant="primary" open closable>
    <sl-icon slot="icon" name="check2-circle"></sl-icon>
    <strong>{{ t('welcome', {name: user.firstName}) }}</strong><br />
    {{ t('items-remaining', {number: items.length}) }}
  </sl-alert>
  <sl-alert v-else-if="items.length === 0" variant="primary" open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ t('welcome', {name: user.firstName}) }}</strong><br />
    {{ t('no-items-remaining') }}
  </sl-alert>
</template>
