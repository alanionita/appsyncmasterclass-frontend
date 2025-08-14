const awsRegion = import.meta.env.VITE_AWS_REGION;
const awsCognitoPool = import.meta.env.VITE_AWS_COGNITO_POOL
const awsCognitoClient = import.meta.env.VITE_AWS_COGNITO_CLIENT
const awsCognitoIDP = import.meta.env.VITE_AWS_COGNITO_IDP
const awsAppSyncEndpoint = import.meta.env.VITE_AWS_APPSYNC_ENDPOINT
const awsS3Assets = import.meta.env.VITE_AWS_S3_ASSETS

const envVars = [awsRegion, awsCognitoPool, awsCognitoClient, awsAppSyncEndpoint, awsCognitoIDP, awsS3Assets]

envVars.forEach(v => {
  if (!v) {
    throw Error("Missing Env Variable");
  }
})


export const config = {
  Auth: {
    Cognito: {
      region: awsRegion,
      userPoolId: awsCognitoPool,
      userPoolClientId: awsCognitoClient,
      authenticationFlowType: 'USER_SRP_AUTH', // Recommended flow
      identityPoolId: awsCognitoIDP
    },
  },
  API: {
    GraphQL: {
      endpoint: awsAppSyncEndpoint, 
      region: awsRegion,
      defaultAuthMode: 'userPool'
    }
  },
  Storage: {
    S3: {
      bucket: awsS3Assets, // Optional
      region: awsRegion,
      defaultAccessLevel: 'private',
      cors: true // Ensures CORS headers are added
    }
  }
}

export const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Username (Email)'
    },
  },
  signUp: {
    username: {
      label: 'Username (Email) *',
      placeholder: 'Please enter your email',
      isRequired: true,
      order: 1
    },
    name: {
      label: 'Name *',
      placeholder: 'Please enter your name',
      isRequired: true,
      order: 1
    },
    password: {
      label: 'Password *',
      placeholder: 'Please enter your password',
      isRequired: true,
    },
    confirm_password: {
      label: 'Confirm Password *',
      isRequired: true,
    },
    phone_number: {
      label: 'Phone number *',
      placeholder: 'Please enter your phone number',
      dialCodeList: ['+44'],
      isRequired: true
    }
  }
};