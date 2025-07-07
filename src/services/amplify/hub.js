import { Hub } from 'aws-amplify/utils';
import { useAuthStore } from '@/stores/authentication';

async function authListener({ payload }) {
    const prefix = "Listener (auth): ";
    const authStore = useAuthStore()
    switch (payload.event) {
        case 'signedIn':
            console.info(prefix + 'signIn success.');
            await authStore.verifyAuth()
            break;
        case 'signedOut':
            console.info(prefix + 'signedOut success.');
            break;
        case 'tokenRefresh':
            console.info(prefix + 'tokenRefresh success.');
            break;
        case 'tokenRefresh_failure':
            console.info(prefix + 'tokenRefresh fail.');
            break;
        case 'signInWithRedirect':
            console.info(prefix + 'signInWithRedirect success.');
            break;
        case 'signInWithRedirect_failure':
            console.info(prefix + 'signInWithRedirect fail.');
            break;
        case 'customOAuthState':
            logger.info('custom state returned from CognitoHosted UI');
            break;
    }
}

export function startAuthListener() {
    return Hub.listen('auth', authListener)
};
