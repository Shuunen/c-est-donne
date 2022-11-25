<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { storage } from 'shuutils'
import { state } from '../state'
import { Theme } from '../utils/theme'

const { t } = useI18n()

function setThemeInDom (): void {
  document.body.classList.remove(Theme.Dark, Theme.Light)
  document.body.classList.add(state.theme)
  document.documentElement.classList.toggle('dark', state.theme === Theme.Dark)
  storage.set('theme', state.theme)
}

setThemeInDom()

function switchTheme (): void {
  state.theme = state.theme === Theme.Dark ? Theme.Light : Theme.Dark
  setThemeInDom()
}
</script>

<template>
  <sl-button variant="default" size="medium" circle :title="t(`switch-to-${state.theme.includes('dark') ? 'light' : 'dark'}-theme`)"
    @click="switchTheme">
    <sl-icon :name="state.theme.includes('dark') ? 'lightbulb' : 'lightbulb-off'"></sl-icon>
  </sl-button>
</template>
