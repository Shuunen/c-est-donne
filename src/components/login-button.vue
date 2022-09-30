<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { ref } from 'vue'

const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()
const isLoading = ref(false)
const hover = ref(false)

const doLogin = (): void => {
  console.log('login')
  loginWithRedirect()
}
const doLogout = (): void => {
  console.log('logout')
  logout({ returnTo: window.location.origin })
}
</script>

<template>
  <sl-button v-if="!isAuthenticated" :loading="isLoading" variant="primary" @click="doLogin">Login</sl-button>
  <sl-button v-else variant="default" class="overflow-hidden" @click="doLogout" @mouseenter="hover = true" @mouseleave="hover = false">
    <div v-if="!hover" class="flex items-center">
      <span v-if="user?.name" class="float-left mr-3 hidden sm:block">{{ user.name }}</span>
      <img v-if="user?.picture" class="w-7 rounded-full" :src="user.picture" alt="avatar" />
    </div>
    <div v-else class="flex items-center">
      <span class="float-left mr-3">Logout</span>
      <sl-icon class="text-lg" name="box-arrow-right"></sl-icon>
    </div>
  </sl-button>
</template>
