import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Manage from '@/views/ManageView.vue'
import useUserStore from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/manage-music',
    name: 'Manage',
    component: Manage,
    meta: { requiresAuth: true }
  },
  {
    path: '/manage',
    redirect: '/manage-music'
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'Home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  const userStore = useUserStore()

  if (userStore.userLoggedIn) {
    next()
    return
  } else {
    next({ name: 'Home' })
  }
})

export default router
