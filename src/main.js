// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from "vue";
import App from "./App";
import router from "./router";
// 引入公共样式
import  './assets/css/common.css';
/* eslint-disable */
// 引入elementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 注册elementUI
Vue.use(ElementUI);

// 引入富文本编辑器
// 注意：webpack3.0以上需要进行配置.postcssrc.js/postcss.config.js
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)


// 导入axios
import axios from "axios";

// 配置公共地址
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";

// 配置全局axios
Vue.prototype.$axios = axios;

// 配置请求的时候携带的token
// 使用请求拦截器，每次发送请求的时候都要经过这个拦截器，我们就不要每次写代码的时候自己写token了，让拦截器去帮我们添加token
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = localStorage.getItem("token");
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 添加响应拦截器
// axios.interceptors.response.use(
//   function (response) {
//     // 对响应数据做点什么
//     if(response.data.meta.status===10010){
//       // 1. 跳转到登陆页
//       this.$axios.push('/login');
//     }
//     // 2. 替换旧的token
//     if(response.data.data.token){
//       localStorage.setItem("token",token);
//     }
//     return response;
//   },
//   function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   }
// );



Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
});
