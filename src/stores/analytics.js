import { throwWithLabel } from '@/utils/error';
import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { FirehoseClient, PutRecordCommand } from "@aws-sdk/client-firehose";

export const useAnalytics = defineStore('analytics', () => {
    try {
        const history = shallowRef(new Set());

        async function getCreds() {
            // TODO: should store the creds and bypass this call, although it's not a cost-based operation
            try {
                const awsRegion = import.meta.env.VITE_AWS_REGION;
                const awsCognitoPoolId = import.meta.env.VITE_AWS_COGNITO_IDP

                if (!awsRegion || !awsCognitoPoolId) {
                    throw Error("Missing Env Variable");
                }

                const getCreds = fromCognitoIdentityPool({
                    clientConfig: {
                        region: awsRegion
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

        async function putFirehoseRecord(creds = null, record = null) {
            try {
                const streamName = import.meta.env.VITE_AWS_FIREHOSE_STREAM_NAME
                const awsRegion = import.meta.env.VITE_AWS_REGION;

                if (!streamName) throw Error('Missing Firehose Stream Name')

                if (!creds) throw Error('Missing credentials')

                if (!awsRegion) throw Error('Missing region')

                if (!record) throw Error('Missing record')
                
                const config = {
                    region: awsRegion,
                    credentials: {
                        ...creds
                    }
                }; // type is FirehoseClientConfig
                const client = new FirehoseClient(config);
                const input = { // PutRecordInput
                    DeliveryStreamName: streamName, // required
                    Record: { // Record
                        Data: JSON.stringify(record)
                    },
                };
                const command = new PutRecordCommand(input);
                const res = await client.send(command);
                if (res && res.$metadata.httpStatusCode === 200) {
                    history.value.add(record)
                }
            } catch (err) {
                throwWithLabel(err, 'Err [store/analytics/putFirehoseRecord] :');
            }
        }


        async function trackEvent(evnt = null) {
            if (!evnt) return;
            
            const creds = await getCreds();
            
            await putFirehoseRecord(creds, evnt)
        }

        return {
            history,
            trackEvent
        }
    } catch (err) {
        throwWithLabel(err, 'Err [store/appsync/useAnalytics] :');
    }
})
