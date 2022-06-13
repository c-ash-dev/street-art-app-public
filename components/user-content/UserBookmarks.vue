<template>
  <div id="user-bookmarks">
    <template v-if="hasBookmarks">
      <bookmarks-list-tile
        v-for="(bookmark, index) in userBookmarks"
        :key="bookmark.id"
        :index="index"
        :bookmark="bookmark"
        @click.native="getIndex(index)"
      />
    </template>
    <template v-else>
      <div class="no-records">Woah, you have no bookmarks!</div>
      <div class="subheader">Create a bookmark by tapping the bookmark icon <b-icon pack="far" icon="bookmark" size="20px"/> on a favorite artwork listing.</div>
    </template>
  </div>
</template>

<script>
import BookmarksListTile from './BookmarksListTile'

export default {

  components: {
    BookmarksListTile,
  },

  computed: {

    hasBookmarks() {
      return (this.userBookmarks.length > 0)
    },

    userBookmarks() {
      return (this.$store.getters['app/userBookmarks'])
    },

  },

  methods: {

    getIndex(index) {
      const i = index
      console.log('index', i)
    },
  },
}
</script>

<style lang="scss" scoped>
#user-bookmarks {
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
