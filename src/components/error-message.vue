<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { on } from 'shuutils'
import { ref } from 'vue'
import { getEnvironment, log } from '../utils/logs'
import { getUser } from '../utils/user'

interface SLDialog extends HTMLElement {
  show (): void
  hide (): void
}

const { t } = useI18n()
const message = ref('')
const dialog = ref<SLDialog>()

on('error', (content: string) => {
  message.value = content
  dialog.value?.show()
})

const mailError = (): void => {
  log('mailing error to admin')
  const mail = document.createElement('a')
  const body = t('error-body', { error: message.value, environment: getEnvironment(), user: getUser().firstName })
  mail.href = `mailto:romain.racamier@gmail.com?subject=${encodeURIComponent(t('error-report-subject'))}&body=${encodeURIComponent(body)}`
  mail.click()
}
</script>

<template>
  <sl-dialog ref="dialog" :label="t('an-error-occurred')">
    {{ message }}<br /><br />
    {{ t('error-report') }} <sl-button id="mail-to" variant="text" size="medium" @click="mailError">{{ t('error-report-mailto') }}</sl-button>.
    <sl-button slot="footer" variant="primary" @click="dialog?.hide()">{{ t('close') }}</sl-button>
  </sl-dialog>
</template>

<style scoped>
#mail-to::part(label) {
  @apply p-0 leading-8 text-base;
}
</style>
