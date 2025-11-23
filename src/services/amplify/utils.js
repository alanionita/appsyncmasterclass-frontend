import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export async function checkAuth () {
  try {
    const currentUser = await getCurrentUser()
    return currentUser && true
  } catch (err) {
    console.error('❌ User not authenticated:', err)
    return false
  }
}

export async function getCognitoToken() {
    try {
        const currentUser = await getCurrentUser()
        const session = await fetchAuthSession()
        return session.getIdToken().getJwtToken();
    } catch (error) {
        throw new Error('[amplify/utils/getCognitoToken] : Authentication required');
    }
}