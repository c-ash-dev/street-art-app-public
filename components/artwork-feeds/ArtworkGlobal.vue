<template>
  <div id="global-artwork">
    <div class="artwork-feeds">
      <template v-if="globalArtworkRecords.length === 0">
        <div class="no-records mx-5 font-weight-regular display-2 grey--text text--darken-3 text-xs-center">Good things come to those who wait!</div>
      </template>
      <template v-else>
        <div class="mt-1"><!-- spacer --></div>
        <artwork-list-tile
          v-for="record in globalArtworkRecords"
          :key="record.uid"
          :record="record"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ArtworkListTile from './ArtworkListTile'

export default {

  name: 'ArtworkGlobal',

  components: {
    ArtworkListTile,
  },

  computed: {

    globalArtworkRecords() {
      return this.$store.getters['app/latestArtwork']
    },

  },

}
</script>

<style lang="scss" scoped>
.no-records {
  margin-top: 25vh;
}
</style>
