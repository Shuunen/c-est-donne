import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import App from './app.vue'
import { i18n } from './plugins/i18n'
import './plugins/shoelace'
import './style.css'

const app = createApp(App)

// globally register components, restrict the regex if needed
const components = import.meta.globEager('./components/*.vue')
Object.entries(components).forEach(([path, definition]) => {
  const componentName = path.split('/').pop()?.replace(/\.\w+$/, '')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  if (componentName !== undefined) app.component(componentName, (definition as any).default)
})

app.use(
  createAuth0({
    domain: 'c-est-donne.eu.auth0.com',
    client_id: 'eIiHJseJCImejDN3lfQWnXp3tznrEQeR', // eslint-disable-line @typescript-eslint/naming-convention
    redirect_uri: window.location.origin, // eslint-disable-line @typescript-eslint/naming-convention
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  }),
)

app.use(i18n)

app.mount('#app')
