<script setup lang="ts">
import { state } from '../state'
import { ItemStatus } from '../utils/items.utils'
import { $t } from '../utils/translate.utils'
</script>

<template>
  <sl-alert v-if="state.isLoading" open variant="primary">
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ $t('welcome') }}</strong><br />
    {{ $t('loading') }}
  </sl-alert>
  <sl-alert v-else-if="!state.user.isConnected" class="hidden" open variant="primary">
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ $t('welcome') }}</strong><br />
    {{ $t('please-login') }}
  </sl-alert>
  <sl-alert v-else-if="!state.user.hasAccess" open variant="warning">
    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
    <strong>{{ $t('welcome', { name: state.user.firstName }) }}</strong><br />
    {{ $t('no-access') }}
  </sl-alert>
  <sl-alert v-else-if="state.items.length > 0" closable open variant="primary">
    <sl-icon slot="icon" name="check2-circle"></sl-icon>
    <strong>{{ $t('welcome', { name: state.user.firstName }) }}</strong><br />
    {{ $t('items-remaining', { number: state.items.filter(item => item.status === ItemStatus.Available).length }) }}
  </sl-alert>
  <sl-alert v-else-if="state.items.length === 0" open variant="primary">
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>{{ $t('welcome', { name: state.user.firstName }) }}</strong><br />
    {{ $t('no-items-remaining') }}
  </sl-alert>
</template>
