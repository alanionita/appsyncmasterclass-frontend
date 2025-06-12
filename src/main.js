import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Amplify } from 'aws-amplify';
import AmplifyVue from '@aws-amplify/ui-vue';
import { config } from './services/amplify/config'

Amplify.configure(config)

const app = createApp(App)

app.use(AmplifyVue)
app.use(router)

app.mount('#app')
