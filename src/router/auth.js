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
    const storeAuth = useAuthStore();
    await storeAuth.verifyAuth(to.fullPath);

    const storeUi = useUi()
    storeUi.setOwnProfile(to.params.screenName)
    next();
  } catch (err) {
    console.error('Router/auth :', err.message)
    return
  }

}