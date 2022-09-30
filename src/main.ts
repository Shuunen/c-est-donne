import { createApp } from 'vue'
import App from './app.vue'
import './plugins/shoelace'
import './plugins/storage'
import './style.css'

const app = createApp(App)

// globally register components, restrict the regex if needed
const components = import.meta.globEager('./components/*.vue')
Object.entries(components).forEach(([path, definition]) => {
  const componentName = path.split('/').pop()?.replace(/\.\w+$/, '')
  if (componentName) app.component(componentName, (definition as any).default) // eslint-disable-line @typescript-eslint/no-explicit-any
})

app.mount('#app')
