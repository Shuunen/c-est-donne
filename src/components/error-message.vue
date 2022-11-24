<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { ref, watch } from 'vue'
import { state } from '../state'
import { getEnvironment, log } from '../utils/logs'

interface SLDialog extends HTMLElement {
  show (): void
  hide (): void
}

const { t } = useI18n()
const message = ref('')
const dialog = ref<SLDialog>()

const mailError = (): void => {
  log('mailing error to admin')
  const mail = document.createElement('a')
  const body = t('error-body', { error: message.value, environment: getEnvironment(), user: state.user.firstName })
  mail.href = `mailto:romain.racamier@gmail.com?subject=${encodeURIComponent(t('error-report-subject'))}&body=${encodeURIComponent(body)}`
  mail.click()
}

const onError = (content: string | ErrorEvent): void => {
  message.value = content instanceof ErrorEvent ? content.message : content
  dialog.value?.show()
}

watch(() => state.error, onError)
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
