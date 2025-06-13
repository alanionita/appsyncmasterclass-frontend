import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Amplify } from 'aws-amplify';
import AmplifyVue from '@aws-amplify/ui-vue';
import { config } from './services/amplify/config'
import { sessionStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

Amplify.configure(config)

cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

const app = createApp(App)

app.use(AmplifyVue)
app.use(router)

app.mount('#app')
