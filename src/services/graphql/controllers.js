import * as Queries from "@/services/appsync/queries";
import { callQuery } from "./utils";

export const getMyProfile = async () => {
  try {
    const res = await callQuery(Queries.getMyProfile)
    
    const profile = res.data.getMyProfile;

    profile.imgUrl = profile.imgUrl || 'default_profile.png'

    return profile
  } catch (err) {
    console.info('Error [getMyProfile] :', err.message)
  }
}
