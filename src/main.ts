import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import App from './app.vue'
import { i18n } from './plugins/i18n'
import './plugins/shoelace'
import './style.css'

const app = createApp(App)

// globally register components, restrict the regex if needed
// eslint-disable-next-line @typescript-eslint/naming-convention
const components = import.meta.glob('./components/*.vue', { eager: true })
Object.entries(components).forEach(([path, definition]) => {
  const componentName = path.split('/').pop()?.replace(/\.\w+$/u, '')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions
  if (componentName !== undefined) app.component(componentName, (definition as any).default)
})

app.use(
  createAuth0({
    domain: 'c-est-donne.eu.auth0.com',
    // eslint-disable-next-line camelcase
    client_id: 'eIiHJseJCImejDN3lfQWnXp3tznrEQeR', // eslint-disable-line @typescript-eslint/naming-convention
    // eslint-disable-next-line camelcase
    redirect_uri: window.location.origin, // eslint-disable-line @typescript-eslint/naming-convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  }),
)

app.use(i18n)

app.mount('#app')
