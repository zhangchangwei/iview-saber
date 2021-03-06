import Vue from 'vue'
import VueRouter from 'vue-router'
// import routes from './routers'

Vue.use(VueRouter)
const router = new VueRouter({
  routes:[
    {
      path:'/login',
      component: () => import('@/views/user/login.vue'),
      meta:{
        title: '登录'
      }
    },
    {
      path:'/',
      component: () => import('@/views/main.vue'),
      children:[
        {
          path:'',
          component: () => import('@/views/home.vue'),
          meta:{
            title: 'Dasnboard',
            order:'0-1',
            level:1
          }
        },
        {
          path:'userList',
          component: () => import('@/views/user/userList.vue'),
          meta:{
            title: '用户列表',
            order:'1-1'
          }
        },
        {
          path:'showList',
          component: () => import('@/views/show/showList.vue'),
          meta:{
            title: '机器列表',
            order:'2-1'
          }
        },
        {
          path:'showListretail',
          component: () => import('@/views/show/showListretail.vue'),
          meta:{
            title: '机器详情',
            order:'2-2'
          }
        },
      ]
    },
    {
      path:'/data',
      component: () => import('@/views/data.vue'),
      meta:{
        title: '大屏数据'
      }
    },
  ],
  mode: 'history'
})


export default router

import ViewUI from 'view-design';
import util from '@/util';
import config from '@/config'
Vue.use(ViewUI);
ViewUI.LoadingBar.config({
  color: '#5cb85c',
  failedColor: '#f0ad4e',
  height: 5
})

//路由前置首卫
router.beforeEach((to, from, next) => {
  if(to.path !== "/login") {
    if(!util.storage.get(config.KEY.CACHE_LOGIN_USER_NAME) && !util.storage.get(config.KEY.CACHE_LOGIN_PASS_PWD)) {
      return next("/login")
    }
  }
  ViewUI.LoadingBar.start();
  if(to.meta && to.meta.title) document.title ="SaberInoryKiss" + to.meta.title
  next()
})

//路由后置首卫
router.afterEach(route => {
  ViewUI.LoadingBar.finish();
})