<template>
  <v-app>
    <router-view />
    <v-dialog
      v-model="shouldShowSpinner"

      max-width="200"
      :scrollable="false"
      fullscreen
      persistent
    >
    <div class="popover-dialog" />
      <v-layout column justify-center fill-height text-xs-center align-center>
        <v-progress-circular
          indeterminate
          :size="70"
          color="white"
          class="mb-0"
        />
      </v-layout>
    </v-dialog>
    <v-dialog
      v-model="shouldShowProgress"

      max-width="200"
      :scrollable="false"
      fullscreen
      persistent
    >
    <div class="popover-dialog" />
      <v-layout column justify-center fill-height text-xs-center align-center>
      <v-card
        color="primary"
        dark
        width="70%"
      >
        <v-card-text>
          {{ indeterminateProgressContent }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
      </v-layout>
    </v-dialog>
  </v-app>
</template>

<script>
export default {

  computed: {

    shouldShowSpinner() {
      return this.$store.getters['shouldShowSpinner']
    },

    shouldShowProgress() {
      return (this.indeterminateProgressContent !== '')
    },

    indeterminateProgressContent() {
      return this.$store.getters['indeterminateProgressContent']
    },

  },

}
</script>

<style lang="scss">

// global styles

.popover-dialog {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  opacity: .5;
  height: 100%;
  width: 100%
}

// https://github.com/vuetifyjs/vuetify/issues/3026
.btn--plain {
  height: auto !important;
  width: auto !important;
  margin: 0 !important;
  padding: 8px !important;
  min-width: 0;
  > .btn__content {
    padding: 0;
    opacity: 0.75;
    &:before {
      background-color: transparent !important;
      transition: none !important;
    }
  }

  &--active,
  &:focus,
  &:hover {
    &:before {
      background-color: transparent !important;
      transition: none !important;
    }

    > .btn__content {
      opacity: 1;
    }
  }
}

// get rid of background color transition
// transition none seems mess to up the icons on iOS
.btn--menu-plain {
  padding: 8px;
  > .btn__content {
    padding: 0;
    opacity: 0.75;
    &:before {
      background-color: transparent !important;
      // transition: none !important;
    }
  }

  &--active,
  &:focus,
  &:hover {
    &:before {
      background-color: transparent !important;
      // transition: none !important;
    }

    > .btn__content {
      opacity: 1;
    }
  }
}
</style>
