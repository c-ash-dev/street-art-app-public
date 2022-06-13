/*
  database file emulating data base api
*/

import myImages from './my-images'
import userInfo from './user-info'

export default {

  getMyImages() {
    return myImages
  },

  getUserInfo() {
    return userInfo
  },

  setUserName(value) {
    console.log('setting new name in database', value)
  },

}
