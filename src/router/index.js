import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Tests from '@/views/components-tests/Tests.vue'
import TypeUserView from '@/views/TypeUserView.vue'
import EmployeeHomeView from '@/views/employee-system/EmployeeHomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth/:type/',
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
    },
    {
      path: '/employee',
      name: 'employee-home',
      component: EmployeeHomeView
    }
  ],
})

export default router
