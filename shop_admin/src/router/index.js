import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import users from '@/components/user.vue'
import rights from '@/components/rights.vue'
import roles from '@/components/roles.vue'
import categories from '@/components/categories.vue'
import goods from '@/components/goods.vue'
import goodsAdd from '@/components/Add.vue'


//将axios绑定在vue上，在下一次想要使用axios的时候就直接this.axios
import axios from 'axios'
Vue.prototype.axios = axios

//axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//axios.defaults.headers.common['Authorization'] = localStorage.getItem('token1')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: users
        },
        {
          path:'/rights',
          name:'rights',
          component: rights
        },
        {
          path:'/roles',
          name:'roles',
          component: roles
        },
        {
          path:'/categories',
          name:'categories',
          component: categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: goodsAdd
        },
      ]
    },
    
  ]
})
router.beforeEach((to,from,next)=>{
  //如果有token且进入的页面的是login页面的时候
   var token = localStorage.getItem('token1')
   if(token || to.path == '/login'){
      next()
   }else {
      next('login')
   }
 
})

//请求拦截器为每一次请求添加相同的数据
axios.interceptors.request.use(
  function (config){
     config.baseURL= 'http://localhost:8888/api/private/v1/'
     config.headers.Authorization = localStorage.getItem('token1')
     return config
},
  function(error) {
    return Promise.reject(error)
     
  }
)
export default router