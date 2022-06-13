<template>
    <div class="artwork-detail-card elevation-5">
    <v-layout justify-space-between align-content-center align-center>
      <div class="thumbnail" :style="thumbnailStyles" />
      <v-layout column class="art-info">
        <div class=" grey--text text--darken-3">
          <span class="title"
            v-if="artworkCaption"
          >
            &ldquo;{{ artworkCaption }}&rdquo;
          </span>
          <span class="subheading font-italic" v-if="artistName">by {{ artistName }}</span>
        </div>
        <div class="subheading grey--text text--darken-3">{{ visits }} visits</div>
        <div class="body-2 grey--text lighten-2">1.5 miles</div>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
// Utils
import { firstImageSrc } from '@/store/models'

export default {

  props: ['artworkRecord'],

  computed: {

    artworkCaption() {
      const { caption, } = this.artworkRecord
      return (caption === '') ? null : caption
    },

    artistName() {
      const { artistId, } = this.artworkRecord
      const getArtistNameById = this.$store.getters['app/getArtistNameById']
      const artistName = getArtistNameById(artistId)
      return (artistName) ? artistName.name : null
    },

    thumbnailStyles() {
      const imgSrc = firstImageSrc(this.artworkRecord)
      return {
        backgroundImage: `url(${imgSrc})`,
      }
    },

    visits() {
      return this.artworkRecord.visitCount
    },

  },

}
</script>

<style lang="scss" scoped>
.artwork-detail-card {
  position: absolute;
  bottom: 5vh;
  width: 80vw;
  height: 26vw;
  background-color: white;
  border: 1px solid #999;
  border-radius: 4px;

  .thumbnail {
    height: 22vw;
    width: 28vw;
    margin: 2vw;
    background-size: cover;
  }

  .art-info {
    height: 22vw;
    width: 100%;
    margin-right: 2vw;
  }
}
</style>
