import { createRouter, createWebHistory } from 'vue-router'
import RootView from '../views/RootView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: RootView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },

    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { protected: true}
    },
  ],
})

export default router
