import { ApolloAppSync } from '@/services/apollo';
import { throwWithLabel } from '@/utils/error';
import { defineStore } from 'pinia';
import { shallowRef } from 'vue';

export const useAppsync = defineStore('appsync', () => {
    try {
        const appsyncClient = shallowRef(null);
        async function initClient(accessToken) {
            try {
                const awsRegion = import.meta.env.VITE_AWS_REGION;
                const awsAppSyncEndpoint = import.meta.env.VITE_AWS_APPSYNC_ENDPOINT

                if (!awsRegion && !awsAppSyncEndpoint) throw Error('Missing env variables')

                if (!accessToken) throw Error('Requires valid auth token')

                if (!appsyncClient.value) {
                    const clientConfig = {
                        region: awsRegion,
                        appSyncUrl: awsAppSyncEndpoint,
                        accessToken
                    }
                    const newClient = new ApolloAppSync(clientConfig)
                    appsyncClient.value = newClient
                }
                return appsyncClient.value
            } catch (err) {
                throwWithLabel(err, 'Err [store/appsync/initClient] :')
            }
        }

        function getClient() {
            if (appsyncClient.value) {
                return appsyncClient.value;
            }

            return null;
        }

        return {
            initClient,
            getClient,
            appsyncClient
        }
    } catch (err) {
        throwWithLabel(err, 'Err [store/appsync/useAppsync] :');
    }
})
