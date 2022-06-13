<template>
  <section>
    <div class="container bookmark-tile" :data-id="bookmark.id" @click="openArtworkDetail">
      <div class="columns is-mobile">
        <div class="column is-4 photo">
          <img
            :src="firstImageSrc"/>
        </div>
        <div class="column is-8 art-info">
            <div
              v-if="artworkInfo !== ''"
              v-html="artworkInfo"/>
            <div>
              {{ artworkRec.location }}
            </div>
            <div>
              Added {{ bookmark.created | formatDate }}
            </div>
            <b-button class="bookmark-remove" @click.stop="removeBookmark">
              <b-icon pack="fas" icon="trash" size="20px"/>
            </b-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {

  props: ['bookmark'],

  computed: {

    artworkInfo() {
      const { artworkCaption, artistName, } = this
      let str = ''
      if (artworkCaption && artistName) {
        str = `&ldquo;${artworkCaption}&rdquo; by ${artistName}`
      } else if (artworkCaption) {
        str = `&ldquo;${artworkCaption}&rdquo;`
      } else if (artistName) {
        str = `<i>untitled</i> by ${artistName}`
      }
      return str
    },

    artworkCaption() {
      const { artworkRec, } = this
      let result = ''
      if (artworkRec) {
        result = artworkRec.caption
      }
      return (result === '') ? null : result
    },

    artistName() {
      const { artistId, } = this.artworkRec
      const getArtistNameById = this.$store.getters['app/getArtistNameById']
      const artistName = getArtistNameById(artistId)
      return (artistName) ? artistName.name : null
    },

    artworkRec() {
      const { artworkId, } = this.bookmark
      const getArtworkById = this.$store.getters['app/getArtworkById']
      const artworkRec = getArtworkById(artworkId)
      if (!artworkRec) {
        console.warn(`BookmarksListTile - artwork not found ${artworkId}`)
      }
      return artworkRec
    },

    firstImageHash() {
      const { artworkRec, } = this
      let result = {}
      if (artworkRec) {
        const { images, } = artworkRec
        result = images[0]
      }
      return result
    },

    firstImageSrc() {
      const urlHash = this.firstImageHash
      return urlHash['200'] || ''
    },

  },

  methods: {

    removeBookmark() {
      const { artworkId, } = this.bookmark
      this.$store.dispatch('app/removeBookmarkByArtworkId', { artworkId, })
      console.log('remove bookmark')
    },

    openArtworkDetail() {
      const { artworkId, } = this.bookmark
      this.$store.commit('app/setArtworkDetailId', artworkId)
    },
  },
}

</script>

<style lang="scss" scoped>
.bookmark-tile {

  position: relative;
  border-bottom: 2px solid #616161;

  .photo {

    img {
      height: 30vw;
      width: 30vw;
      object-fit: cover;
    }
  }

  .art-info {
    padding: 5px 0 0 0;
    line-height: 1.8;
  }

  .bookmark-remove {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border: none;
  }

}
</style>
