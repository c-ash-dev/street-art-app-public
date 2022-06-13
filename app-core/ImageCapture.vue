<template>
  <div id="image-capture-component" class="blue-grey lighten-4">
    <v-toolbar app>
      <v-btn icon
        @click.prevent="_handleToolbarLeftButton"
      >
        <v-icon v-text="topLeftButtonIcon" />
      </v-btn>

      <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <capture-method
        v-if="currentCaptureStep === 0"
        @selected="_handleImageSelectedSuccess"
        @error="_handleImageSelectedError"
      />
      <submit-image
        v-if="currentCaptureStep === 1"
        :imageUri="imageUri"
        @submit="_handleDoImageSubmit"
        @cancel="_handleCancelImageSubmit"
      />
    </v-content>
  </div>
</template>

<script>
/*
  no properties
  emit:
  @close
  @error
*/

// Components
import CaptureMethod from '@/components/image-capture/CaptureMethod'
import SubmitImage from '@/components/image-capture/SubmitImage'
import {
  CreateNewArtworkRecord,
  ReadFileSystemData,
  UploadNewArtworkRecord
} from '@/utils/photo-submit-support'

// Utils
export default {

  components: {
    CaptureMethod,
    SubmitImage,
  },

  data() {
    return {
      // imageUri: 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
      imageUri: '',
      artistId: '', // empty for "unknown"
      caption: '',
      // currentCaptureStep: 0,
      steps: [
        {
          component: CaptureMethod,
          key: 'capture-method',
          title: 'Choose Location',
        },
        {
          component: SubmitImage,
          key: 'submit-image',
          title: 'Submit!',
        }
      ],
    }
  },

  computed: {

    currentCaptureData() {
      const idx = this.currentCaptureStep
      return this.steps[idx]
    },

    // currentCaptureComponent() {
    //   const idx = this.currentCaptureStep
    //   return this.steps[idx].component
    // },

    currentCaptureStep() {
      if (this.imageUri === '') {
        return 0
      } else {
        return 1
      }
    },

    haveImageUri() {
      return (this.imageUri !== '')
    },

    topLeftButtonIcon() {
      return (this.currentCaptureStep === 0) ? 'fa-times' : 'fa-arrow-left'
    },

    toolbarTitle() {
      return this.currentCaptureData.title
    },

  },

  methods: {

    _resetAll() {
      this.imageUri = ''
      this.artistId = ''
      this.caption = ''
    },

    _handleWindowClose() {
      this.$emit('close')
      this._resetAll()
    },

    _handleWindowError(err) {
      this.$emit('error', err)
      this._resetAll()
    },

    _handleToolbarLeftButton() {
      if (this.currentCaptureStep === 0) {
        this._handleWindowClose()
      } else {
        this._stepBackwards()
      }
    },

    _stepBackwards() {
      if (this.currentCaptureStep === 1) {
        this.imageUri = ''
      }
    },

    // Step 0

    _handleImageSelectedSuccess(imageCaptureResult) {
      const { imageUri, gps, } = imageCaptureResult
      this.imageUri = imageUri
      this.gps = gps
    },

    // err - action, isUpstream, error,
    _handleImageSelectedError(err) {
      const { action, error, } = err
      switch (action) {
        case 'close':
          break
        case 'alert':
        default:
          alert(error)
          break
      }
    },

    // Step 1

    _handleDoImageSubmit() {
      this._uploadImageRecord()
    },

    _handleCancelImageSubmit() {
      this._handleWindowClose()
    },

    _uploadImageRecord() {
      // setup promise calls
      const createRecord = CreateNewArtworkRecord()
      const mapCreateRecordToReadData = (result) => {
        return { imageUri: this.imageUri, structure: result, }
      }
      const readFileSystemData = ReadFileSystemData({ dataKey: 'imageData', })
      const uploadData = UploadNewArtworkRecord(this.$store)

      // start promise chain

      createRecord({
        artistId: this.artistId,
        caption: this.caption,
        imageData: '',
      })
        .then(mapCreateRecordToReadData)
        .then(readFileSystemData)
        .then(uploadData)
        .then(result => {
          this._handleWindowClose()
        })
        .catch(error => {
          this._handleWindowError(error)
        })
    },

  },

}
</script>

<style lang="scss">
#image-capture-component {
  width: 100%;
  height: 100vh;
}
</style>
