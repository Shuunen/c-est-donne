<script setup lang="ts">
import { useI18n } from 'petite-vue-i18n'
import { state } from '../state'
import { ItemStatus } from '../utils/item'

const { t } = useI18n()
</script>

<template>
  <sl-alert v-if="state.loading" variant="primary" open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ t('welcome') }}</strong><br />
    {{ t('loading') }}
  </sl-alert>
  <sl-alert v-else-if="!state.user.isConnected" variant="primary" open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ t('welcome') }}</strong><br />
    {{ t('please-login') }}
  </sl-alert>
  <sl-alert v-else-if="!state.user.hasAccess" variant="warning" open>
    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
    <strong>{{ t('welcome', { name: state.user.firstName }) }}</strong><br />
    {{ t('no-access') }}
  </sl-alert>
  <sl-alert v-else-if="state.items.length > 0" variant="primary" open closable>
    <sl-icon slot="icon" name="check2-circle"></sl-icon>
    <strong>{{ t('welcome', { name: state.user.firstName }) }}</strong><br />
    {{ t('items-remaining', { number: state.items.filter(item => item.status === ItemStatus.available).length }) }}
  </sl-alert>
  <sl-alert v-else-if="state.items.length === 0" variant="primary" open>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ t('welcome', { name: state.user.firstName }) }}</strong><br />
    {{ t('no-items-remaining') }}
  </sl-alert>
</template>
