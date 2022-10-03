<script setup lang="ts">
import { on } from 'shuutils'
import { ref } from 'vue'

interface SLDialog extends HTMLElement {
  show (): void
  hide (): void
}

const message = ref('')
const dialog = ref<SLDialog>()

on('error', (content: string) => {
  console.error(content)
  message.value = content
  dialog.value?.show()
})
</script>

<template>
  <sl-dialog ref="dialog" label="An error occurred">
    {{ message }}
    <sl-button slot="footer" variant="primary" @click="dialog?.hide()">Close</sl-button>
  </sl-dialog>
</template>
