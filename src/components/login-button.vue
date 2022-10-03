<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useI18n } from 'petite-vue-i18n'
import { copy, debounce, emit, storage } from 'shuutils'
import { ref, watch } from 'vue'
import type { AirtableCredentials } from '../models/airtable'
import { log } from '../utils/logs'
import { firstName, getUser } from '../utils/user'

const { t } = useI18n()
const { loginWithRedirect, logout, user } = useAuth0()
const isLoading = ref(false)
const hover = ref(false)
const username = ref('')

const doLogin = (): void => {
  log('login')
  loginWithRedirect()
}
const doLogout = (): void => {
  log('logout')
  storage.clear('user')
  logout({ returnTo: window.location.origin })
}
const syncStorage = async (): Promise<void> => {
  log('sync storage...')
  const actual = getUser()
  const expected = copy(actual)
  expected.name = user.value?.name || expected.name
  expected.firstName = firstName(expected.name)
  expected.picture = user.value?.picture || expected.picture
  expected.email = user.value?.email || expected.email
  expected.AIRTABLE_API_KEY = user.value?.['AIRTABLE_API_KEY'] || expected.AIRTABLE_API_KEY
  expected.AIRTABLE_API_APP = user.value?.['AIRTABLE_API_APP'] || expected.AIRTABLE_API_APP
  const same = JSON.stringify(actual) === JSON.stringify(expected)
  log(`sync storage data ${same ? 'does not need update' : 'are different and will be updated'}`)
  if (!same) storage.set('user', expected)
  username.value = expected.firstName
  if (expected.AIRTABLE_API_APP && expected.AIRTABLE_API_KEY) emit<AirtableCredentials>('airtable-credentials', { app: expected.AIRTABLE_API_APP, key: expected.AIRTABLE_API_KEY })
}
const syncStorageDebounced = debounce(syncStorage, 100)
syncStorageDebounced()
watch(user, syncStorageDebounced)
</script>

<template>
  <sl-button v-if="!username" :loading="isLoading" variant="primary" @click="doLogin">Login</sl-button>
  <sl-button v-else variant="default" class="overflow-hidden" @click="doLogout" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="flex items-center">
      <span class="float-left mr-3">{{ hover ? t('logout') : username }}</span>
      <sl-icon class="text-lg" :name="hover ? 'box-arrow-right' : 'person-circle'"></sl-icon>
    </div>
  </sl-button>
</template>
