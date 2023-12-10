import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    props: {
      options: { home: true }
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/HomeView.vue'),
    props: {
      options: { search: true }
    }
  },
  {
    path: '/queue',
    name: 'queue',
    component: () => import('../views/HomeView.vue'),
    props: {
      options: { queue: true }
    }
  },
  {
    path: '/players',
    name: 'players',
    component: () => import('../views/HomeView.vue'),
    props: {
      options: { players: true }
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
