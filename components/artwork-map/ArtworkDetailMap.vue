<template>
  <div id="artwork-detail-map-component">
    <gmap-map
      ref="gmap"
      :center="mapCenter"
      :zoom="defaultMapZoom"
      @idle="syncCenters"
      zoomControl: false
      gestureHandling: none
    >
      <gmap-marker
        :key="marker.id"
        :position="marker.position"
      />
    </gmap-map>
  </div>
</template>

<script>
// Libs
import Vue from 'vue'

// Utils
import { geoRecToGmapStruct } from '@/utils/geo-utils'

export default {

  data() {
    return {

      mapCenter: {
        lat: 0,
        lng: 0,
      },

      defaultMapZoom: 14,

      lastReportedMapCenter: {
        lat: 0,
        lng: 0,
      },
    }
  },

  props: ['artworkRec'],

  computed: {

    artworkCoordinates() {
      const { artworkRec, } = this
      let result = ''
      if (artworkRec) {
        result = artworkRec.coordinates
      }
      return (result === '') ? null : result
    },

    artworkLocation() {
      const { latitude, longitude, } = this.artworkCoordinates
      return geoRecToGmapStruct({ latitude, longitude, })
    },

    marker() {
      const artworkRec = this.artworkRec
      const { coordinates, id, } = artworkRec
      const markerRec = {
        position: geoRecToGmapStruct(coordinates),
        id,
      }
      return markerRec
    },
  },

  methods: {

    syncCenters() {
      this.mapCenter = this.lastReportedMapCenter
    },

    updateReportedCenter(mapStruct) {
      this.lastReportedMapCenter = mapStruct
    },

    updateReportedCenterWithSync(mapStruct) {
      this.updateReportedCenter(mapStruct)
      this.syncCenters()
    },
  },

  mounted() {
    this.updateReportedCenterWithSync(this.artworkLocation)
  },

  watch: {

    $route(to, from) {
      // Call resizePreserveCenter() on all maps
      Vue.$gmapDefaultResizeBus.$emit('resize')
    },

    artworkLocation(newVal, oldVal) {
      this.updateReportedCenterWithSync(newVal)
    },

  },
}
</script>

<style lang="scss">
#artwork-detail-map-component {

  position: relative;

  .vue-map-container {
    width: 100vw;
    height: 45vw;
  }

}
</style>
