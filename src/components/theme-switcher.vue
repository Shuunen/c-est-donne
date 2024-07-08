<script setup lang="ts">
import { watch } from 'vue'
import { state } from '../state'
import { Theme } from '../utils/theme.utils'
import { $t } from '../utils/translate.utils'

function setThemeInDom () {
  document.body.classList.remove(Theme.Dark, Theme.Light)
  document.body.classList.add(state.theme)
  document.documentElement.classList.toggle('dark', state.theme === Theme.Dark)
}

setThemeInDom()

function switchTheme () {
  state.theme = state.theme === Theme.Dark ? Theme.Light : Theme.Dark
  setThemeInDom()
}

watch(() => state.theme, setThemeInDom)
</script>

<template>
  <sl-button :title="$t(`switch-to-${state.theme.includes('dark') ? 'light' : 'dark'}-theme`)" @click="switchTheme" circle size="medium"
    variant="default">
    <sl-icon :name="state.theme.includes('dark') ? 'lightbulb' : 'lightbulb-off'" />
  </sl-button>
</template>
