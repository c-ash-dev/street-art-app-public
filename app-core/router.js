/*
*/

// Libs
import { store } from '../store'
import VueRouter from 'vue-router'

// Utils
import { Routes } from '../app-constants'

// Core Components
import AppMain from './AppMain'
import Login from './Login'
import Splash from './Splash'
import SignUp from './SignUp'

export const routes = [
  {
    path: '/',
    component: Splash,
    name: Routes.SPLASH,
  },
  {
    path: '/app-main',
    name: Routes.APPMAIN,
    component: AppMain,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: Routes.LOGIN,
    component: Login,
  },
  {
    path: '/sign-up',
    name: Routes.SIGNUP,
    component: SignUp,
  }
]

export const router = new VueRouter({
  routes,
  mode: 'hash',
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.getters['isAuthenticated']
  const hasCheckedAuth = store.getters['hasCheckedAuth']

  if (hasCheckedAuth === false && to.name !== Routes.SPLASH) {
    next({ name: Routes.SPLASH, })
  } else if (requiresAuth && !isAuthenticated) {
    next({ name: Routes.LOGIN, })
  } else {
    next()
  }
})
