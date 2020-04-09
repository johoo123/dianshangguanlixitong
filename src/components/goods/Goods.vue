<template lang="">
  <div>
    <el-button type='success'  plain @click='go2GoodsAdd'>添加商品</el-button>
    <el-table :data="GoodsData" style="width: 100%;">
      <el-table-column type="index" label="索引"> </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"> </el-table-column>
      <el-table-column prop="goods_price" label="商品价值" width="180"> </el-table-column>
      <el-table-column prop="goods_number" label="商品数量"> </el-table-column>
      <el-table-column prop="add_time" label="创建时间"> </el-table-column>
      <el-table-column prop="address" label="操作"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      GoodsData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  created() {
    // 获取数据
    this.loadGoodsData()
  },
  methods: {
    // 请求商品列表数据
    async loadGoodsData() {
      let res = await this.$axios.get('goods', {
        params: {
          pagenum:1,
          pagesize:4,
          query: ''
        }
      })
      console.log(res)
      this.GoodsData=res.data.data.goods;
    },
    go2GoodsAdd() {
      this.$router.push('/goodsAdd');
    }
  }
}
</script>
<style lang=""></style>
