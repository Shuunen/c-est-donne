<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useI18n } from 'petite-vue-i18n'
import { copy, debounce, storage } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { log } from '../utils/logs'
import { firstName } from '../utils/user'

const { t } = useI18n()
// eslint-disable-next-line @typescript-eslint/unbound-method
const { loginWithRedirect, logout, user } = useAuth0()
const hover = ref(false)

async function doLogin (): Promise<boolean> {
  log('login')
  await loginWithRedirect()
  return true
}
async function doLogout (): Promise<boolean> {
  log('logout')
  storage.clear('user')
  await logout({ returnTo: window.location.origin })
  return true
}
// eslint-disable-next-line max-statements
function syncStorage (): boolean {
  log('sync storage...')
  const actual = state.user
  const expected = copy(actual)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/naming-convention
  const userAuth0 = user.value as { name?: string; picture?: string; email?: string; AIRTABLE_API_KEY?: string; AIRTABLE_API_APP?: string } | undefined
  expected.name = userAuth0?.name ?? expected.name
  expected.firstName = firstName(expected.name)
  expected.picture = userAuth0?.picture ?? expected.picture
  expected.email = userAuth0?.email ?? expected.email
  expected.apiKey = userAuth0?.AIRTABLE_API_KEY ?? expected.apiKey
  expected.apiApp = userAuth0?.AIRTABLE_API_APP ?? expected.apiApp
  expected.isConnected = expected.email.length > 0
  expected.hasAccess = expected.apiKey.length > 0
  const isEqual = JSON.stringify(actual) === JSON.stringify(expected)
  log(`sync storage data ${isEqual ? 'does not need update' : 'are different and will be updated'}`)
  if (!isEqual) storage.set('user', expected)
  state.user = expected
  return true
}
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const syncStorageDebounced = debounce(syncStorage, 100)
void syncStorageDebounced()
watch(user, syncStorageDebounced)
</script>

<template>
  <sl-button v-if="!state.user.firstName" :loading="state.isLoading" variant="primary" @click="doLogin">{{ t('login') }}</sl-button>
  <sl-button v-else variant="default" class="overflow-hidden" @click="doLogout" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="flex items-center">
      <span class="float-left mr-3">{{ hover ? t('logout') : state.user.firstName }}</span>
      <sl-icon class="text-lg" :name="hover ? 'box-arrow-right' : 'person-circle'"></sl-icon>
    </div>
  </sl-button>
</template>
