<template>
  <div id="login-view">
    <v-container fluid class="blue-grey lighten-4" fill-height>
      <v-layout column fill-height>

        <div class="display-1 font-weight-bold mx-2 my-4">Sign In</div>

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
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            :rules="passwordRules"
            required
            :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'"
            @click:append="toggleShowPassword"
            outline
          />
          <v-alert
            :value="showLoginError"
            icon="fa-warning"
            color="error"
            outline
          >{{ loginErrorMsg }}</v-alert>
          <v-btn
            :disabled="!valid"
            color="secondary"
            @click="doLogin"
            block
          >
            Sign In
          </v-btn>
        </v-form>

        <div class="mt-3">
          To create an account, go to the <router-link :to="{ name: Routes.SIGNUP }">Sign&nbsp;Up</router-link> page.
        </div>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
// Utils
import { Routes } from '@/app-constants'
import Dev from '@/dev-config'

export default {

  data() {
    return {
      valid: false,
      email: '',
      password: '',
      Routes,

      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'Email must be valid'
      ],

      passwordRules: [
        v => !!v || 'Password is required'
      ],

      loginErrorMsg: '',

      showPassword: false,
    }
  },

  computed: {

    showLoginError() {
      return this.loginErrorMsg !== ''
    },

  },

  methods: {

    doLogin() {
      if (this.$refs.form.validate() === false) {
        console.log('form not valid')
        return
      }
      const { email, password, } = this
      const payload = { email, password, }
      this.$store.dispatch('loginRequest', payload)
        .then(() => {
          this.$router.push({ name: Routes.APPMAIN, })
        })
        .catch(error => {
          const { code, message, } = error
          switch (code) {
            case 'auth/user-not-found':
              this.loginErrorMsg = message
              this.password = ''
              break
            default:
              alert(`${code} : ${message}`)
              break
          }
        })
    },

    toggleShowPassword() {
      this.showPassword = !this.showPassword
    },

  },

  mounted() {
    if (Dev.doAutoLogin) {
      this.email = Dev.email
      this.password = Dev.password
      this.doLogin()
    }
  },

}
</script>

<style lang="scss" scoped>
#login-view {
  height: 100vh;
  width: 100vw;
}
</style>
