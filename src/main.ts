import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VeeValidatePlugin from '@/includes/validation'
import './assets/base.css'
import './assets/main.css'
import supabase from './includes/supabase'

import App from './App.vue'
import router from './router'

let app: ReturnType<typeof createApp>
supabase.auth.onAuthStateChange((event, session) => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)

    app.mount('#app')
  }
})
