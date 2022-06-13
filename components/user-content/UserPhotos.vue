<template>
  <div id="user-photos is-flex-wrap">
    <template v-if="hasUserPhotos">
      <div
        v-for="record in userPhotoRecords"
        :key="record.id">
        <div>
          <user-photo-tile
            :record="record"/>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="no-records">Zoinks, you have no photos!</div>
      <div class="subheader">Submit a photo or two using the big red plus button!</div>
    </template>
  </div>
</template>

<script>
import UserPhotoTile from './UserPhotoTile'

export default {

  components: {
    UserPhotoTile,
  },

  computed: {

    hasUserPhotos() {
      return (this.userPhotoRecords.length > 0)
    },

    userPhotoRecords() {
      return this.$store.getters['app/userPhotos']
    },

  },
}
</script>

<style lang="scss" scoped>
#user-photos {
  min-height: calc(100vh - 112px);
  background-color: #fff;
  line-height: 1;

  .no-records {
    font-size: 34px;
    color: #424242;
    text-align: center;
    font-weight: 500;
    padding-top: 20vh;
    margin: 0 48px 0 48px;
    line-height: 40px;
  }

   .subheader {
    font-weight: 400;
    margin: 48px 48px 0 48px;
    font-size: 16px;
  }
}
</style>
