import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Amplify } from 'aws-amplify';
import AmplifyVue from '@aws-amplify/ui-vue';
import { config } from './services/amplify/config'
import { sessionStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import './assets/main.css'

// Config

Amplify.configure(config)

cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage)

// Create

const app = createApp(App)
const pinia = createPinia()

// Use

app.use(pinia)
app.use(AmplifyVue)
app.use(router)

// Mount

app.mount('#app')
