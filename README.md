# 项目结构

<div align='center'><img src='https://s1.ax1x.com/2020/04/04/GdfxW4.png' height="300"></div>

# 初始化

npm run dev 打开

## 删除没用的部分

## 配置路由

初始化显示的是 App.vue，我们需要创建路由 router 或者在初始化的时候直接使用路由
在路由里面引入组件，及注册

```js
import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
  ],
});
```

# 创建两个组件

login、home

## 安装 ElementUI

1. 安装 elementUI
   `npm i element-ui -S`
2. 引入

# 拷贝 elementUI 的表单组件

1. el-row>el-col:span="8" 设置居中
2. 拷贝表单组件，修改验证规则

# 开始登陆

注意：

1. 表单中的参数名要和文档中的参数保持一致

- username&password

2. axios 的配置：

- 全局`Vue.prototype.$axios = axios`;，
- 公共`axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"`;

3. async 和 await 的使用

```
async function render(){
    let res=this.$axios.get('url',config);
}
```

>  <p align='center'>登陆成功后做什么？</p>

1. 添加 token
2. 显示登陆成功
3. 跳转

# 设置登陆页样式

> 在哪里引入 common.css？

- main.js 中

```js
// 引入自定义的全局公共样式css
import "./assets/css/common.css";
```

# home 页面

> <p align='center'>如何布局？</p>

- 头部 header/侧边 aside/容器 container 方案

```vue
<template lang="">
  <!-- 布局容器 -->
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
/* eslint-disable */
export default {};
</script>
<style lang="" scoped>
.el-container {
  height: 100%;
}
/* 头部 */
.el-header {
  background-color: #b3c1cd;
  padding: 0;
}
/* 侧栏 */
.el-aside {
  background-color: #545c64;
}
/* 右边容器 */
.el-main {
  background-color: #ccc;
}
</style>
```

# 登陆拦截

> <p align='center'>如何使用导航守卫？</p>

- 在 router.js 中配置前置导航守卫

```js
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
```

# 自动添加 token

> <p align='center'><b>如何实现每次请求后台自动的添加token</b></p>

```js
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
```

# 头部布局

注意：

1. 在 vue 中直接为 h1 设置 text-align:center 就可以实现居中（元素本身）
2. 为 a 添加点击事件，注意 prevent 是阻止默认事件的方法
3. 设置 col_l 的 height:60px;这样就可以设置图片垂直居中

```html
<el-header>
  <el-row>
    <el-col :span="8" class="col_l">
      <img src="../../assets/images/logo.png" alt height="50px" />
    </el-col>
    <el-col :span="8">
      <h1>电商管理系统</h1>
    </el-col>
    <el-col :span="8" class="col_r">
      恭喜发财，好运来
      <!-- 添加a的阻止事件 -->
      <a @click.prevent="logout">退出</a>
    </el-col>
  </el-row>
</el-header>
```

# 退出登陆

> <p align='center'>退出登陆需要做什么？</p>

1. 清除 token
2. 提示退出成功
3. 跳转到首页
   > 确认框

```js
methods: {
    // 在初始化代码中，确认框是.then 的方式，我们这里改造成promise的形式，简化请求逻辑
    // async --await
    // try{需要尝试的代码}---catch(error){如果出错的处理}
    async logout() {
      try {
        const p = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        // 1. 清除token
        localStorage.removeItem("token");
        //2. 提示退出成功
        this.$message({
          message: "退出成功",
          type: "success",
          duration: 800
        });
        // 3. 跳转到login页面
        this.$router.push("./login");
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消退出",
          duration:800
        });
      }
    }
  }
```

# 左侧栏

> <p align='center'><b>如何动态生成左侧栏？</b></p>

