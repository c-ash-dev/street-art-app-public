<template>
  <div id="splash-view" class="blue-grey lighten-4">
  <v-container fluid class="capture-method blue-grey lighten-4">
    <v-layout column fill-height align-center justify-center>
    <div class="font-weight-bold display-4 mb-5 text-xs-center">Street Art</div>
    <div class="font-weight-regular font-italic title ">Find Art In Your 'Hood</div>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import {
  Routes,
  SplashScreenDelay
} from '../app-constants'

export default {

  data() {
    return {
      splashStart: 0,
    }
  },

  computed: {

    hasCheckedAuth() {
      return this.$store.getters['hasCheckedAuth']
    },

  },

  methods: {

    showNextPage() {
      const now = Date.now()
      const currDelay = SplashScreenDelay - (now - this.splashStart)
      const delayTime = (currDelay > 0) ? currDelay : 0
      setTimeout(() => {
        this.$router.push({ name: Routes.APPMAIN, })
      }, delayTime)
    },

  },

  mounted() {
    this.splashStart = Date.now()
  },

  watch: {

    hasCheckedAuth(newVal, oldVal) {
      if (newVal === true) {
        this.showNextPage()
      }
    },

  },

}
</script>

<style scoped>
  #splash-view {
    width: 100vw;
    height: 100vh;
  }
</style>
