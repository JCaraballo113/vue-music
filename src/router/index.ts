import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Manage from '@/views/ManageView.vue'
import useUserStore from '@/stores/user'
import supabase from '@/includes/supabase'

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

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  const session = await supabase.auth.getSession()

  if (session) {
    next()
    return
  } else {
    next({ name: 'Home' })
  }
})

export default router
