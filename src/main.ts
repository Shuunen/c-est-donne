import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import App from './app.vue'
import './plugins/responsive.plugin'
import './plugins/shoelace.plugin'
import './plugins/storage.plugin'
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
    clientId: 'eIiHJseJCImejDN3lfQWnXp3tznrEQeR',
    useRefreshTokens: true, // eslint-disable-line @typescript-eslint/naming-convention
    cacheLocation: 'localstorage',
    authorizationParams: {
      redirect_uri: window.location.origin, // eslint-disable-line @typescript-eslint/naming-convention, camelcase
    },
  }),
)

app.mount('#app')
