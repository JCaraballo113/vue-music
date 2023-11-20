import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VeeValidatePlugin from '@/includes/validation'
import './assets/base.css'
import './assets/main.css'
import supabase from './includes/supabase'
import icon from '@/directives/icon'
import i18n from '@/includes/i18n'

import App from './App.vue'
import router from './router'

let app: ReturnType<typeof createApp>
supabase.auth.onAuthStateChange((event, session) => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)
    app.directive('icon', icon)
    app.use(i18n)

    app.mount('#app')
  }
})
