import { createRouter, createWebHistory } from 'vue-router'
import RootView from '../views/RootView.vue'
import authMiddleware from './auth'
import * as Routes from './routeNames'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: Routes.Root,
      component: RootView,
    },
    {
      path: '/login',
      name: Routes.Login,
      component: () => import('../views/LoginView.vue'),
    },

    {
      path: '/home',
      name: Routes.Home,
      component: () => import('../views/HomeView.vue'),
      meta: { protected: true },
    },

    {
      path: '/:screenName',
      name: Routes.Profile,
      component: () => import('../views/ProfileView.vue'),
      meta: { protected: true },
    },
    {
      path: '/:screenName/followers',
      name: Routes.Followers,
      component: () => import('../views/FollowersView.vue'),
      props: true,
      meta: { protected: true },
    },
    {
      path: '/:screenName/following',
      name: Routes.Following,
      component: () => import('../views/FollowingView.vue'),
      props: true,
      meta: { protected: true },
    },

    {
      path: '/search',
      name: Routes.Search,
      component: () => import('../views/SearchView.vue'),
      meta: { protected: true },
    },

    {
      path: '/hashtag',
      name: Routes.Hashtag,
      component: () => import('../views/HashtagView.vue'),
      meta: { protected: true },
    },

    {
      path: '/notifications',
      name: Routes.Notifications,
      component: () => import('../views/NotificationsView.vue'),
      meta: { protected: true },
    },
  ],
})

router.beforeEach(authMiddleware)

export default router
