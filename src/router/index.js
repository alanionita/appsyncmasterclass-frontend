import { createRouter, createWebHistory } from 'vue-router'
import RootView from '../views/RootView.vue'
import authMiddleware from './auth'
import { ROUTE_NAMES } from '@/utils/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.Root,
      component: RootView,
    },
    {
      path: '/login',
      name: ROUTE_NAMES.Login,
      component: () => import('../views/LoginView.vue'),
    },

    {
      path: '/home',
      name: ROUTE_NAMES.Home,
      component: () => import('../views/HomeView.vue'),
      meta: { protected: true },
    },

    {
      path: '/:screenName',
      name: ROUTE_NAMES.Profile,
      component: () => import('../views/ProfileView.vue'),
      meta: { protected: true },
    },
    {
      path: '/:screenName/followers',
      name: ROUTE_NAMES.Followers,
      component: () => import('../views/FollowersView.vue'),
      props: true,
      meta: { protected: true },
    },
    {
      path: '/:screenName/following',
      name: ROUTE_NAMES.Following,
      component: () => import('../views/FollowingView.vue'),
      props: true,
      meta: { protected: true },
    },

    {
      path: '/search',
      name: ROUTE_NAMES.Search,
      component: () => import('../views/SearchView.vue'),
      meta: { protected: true },
    },

    {
      path: '/hashtag',
      name: ROUTE_NAMES.Hashtag,
      component: () => import('../views/HashtagView.vue'),
      meta: { protected: true },
    },

    {
      path: '/notifications',
      name: ROUTE_NAMES.Notifications,
      component: () => import('../views/NotificationsView.vue'),
      meta: { protected: true },
    },
  ],
})

router.beforeEach(authMiddleware)

export default router
