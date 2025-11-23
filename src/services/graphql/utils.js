import { generateClient } from 'aws-amplify/api';
import { checkAuth } from "@/services/amplify/utils";

const client = generateClient();

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