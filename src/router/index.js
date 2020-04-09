/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";


//引入组件
import Home from "@/components/home/Home";
import Login from "@/components/login/Login";
import Users from "@/components/users/users";
import Roles from "@/components/roles/roles";
import Rights from "@/components/rights/rights";
import Goods from "@/components/goods/Goods";
import Categories from "@/components/categories/Categories";
import GoodsAdd from "@/components/goods/GoodsAdd";

// 在模块化工作中注册
Vue.use(Router);

// 实例化Router
const router = new Router({
  routes: [
    // 重定向
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: Login,

    },
    {
      path: "/home",
      name: "Home",
      component: Home,
      children:[
        {path:'/users/:page?',name:'users',component:Users},
        {path:'/roles',name:'roles',component:Roles},
        {path:'/rights',name:'rights',component:Rights},
        {path:'/goods',name:'goods',component:Goods},
        {path:'/goodsAdd',name:'goodsAdd',component:GoodsAdd},
        {path:'/categories',name:'categories',component:Categories},
      ]
    },
  ],
});
// 前置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    next();
  } else {
    const token = localStorage.getItem("token");
    token ? next() : next("/login");
  }
});
export default router;
