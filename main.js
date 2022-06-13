// Libs
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCordova from 'vue-cordova'
import * as VueGoogleMaps from 'vue2-google-maps'
import * as moment from 'moment'
import GmapCluster from 'vue2-google-maps/src/components/cluster'

// Ensure you are using css-loader
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

// Buefy Addition
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

// Eventually remove Vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

// Utils & Constants
import {
  Device
} from './app-constants'

// Components
import App from './App'
import { router } from './app-core/router'
import { store } from './store'

Vue.filter('formatDate', function(value) {
  return (value) ? moment.unix(value).format('MMMM Do, YYYY') : ''
})

/*
  Vue initialization
*/

// Initialize Buefy
Vue.use(Buefy, {
  iconfont: 'fa',
})

// Initialize Vuetify
Vue.use(Vuetify, {
  iconfont: 'fa',
})

// Intialize Vue Cordova

Vue.use(VueCordova, {
  optionTestKey: 'optionTestValue',
})

Vue.prototype.$cordova = Vue.cordova

/*
  add cordova.js only if serving the app through file://
  or browser platform
*/
if (window.location.protocol === 'file:' || window.location.port === '3000' || window.location.port === '8000') {
  var cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

/*
  checks device information and puts in data store
*/
Vue.cordova.on('deviceready', () => {
  const { device, } = Vue.cordova

  console.log('Cordova : device is ready !', Vue.cordova)
  // for (const key in device) {
  //   console.log(`${key} : ${device[key]}`)
  // }

  let errStr
  if (!Vue.cordova.camera) {
    errStr = 'ERROR camera plugin failed to load'
  }
  if (!Vue.cordova.device) {
    errStr = 'ERROR device plugin failed to load'
  }
  if (!Vue.cordova.geolocation) {
    errStr = 'ERROR geolocation plugin failed to load'
  }
  if (errStr) {
    alert(errStr)
    console.error(errStr)
  }

  // set cordova info in vuex
  const { cordova, platform, } = device
  store.commit('setCordovaInfo', { version: cordova, platform, })

  // set device info in vuex
  const { isVirtual, manufacturer, model, serial, uuid, version, } = device
  store.commit('setDeviceInfo', { isVirtual, manufacturer, model, serial, uuid, version, })

  if (device.platform !== Device.Platform.Browser) {
    window.screen.orientation.lock('portrait')
  }
})

// Initialize Vue Router

Vue.use(VueRouter)

// Initialize Google Maps

Vue.use(VueGoogleMaps, {
  load: {
  },
})

Vue.component('gmap-cluster', GmapCluster)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),

  created() {
    // initialize storage areas
    this.$store.dispatch('initialize')
  },
})
