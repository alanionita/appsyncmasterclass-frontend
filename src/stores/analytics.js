import { throwWithLabel } from '@/utils/error';
import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

export const useAnalytics = defineStore('analytics', () => {
    try {
        const events = shallowRef(new Map());

        async function getCreds() {
            try {
                const awsRegion = import.meta.env.VITE_AWS_REGION;
                const awsCognitoPoolId = import.meta.env.VITE_AWS_COGNITO_IDP

                if (!awsRegion || !awsCognitoPoolId) {
                    throw Error("Missing Env Variable");
                }

                const getCreds = fromCognitoIdentityPool({
                    clientConfig: { 
                        region:awsRegion 
                    },
                    identityPoolId: awsCognitoPoolId,
                    logins: {}
                })

                const creds = await getCreds();
                return creds
            } catch (err) {
                throwWithLabel(err, 'Err [store/analytics/getCreds] :');
            }
        }

        async function postEvent() {
            const creds = await getCreds()
        }

        return {
            events,
            postEvent
        }
    } catch (err) {
        throwWithLabel(err, 'Err [store/appsync/useAnalytics] :');
    }
})
