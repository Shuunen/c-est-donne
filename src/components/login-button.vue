<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { copy, debounce, storage } from 'shuutils'
import { ref, watch } from 'vue'
import { getUser } from '../utils/user'

const { loginWithRedirect, logout, user } = useAuth0()
const isLoading = ref(false)
const hover = ref(false)
const username = ref('')
const picture = ref('')

const doLogin = (): void => {
  console.log('login')
  loginWithRedirect()
}
const doLogout = (): void => {
  console.log('logout')
  storage.clear('user')
  logout({ returnTo: window.location.origin })
}
const syncStorage = async (): Promise<void> => {
  console.log('sync storage...')
  const actual = getUser()
  const expected = copy(actual)
  expected.name = user.value?.name || expected.name
  expected.picture = user.value?.picture || expected.picture
  expected.email = user.value?.email || expected.email
  expected.AIRTABLE_API_KEY = user.value?.['AIRTABLE_API_KEY'] || expected.AIRTABLE_API_KEY
  expected.AIRTABLE_API_APP = user.value?.['AIRTABLE_API_APP'] || expected.AIRTABLE_API_APP
  const same = JSON.stringify(actual) === JSON.stringify(expected)
  console.log(`sync storage data ${same ? 'does not need update' : 'are different and will be updated'}`)
  if (!same) storage.set('user', expected)
  username.value = expected.name
  picture.value = expected.picture
}
const syncStorageDebounced = debounce(syncStorage, 100)
syncStorageDebounced()
watch(user, syncStorageDebounced)
</script>

<template>
  <sl-button v-if="!username" :loading="isLoading" variant="primary" @click="doLogin">Login</sl-button>
  <sl-button v-else variant="default" class="overflow-hidden" @click="doLogout" @mouseenter="hover = true" @mouseleave="hover = false">
    <div v-if="!hover" class="flex items-center">
      <span class="float-left mr-3">{{ username }}</span>
      <img v-if="picture" class="w-7 rounded-full" :src="picture" alt="avatar" />
    </div>
    <div v-else class="flex items-center">
      <span class="float-left mr-3">Logout</span>
      <sl-icon class="text-lg" name="box-arrow-right"></sl-icon>
    </div>
  </sl-button>
</template>
