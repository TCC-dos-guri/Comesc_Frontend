import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

import Tests from '@/views/components-tests/Tests.vue'

import TypeUserView from '@/views/TypeUserView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {

      path: '/tests',
      name: 'tests',
      component: Tests,
    },
    {
      path: '/type',
      name: 'type',
      component: TypeUserView
    }
  ],
})

export default router
