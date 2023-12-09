<script setup lang="ts">
import { watch } from 'vue'
import { state } from '../state'
import { Theme } from '../utils/theme.utils'
import { $t } from '../utils/translate.utils'

function setThemeInDom (): void {
  document.body.classList.remove(Theme.Dark, Theme.Light)
  document.body.classList.add(state.theme)
  document.documentElement.classList.toggle('dark', state.theme === Theme.Dark)
}

setThemeInDom()

function switchTheme (): void {
  state.theme = state.theme === Theme.Dark ? Theme.Light : Theme.Dark
  setThemeInDom()
}

watch(() => state.theme, setThemeInDom)
</script>

<template>
  <sl-button circle size="medium" :title="$t(`switch-to-${state.theme.includes('dark') ? 'light' : 'dark'}-theme`)" variant="default"
    @click="switchTheme">
    <sl-icon :name="state.theme.includes('dark') ? 'lightbulb' : 'lightbulb-off'"></sl-icon>
  </sl-button>
</template>
