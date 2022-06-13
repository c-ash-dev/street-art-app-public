<template>
  <v-container fluid :fill-height="true" class="submit-image">
    <v-layout column :fill-height="true" align-center>
      <div class="image" :style="imageStyles" />
      <div>Artist: SMiLE</div>
      <div>Caption: "Space Kitty"</div>
      <v-spacer />
      <v-layout row space-evenly>
        <v-btn @click="_handleCancelClick">Cancel</v-btn>
        <v-btn  @click="_handleSubmitClick">Submit</v-btn>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
export default {

  props: [ 'imageUri' ],

  computed: {

    imageStyles() {
      return {
        backgroundImage: `url(${this.imageUri}`,
      }
    },

  },

  methods: {

    _handleSubmitClick() {
      this.$emit('submit')
    },

    _handleCancelClick() {
      this.$emit('cancel')
    },

  },

}
</script>

<style lang="scss">
.submit-image {
  width: 100%;
  height: calc(100vh - 112px);
  background-color: grey;

  div.image {
    width: 100%;
    height: 100vw;
    background-color: black;
    background-position: center center;
    background-size: cover;
  }
}
</style>
