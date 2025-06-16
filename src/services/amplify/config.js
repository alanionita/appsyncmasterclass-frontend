const awsRegion = import.meta.env.VITE_AWS_REGION;
const awsCognitoPool = import.meta.env.VITE_AWS_COGNITO_POOL
const awsCognitoClient = import.meta.env.VITE_AWS_COGNITO_CLIENT
const awsAppSyncEndpoint = import.meta.env.VITE_AWS_APPSYNC_ENDPOINT

const envVars = [awsRegion, awsCognitoPool, awsCognitoClient, awsAppSyncEndpoint]

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
        },
    },
    API: {
        GraphQL: {
            endpoint: awsAppSyncEndpoint,
            region: awsRegion,
            defaultAuthMode: 'userPool'
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