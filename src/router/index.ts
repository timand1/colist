import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/home.vue'
import Login from '@/views/login/login.vue'
import List from '@/views/list/list.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/list',
      name: 'list',
      component: List
    }
  ]
})

export default router