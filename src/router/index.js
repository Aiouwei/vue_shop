import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../components/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import(/* webpackChunkName: "welcome" */ '../components/Welcome.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName: "users" */ '../components/user/Users.vue')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import(/* webpackChunkName: "rights" */ '../components/power/Rights.vue')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import(/* webpackChunkName: "roles" */ '../components/power/Roles.vue')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import(/* webpackChunkName: "categories" */ '../components/goods/Cate.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//  挂在路由导航守卫
/** 路由导航守卫
 * @param to 将要访问的地址
 * @param from 代表从哪个路径跳转而来
 * @param next 一个函数，代表放行
 *  next() 表示放行  next('/login')表示强制跳转
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!window.sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
