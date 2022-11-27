<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useI18n } from 'petite-vue-i18n'
import { debounce, storage } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { fetchItems } from '../utils/api'
import { log } from '../utils/logs'
import { mergeUserData } from '../utils/user'

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
async function syncStorage (): Promise<boolean> {
  log('sync storage...')
  state.isLoading = true
  const userData = mergeUserData(state.user, user.value)
  storage.set('user', userData)
  state.user = userData
  await fetchItems()
  state.isLoading = false
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
