import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './includes/validation';
import './assets/tailwind.css';
import './assets/main.css';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(VeeValidatePlugin);

app.mount('#app');