```vue
<!--
    el-menu:菜单组件
    el-submenu:菜单子组件（可展开）
    el-menu-item 菜单元素（最小单位）
    :default-active="$route.path"默认选中高亮的
    @open="handleOpen"
    @close="handleClose"
    开启路由：
      是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
    :router="true"
-->
<el-menu
  :router="true"
  :default-active="$route.path"
  active-text-color="#ffd04b"
  background-color="#545c64"
  class="el-menu-vertical-demo"
  text-color="#fff"
>
<!-- 动态生成左侧栏 -->
        <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id">{{item1.authName}}</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
</el-menu>
```

遗留问题：

1. route 和 router 的区别？
2. :绑定和不使用:的区别？
3. $的含义:比如$route.path

# 用户列表

## 静态布局

1. 拷贝 elementUI 中的面包屑、搜索框、表格
2. 修改数据和格式，配合先请求一下数据，根据返回的数据修改表格中的 name 值
   使用到了 elementUI 中的很多组件：
3. el-table
4. el-switch
5. el-breadcrumb
6. :gutter 用来使同一行的 col 产生间距
7. el-button
8. 请求数据的时候注意把 params 写在 config 对象中
9. 每一个 template 中只允许一个容器，即在里面写一个 div，删除 lang=''

## 动态渲染数据

> <p align='center'><b>如何把用户数据渲染到表格中去？</b></p>

- 请求回来的数据赋值给 usersData

# 分页

> <p align='center'><b>分页的使用？</b></p>

```html
<el-pagination
  :total="total"
  :page-size="2"
  :current-page="pagenum"
  background
  layout="prev, pager, next"
  @current-change="clickCurrentPage"
></el-pagination>
```

```js
// 点击分页事件
clickCurrentPage(curPage){
  console.log(curPage)
  // 当再次点击的时候，传入的参数pagenum应该是curPage，即分页的数字
  this.loadUsersData(curPage,this.queryText)
}
```

# 搜索

> <p align='center'><b>如何在查询的时候获取输入框的值？</b></p>

- 注意：vue 是数据绑定的，将输入框的值绑定到 queryText,实现实时更新

```html
<el-input
  class="input-with-select"
  placeholder="请输入内容"
  v-model="queryText"
></el-input>
```

```js
// 开始查询
startQuery(){
  console.log(this.queryText);
  // 开始查询
  this.loadUsersData(this.pagenum,this.queryText);
}
```

# lang

lang 可以指定使用 css/less/sass 去编译

# Promise

> <p align='center'><b>什么是promise?</b></p>

1. Promise 是 es6 提出的非常重要的语法
2. Promise 是一种‘处理异步’的解决方案，想同步编写代码的方式处理异步的一种解决方案

- 之前在编写代码存在的问题：
  \$.ajax({})请求得到的数据在进行处理的时候需要放在 success:function(info){}中进行处理,这样很多事件的添加需要使用事件委托
- 解决方式：

```js
Promise.then((res) => {
  // 第一次发送请求
})
  .then((res) => {
    // 第二次发送请求
  })
  .then((res) => {
    // 第三次发送请求
  });
```

## 面试题 1

> <p align='center'><b>如何理解Promise的执行顺序?</b></p>

- Promise 的重点就是同步的执行，因此，promise 中的 resolve 可以看做同步执行的宏任务

```js
console.log("log1"); //宏任务1

setTimeout(() => {
  console.log("timeout"); //下一次循环的宏任务
}, 0);

new Promise((resolve, reject) => {
  console.log("promise1"); //宏任务2
  resolve();
}).then((res) => {
  console.log("then1"); //微任务
});

new Promise((resolve, reject) => {
  console.log("promise2"); //宏任务2
  resolve();
}).then((res) => {
  console.log("then2"); //微任务
});

console.log("log2"); //宏任务3

//log1
//promise1
//promise2
//log2
//then1
//then2
//timeout

// 运行循环：
// 宏任务：script、timeout
// 微任务：promise

// 先执行宏任务，再执行微任务
//        宏任务      微任务
// 第一圈： script  promise(then)
// 第二圈：timeout
```

## 面试题 2--封装 promise

```js
function fetch(options){
  let p=new Promise((resolve,reject)=>{
    $.ajax({
      url:options.url,
      type:options.type||'GET',
      dataType:'json',
      data:options.data||{},
      success:resolve,
      error:reject
    })
  })
  return p
}
fetch({url:'....}).then(res=>{
  // ....
})
```

