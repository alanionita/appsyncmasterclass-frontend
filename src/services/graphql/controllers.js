import * as Queries from "@/services/appsync/queries";
import * as gql from "./utils";

export const getMyProfile = async () => {
  try {
    const res = await gql.query(Queries.getMyProfile)
    
    const profile = res.data.getMyProfile;

    profile.imgUrl = profile.imgUrl || 'default_profile.png'

    return profile
  } catch (err) {
    console.info('Error [getMyProfile] :', err.message)
  }
}
