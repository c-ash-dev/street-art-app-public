/*
  Promise support functions
*/
/* eslint camelcase: "off" */

// Utils / Constants
/*
  this is a record to be sent to Cloud Function to create a new Artwork Image
*/
import { Device, ImageCaptureDefaults as ImgDefaults, ImageCaptureMethods } from '@/app-constants'

/*
  create initial data structure
*/
export const CreateNewArtworkRecord = function() {
  return function({ artistId = '', caption = '', imageData = '', }) {
    const structure = {
      artistId,
      caption,
      imageData,
    }
    return Promise.resolve(structure)
  }
}

/*
  get picture, either from camera or gallery

  side: device, camera, captureMethod
  thru: structure
  layer: imageUri
*/
export const GetImageFromDevice = function({ device, camera, captureMethod, uriKey = 'uri', gpsKey = 'gpsInfo', }) {
  //

  const CAMERA_CANCEL_STRINGS = [
    'No image selected.', // iOS
    'Selection cancelled.', // Android
    'Camera cancelled.' // Android
  ]

  // get source depending on platform
  let sourceType
  if (captureMethod === ImageCaptureMethods.CAMERA) {
    sourceType = camera.PictureSourceType.CAMERA
  } else {
    sourceType = camera.PictureSourceType.PHOTOLIBRARY
  }
  if (device.platform === Device.Platform.Browser) {
    sourceType = camera.PictureSourceType.PHOTOLIBRARY
  }

  // default camera options
  const cameraOpts = {
    cameraDirection: camera.Direction.BACK,
    correctOrientation: true,
    destinationType: camera.DestinationType.FILE_URI,
    encodingType: camera.EncodingType.JPEG,
    mediaType: camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
    targetWidth: ImgDefaults.maxDimension,
    targetHeight: ImgDefaults.maxDimension,
    sourceType,
    quality: ImgDefaults.quality,
  }

  return function(structure) {
    const dataStruct = structure || {}

    return new Promise((resolve, reject) => {
      //

      // get picture from gallery / camera
      const getPicture = (function(struct) {
        return () => {
          return new Promise((resolve, reject) => {
            navigator.camera.getPicture(
              (imageInfo) => {
                let imageJson
                try {
                  imageJson = JSON.parse(imageInfo)
                } catch (error) {
                  reject(`error parsing camera json: ${error}`)
                  return
                }
                const { filename, json_metadata, } = imageJson
                const exifMetadata = JSON.parse(json_metadata)

                if (!exifMetadata) {
                  reject('no EXIF metadata recovered')
                  return
                }

                // console.log('JSON', json_metadata)
                // console.log('EXIF', exifMetadata)

                let gps
                if (device.platform === Device.Platform.Android) {
                  gps = getAndroidGps(exifMetadata)
                } else {
                  gps = getIosGps(exifMetadata)
                }

                // console.log('GPS', gps)

                if (!gps) {
                  reject('GPS data not found')
                  return
                }

                /*
                  START: bug-fix

                  a fix for issue with 'cordova-plugin-camera-with-exif'
                  returned filename is incorrect, needs 'file://'

                  https://github.com/remoorejr/cordova-plugin-camera-with-exif/issues/32
                */
                let imageUri = filename
                if (device.platform === Device.Platform.Android) {
                  imageUri = filename.indexOf('file://') === -1 ? `file://${filename}` : filename
                }
                // END: bug fix

                // update structure with image URI & gps data
                const getPictureData = {
                  [gpsKey]: gps,
                  [uriKey]: imageUri,
                }
                resolve(Object.assign(struct, getPictureData))
              },
              (err) => reject(err),
              cameraOpts
            )
          })
        }
      })(dataStruct)

      getPicture()
        .then(res => resolve(res))
        .catch(error => {
          if (typeof error === 'object' && error.isUpstream === true) {
            // forward previous error
            return reject(error)
          } else if (CAMERA_CANCEL_STRINGS.includes(error)) {
            // 'Selection cancelled.', 'Camera cancelled.'
            // image selection canceled, so close window
            return reject({ action: 'close', isUpstream: true, })
          } else {
            return reject({ action: 'alert', isUpstream: true, error, })
          }
        })
    })
  }
}

/*
  get geo-location from device

  thru: object payload
  layer: latitude, longitude, timestamp
*/
export const createGetGeolocation = function() {
  return function(structure) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        // onSuccess
        position => {
          const { coords, timestamp, } = position
          const { latitude, longitude, } = coords
          const geoData = {
            latitude, longitude, timestamp,
          }
          // update structure with geo data
          resolve(Object.assign(structure, geoData))
        },
        // onError
        err => {
          const { code, message, } = err
          console.error(`ERROR getting geo-location '${code}:${message}'`)
          reject(err)
        }
      )
    })
  }
}

const getIosGps = function(exif) {
  const { GPS, } = exif
  if (!GPS) {
    return null
  }
  const { Latitude, LatitudeRef, Longitude, LongitudeRef, } = GPS
  if (!Latitude || !LatitudeRef || !Longitude || !LongitudeRef) {
    return null
  }
  return {
    Latitude,
    LatitudeRef,
    Longitude,
    LongitudeRef,
  }
}

const getAndroidGps = function(exif) {
  const { gpsLatitude, gpsLatitudeRef, gpsLongitude, gpsLongitudeRef, } = exif
  if (!gpsLatitude || !gpsLatitudeRef || !gpsLongitude || !gpsLongitudeRef) {
    return null
  }
  return {
    Latitude: gpsLatitude,
    LatitudeRef: gpsLatitudeRef,
    Longitude: gpsLongitude,
    LongitudeRef: gpsLongitudeRef,
  }
}

/*
  read image data from filesystem

  thru: object payload
  read: imageUri
  layer: imageData (base64)
*/
export const ReadFileSystemData = function({ dataKey = 'data', }) {
  return function(callProps) {
    const { imageUri, structure, } = callProps
    const dataStruct = structure || {}

    return new Promise((resolve, reject) => {
      /*
        side: imageUri
        thru: none
      */
      const getFileRef = (function(imgUri) {
        return function() {
          return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(imgUri,
              fileEntry => resolve(fileEntry),
              err => reject(err)
            )
          })
        }
      })(imageUri)

      /*
        side: none
        thru: fileEntry
      */
      const readFileData = (function() {
        return function(fileEntry) {
          // DEBUG
          // console.log('fileEntry', fileEntry)
          return new Promise((resolve, reject) => {
            fileEntry.file(
              file => {
                const reader = new FileReader()
                reader.onloadend = function(event) {
                  // data:image/jpeg;base64,/9j/4QBqRXhpZgAA...
                  const base64Data = event.target.result
                  resolve(base64Data)
                }
                reader.readAsDataURL(file)
              },
              err => reject(err)
            )
          })
        }
      })()

      // start promise chain
      getFileRef()
        .then(readFileData)
        .then(imageData => {
          /*
          uncomment next line to get test image data
          console.log(imageData)
          */
          // update structure with image data
          resolve(Object.assign(dataStruct, { [dataKey]: imageData, }))
        })
        .catch(err => reject(err))
    })
  }
}

/*
  create function to submit payload to data store
  given store and store path

  thru: object payload
*/
export const DispatchStoreAction = function(store, storePath) {
  return function(payload) {
    return store.dispatch(storePath, payload)
  }
}

export const UploadNewArtworkRecord = function(store) {
  return DispatchStoreAction(store, 'app/submitNewArtworkRecord')
}
