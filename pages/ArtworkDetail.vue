
<template>
  <v-content class="artwork-detail-tile mt-2 pt-0 mb-0">
    <v-toolbar app fixed>
      <v-btn flat icon :ripple="false" @click="closeArtworkDetail">
        <v-icon size="20px" class="pr-2"> fas fa-times </v-icon>
      </v-btn>
      <v-toolbar-title>Artwork Detail</v-toolbar-title>
    </v-toolbar>
    <v-layout row align-baseline py-2>
      <v-flex xs6>
        <div class="mb-2 ml-3 font-weight-regular subheading grey--text text--darken-4"> {{ artworkLocation }} </div>
      </v-flex>
      <v-flex xs6 text-xs-right>
        <div class="mb-2 mr-3 font-weight-regular subheading grey--text text--darken-4"> {{ visits }} visits</div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <img class="ma-0" sizes="35vw"
          :alt="imageAltText"
          :src="firstImageSrc"
          :srcset="srcSetStr"
        />
      </v-flex>
    </v-layout>
    <v-layout row justify-space-between align-center mx-2 mt-2 mb-5>
      <div>
        <span class="title font-weight-bold grey--text text--darken-3 text-capitalize pl-2">&ldquo;{{ artworkCaption }}&rdquo;</span>
        <template v-if="artistName">
          <br />
          <span class="mx-1 grey--text subheading font-italic ">by</span>
          <span class="subheading font-weight-regular grey--text text--darken-3"
          >{{ artistName }}</span>
        </template>
      </div>
      <v-spacer />
      <v-btn flat icon mb-0 :ripple="false" align-content-start class="btn--menu-plain" @click="toggleLikeRecord">
        <v-icon size="20px" class="pr-2"> {{ likeIcon }} </v-icon>
      </v-btn>
      <v-btn flat icon mb-0 :ripple="false" class="btn--menu-plain" @click="toggleBookmarkRecord">
        <v-icon size="20px" class="pr-2"> {{ bookmarkIcon }} </v-icon>
      </v-btn>
    </v-layout>
    <v-layout row>
      <div>
        <artwork-detail-map :artworkRec="artworkRec"></artwork-detail-map>
      </div>
    </v-layout>
    <v-layout row justify-space-around>
      <v-btn style="width: 90vw" color="primary" :disabled="buttonIsDisabled" @click="checkIn">
        Check In
      </v-btn>
    </v-layout>
    <v-spacer />
  </v-content>
</template>

<script>
import ArtworkDetailMap from '@/components/artwork-map/ArtworkDetailMap'
// import { artworkCheckIn } from '@/utils/artwork-utils'

export default {

  components: {
    ArtworkDetailMap,
  },

  props: ['artworkRec'],

  computed: {

    artistId() {
      const { artworkRec, } = this
      return artworkRec.artistId
    },

    artistName() {
      const { artistId, } = this
      const getArtistNameById = this.$store.getters['app/getArtistNameById']
      const artistRec = getArtistNameById(artistId)
      return (artistRec) ? artistRec.name : null
    },

    artworkCaption() {
      const { caption, } = this.artworkRec
      return caption
    },

    artworkDetailId() {
      const { id, } = this.artworkRec
      return id
    },

    artworkLocation() {
      const { location, } = this.artworkRec
      return location
    },

    bookmarkIcon() {
      return (this.hasBookmark) ? 'fas fa-bookmark' : 'far fa-bookmark'
    },

    buttonIsDisabled() {
      const artworkId = this.artworkDetailId
      const userHasTodayCheckin = this.$store.getters['app/userHasTodayCheckinByArtworkId']
      return userHasTodayCheckin(artworkId)
    },

    // buttonIsDisabled() {
    //   const artworkId = this.artworkDetailId
    //   const userHasTodayCheckin = artworkCheckIn
    //   return userHasTodayCheckin(artworkId)
    // },

    likeIcon() {
      return (this.hasLike) ? 'fas fa-heart' : 'far fa-heart'
    },

    firstImageHash() {
      const { images, } = this.artworkRec
      return images[0]
    },

    firstImageSrc() {
      const urlHash = this.firstImageHash
      return urlHash['200'] || ''
    },

    hasBookmark() {
      const bookmarkFunc = this.$store.getters['app/getBookmarksByArtworkId']
      const artworkId = this.artworkDetailId

      return (bookmarkFunc(artworkId) !== null)
    },

    hasLike() {
      const likeFunc = this.$store.getters['app/getLikesByArtworkId']
      const artworkId = this.artworkDetailId

      return (likeFunc(artworkId) !== null)
    },

    imageAltText() {
      return this.artworkCaption
    },

    srcSetStr() {
      const urlHash = this.firstImageHash
      return Object.entries(urlHash).map(kvPair => {
        const [ size, url ] = kvPair
        return `${url} ${size}w`
      }).join(', ')
    },

    visits() {
      const { artworkRec, } = this
      return artworkRec.visitCount
    },

    visitsRec() {
      const visitsRecord = this.$store.getters['app/getVisitsRec']
      return visitsRecord
    },
  },

  methods: {

    checkIn() {
      const artworkId = this.artworkDetailId
      this.$store.dispatch('app/visitCheckIn', { artworkId, })
    },

    closeArtworkDetail() {
      this.$store.commit('app/setArtworkDetailId', null)
    },

    toggleBookmarkRecord() {
      const id = this.artworkDetailId
      const { hasBookmark, } = this
      this.$store.dispatch('app/toggleBookmarkByArtworkId', { artworkId: id, hasBookmark, })
    },

    toggleLikeRecord() {
      const id = this.artworkDetailId
      const { hasLike, } = this
      this.$store.dispatch('app/toggleLikeByArtworkId', { artworkId: id, hasLike, })
    },
  },

}

</script>

<style lang="scss" scoped>

main.v-content.artwork-detail-tile {
  background-color: #fafafa;
  padding-top: 56px !important;
  height: 100%;

  img {
    height: 100vw;
    object-fit: cover;
  }

  img[class] {
    width: 100%;
  }
}
</style>
