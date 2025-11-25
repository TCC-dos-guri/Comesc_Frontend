import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Tests from '@/views/components-tests/Tests.vue'
import EmployeeHomeView from '@/views/employee-system/EmployeeHomeView.vue'
import BatchView from '@/views/BatchView.vue'
import RegisterBatchView from '@/views/RegisterBatchView.vue'
import ReviewBatch from '@/views/employee-system/batch-review/ReviewBatch.vue'
import ColorsRegisterView from '@/views/employee-system/registrations/ColorsRegisterView.vue'
import SuppliersRegisterView from '@/views/employee-system/registrations/SuppliersRegisterView.vue'
import StateRegisterView from '@/views/employee-system/registrations/StateRegisterView.vue'
import AddressRegisterView from '@/views/employee-system/registrations/AddressRegisterView.vue'
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
      path: '/batch/:id',
      name: 'batch',
      component: BatchView,
    },
    {
      path: '/batch/register',
      name: 'register_batch',
      component: RegisterBatchView
    },
    {
      path: '/employee',
      name: 'employee-home',
      component: EmployeeHomeView
    },
    {
      path: '/batch/review_batch/:id',
      name: 'review-batch',
      component: ReviewBatch
    },
    {
      path: '/register',
      name: 'register',
      children: [
        {
          path: 'colors',
          name: 'register-colors',
          component: ColorsRegisterView
        },
            {
          path: 'suppliers',
          name: 'register-suppliers',
          component: SuppliersRegisterView
        },

            {
          path: 'state',
          name: 'register-state',
          component: StateRegisterView
        },
         {
          path: 'address',
          name: 'register-address',
          component: AddressRegisterView
        }
      ]
    }
  ],
})

export default router
