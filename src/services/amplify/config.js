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