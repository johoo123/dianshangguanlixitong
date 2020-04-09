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
      categoriesForm: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
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
