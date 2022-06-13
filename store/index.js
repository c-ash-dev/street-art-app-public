/*
*/

// Libs
import Vue from 'vue'
import Vuex from 'vuex'

// Utils & Constants
import {
  Routes,
  ProgressDialogContent
} from '@/app-constants'

import {
  startGeoLocationWatch
} from '@/utils/geo-utils'

// Components
import { router } from '../app-core/router'
import AppModule from './modules/app-store'
import UserModule from './modules/user-store'
import * as fsSrvc from '../services/firestore-srvc'

Vue.use(Vuex)

/*
  setup main store
*/

export const store = new Vuex.Store({

  state: {

    hasCheckedAuth: false,
    token: '',
    status: '',

    cordova: {
      // eg, '5.0.3', '7.1.0', '4.5.4'
      version: null,

      // eg, 'browser', 'Android', 'iOS'
      platform: null,
    },

    device: {
      isVirtual: true,

      // eg 'unknown', 'Google', 'Apple'
      manufacturer: null,

      // eg, 'Safari', 'Pixel 2', 'iPhone9,2'
      model: null,

      // eg, 'unknown' (browser/iOS), 'FA4324324'
      serial: null,

      // eg, null or '42jk42j4k432fff', '4324-4324-5443-j432432-432'
      uuid: null,

      // eg, '11.0', '8.1.0', '11.4'
      version: null,
    },

    location: {
      longitude: 0, // eg, 40.027669499999995
      latitude: 0, // eg, -105.2822309
    },

    activeImageCapture: false, // set to true for testing

    activeArtworkDetail: false,

    shouldShowSpinner: false,

    indeterminateProgressContent: '',
  },

  modules: {
    user: UserModule,
    app: AppModule,
  },

  getters: {

    isAuthenticated(state) {
      return (state.token !== '')
    },

    hasCheckedAuth(state) {
      return state.hasCheckedAuth
    },

    isCordova(state) {
      return (state.cordova.platform !== null)
    },

    currentLocation(state) {
      return state.location
    },

    popoverDialogContent(state) {
      return state.popoverDialogContent
    },

    shouldShowSpinner(state) {
      return state.shouldShowSpinner
    },

    indeterminateProgressContent(state) {
      return state.indeterminateProgressContent
    },

  },

  mutations: {

    setAuthCheck(state, payload) {
      state.hasCheckedAuth = payload
    },

    loginSuccess(state, payload) {
      const { token, } = payload
      state.token = token
    },

    logoutSuccess(state) {
      state.token = ''
    },

    setActiveImageCapture(state, payload) {
      state.activeImageCapture = payload
    },

    showUploadProgress(state) {
      state.indeterminateProgressContent = ProgressDialogContent.Upload
    },

    hideUploadProgress(state) {
      state.indeterminateProgressContent = ''
    },

    startSpinner(state) {
      state.shouldShowSpinner = true
    },

    stopSpinner(state) {
      state.shouldShowSpinner = false
    },

    setCordovaInfo(state, payload) {
      const { platform, version, } = payload
      state.cordova.platform = platform
      state.cordova.version = version
    },

    setDeviceInfo(state, payload) {
      const { model, uuid, version, manufacturer, isVirtual, serial, } = payload
      state.device.isVirtual = isVirtual
      state.device.manufacturer = manufacturer
      state.device.model = model
      state.device.serial = serial
      state.device.uuid = uuid
      state.device.version = version
    },

    setCurrentLocation(state, payload) {
      const { latitude, longitude, } = payload
      // console.log('setting setCurrentLocation', payload)
      // set individually to stop unnecessary re-draws
      Vue.set(state.location, 'latitude', latitude)
      Vue.set(state.location, 'longitude', longitude)
    },

  },

  actions: {

    // initialize({ commit, dispatch, getters, rootGetters }, payload) {
    initialize({ dispatch, }) {
      dispatch('app/initialize')
      dispatch('user/initialize')
    },

    startGeoLocationWatch({ commit, }) {
      startGeoLocationWatch(
        position => {
          const { coords, timestamp, } = position
          const { latitude, longitude, } = coords
          const geoRec = {
            latitude, longitude, timestamp,
          }
          commit('setCurrentLocation', geoRec)
        },
        error => {
          console.error('ERROR in geolocation', error)
        }
      )
    },

    loginRequest({ commit, }, payload) {
      const { email, password, } = payload
      return new Promise((resolve, reject) => {
        commit('startSpinner')
        fsSrvc.signInWithEmailAndPassword(email, password)
          .then(
            result => {
              commit('stopSpinner')
              return result
            },
            error => {
              commit('stopSpinner')
              throw error
            }
          )
          .then(user => {
            const payload = {
              token: user.uid,
              user,
            }
            commit('loginSuccess', payload)
            resolve('SUCCESS')
          })
          .catch(error => {
            const { code, message, } = error
            console.error(`signInWithEmailAndPassword: ${code} : ${message}`)
            commit('logoutSuccess')
            reject(error)
          })
      })
    },

    logoutRequest({ commit, dispatch, }) {
      return new Promise((resolve, reject) => {
        fsSrvc.signOut()
          .then(() => {
            commit('logoutSuccess')
            router.replace({ name: Routes.LOGIN, })
            resolve('SUCCESS')
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    signupRequest({ commit, }, payload) {
      const { email, password, } = payload
      return new Promise((resolve, reject) => {
        commit('startSpinner')
        fsSrvc.createUserWithEmailAndPassword(email, password)
          .then(
            result => {
              commit('stopSpinner')
              return result
            },
            error => {
              commit('stopSpinner')
              throw error
            }
          )
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

  },

})

fsSrvc.onAuthStateChanged(user => {
  if (user == null) {
    store.commit('logoutSuccess')
  } else {
    const payload = {
      token: user.uid,
      user,
    }
    store.commit('loginSuccess', payload)
    store.dispatch('app/startBookmarksWatch')
    store.dispatch('app/startUserPhotosWatch')
    store.dispatch('app/startLikesWatch')
    store.dispatch('startGeoLocationWatch')
    store.dispatch('app/startVisitsWatch')
  }
  store.commit('setAuthCheck', true)
})
