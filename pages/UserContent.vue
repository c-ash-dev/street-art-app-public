<template>
  <section>
    <b-tabs type="is-toggle" expanded
      v-model="currentTabIdx"
    >
      <b-tab-item
        v-for="tab in tabs"
        :key="tab.key"
      >
        <template slot="header">
          <span> {{ tab.text }} </span>
        </template>
      </b-tab-item>
    </b-tabs>
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </section>
</template>

<script>
import UserBookmarks from '@/components/user-content/UserBookmarks'
import UserLikes from '@/components/user-content/UserLikes'
import UserPhotos from '@/components/user-content/UserPhotos'

export default {

  name: 'UserContent',

  data() {
    return {
      currentTabIdx: 0,
      tabs: [
        {
          component: UserPhotos,
          key: 'user-photos',
          text: 'My Photos',
        },
        {
          component: UserLikes,
          key: 'user-likes',
          text: 'Likes',
        },
        {
          component: UserBookmarks,
          key: 'user-bookmarks',
          text: 'Bookmarks',
        }
      ],
    }
  },

  computed: {

    currentTabComponent() {
      const idx = this.currentTabIdx
      return this.tabs[idx].component
    },

  },

}
</script>

<style>

  .b-tabs:not(:last-child) {
    margin: 15px 0 0 0;
  }

  ul {
    padding: 0;
  }

</style>
