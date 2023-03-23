import { createRouter, createWebHashHistory  } from 'vue-router'
import Home from '@/views/home/home.vue'
import Login from '@/views/login/login.vue'
import List from '@/views/list/list.vue'
import Help from '@/views/help/help.vue'
import Favorite from '@/views/favorite/favorite.vue'
import Errorpage from '@/views/errorpage/errorpage.vue'
import { getAuth } from 'firebase/auth'

const router = createRouter({
  history: createWebHashHistory (import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/list/:id',
      name: 'list',
      component: List,
      meta: { requiresAuth: true }
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: Favorite,
      meta: { requiresAuth: true }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)',
      name: 'error',
      component : Errorpage
    }
  ]
})

let isAuthenticated = false

async function checkAuth() {
  const auth = getAuth()
  await new Promise(resolve => auth.onAuthStateChanged(resolve))
  isAuthenticated = auth.currentUser !== null
  
}

router.beforeEach(async (to, from, next) => {
  await checkAuth()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // If not logged in
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // If logged in
      next()
    }
  } else {
    // Accessible without logging in
    next()
  }
})

export default router