import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-vue';


const awsRegion = import.meta.env.VITE_AWS_REGION;
const awsCognitoPool = import.meta.env.VITE_AWS_COGNITO_POOL
const awsCognitoClient = import.meta.env.VITE_AWS_COGNITO_CLIENT
const awsAppSyncHttp = import.meta.env.VITE_AWS_APPSYNC_ENDPOINT

const envVars = [awsRegion, awsCognitoPool, awsCognitoClient, awsAppSyncHttp]

envVars.forEach(v => {
  if (!v) {
    throw Error("Missing Env Variable");
  }
})

// TODO: replace with .env
Amplify.configure({
  Auth: {
    Cognito: {
      region: awsRegion,
      userPoolId: awsCognitoPool,
      userPoolWebClientId: awsCognitoClient,
    },
    mandatorySignIn: true
  },
  API: {
    GraphQL: {
      endpoint: awsAppSyncHttp,
      region: awsRegion,
      defaultAuthMode: 'userPool'
    }
  }
})

const app = createApp(App)

app.use(router)

app.mount('#app')
