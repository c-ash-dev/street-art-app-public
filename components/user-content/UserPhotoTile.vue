<template>
  <section>
    <div class="user-photo-tile">
      <img alt="" sizes="30vw"
        :src="firstImageSrc"
        :srcset="srcSetStr"/>
      <b-button class="user-photo-remove" @click="removeUserPhoto">
        <b-icon pack="fas" icon="trash" size="20px"/>
      </b-button>
      <div>
        Added {{ record.created | formatDate }}
      </div>
    </div>
  </section>
</template>

<script>
export default {

  name: 'UserPhotoTile',

  props: ['record'],

  computed: {

    urlHash() {
      const { urls, } = this.record
      return urls || {}
    },

    /*
      return smallest image as default
    */
    firstImageSrc() {
      const { urlHash, } = this
      return urlHash['200'] || ''
    },

    /*
      create srcset string eg "one.jpg 200w, two.jpg 400w, three.jpg 800w"
    */
    srcSetStr() {
      const { urlHash, } = this
      return Object.entries(urlHash).map(kvPair => {
        const [ size, url ] = kvPair
        return `${url} ${size}w`
      }).join(', ')
    },

  },

  methods: {

    removeUserPhoto() {
      console.log('user photo removed')
    },
  },

}
</script>

<style lang="scss" scoped>
.user-photo-tile {
  position: relative;
  height: 55vw;
  width: 50vw;

  img {
    height: 45vw;
    width: 100%;
    object-fit: cover;
  }

  .user-photo-remove {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border: none;
    color: white;
    background-color: transparent;
  }
}
</style>
