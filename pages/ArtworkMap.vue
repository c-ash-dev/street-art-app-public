<template>
  <div id="artwork-map-component">
    <gmap-map
      ref="gmap"
      :center="mapCenter"
      :zoom="defaultMapZoom"
      @center_changed="_handleMapCenterChanged"
      @click="_handleMapClicked"
      @bounds_changed="_handleMapBoundsChanged"
      @idle="syncCenters"
    >
      <!-- current-location marker -->
      <gmap-marker class="you-are-here"
        :position="currentLocation"
        :clickable="false"
        type="circle"
        :icon="locationIcon"
      />

      <!-- map markers / clustering -->
      <gmap-cluster
        :maxZoom="maxClusterZoom"
        :zoomOnClick="zoomMapOnClusterClick"
      >
        <gmap-marker v-for="(marker, index) in markers"
          :key="index"
          :position="marker.position"
          :clickable="true"
          @click="_handleMarkerClicked({ event: $event, marker, })"
        />
      </gmap-cluster>

    </gmap-map>
    <div class="button-map elevation-2">
      <b-btn :ripple="false"
        @click.prevent="_handleLocationArrowClicked"
      >
        <b-icon :type="mapToggleBtnColors" pack="fas" icon="location-arrow" size="20px"></b-icon>
      </b-btn>
    </div>
    <v-layout row justify-center v-if="selectedArtwork">
      <artwork-detail-card :artworkRecord="selectedArtwork"
        @click.native="openArtworkDetail"/>
    </v-layout>
    <div v-if="isDebugActive" class="debug-pane" v-html="debuggingInfo"/>
  </div>
</template>

<script>
// Libs
import Vue from 'vue'

// Utils
import { geoRecToGmapStruct, gmapCoordsToGmapStruct } from '@/utils/geo-utils'
import ArtworkDetailCard from '@/components/artwork-map/ArtworkDetailCard'

const DEBUG = false

const addGmapStructs = function(gS1, gS2) {
  return {
    lat: gS1.lat + gS2.lat,
    lng: gS1.lng + gS2.lng,
  }
}

