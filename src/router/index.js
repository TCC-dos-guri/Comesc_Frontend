import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Tests from '@/views/components-tests/Tests.vue'
import EmployeeHomeView from '@/views/employee-system/EmployeeHomeView.vue'
import BatchView from '@/views/BatchView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'login',
      component: LoginView,
    },
    {

      path: '/tests',
      name: 'tests',
      component: Tests,
    },
    {
      path: '/batch',
      name: 'batch',
      component: BatchView
    },
    {
      path: '/employee',
      name: 'employee-home',
      component: EmployeeHomeView
    }
  ],
})

export default router