# 添加用户

```html
<!-- 添加用户对话框 -->
<el-dialog
  :visible.sync="dialogFormVisible"
  title="添加用户"
  @closed="dislogClosed"
>
  <el-form
    :model="addUserForm"
    :rules="rules"
    label-width="80px"
    ref="addUserForm"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addUserForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addUserForm.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addUserForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="addUserForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <div class="dialog-footer" slot="footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button @click="addUser" type="primary">确 定</el-button>
  </div>
</el-dialog>
```

```js
// 点击显示对话框
    showAddUserDialog() {
      this.dialogFormVisible=true;
    },
    // 添加用户
    async addUser(){
      let res=await this.$axios.post('users',this.addUserForm);
      // console.log(res);
      if(res.data.meta.status===201){
        //1. 关闭对话框
        this.dialogFormVisible=false;
        // 2. 显示添加成功
        this.$message({
          message:'添加成功',
          type:'success',
          duration:800
        })
        // 3. 重新刷新页面
        this.loadUsersData();

        // 4. 重置表单
        this.$refs.addUserForm.resetFields();
      }else{
        // 添加失败
      }
    },
    // 对话框关闭事件
    dislogClosed(){
      console.log('关闭了');
      this.$ref.addUserForm.resetFields();
    },
```

# 删除用户

```js
 // 删除用户
    async deleteUser(id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$axios.delete(`users/${id}`)
        if (res.data.meta.status === 200) {
          // 1. 刷新页面
          this.loadUsersData()
          // 2.提示
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 800
          })
        }
      } catch (error) {
        console.log('点击了取消')
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    }
```

# 修改状态

```js
// 状态改变
    async stateChange(row){
      // console.log(e);
      const{id,mg_state:mg_state}=row;
      let res=await this.$axios.put(`users/${id}/state/${mg_state}`,null);
      console.log(res);
      if(res.data.meta.status===200){
        // 1. 提示：修改成功
        this.$message({
          message: '修改状态成功',
          type: 'success',
          duration: 800,
        })
        // 2. 刷新当前页
        this.loadUsersData(this.pagenum);
      }
    }
```

# token 过期--响应拦截器

> <p align='center'><b>如何处理token过期的问题？</b></p>

```js
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.data.meta.status === 10010) {
      // 1. 跳转到登陆页
      this.$axios.push("/login");
    }
    // 2. 替换旧的token
    if (response.data.data.token) {
      localStorage.setItem("token", token);
    }
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
```

# 编辑用户

1. 弹出对话框
2. 展示已知信息
   注意：插槽的使用，数据的传输和数据的接受。当编辑数据的时候，进行提交，直接从当前 data 中获取即可

```html
<!-- 编辑用户对话框 -->
<el-dialog :visible.sync="dialogEditFormVisible" title="编辑用户">
  <el-form :model="editUserForm" label-width="80px">
    <el-form-item label="用户名">
      <el-tag>{{editUserForm.username}}</el-tag>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="editUserForm.email"></el-input>
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model="editUserForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <div class="dialog-footer" slot="footer">
    <el-button @click="dialogEditFormVisible = false">取 消</el-button>
    <el-button @click="editUser" type="primary">确 定</el-button>
  </div>
</el-dialog>
```

```js
// 编辑用户提交
// 显示编辑对话框
    showEditUserDialog(row){
      this.dialogEditFormVisible=true;
      // 接受传递过来的值，并赋值给data
      const{id,username,mobile,email}=row;
      this.editUserForm.username=username;
      this.editUserForm.mobile=mobile;
      this.editUserForm.email=email;
      this.editUserForm.id=id;
    },
    async editUser(){
      // 在提交的时候，编辑更新的数据已经同步到了data中，因此是从data中获取数据
      const{id,mobile,email}=this.editUserForm;
      let res=await this.$axios.put(`users/${id}`,{email,mobile})
      // 1. 关闭编辑对话框
      this.dialogEditFormVisible=false;
      if(res.data.meta.status===200){
        // 2. 重新刷新
        this.loadUsersData(this.pagenum);
        // 3. 显示编辑成功
        this.$message({
          message: '编辑成功',
          type: 'success',
          duration: 800
        })
      }
    }
```

