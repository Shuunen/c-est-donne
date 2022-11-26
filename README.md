# C'est donné

[![Project license](https://img.shields.io/github/license/Shuunen/c-est-donne.svg?color=informational)](https://github.com/Shuunen/c-est-donne/blob/master/LICENSE)
[![Website up](https:/
/img.shields.io/website/https/my-website.com.svg)](https://my-website.com)

> Donations between friends and relatives made easy ! Give a second life to your objects :)

- [C'est donné](#cest-donné)
  - [Vue 3 + TypeScript + Vite](#vue-3--typescript--vite)
  - [Recommended IDE Setup](#recommended-ide-setup)
  - [Type Support For `.vue` Imports in TS](#type-support-for-vue-imports-in-ts)
  - [Todos](#todos)
  - [Thanks](#thanks)

## Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

## Todos

- [ ] add about modal with repo links, etc
- [ ] add illustrations
- [ ] add horizontal layout
- [ ] add details modal
- [ ] add activity monitor to refresh items
- [ ] add logo
- [ ] add demo
- [ ] improve uvu & c8 coverage
- [ ] remove & fix eslint temporary disabled comments : max-statements
- [ ] remove repo-check bs in eslintrc
- [ ] find a way (again -.-'') to make eslint-plugin-tailwindcss order works in vue file at least (custom class rule works for instance)
- [ ] create an introduction component, displayed when not connected

## Thanks

- [C8](https://github.com/bcoe/c8) : simple & effective cli for code coverage
- [Eslint](https://eslint.org) : super tool to find & fix problems  
- [Github](https://github.com) : for all their great work year after year, pushing OSS forward  
- [Jake Dohm](https://dev.to/jakedohm_34/auto-registering-all-your-components-in-vue-3-with-vite-4884) : for his article on global components registration
- [Repo-checker](https://github.com/Shuunen/repo-checker) : eslint cover /src code and this tool the rest ^^  
- [Shields.io](https://shields.io) : for the nice badges on top of this readme
- [Shuutils](https://github.com/Shuunen/shuutils) : collection of pure JS utils
- [TailwindCss](https://tailwindcss.com) : awesome lib to produce maintainable style
- [UvU](https://github.com/lukeed/uvu) : extremely fast and lightweight test runner for Node.js and the browser
- [Vite](https://github.com/vitejs/vite) : super fast frontend tooling  
- [Vue](https://vuejs.org) : when I need a front framework, this is the one I choose <3
- [Watchlist](https://github.com/lukeed/watchlist) : recursively watch a list of directories & run a command on any file system
