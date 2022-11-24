<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useI18n } from 'petite-vue-i18n'
import { copy, debounce, storage } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { log } from '../utils/logs'
import { firstName } from '../utils/user'

const { t } = useI18n()
const { loginWithRedirect, logout, user } = useAuth0()
const hover = ref(false)

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
  const actual = state.user
  const expected = copy(actual)
  expected.name = user.value?.name || expected.name
  expected.firstName = firstName(expected.name)
  expected.picture = user.value?.picture || expected.picture
  expected.email = user.value?.email || expected.email
  expected.apiKey = user.value?.['AIRTABLE_API_KEY'] || expected.apiKey
  expected.apiApp = user.value?.['AIRTABLE_API_APP'] || expected.apiApp
  expected.isConnected = expected.email.length > 0
  expected.hasAccess = expected.apiKey.length > 0
  const same = JSON.stringify(actual) === JSON.stringify(expected)
  log(`sync storage data ${same ? 'does not need update' : 'are different and will be updated'}`)
  if (!same) storage.set('user', expected)
  state.user = expected
}
const syncStorageDebounced = debounce(syncStorage, 100)
syncStorageDebounced()
watch(user, syncStorageDebounced)
</script>

<template>
  <sl-button v-if="!state.user.firstName" :loading="state.loading" variant="primary" @click="doLogin">{{ t('login') }}</sl-button>
  <sl-button v-else variant="default" class="overflow-hidden" @click="doLogout" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="flex items-center">
      <span class="float-left mr-3">{{ hover ? t('logout') : state.user.firstName }}</span>
      <sl-icon class="text-lg" :name="hover ? 'box-arrow-right' : 'person-circle'"></sl-icon>
    </div>
  </sl-button>
</template>
