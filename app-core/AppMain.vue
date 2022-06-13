<template>
  <div>

    <!-- top toolbar -->
    <v-toolbar app fixed>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-btn color="pink" top right fixed fab
        @click.prevent="handleShowImageCapture"
      >
        <v-icon color="white" large>fa-plus</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <keep-alive>
        <component :is="currentTabComponent" />
      </keep-alive>
    </v-content>

    <!-- bottom navigation toolbar -->
    <v-bottom-nav app
      :value="true"
      :active.sync="currentTabIdx"
      color="white"
    >
      <v-btn flat :ripple="false" icon color="blue accent-3" class="btn--menu-plain">
        <v-icon>fa-images</v-icon>
      </v-btn>
      <v-btn flat :ripple="false" icon color="blue accent-3" class="btn--menu-plain">
        <v-icon>fa-map-marked-alt</v-icon>
      </v-btn>
      <v-btn flat icon :ripple="false" color="blue accent-3" class="btn--menu-plain">
        <v-icon>fa-user</v-icon>
      </v-btn>
    </v-bottom-nav>

    <v-dialog fullscreen hide-overlay
      :scrollable="false"
      v-model="isArtworkDetailActive"
      transition="dialog-bottom-transition">
      <artwork-detail
        v-if="isArtworkDetailActive"
        :artworkRec="artworkRecord"
       />
    </v-dialog>

    <v-dialog fullscreen hide-overlay
      :scrollable="false"
      v-model="isImageCaptureActive"
      transition="dialog-bottom-transition"
    >
      <image-capture
        @close="handleImageCaptureClose"
        @error="handleImageCaptureError"
      />
    </v-dialog>
  </div>
</template>

<script>
// Components
import ArtworkDetail from '../pages/ArtworkDetail'
import ArtworkGlobal from '../components/artwork-feeds/ArtworkGlobal'
import ArtworkMap from '../pages/ArtworkMap'
import ImageCapture from '../app-core/ImageCapture'
import UserContent from '../pages/UserContent'

export default {

  components: {
    ArtworkDetail,
    ImageCapture,
  },

  data() {
    return {

      currentTabIdx: 0, // set to another number for testing

      tabs: [
        {
          component: ArtworkGlobal,
          key: 'add-artwork',
          title: 'Artwork',
        },
        {
          component: ArtworkMap,
          key: 'artwork-map',
          title: 'Map Search',
        },
        {
          component: UserContent,
          key: 'user-content',
          title: 'My Stuff',
        }
      ],

    }
  },

  computed: {

    /*
      return tab component for display
      based on the current tab index
    */
    currentTabComponent() {
      const idx = this.currentTabIdx
      return this.tabs[idx].component
    },

    isImageCaptureActive() {
      return this.$store.state.activeImageCapture
    },

    artworkDetailId() {
      const artworkId = this.$store.getters['app/getArtworkDetailId']
      return artworkId
    },

    artworkRecord() {
      const artworkId = this.artworkDetailId
      const getArtworkById = this.$store.getters['app/getArtworkById']
      const artworkRec = getArtworkById(artworkId)
      return artworkRec
    },

    isArtworkDetailActive() {
      const { artworkRecord, } = this
      return (artworkRecord !== null)
    },

    isCordova() {
      return this.$store.getters.isCordova
    },

    title() {
      const tab = this.tabs[this.currentTabIdx]
      return tab.title
    },

  },

  methods: {

    closeImageCapture() {
      this.$store.commit('setActiveImageCapture', false)
    },

    openImageCapture() {
      this.$store.commit('setActiveImageCapture', true)
    },

    handleImageCaptureClose() {
      this.closeImageCapture()
    },

    handleImageCaptureError(err) {
      console.warn('handlePhotoSubmitError', err)
      window.alert('unknown error getting image')
      this.closeImageCapture()
    },

    handleShowImageCapture() {
      if (!this.isCordova) {
        console.warn('WARN: cannot select image, need cordova platform')
        return
      }
      this.openImageCapture()
    },

  },
}
</script>

<style lang="scss" scoped>
</style>
