<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { debounce, storage } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { fetchItems } from '../utils/api.utils'
import { log } from '../utils/logger.utils'
import { $t } from '../utils/translate.utils'
import { mergeUserData } from '../utils/user.utils'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { loginWithRedirect, logout, user } = useAuth0()
const hover = ref(false)

async function doLogin () {
  log('login')
  await loginWithRedirect()
  return true
}
async function doLogout () {
  log('logout')
  storage.clear('user')
  await logout({ logoutParams: { returnTo: window.location.origin } })
  return true
}
async function syncStorage () {
  log('sync storage...')
  state.isLoading = true
  const userData = mergeUserData(state.user, user.value)
  storage.set('user', userData)
  state.user = userData
  await fetchItems()
  // eslint-disable-next-line require-atomic-updates
  state.isLoading = false
  return true
}
function setHoverActive () {
  hover.value = true
}
function setHoverInactive () {
  hover.value = false
}
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const syncStorageDebounced = debounce(syncStorage, 100)
void syncStorageDebounced()
watch(user, syncStorageDebounced)
</script>

<template>
  <sl-button :loading="state.isLoading" @click="doLogin" v-if="!state.user.firstName" variant="primary">{{ $t('login') }}</sl-button>
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <sl-button @click="doLogout" @mouseenter="setHoverActive" @mouseleave="setHoverInactive" class="overflow-hidden" v-else variant="default">
    <div class="flex items-center">
      <span class="float-left mr-3">{{ hover ? $t('logout') : state.user.firstName }}</span>
      <sl-icon :name="hover ? 'box-arrow-right' : 'person-circle'" class="text-lg" />
    </div>
  </sl-button>
</template>
