import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth'

const client = generateClient();

const checkAuth = async () => {
  try {
    const currentUser = await getCurrentUser()
    console.info('✅ User authenticated:', currentUser.signInDetails.loginId)
    return true
  } catch (err) {
    console.error('❌ User not authenticated:', err)
    return false
  }
}

export async function callQuery(queryStr) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      throw "Not authenticated"
    }
    const res = await client.graphql({
      query: queryStr
    });
    return res;    
  } catch (err) {
    console.info('Error [callQuery] :', err.message)
  }
}