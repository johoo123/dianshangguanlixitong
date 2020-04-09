<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框部分 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- 输入框 -->
        <el-input class="input-with-select" placeholder="请输入内容" v-model="queryText">
          <!-- slot="append"（后面）prepend(前面)决定搜索按钮位置 -->
          <el-button @click="startQuery" icon="el-icon-search" slot="append"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button @click="showAddUserDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格部分 -->
    <el-table :data="usersData" style="width: 100%">
      <el-table-column label="姓名" prop="username" width="180"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="180"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch @change="stateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showEditUserDialog(scope.row)"
            icon="el-icon-edit"
            plain
            size="mini"
            type="primary"
          ></el-button>
          <el-button
            @click="deleteUser(scope.row.id)"
            circle
            icon="el-icon-delete"
            size="mini"
            type="danger"
          ></el-button>
          <el-button
            @click="showAssignRoleDialog(scope.row)"
            icon="el-icon-check"
            plain
            size="mini"
            type="success"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="pagenum"
      :page-size="2"
      :total="total"
      @current-change="clickCurrentPage"
      background
      layout="prev, pager, next"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog :visible.sync="dialogAddFormVisible" @closed="dislogClosed" title="添加用户">
      <el-form :model="addUserForm" :rules="rules" label-width="80px" ref="addUserForm">
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
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      // 用户数据
      usersData: [
        {
          username: '王小虎',
          email: '12343242#qq.com',
          mobile: '151812312',
          mg_state: true
        },
        {
          username: '刘小虎',
          email: '12343242#qq.com',
          mobile: '151812312',
          mg_state: true
        }
      ],
      // 总数
      total: 0,
      // 页码数默认为1
      pagenum: 1,
      // 查询内容
      queryText: '',
      //对话框可视
      dialogAddFormVisible: false,
      // 对话框数据
      addUserForm: {
        username: '',
        email: '',
        mobile: '',
        password: ''
      },
      formLabelWidth: '120px',
      // 校验规则
      rules: {
        // 用户名
        username: [
          // 判断是否有输入内容
          { required: true, message: '请输入内容', trigger: 'blur' },
          // 判断格式是否正确
          { min: 3, max: 15, message: '请输入的内容3-5之间的', trigger: 'blur' }
        ],
        password: [
          // 判断是否有输入内容
          { required: true, message: '请输入密码', trigger: 'blur' },
          // 判断格式是否正确
          {
            min: 5,
            max: 10,
            message: '请输入的内容5-10之间的',
            trigger: 'blur'
          }
        ],
        // 邮箱：
        email: [
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '格式不正确',
            trigger: 'blur'
          }
        ],
        // 手机
        mobile: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '格式不正确',
            trigger: 'blur'
          }
        ]
      },
      // 编辑用户数据
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 编辑用户对话框可视
      dialogEditFormVisible: false,
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
    }
  },
  created() {
    // 获取地址栏中的page
    const page = this.$route.params.page
    console.log(page)
    // 获取用户数据
    this.loadUsersData(page)
    // 获取角色列表
    this.loadRoles()
  },
  methods: {
    // 请求用户数据事件
    async loadUsersData(pagenum = 1, query = '') {
      var config = {
        // 注意：这里的params必须写到config中
        params: {
          query,
          pagenum,
          pagesize: 2
        }
      }
      let res = await this.$axios.get('users', config)
      console.log(res)
      // 把请求回来的数据赋值给usersData
      this.usersData = res.data.data.users
      this.total = res.data.data.total
      this.pagenum = res.data.data.pagenum
    },
    // 点击分页事件
    clickCurrentPage(curPage) {
      console.log(curPage)
      // 当再次点击的时候，传入的参数pagenum应该是curPage，即分页的数字
      this.loadUsersData(curPage, this.queryText)
      // 向地址中添加当前页
      this.$router.push('/users/' + curPage)
    },
    // 开始查询
    startQuery() {
      console.log(this.queryText)
      // 开始查询
      this.loadUsersData(this.pagenum, this.queryText)
    },
    // 点击显示对话框
    showAddUserDialog() {
      this.dialogAddFormVisible = true
    },
    // 添加用户
    async addUser() {
      let res = await this.$axios.post('users', this.addUserForm)
      // console.log(res);
      if (res.data.meta.status === 201) {
        //1. 关闭对话框
        this.dialogAddFormVisible = false
        // 2. 显示添加成功
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 800
        })
        // 3. 重新刷新页面
        this.loadUsersData()

        // 4. 重置表单
        this.$refs.addUserForm.resetFields()
      } else {
        // 添加失败
      }
    },
    // 添加用户对话框关闭事件
    dislogClosed() {
      console.log('关闭了')
      this.$ref.addUserForm.resetFields()
    },
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
    },
    // 状态改变
    async stateChange(row) {
      // console.log(e);
      const { id, mg_state: mg_state } = row
      let res = await this.$axios.put(`users/${id}/state/${mg_state}`, null)
      console.log(res)
      if (res.data.meta.status === 200) {
        // 1. 提示：修改成功
        this.$message({
          message: '修改状态成功',
          type: 'success',
          duration: 800
        })
        // 2. 刷新当前页
        this.loadUsersData(this.pagenum)
      }
    },
    // 显示编辑对话框
    showEditUserDialog(row) {
      this.dialogEditFormVisible = true
      // 接受传递过来的值，并赋值给data
      const { id, username, mobile, email } = row
      this.editUserForm.username = username
      this.editUserForm.mobile = mobile
      this.editUserForm.email = email
      this.editUserForm.id = id
    },
    // 编辑用户提交
    async editUser() {
      // 在提交的时候，编辑更新的数据已经同步到了data中，因此是从data中获取数据
      const { id, mobile, email } = this.editUserForm
      let res = await this.$axios.put(`users/${id}`, { email, mobile })
      // 1. 关闭编辑对话框
      this.dialogEditFormVisible = false
      if (res.data.meta.status === 200) {
        // 2. 重新刷新
        this.loadUsersData(this.pagenum)
        // 3. 显示编辑成功
        this.$message({
          message: '编辑成功',
          type: 'success',
          duration: 800
        })
      }
    },
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
  }
}
</script>
<style lang="" scoped>
.el-breadcrumb {
  background-color: #eaeef1;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
}
</style>