export default {

  name: 'ArtworkMap',

  components: {
    ArtworkDetailCard,
  },

  data() {
    return {
      mapCenter: {
        lat: 0,
        lng: 0,
      },

      defaultMapZoom: 14,
      maxClusterZoom: 20,
      zoomMapOnClusterClick: true,

      lastReportedMapCenter: {
        lat: 0,
        lng: 0,
      },

      selectedArtwork: null,

      locationIcon: require('@/assets/bluecircle.png'),

      mapCenterFollowsLocation: true,

      mapCenterFollowsOffset: {
        lat: 0,
        lng: 0,
      },

      debugStrs: [],
      isDebugActive: DEBUG,
    }
  },

  computed: {

    markers() {
      const artwork = this.$store.getters['app/latestArtwork']
      return artwork.map((artworkRec) => {
        const { coordinates, id, } = artworkRec
        const queryMarkerRec = {
          position: geoRecToGmapStruct(coordinates),
          id,
        }
        return queryMarkerRec
      })
    },

    /*
      returns gmapStruct
    */
    currentLocation() {
      const { latitude, longitude, } = this.$store.getters['currentLocation']
      return geoRecToGmapStruct({ latitude, longitude, })
    },

    mapToggleBtnColors() {
      return this.mapCenterFollowsLocation ? 'is-info' : 'grey'
    },

    debuggingInfo() {
      const recs = this.debugStrs
      return recs.join('<br />')
    },

  },

  methods: {

    addDebugStr(str) {
      const arr = this.debugStrs
      arr.unshift(str)
      this.debugStrs = arr.slice(0, 5)
    },

    openArtworkDetail() {
      const { id, } = this.selectedArtwork
      this.$store.commit('app/setArtworkDetailId', id)
    },

    startMapFollowsLocation() {
      this.mapCenterFollowsLocation = true
    },

    stopMapFollowsLocation() {
      this.mapCenterFollowsLocation = false
    },

    toggleMapFollowsLocation() {
      this.mapCenterFollowsLocation = !this.mapCenterFollowsLocation
    },

    syncCenters() {
      this.mapCenter = this.lastReportedMapCenter
    },

    getMapAsync() {
      return this.$refs.gmap.$mapPromise
    },

    panCenterAsync(mapStruct) {
      return this.getMapAsync()
        .then(map => {
          map.panTo(mapStruct)
        })
    },

    updateReportedCenter(mapStruct) {
      this.lastReportedMapCenter = mapStruct
    },

    updateReportedCenterWithPan(mapStruct) {
      const offset = this.mapCenterFollowsOffset
      const struct = addGmapStructs(mapStruct, offset)
      this.updateReportedCenter(struct)
      return this.panCenterAsync(struct)
    },

    updateReportedCenterWithSync(mapStruct) {
      const offset = this.mapCenterFollowsOffset
      const struct = addGmapStructs(mapStruct, offset)
      this.updateReportedCenter(struct)
      this.syncCenters()
    },

    removeSelectedArtwork() {
      this.selectedArtwork = null
    },

    resetMapFollowsOffset() {
      this.mapCenterFollowsOffset = {
        lat: 0,
        lng: 0,
      }
    },

    setSelectedArtwork(artworkRec) {
      this.selectedArtwork = artworkRec
    },

    /*
      Event Handlers
    */

    _handleLocationArrowClicked() {
      this.toggleMapFollowsLocation()
      if (this.mapCenterFollowsLocation) {
        this.resetMapFollowsOffset()
        this.updateReportedCenterWithPan(this.currentLocation)
      }
    },

    _handleMapBoundsChanged(/* event */) {
      // console.log('_handleMapBoundsChanged')
      this.getMapAsync()
        .then(map => {
          const currentLoc = this.currentLocation

          // check if map follows still active
          const mapBounds = map.getBounds()
          if (mapBounds.contains(currentLoc) === false) {
            this.stopMapFollowsLocation()
          }

          // calculate offset to be maintained
          const mapCenter = map.getCenter()
          const gmapStruct = gmapCoordsToGmapStruct(mapCenter)
          const latDiff = gmapStruct.lat - currentLoc.lat
          const lngDiff = gmapStruct.lng - currentLoc.lng
          this.mapCenterFollowsOffset.lat = latDiff
          this.mapCenterFollowsOffset.lng = lngDiff
        })
    },

    /*
      this can be called in two instances:
      1. user moves the map
      2. a call to map panTo()
    */
    _handleMapCenterChanged(gmapCoords) {
      // console.log('_handleMapCenterChanged', gmapStruct)
      // handle when user moves the map
      // we "lock" map position by dismissing geo-location updates
      this.updateReportedCenter(gmapCoordsToGmapStruct(gmapCoords))
      // this.removeSelectedArtwork()
    },

    _handleMapClicked() {
      this.removeSelectedArtwork()
    },

    //  { event, marker, } = e
    _handleMarkerClicked(e) {
      const getArtworkRecFunc = this.$store.getters['app/getArtworkById']
      const { marker, } = e
      const { id, } = marker
      this.setSelectedArtwork(getArtworkRecFunc(id))
    },
  },

  mounted() {
    this.updateReportedCenterWithSync(this.currentLocation)
  },

  watch: {

    $route(to, from) {
      // Call resizePreserveCenter() on all maps
      Vue.$gmapDefaultResizeBus.$emit('resize')
    },

    currentLocation(newLoc, oldLoc) {
      // this will set map on app first load
      if (DEBUG) {
        const { lat, lng, } = newLoc
        const ts = `${Date.now()}`.slice(-5)
        this.addDebugStr(`w: [${lat} ::: ${lng}]  ${ts}`)
      }
      if (this.mapCenterFollowsLocation) {
        this.updateReportedCenterWithPan(newLoc)
      }
    },

  },
}
</script>

<style lang="scss">
#artwork-map-component {

  .vue-map-container {
    width: 100vw;
    height: calc(100vh - 112px);
  }

  .button-map {
    position: absolute;
    top: 15%;
    right: 10px;
    height: 36px;
    width: 36px;
    background-color: white;
  }

  .debug-pane {
    position: absolute;
    bottom: 5%;
    background-color: lightgreen;
    width: 100%;
    max-height: 30vw;
    overflow: hidden;
  }
}
</style>
