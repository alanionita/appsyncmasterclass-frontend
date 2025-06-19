import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';
import router from '@/router';
import { useAuthStore } from '@/stores/authentication';

async function authListener({ payload }) {
    const prefix = "Hub (auth): ";
    const authStore = useAuthStore()
    switch (payload.event) {
        case 'signedIn':
            console.info(prefix + 'user have been signedIn successfully.');
            const user = await getCurrentUser();
            authStore.login(user);
            // router.push('/home');
            authStore.stopListener();
            break;
        case 'signedOut':
            console.info(prefix + 'user have been signedOut successfully.');
            break;
        case 'tokenRefresh':
            console.info(prefix + 'auth tokens have been refreshed.');
            break;
        case 'tokenRefresh_failure':
            console.info(prefix + 'failure while refreshing auth tokens.');
            break;
        case 'signInWithRedirect':
            console.info(prefix + 'signInWithRedirect API has successfully been resolved.');
            break;
        case 'signInWithRedirect_failure':
            console.info(prefix + 'failure while trying to resolve signInWithRedirect API.');
            break;
        case 'customOAuthState':
            logger.info('custom state returned from CognitoHosted UI');
            break;
    }
}

export function startAuthListener() {
    return Hub.listen('auth', authListener)
};
