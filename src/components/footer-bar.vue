<script setup lang="ts">
// eslint-disable-next-line unicorn/prevent-abbreviations
import pkg from '../../package.json'
</script>

<template>
  <div class="app-footer-bar p-4 text-center opacity-50" title="__unique-mark__">
    C'est donné ! - v{{ pkg.version }} - {{ new Date().getFullYear() }}
  </div>
</template>
