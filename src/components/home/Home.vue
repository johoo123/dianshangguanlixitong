<template>
  <!-- 布局容器 -->
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="8" class="col_l">
          <img alt height="50px" src="../../assets/images/logo.png" />
        </el-col>
        <el-col :span="8">
          <h1>电商管理系统</h1>
        </el-col>
        <el-col :span="8" class="col_r">
          恭喜发财，好运来!
          <!-- 添加a的阻止事件 -->
          <a @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
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
      </el-aside>
      <el-main>
        <!-- 子路由的出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      menus:[]
    }
  },
  created(){
    this.getMenus();
  },
  methods: {
    // 退出功能
    async logout() {
      try {
        const p = await this.$confirm(
          '此操作将永久删除该文件, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 1. 清除token
        localStorage.removeItem('token')
        //2. 提示退出成功
        this.$message({
          message: '退出成功',
          type: 'success',
          duration: 800
        })
        // 3. 跳转到login页面
        this.$router.push('./login')
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消退出',
          duration: 800
        })
      }

      // .then(() => {
      //   this.$message({
      //     type: "success",
      //     message: "退出成功!"
      //   });
      //   // 清除token
      //   localStorage.removeItem('token');
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消退出"
      //   });
      // });

    },
    //动态生成左侧栏
    async getMenus(){
      let res=await this.$axios.get('menus');
      // console.log(res);
      this.menus=res.data.data;
      console.log(this.menus);
    }
  }
}
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
.col_l {
  padding-left: 60px;
  padding-top: 5px;
  height: 60px;
}
.col_l img {
  line-height: 60px;
}
h1 {
  color: #fff;
  line-height: 60px;
  font-size: 28px;
  text-align: center;
}
.col_r {
  text-align: center;
  line-height: 60px;
  padding-right: 60px;
}
.col_r a {
  color: green;
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
