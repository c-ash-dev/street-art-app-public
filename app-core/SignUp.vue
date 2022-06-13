<template>
  <div id="signup-view">
    <v-container fluid class="blue-grey lighten-4" fill-height>
      <v-layout column fill-height>

        <div class="display-1 font-weight-bold mx-2 my-4">Sign Up</div>

        <v-form ref="form" v-model="valid">
          <v-text-field
            label="Email"
            type="email"
            v-model="email"
            :rules="emailRules"
            required
            validate-on-blur
            outline
          />
          <v-text-field
            label="Password"
            v-model="password"
            :rules="passwordRules"
            required
            validate-on-blur
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'"
            @click:append="toggleShowPassword"
            outline
          />
          <v-text-field
            label="Verify Password"
            v-model="passwordVerify"
            :rules="passwordVerifyRules"
            required
            validate-on-blur
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'"
            @click:append="toggleShowPassword"
            outline
          />
          <v-btn
            :disabled="!valid"
            color="secondary"
            @click="doSignUp"
            block
          >
            Sign Up
          </v-btn>
        </v-form>

        <div class="mt-3">
          If you already have an account, go to the
          <router-link :to="{ name: Routes.LOGIN }">Sign&nbsp;In</router-link> page.
        </div>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
// Utils
import { Routes } from '@/app-constants'

export default {

  data() {
    return {
      valid: false,
      email: '',
      password: '',
      passwordVerify: '',
      Routes,

      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'Email must be valid'
      ],

      passwordRules: [
        v => !!v || 'Password is required'
      ],

      passwordVerifyRules: [
        v => !!v || 'Password is required',
        () => this.password === this.passwordVerify || 'Passwords are not the same'
      ],

      showPassword: false,

    }
  },

  methods: {

    doSignUp() {
      if (this.$refs.form.validate() === false) {
        console.log('form not valid')
        return
      }
      const { email, password, } = this
      const payload = { email, password, }
      this.$store.dispatch('signupRequest', payload)
        .then(() => {
          this.$router.push({ name: Routes.APPMAIN, })
        })
        .catch(error => {
          const { code, message, } = error
          alert(`${code} : ${message}`)
        })
    },

    toggleShowPassword() {
      this.showPassword = !this.showPassword
    },

  },

}
</script>

<style lang="scss" scoped>
#signup-view {
  width: 100vw;
  height: 100vh;
}
</style>
