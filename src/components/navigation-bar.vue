<template>
  <div class="app-nav-bar mb-12 flex flex-row items-center gap-4 p-6">
    <a href="/" class="flex items-center gap-4">
      <h1 class="text-2xl font-extrabold tracking-tight">C'est donné <span class="text-accent">!</span></h1>
    </a>
    <div class="ml-auto"></div>
    <sl-skeleton class="h-10 w-28"></sl-skeleton>
    <sl-skeleton class="h-10 w-28"></sl-skeleton>
    <sl-skeleton class="h-10 w-28"></sl-skeleton>
    <theme-switcher />
    <img src="https://i.pravatar.cc/100" alt="avatar" class="h-10 rounded-full border-2 border-solid border-slate-500">
  </div>
</template>
