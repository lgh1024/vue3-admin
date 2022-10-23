import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/home/Home.vue'),
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: () => import('../views/Welcome.vue')},
      {path: '/user', component: () => import('../views/user/User.vue')},
      {path: '/power', component: () => import('../views/power/Power.vue')},
      {path: '/goods', component: () => import('../views/goods/List.vue')},
      {path: '/order', component: () => import('../views/order/Order.vue')},
      {path: '/reports', component: () => import('../views/reports/Reports.vue')},
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to: any) => {
  if (to.path !== '/login') {
    const token = sessionStorage.getItem('token')
    if (!token) {
      return '/login'
    }
  }
})
export default router
