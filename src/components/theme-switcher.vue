<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { storage } from 'shuutils'
import { state } from '../state'
import { Theme } from '../utils/theme'

const { t } = useI18n()

const setThemeInDom = (): void => {
  document.body.classList.remove(Theme.dark, Theme.light)
  document.body.classList.add(state.theme)
  document.documentElement.classList.toggle('dark', state.theme === Theme.dark)
  storage.set('theme', state.theme)
}

setThemeInDom()

const switchTheme = (): void => {
  state.theme = state.theme === Theme.dark ? Theme.light : Theme.dark
  setThemeInDom()
}
</script>

<template>
  <sl-button variant="default" size="medium" circle :title="t(`switch-to-${state.theme.includes('dark') ? 'light' : 'dark'}-theme`)"
    @click="switchTheme">
    <sl-icon :name="state.theme.includes('dark') ? 'lightbulb' : 'lightbulb-off'"></sl-icon>
  </sl-button>
</template>