# 权限列表

> <p align='center'><b>如何处理对部分数据（等级）进行特殊处理？</b></p>

- 在当前列中插入插槽，通过 slot-scope 获取数据，通过 if-else 进行判断，进行生成

```vue
<template>
  <div>
    <el-table :data="RightsData" style="width: 100%;">
      <el-table-column type="index" label="索引"> </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180"> </el-table-column>
      <el-table-column label="等级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      RightsData: [],
    };
  },
  created() {
    this.loadRights();
  },
  methods: {
    async loadRights() {
      let res = await this.$axios.get("rights/list");
      console.log(res);
      // 如果请求成功
      if (res.data.meta.status === 200) {
        this.RightsData = res.data.data;
      }
    },
  },
};
</script>
```

# 角色列表

1. 基本布局
2. 展示权限信息
3. 设置“分配权限”

## 展示权限信息

- 表格属性之`type如果设置了 expand 则显示为一个可展开的按钮`
- 查看返回的数据结构，遍历每一层的数据 item.children,绑定:key=item.id

```vue
<el-table-column type="expand" width="100">
        <!-- 展开后是一个表格 -->
        <template slot-scope="scope">
          <!-- 第一列 -->
          <el-row :key="item1.id" class="row1" v-for="item1 in scope.row.children">
            <el-col :span="4">
              <el-tag closable type="primary">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 第二大列 -->
            <el-col :span="20">
              <el-row :key="item2.id" v-for="item2 in item1.children" class="row2">
                <el-col :span="4">
                  <el-tag closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 第三大列 -->
                <el-col :span="20">
                  <el-tag
                    :key="item3.id"
                    closable
                    type="warning"
                    size='mini'
                    v-for="item3 in item2.children"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
</el-table-column>
```

## 设置“分配权限”

1. 点击分配权限，弹出对话框
2. 请求数据，并渲染
> <p align='center'><b>如何使用树型控件？</b></p>

```html
<!-- 分配权限对话框 -->
<el-dialog :visible.sync="dialogRightsVisible" title="收获地址" width="50%">
  <!-- 基础的树型控件 -->
  <!--
        :data="treeData"---赋值
        :default-expand-all="true"---默认展开
        :props="defaultProps"---设置自定义attribute
        ref="tree"---绑定DOM元素，可以通过this.$refs.tree调用方法
        node-key="id"----每个树节点作为唯一的标识的属性
        show-checkbox
       -->
  <el-tree
    :data="treeData"
    :default-expand-all="true"
    :props="defaultProps"
    node-key="id"
    ref="tree"
    show-checkbox
  ></el-tree>
  <span class="dialog-footer" slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button @click="assignRight" type="primary">确 定</el-button>
  </span>
</el-dialog>
```

```js
// 请求权限树型控件中的数据
    async loadtreeRights() {
      // 请求数据
      let res = await this.$axios.get('rights/tree')
      // console.log(res)
      // 如果获取成功
      if (res.data.meta.status === 200) {
        this.treeData = res.data.data
      }
    },
    // 显示对话框，分配角色权限
    showAssignRightsDialog(row) {
      // 1. 显示对话框
      this.dialogRightsVisible = true
      // 2- 获取父级id
      this.roleId = row.id
      // 3-获取最里面第三层的id
      // 3-1 声明一个空的数组存放id
      let keys = []
      // 3-2 获取row最里面角色拥有权限的id存储到keys中，然后设置对应的选中状态到树型控件
      row.children.forEach(item1 => {
        // console.log(item1.id)
        item1.children.forEach(item2 => {
          // console.log(item2.id)
          item2.children.forEach(item3 => {
            keys.push(item3.id)
          })
        })
      })
      // 4. 设置keys
      //原因异步DOM更新，打印有点早了
      // DOM更新完毕了，再获取
      // nextTick
      this.$nextTick(() => {
        // 向树型控件中传入当前角色拥有的权限id数组keys
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    // 分配权限
    async assignRight() {
      // 获取选中的权限
      let keys1 = this.$refs.tree.getCheckedKeys()
      let keys2 = this.$refs.tree.getHalfCheckedKeys()
      // 拼接两个数组
      let keys = keys1.concat(keys2)
      console.log(keys)
      // 更新到数据库
      let res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        // 1. 关闭对话框
        // console.log(123);
        this.dialogRightsVisible = false
        // 2. 提示消息
        this.$message({
          message: '关闭成功',
          type: 'success',
          duration: 800
        })
        //3. 刷新
        this.loadRoles()
      }
    }
```

