<template lang="">
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
      RightsData: [
        {
          authName: "商品管理",
          path: "goods",
          level: "一级",
        },
      ],
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
<style lang="" scoped></style>
