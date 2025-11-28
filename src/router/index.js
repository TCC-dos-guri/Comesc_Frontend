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
import ColorsEditView from '@/views/employee-system/edition/ColorsEditView.vue'
import SuppliersEditView from '@/views/employee-system/edition/SuppliersEditView.vue'
import StateEditView from '@/views/employee-system/edition/StateEditView.vue'
import AddressEditView from '@/views/employee-system/edition/AddressEditView.vue'
import ColorsListView from '@/views/employee-system/list/ColorsListView.vue'
import SuppliersListView from '@/views/employee-system/list/SuppliersListView.vue'
import StateListView from '@/views/employee-system/list/StateListView.vue'
import AddressListView from '@/views/employee-system/list/AddressListView.vue'
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
          path: 'colors/list',
          name: 'register-colors-list',
          component: ColorsListView
        },
         {
          path: 'colors/:id',
          name: 'register-colors-edit',
          component: ColorsEditView
        },
          {
          path: 'suppliers/:id',
          name: 'register-suppliers-edit',
          component: SuppliersEditView
        },
            {
          path: 'suppliers',
          name: 'register-suppliers',
          component: SuppliersRegisterView
        },
        {
          path: 'suppliers/list',
          name: 'register-suppliers-list',
          component: SuppliersListView
        },

            {
          path: 'state',
          name: 'register-state',
          component: StateRegisterView
        },
           {
          path: 'state/:id',
          name: 'register-state-edit',
          component: StateEditView
        },
            {
          path: 'state/list',
          name: 'register-state-list',
          component: StateListView
        },
         {
          path: 'address',
          name: 'register-address',
          component: AddressRegisterView
        },
         {
          path: 'address/list',
          name: 'register-address-list',
          component: AddressListView
        },
          {
          path: 'address/:id',
          name: 'register-address-edit',
          component: AddressEditView
        }
      ]
    }
  ],
})

export default router