# 分配角色

- 点击分配角色，显示当前用户名，然后把所有的角色列表显示在下拉框选项中，点击确定，提交，更新用户的角色数据
  <img src="https://s1.ax1x.com/2020/04/07/GgqLPf.png"/>

```html
<!-- 分配角色对话框 -->
<el-dialog :visible.sync="dialogAssignRoleFormVisible" title="分配角色">
  <el-form :model="assignRolesForm" label-width="80px">
    <el-form-item label="用户名">
      <el-tag>{{assignRolesForm.username}}</el-tag>
    </el-form-item>
    <el-form-item label="角色列表">
      <el-select placeholder="请选择" v-model="assignRolesForm.rid">
        <el-option
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
          v-for="item in roleData"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div class="dialog-footer" slot="footer">
    <el-button @click="dialogEditFormVisible = false">取 消</el-button>
    <el-button @click="assignRole" type="primary">确 定</el-button>
  </div>
</el-dialog>
```

```js
// 数据部分
// 分配角色对话框
      dialogAssignRoleFormVisible: false,
      //角色列表数据
      roleData: [],
      // 分配角色数据
      assignRolesForm: {
        username: '',
        id: '',
        rid: ''
      },
      value: ''
// methods部分
// 获取所有角色列表
    async loadRoles() {
      let res = await this.$axios.get('roles')
      this.roleData = res.data.data
      console.log(this.roleData)
    },
    // 显示分配角色
    async showAssignRoleDialog(row) {
      this.dialogAssignRoleFormVisible = true
      console.log(row)
      const { username, id } = row
      // 分配用户角色需要id（用户id）和rid（角色id）,rid需要通过用户id去查询得到
      // 根据id查询用户的角色
      let res = await this.$axios.get(`users/${id}`)
      console.log(res)
      // 获取返回的数据中的rid
      const { rid } = res.data.data
      // 赋值给data中的assignRolesForm
      this.assignRolesForm.id = id
      this.assignRolesForm.username = username
      // 有的用户还没有分配角色，因此需要赋值为空
      this.assignRolesForm.rid = rid == 0 ? '' : rid
    },
    // 请求角色列表数据
    async assignRole() {
      let { id, rid } = this.assignRolesForm
      let res = await this.$axios.put(`users/${id}/role`, { rid })
      // console.log(res)
      if (res.data.meta.status === 200) {
        // 1.关闭对话框
        this.dialogAssignRoleFormVisible = false
        // 2. 提示
        this.$message({
          message: '分配角色成功',
          type: 'success',
          duration: 800
        })
        //3. 刷新
        this.loadUsersData(this.pagenum)
      }
    }
```

# 动态获取菜单

# 刷新保留页数
1. 点击分页向路由中传入当前页
2. 路由中使用参数接收
3. 在created中获取路由中传递过来的参数
4. 传入loadUsersData
5. 在loadUsersData中将返回的pagenum赋值给data中的pagenum，因为分页组件:current-page与pagenum绑定

# 商品分类
- 树型控件的使用
> <p align='center'><b>如何把表格中的expand和树型控件结合使用？</b></p>
1. 第一列展开是自定义列，template传入scope
2. 要遍历生成树型控件，:data=scope.row.children（数组）

