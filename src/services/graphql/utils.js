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

export async function query({ queryStr, variables = null }) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      throw "Not authenticated"
    }

    const params = {
      query: queryStr
    };

    if (variables) {
      params['variables'] = variables
    }

    const res = await client.graphql(params);
    return res;
  } catch (err) {
    console.error('Error [callQuery] :', err.message)
  }
}