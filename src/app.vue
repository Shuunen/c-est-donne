<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import FooterBar from './components/footer-bar.vue'
import HelloWorld from './components/hello-world.vue'
import NavigationBar from './components/navigation-bar.vue'
</script>

<template>
  <div class="mx-auto flex h-full max-w-7xl flex-col">
    <NavigationBar />
    <HelloWorld msg="Vite + Vue + Shoelace + Tailwind" />
    <FooterBar class="mt-auto" />
  </div>
</template>
