<template>
  <div>
    <el-table :data="RolesDataForm" style="width: 100%;">
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
              <el-row :key="item2.id" class="row2" v-for="item2 in item1.children">
                <el-col :span="4">
                  <el-tag closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 第三大列 -->
                <el-col :span="20">
                  <el-tag
                    :key="item3.id"
                    closable
                    size="mini"
                    type="warning"
                    v-for="item3 in item2.children"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="180"></el-table-column>
      <el-table-column label="描述" prop="roleDesc" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" plain size="mini" type="primary"></el-button>
          <el-button icon="el-icon-delete" plain size="mini" type="danger"></el-button>
          <el-button
            @click="showAssignRightsDialog(scope.row)"
            icon="el-icon-check"
            plain
            size="mini"
            type="success"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      RolesDataForm: [],
      dialogRightsVisible: false,
      treeData: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        // children负责显示结构
        children: 'children',
        // label负责显示标题
        label: 'authName'
      },
      // 角色id
      roleId: ''
    }
  },
  created() {
    // 加载角色数据
    this.loadRoles()
    // 获取权限信息
    this.loadtreeRights()
  },
  methods: {
    // 请求角色信息
    async loadRoles() {
      let res = await this.$axios.get('roles')
      console.log(res)
      this.RolesDataForm = res.data.data
    },
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
  }
}
</script>
<style lang="less" scoped>
.row1 {
  border-bottom: 1px dashed #ccc;
  margin-top: 10px;
  &:last-child {
    border: none;
  }
}
.row2 {
  margin-bottom: 10px;
}
.tag {
  margin: 0 30px;
}
</style>
