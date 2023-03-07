import { createRouter, createWebHashHistory  } from 'vue-router'
import Home from '@/views/home/home.vue'
import Login from '@/views/login/login.vue'
import List from '@/views/list/list.vue'
import Help from '@/views/help/help.vue'
import Errorpage from '@/views/errorpage/errorpage.vue'

const router = createRouter({
  history: createWebHashHistory (import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/list/:id',
      name: 'list',
      component: List
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '/:pathMatch(.*)',
      name: 'error',
      component : Errorpage
    }
  ]
})

export default router