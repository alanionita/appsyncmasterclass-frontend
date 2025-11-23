import { throwWithLabel } from '@/utils/error';
import { useAppsync } from '@/stores/appsync';
import { useAuthStore } from '@/stores/authentication';
import { useUi } from '@/stores/ui';
import { fetchAuthSession } from 'aws-amplify/auth';

export default async (to, from, next) => {
  try {
    const { tokens, userSub } = await fetchAuthSession();
    const isProtected = to.matched.some(route => route.meta.protected);
    const loggedIn = tokens && userSub;
    if (isProtected && !loggedIn) {
      next("/");
      return;
    }

    if (userSub) {
      // 1. Appsync store
      const { appsyncClient, initClient } = useAppsync();

      if (!appsyncClient && tokens.accessToken) {
        await initClient(tokens.accessToken);
      }

      // 2. Auth store
      const storeAuth = useAuthStore();
      await storeAuth.verifyAuth(to.fullPath);

      // 3. UI update
      const storeUi = useUi()
      storeUi.setOwnProfile(to.params.screenName)
    }
    next();
  } catch (err) {
    throwWithLabel(err, "Router/auth")
  }

}