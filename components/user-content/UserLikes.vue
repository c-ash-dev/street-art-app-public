<template>
  <div id="user-likes">
    <template v-if="hasLikes">
      <user-likes-tile v-for="like in userLikes"
      :key="like.id"
      :like="like"
      />
    </template>
    <template v-else>
      <div class="no-records">Oh my, you have no likes!</div>
      <div class="subheader">Create a like by tapping the heart icon <b-icon pack="far" icon="heart" size="20px"/> on a favorite artwork listing.</div>
    </template>
  </div>
</template>

<script>
import UserLikesTile from './UserLikesTile'

export default {

  components: {
    UserLikesTile,
  },

  computed: {

    hasLikes() {
      return (this.userLikes.length > 0)
    },

    userLikes() {
      return this.$store.getters['app/userLikes']
    },

  },
}
</script>

<style lang="scss" scoped>
#user-likes {
  min-height: calc(100vh - 112px);
  background-color: #fff;

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
