<script setup>
import { browserContext, browserReport } from 'shuutils'
import { ref, watch } from 'vue'
import { state } from '../state'
import { log } from '../utils/logger.utils'
import { $t } from '../utils/translate.utils'

const message = ref('')
const dialog = ref()

function mailError () {
  log('mailing error to admin')
  const mail = document.createElement('a')
  const body = $t('error-body', { environment: browserReport(browserContext()), error: message.value, user: state.user.firstName })
  mail.href = `mailto:romain.racamier@gmail.com?subject=${encodeURIComponent($t('error-report-subject'))}&body=${encodeURIComponent(body)}`
  mail.click()
}

/**
 * @param {ErrorEvent|string} content the error message
 */
function onError (content) {
  message.value = content instanceof ErrorEvent ? content.message : content
  dialog.value?.show()
}

function closeModal () {
  dialog.value?.hide()
}

watch(() => state.error, onError)
</script>

<template>
  <sl-dialog :label="$t('an-error-occurred')" ref="dialog">
    {{ message }}<br><br>
    {{ $t('error-report') }} <sl-button @click="mailError" id="mail-to" size="medium" variant="text">{{ $t('error-report-mailto') }}</sl-button>.
    <sl-button @click="closeModal" slot="footer" variant="primary">{{ $t('close') }}</sl-button>
  </sl-dialog>
</template>

<style scoped>
@reference "tailwindcss";

#mail-to::part(label) {
  @apply p-0 leading-8 text-base;
}
</style>
