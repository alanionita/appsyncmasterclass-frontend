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
    next();
  } catch (err) {
    console.error('Router/auth :', err.message)
    return
  }

}