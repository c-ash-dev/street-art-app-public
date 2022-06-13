/*
*/

import { GeoLocationUpdateFrequency } from '@/app-constants'

export const getCurrentGeoPosition = () => {
  return new Promise((resolve, reject) => {
    const geoLocator = navigator.geolocation
    const geoOptions = {
      enableHighAccuracy: true,
      maximumAge: GeoLocationUpdateFrequency,
    }

    if (!geoLocator) {
      reject('ERROR: geolocator not avail')
    } else {
      geoLocator.getCurrentPosition(
        position => {
          const { coords, timestamp, } = position
          const { latitude, longitude, } = coords
          const geoData = {
            latitude, longitude, timestamp,
          }
          resolve(geoData)
        },
        // onError
        err => {
          const { code, message, } = err
          console.error(`ERROR getting geo-location '${code}:${message}'`)
          reject(err)
        },
        geoOptions,
      )
    }
  })
}

export const geoRecToGmapStruct = (geoRec) => {
  return {
    lat: geoRec.latitude,
    lng: geoRec.longitude,
  }
}

/*
  https://developers.google.com/maps/documentation/javascript/reference/3/coordinates
*/
export const gmapCoordsToGmapStruct = (gmapCoords) => {
  return {
    lat: gmapCoords.lat(),
    lng: gmapCoords.lng(),
  }
}

export const startGeoLocationWatch = (onSuccess, onError) => {
  const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: GeoLocationUpdateFrequency,
  }
  const geoLocator = navigator.geolocation

  if (!geoLocator) {
    onError('ERROR: geolocator not avail')
  } else {
    geoLocator.watchPosition(onSuccess, onError, geoOptions)
  }
}

/*

      haveActiveGeoQuery: null,
      lastGeoQueryTimestamp: 0,

    _updateGeoLocation() {
      if (this.haveActiveGeoQuery) {
        return this.haveActiveGeoQuery
      }

      this.lastGeoQueryTimestamp = Date.now()

      const geoQuery = getCurrentGeoPosition()
        .then(geoRec => store.commit('setCurrentLocation', geoRec))
        .catch(err => {
          const { code, message, } = err
          console.error(`ERROR getting geo-location '${code}:${message}'`)
        })
        .then(() => this._resetGeoQuery())
        .then(() => this._requestGeoLocationUpdate())

      this.haveActiveGeoQuery = geoQuery
    },

    _resetGeoQuery() {
      this.haveActiveGeoQuery = null
    },

    _requestGeoLocationUpdate() {
      const now = Date.now()
      const diff = now - this.lastGeoQueryTimestamp
      const timeout = (diff >= GeoLocationUpdateFrequency) ? 0 : (GeoLocationUpdateFrequency - diff)
      setTimeout(() => this._updateGeoLocation(), timeout)
    },

        // this._requestGeoLocationUpdate() // stop original lookup for now
*/
