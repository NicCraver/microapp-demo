import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import BasicLayout from '../layouts/BasicLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'
import Home from '../views/Home.vue'
import store from '../store'

// only githubpages preview site used, if use template please remove this check
// and use `createWebHistory` is recommend
const hasGithubPages = false

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/login.vue'),
    },
    {
      path: '/app-manageModule/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/manageModule.vue'),
    },
    {
      path: '/app-manageModule2/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/manageModule2.vue'),
    },
    {
      path: '/welcome',
      name: 'welcome',
      meta: { title: '欢迎', icon: 'icon-icon-test' },
      component: () => import('../views/Page1.vue'),
    },
    {
      path: '/admins',
      name: 'admins',
      meta: { title: '管理页', icon: 'icon-tuijian', flat: true },
      component: BlankLayout,
      redirect: () => ({ name: 'page1' }),
      children: [
        {
          path: 'page-1',
          name: 'page1',
          meta: { title: '一级页面' },
          component: () => import('../views/admins/PageInfo.vue'),
        },
        {
          path: 'page-2',
          name: 'page2',
          meta: { title: '二级页面' },
          component: () => import('../views/admins/PageTypography.vue'),
        },
        {
          path: 'page-3',
          name: 'page3',
          meta: { title: '3级页面' },
          component: BlankLayout,
          redirect: () => ({ name: 'page3-1' }),
          children: [
            {
              path: 'page3-1',
              name: 'page3-1',
              meta: { title: '3-1级页面' },
              component: () => import('../views/admins/PageInfo.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/version',
      name: 'version',
      meta: { title: 'Version', icon: 'icon-antdesign' },
      component: () => import('../views/Detail.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const hasToken = sessionStorage.getItem('token')
  // requireAuth: true 表示需要登录
  if (to.meta.requireAuth) {
    if (hasToken) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
  if (to.fullPath === '/login') {
    if (hasToken) {
      next({
        path: from.fullPath,
      })
    } else {
      next()
    }
  }
})
