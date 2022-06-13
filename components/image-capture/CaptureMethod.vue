<template>
  <v-container fluid class="capture-method blue-grey lighten-4">
    <v-layout column fill-height align-center justify-center>

      <div class="my-5">
        <v-flex class="text-xs-center">
          <v-btn flat :ripple="false" icon color="indigo darken-2" class="mb-4"
            @click.prevent="handleCameraInputSelection"
          >
            <v-icon size="100px">fa-camera</v-icon>
          </v-btn>
          <div class="font-weight-bold display-2 my-3">camera</div>
        </v-flex>
      </div>

      <div class="my-5">
        <v-flex class="text-xs-center">
          <v-btn flat :ripple="false" icon color="indigo darken-2" class="mb-4"
            @click.prevent="handleGalleryInputSelection"
          >
            <v-icon size="100px">fa-images</v-icon>
          </v-btn>
          <div class="font-weight-bold display-2 my-3">gallery</div>
        </v-flex>
      </div>

    </v-layout>
  </v-container>
</template>

<script>
/*
  on submit complete, structure:
  {
    imageUri: '<file>',
    gps: {
      gpsLatitude,
      gpsLatitudeRef,
      gpsLongitude,
      gpsLongitudeRef,
    }
  }
*/

import {
  ImageCaptureMethods
} from '@/app-constants'

// Modules
import {
  GetImageFromDevice
} from '@/utils/photo-submit-support'

export default {

  methods: {
    _handleSelectionSuccess(data) {
      this.$emit('selected', data)
    },

    _handleSelectionError(error) {
      this.$emit('error', error)
    },

    handleCameraInputSelection() {
      this.doImageCapture(ImageCaptureMethods.CAMERA)
    },

    handleGalleryInputSelection() {
      this.doImageCapture(ImageCaptureMethods.GALLERY)
    },

    doImageCapture(captureMethod) {
      const { camera, device, } = this.$cordova

      // setup promise calls

      const getImage = GetImageFromDevice({
        camera, device, captureMethod, uriKey: 'imageUri', gpsKey: 'gps',
      })

      // start promise chain

      getImage()
        .then(result => {
          this._handleSelectionSuccess(result)
        })
        .catch(error => {
          console.warn('ERROR: Photo Submit:', error)
          this._handleSelectionError(error)
        })
    },

  },

}
</script>

<style lang="scss">
.capture-method {
  width: 100%;
  height: calc(100vh - 112px);
}
</style>
