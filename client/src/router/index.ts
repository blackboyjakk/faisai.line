import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component:() =>  import('../components/home.page.vue')
    },
    {
      path: '/config',
      name: 'config',
      component:() =>  import('@/components/config/user.page.vue'),
    },
    {
      path: '/workflows',
      name: 'workflows',
      component: () => import("../components/config/workflow.page.vue"),
    },
    {
      path: '/users',
      name: 'users',
      component:() =>  import('@/components/config/user.page.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component:() =>  import( '../components/auth/auth.page.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component:() =>  import('../components/auth/register.page.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component:() =>  import('../components/auth/login.page.vue'),
    },
    {
      path: '/document/pr/:prNo/:itemNo',
      name: 'document-pr',
      component:() =>  import('../components/document/pr-detail.page.vue'),
    },
    {
      path: '/document/po/:poNo',
      name: 'document-po',
      component:() =>  import('../components/document/po-detail.page.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component:() =>  '404',
    }
  ]
})

export default router