- 级联选择器的使用
> 如何配置级联选择器绑定的数据?
1. :props="defaultProps"--规定了级联选择器显示的label名称和label对应的数据value
2. :options="options"--options为级联选择器传入了需要显示的数组
3. v-model="addCateForm.cat_pid_arr"--实时把选择的分类更新到data中

注：
首先要分析需要上传的数据类型，比如在这个案例中，需要上传cat_name,cat_pid,cat_level，
这三者的关系是cat_name来自输入框，cat_pid是级联选择器选中的cat_pid_arr数组的最后一个id，因此在上传的时候需要取出来
cat_level是分类级别，一级：0，二级：1，三级：2

```vue
<template>
  <div>
    <el-button @click="showAddCatDialog" plain type="success"
      >添加分类</el-button
    >
    <el-table :data="categoriesForm" style="width: 100%;">
      <el-table-column type="expand" width="100">
        <template slot-scope="scope">
          <!--
        :data="treeData"---赋值
        :default-expand-all="true"---默认展开
        :props="defaultProps"---设置自定义attribute
        ref="tree"---绑定DOM元素，可以通过this.$refs.tree调用方法
        node-key="id"----每个树节点作为唯一的标识的属性
        show-checkbox
          -->
          <el-tree
            :data="scope.row.children"
            :default-expand-all="false"
            :props="defaultProps"
            node-key="cat_id"
          ></el-tree>
        </template>
      </el-table-column>
      <el-table-column
        label="分类名称"
        prop="cat_name"
        width="180"
      ></el-table-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column label="层级" prop="cat_level">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level == 0">一级</span>
          <span v-else-if="scope.row.cat_level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加分类对话框 -->
    <el-dialog :visible.sync="addCatdialogVisible" title="添加分类" width="40%">
      <el-form :model="addCateForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            :options="options"
            :props="defaultsProps"
            v-model="addCateForm.cat_pid_arr"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addCatdialogVisible = false">取 消</el-button>
        <el-button @click="addCat" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      // 树型控件的分类数据
      categoriesForm: [],
      // 树型控件配置自定义的Props的attribute
      defaultProps: {
        // children负责显示结构
        children: "children",
        // label负责显示标题
        label: "cat_name",
      },
      // 添加分类对话框数据
      addCatdialogVisible: false,
      // 添加分类数据
      addCateForm: {
        cat_name: [],
        cat_pid_arr: "",
      },
      // 级联选择器配置
      defaultsProps: {
        // childre负责显示结构
        // label负责显示
        // value负责搜集id
        value: "cat_id",
        label: "cat_name",
      },
      // 级联选择器数据
      options: [],
    };
  },
  created() {
    this.loadCategories();
    this.loadCategories2();
  },
  methods: {
    // 获取三级分类
    async loadCategories() {
      let res = await this.$axios.get("categories", {
        params: {
          type: 3,
        },
      });
      this.categoriesForm = res.data.data;
    },
    // 获取二级分类
    async loadCategories2() {
      let res = await this.$axios.get("categories", {
        params: {
          type: 2,
        },
      });
      console.log(res);
      this.options = res.data.data;
    },
    showAddCatDialog() {
      // console.log(1)
      this.addCatdialogVisible = true;
    },
    async addCat() {
      // 获取即将上传的数据
      const { cat_name, cat_pid_arr } = this.addCateForm;
      let res = await this.$axios.post("categories", {
        cat_pid: cat_pid_arr[cat_pid_arr.length - 1], //父id数组的最后一个id值
        cat_name,
        cat_level: cat_pid_arr.length,
      });
      console.log(res);
    },
  },
};
</script>
<style lang=""></style>
```
# 添加商品
> <p align='center'><b>如何完成标签页和步骤条的关联？</b></p>
- 步骤条的跳转是根据:active='activeIndex'
- 标签页有三个，每个里面有下一步的按钮，为每个按钮绑定一个next()事件，传入参数1,'one'
- 标签页的跳转是根据v-model='activeName'所以在next里面传入的参数实际上是activeIndex和activeName
> <p align='center'><b>如何使用上传图片，获取图片存储地址?</b></p>
```vue
<template>
  <div>
    <el-steps :active="activeIndex" finish-status="success">
      <el-step title="第一步" description="基本信息" ></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <el-tabs @tab-click="clickTab" tab-position="left" v-model="activeName">
      <el-tab-pane label="基本信息" name="one">
        <el-form :model="addGoodsForm" label-width="80px" ref='form'>
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              :options="options"
              :props="defaultsProps"
              clearable
              v-model="addGoodsForm.goods_cat"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="是否促销">
            <!-- label负责收集数据 -->
            <el-radio :label="1" v-model="addGoodsForm.radio">是</el-radio>
            <el-radio :label="2" v-model="addGoodsForm.radio">否</el-radio>
          </el-form-item>
          <el-button @click="next(2,'two')" style="margin-top: 12px;" type="primary">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="two">
        <el-upload
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          // 上传成功后的回调函数
          :on-success="uploadImgSuccess"
          // 直接在action中写保存图片的服务器地址
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" alt width="100%" />
        </el-dialog>
        <el-button @click="next(3,'three')" style="margin-top: 12px;" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="three">
        <!-- Two-way Data-Binding -->
        <!-- @blur="onEditorBlur($event)" 失去焦点
          @focus="onEditorFocus($event)" 聚焦
        @ready="onEditorReady($event)" 渲染之后-->
        <quill-editor :options="editorOption" v-model="addGoodsForm.goods_introduce" />
        <el-button @click="postGoods" style="margin-top: 12px;" type="primary">提交</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      activeIndex: 1,
      activeName: 'one',
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        radio: '',
        pics: [],
        goods_introduce: ''
      },
      // 级联选择器需要显示的options
      options: [],
      defaultsProps: {
        value: 'cat_id',
        label: 'cat_name'
      },
      // 图片数据
      dialogImageUrl: '',
      dialogVisible: false,
      // 上传图片请求头
      headers: {
        Authorization: localStorage.getItem('token')
      },
      // 富文本编辑器
      editorOption: {
        placeholder: '请输入文本'
      }
    }
  },
  created() {
    // 获取分类
    this.loadCate()
  },
  methods: {
    // 点击Tabs标签页的事件
    clickTab(e) {
      // console.log(e);
      // e.index刚好是对应的顺序
      this.activeIndex = +e.index + 1
    },
    // 点击下一步
    next(index, name) {
      this.activeIndex = index
      this.activeName = name
    },
    // 上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 请求分类
    async loadCate() {
      let res = await this.$axios.get('categories', {
        params: {
          type: 3
        }
      })
      console.log(res)
      this.options = res.data.data
    },
    // 图片上传成功
    uploadImgSuccess(res) {
      console.log(res)
      // 将传回的地址追加到pics数组中
      this.addGoodsForm.pics.push({ pic: res.data.tmp_path })
    },
    // 提交商品
    async postGoods() {
      // 获取需要提交的数据
      const {
        goods_name,
        goods_price,
        goods_weight,
        goods_number,
        goods_cat,
        pics,
        goods_introduce,
        radio
      } = this.addGoodsForm
      let res = await this.$axios.post('goods', {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_cat: goods_cat.join(','),
        goods_introduce,
        pics,
        radio
      })
      console.log(res)
      // 如果提交成功，就跳转回商品页，显示添加成功
      if(res.data.meta.status===201){
        // 1. 弹出对话框
        this.$message({
          message:'添加商品成功',
          type:'success',
          duration:800
        })
        // 2. 跳转
        this.$router.push('/goods');
      }
    }
  }
}
</script>
<style lang="" scope>
</style>
```
# 打包
npm run build

> http://localhost:8081/dist#/login

# git
git remote add origin git@github.com:johoo123/dianshangguanlixitong.git
git push -u origin master
