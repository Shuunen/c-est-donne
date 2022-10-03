<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { storage } from 'shuutils'
import { ref } from 'vue'
import { log } from '../utils/logs'

const enum Theme {
  dark = 'sl-theme-dark',
  light = 'sl-theme-light',
}

const { t } = useI18n()
const theme = ref(storage.get<Theme>('theme', Theme.dark))
log('theme found in local storage :', theme.value)

const setThemeInDom = (): void => {
  document.body.classList.remove(Theme.dark, Theme.light)
  document.body.classList.add(theme.value)
  document.documentElement.classList.toggle('dark', theme.value === Theme.dark)
  storage.set('theme', theme.value)
}

setThemeInDom()

const switchTheme = (): void => {
  theme.value = theme.value === Theme.dark ? Theme.light : Theme.dark
  setThemeInDom()
}
</script>

<template>
  <sl-button variant="default" size="medium" circle :title="t(`switch-to-${theme.includes('dark') ? 'light' : 'dark'}-theme`)" @click="switchTheme">
    <sl-icon :name="theme.includes('dark') ? 'lightbulb' : 'lightbulb-off'"></sl-icon>
  </sl-button>
</template>
