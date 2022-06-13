<template>
  <section>
    <div class="container likes-tile" :data-id="like.id" @click="openArtworkDetail">
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
            Added {{ like.created | formatDate }}
          </div>
          <b-button class="like-remove" @click.stop="removeLike">
            <b-icon pack="fas" icon="trash" size="20px"/>
          </b-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {

  props: ['like'],

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
      const { caption, } = this.artworkRec
      return (caption === '') ? null : caption
    },

    artistName() {
      const { artistId, } = this.artworkRec
      const getArtistNameById = this.$store.getters['app/getArtistNameById']
      const artistName = getArtistNameById(artistId)
      return (artistName) ? artistName.name : null
    },

    artworkRec() {
      const { artworkId, } = this.like
      const getArtworkById = this.$store.getters['app/getArtworkById']
      const artworkRec = getArtworkById(artworkId)
      return artworkRec
    },

    firstImageHash() {
      const images = this.artworkRec.images
      return images[0] || {}
    },

    firstImageSrc() {
      const urlHash = this.firstImageHash
      return urlHash['200'] || ''
    },
  },

  methods: {
    removeLike() {
      const { artworkId, } = this.like
      this.$store.dispatch('app/removeLikeByArtworkId', { artworkId, })
    },

    openArtworkDetail() {
      const { artworkId, } = this.like
      this.$store.commit('app/setArtworkDetailId', artworkId)
    },
  },

}
</script>

<style lang="scss" scoped>
.likes-tile {

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

  .like-remove {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border: none;
  }

}

</style>
