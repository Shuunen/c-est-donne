<script setup lang="ts">
import { ref, watch } from 'vue'
import { state } from '../state'
import { getEnvironment } from '../utils/browser.utils'
import { log } from '../utils/logger.utils'
import { $t } from '../utils/translate.utils'

interface SlDialog extends HTMLElement {
  hide: () => void
  show: () => void
}

const message = ref('')
const dialog = ref<SlDialog>()

function mailError (): void {
  log('mailing error to admin')
  const mail = document.createElement('a')
  const body = $t('error-body', { error: message.value, environment: getEnvironment(), user: state.user.firstName })
  mail.href = `mailto:romain.racamier@gmail.com?subject=${encodeURIComponent($t('error-report-subject'))}&body=${encodeURIComponent(body)}`
  mail.click()
}

function onError (content: ErrorEvent | string): void {
  message.value = content instanceof ErrorEvent ? content.message : content
  dialog.value?.show()
}

function closeModal (): void {
  dialog.value?.hide()
}

watch(() => state.error, onError)
</script>

<template>
  <sl-dialog ref="dialog" :label="$t('an-error-occurred')">
    {{ message }}<br /><br />
    {{ $t('error-report') }} <sl-button id="mail-to" size="medium" variant="text" @click="mailError">{{ $t('error-report-mailto') }}</sl-button>.
    <sl-button slot="footer" variant="primary" @click="closeModal">{{ $t('close') }}</sl-button>
  </sl-dialog>
</template>

<style scoped>
#mail-to::part(label) {
  @apply p-0 leading-8 text-base;
}
</style>
