/*
  Vuex module: User
*/

// Libs
import Vue from 'vue'
import DB from '../../data/DataBase'

export default {

  namespaced: true,

  state: {
    userImages: [],
    firstName: '',
    lastName: '',
    city: '',
    favorites: {
      /*
      '1': {
        id: 1,
        timestamp: 0,
      }
      */
    },
  },

  getters: {
    // state, getters, rootState, rootGetters

    name(state) {
      return state.firstName + ' ' + state.lastName
    },

    images(state) {
      return state.userImages
    },

  },

  mutations: {
    // state, getters, rootState, rootGetters

    // payload is Destination Object
    addUserImage(state, payload) {
      state.userImages.push(payload)
    },

    updateUserInfo(state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.city = payload.city
    },

    addFavorite(state, payload) {
      const { imageId, } = payload
      const rec = {
        id: imageId,
        timestamp: Date.now(),
      }
      Vue.set(state.favorites, imageId, rec)
    },

  },

  actions: {
    // ({ dispatch, commit, getters, rootGetters }, payload)

    /*
      load initial data records into store
      called from Store index.js
    */
    initialize({ dispatch, commit, getters, }, payload) {
      payload = payload || {}

      const fakeServer = function() {
        commit('updateUserInfo', DB.getUserInfo())

        const UserImages = DB.getMyImages()
        UserImages.forEach(rec => {
          commit('addUserImage', rec)
        })
      }

      setTimeout(fakeServer, 250)
    },

    saveToFavorites({ dispatch, commit, getters, }, payload) {
      commit('addFavorite', payload)

      // update data server
      // DB.updateUserData()
    },

  },

}
