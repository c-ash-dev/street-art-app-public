<template>
  <div class="artwork-tile mt-2 pt-0 mb-0" :data-id="record.id" @click="openArtworkDetail">

    <v-layout row justify-space-between align-baseline py-2>
      <div class="mb-2 ml-3 font-weight-regular subheading grey--text text--darken-4">{{ record.location }}</div>
      <div class="mb-2 mr-3 font-weight-regular subheading grey--text text--darken-4">{{ visits }} visits</div>
    </v-layout>

    <!-- constrain image loading : 50vw, 25vw -->
    <img class="ma-0" sizes="35vw"
      :alt="imageAltText"
      :src="firstImageSrc"
      :srcset="srcSetStr"
    />

    <v-layout row justify-space-between align-center mx-2 mt-2 mb-5>
      <div>
        <span class="title font-weight-bold grey--text text--darken-3 text-capitalize">&ldquo;{{ caption }}&rdquo;</span>
        <template v-if="artistName">
          <br />
          <span class="mx-1 grey--text subheading font-italic ">by</span>
          <span class="subheading font-weight-regular grey--text text--darken-3"
          >{{ artistName }}</span>
        </template>
      </div>
      <v-spacer />
      <v-btn flat icon mb-0 :ripple="false" align-content-start class="btn--menu-plain" @click.stop="toggleLikeRecord">
        <v-icon size="20px" class="pr-2"> {{ likeIcon }}</v-icon>
      </v-btn>
      <v-btn flat icon mb-0 :ripple="false" class="btn--menu-plain"
        @click.stop="toggleBookmarkRecord">
        <v-icon size="20px">{{ bookmarkIcon }}</v-icon>
      </v-btn>
    </v-layout>

  </div>
</template>

<script>
export default {

  /*
    record is Artwork Record
  */
  props: ['record'],

  computed: {

    artistName() {
      const { artistId, } = this.record
      const getArtistNameById = this.$store.getters['app/getArtistNameById']
      const artistRec = getArtistNameById(artistId)
      return (artistRec) ? artistRec.name : null
    },

    bookmarkIcon() {
      return (this.hasBookmark) ? 'fas fa-bookmark' : 'far fa-bookmark'
    },

    likeIcon() {
      return (this.hasLike) ? 'fas fa-heart' : 'far fa-heart'
    },

    caption() {
      const { caption, } = this.record
      return caption || ''
    },

    firstImageHash() {
      const images = this.record.images // array of hashes
      return images[0] || {}
    },

    /*
      return smallest image as default
    */
    firstImageSrc() {
      const urlHash = this.firstImageHash // hash
      return urlHash['200'] || ''
    },

    hasBookmark() {
      const bookmarkFunc = this.$store.getters['app/getBookmarksByArtworkId']
      const { id, } = this.record

      return (bookmarkFunc(id) !== null)
    },

    hasLike() {
      const likeFunc = this.$store.getters['app/getLikesByArtworkId']
      const { id, } = this.record

      return (likeFunc(id) !== null)
      // return false
    },

    imageAltText() {
      return this.caption
    },

    /*
      create srcset string eg "one.jpg 200w, two.jpg 400w, three.jpg 800w"
    */
    srcSetStr() {
      const urlHash = this.firstImageHash
      return Object.entries(urlHash).map(kvPair => {
        const [ size, url ] = kvPair
        return `${url} ${size}w`
      }).join(', ')
    },

    visits() {
      return this.record.visitCount
    },

  },

  methods: {

    addCommentToImage(imageId) {
      console.log('TODO: addCommentToImage', imageId)
    },

    openArtworkDetail() {
      const { id: artworkId, } = this.record
      this.$store.commit('app/setArtworkDetailId', artworkId)
    },

    shareArtworkWithFriends(imageId) {
      console.log('TODO: shareImageWithFriends', imageId)
    },

    toggleBookmarkRecord() {
      const { id, } = this.record
      const { hasBookmark, } = this
      this.$store.dispatch('app/toggleBookmarkByArtworkId', { artworkId: id, hasBookmark, })
    },

    toggleLikeRecord() {
      const { id, } = this.record
      const { hasLike, } = this
      this.$store.dispatch('app/toggleLikeByArtworkId', { artworkId: id, hasLike, })
    },

  },

}
</script>

<style lang="scss" scoped>
.artwork-tile {
  border-bottom: 2px solid #616161;

  img {
    height: 100vw;
    object-fit: cover;
  }

  img[class] {
    width: 100%;
  }
}
</style>
