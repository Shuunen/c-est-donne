<script setup lang="ts">
import { state } from '../state'
import { ItemStatus } from '../utils/items.utils'
import { $t } from '../utils/translate.utils'
</script>

<template>
  <sl-alert open v-if="state.isLoading" variant="primary">
    <sl-icon name="info-circle" slot="icon" />
    <strong>{{ $t('welcome') }}</strong><br>
    {{ $t('loading') }}
  </sl-alert>
  <sl-alert class="hidden" open v-else-if="!state.user.isConnected" variant="primary">
    <sl-icon name="info-circle" slot="icon" />
    <strong>{{ $t('welcome') }}</strong><br>
    {{ $t('please-login') }}
  </sl-alert>
  <sl-alert open v-else-if="!state.user.hasAccess" variant="warning">
    <sl-icon name="exclamation-triangle" slot="icon" />
    <strong>{{ $t('welcome', { name: state.user.firstName }) }}</strong><br>
    {{ $t('no-access') }}
  </sl-alert>
  <sl-alert closable open v-else-if="state.items.length > 0" variant="primary">
    <sl-icon name="check2-circle" slot="icon" />
    <strong>{{ $t('welcome', { name: state.user.firstName }) }}</strong><br>
    {{ $t('items-remaining', { number: state.items.filter(item => item.status === ItemStatus.Available).length }) }}
  </sl-alert>
  <sl-alert open v-else-if="state.items.length === 0" variant="primary">
    <sl-icon name="info-circle" slot="icon" />
    <strong>{{ $t('welcome', { name: state.user.firstName }) }}</strong><br>
    {{ $t('no-items-remaining') }}
  </sl-alert>
</template>
